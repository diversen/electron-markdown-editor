var {remote} = require('electron')
const {dialog} = require('electron').remote
var fs = require('fs');


$(document).ready(function () {  
    $(document).bind('keydown', 'ctrl+s', function(e) {
        if (e.ctrlKey && (e.which == 83)) {
            e.preventDefault();
            saveFile();
            return false;
        }
    });
});


/**
 * 
 * @param {type} dir
 * @param {type} files_
 * @returns {@var;files_|Array}
 */

function getFiles(dir, files_) {
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files) {
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

function getFilesAsMd(files) {
    var str = '';
    $.each(files, function (index, value) {
        str = str + '<a class="uikit-cm-image uk-thumbnail" href="' + value + '"><img src="' + value + '" alt=""></a>';
    });
    console.log(str);
    return str;
}

function readMarkdownFile (fileName) {
    
        store.currentFile = fileName;
        console.log("Stored currect" + store.currentFile);
        fs.readFile(fileName, 'utf-8', function (err, data) {
            if (err) {
                store.currentFile = null;
                UIkit.notify({
                    message : err,
                    status  : 'error',
                    timeout : 2000,
                    pos     : 'bottom-left'
                });
                store.currentFile = null;
                return false;
            }
            var editor = $('.CodeMirror')[0].CodeMirror;
            editor.setValue(data);
            editor.refresh();
            UIkit.notify({
                message : 'File opened',
                status  : 'info',
                timeout : 2000,
                pos     : 'bottom-left'
            });
            store.currentFile = fileName;
            return true;
        });
} 



function openFile() {
    dialog.showOpenDialog({filters: [
            {name: 'markdown', extensions: ['txt', 'md', 'markdown']}
        ]}, function (fileNames) {
        if (fileNames === undefined) {
            return;
        }
        
        var fileName = fileNames[0];
        readMarkdownFile(fileName);

    });
}

function saveMarkdownFile(fileName, data) {
    fs.writeFile(fileName, data, function (err) {
        if (err) {
            store.currentFile = null;
            UIkit.notify({
                message : err,
                status  : 'error',
                timeout : 2000,
                pos     : 'bottom-left'
            });
            return false;
        }
        
        console.log(fileName);
        store.currentFile = fileName;
        UIkit.notify({
            message : 'Saved file ' + fileName,
            status  : 'info',
            timeout : 2000,
            pos     : 'bottom-left'
        });
        return true;
    });
}

function saveFile() {

    if (typeof store.currentFile === "undefined" || store.currentFile == null) {
        saveFileAs();

    } else {
        // console.log('saveFile');
        fileName = store.currentFile;
        var editor = $('.CodeMirror')[0].CodeMirror;
        var value = editor.getValue();
        saveMarkdownFile(fileName, value);
        return true;
    }
}

function saveFileAs() {
    dialog.showSaveDialog({filters: [
            {name: 'Save as', extensions: ['txt', 'md', 'markdown']}
        ]}, function (fileName) {
        if (fileName === undefined) {
            return;
        }
        
        var editor = $('.CodeMirror')[0].CodeMirror;
        var value = editor.getValue();
        saveMarkdownFile(fileName, value);

    });
}

function openImageFile() {
    dialog.showOpenDialog({filters: [{name: 'Insert image', extensions: ['jpg', 'gif','svg','png','mp4']}]}, 
        function (fileNames) {
            if (fileNames === undefined) {
                return;
            }

            var fileName = fileNames[0];
            title = 'title';

            var editor = $('.CodeMirror')[0].CodeMirror;
            editor.refresh();

            var doc = editor.getDoc();
            doc.setCursor(store.pos);            
            editor.focus();

            var text = '![' + title + '](' + fileName + ")";

            insertLine(doc, store.pos, text);
    });
}

function openVideoFile() {
    dialog.showOpenDialog({filters: [{name: 'Insert video', extensions: ['mp4']}]}, 
        function (fileNames) {
            if (fileNames === undefined) {
                return;
            }

            var fileName = fileNames[0];
            title = 'title';

            var editor = $('.CodeMirror')[0].CodeMirror;
            editor.refresh();

            var doc = editor.getDoc();
            doc.setCursor(store.pos);
            editor.focus();

            var text = '![' + title + '](' + fileName + ")";

            insertLine(doc, store.pos, text);
    });
}

function openFileFile() {
    dialog.showOpenDialog({filters: [{name: 'Insert video', extensions: ['*']}]}, 
        function (fileNames) {
            if (fileNames === undefined) {
                return;
            }

            var fileName = fileNames[0];
            title = 'title';

            var editor = $('.CodeMirror')[0].CodeMirror;
            editor.refresh();

            var doc = editor.getDoc();
            doc.setCursor(store.pos);
            editor.focus();

            var text = '[' + title + '](' + fileName + ")";

            insertLine(doc, store.pos, text);
    });
}
