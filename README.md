YUI 3: The Yahoo! User Interface Library
========================================

YUI is a free, open source JavaScript and CSS framework for building richly
interactive web applications. YUI is provided under a BSD license and is
available on GitHub for forking and contribution.

Links
-----

  * [Home Page](http://yuilibrary.com/)
  * [Documentation](http://yuilibrary.com/yui/docs/)
  * [Blog](http://yuiblog.com)
  * [Latest Production Release](http://yuilibrary.com/download/yui3/)
  * [Forums](http://yuilibrary.com/forum/)
  * [License](http://yuilibrary.com/license/)
  * [Contributor Info](https://github.com/yui/yui3/wiki/Contributing.md)
  * [Contributor Mailing List](https://groups.google.com/forum/?fromgroups#!forum/yui-contrib)
  * [Report a Bug](http://yuilibrary.com/yui/docs/tutorials/report-bugs/)
  * [![Build Status](https://secure.travis-ci.org/yui/yui3.png?branch=master)](http://travis-ci.org/yui/yui3)
  * [Shifter, for building YUI](http://yui.github.com/shifter/)


Source Info
-----------

This is the active working source tree for YUI 3. It contains work in progress
toward the next YUI 3 releases and may be unstable.

We encourage you to use the latest source for evaluation purposes, testing new
features and bug fixes, and to provide feedback on new functionality. Please
refer to the "Latest Production Release" link above if you're looking for the
latest stable release of YUI recommended for production use.

If you plan on contributing to YUI, please join and monitor the "Contributor
Mailing List" listed above. Information about milestones and tree closures
will be made available there.


## Branch Information

YUI's development happens on five main branches. The following describes what
each of these code branches represents:

  * `live-docs`: Represents the latest GA release of YUI, plus any
    documentation-only updates. Any tweaks or additions to the docs for the
    latest release happen on this branch, and they are reflected on the website.

  * `master`: (Read-only) Contains everything in `live-docs`, plus code changes that will go
    into the next YUI release. The code changes in `master` are either bug fixes
    or small changes which should not break API compatibility. Patch releases
    will be cut from this branch; e.g. 3.6.x. *All code in this branch has fully
    passed all unit tests and should be stable.*

  * `3.x`: (Read-only) Represents the next major YUI release; e.g. 3.7.0. This is an
    integration branch which contains everything in `master`, plus larger code
    changes which will go into a future YUI release. The changes in `3.x`
    require a minor version increment before they are part of release, e.g.,
    3.7.0. Preview Releases will be cut from this branch for developers to test
    and evaluate. *All code in this branch has fully passed all unit tests and should be stable.*

  * `dev-master` and `dev-3.x`: Current working branches containing code that
     **has not** been through the CI process. **Developers check their changes in to
     these integration branches for the automated testing system to validate.** Once they
     are validated, the code is merged into `master` and `3.x` respectively. **Never** check in to
     `master` or `3.x` directly.


## Source Tree

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

## Initial Setup

   1. Fork the project on GitHub (http://www.github.com/yui/yui3).
   1. Clone the fork to your local environment for development.

## Do Good Stuff

   1. Create a feature branch to house atomic code changes.
   `git checkout -b myfeature upstream/master --no-track`
   1. Satisfy the contribution requirements
   (see [YUI Contribution Standards](https://github.com/yui/yui3/wiki/Contribution-Standards)).
   1. Push changes to your fork.
   1. Submit a pull request from your fork to the `live-docs`,
   `dev-master`, or `dev-3.x` branch  for review.
   1. Incorporate community feedback.
   1. Push changes to your fork -- the pull request will automatically update.
   1. Rinse and repeat.

All changes should continue to be made on the feature branch; that way the pull
request you submit will automatically update to include them. Make sure to keep
the feature branch updated with the latest changes from master, so that they
don't diverge during your development process.

## Important Tips

  * Always work from a feature branch. Since all code submissions will be
  through a Pull Request, feature branches isolate changes from one submission to another.
  * Always start your new branch from the branch you want to submit to:
  `git checkout -b myfeature dev-master`
  * Remember to submit your Pull Request to the proper `dev-` branch and not
  `master` or `3.x`.

## Building

To build YUI components install [Shifter](http://yui.github.com/shifter/) (`npm -g install shifter`)
and then simply run `shifter` in that components directory.

Shifter also allows you to rebuild the entire YUI src tree:

    cd yui3/src && shifter --walk


