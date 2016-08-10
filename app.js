const { app } = require('electron')
const path = require('path')
const window = require('electron-window')

var args = [];
var readFile = null;

let mainWindow;
// Debug - should be a flag
// require('electron-debug')({showDevTools: true}); 

process.argv.forEach(function (val, index, array) {

   if (index == 2) {
       readFile = val;
   } else {
       readfile = null;
   }
});

function createWindow() {
    
    var options = {
            width: 800,
            height: 600,
            icon: 'assets/icon.png',
            javascript : false
        };
    
    mainWindow = window.createWindow(options);   
    const args = {
        file: readFile
    };
    
    mainWindow.setMenu(null);
    mainWindow.showUrl(__dirname + '/index.html', args);
    
    mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}


app.on('ready', createWindow );
