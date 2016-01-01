var app = require('app');
// var BrowserWindow = require('browser-window');

var window = require('electron-window');

process.argv.forEach(function (val, index, array) {
   console.log(index + ': ' + val);
 });

app.on('ready', function() {
    
    var options = {
            width: 800,
            height: 600,
            icon: 'assets/icon.png',
            javascript : false
        };
    
    var mainWindow = window.createWindow(options);   
    var args = {
        data: 'some secret data'
    };
    
    mainWindow.setMenu(null);
    mainWindow.showUrl(__dirname + '/index.html', args);
    // mainWindow.loadURL('file://' + __dirname + '/index.html', args);
    // mainWindow.showUrl(__dirname + '/index.html', args);

});
