#!/bin/bash

gitroot=~/web/git/yui3/
srcdir=${gitroot}src/
rollup=HISTORY.md
separator=separator.md

rm ${gitroot}${rollup}
cd ${srcdir}
find . -name "HISTORY.md" -exec cat {} ${srcdir}common/scripts/${separator} >> ${gitroot}${rollup} \;

