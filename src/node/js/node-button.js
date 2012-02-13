YUI.add('node-button', function(Y) {
    // (node)
    // (node, config)
    // (config)
    Y.Node.button = function(node, config) {
        if (node && !config) {
            if (! (node.nodeType || node.getDOMNode || typeof node == 'string')) {
                config = node;
                node = config.srcNode;
            }
        }
        node = node || config.srcNode || Y.DOM.create(Y.ButtonBase.prototype.TEMPLATE);

        return Y.one(node).plug(Y.Plugin.Button, config);
    };

}, '@VERSION@' ,{requires:['node-base', 'button-base']});
