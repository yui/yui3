#!/bin/bash

ln -sf build.anim-base.xml build.xml
wait
ln -sf build.anim-base.properties build.properties
echo "****************************************"
echo "Building anim-base"
echo "****************************************"
#ant -q all
ant all

echo "****************************************"
echo "All Builds Done"
echo "****************************************"

