#! /bin/bash 

cp ~/Documents/git/yui3/sandbox/cssbase/README	~/Documents/git/yui3/src/cssbase/README
cp ~/Documents/git/yui3/sandbox/cssbase/README	~/Documents/git/yui3/build/cssbase/README

cp ~/Documents/git/yui3/sandbox/cssbase/base.css ~/Documents/git/yui3/src/cssbase/css/base.css
cp ~/Documents/git/yui3/sandbox/cssbase/base-context.css ~/Documents/git/yui3/src/cssbase/css/base-context.css

java -jar ~/Documents/git/yuicompressor-2.4.2/build/yuicompressor-2.4.2.jar --type css --line-break 8000 ~/Documents/git/yui3/src/cssbase/css/base.css -o ~/Documents/git/yui3/build/cssbase/base-min.css

java -jar ~/Documents/git/yuicompressor-2.4.2/build/yuicompressor-2.4.2.jar --type css --line-break 8000 ~/Documents/git/yui3/src/cssbase/css/base-context.css -o ~/Documents/git/yui3/build/cssbase/base-context-min.css

echo "Finished."


