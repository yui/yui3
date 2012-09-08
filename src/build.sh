#!/bin/bash

## Ant all was seg faulting on me, so I wrote this to do the same thing.

startTime="$(date)"

if [ -f "./build.log" ]; then
    rm ./build.log
fi

for dir in ./*; do
    if [ -f "./${dir}/build.xml" ]; then
        echo "Shifting $dir"
        cd $dir
        shifter
        wait
        cd ../

    fi
done

endTime="$(date)"

echo "Build Started: $startTime"
echo "Build Finished: $endTime"
