function ButtonNode(config) {
    var node;

    if (config && config.srcNode) { // Y.Node, selector string or DOM node
        node = config.srcNode._node || config.srcNode; // TODO: allow new Y.Node(nodeInstance)
    } else {
        node = Y.DOM.create(this.TEMPLATE);
    }
    ButtonNode.superclass.constructor.call(this, node);
    Y.Node._instances[this._yuid] = this;
    this.initializer(config);
}

Y.extend(ButtonNode, Y.Node);

// add ButtonBase API without clobbering Node/Attribute API
Y.mix(ButtonNode.prototype, Y.ButtonBase.prototype);

ButtonNode.prototype.getNode = function() {
    return this;
};

// ButtonBase calls node.set('disabled') doubling notifications
ButtonNode.prototype._renderDisabled = function (value) {
    this.toggleClass(Button.CLASS_NAMES.DISABLED, value);
};
    
// so can call with ButtonATTRS
ButtonNode.prototype.renderAttrs = function(config) {
    Y.AttributeCore.call(this, ButtonNode.ATTRS, config);
    Y.AttributeEvents.apply(this, arguments);
    Y.AttributeExtras.apply(this, arguments);
};

ButtonNode.prototype.select = Y.ButtonBase.prototype.select;
ButtonNode.ATTRS = Y.merge(Y.Node.ATTRS, Y.ButtonBase.ATTRS);

Y.ButtonNode = ButtonNode;
Y.Button = ButtonNode;
