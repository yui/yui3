YUI.add('nodefxplugin', function(Y) {

        Y.Plugin = Y.Plugin || {};

        function NodeFX(config) {
            config.node = config.owner;
            NodeFX.superclass.constructor.apply(this, arguments);
        }

        NodeFX.NAME = "nodefxplugin";
        NodeFX.NS = "fx";

        var proto = {
        };

        Y.extend(NodeFX, Y.Anim);
        Y.Plugin.NodeFX = NodeFX;

}, '3.0.0', { requires: ['anim'] });
