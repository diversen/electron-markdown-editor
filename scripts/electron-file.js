var isDefined = function (attr) {
    if (typeof attr !== typeof undefined && attr !== false) {
        return true;
    }
    return false;
};

var {shell} = require('electron')
$(document).on('click', "a", function (event) {
    event.preventDefault();
    var url = $(this).attr('href');
    if (isDefined(url)) {
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

