YUI on Node.js testing with TravisCI
====================================

This directory contains the scripts used to automate YUI's Node.js testing with TravisCI.

Scripts
-------

   * `before.sh` - Runs in the `before_install` build step to create the YUI npm package
   * `install.sh` - Runs in the `install` build step to do an `npm install` in `build/npm` (created from the above step)
   * `test.sh` - Runs in the `test` build step. It fetches the list of tests to execute, then executes YUITest on them.


Running the tests locally
-------------------------

Clone the repo, then:

    cd yui3;
    ./src/common/travis/travis.sh
