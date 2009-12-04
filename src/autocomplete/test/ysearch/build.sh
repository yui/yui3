#!/bin/bash

here=$(pwd)

echo "building"

(
	cd ../../../value-change
	ant all
	cd $here
	cd ..
	ant all
	cd $here
) &> /dev/null

rm *.js{,.gz}

for i in "value-change" autocomplete widget; do
	cp ../../../../build/$i/${i}-min.js .
done

cat autocomplete-min.js value-change-min.js > all-min.js
gzip -c all-min.js > all-min.js.gz

ls -laF *.js{,.gz} | awk '{ print $5 " " $9 }'