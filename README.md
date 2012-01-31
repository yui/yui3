YUI 3: The Yahoo! User Interface Library
========================================

YUI is a free, open source JavaScript and CSS framework for building richly
interactive web applications. YUI is provided under a BSD license and is
available on GitHub for forking and contribution.

Links
-----

  * [Home Page](http://yuilibrary.com/)
  * [Documentation](http://yuilibrary.com/yui/docs/)
  * [Latest Production Release](http://yuilibrary.com/download/yui3/)
  * [Forums](http://yuilibrary.com/forum/)
  * [License](http://yuilibrary.com/license/)
  * [Contributor Info](http://yuilibrary.com/contribute/)
  * [Report a Bug](http://yuilibrary.com/yui/docs/tutorials/report-bugs/)


Source Info
-----------

This is the active working source tree for YUI 3. It contains work in progress
toward the next YUI 3 release and may be unstable.

We encourage you to use the latest source for evaluation purposes, testing new
features and bug fixes, and to provide feedback on new functionality. Please
refer to the "Latest Production Release" link above if you're looking for the
latest stable release of YUI recommended for production use.

The YUI source tree includes the following directories:

  * `build`: Built YUI source files. The built files are generated at
    development time from the contents of the `src` directory. The build step
    generates debug files (unminified and with full comments and logging),
    raw files (unminified, but without debug logging), and minified files
    (suitable for production deployment and use).

  * `src` Raw unbuilt source code (JavaScript, CSS, image assets, ActionScript
     files, etc.) for the library. Beginning with YUI 3.4.0, the `src` directory
     also contains all module-specific documentation, tests and examples. All
     modifications to the library and its documentation should take place in
     this directory.

The individual component directories under the `src` directory contain Ant
build files (`build.xml` and others) which can be used to build individual
modules using the YUI Builder. The YUI Builder is part of the "builder" project,
also available on GitHub at <https://github.com/yui/builder>

The `README` file in the `componentbuild` directory of the Builder project
covers the installation and use of the build tool.
