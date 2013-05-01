Tree
====

Provides a generic tree data structure.

A tree has a root node, which may contain any number of child nodes, which may
themselves contain child nodes, ad infinitum.

Child nodes are lightweight function instances which delegate to the tree for
all significant functionality, so trees remain performant and memory-efficient
even with thousands and thousands of nodes.

The `Y.Tree` class doesn't expose any UI, but the following gallery modules are
examples of components that extend `Y.Tree` and provide a UI:

* [SmugMug Menu](https://github.com/smugmug/yui-gallery/tree/master/src/sm-menu)
* [SmugMug TreeView](https://github.com/smugmug/yui-gallery/tree/master/src/sm-treeview)
