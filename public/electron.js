const electron = require('electron');
const { app, BrowserWindow } = electron;
const path = require('path');
const isDev = require('electron-is-dev');
const getmac = require('getmac');
const { desktopCapturer, dialog } = require('electron');
const log = require('electron-log');
const { autoUpdater } = require("electron-updater");
const downloadProgressBar = require('electron-progressbar');
const os = require('os');
const fetch = require('electron-fetch').default;

// Printing os.platform() value
var platform = os.platform();

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

let currentVersion = app.getVersion();

function sendStatusToWindow(text) {
  log.info(text);
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
var version = currentVersion;
var versionReleaseUrl = "";
async function getCurrentVersion(){
  await fetch('http://canis-api.silicontechnolabs.com:9013/downloadVersionFile')
	.then(res => res.json())
	.then(json =>  {
    console.log("json.currentRelease", json.currentRelease);
    version = json.currentRelease;
    let versionRelease = json.releases.find(ver => ver.version === json.currentRelease);
    if(versionRelease){
      versionReleaseUrl = versionRelease.updateTo.url;
    }
  });
}
// ipcMain.on("getMacAddress", (event) => {
//   return event.reply("sendMacAddress", getmac.default());
// });

function createWindow() {
  // ipcMain.on('runCommand', async (event) => {
  //   event.returnValue = getmac.default();
  // });
  //localStorage.setItem("UUID","asdasdasd");
  mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      preload: __dirname + '/preload.js'
    },
    title: "Skoda",
    icon: path.join(__dirname, '../build/stellar-skoda-icon.png'),
  });
  mainWindow.maximize();
  console.log("Dev : ",`${path.join(__dirname, '../build/stellar-skoda-icon.png')}`);
  console.log("Dev MAC : ",getmac.default());
  try {
      getCurrentVersion().then(() =>{
      log.info(`App version... ${version}`);
      log.info(`App version URL... ${versionReleaseUrl}`);

      autoUpdater.fullChangelog = true;
      autoUpdater.autoDownload=false;
      autoUpdater.setFeedURL(`${versionReleaseUrl}`);
      autoUpdater.checkForUpdates();
    });
   
  } catch (e) {
    log.info('[AUTO-UPDATE] error', e.toString());
  }
  mainWindow.webContents.once('dom-ready', () => {
    mainWindow.webContents.send('setMacAddress', {UUID: getmac.default(), platform: platform});
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
  });
}

let logMessage = "";
let progressWindow;

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow(currentVersion);
  sendStatusToWindow('Checking for update...');
});

autoUpdater.on('update-available', (ev, info) => {
  console.log('Update available.', ev, info);
  sendStatusToWindow('Update available.');
  sendStatusToWindow(ev)
  sendStatusToWindow(info);
  sendStatusToWindow(">>>>>><<<<<<<<<<< = ",ev.version);
  let newVersion = ev.version.split(".");
  let oldVersion = currentVersion.split(".");
  if(oldVersion[2] < newVersion[2]){
    sendStatusToWindow(`Update available. oldVersion - ${oldVersion[2]} - newVersion - ${newVersion[2]}`);
    dialog.showMessageBox(mainWindow,{
      type:"info",
      message:`Wait... Found New Updates - ${ev.version}`,
      detail: `\n# My shiny new version release notes\nWith some details\n - Detail a\n - Detail b\n`,
      icon:`${path.join(__dirname, '../build/stellar-skoda-icon.png')}`,
      buttons: [`Install - ${ev.version}`, 'Later']
    }).then(buttonIndex => {
      sendStatusToWindow(`Update available.ButtonIndex${buttonIndex}`);
      if (buttonIndex.response === 0) {
        sendStatusToWindow('Update available. In the box');
        autoUpdater.downloadUpdate();
        progressWindow = new downloadProgressBar({
          title: 'Downloading Update...',
          text: 'Downloading Update. Please Wait...',
          detail: 'Wait...',
          indeterminate: false				
        });
        //setImmediate(() => autoUpdater.quitAndInstall());
      }else{
        sendStatusToWindow('Update available. out the box');
      }
    });
  }else{
    autoUpdater.downloadUpdate();
    progressWindow = new downloadProgressBar({
      title: 'Downloading Update...',
      text: 'Downloading Update. Please Wait...',
      detail: 'Wait...',
      indeterminate: false				
    });
  }
});

autoUpdater.on('download-progress', (ev, progressObj) => {

  sendStatusToWindow('Download progress...');
  sendStatusToWindow(ev);
  sendStatusToWindow(progressObj);
  sendStatusToWindow('Download progress End...');

  logMessage = "Download speed: " + ev.bytesPerSecond;
  logMessage = logMessage + ' - Downloaded ' + ev.percent.toFixed(2) + '%';
  logMessage = logMessage + ' (' + ev.transferred + "/" + ev.total + ')';
  progressWindow.value = ev.percent;
  
  console.log('Download progress...', ev, progressObj);

  progressWindow.on('progress', (value) => {
    progressWindow.detail = logMessage;
    progressWindow.text = "Downloading Update inprogress..."
  });
  
});

autoUpdater.on('update-downloaded', (ev, info) => {
  progressWindow.setCompleted();
  console.log('Download progress...', ev, info);
  dialog.showMessageBox(mainWindow,{
    message:"Update downloaded; will install in 5 seconds.",
    type: "info",
    icon:`${path.join(__dirname, '../build/stellar-skoda-icon.png')}`,
    buttons:[],
    indeterminate: false
  });
  sendStatusToWindow('Update downloaded; will install in 5 seconds');
  // Wait 5 seconds, then quit and install
  // In your application, you don't need to wait 5 seconds.
  // You could call autoUpdater.quitAndInstall(); immediately
  setTimeout(function() {
    autoUpdater.quitAndInstall();  
  }, 5000)
});

autoUpdater.on('update-not-available', (ev, info) => {
  console.log('Update not available.', ev, info);
  sendStatusToWindow('Update not available.');
});

autoUpdater.on('error', (ev, err) => {
  console.log('Error in auto-updater.', ev, err);
  sendStatusToWindow('Error in auto-updater.');
});
