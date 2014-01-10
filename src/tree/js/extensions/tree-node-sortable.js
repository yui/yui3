/**
@module tree
@submodule tree-sortable
**/

/**
`Tree.Node` extension that adds methods useful for nodes in trees that use the
`Tree.Sortable` extension.

@class Tree.Node.Sortable
@constructor
@extensionfor Tree.Node
**/

function NodeSortable() {}

NodeSortable.prototype = {
    /**
    Sorts this node's children.

    @method sort
    @param {Object} [options] Options.
        @param {Boolean} [options.silent] If `true`, no `sort` event will be
            fired.
        @param {Function} [options.sortComparator] Custom comparator function to
            use. If specified, this will become the node's new comparator
            function, overwriting any previous comparator function that was set
            for the node.
        @param {Boolean} [options.sortReverse] If `true`, children will be
            sorted in reverse (descending) order. Otherwise they'll be sorted in
            ascending order. This will become the node's new sort order,
            overwriting any previous sort order that was set for the node.
        @param {String} [options.src] Source of the sort operation. Will be
            passed along to the `sort` event facade.
    @chainable
    **/
    sort: function (options) {
        this.tree.sortNode(this, options);
        return this;
    }
};

Y.Tree.Node.Sortable = NodeSortable;
