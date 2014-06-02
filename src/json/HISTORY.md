JSON Utility Change History
===========================

3.17.2
------

* No changes.

3.17.1
------

* No changes.

3.17.0
------

* No changes.

3.16.0
------

* No changes.

3.15.0
------

* No changes.

3.14.1
------

* No changes.

3.14.0
------

* No changes.

3.13.0
------

* No changes.

3.12.0
------

* No changes.

3.11.0
------

* No changes.

3.10.3
------

* No changes.

3.10.2
------

* No changes.

3.10.2
------

* YUICompressor was unable to minify the json-parse code because it contained `eval`.
  It had inserted a placeholder `EVAL_TOKEN` which to allow minification,
  then used a post-minify script to replace `EVAL_TOKEN` with `eval`.
  This appears not to be necessary any more, and caused a problem with the
  3.10.0 CDN deployed files and was removed.  [lsmith]

3.10.1
------

* No changes.

3.10.0
------

* No changes.

3.9.1
-----

* No changes.

3.9.0
-----

* The JavaScript fallback version is only loaded when the environment doesn't
  provide a native implementation.

3.8.1
-----

* No changes.

3.8.0
-----

* No changes.

3.7.3
-----

* Updated to use native JSON when in Node.js

3.7.2
-----

* No changes.

3.7.1
-----

* No changes.

3.7.0
-----

* No changes.

3.6.0
-----

* No changes.

3.5.1
-----

  * No changes.

3.5.0
-----

  * No changes.

3.4.1
-----

  * No changes.

3.4.0
-----

  * Remove indirect `eval()`. [Ticket #2530295]

3.3.0
-----

  * No changes.

3.2.0
-----

  * Convert parse input to a string before processing.

  * `eval()` now referenced indirectly to allow for better compression.

  * `dateToString` deprecated; use a `replacer`. A Date function extension is
    in the works.

3.1.1
-----

  * No changes.

3.1.0
-----

  * useNative___ disabled for browsers with *very* broken native APIs
    (FF3.1beta1-3).

  * Assumption of `window` removed to support browser-less environment.

3.0.0
-----

  * Leverages native `JSON.stringify` if available.

  * Added `Y.JSON.useNativeParse` and `useNativeStringify` properties that can
    be set to `false` to use the JavaScript implementations. Use these if your
    use case triggers an edge-case bug in one of the native implementations.
    Hopefully these will be unnecessary in a few minor versions of the A-grade
    browsers.

  * Added support for `toJSON()` methods on objects being stringified.

  * Moved Date stringification before replacer to be in accordance with ES5.

3.0.0beta1
----------

  * Leverages native `JSON.parse` if available.

  * Stringify API change. Third argument changed from depth control to indent
    (Per the ECMA 5 spec).

  * Stringify now throws an `Error` if the object has cyclical references
    (Per the ECMA 5 spec).

  * Restructured `stringify()` to leverage `Y.Lang.type`.

3.0.0pr2
--------

  * No changes.

3.0.0pr1
--------

  * Initial release.
