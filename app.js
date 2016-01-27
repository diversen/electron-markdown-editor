var app = require('app');
var args = [];
var window = require('electron-window');
var readFile = null;

process.argv.forEach(function (val, index, array) {

   if (index == 2) {
       readFile = val;
   } else {
       readfile = null;
   }
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
        file: readFile
    };
    
    mainWindow.setMenu(null);
    mainWindow.showUrl(__dirname + '/index.html', args);
});
