// Modules
const {app, BrowserWindow, screen, ipcMain} = require('electron')
const windowStateKeeper = require('electron-window-state')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Create a new BrowserWindow when `app` is ready
function createWindow () {
  // Win state keeper
  let state = windowStateKeeper({
    defaultWidth: 500, defaultHeight: 650
  })

  // x: -391, y: -1080,
  mainWindow = new BrowserWindow({
    x: -391, y: -1080,
    width: 1300, height: 800,
    frame: true,
    fullscreenable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  // Removes app menu (no need for it)
  // mainWindow.removeMenu();

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('renderer/title-screen.html')

  // Manage new window state
  state.manage(mainWindow)

  // Open DevTools - Remove for PRODUCTION!
  // mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  })
}

// Listen for exit click
ipcMain.on( 'user-exit', () => {
  app.quit()
} )

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
