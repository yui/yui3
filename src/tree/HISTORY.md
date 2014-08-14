Tree Change History
===================

3.17.2
------

* No changes.

3.17.1
------

* No changes.

3.17.0
------

* Fixed: Moving a node to another tree fails when that node has children.
  ([#1689][]: @rgrove)

[#1689]: https://github.com/yui/yui3/issues/1689

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

* Fixed: `Tree.Sortable` failed to reindex a node's children after sorting them,
  which could result in `Tree#indexOf()` and `Tree.Node#index()` returning
  incorrect indices. [Ryan Grove]


3.11.0
------

* Added `Tree.Node#depth()`, which returns the depth of the node, starting at 0
  for the root node. [Ryan Grove]

* Added `Tree.Sortable#sort()`, which sorts the children of every node in a
  sortable tree. [Ryan Grove]

* `Tree#emptyNode()` now removes nodes without triggering a node map reindex for
  each node, which makes it significantly faster when emptying a node with lots
  of children. [Ryan Grove]

* When inserting a node that already exists in the same parent (which results in
  that node being removed and then re-inserted), `Tree#insertNode()` now
  adjusts the insertion index to ensure that the node is re-inserted at the
  correct position after being removed, even if that position has shifted as a
  result of the removal. [Ryan Grove]

* The `remove` event is now fired when a node is removed and re-inserted as the
  result of a `Tree#appendNode()`, `Tree#insertNode()`, or `Tree#prependNode()`
  call. Previously, the node was removed silently with no event.

  The `src` property of the `remove` event facade in this case will be set to
  "add". Filter on this source if you want to ignore these events. [Ryan Grove]

* The `Tree#createNode()`, `Tree#insertNode()`, and `Tree#traverseNode()`
  methods now throw or log informative error messages when given a destroyed
  node instead of failing cryptically (or succeeding when they shouldn't).
  [Ryan Grove]

* The `Tree.Node#isRoot()` method now returns `false` on destroyed nodes instead
  of causing an exception. [Ryan Grove]

* The `Tree.Sortable#sortNode()` and `Tree.Sortable.Node#sort()` methods now
  accept a `deep` option. If set to `true`, the entire hierarchy will be sorted
  (children, children's children, etc.). [Ryan Grove]

* Tree.Sortable: Sort comparator functions are now executed in their original
  context. When the sort comparator lives on the tree, its `this` object will be
  the tree instance. When it lives on a node, its `this` object will be the
  node. When specified as an anonymous function in an options object, its `this`
  object will be the global object. [Ryan Grove]


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
