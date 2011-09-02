#!/bin/bash

root=`pwd`
cd $root

for file in ./js/*; do
    echo "Diffing $file"
    diff $file ./../../src/editor/$file
done
