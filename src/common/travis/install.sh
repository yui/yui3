#!/bin/bash

echo "Starting: `pwd`"

cd "$(dirname "$0")"

echo "cd : `pwd`"

cd ../../../build-npm;
wait
npm install
