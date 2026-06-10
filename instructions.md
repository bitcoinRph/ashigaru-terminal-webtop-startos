# Ashigaru Terminal on Webtop

Welcome to Ashigaru Terminal on Webtop — a privacy-enhanced Bitcoin wallet running on an immutable Linux desktop, 24/7 on your StartOS server.

## Getting Started

1. Start the service and open the **Web UI** from the service's **Dashboard**. The desktop opens directly — there is no separate Webtop login. Access to the interface is controlled by StartOS (via Tor or your local network, behind StartOS's own authentication).
2. (Optional) Run the **Configure Ashigaru Terminal** action to change the browser tab title, auto-reconnect behavior, and — most importantly — your Bitcoin backend and proxy.

## Configuring your Bitcoin backend

The **Configure Ashigaru Terminal** action lets you choose how Ashigaru connects to the Bitcoin network:

- **Electrs (recommended)** — uses the Electrs service on your StartOS server.
- **Bitcoin Core** — uses your Bitcoin Core service. You'll provide its RPC username and password in the action.
- **Public (not recommended)** — uses a public Electrum server. This can leak your IP and transactions; switch to a private backend as soon as possible.

A **proxy** option (Tor by default) routes external connections through the **Tor service** on your StartOS server (`tor.startos:9050`). The Tor service must be installed and running for this to work — fresh StartOS installs do **not** include it, so install "Tor" from the Marketplace (servers migrated from StartOS 0.3.6 get it automatically). A "Tor Proxy" health check on the dashboard shows whether the proxy is reachable and, if not, whether the Tor service is missing or just unhealthy. When "Apply settings on startup" is enabled, StartOS writes these choices into Ashigaru's config each time the service starts; disable it to manage server/proxy settings yourself from within Ashigaru Terminal.

When you select Electrs or Bitcoin Core, StartOS will require that service to be running, and Ashigaru reaches it over a localhost tunnel so the connection bypasses Tor for that local hop.

## Important Notes

1. Webtop is an immutable Linux desktop running in a container. Changes **outside** the home directory (`/config`) are **not** persisted and are lost on restart/update. The home directory is stored on a volume, persisted across restarts, and included in StartOS backups.
2. Ashigaru Terminal stores wallets, settings, and logs in `/config/.ashigaru/`, so they survive restarts and updates and are included in backups.
3. There is no in-container login. The Web UI is reachable only through StartOS (Tor or LAN), so access is gated by StartOS's own authentication rather than a separate Webtop username/password.
4. This image is Debian-based. A default Ashigaru configuration is created on first run if none exists, defaulting to the installed Electrs instance.
5. Right-click the desktop to open the application launcher (file manager, terminal, text editor, or a second Ashigaru Terminal window). Ashigaru opens maximized — double-click its title bar to resize and see the desktop.
6. Webtop does not support cameras or USB devices — keep this in mind when setting up wallets.

## Privacy Features

Ashigaru Terminal is based on Sparrow but adds enhanced privacy capabilities, including Nightjar integration and Tor-by-default networking, as a dedicated Ashigaru Whirlpool client.

## Control Panel

The KasmVNC control panel is on the left edge of the Webtop interface. See the [KasmVNC client documentation](https://www.kasmweb.com/kasmvnc/docs/latest/clientside.html) for details.
