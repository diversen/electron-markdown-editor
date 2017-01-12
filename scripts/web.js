// Image modal for browser
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

// File modal for browser
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

// Video modal for browser
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

// Read images from 'images' dir.
$(document).ready(function () {
    if (PROCESS_CONTEXT === 'browser'){
        
        if(typeof markedit_helper === "undefined") {
            return;
        }
        
        getImages();
        getVideos();
        getFiles();
    }
});

// Example on some web dialogs
function getSchemeAndUrl () {
    var url = window.location.href;
    var arr = url.split("/");
    return arr[0] + "//" + arr[2];
}

// Attach images to modal dialog
function getImages() {
    var url = '/image/rpc?reference=' + markedit_helper.reference + '&parent_id=' + markedit_helper.parent_id;
    
    return $.getJSON(url, function (data) {
        
        $('.image-modal').append('<i class="fa fa-picture-o"></i><hr />');
        $.each(data.images, function (i, item) {
            
            var a = $('<a></a>').attr('href', item.url_m).attr('title', item.title).attr('class', 'uikit-cm-image uk-thumbnail');
            var img = $('<img />').attr('src', item.url_s);
            a.append(img);
            $('.image-modal').append(a);

        });
    });
}

// Attach files to modal dialog
function getFiles() {
    
    var url = '/files/rpc?reference=' + markedit_helper.reference + '&parent_id=' + markedit_helper.parent_id;
    var sAndU = getSchemeAndUrl();
    
    return $.getJSON(url, function (data) {
        $('.file-modal').append('<i class="fa fa-file"></i><hr />');
        $.each(data.files, function (i, item) {
            //console.log(item);
            if (item.title == '') {
                item.title = item.url_m;
            }
            
            item.title = item.title.replace(/^.*[\\\/]/, '');
            var a = $('<a></a>').attr('href', sAndU + item.url_m).attr('title', item.title).attr('class', 'uikit-cm-image uk-thumbnail').text(item.title);
            $('.file-modal').append(a);
        });
    });
}

// A video template 
var videoTemplate = 
        '<a title="<%this.abstract%>" href="<%this.title%>" class="uk-thumbnail uikit-cm-image">' +
            '<video width="160" controls>' +
              ' <source src="<%this.title%>" type="video/mp4">' +
              ' Your browser does not support HTML5 video.' +
        '</video></a>';

// Attach videos to modal dialog
function getVideos() {
    var url = '/video/rpc?reference=' + markedit_helper.reference + '&parent_id=' + markedit_helper.parent_id;
    return $.getJSON(url, function (data) {
        $('.video-modal').append('<i class="fa fa-video-camera"></i><hr />');
        $.each(data.videos, function (i, item) {            
            $('.video-modal').append(TemplateEngine(videoTemplate, {
                title:item.mp4, href:item.mp4, abstract:item.abstract}));
        });
    });

}
// A simple template engine. Should be simpler
var TemplateEngine = function(html, options) {
    var re = /<%([^%>]+)?%>/g, reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, code = 'var r=[];\n', cursor = 0, match;
    var add = function(line, js) {
        js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
            (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
        return add;
    }
    while(match = re.exec(html)) {
        add(html.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
    }
    add(html.substr(cursor, html.length - cursor));
    code += 'return r.join("");';
    return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
};

// Table dialog for both browser
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

// Insert a line
var insertLine = function (doc, pos, text) {
    var cursor = doc.getCursor(); // gets the line number in the cursor position
    doc.replaceRange(text, pos);
};