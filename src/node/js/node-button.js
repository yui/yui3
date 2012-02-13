YUI.add('node-button', function(Y) {
    var ATTRS = Y.ButtonBase.ATTRS;
    
    function beforeGet(name) {
        var getter = (ATTRS[name] && ATTRS[name].getter) || this._buttonGet;
        return getter.apply(this, arguments);
    };

    function beforeSet(name, val) {
        var setter = (ATTRS[name] && ATTRS[name].setter) || this._buttonSet;
        setter.apply(this, arguments);
        return this;
    };

    // (node)
    // (node, config)
    // (config)
    Y.Node.button = function(node, config) {
        config = Y.merge(config);
        node = config.srcNode = Y.one(config.srcNode || node);

        node._buttonGet = node.get;
        node._buttonSet = node.set;
        node.get = beforeGet;
        node.set = beforeSet;

        var button = new Y.ButtonBase(config);
        return node;
    };

}, '@VERSION@' ,{requires:['node-base', 'button-base']});
