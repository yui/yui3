#!/bin/bash

## Ant all was seg faulting on me, so I wrote this to do the same thing.

startTime=`date`

for dir in ./*; do
    if [ -f "./${dir}/build.xml" ]; then
        echo "$dir/build.xml"
        cd $dir
        ant all
        wait
        cd ../
    fi
done

endTime=`date`

echo "Build Started $startTime"
echo "Build Finished $endTime"
