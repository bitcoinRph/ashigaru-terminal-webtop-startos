// Constants and helpers shared across the package codebase.

// Port the KasmVNC web interface listens on inside the container.
export const uiPort = 3000

// StartOS hostnames for the optional Bitcoin backends. Ashigaru reaches them
// through localhost socat tunnels (see docker_entrypoint.sh) so that its Tor
// proxy is bypassed for these local connections.
export const bitcoindHost = 'bitcoind.startos'
export const electrsHost = 'electrs.startos'

// On StartOS 0.4 Tor runs as its own system service ('tor'), and its SOCKS5
// proxy is reachable from other service containers at tor.startos:9050. The
// container's network gateway does NOT expose a Tor SOCKS port.
export const torHost = 'tor.startos'
export const torSocksPort = 9050
