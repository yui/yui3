#! /bin/bash 

cp ~/Documents/git/yui3/sandbox/cssreset/README	~/Documents/git/yui3/src/cssreset/README
cp ~/Documents/git/yui3/sandbox/cssreset/README	~/Documents/git/yui3/build/cssreset/README

cp ~/Documents/git/yui3/sandbox/cssreset/reset.css ~/Documents/git/yui3/src/cssreset/css/reset.css
cp ~/Documents/git/yui3/sandbox/cssreset/reset-context.css ~/Documents/git/yui3/src/cssreset/css/reset-context.css

java -jar ~/Documents/git/yuicompressor-2.4.2/build/yuicompressor-2.4.2.jar --type css --line-break 8000 ~/Documents/git/yui3/src/cssreset/css/reset.css -o ~/Documents/git/yui3/build/cssreset/reset-min.css
java -jar ~/Documents/git/yuicompressor-2.4.2/build/yuicompressor-2.4.2.jar --type css --line-break 8000 ~/Documents/git/yui3/src/cssreset/css/reset-context.css -o ~/Documents/git/yui3/build/cssreset/reset-context-min.css

echo "Finished."


