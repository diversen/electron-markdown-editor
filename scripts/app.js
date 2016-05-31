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

// Read images from 'images' dir.
$(document).ready(function () {
    if (app.env === 'electron') {

    } else {
        if(typeof markedit_helper === "undefined") {
            return;
        }
        
        getImages();
        getVideos();
        getFiles();
    }
});


$(document).ready(function () {

    $(".image-modal").on('click', '.uikit-cm-image', function (event) {

        event.preventDefault();

        var href = $(this).attr('href');
        var title = $(this).attr('title');
        if (typeof title == 'undefined') {
            title = 'title';
        }

        var editor = $('.CodeMirror')[0].CodeMirror;
        editor.refresh();

        var doc = editor.getDoc();

        
        doc.setCursor(store.pos);
        editor.focus();

        var text = '![' + title + '](' + href + ")";

        insertLine(doc, store.pos, text);

        var modal = UIkit.modal("#image-modal");
        modal.hide();

        return false;
    });
});

$(document).ready(function () {

    $(".file-modal").on('click', '.uikit-cm-image', function (event) {

        event.preventDefault();

        var href = $(this).attr('href');
        var title = $(this).attr('title');
        if (typeof title == 'undefined') {
            title = 'title';
        }

        var editor = $('.CodeMirror')[0].CodeMirror;
        editor.refresh();

        var doc = editor.getDoc();

        
        doc.setCursor(store.pos);
        editor.focus();

        var text = '[' + title + '](' + href + ")";

        insertLine(doc, store.pos, text);

        var modal = UIkit.modal("#file-modal");
        modal.hide();

        return false;
    });
});

$(document).ready(function () {

    $(".video-modal").on('click', '.uikit-cm-image', function (event) {

        event.preventDefault();

        var href = $(this).attr('href');
        var title = $(this).attr('title');
        if (typeof title == 'undefined') {
            title = 'title';
        }

        var editor = $('.CodeMirror')[0].CodeMirror;
        editor.refresh();

        var doc = editor.getDoc();

        

        
        doc.setCursor(store.pos);
        editor.focus();

        var text = '![' + title + '](' + href + ")";

        insertLine(doc, store.pos, text);

        var modal = UIkit.modal("#video-modal");
        modal.hide();

        return false;
    });
});

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


var insertLine = function (doc, pos, text) {
    var cursor = doc.getCursor(); // gets the line number in the cursor position
    doc.replaceRange(text, pos);
};
