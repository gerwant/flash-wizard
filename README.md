
# Flash Wizard

> Firmware flasher for your 3D printer!

![build](https://github.com/gerwant/flash-wizard/workflows/Node.js%20CI/badge.svg)

## Install

*Linux and Windows 7+ are supported (64-bit only).*
*On our way to provide 32-bit binaries also.*


**macOS**

*We didn't build it yet (mainly because of lack of macOS machines), but if community will alert such a need, we will provide solution.*

**Linux**

[**Download**](https://github.com/gerwant/flash-wizard/releases/latest) the `.AppImage` or `.deb` file.

*The AppImage needs to be [made executable](http://discourse.appimage.org/t/how-to-make-an-appimage-executable/80) after download.*

**Windows**

[**Download**](https://github.com/gerwant/flash-wizard/releases/latest) the `.exe` file.


---


## Dev

Built with [Node.js](https://nodejs.org/en/) + [Electron](https://electronjs.org).<br/>
[Underscore.js](https://underscorejs.org/) was also very helpful.

### Run

```
$ npm install
$ npm start
```

### Wizard Assistant

Option #2 called "I don't have .hex file" couldn't be done without creating a special server which helps us with filtering traffic between file server and client through FTP and providing appropriate API endpoints. It's called [Wizard Assistant](https://github.com/rafalelo/wizard-assistant) and it's developed simultaneously with Flash Wizard, as an integral part. Future plans include making it more reliable, bulletproof and stable. Our goal is to provide continuous distribution of firmwares for your printers and rapidly develop new software to make manipulating with firmwares easier for everyone.
