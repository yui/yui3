YUI Loader
==========

Processes dependencies and dynamically loads script and css for YUI and external modules.


Development
-----------

The Loader build provides a Makefile for easy building. The Makefile contains the following targets:

   * `all` - Runs `build` then `test` (the default)
   * `build` - A passthrough to `ant all` (requires nodejs and python)
   * `meta` - Runs the `scripts/meta_join.py` to build the meta data (requires python)
   * `check` - Runs the `scripts/meta_check.js` to check meta-data for inconsistencies (requires nodejs)
   * `test` - Runs a series of NodeJS based CLI tests (requires nodejs with yuitest installed)
   * `gallery` - Fetches and updates the meta-data with the latest gallery build (requires nodejs)

Testing
-------

    npm -g i yuitest

There is one set of automated CLI tests that can be run with `make test`. This will do a simple
`Loader` call for a module and then check the Loader's `sorted` array for that module. A very simple
smoke test to determine if Loader is functioning properly.

There is an advanced test under `tests/server`. This test will attempt to load every yui3 module
from one of these places:

   * `STATIC` local static files 
   * `COMBO` local combo handler
   * `LOADER` local combo handle after fetching loader
   * `STAR` use star `YUI().use('*')` with a dynamic script generated on the server
   * `RLS` A local RLS server (not supported until YLS is released)

To run these tests, `cd tests/server`

    npm -g i yui3 express combohandler

    export STAR=1; ./server.js
    export LOCAL=1; export STAR=1; ./server.js
    export LOCAL=1; export STAR=1; export COMBO=1; ./server.js
    export LOCAL=1; export STAR=1; export COMBO=1; export LOADER=1; ./server.js #The normal test to run
    export LOCAL=1; export STAR=1; export COMBO=1; export RLS=1; ./server.js
    export LOCAL=1; export STAR=1; export COMBO=1; export LOADER=1; export RLS=1; ./server.js
    
