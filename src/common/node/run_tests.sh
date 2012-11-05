#!/bin/bash

cd "$(dirname "$0")"

cd ../../

cd loader
wait
make test
wait
cd ../io
wait
make test
