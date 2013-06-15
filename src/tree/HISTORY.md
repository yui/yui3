Tree Change History
===================

@VERSION@
------

* Added `Tree.Node#depth()`, which returns the depth of the node, starting at 0
  for the root node. [Ryan Grove]

* Added `Tree.Sortable#sort()`, which sorts the children of every node in a
  sortable tree. [Ryan Grove]

* The `Tree#createNode()`, `Tree#insertNode()`, and `Tree#traverseNode()`
  methods now throw or log informative error messages when given a destroyed
  node instead of failing cryptically (or succeeding when they shouldn't).
  [Ryan Grove]

* The `Tree.Node#isRoot()` method now returns `false` on destroyed nodes instead
  of causing an exception. [Ryan Grove]

* The `Tree.Sortable#sortNode()` and `Tree.Sortable.Node#sort()` methods now
  accept a `deep` option. If set to `true`, the entire hierarchy will be sorted
  (children, children's children, etc.). [Ryan Grove]


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
