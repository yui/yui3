#!/bin/bash

echo "Starting install: `pwd`"

cd ./build-npm;

echo "NPM Build Dir: `pwd`"
wait
echo "Installing NPM Modules"
if [ -n "$TRAVIS" ]; then
    sudo npm install -loglevel silent
else
    npm install -loglevel silent
fi
wait
echo "Installing testing tools"
if [ -n "$TRAVIS" ]; then
    sudo npm install -loglevel silent yuitest grover yuidocjs
else
    npm install -loglevel silent yuitest grover yuidocjs
fi
wait
cd  ../

if [ ! -L ./node_modules ]; then
    ln -s ./build-npm/node_modules ./
fi

echo "NPM Install Complete"
echo ""
