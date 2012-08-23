#!/bin/bash

root=`pwd`

cd ./build-npm/

npm_base=`pwd`
yuitest="${npm_base}/node_modules/.bin/yuitest"
yogi="${npm_base}/node_modules/.bin/yogi"
grover="${npm_base}/node_modules/.bin/grover"

echo "Build Root: ${root}"
echo "NPM Base: ${npm_base}"
echo "yogi: ${yogi}"
echo "YUITest: ${yuitest}"
echo "Grover: ${grover}"
echo "PhantomJS: `phantomjs -v`"

echo "Running Tests.."

#tests=`${root}/src/common/travis/gettests.js ${root}`

#RETVAL=$?
#[ $RETVAL -ne 0 ] && exit 1
#
#echo "Tests: ${tests}"
#
#cd ${root}
#${yuitest} ${tests}

cd ${root}/src
echo "cd ${root}/src"
echo "yogi test --cli --debug"
${yogi} test --cli --debug

RETVAL=$?
[ $RETVAL -ne 0 ] && exit 1

con=20

if [ -n "$TRAVIS" ]; then
    con=5
    if [ "${TRAVIS_NODE_VERSION}" = "0.8" ]; then
        echo "Starting Grover Tests"
        ${grover} --server -t 200 -c ${con} -i ./src/common/node/batch.js
    else
        echo "Skipping Grover tests for this Node version (not needed)"
    fi
else
    echo "Starting Grover Tests"
    ${grover} --server -t 180 -c ${con} -i ./src/common/node/batch.js
fi


