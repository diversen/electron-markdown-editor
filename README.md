![Screenshot](electron-markdown.png)

# Electron markdown editor

A nice electron markdown editor for the desktop using `electron`. 

Made with the `Uikit Htmleditor` - which offers a live preview using codemirror as the editor. There is also  added some extra features:

* The ability to insert images / and mp4 movies using electrons file dialog. 
* Live preview of code highlighting - using highlight.js
* Live preview of mathjax - using mathjax.js
* The parsing of markdown is done using markdown-it

# Install

    npm install -g electron-prebuilt
    git clone https://github.com/diversen/electron-markdown-editor
    cd electron-markdown-editor 
    npm install
    electron main.js

# Development

Building of the `scripts/bundle.js` is done with `browserify` and `watchify`

    watchify scripts/md.js -o scripts/bundle.js

Or: 

    watchify scripts/md.js -o 'uglifyjs -cm > scripts/bundle.js'

# Build

    Build for win32. See `build.sh`

The final installer file is quite large as the system uses mathjax which takes up about 175MB or so. 
