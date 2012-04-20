#!/bin/bash

root=`pwd`

cd ./build-npm/

npm_base=`pwd`
yuitest="${npm_base}/node_modules/.bin/yuitest"

echo "Build Root: ${root}"
echo "NPM Base: ${npm_base}"
echo "YUITest: ${yuitest}"

echo "Running Tests.."

cd $root
wait
echo "Running IO Tests"
cd src/io;
make test
wait
cd $root
echo "Running Loader Tests"
cd src/loader;
make test
