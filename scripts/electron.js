var api = window.api;

var pendingOpenFile = null;
var pendingOpenTimer = null;

function getEditor() {
    var editorEl = $('.CodeMirror')[0];
    if (!editorEl || !editorEl.CodeMirror) {
        return null;
    }
    return editorEl.CodeMirror;
}

function schedulePendingOpen(fileName) {
    pendingOpenFile = fileName;
    if (pendingOpenTimer) {
        return;
    }
    pendingOpenTimer = setInterval(function () {
        var editor = getEditor();
        if (!editor) {
            return;
        }
        clearInterval(pendingOpenTimer);
        pendingOpenTimer = null;
        var fileToOpen = pendingOpenFile;
        pendingOpenFile = null;
        if (fileToOpen) {
            readMarkdownFile(fileToOpen);
        }
    }, 100);
}

var insertLine = function (doc, pos, text) {
    var cursor = doc.getCursor(); // gets the line number in the cursor position
    doc.replaceRange(text, pos);
};

// Math rendering + debounce helper
var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

function renderMath() {
    if (typeof window.renderMathInElement !== 'function') {
        return;
    }
    var container = document.querySelector('.uk-htmleditor-preview > div');
    if (!container) {
        return;
    }
    window.renderMathInElement(container, {
        delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true }
        ],
        throwOnError: false
    });
}

function renderMathSoon() {
    delay(function () {
        renderMath();
    }, 300);
}

$(document).ready(function () {
    renderMathSoon();
    $('.markdown').keyup(function () {
        renderMathSoon();
    });
});

$(document).on('click', 'a', function (event) {
    event.preventDefault();
    var url = $(this).attr('href');
    if (url) {
        api.openExternal(url);
    }
});

// Read file if given from commandline
$(document).ready(function () {
    var params = new URLSearchParams(window.location.search);
    var startupFile = params.get('file');
    if (startupFile) {
        api.isBinaryFile(startupFile).then(function (isBinary) {
            if (!isBinary) {
                readMarkdownFile(startupFile);
            }
        });
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
    var editor = getEditor();
    if (!editor) {
        schedulePendingOpen(fileName);
        return false;
    }
    api.readTextFile(fileName).then(function (data) {
        editor.setValue(data);
        editor.refresh();
        renderMathSoon();
        UIkit.notify({
            message: 'File opened',
            status: 'info',
            timeout: 2000,
            pos: 'bottom-left'
        });
        store.currentFile = fileName;
        return true;
    }).catch(function (err) {
        store.currentFile = null;
        UIkit.notify({
            message: err,
            status: 'error',
            timeout: 2000,
            pos: 'bottom-left'
        });
        store.currentFile = null;
        return false;
    });
}

async function openFile() {
    var fileName = await api.openMarkdownDialog();
    if (!fileName) {
        return;
    }
    readMarkdownFile(fileName);
}

function saveMarkdownFile(fileName, data) {
    api.writeTextFile(fileName, data).then(function () {
        store.currentFile = fileName;
        UIkit.notify({
            message: 'Saved file ' + fileName,
            status: 'info',
            timeout: 2000,
            pos: 'bottom-left'
        });
        return true;
    }).catch(function (err) {
        store.currentFile = null;
        UIkit.notify({
            message: err,
            status: 'error',
            timeout: 2000,
            pos: 'bottom-left'
        });
        return false;
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

async function saveFileAs() {
    var fileName = await api.saveMarkdownDialog();
    if (!fileName) {
        return;
    }

    var editor = $('.CodeMirror')[0].CodeMirror;
    var value = editor.getValue();
    saveMarkdownFile(fileName, value);
}

async function openImageFile() {
    var fileName = await api.openImageDialog();
    if (!fileName) {
        return;
    }

    title = 'title';

    var editor = $('.CodeMirror')[0].CodeMirror;
    editor.refresh();

    var doc = editor.getDoc();
    doc.setCursor(store.pos);
    editor.focus();

    var text = '![' + title + '](' + fileName + ")";

    insertLine(doc, store.pos, text);
}

async function openVideoFile() {
    var fileName = await api.openVideoDialog();
    if (!fileName) {
        return;
    }

    title = 'title';

    var editor = $('.CodeMirror')[0].CodeMirror;
    editor.refresh();

    var doc = editor.getDoc();
    doc.setCursor(store.pos);
    editor.focus();

    var text = '![' + title + '](' + fileName + ")";

    insertLine(doc, store.pos, text);
};

async function openFileFile() {
    var fileName = await api.openFileDialog();
    if (!fileName) {
        return;
    }

    title = 'title';

    var editor = $('.CodeMirror')[0].CodeMirror;
    editor.refresh();

    var doc = editor.getDoc();
    doc.setCursor(store.pos);
    editor.focus();

    var text = '[' + title + '](' + fileName + ")";

    insertLine(doc, store.pos, text);
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

api.onMenuOpenFile(function () {
    openFile();
});

api.onMenuSaveFile(function () {
    saveFile();
});

api.onMenuSaveFileAs(function () {
    saveFileAs();
});

api.onAppOpenFile(function (event, filePath) {
    if (!filePath) {
        return;
    }
    api.isBinaryFile(filePath).then(function (isBinary) {
        if (!isBinary) {
            readMarkdownFile(filePath);
        }
    });
});
