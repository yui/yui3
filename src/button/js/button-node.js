function ButtonNode(config) {
    ButtonNode.superclass.constructor.call(this, config.srcNode);
    this.initializer(config);
}

Y.extend(ButtonNode, Y.Node, {
    // call with ButtonNode.ATTRS
    _initAttributes: function(config) {
        Y.AttributeCore.call(this, ButtonNode.ATTRS, config);
    },

    _initNode: function(config) {
        // enable Y.one() to return ButtonNode (for eventTarget, etc)
//        Y.Node._instances[this._yuid] = this;
        this._host = this;
    }
});

// add ButtonBase API without clobbering Node/Attribute API
Y.mix(ButtonNode.prototype, Y.ButtonBase.prototype);
    
// merge Node and Button ATTRS
// TODO: protect existing? (what if Y.Node.ATTRS.disabled.getter)
ButtonNode.ATTRS = Y.merge(Y.Node.ATTRS, Y.ButtonBase.ATTRS);
ButtonNode.ATTRS.label._bypassProxy = true;

Y.ButtonNode = ButtonNode;
