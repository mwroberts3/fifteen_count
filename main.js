// Modules
const { app, BrowserWindow, screen, ipcMain, webContents, shell } = require('electron')
const windowStateKeeper = require('electron-window-state')
require('./passport-steam/examples/signon/app')

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
    }
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
    }
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

// Auth Server
// const express = require('express')
//   , passport = require('passport')
//   , util = require('util')
//   , session = require('express-session')
//   , SteamStrategy = require('./index').Strategy;

//   passport.serializeUser(function(user, done) {
//     done(null, user);
//   });
  
//   passport.deserializeUser(function(obj, done) {
//     done(null, obj);
//   });

//   passport.use(new SteamStrategy({
//     returnURL: 'http://localhost:5481/auth/steam/return',
//     realm: 'http://localhost:5481/',
//     apiKey: '7D81BC02C39A9CFFC86EDB56A8B8F8CF'
//   },
//   function(identifier, profile, done) {
//     // asynchronous verification, for effect...
//     process.nextTick(function () {

//       // To keep the example simple, the user's Steam profile is returned to
//       // represent the logged-in user.  In a typical application, you would want
//       // to associate the Steam account with a user record in your database,
//       // and return that user instead.
//       profile.identifier = identifier;
//       return done(null, profile);
//     });
//   }
// ));

// const authApp = express();

// authApp.set('views', __dirname + '/views');
// authApp.set('view engine', 'ejs');

// // console.log(passport);


// authApp.use(passport.initialize());

// passport.authenticate('steam', { failureRedirect: '/' }),
//   function(req, res) {
//     res.redirect('/');
//   }

// // authApp.get('/', function(req, res){
// //   console.log(req.user);
// //   mainWindow.loadFile('renderer/title-screen.html')
// //   // res.render('index', { user: req.user });
// // });

// authApp.get('/account', ensureAuthenticated, function(req, res){
//   console.log(req.user);
//   res.render('index', { user: req.user });
// });

// authApp.get('/logout', function(req, res){
//   req.logout();
//   res.redirect('/');
// });

// authApp.get('/auth/steam',
//   passport.authenticate('steam', { failureRedirect: '/' }),
//   function(req, res) {
//     console.log("test")
//     res.redirect('/');
//   }
//   );

// // authApp.get('/auth/steam', (req, res) => {
// //   console.log('steam auth')
// //   res.redirect('/');
// // });
  
//   authApp.get('/auth/steam/return',
//   passport.authenticate('steam', { failureRedirect: '/' }),
//   function(req, res) {
//     res.redirect('/');
//   });

// authApp.listen(5481);

// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) { return next(); }
//   res.redirect('/');
// }

