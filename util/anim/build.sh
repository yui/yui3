#!/bin/bash

ln -sf build.anim-base.xml build.xml
wait
ln -sf build.anim-base.properties build.properties
echo "****************************************"
echo "Building anim-base"
echo "****************************************"
ant all

ln -sf build.color.xml build.xml
wait
ln -sf build.color.properties build.properties
echo "****************************************"
echo "Building color"
echo "****************************************"
ant -q all

ln -sf build.curve.xml build.xml
wait
ln -sf build.curve.properties build.properties
echo "****************************************"
echo "Building curve"
echo "****************************************"
ant -q all

ln -sf build.easing.xml build.xml
wait
ln -sf build.easing.properties build.properties
echo "****************************************"
echo "Building easing"
echo "****************************************"
ant -q all

#ln -sf build.node-plugin.xml build.xml
#wait
#ln -sf build.node-plugin.properties build.properties
#echo "****************************************"
#echo "Building node plugin"
#echo "****************************************"
#ant -q all

ln -sf build.scroll.xml build.xml
wait
ln -sf build.scroll.properties build.properties
echo "****************************************"
echo "Building scroll"
echo "****************************************"
ant -q all

ln -sf build.xy.xml build.xml
wait
ln -sf build.xy.properties build.properties
echo "****************************************"
echo "Building xy"
echo "****************************************"
ant -q all

ln -sf build.anim.xml build.xml
wait
ln -sf build.anim.properties build.properties
echo "****************************************"
echo "Building anim"
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

