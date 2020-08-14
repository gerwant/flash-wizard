
# Flash Wizard

> Firmware flasher for your 3D printer!


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
*Keep in mind that your compilation won't have "I don't have .hex file option" because ftp credentials aren't stored in the repository.*
