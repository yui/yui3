#!/bin/bash

echo "Before Script: `pwd`"

cd "$(dirname "$0")"

echo "cd: `pwd`"

cd ../../yui;
wait

if [ -n "$TRAVIS" ]; then
    echo "Installing Shifter.."
    sudo npm cache clean
    sudo npm -g install -loglevel silent shifter
fi

make npm
