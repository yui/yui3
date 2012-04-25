#!/bin/bash

echo "Starting a Travis Build"

cd "$(dirname "$0")"

cd ../../../

./src/common/travis/before.sh
wait
./src/common/travis/install.sh
wait
./src/common/travis/test.sh
