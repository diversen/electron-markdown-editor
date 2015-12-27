#!/bin/sh

rm -rf Markdown\ Editor-win32-x64/
rm -rf ./dist

mkdir -p ./dist

electron-packager . 'Markdown Editor' --platform=win32 --arch=x64 --version=0.34.0
electron-builder ./Markdown\ Editor-win32-x64 --platform=win --out=./dist --config=./builder.json

