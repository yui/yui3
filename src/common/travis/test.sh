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
$yuitest ${root}/src/io/tests/cli/run.js ${root}/src/loader/tests/cli/loader.js
