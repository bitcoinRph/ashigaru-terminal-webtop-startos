# taken from https://github.com/linuxserver/docker-baseimage-kasmvnc/blob/debianbookworm/Dockerfile
# modified to apply 'novnc.patch' (fixing a disconnect/reconnect issue)
FROM node:12-buster AS wwwstage

ARG KASMWEB_RELEASE="46412d23aff1f45dffa83fafb04a683282c8db58"

RUN \
  echo "**** build clientside ****" && \
  mkdir /src && \
  cd /src && \
  wget https://github.com/kasmtech/noVNC/tarball/${KASMWEB_RELEASE} -O - \
    | tar  --strip-components=1 -xz

COPY ./patches/novnc.patch /src/
RUN \
  export QT_QPA_PLATFORM=offscreen && \
  export QT_QPA_FONTDIR=/usr/share/fonts && \
  echo "apply novnc.patch" && \
  cd /src && \
  patch -p1 -i novnc.patch && \
  npm install && \
  npm run-script build

RUN \
  echo "**** organize output ****" && \
  mkdir /build-out && \
  cd /src && \
  rm -rf node_modules/ && \
  cp -R ./* /build-out/ && \
  cd /build-out && \
  rm *.md && \
  rm AUTHORS && \
  cp index.html vnc.html && \
  mkdir Downloads

FROM ghcr.io/linuxserver/baseimage-kasmvnc:debianbookworm-64c54f55-ls117 AS buildstage

# Ashigaru Terminal ships an amd64-only .deb, so this image targets x86_64.
# yq is used by docker_entrypoint.sh to edit the Ashigaru JSON config at runtime.
ARG PLATFORM=amd64
ARG YQ_VERSION=4.40.7
ARG YQ_SHA=4f13ee9303a49f7e8f61e7d9c87402e07cc920ae8dfaaa8c10d7ea1b8f9f48ed

RUN \
  echo "**** install packages ****" && \
  apt-get update && \
  # remove dunst, we use xfce4-notifyd instead
  DEBIAN_FRONTEND=noninteractive \
  apt-get remove -y dunst && \
  # create missing directories for OpenJDK installation
  mkdir -p /usr/share/man/man1 && \
  # install required packages
  DEBIAN_FRONTEND=noninteractive \
  apt-get install -y --no-install-recommends \
    exo-utils \
    mousepad \
    xfce4-terminal \
    tumbler \
    thunar \
    # from 'recommended packages', solves a few warnings
    thunar-archive-plugin \
    librsvg2-common \
    python3-xdg \
    # dark theme
    hsetroot \
    gnome-themes-extra \
    compton \
    # desktop notifications
    xfce4-notifyd \
    libnotify-bin \
    xclip \
    # other
    wget \
    socat \
    gnupg \
    ca-certificates && \
  # upgrade packages before building
  DEBIAN_FRONTEND=noninteractive \
  apt-get upgrade -y && \
  # install yq
  wget -qO /tmp/yq https://github.com/mikefarah/yq/releases/download/v${YQ_VERSION}/yq_linux_${PLATFORM} && \
  echo "${YQ_SHA} /tmp/yq" | sha256sum --check || exit 1 && \ 
  mv /tmp/yq /usr/local/bin/yq && chmod +x /usr/local/bin/yq

# Copy and install Ashigaru Terminal .deb package
COPY ashigaru_terminal_*_amd64.deb /tmp/

# Install Ashigaru Terminal from .deb package
RUN \
  echo "**** install Ashigaru Terminal ****" && \
  # Find the .deb file
  DEB_FILE=$(ls /tmp/ashigaru_terminal_*_amd64.deb | head -1) && \
  echo "Installing Ashigaru Terminal from: $DEB_FILE" && \
  # Install the .deb package
  DEBIAN_FRONTEND=noninteractive \
  apt-get install -y "$DEB_FILE" && \
  # Verify installation
  echo "Ashigaru Terminal installation complete. Checking installation:" && \
  ls -la /opt/ && \
  # Find where it was installed and create compatibility symlinks if needed
  if [ -d "/opt/ashigaru-terminal" ]; then \
    echo "Found installation at /opt/ashigaru-terminal" && \
    ls -la /opt/ashigaru-terminal/ && \
    echo "Contents of bin directory:" && \
    ls -la /opt/ashigaru-terminal/bin/ && \
    echo "Contents of lib directory:" && \
    ls -la /opt/ashigaru-terminal/lib/ && \
    echo "All files in ashigaru-terminal:" && \
    find /opt/ashigaru-terminal -type f -executable; \
  elif [ -d "/opt/Ashigaru" ]; then \
    echo "Found installation at /opt/Ashigaru, creating symlink" && \
    ln -s /opt/Ashigaru /opt/ashigaru-terminal && \
    ls -la /opt/Ashigaru/; \
  else \
    echo "Searching for Ashigaru installation..." && \
    find /opt /usr/bin /usr/local/bin -name "*ashigaru*" -o -name "*Ashigaru*" 2>/dev/null | head -10; \
  fi && \
  # Create desktop integration
  echo "**** create desktop integration ****" && \
  mkdir -p /usr/share/applications && \
  # Try to find the actual executable path
  ASHIGARU_EXEC="" && \
  if [ -f "/opt/ashigaru-terminal/bin/Ashigaru-terminal" ]; then \
    ASHIGARU_EXEC="/opt/ashigaru-terminal/bin/Ashigaru-terminal"; \
  elif [ -f "/opt/ashigaru-terminal/bin/ashigaru-terminal" ]; then \
    ASHIGARU_EXEC="/opt/ashigaru-terminal/bin/ashigaru-terminal"; \
  elif [ -f "/opt/ashigaru-terminal/Ashigaru" ]; then \
    ASHIGARU_EXEC="/opt/ashigaru-terminal/Ashigaru"; \
  elif [ -f "/opt/Ashigaru/bin/Ashigaru" ]; then \
    ASHIGARU_EXEC="/opt/Ashigaru/bin/Ashigaru"; \
  elif [ -f "/usr/bin/ashigaru-terminal" ]; then \
    ASHIGARU_EXEC="/usr/bin/ashigaru-terminal"; \
  else \
    ASHIGARU_EXEC=$(find /opt /usr/bin -name "*ashigaru*" -o -name "*Ashigaru*" -type f -executable 2>/dev/null | head -1); \
  fi && \
  echo "Using executable: $ASHIGARU_EXEC" && \
  if [ -n "$ASHIGARU_EXEC" ]; then \
    echo "[Desktop Entry]" > /usr/share/applications/ashigaru-terminal.desktop && \
    echo "Type=Application" >> /usr/share/applications/ashigaru-terminal.desktop && \
    echo "Name=Ashigaru Terminal" >> /usr/share/applications/ashigaru-terminal.desktop && \
    echo "Comment=Privacy-enhanced Bitcoin wallet" >> /usr/share/applications/ashigaru-terminal.desktop && \
    echo "Exec=$ASHIGARU_EXEC" >> /usr/share/applications/ashigaru-terminal.desktop && \
    echo "Icon=ashigaru-terminal" >> /usr/share/applications/ashigaru-terminal.desktop && \
    echo "Categories=Finance;Network;" >> /usr/share/applications/ashigaru-terminal.desktop && \
    echo "StartupNotify=true" >> /usr/share/applications/ashigaru-terminal.desktop && \
    echo "Terminal=false" >> /usr/share/applications/ashigaru-terminal.desktop && \
    # Create convenience symlink if not in standard location
    if [ ! -f "/usr/local/bin/ashigaru-terminal" ]; then \
      ln -s "$ASHIGARU_EXEC" /usr/local/bin/ashigaru-terminal; \
    fi && \
    echo "Desktop integration complete."; \
  else \
    echo "ERROR: Could not find Ashigaru Terminal executable!" && \
    exit 1; \
  fi && \
  # Cleanup
  rm -f /tmp/ashigaru_terminal_*_amd64.deb

# Ashigaru's upstream .deb ships a jpackage launcher hardcoded for HEADLESS
# JavaFX (-Dglass.platform=Monocle -Dmonocle.platform=Headless) — a test/CI
# configuration that renders no window and accepts no mouse/keyboard input. On
# the Webtop desktop we need JavaFX to use its default GTK glass backend on
# DISPLAY=:1 so the wallet actually appears and is clickable. Strip the headless
# options from both the native launcher's .cfg and the runtime shell launcher,
# keeping software rendering (-Dprism.order=sw), which is correct for this
# GPU-less container. The build fails if the options can't be removed, so an
# upstream layout change can't silently reintroduce the headless behavior.
RUN \
  echo "**** patch Ashigaru launcher: disable headless JavaFX ****" && \
  cfg=/opt/ashigaru-terminal/lib/app/Ashigaru-terminal.cfg && \
  launcher=/opt/ashigaru-terminal/lib/runtime/bin/Ashigaru-terminal && \
  sed -i '/^java-options=-Dglass\.platform=Monocle$/d; /^java-options=-Dmonocle\.platform=Headless$/d' "$cfg" && \
  sed -i 's/ -Dglass\.platform=Monocle -Dmonocle\.platform=Headless//g' "$launcher" && \
  ! grep -qE 'Monocle|Headless' "$cfg" && \
  ! grep -qE 'Monocle|Headless' "$launcher" && \
  echo "headless JavaFX options removed"

# Cleanup
RUN \
  echo "**** cleanup ****" && \
  # Cleanup
  echo "Package installation complete" && \
  # remove unused packages from base image
  DEBIAN_FRONTEND=noninteractive \
  apt-get remove --purge --autoremove -y \
    perl \
    locales-all || true && \
  # remove left-over locales and generate default
  rm -rf $(ls -d /usr/share/locale/* | grep -vw /usr/share/locale/en) && \
  localedef -i en_US -f UTF-8 en_US.UTF-8 && \
  echo "**** xfce tweaks ****" && \
  rm -f /etc/xdg/autostart/xscreensaver.desktop && \
  # StartOS branding
  echo "Starting Ashigaru Terminal on Webtop for StartOS..." > /etc/s6-overlay/s6-rc.d/init-adduser/branding; sed -i '/run_branding() {/,/}/d' /docker-mods && \
  # cleanup and remove some unneeded large binaries
  echo "**** final cleanup ****" && \
  rm /kasmbins/kasm_webcam_server && \
  apt-get autoclean && \
  rm -rf \
    /config/.cache \
    /var/lib/apt/lists/* \
    /var/tmp/* \
    /tmp/*

# start from scratch so we create smaller layers in the resulting image
FROM scratch

COPY --from=buildstage / .
COPY --from=wwwstage /build-out /usr/local/share/kasmvnc/www

# since we start from scratch, we need these env variables from the base images
ENV \
  # from ghcr.io/linuxserver/baseimage-debian:bookworm (https://github.com/linuxserver/docker-baseimage-debian/blob/master/Dockerfile)
  HOME="/root" \
  LANGUAGE="en_US.UTF-8" \
  LANG="en_US.UTF-8" \
  TERM="xterm" \
  S6_CMD_WAIT_FOR_SERVICES_MAXTIME="0" \
  S6_VERBOSITY=1 \
  S6_STAGE2_HOOK=/docker-mods \
  VIRTUAL_ENV=/lsiopy \
  PATH="/lsiopy/bin:$PATH" \
  # from ghcr.io/linuxserver/baseimage-kasmvnc:debianbookworm (https://github.com/linuxserver/docker-baseimage-kasmvnc/blob/debianbookworm/Dockerfile)
  DISPLAY=:1 \
  PERL5LIB=/usr/local/bin \
  OMP_WAIT_POLICY=PASSIVE \
  GOMP_SPINCOUNT=0 \
  HOME=/config \
  # base container starts docker by default, but we removed it, so set to false
  START_DOCKER=false \
  PULSE_RUNTIME_PATH=/defaults \
  NVIDIA_DRIVER_CAPABILITIES=all \
  # set dark theme
  GTK_THEME=Adwaita:dark \
  GTK2_RC_FILES=/usr/share/themes/Adwaita-dark/gtk-2.0/gtkrc \
  # prevent kasm from touching our rc.xml
  NO_FULL=1 \
  # Java environment for Ashigaru Terminal
  JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

# add local files
COPY /root /
COPY --chmod=755 ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
COPY --chmod=664 icon.png /kclient/public/icon.png
COPY --chmod=664 icon.png /kclient/public/favicon.ico

# ports and volumes
EXPOSE 3000
VOLUME /config

# The final stage starts FROM scratch, which inherits no CMD/ENTRYPOINT from
# the base image. `start-cli s9pk pack` runs `docker create` on this image to
# export its rootfs, which fails with "no command specified" unless one is set.
# main.ts runs this script explicitly at runtime, so this is also the default.
CMD ["/usr/local/bin/docker_entrypoint.sh"]
