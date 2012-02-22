YUI.add('button-plugin', function(Y) {

function ButtonPlugin(config) {
    if (!this._initNode) { // hand off to factory when called without new
        return ButtonPlugin.createNode(config);
    }
    ButtonPlugin.superclass.constructor.apply(this, arguments);
}

Y.extend(ButtonPlugin, Y.ButtonCore, {
    // TODO: point to method (_uiSetLabel, etc) instead of getter/setter
    _afterNodeGet: function (name) {
        var ATTRS = this.constructor.ATTRS,
            fn = ATTRS[name] && ATTRS[name].getter && this[ATTRS[name].getter];
        if (fn) {
            return new Y.Do.AlterReturn('get ' + name, fn.call(this));
        }
    },

    _afterNodeSet: function (name, val) {
        var ATTRS = this.constructor.ATTRS,
            fn = ATTRS[name] && ATTRS[name].setter && this[ATTRS[name].setter];
        if (fn) {
            fn.call(this, val);
        }
    },

    _initNode: function(config) {
        var node = config.host;
        this._host = node;
        Y.Do.after(this._afterNodeGet, node, 'get', this);
        Y.Do.after(this._afterNodeSet, node, 'set', this);
    },

    destroy: function(){
        // TODO: Anything?
    }
}, {
    ATTRS: Y.merge(Y.ButtonCore.ATTRS),
    NAME: 'buttonPlugin',
    NS: 'button'
});

// (node)
// (node, config)
// (config)
ButtonPlugin.createNode = function(node, config) {

    if (node && !config) {
        if (! (node.nodeType || node.getDOMNode || typeof node == 'string')) {
            config = node;
            node = config.srcNode;
        }
    }
    node = node || config && config.srcNode || Y.DOM.create(Y.Plugin.Button.prototype.TEMPLATE);

    return Y.one(node).plug(Y.Plugin.Button, config);
};

Y.namespace('Plugin').Button = ButtonPlugin;


}, '@VERSION@' ,{requires:['button-core', 'cssbutton', 'node-pluginhost']});
