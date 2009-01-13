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

ln -sf build.sim.xml build.xml
wait
ln -sf build.sim.properties build.properties
echo "****************************************"
echo "Building node-event-simulate"
echo "****************************************"
ant -q all

ln -sf build.node.xml build.xml
wait
ln -sf build.node.properties build.properties
echo "****************************************"
echo "Building node"
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

