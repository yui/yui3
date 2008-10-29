#!/bin/bash
clear
CMT=$1

if [ "$CMT" = "" ]; then
    CMT="DragDrop Checkin"
fi


echo "****************************************"
echo "Checking in Source files"
echo "****************************************"

git commit -m "Checking in source files" *

wait

cd ../../build/dd
#clear
echo "****************************************"
echo "Checking in Build files"
echo "****************************************"
wait
git commit -m "$CMT" *
wait
#clear
echo "****************************************"
echo "Checking in Doc files"
echo "****************************************"
cd ../../src/dd
wait
git commit -m "$CMT" *.js
wait
cd ../dd-plugin
wait
git commit -m "$CMT" *.js
#clear
echo "****************************************"
echo "Checking in Test file"
echo "****************************************"
cd ../../tests
wait
git commit -m "$CMT" dd.html
#clear
echo "****************************************"
echo "Commit Finished"
echo "****************************************"

