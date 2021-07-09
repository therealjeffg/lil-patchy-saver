# Lil Patchy Saver

[![Built by FISSION](https://img.shields.io/badge/⌘-Built_by_FISSION-purple.svg)](https://fission.codes)
[![Built by FISSION](https://img.shields.io/badge/webnative-v0.26-purple.svg )](https://github.com/fission-suite/webnative)
[![Discord](https://img.shields.io/discord/478735028319158273.svg)](https://discord.gg/zAQBDEq)
[![Discourse](https://img.shields.io/discourse/https/talk.fission.codes/topics)](https://talk.fission.codes)

This web app displays and stores web pages captured by the [Lil Patchy web extension](https://github.com/therealjeffg/lil-patchy).

The extension captures the following information when `saving` a page:

* a full page screenshot of the page
* some web page meta-data 
* the time of the capture
* [ eventually ] the full article text and additional text content from the page.


Lil Patchy Saver listens for pages captured by the extension and stores them to the [Webnative File System (WNFS)](https://guide.fission.codes/developers/webnative/file-system-wnfs).

## Try it

Install the extension: ...

This demo is live at: https://stupid-enormous-square-hero.fission.app

## Develop

The browser extension expects this app to be published at a specific domain.

[Install the Fission CLI](https://guide.fission.codes/developers/installation) if you have not already.

Register a new Fission app and then publish it.

```
fission app register
fission app publish
```

Copy the URL reported by the `register` command, and configure the extension with it as described in the [Lil Patchy web extension](https://github.com/therealjeffg/lil-patchy) repository.