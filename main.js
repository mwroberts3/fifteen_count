// Modules
const { app, BrowserWindow, screen, ipcMain, webContents, shell } = require('electron')
const windowStateKeeper = require('electron-window-state')
require('./passport-steam/examples/signon/app')
const path = require('path')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let windowedWindow

// to view user data
// console.log(app.getPath('userData'));

// Listen for exit click
ipcMain.on('user-exit', () => {
  app.quit()
})

// Listen for display setting selection
ipcMain.on('window-selected', (args, msg) => {
  if (mainWindow) {
    createWindowedwindow();
    setTimeout(() => {
      windowedWindow.setOpacity(1)
    }, 500)
    mainWindow.close();
  }
})

ipcMain.on('fullscreen-selected', (args, msg) => {
  if (windowedWindow) {
    createWindow();
    mainWindow.loadFile('renderer/options.html')
    mainWindow.setOpacity(1);
    windowedWindow.close();
  }
})

// Electron `app` is ready
app.on('ready', createWindow)

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})



// create windowed window
function createWindowedwindow() {
  windowedWindow = new BrowserWindow({
    x: 0, y: 0,
    minWidth: 1280, minHeight: 720,
    opacity: 0,
    frame: true,
    fullscreenable: true,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, 'indigo-loop-icon.png')
  })
  
  // Removes app menu (no need for it)
  // windowedWindow.removeMenu();

  // loads windowed window & closes previous
  windowedWindow.loadFile('renderer/options.html')
  
  // Listen for window being closed
  windowedWindow.on('closed', () => {
    windowedWindow = null
  })

  windowedWindow.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    shell.openExternal(url);
  });
}

// Create a new BrowserWindow when `app` is ready
function createWindow() {
  mainWindow = new BrowserWindow({
    frame: false,
    fullscreen: true,
    resizable: false,
    opacity: 0,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, 'indigo-loop-icon.png')
  })

  // Removes app menu (no need for it)
  // mainWindow.removeMenu();

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('renderer/intro-screen.html')

  // Manage new window state
  // state.manage(mainWindow)

  // Open DevTools - Remove for PRODUCTION!
  // mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    shell.openExternal(url);
  });

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('display-settings-check');
    ipcMain.on('display-settings', (e, windowed) => {
      if (windowed) {
        createWindowedwindow();
        // windowedWindow.setOpacity(0);
        windowedWindow.loadFile('renderer/intro-screen.html')
        setTimeout(() => {
          windowedWindow.setOpacity(1)
        }, 500)
        mainWindow.close();
      } else {
        mainWindow.setOpacity(1);
      }
    })
  })
}

