#!/bin/bash

## Ant all was seg faulting on me, so I wrote this to do the same thing.

startTime="$(date +%s)"

if [ -f "./build.log" ]; then
    rm ./build.log
fi

for dir in ./*; do
    if [ -f "./${dir}/build.xml" ]; then
        echo "Building $dir/build.xml"
        cd $dir
        ant all >> ../build.log 2>&1
        wait
        cd ../
    fi
done

endTime="$(date +%s)"
elapsed_seconds="$(expr $endTime - $startTime)"

echo "Build Started: $(date -r $startTime)"
echo "Build Finished: $(date -r $endTime)"
echo "Elapsed time: $(date -r $elapsed_seconds +00:%M:%S)"
