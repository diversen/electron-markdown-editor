# Electron markdown editor

A simple electron markdown editor made in order to test out `electron`. 

Made with the `Uikit HtmlEditor` - with live preview and using codemirror as the editor. There is also  added some extra features:

* The ability to insert images using electrons file dialog. 
* Live preview of code highlighting - using highlight.js
* Live preview of mathjax - using mathjax.js
* The parsing of markdown is done using markdown-it

# Install

    npm install -g electron-prebuilt
    git clone github.com/diversen/electron-markdown-editor
    cd electron-markdown-editor 
    npm install
    electron main.js

# Development

Building of the `scripts/bundle.js` is done with `browserify` and `watchify`

    watchify scripts/md.js -o 'uglifyjs -cm > scripts/bundle.js'

# Build

    Build for win32. See `build.sh`


