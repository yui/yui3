#!/bin/bash

echo "****************************************"
echo "Copying files"
echo "****************************************"
cp ./js/*.js ../../src/dd/js/
wait
cd ../../src/dd/js/
wait
files=`ls *.js`
echo "****************************************"
echo "Processing files"
echo "****************************************"

for item in ${files[*]}
do
    file="$item-bak"
    cp $item $file
    lines=`wc -l $file | awk '{print $1}'`
    end=`expr $lines - 1`
    sed -n "2, $end p" $file > $item
    rm $file
done
echo "****************************************"
echo "Done.."
echo "****************************************"

