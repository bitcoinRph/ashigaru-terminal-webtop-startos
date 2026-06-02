// Constants and helpers shared across the package codebase.

// Port the KasmVNC web interface listens on inside the container.
export const uiPort = 3000

// StartOS hostnames for the optional Bitcoin backends. Ashigaru reaches them
// through localhost socat tunnels (see docker_entrypoint.sh) so that its Tor
// proxy is bypassed for these local connections.
export const bitcoindHost = 'bitcoind.startos'
export const electrsHost = 'electrs.startos'
