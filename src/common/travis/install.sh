#!/bin/bash

echo "Starting install: `pwd`"

cd ./build-npm;

echo "NPM Build Dir: `pwd`"
wait
npm install
wait
cd  ../
ln -s ./build-npm/node_modules ./
