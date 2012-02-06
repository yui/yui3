function ButtonNode(config) {
    ButtonNode.superclass.constructor.call(this, config.srcNode || '<button/>');
    this.initializer(config);

};

Y.extend(ButtonNode, Y.Node, {
    initNode: function() {
        this._host = this;
    }
});

Y.mix(ButtonNode.prototype, Y.ButtonBase.prototype, true);
ButtonNode.ATTRS = Y.merge(Y.ButtonBase.ATTRS, Y.Node.ATTRS);
Y.Button = ButtonNode;
