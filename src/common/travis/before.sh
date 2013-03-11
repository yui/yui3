#!/bin/bash

echo "Before Script: `pwd`"

cd "$(dirname "$0")"

echo "cd: `pwd`"

cd ../../yui;
wait

if [ -n "$TRAVIS" ]; then
    echo "Installing Yogi"
    npm -g install yogi -loglevel silent
    cd ../
    echo "building entire library with yogi";
    yogi build --no-lint --cache --no-coverage
    cd yui;
else 
    make npm
fi
