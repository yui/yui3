#! /bin/bash 

cp ~/Documents/git/yui3/sandbox/cssgrids/README	~/Documents/git/yui3/src/cssgrids/README
cp ~/Documents/git/yui3/sandbox/cssgrids/README	~/Documents/git/yui3/build/cssgrids/README

cp ~/Documents/git/yui3/sandbox/cssgrids/grids.css ~/Documents/git/yui3/src/cssgrids/css/grids.css
cp ~/Documents/git/yui3/sandbox/cssgrids/grids-context.css ~/Documents/git/yui3/src/cssgrids/css/grids-context.css

java -jar ~/Documents/git/yuicompressor-2.4.2/build/yuicompressor-2.4.2.jar --type css --line-break 8000 ~/Documents/git/yui3/src/cssgrids/css/grids.css -o ~/Documents/git/yui3/build/cssgrids/grids-min.css
java -jar ~/Documents/git/yuicompressor-2.4.2/build/yuicompressor-2.4.2.jar --type css --line-break 8000 ~/Documents/git/yui3/src/cssgrids/css/grids-context.css -o ~/Documents/git/yui3/build/cssgrids/grids-context-min.css

echo "Finished."


