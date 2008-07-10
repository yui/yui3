#!/bin/bash

echo "****************************************"
echo "Copying files"
echo "****************************************"
cd ./src/js
wait
cp ~/Sites/yui/dragdrop3/*.js ./
wait
rm scroll.js
wait
rm timer.js
wait
rm portal.js
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

if [ $1 ]; then
    echo "****************************************"
    echo "Start Building"
    echo "****************************************"
    cd ../../
    wait
    ./build.sh
fi

