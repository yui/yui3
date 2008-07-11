Y.namespace('Plugin');
//Y.Plugin = Y.Plugin || {};
Y.Plugin.NodeFX = function(config) {
    config.node = config.owner;
    Y.Plugin.NodeFX.superclass.constructor.apply(this, arguments);
};

Y.Plugin.NodeFX.NAME = "nodefxplugin";
Y.Plugin.NodeFX.NS = "fx";

Y.extend(Y.Plugin.NodeFX, Y.Anim);

