YUI TreeView
============

An awesome TreeView widget for YUI.

Usage
-----

```js
YUI().use('treeview', function (Y) {

    // Create a new TreeView with a few nodes.
    var treeView = new Y.TreeView({
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
    treeView.render();
});
```
