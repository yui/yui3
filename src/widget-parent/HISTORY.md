Widget Parent Change History
============================

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

* No changes.

3.8.1
-----

* No changes.

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

  * No changes.

3.6.0
-----

  * No changes.

3.5.1
-----

  * No changes.

3.5.0
-----

  * Removing a focused child, now unsets activeDescendant properly

3.4.1
-----

  * Fixed issue with children not being destroyed, when
    parent.destroy() is called.

  * Added if (sibling.get("rendered")) check before trying to insert
    children after/before siblings. This is not required for the out of
    the box Parent/Child implementation, but is useful for custom
    implementations which customize children to render asynchronously.

    See #2529863

  * Fixed issue where previously rendered children, added to an empty parent,
    would not get rendered into the parent's child container node.

    Based on the pull request from andreas-karlsson, with the root fix *and* unit
    test (nicely done): https://github.com/yui/yui3/pull/25

3.4.0
-----

  * No changes

3.3.0
-----

  * Changed instanceof to Y.instanceOf, to prevent leaks in IE7
  * Renamed "type" in child configuration, to "childType", so that
    children can have a "type" attribute for it's own context
    (A FormElement widget for examplei, with a "type").

    "type" is still supported but deprecated for backward compatibility,
    so it's only used to define a child widget type if "childType" is not
    provided.
  * Fixed remove(), to actually remove child from DOM also.

3.2.0
-----

  * No changes

3.1.1
-----

  * No changes

3.1.0
-----

  *   "childAdded" event renamed to "addChild"
  *   "childRemoved" event renamed to "removeChild"
  *   Now augmented with Y.ArrayList
  *   "selection" attribute now returns an Y.ArrayList or Widget
  *   Removed "children" attribute since that functionality is provided
      by Y.ArrayList
	  -  Can retrieve # of child via the size() method
	  -  Can iterate children via this.each()
	  -  Can retrieve a individual child via the item() method
  * add method will always return a Y.ArrayList instance for easy chaining
  * removeAll method will always return a Y.ArrayList instance for easy chaining
  * added selectAll() and deselectAll() methods
  * widget UI will render children added/inserted children after widget is rendered
  * widget UI will update when a child is removed
