# Electron markdown editor

Test Test

A simple electron markdown editor made in order to test out `electron`. 

Made with the `Uikit HtmlEditor` - with live preview and using codemirror as the editor. There is also  added some extra features:

* The ability to insert images using electrons file dialog. 
* Live preview of code highlighting - using highlight.js
* Live preview of mathjax - using mathjax.js
* The parsing of markdown is done using markdown-it

# Install

git clone github.com/diversen/electron-markdown-editor
cd electron-markdown-editor 
npm install
electron main.js

# 

watchify scripts/md.js -o 'uglifyjs -cm > scripts/bundle.js'

# Build


electron-packager . FooBar --platform=darwin --arch=x64 --version=0.28.2

# win32

electron-builder electron-markdown-editor --platform=osx --out=./dist/win

