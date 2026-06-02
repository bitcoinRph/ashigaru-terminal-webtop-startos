<p align="center">
  <img src="icon.png" alt="Project Logo" width="21%">
</p>

# Ashigaru Terminal on Webtop for StartOS

[Webtop](https://docs.linuxserver.io/images/docker-webtop/) is a Linux desktop environment accessible from a web browser. This repository builds the `s9pk` package that runs the [Ashigaru Terminal wallet](https://github.com/linkinparkrulz/ashigaru-terminal) on a stripped-down `Webtop` desktop for [StartOS](https://github.com/Start9Labs/start-os/).

Ashigaru Terminal is a non-custodial, privacy-enhanced Bitcoin wallet (a fork of Sparrow) and a dedicated Ashigaru Whirlpool client. It lets you join pools of your choice and keep building your forward and backward anonymity sets while remaining in full control of your funds throughout every stage of coinjoin cycles.

This package is built against the current StartOS SDK (`@start9labs/start-sdk`), using the TypeScript packaging model: the manifest, runtime, interfaces, actions and version graph all live under [`startos/`](./startos).

## Configuration

The old Embassy config form has been replaced by an **Action**:

- **Configure Ashigaru Terminal** — set the browser tab title, auto-reconnect, and the Bitcoin backend (Electrs, Bitcoin Core, or a public Electrum server) and proxy (Tor or none). When "Apply settings on startup" is enabled, StartOS writes these into Ashigaru's config on each start.

There is **no separate Webtop login** — the Web UI opens directly and access is controlled by StartOS (Tor/LAN behind StartOS authentication).

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

## Getting the `.s9pk` (no local build needed)

### From a GitHub Release (recommended)

Every push to `main` runs the **Release** workflow, which builds the package and
publishes `ashigaru-webtop_x86_64.s9pk` as an asset on a GitHub Release (tagged
from the package version, e.g. `v1.0.0_0`). Download it from the repo's
**Releases** page — no registry or secrets required. You can also cut a release
on demand via **Actions → Release → Run workflow**.

### From a Build artifact

For a PR or ad-hoc build, the **Build** workflow uploads the same `.s9pk` as a
14-day artifact: **Actions → Build → Run workflow**, then download the
`ashigaru-webtop_x86_64` artifact from the finished run and unzip it.

## Installing (on StartOS)

Sideload the `.s9pk` under **StartOS → System → Sideload a Service**.

To build and install from the command line instead, define
`host: http://server-name.local` in `~/.startos/config.yaml`, then:

```
make install
```
