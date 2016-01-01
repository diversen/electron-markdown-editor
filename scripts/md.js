'use strict';

var hljs = require('highlight.js');

var highlighter = function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }

    try {
      return hljs.highlightAuto(str).value;
    } catch (__) {}

    return ''; // use external default escaping
  };

var md = require('markdown-it')({
    
    highlight: highlighter, 
    html: true, // Enable HTML tags in source
    xhtmlOut: true, // Use '/' to close single tags (<br />).
    // This is only for full CommonMark compatibility.
    breaks: false, // Convert '\n' in paragraphs into <br>
    langPrefix: 'language-', // CSS language prefix for fenced blocks. Can be
    // useful for external highlighters.
    linkify: true, // Autoconvert URL-like text to links

    // Enable some language-neutral replacement + quotes beautification
    typographer: false,
    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: '“”‘’'
})

.use(require('markdown-it-html5-embed'), {
    html5embed: {
        useImageSyntax: true, // Enables video/audio embed with ![]() syntax (default) 
            // useLinkSyntax: true,   // Enables video/audio embed with []() syntax
            attributes: {
                'audio': 'width="100%" controls class="audioplayer"',
                'video': 'width="100%" class="audioplayer" controls'
            }
        }
    }
);

window.md = md;
