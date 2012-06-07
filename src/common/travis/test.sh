#!/bin/bash

root=`pwd`

cd ./build-npm/

npm_base=`pwd`
yuitest="${npm_base}/node_modules/.bin/yuitest"
grover="${npm_base}/node_modules/.bin/grover"

echo "Build Root: ${root}"
echo "NPM Base: ${npm_base}"
echo "YUITest: ${yuitest}"
echo "Grover: ${grover}"
echo "PhantomJS: `phantomjs -v`"

echo "Running Tests.."

tests=`${root}/src/common/travis/gettests.js ${root}`

RETVAL=$?
[ $RETVAL -ne 0 ] && exit 1

echo "Tests: ${tests}"

cd ${root}
${yuitest} ${tests}

RETVAL=$?
[ $RETVAL -ne 0 ] && exit 1


if [ -n "$TRAVIS" ]; then
    con=5
else
    con=20
    echo "Starting Grover Tests"
    ${grover} -t 180 -c ${con} -i ./src/common/node/batch.js
fi

