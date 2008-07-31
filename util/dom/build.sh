#!/bin/bash

ln -sf build.dom-base.xml build.xml
wait
ln -sf build.dom-base.properties build.properties
echo "****************************************"
echo "Building dom-base"
echo "****************************************"
ant all

ln -sf build.style.xml build.xml
wait
ln -sf build.style.properties build.properties
echo "****************************************"
echo "Building dom-style"
echo "****************************************"
ant -q all

ln -sf build.screen.xml build.xml
wait
ln -sf build.screen.properties build.properties
echo "****************************************"
echo "Building dom-screen"
echo "****************************************"
ant -q all

ln -sf build.selector.xml build.xml
wait
ln -sf build.selector.properties build.properties
echo "****************************************"
echo "Building selector"
echo "****************************************"
ant -q all

ln -sf build.dom-all.xml build.xml
wait
ln -sf build.dom-all.properties build.properties
echo "****************************************"
echo "Building dom-all"
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

