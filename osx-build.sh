#!/bin/sh

# Check requirements: https://www.npmjs.com/package/electron-builder
#
# E.g. Linux
#
# add-apt-repository ppa:ubuntu-wine/ppa -y
# apt-get update
# apt-get install wine nsis -y

rm -rf ./Electron\ Markdown\ Editor-osx-x64
# rm -rf ./dist

mkdir -p ./dist

# electron-builder dist/osx/someFancy.app --platform=osx --out=/some/path/ --config=config.json


electron-packager . 'Electron Markdown Editor' --platform=darwin --arch=x64 --version=0.34.0
electron-builder ./Electron\ Markdown\ Editor-osx-x64 --platform=osx --out=./dist --config=./builder.json

