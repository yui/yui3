#!/bin/bash

# this script searches for HISTORY.md files and replaces "@VERSION@" with the 
# passed in first argument such as "3.8.2"

a='s/@VERSION@/'
b=$1
c='/g'

if [ -z "$1" ]
then
    echo 'ERR: empty first argument (version)'
    exit $?
else
     for fl in */*.md; do
        mv $fl $fl.old
        echo "changing $fl to version $1"
        # sed 's/@VERSION@/3.8.1/g' $fl.old > $fl
        sed $a$b$c $fl.old > $fl
        rm -f $fl.old
     done
fi     