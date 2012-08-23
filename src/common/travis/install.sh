#!/bin/bash

echo "Starting install: `pwd`"

cd ./build-npm;

echo "NPM Build Dir: `pwd`"
wait
echo "Installing NPM Modules"
npm install -loglevel silent
wait
cd  ../

if [ ! -L ./node_modules ]; then
    ln -s ./build-npm/node_modules ./
fi

echo "NPM Install Complete"
echo ""
