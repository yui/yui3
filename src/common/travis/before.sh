#!/bin/bash

echo "Before Script: `pwd`"

cd "$(dirname "$0")"

echo "cd: `pwd`"

cd ../../yui;
wait

if [ -n "$TRAVIS" ]; then
    echo "Installing Shifter.."
    npm -g install shifter -loglevel silent
    echo "Installing Yogi"
    npm -g install yogi -loglevel silent
    cd ../
    echo "building entire library";
    shifter --walk --no-lint --cache
    cd yui;
else 
    make npm
fi
