YUI 3: The Yahoo! User Interface Library
========================================

Welcome to YUI 3!

  * [Documentation](http://developer.yahoo.com/yui/3/)
  * [Latest Production Release](http://yuilibrary.com/downloads/#yui3)
  * [Forums](http://yuilibrary.com/forum/)
  * [License](http://developer.yahoo.com/yui/license.html)
  * [Contributor Info](http://developer.yahoo.com/yui/community/contribute.html)

The YUI Library is a set of utilities, infrastructure components, and widgets
written in JavaScript and CSS for building richly interactive web applications.
It is available under a BSD license and is free for all uses.

This is the active working source tree for YUI 3. It contains work in progress
toward the next YUI 3 release, and may be unstable or change without notice. We
encourage you to use the latest source for evaluation purposes, testing new
features and bug fixes, and to provide feedback on new functionality. Please
refer to the "Latest Production Release" link above if you're looking for the
latest stable release of YUI recommended for production use.

The YUI source tree includes the following directories:

  * `api`: Generated API docs for the entire library in HTML format. This
    documentation is built and committed automatically from the contents of the
    `src` directory.
  * `build`: Built YUI source files. The built files are generated at
    development time from the contents of the `src` directory. The build step
    generates debug files (unminified and with full comments and logging),
    raw files (unminified, but without debug logging), and minified files
    (suitable for production deployment and use).
  * `sandbox`: Experiments and works in progress, including unreleased future
     components. Here there be dragons.
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
