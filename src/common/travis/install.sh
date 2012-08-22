#!/bin/bash

echo "Starting install: `pwd`"

cd ./build-npm;

echo "NPM Build Dir: `pwd`"
wait
echo "Installing NPM Modules"
#npm install -loglevel silent
if [ -n "$TRAVIS" ]; then
    sudo npm install
else
    npm install
fi
wait
echo "Installing testing tools"
#npm install -loglevel silent yuitest grover yuidocjs
if [ -n "$TRAVIS" ]; then
    sudo npm install yuitest grover yuidocjs
else
    npm install yuitest grover yuidocjs
fi
wait
cd  ../

if [ ! -L ./node_modules ]; then
    ln -s ./build-npm/node_modules ./
fi

echo "NPM Install Complete"
echo ""
