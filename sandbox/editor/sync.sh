#!/bin/bash

echo "****************************************"
echo "Copying files"
echo "****************************************"
cp ./js/*.js ../../src/editor/js/
wait
cd ../../src/editor/js/
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

