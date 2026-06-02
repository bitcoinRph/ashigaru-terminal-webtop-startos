<p align="center">
  <img src="icon.png" alt="Project Logo" width="21%">
</p>

# Ashigaru Terminal on Webtop for StartOS

[Webtop](https://docs.linuxserver.io/images/docker-webtop/) is a Linux desktop environment accessible from a web browser. This repository builds the `s9pk` package that runs the [Ashigaru Terminal wallet](https://github.com/linkinparkrulz/ashigaru-terminal) on a stripped-down `Webtop` desktop for [StartOS](https://github.com/Start9Labs/start-os/).

Ashigaru Terminal is a non-custodial, privacy-enhanced Bitcoin wallet (a fork of Sparrow) and a dedicated Ashigaru Whirlpool client. It lets you join pools of your choice and keep building your forward and backward anonymity sets while remaining in full control of your funds throughout every stage of coinjoin cycles.

This package is built against the current StartOS SDK (`@start9labs/start-sdk`), using the TypeScript packaging model: the manifest, runtime, interfaces, actions and version graph all live under [`startos/`](./startos).

## Configuration

The old Embassy config form has been replaced by **Actions**:

- **Get Webtop Credentials** — view the username and password for logging into your desktop. A randomly generated password is created on install.
- **Configure Ashigaru Terminal** — set the Webtop login, browser tab title, auto-reconnect, and the Bitcoin backend (Electrs, Bitcoin Core, or a public Electrum server) and proxy (Tor or none). When "Apply settings on startup" is enabled, StartOS writes these into Ashigaru's config on each start.

When Bitcoin Core or Electrs is selected, the corresponding StartOS service is declared as a running dependency, and a localhost `socat` tunnel lets Ashigaru reach it directly (bypassing Tor for the local hop).

## Architecture support

Ashigaru Terminal is distributed as an **amd64-only** `.deb`, so this package targets `x86_64` only.

## Dependencies (build)

- [docker](https://docs.docker.com/get-docker) (with [buildx](https://docs.docker.com/buildx/working-with-buildx/))
- [Node.js / npm](https://nodejs.org/)
- [start-cli](https://docs.start9.com/latest/developer-guide/sdk/installing-the-sdk)
- [make](https://www.gnu.org/software/make/)

## Cloning

```
git clone https://github.com/linkinparkrulz/ashigaru-webtop-startos.git
cd ashigaru-webtop-startos
```

## Building

```
make
```

This runs `npm run check`, builds the JS bundle, builds the Docker image, and packs `ashigaru-webtop.s9pk`.

## Installing (on StartOS)

Define `host: http://server-name.local` in `~/.startos/config.yaml`, then:

```
make install
```

**Tip:** You can also sideload the `ashigaru-webtop.s9pk` under **StartOS > System > Sideload a Service**.
