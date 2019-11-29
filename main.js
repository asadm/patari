'use strict'
const { app, BrowserWindow, globalShortcut, ipcMain, Menu, Tray, Notification } = require('electron');  // Module to control application life.
const path = require('path');
//const Notification = require('notification');
//const notifier = require('node-notifier');
const http = require('http');
const https = require('https');
const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null;
let appIcon = null;

let playlist = [];
// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  let preload = path.resolve(path.join(__dirname, 'preload.js'));
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    title: "Patari",
    autoHideMenuBar: true,
    preload:preload,
    icon: path.join(__dirname, 'assets/patari-logo.png'),
    "web-preferences":{"node-integration": false}});

  // and load the index.html of the app.
  mainWindow.loadURL('http://patari.pk');


  // Open the DevTools.
  //mainWindow.openDevTools();

  ipcMain.on('playlist_update', function (event,args) {
      console.log(args);
      playlist = args;
      updateTrayMenu();
  });


  globalShortcut.register('MediaPlayPause', function() {
    console.log('MediaPlayPause is pressed');
    //mainWindow.webContents.executeJavaScript('$(".player .playerPlay").click()');
    mainWindow.webContents.send('mediabuttons',"playpause");
  });

  globalShortcut.register('MediaPreviousTrack', function() {
    console.log('MediaPreviousTrack is pressed');
    //mainWindow.webContents.executeJavaScript('$(".player .playerPlay").click()');
    mainWindow.webContents.send('mediabuttons',"previous");
  });

  globalShortcut.register('MediaNextTrack', function() {
    console.log('MediaNextTrack is pressed');
    //mainWindow.webContents.executeJavaScript('$(".player .playerPlay").click()');
    mainWindow.webContents.send('mediabuttons',"next");
  });

  mainWindow.on('close',function (event) {
    //should run in background, so prevent window close and hide it
    event.preventDefault();
    mainWindow.hide();
    //app.quit();
  });

  //tray icon
  //console.log(path.join(__dirname, 'assets/patari-logo.png'));
  appIcon = new Tray(path.join(__dirname, 'assets/tray.png'));
  appIcon.setToolTip('Patari');
  updateTrayMenu();
  //console.log(appIcon);
});

app.on('before-quit',function() {
  quit();
})

app.on('will-quit', function() {
  // Unregister a shortcut.
  //globalShortcut.unregister('ctrl+x');

  // Unregister all shortcuts.
  //quit(true);
});



function generateContextMenu(){

  let currentlyPlaying = false;

  for (var i in playlist){
    if (playlist[i].isPlaying)
      currentlyPlaying = playlist[i];
  }


  var menu = [];

  if (currentlyPlaying){
    menu.push({label:"Playing: "+currentlyPlaying.title,enabled:false});

    //pull the thumbnail first
    let file = fs.createWriteStream(__dirname + "/temp.jpg");
    let request = https.get(currentlyPlaying.thumbnail, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close(function(){
          //notify
          mainWindow.webContents.send("notify",{
            Title: currentlyPlaying.songtitle,
            body: currentlyPlaying.albumtitle,
            icon: "file:///" + __dirname + "/temp.jpg"
          });
        });

      });
    });

  }

  menu.push({label:"Play/Pause", click:function(){
    //open app window
    console.log("playpause");
    mainWindow.webContents.send('mediabuttons',"playpause");

  }});

  menu.push({label:"Open Patari", click:function(){
    //open app window
    console.log("open");
    mainWindow.show();
  }});

  menu.push({label:"Quit", click:function(){
    //open app window
    console.log("quit");
    quit();
  }});

  menu.push({ type: 'separator' });

  for (var i in playlist){
    //closure because when clicked, i would be last of array
    (function(i){
      var c = {type: 'checkbox', label:playlist[i].title,checked:playlist[i].isPlaying};
      c.click=function(){
        mainWindow.webContents.send('playlist_play',playlist[i].id);
      }
      menu.push(c);

    })(i);
  }
  return Menu.buildFromTemplate(menu);

}

function updateTrayMenu(){
  let contextMenu = generateContextMenu();
  appIcon.setContextMenu(contextMenu);
}

let quitCalled = false;
function quit(dontcallquit){
  if (quitCalled) return;

  quitCalled=true;
  console.log("quit",dontcallquit);
  if (mainWindow){
    mainWindow.removeAllListeners('close');
    mainWindow.close();
  }

  globalShortcut.unregisterAll();
  if (!dontcallquit)
    app.quit();
}
