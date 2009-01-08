#! /bin/bash 

cp ~/Documents/git/yui3/sandbox/cssfonts/README	~/Documents/git/yui3/src/cssfonts/README
cp ~/Documents/git/yui3/sandbox/cssfonts/README	~/Documents/git/yui3/build/cssfonts/README

cp ~/Documents/git/yui3/sandbox/cssfonts/fonts.css ~/Documents/git/yui3/src/cssfonts/css/fonts.css
cp ~/Documents/git/yui3/sandbox/cssfonts/fonts-context.css ~/Documents/git/yui3/src/cssfonts/css/fonts-context.css

java -jar ~/Documents/git/yuicompressor-2.4.2/build/yuicompressor-2.4.2.jar --type css --line-break 8000 ~/Documents/git/yui3/src/cssfonts/css/fonts.css -o ~/Documents/git/yui3/build/cssfonts/fonts-min.css

java -jar ~/Documents/git/yuicompressor-2.4.2/build/yuicompressor-2.4.2.jar --type css --line-break 8000 ~/Documents/git/yui3/src/cssfonts/css/fonts-context.css -o ~/Documents/git/yui3/build/cssfonts/fonts-context-min.css

echo "Finished."


