#!/bin/sh

# Check requirements: https://www.npmjs.com/package/electron-builder
#
# E.g. Linux
#
# add-apt-repository ppa:ubuntu-wine/ppa -y
# apt-get update
# apt-get install wine nsis -y

rm -rf ./Electron\ Markdown\ Editor-win32-x64
rm -rf ./dist

mkdir -p ./dist

electron-packager . 'Electron Markdown Editor' --platform=win32 --arch=x64 --version=0.34.0
electron-builder ./Electron\ Markdown\ Editor-win32-x64 --platform=win --out=./dist --config=./builder.json

