/*jshint expr:true, onevar:false */

/**
Extension for `Tree` that adds baked-in support for node labels like you might
see in a treeview or menu.

@module tree
@submodule tree-labelable
@main tree-labelable
**/

/**
Extension for `Tree` that adds baked-in support for node labels like you might
see in a treeview or menu.

@class Tree.Labelable
@constructor
@extensionfor Tree
**/

function Labelable() {}

Labelable.prototype = {
    initializer: function () {
        this.nodeExtensions = this.nodeExtensions.concat(Y.Tree.Node.Labelable);
    }
};

Y.Tree.Labelable = Labelable;
