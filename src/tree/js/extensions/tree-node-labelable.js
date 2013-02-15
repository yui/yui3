/**
@module tree
@submodule tree-labelable
**/

/**
`Tree.Node` extension that adds baked in support for labels like you might see
in a treeview or menu.

**Security note:** The label is stored in raw, unescaped form. If you choose to
render the label as HTML, be sure to escape it first with `Y.Escape.html()`
unless you actually intend to render raw HTML contained in the label.

@class Tree.Node.Labelable
@constructor
@param {Tree} tree `Tree` instance with which this node should be associated.
@param {Object} [config] Configuration hash.
    @param {String} [config.label=''] Label for this node.
@extensionfor Tree.Node
**/

function NodeLabelable(tree, config) {
    this._serializable = this._serializable.concat('label');

    if ('label' in config) {
        this.label = config.label;
    }
}

NodeLabelable.prototype = {
    /**
    Label for this node.

    **Security note:** The label is stored in raw, unescaped form. If you choose
    to render the label as HTML, be sure to escape it first with
    `Y.Escape.html()` unless you actually intend to render raw HTML contained in
    the label.

    @property {String} label
    @default ''
    **/
    label: ''
};

Y.Tree.Node.Labelable = NodeLabelable;
