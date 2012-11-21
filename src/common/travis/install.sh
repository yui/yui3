#!/bin/bash

echo "Starting install: `pwd`"

echo "User: $USER" 

#if [ "$TRAVIS_PULL_REQUEST" = "true" ]; then
#    if [ -n "$TRAVIS_PULL_REQUEST_NUMBER" ]; then
#        echo "--------------------------------------------"
#        echo "This is a Pull Request build, fetching files"
#        ./src/common/travis/get_pull_files.js
#        if [[ $? != 0 ]] ; then
#            exit 1
#        fi
#        echo "--------------------------------------------"
#    fi
#fi
cd ./build-npm;

echo "NPM Build Dir: `pwd`"
wait
echo "Installing NPM Modules"
npm install -loglevel silent --production
wait
cd  ../

if [ ! -L ./node_modules ]; then
    ln -s ./build-npm/node_modules ./
fi

echo "NPM Install Complete"
echo ""

