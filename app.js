const app = require('electron').app;
const path = require('path');
const window = require('electron-window');
const shell = require('electron').shell;
const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;

var readFile = null;

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
    
    let mainWindow;
    mainWindow = window.createWindow(options); 
    
    let args = {
        file: readFile
    };
    
    mainWindow.setMenu(null);
    mainWindow.showUrl(__dirname + '/index.html', args);
    
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });
        
    //mainWindow.maximize - just to test
    mainWindow.on('maximize', function () {
        console.log('maximize');
    });
        
    return mainWindow;

}

app.on('ready', function () {
    mainWindow = createWindow();
    /*
    mainWindow.on('resize', function () {
        //console.log('resize'); 
    });*/
});

app.on('activate', function () {
    mainWindow.restore();
});

app.on('before-quit', function () {
    // Not used. Just to remember the options
}) ;

app.on('open-file', function () {
    // Not used. Just to remember the options
}) ;
