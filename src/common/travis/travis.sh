#!/bin/bash

echo "Starting a Travis Build"

#mimic Travis env
export TRAVIS=true
export TRAVIS_NODE_VERSION=0.8

cd "$(dirname "$0")"

cd ../../../

./src/common/travis/before.sh
wait
./src/common/travis/install.sh
wait
./src/common/travis/test.sh
