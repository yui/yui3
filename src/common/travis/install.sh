#!/bin/bash

cd "$(dirname "$0")"

cd ../../../build-npm;
wait
npm install
