Grunt Building
==============

Our dev and release builds are handled by [Grunt](http://gruntjs.com/).

Installation
------------

First you need to install the `grunt-cli` (`npm -g install grunt-cli`)

After cloning you can simply do an NPM install.

`npm install`

This will install the tools needed locally and build the library and npm package.

Shortcuts
---------

 * `grunt build` Runs a `yogi` build.
 * `grunt npm` Runs the npm build.
 * `grunt test` Runs a `yogi test` on the entire lib.
 * `grunt test-cli` Runs only the CLI tests.
 * `grunt travis` Runs a custom build/test just for Travis CI.
 * `grunt release` Runs a release build (more below)
 * `grunt`, `grunt help`, `grunt yui` Will display build help.

Release Build
-------------

You can do a full YUI release build with `grunt release`.

This command uses two CLI options (`--release-version` and `--release-build`).

 * `--release-version` The version to stamp the files with
 * `--release-build` The build number of this release.

If `--release-build` is not provided, the last Git sha (short version) will be used in it's place.

Release builds are stored under: `./releases/[VERSION]/`

The release build consists of the following artifacts:

 * `dist release zip` Containing source, tests, HISTORY, api docs and landing pages.
 * `cdn release zip` Contains the build dir stamped for a CDN release (CSS files processed for relative paths)
 * `ssl cdn release zip` Same as above only tweaked for SSL access.
 * `npm package` The npm package designed for a simple `npm publish`

Other Builds
------------

We no longer require a `Makefile` for any of our modules, they have all been converted to `grunt` builds.

 * `cssnormalize` Under `src/cssnormalize`, `grunt` will import the source.
 * `handlebars` Under `src/handlebars`, `grunt` will import the source.
 * `test` Under `src/test`, `grunt` will import the source.

