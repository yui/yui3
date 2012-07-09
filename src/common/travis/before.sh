#!/bin/bash

echo "Before Script: `pwd`"

cd "$(dirname "$0")"

echo "cd: `pwd`"

cd ../../yui;
wait

make npm

# FUTURE CODE COVERAGE
#wait
#cd ../../
#wait
#echo "cd: `pwd`"
#wait
#echo "Generating Coverage Build"
#jscoverage --encoding=utf-8 ./build ./build-coverage
#wait
#for file in build-coverage/*; do
#    name=`basename $file`
#    if [ -f "./build-coverage/$name/$name.js" ]; then
#        cp ./build-coverage/$name/$name.js ./build-coverage/$name/$name-min.js
#        cp ./build-coverage/$name/$name.js ./build-coverage/$name/$name-debug.js
#    fi
#done
#wait
#mv ./build ./build.bak
#wait
#mv ./build-coverage ./build
#wait
