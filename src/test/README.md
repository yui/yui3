YUI Test
========

The internal version of YUI Test is imported from the external source files found here:  https://github.com/yui/yuitest
Tests use the YUI Builder - https://github.com/yui/builder

Importing
---------

   * Clone the yuitest main repository as a sibling of the `yui3` repo.
   * Change to: `yui3/src/test`
   * Run: `grunt`

This will import all of the code from the external YUI Test repository, then it will
filter the code to make the documentation parsable via YUIDoc. After that it will create
wrapper files to clean up the code and make it work with a `Y` instance instead of the
global `YUITest` object.
