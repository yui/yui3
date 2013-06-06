Uploader Utility (New) Change History
=====================================

3.10.3
------

* No changes.

3.10.2
------

* No changes.

3.10.1
------

* [security] Hardened SWF file by filtering all data passed through ExternalInterface to fix XSS vulnerability.

3.10.0
------

* No changes.

3.9.1
-----

* No changes.

3.9.0
-----

* Removed unused `substitute` dependency.

3.8.1
-----

* Add dropped file infomation to uploader drop event

3.8.0
-----

* No changes.

3.7.3
-----

* No changes.

3.7.2
-----

* No changes.

3.7.1
-----

* No changes.

3.7.0
-----

  * Minor documentation fixes
  * Switched to shifter build system
  * flashuploader.swf now has its own src/swf folder, from where it gets copied to build/uploader/assets

3.6.0
-----
  * Bug fix for 2532150 (empty fileList after fileselect event)
  * Bug fix for 2532140 (can't select the same set of files twice)
  * Bug fix for 2532111 (drop event is not being fired)
  * New feature: a `fileFilterFunction` attribute and improved
    `fileList` handling for filtering selected files.
  * New feature: Added support for file type filters to the HTML5
    uploader's "Select Files" dialog.
  * New feature: allow setting custom headers and `withCredentials`
    property for the HTML5 uploader (passed through to the underlying
    XMLHttpRequest Level 2 instance).

3.5.1
-----
  * No changes.

3.5.0
-----
  * Added HTML5Uploader layer
  * Refactored queue management out of Uploader
  * Introduced new APIs (more details in documentation)
  * Added keyboard access to the Flash layer
  * Old uploader has been deprecated as 'uploader-deprecated' module.

3.4.1
-----
  * No changes in source code
  * Minor example changes

3.4.0
-----
  * No changes

3.3.0
-----
  * Minor changes in documentation

3.2.0
-----
  * Initial release
