var app = require('app');
var BrowserWindow = require('browser-window');

// process.argv.forEach(function (val, index, array) {
//   console.log(index + ': ' + val);
// });


// process.env['ENV_ID'] = 'test'

app.on('ready', function() {
    
    var mainWindow = new BrowserWindow(
        {
            width: 800, 
            height: 600,
            icon: 'assets/icon.png',
            javascript : false
        }
    );
    mainWindow.setMenu(null);
    //BrowserWindow.setMenu(null);
    mainWindow.loadUrl('file://' + __dirname + '/index.html');
});

