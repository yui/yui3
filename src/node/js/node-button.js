YUI.add('node-button', function(Y) {
    // (node)
    // (node, config)
    // (config)
    Y.Node.button = function(node, config) {
        return Y.one(node).plug(Y.Plugin.Button, config);
    };

}, '@VERSION@' ,{requires:['node-base', 'button-base']});
