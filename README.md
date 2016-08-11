# Electron markdown editor

## Screenshot

![Screenshot](https://cdn.rawgit.com/diversen/electron-markdown-editor/master/resources/electron-markdown.png) 

[<img src="https://cdn.rawgit.com/diversen/electron-markdown-editor/master/resources/electron-logo.svg" align="right" width="200">](http://electron.atom.io)

A markdown editor for the desktop using:

* [Electron](http://electron.atom.io/)
* The CSS frammework [Uikit](http://getuikit.com/) 
* The Uikit [HTML-editor](http://getuikit.com/docs/htmleditor.html)

## Features

* WYSIWYG
* Shortcuts (ctrl-S, Ctrl-O) `save` and `open`
* Dialog for image
* Dialog for videos (mp4)
* Dialog for tables
* Live preview of code [highlight.js](https://highlightjs.org/) with `tiles`, e.g.: 

    \~~~php
    &lt;?php

    echo "hello world";

    ?>
    \~~~

Becomes: 

~~~php
<?php

echo "hello world";

?>
~~~

* Live preview of Math [MathJax](https://www.mathjax.org/), e.g.:

$$\sum_{i=0}^n i^2 = \frac{(n^2+n)(2n+1)}{6}$$


* The parsing of markdown is done with [markdown-it](https://github.com/markdown-it/markdown-it) 

## Install

Use npm:

Global: 

    sudo npm install electron-markdown-editor -g
    
You can specify a file on the commandline. E.g.: 
    
    electron-markdown-editor README.md

## Development: 

    git clone https://github.com/diversen/electron-markdown-editor
    cd electron-markdown-editor 
    npm install

Run electron-markdown-editor: 

    ./bin/electron-markdown-editor README.md

