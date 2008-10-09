pushd ~/www/yui30/scripts/
./update_cvs.sh
popd
ant
cd build_tmp
echo "YUI._setup();YUI.use('node', 'compat');" >> compat-debug.js
echo "YUI._setup();YUI.use('node', 'compat');" >> compat-min.js
echo "YUI._setup();YUI.use('node', 'compat');" >> compat.js
cp *js ../../../build/compat
