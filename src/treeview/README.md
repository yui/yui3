YUI TreeView
============

A powerful, easy to use, and extremely fast TreeView widget for YUI.

Usage
-----

Basic usage is simple. Create an instance of `Y.TreeView`, specify some nodes
to add to the tree, then render the view into a container node.

```js
YUI().use('treeview', function (Y) {

    // Create a new TreeView with a few nodes.
    var treeview = new Y.TreeView({
            container: '#treeview',

            nodes: [
                {label: 'One'},
                {label: 'Two', children: [
                    {label: 'Two-One'},
                    {label: 'Two-Two'}
                ]},
                {label: 'Three'}
            ]
        });

    // Render the treeview inside the #container element.
    treeview.render();

});
```

For more detailed usage instructions, see the API docs.
