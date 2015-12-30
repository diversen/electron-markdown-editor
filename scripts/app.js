var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();


$(document).ready(function () {
    $('.markdown').keyup(function () {
        delay(function () {
            console.log('Math reparsed');
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        }, 2000);
    });
});

// Read images from 'images' dir.
$(document).ready(function () {
    if (app.env === 'electron') {
        //var files = getFiles('images');
        //var str = getFilesAsMd(files);
        //$('.uk-modal-dialog').append(str);
    } else {
        if(typeof markedit_helper === "undefined") {
            return;
        }

        //checkoutFiles().then(createEpub)
        getImages().then(getVideos);
        //getAssets();
    }
});


$(document).ready(function () {
    //
    $(".uk-modal-dialog").on('click', '.uikit-cm-image', function (event) {

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

        var modal = UIkit.modal("#my-id");
        modal.hide();

        return false;
    });
});

var insertLine = function (doc, pos, text) {
    var cursor = doc.getCursor(); // gets the line number in the cursor position
    doc.replaceRange(text, pos);
};
