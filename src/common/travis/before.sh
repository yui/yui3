#!/bin/bash

echo "Before Script: `pwd`"

cd "$(dirname "$0")"

echo "cd: `pwd`"

cd ../../yui;
wait

make npm

# FUTURE
#wait
#cd ../../
#wait
#echo "cd: `pwd`"
#wait
#echo "Generating Coverage Build"
#jscoverage --encoding=utf-8 ./build ./build-coverage
#wait
#for file in build-coverage/*; do
#    echo `basename $file`
#    name=`basename $file`
#    cp ./build-coverage/$name/$name.js ./build-coverage/$name/$name-min.js
#    cp ./build-coverage/$name/$name.js ./build-coverage/$name/$name-debug.js
#done
