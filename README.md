## Web Apple Reminders

### Overview

Web Apple Reminders is a Chrome extension that makes the web interface of [iCloud.com/reminders](https://www.icloud.com/reminders) usable as a minimal desktop app. It automatically sorts reminders by due date, simplifies the layout, and hides visual clutter. The goal is to make iCloud Reminders functional as a compact, always-open window — especially when installed as a Progressive Web App (PWA).

### Use as a PWA

To use iCloud Reminders as a standalone, minimal app on desktop:

#### On Chrome or Chromium-based browsers:
1. Go to [icloud.com/reminders](https://www.icloud.com/reminders)
2. Click the browser menu (⋮)
3. Choose “Install iCloud Reminders” next to “Create Shortcut” → “Open in window”

#### On Firefox:
1. Go to [icloud.com/reminders](https://www.icloud.com/reminders)
2. Click the menu (☰) → “More tools” → “Pin to taskbar” or create a standalone shortcut using `--ssb` or third-party tools

This gives you a separate window dedicated to Reminders, with the extension active and styling applied.

### Installation

To install the extension manually:

1. Clone or download this repository.
2. Go to `chrome://extensions` and enable Developer Mode.
3. Click “Load unpacked” and select the extension folder.

The extension will also be published on the Chrome Web Store.

### Notes

- The extension only modifies the embedded Reminders iframe, not the rest of the iCloud site.
- All behavior is local. No network requests or credentials are involved.
- The style and layout are tailored for small windows pinned on screen.

### License

MIT License. See [LICENSE.md](LICENSE.md) for details.

Contributions and feedback are welcome.
