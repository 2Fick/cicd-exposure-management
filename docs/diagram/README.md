# Architecture diagram

The diagram in `docs/architecture.png` is generated, not drawn by hand, so it can
be corrected as the architecture changes instead of being redrawn.

`build-diagram.js` embeds the logos from `logos/` as data URIs and writes a
self contained `diagram.html`. Headless Chrome then renders that page to a PNG.

To regenerate it:

```
node docs/diagram/build-diagram.js
chrome --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
  --window-size=1500,805 --screenshot=docs/architecture.png docs/diagram/diagram.html
```

On Windows, `chrome` is `C:\Program Files\Google\Chrome\Application\chrome.exe` and
the page has to be passed as a `file:///` URL.

The window height is set to match the content. If a row is added to the diagram,
raise it until the whitespace at the bottom disappears.

Logos come from Simple Icons for the projects that publish there, and from the
organisation avatars on GitHub for Gitleaks, Checkov and Open Policy Agent, which
do not. They belong to their respective projects and are used here to identify the
tools this project integrates.
