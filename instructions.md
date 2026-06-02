# Ashigaru Terminal on Webtop

Welcome to Ashigaru Terminal on Webtop — a privacy-enhanced Bitcoin wallet running on an immutable Linux desktop, 24/7 on your StartOS server.

## Getting Started

1. After install, run the **Get Webtop Credentials** action to retrieve the username and password for logging into your desktop. A strong password is generated for you automatically on install.
2. Start the service and open the **Web UI** from the service's **Dashboard**. Your browser will prompt for the username and password from step 1.
3. (Optional) Run the **Configure Ashigaru Terminal** action to change the login, browser tab title, auto-reconnect behavior, and — most importantly — your Bitcoin backend and proxy.

## Configuring your Bitcoin backend

The **Configure Ashigaru Terminal** action lets you choose how Ashigaru connects to the Bitcoin network:

- **Electrs (recommended)** — uses the Electrs service on your StartOS server.
- **Bitcoin Core** — uses your Bitcoin Core service. You'll provide its RPC username and password in the action.
- **Public (not recommended)** — uses a public Electrum server. This can leak your IP and transactions; switch to a private backend as soon as possible.

A **proxy** option (Tor by default) routes external connections through the StartOS Tor proxy. When "Apply settings on startup" is enabled, StartOS writes these choices into Ashigaru's config each time the service starts; disable it to manage server/proxy settings yourself from within Ashigaru Terminal.

When you select Electrs or Bitcoin Core, StartOS will require that service to be running, and Ashigaru reaches it over a localhost tunnel so the connection bypasses Tor for that local hop.

## Important Notes

1. Webtop is an immutable Linux desktop running in a container. Changes **outside** the home directory (`/config`) are **not** persisted and are lost on restart/update. The home directory is stored on a volume, persisted across restarts, and included in StartOS backups.
2. Ashigaru Terminal stores wallets, settings, and logs in `/config/.ashigaru/`, so they survive restarts and updates and are included in backups.
3. Webtop uses HTTPS basic authentication. Your browser prompts for credentials on first connect and remembers them until they change.
4. This image is Debian-based. A default Ashigaru configuration is created on first run if none exists, defaulting to the installed Electrs instance.
5. Right-click the desktop to open the application launcher (file manager, terminal, text editor, or a second Ashigaru Terminal window). Ashigaru opens maximized — double-click its title bar to resize and see the desktop.
6. Webtop does not support cameras or USB devices — keep this in mind when setting up wallets.

## Privacy Features

Ashigaru Terminal is based on Sparrow but adds enhanced privacy capabilities, including Nightjar integration and Tor-by-default networking, as a dedicated Ashigaru Whirlpool client.

## Control Panel

The KasmVNC control panel is on the left edge of the Webtop interface. See the [KasmVNC client documentation](https://www.kasmweb.com/kasmvnc/docs/latest/clientside.html) for details.
