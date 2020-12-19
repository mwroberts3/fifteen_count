// Modules
const { app, BrowserWindow, screen, ipcMain } = require('electron')
const windowStateKeeper = require('electron-window-state')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let windowedWindow

// Create a new BrowserWindow when `app` is ready
function createWindow() {
  mainWindow = new BrowserWindow({
    frame: false,
    fullscreen: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  // Removes app menu (no need for it)
  mainWindow.removeMenu();

  // Load index.html into the new BrowserWindow
    mainWindow.loadFile('renderer/title-screen.html')

  // Manage new window state
  // state.manage(mainWindow)

  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.on('did-finish-load', () => {
    ipcMain.on('display-settings', (e, msg) => {
      console.log(msg);
    })
  })
}

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
  }
})

ipcMain.on('fullscreen-selected', (args, msg) => {
  if (windowedWindow) {
    createWindow();
    mainWindow.loadFile('renderer/options.html')
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
    frame: true,
    fullscreenable: true,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })
  
  // Removes app menu (no need for it)
  // windowedWindow.removeMenu();

  // loads windowed window & closes previous
  mainWindow.close();
  windowedWindow.loadFile('renderer/options.html')
  
  // Listen for window being closed
  windowedWindow.on('closed', () => {
    windowedWindow = null
  })
}
