#!/bin/bash

cd "$(dirname "$0")"

out=$1

if [ ! -d "$out" ]; then
    out=/tmp/npm-yui/
    echo "Build directory not found using default: ${out}"
fi

echo "Using ${out} as build directory"

if [ -d $out ]; then
    echo "Old build dir found, removing.."
    rm -rRf $out
fi

echo "Creating build dir"
mkdir $out

echo "Copying files to build location"
cp -R ../../../build/* $out
wait
cp ../../../package.json "$out/package.json"
wait
cp ./npm_package_shim.js "$out/package.js"
wait
echo "Copy complete, running prep"
./npm_package.js $out
