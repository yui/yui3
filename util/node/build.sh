#!/bin/bash

ln -sf build.node-base.xml build.xml
wait
ln -sf build.node-base.properties build.properties
echo "****************************************"
echo "Building node-base"
echo "****************************************"
ant all

ln -sf build.style.xml build.xml
wait
ln -sf build.style.properties build.properties
echo "****************************************"
echo "Building node-style"
echo "****************************************"
ant -q all

ln -sf build.screen.xml build.xml
wait
ln -sf build.screen.properties build.properties
echo "****************************************"
echo "Building node-screen"
echo "****************************************"
ant -q all

ln -sf build.node-all.xml build.xml
wait
ln -sf build.node-all.properties build.properties
echo "****************************************"
echo "Building node-all"
echo "****************************************"
ant -q all

echo "****************************************"
echo "Cleaning Up"
echo "****************************************"
wait
#rm -rRf build_tmp
wait
#rm -rRf build_rollup_tmp
wait
rm build.xml
wait
rm build.properties

echo "****************************************"
echo "All Builds Done"
echo "****************************************"

