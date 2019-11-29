# Patari App

**Patari app for Debian, OS X and Windows.**

This is a wrapper around [Patari](http://patari.pk) music site using the wonderful [Electron](https://github.com/atom/electron/) framework.

Why is that good?

- No more 'trying to find in which tab is Patari running'
- Media keys support! (Yeah, those with ▶ ❚❚ on them.)
- Tray icon gives quick access to current playlist

![Patari Screenshot](screenshot.png?raw=true)

I love Patari and support their vision. So I made this app in my free time.

## Download

- [Mac OS X](dist/patari-osx.zip?raw=true)
- [Windows](dist/patari-win.zip?raw=true)
- [Debian](https://bit.ly/2OV4l6Z)

## Issues
- If the Windows version crashes on playing any song, please set the compatibility mode for *Patari.exe* to Windows 7. The bug is currently under investigation.

## Contribute

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/asadm/patari
# Go into the repository
$ cd patari
# Install dependencies and run the app
$ npm install && npm start
# To build executables, first install electron-packager
$ npm install -g electron-packager
# To build bundle for OS X
$ npm run make-osx
# To build bundle for Windows
$ npm run make-win
```

## Relevant Files
- [```./main.js```](main.js) holds the main logic for electron based app.
- [```./preload.js```](preload.js) this script is injected into Patari website onload. Starts communication with host (main.js) and set's up helpers and listeners for DOM playlist changes etc.
- [```./libs/domhelpers.js```](libs/domhelpers.js) This class is a wrapper around any interaction with HTML DOM of Patari. If Patari website changes significantly and breaks this app, This is where to make fixes.
- [```./libs/observer.js```](libs/observer.js) helper function used by ```domhelpers.js```, uses MutationObserver checks if there are any changes in the DOM tree of given target.

#### License [MIT](LICENSE.md)
