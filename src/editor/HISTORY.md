Rich Text Editor Change History
===============================

3.10.3
------

* No changes.

3.10.2
------

* No changes.

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

* Removed unused `substitute` dependency.

3.8.1
-----

* No changes.

3.8.0
-----

* No changes

3.7.3
-----

* 2532807 fixed regex for ie10
* Converted some tests to work in IE10 better
* Convert innerHTML iframe creation to DOM for IE 10
* Should completely pass lint now

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

* 2532376 bz #5540030 - Indent/Outdent button doestn't work properly in Chrome/IE when in RTL mode
* 2532395 nodeChange event's command key loses both the underline and strikethrough property if both are appli...


3.5.1
-----

  * No changes.

3.5.0
-----

* 2530547 Frame: src attribute doesn't do anything
* General fixes for Y! Mail deployment
* 2531299 Pressing Backspace may cause editor to lose focus.
* 2531301 Editor using EditorPara and EditorLIsts has JS exceptions
* 2530547 Frame: src attribute doesn't do anything
* 2531329 Rename Y.Selection to Y.EditorSelection (or something)
* 2531577 Plugin.EditorBR works incorrectly in IE
* 2531615 Newline breaks <br> replaced with <wbr> in IE8 [bz 5242614]
* 2531329 - Breaking change, more below:


Bug #2531329 changed the old Y.Selection to Y.EditorSelection. This has been aliased until 3.6.0, bug #2531659
created to track that change.

3.4.1
-----

No changes.

3.4.0
-----

Third release of EditorBase. Considerable work was done on this component, but there are no
public tickets associated with the issues that were resolved. This version of EditorBase is the
current version being used in the new Yahoo! Mail. It's production stable and ready to be used with
the proper skins and GUI.

3.3.0
-----

Second release of EditorBase. Considerable work was done on this component, but there are no
public tickets associated with the issues that were resolved.

3.2.0
-----

Initial Release

This release is a core utility release, the Editor instance that is created contains no GUI.
It's only the iframe rendering and event system.
