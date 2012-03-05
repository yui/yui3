#!/bin/bash

type -P node &>/dev/null || { echo "I require node but it's not installed.  Aborting." >&2; exit 1; }

type -P yuitest &>/dev/null || { echo "I require yuitest but it's not installed. (npm -g i yuitest)  Aborting." >&2; exit 1; }

npmdir="$PWD/../../build-npm"

if [ ! -d "$npmdir" ]; then
    echo "local npm build not found, building"
    cd ../yui
    ant -f npm.xml
    wait
    cd -
fi
