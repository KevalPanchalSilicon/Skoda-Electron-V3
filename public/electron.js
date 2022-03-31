const electron = require('electron');
const { app, BrowserWindow } = electron;
const path = require('path');
const isDev = require('electron-is-dev');
const getmac = require('getmac');
const { desktopCapturer } = require('electron');
const log = require('electron-log');
const { autoUpdater } = require("electron-updater");


//-------------------------------------------------------------------
// Logging
//
// THIS SECTION IS NOT REQUIRED
//
// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
//-------------------------------------------------------------------
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let mainWindow = null;

function sendStatusToWindow(text,object={}) {
  log.info(text);
  mainWindow.webContents.send('message', text, object);
}

app.on('ready', createWindow);
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
});

// ipcMain.on("getMacAddress", (event) => {
//   return event.reply("sendMacAddress", getmac.default());
// });

function createWindow() {
  autoUpdater.checkForUpdates();
  // ipcMain.on('runCommand', async (event) => {
  //   event.returnValue = getmac.default();
  // });
  //localStorage.setItem("UUID","asdasdasd");
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 1024,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      preload: __dirname + '/preload.js'
    },
    title: "Skoda",
    icon: path.join(__dirname, '../build/stellar-skoda-icon.png'),
  });
  console.log("Dev : ",`${path.join(__dirname, '../build/stellar-skoda-icon.png')}`);
  console.log("Dev MAC : ",getmac.default());

  mainWindow.webContents.once('dom-ready', () => {
    mainWindow.webContents.send('setMacAddress', {UUID: getmac.default()});
  })
  
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  //mainWindow.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);
  
  mainWindow.on('closed', function () {
    mainWindow = null
  })
  mainWindow.on('page-title-updated', function (e) {
    e.preventDefault()
  });

  desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
    for (const source of sources) {
      if (source.name === 'Electron') {
        mainWindow.webContents.send('SET_SOURCE', source.id)
        return
      }
    }
  })
}


autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (ev, info) => {
  console.log('Update available.', ev, info);
  sendStatusToWindow('Update available.',{ev:ev,info:info});
})
autoUpdater.on('update-not-available', (ev, info) => {
  console.log('Update not available.', ev, info);
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (ev, err) => {
  console.log('Error in auto-updater.', ev, err);
  sendStatusToWindow('Error in auto-updater.');
})
autoUpdater.on('download-progress', (ev, progressObj) => {
  console.log('Download progress...', ev, progressObj);
  sendStatusToWindow('Download progress...');
});

autoUpdater.on('update-downloaded', (ev, info) => {
  console.log('Download progress...', ev, info);
  sendStatusToWindow('Update downloaded; will install in 5 seconds');
  // Wait 5 seconds, then quit and install
  // In your application, you don't need to wait 5 seconds.
  // You could call autoUpdater.quitAndInstall(); immediately
  setTimeout(function() {
    autoUpdater.quitAndInstall();  
  }, 5000)
})