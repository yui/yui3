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

if [ -n "$TRAVIS_PULL_REQUEST" ]; then
    ./src/common/travis/get_pull_files.js
    if [[ $? != 0 ]] ; then
        exit 1
    fi
    echo "Reinstalling node deps after YUI module build"
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
fi
