#!/bin/sh
echo
echo "Initialising Ashigaru Terminal on Webtop..."
echo

# Webtop (KasmVNC base image) reads these from the environment, set by main.ts.
export PUID="${PUID:-1000}"
export PGID="${PGID:-1000}"
export TZ="${TZ:-Etc/UTC}"

# Ensure an Ashigaru Terminal config exists (seed from defaults on first run).
if [ ! -f /config/.ashigaru/config ]; then
  echo "No Ashigaru Terminal config file found, creating default"
  mkdir -p /config/.ashigaru
  cp /defaults/.ashigaru/config /config/.ashigaru/config
  chown -R "$PUID:$PGID" /config/.ashigaru
fi

# Always refresh the openbox autostart in case we change it between releases.
mkdir -p /config/.config/openbox
cp /defaults/autostart /config/.config/openbox/autostart
chown -R abc:abc /config/.config/openbox

# When StartOS manages settings, write the chosen server/proxy config into the
# Ashigaru Terminal config file. Otherwise leave it for the user to manage.
if [ "$MANAGE_SETTINGS" = "true" ]; then
  case "$SERVER_TYPE" in
  bitcoind)
    echo "Configuring Ashigaru Terminal for Bitcoin Core"
    export BITCOIND_RPC_USER BITCOIND_RPC_PASS
    yq e -i '
      .serverType = "BITCOIN_CORE" |
      .coreServer = "http://127.0.0.1:8332" |
      .coreAuthType = "USERPASS" |
      .coreAuth = strenv(BITCOIND_RPC_USER) + ":" + strenv(BITCOIND_RPC_PASS)' \
      -o=json /config/.ashigaru/config
    ;;
  electrs)
    echo "Configuring Ashigaru Terminal for Electrs"
    yq e -i '
      .serverType = "ELECTRUM_SERVER" |
      .electrumServer = "tcp://127.0.0.1:50001"' -o=json /config/.ashigaru/config
    ;;
  public)
    echo "Configuring Ashigaru Terminal for a public Electrum server"
    yq e -i '.serverType = "PUBLIC_ELECTRUM_SERVER"' -o=json /config/.ashigaru/config
    ;;
  *)
    echo "Unknown server type '$SERVER_TYPE', not configuring Ashigaru Terminal"
    ;;
  esac

  case "$PROXY_TYPE" in
  tor)
    echo "Configuring Ashigaru Terminal for Tor"
    # The StartOS Tor SOCKS proxy is reachable on the container gateway, port 9050.
    GATEWAY_IP=$(ip -4 route list match 0/0 | awk '{print $3}')
    export GATEWAY_IP
    yq e -i '
      .useProxy = true |
      .proxyServer = strenv(GATEWAY_IP) + ":9050"' -o=json /config/.ashigaru/config
    ;;
  none)
    echo "Configuring Ashigaru Terminal for 'no proxy'"
    yq e -i '.useProxy = false' -o=json /config/.ashigaru/config
    ;;
  *)
    echo "Unknown proxy type '$PROXY_TYPE', not configuring Ashigaru Terminal"
    ;;
  esac
fi

# remove reference to non-existing file, see: https://github.com/linuxserver/kclient/issues/8
sed -i '/<script src="public\/js\/pcm-player\.js"><\/script>/d' /kclient/public/index.html

# add '&reconnect=' setting to kclient html
sed -i "s/\(index\.html?autoconnect=1\)/&\&reconnect=${RECONNECT:-false}/" /kclient/public/index.html

# Localhost proxies so Ashigaru can reach bitcoind/electrs directly. Ashigaru
# does not route localhost connections through Tor, so this lets it talk to the
# local backend while still using Tor for everything else (e.g. Whirlpool).
if [ "$SERVER_TYPE" = "bitcoind" ] && [ -n "$BITCOIND_HOST" ]; then
  /usr/bin/socat tcp-l:8332,fork,reuseaddr,su=nobody,bind=127.0.0.1 tcp:"$BITCOIND_HOST":8332 &
fi
if [ "$SERVER_TYPE" = "electrs" ] && [ -n "$ELECTRS_HOST" ]; then
  /usr/bin/socat tcp-l:50001,fork,reuseaddr,su=nobody,bind=127.0.0.1 tcp:"$ELECTRS_HOST":50001 &
fi

exec /init
