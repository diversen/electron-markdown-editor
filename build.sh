#!/bin/sh

rm -rf electron-markdown-editor-win32-x64/
rm -rf ./dist

mkdir -p ./dist

electron-packager . 'electron-markdown-editor' --platform=win32 --arch=x64 --version=0.34.0
electron-builder ./electron-markdown-editor-win32-x64 --platform=win --out=./dist --config=./builder.json

