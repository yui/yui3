#!/bin/bash

root=`pwd`

cd ./build-npm/

npm_base=`pwd`
yuitest="${npm_base}/node_modules/.bin/yuitest"

echo "Build Root: ${root}"
echo "NPM Base: ${npm_base}"
echo "YUITest: ${yuitest}"

echo "Running Tests.."

tests=`${root}/src/common/travis/gettests.js ${root}`

RETVAL=$?
[ $RETVAL -ne 0 ] && exit 1

echo "Tests: ${tests}"

cd ${root}
${yuitest} ${tests}
