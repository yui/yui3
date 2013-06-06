Tree Change History
===================

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

* Added `Tree#findNode()` and `Tree.Node#find()` methods, which pass the
  specified node and each of its descendants to a callback function and returns
  the first node for which the callback returns a truthy value. [Ryan Grove]

* Added `Tree#traverseNode()` and `Tree.Node#traverse()` methods, which pass the
  specified node and each of its descendants to a callback function in
  depth-first order. [Ryan Grove]

* Added a `Tree.Sortable` extension, which can be mixed into any Tree class to
  provide customizable sorting logic for nodes. [Ryan Grove]

* Fixed: The number returned by `Tree#size()` didn't include the root node.
  [Ryan Grove]


3.9.1
-----

* Added a `src` option to all methods that trigger events. This value is passed
  along to the event facade of the resulting event, and can be used to
  distinguish between changes caused by different sources (such as
  user-initiated changes vs. programmatic changes). [Ryan Grove]


3.9.0
-----

* Initial release. [Ryan Grove]
