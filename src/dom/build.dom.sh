#!/bin/bash
ln -sf build.dom.xml build.xml
wait
ln -sf build.dom.properties build.properties
echo "****************************************"
echo "Building dom-all"
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
echo "dom-all done"
echo "****************************************"

