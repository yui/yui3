#!/bin/bash

ln -sf build.nodelist.xml build.xml
wait
ln -sf build.nodelist.properties build.properties
echo "****************************************"
echo "Building nodelist"
echo "****************************************"
ant -q all

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

echo "****************************************"
echo "All Builds Done"
echo "****************************************"

