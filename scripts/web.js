
function getImages() {
    var url = '/image/rpc?reference=' + markedit_helper.reference + '&parent_id=' + markedit_helper.parent_id;
    
    return $.getJSON(url, function (data) {
        $('.image-modal').append('<i class="fa fa-picture-o"></i></i><hr />');
        $.each(data.images, function (i, item) {
            //console.log(item);
            var a = $('<a></a>').attr('href', item.url_m).attr('title', item.title).attr('class', 'uikit-cm-image uk-thumbnail');
            var img = $('<img />').attr('src', item.url_s);
            a.append(img);
            $('.image-modal').append(a);

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
        $('.video-modal').append('<hr /><i class="fa fa-video-camera"></i><hr />');
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
}
