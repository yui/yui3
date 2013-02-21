#!/bin/bash

root=`pwd`

cd ./build-npm/

npm_base=`pwd`
yogi=`which yogi`

echo "Build Root: ${root}"
echo "NPM Base: ${npm_base}"
echo "yogi: ${yogi}"
echo "PhantomJS: `phantomjs -v`"

echo "Running Tests.."

cd ${root}/src
echo "cd ${root}/src"
con=""
timeout=""
cli=""
extra=""

if [ -n "$TRAVIS" ]; then
    con="-c 8 "
    timeout="-t 500 "
    if [ "${TRAVIS_NODE_VERSION}" = "0.8" ]; then
        extra="-x editor"
    else
        echo "Skipping Grover tests for this Node version (not needed)"
        extra="--cli "
    fi
fi

args="${timeout} ${con} ${extra}"
echo "yogi test ${args}"
${yogi} test ${args}
