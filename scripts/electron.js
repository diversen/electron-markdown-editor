const {dialog} = require('electron').remote
const fs = require('fs');
const isDefined = require('is-defined-eval');

// Shell var a const in the main process. 
// This is the rederer prodcess - so it is ok. 
const {shell} = require('electron');

var insertLine = function (doc, pos, text) {
    var cursor = doc.getCursor(); // gets the line number in the cursor position
    doc.replaceRange(text, pos);
};

// Matjax
var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

$(document).ready(function () {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    $('.markdown').keyup(function () {
        delay(function () {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        }, 2000);
    });
});

$(document).on('click', "a", function (event) {
    event.preventDefault();
    var url = $(this).attr('href');
    if (url) {
        shell.openExternal(url);
    }
});

// Read file if given from commandline
$(document).ready(function () {
    var isBinaryFile = require("isbinaryfile");
    if (__args__.file !== null) {
        if (!isBinaryFile.sync(__args__.file)) {
            readMarkdownFile(__args__.file);
        }
    }
});

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
    return str;
}

function readMarkdownFile(fileName) {

    store.currentFile = fileName;
    fs.readFile(fileName, 'utf-8', function (err, data) {
        if (err) {
            store.currentFile = null;
            UIkit.notify({
                message: err,
                status: 'error',
                timeout: 2000,
                pos: 'bottom-left'
            });
            store.currentFile = null;
            return false;
        }
        var editor = $('.CodeMirror')[0].CodeMirror;
        editor.setValue(data);
        editor.refresh();
        UIkit.notify({
            message: 'File opened',
            status: 'info',
            timeout: 2000,
            pos: 'bottom-left'
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
                message: err,
                status: 'error',
                timeout: 2000,
                pos: 'bottom-left'
            });
            return false;
        }

        store.currentFile = fileName;
        UIkit.notify({
            message: 'Saved file ' + fileName,
            status: 'info',
            timeout: 2000,
            pos: 'bottom-left'
        });
        return true;
    });
}

function saveFile() {

    if (typeof store.currentFile === "undefined" || store.currentFile == null) {
        saveFileAs();

    } else {
        var fileName = store.currentFile;
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
    dialog.showOpenDialog({filters: [{name: 'Insert image', extensions: ['jpg', 'gif', 'svg', 'png', 'mp4']}]}, function (fileNames) {
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
    dialog.showOpenDialog({filters: [{name: 'Insert video', extensions: ['mp4']}]}, function (fileNames) {
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
};

function openFileFile() {
    dialog.showOpenDialog({filters: [{name: 'Insert video', extensions: ['*']}]}, function (fileNames) {
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
};

$(document).ready(function () {

    $(".table-form").submit(function (e) {
        e.preventDefault();
        var rows = $(".table-rows").val();
        var cols = $(".table-cols").val();

        // Insure it is ints
        rows = parseInt(rows);
        cols = parseInt(cols);

        var text = mdtable.create(rows, cols);

        text = text.replace(/^\s+|\s+$/g, '');

        var editor = $('.CodeMirror')[0].CodeMirror;
        editor.refresh();

        var doc = editor.getDoc();

        doc.setCursor(store.pos);
        editor.focus();

        insertLine(doc, store.pos, text);

        var modal = UIkit.modal("#table-modal");
        modal.hide();

        return false;
    });
});


