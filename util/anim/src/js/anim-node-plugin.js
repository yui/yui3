/**
 *  Binds an Anim instance to a Node instance
 * @module anim
 * @submodule anim-node-plugin
 */

Y.NodeFX = function(config) {
    var config = Y.merge(config);
    config.node = config.owner;
    delete config.node;
    Y.NodeFX.superclass.constructor.apply(this, arguments);
};

Y.NodeFX.NAME = "nodefx";
Y.NodeFX.NS = "fx";

Y.extend(Y.NodeFX, Y.Anim);
Y.augment(Y.NodeFX, Y.Plugin);

