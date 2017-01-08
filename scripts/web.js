function getSchemeAndUrl () {
    var url = window.location.href;
    var arr = url.split("/");
    return arr[0] + "//" + arr[2];
}


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



var videoTemplate = 
        '<a title="<%this.abstract%>" href="<%this.title%>" class="uk-thumbnail uikit-cm-image">' +
            '<video width="160" controls>' +
              ' <source src="<%this.title%>" type="video/mp4">' +
              ' Your browser does not support HTML5 video.' +
        '</video></a>';

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
