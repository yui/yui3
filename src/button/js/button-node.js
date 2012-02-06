function ButtonNode(config) {
    ButtonNode.superclass.constructor.call(
        this, config.srcNode || Y.DOM.create(this.TEMPLATE)
    );
    this.initializer(config);
}

Y.extend(ButtonNode, Y.Node);

// add ButtonBase API without clobbering Node/Attribute API
Y.mix(ButtonNode.prototype, Y.ButtonBase.prototype);

ButtonNode.prototype.getNode = function() {
    return this;
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
