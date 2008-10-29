#!/bin/bash

export YUI_BUILD_DIR=/Users/davglass/build/builder/componentbuild

ln -sf build.dd.xml build.xml
wait
ln -sf build.dd.properties build.properties
wait
echo "****************************************"
echo "Building dd"
echo "****************************************"
ant -q all
wait
clear
wait
echo "****************************************"
echo "Cleaning Up"
echo "****************************************"
wait
rm -rRf build_tmp
wait
rm -rRf build_rollup_tmp
wait
rm build.xml
wait
rm build.properties
wait
echo "****************************************"
echo "All Builds Done"
echo "****************************************"

