#!/bin/bash

ln -sf build.drag-core.xml build.xml
wait
ln -sf build.drag-core.properties build.properties
wait
clear
wait
echo "****************************************"
echo "Building drag-core"
echo "****************************************"
ant -q all
wait
clear
wait

ln -sf build.drag-proxy.xml build.xml
wait
ln -sf build.drag-proxy.properties build.properties
wait
echo "****************************************"
echo "Building drag-proxy"
echo "****************************************"
ant -q all
wait
clear
wait

ln -sf build.drag-all.xml build.xml
wait
ln -sf build.drag-all.properties build.properties
wait
echo "****************************************"
echo "Building drag-all"
echo "****************************************"
ant -q all
wait

ln -sf build.drop-core.xml build.xml
wait
ln -sf build.drop-core.properties build.properties
wait
echo "****************************************"
echo "Building drop-core"
echo "****************************************"
ant -q all
wait


ln -sf build.dragdrop-all.xml build.xml
wait
ln -sf build.dragdrop-all.properties build.properties
wait
echo "****************************************"
echo "Building dragdrop-all"
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

