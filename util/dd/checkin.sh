#!/bin/bash
clear
CMT=$1

if [ "$CMT" = "" ]; then
    CMT="DragDrop Checkin"
fi


echo "****************************************"
echo "Checking in Source files"
echo "****************************************"

cvs commit -m "Checking in source files"

wait

cd ../../build/dd
clear
echo "****************************************"
echo "Checking in Build files"
echo "****************************************"
wait
cvs commit -m "$CMT"
wait
cd ../../src
wait
clear
echo "****************************************"
echo "Checking in Doc files"
echo "****************************************"
cvs commit -m "$CMT" dd/*.js
clear
echo "****************************************"
echo "Commit Finished"
echo "****************************************"

