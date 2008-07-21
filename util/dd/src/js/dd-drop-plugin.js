       /**
        * This is a simple Drop plugin that can be attached to a Node via the plug method.
        * <p>Module Name: <strong>dd-drop-plugin</strong></p>
        * @module dd-plugin
        */
       /**
        * This is a simple Drop plugin that can be attached to a Node via the plug method.
        * @class DropPlugin
        * @extends drop
        * @constructor
        */

        Y.Plugin = Y.Plugin || {};

        var Drop = function(config) {
            config.node = config.owner;
            Drop.superclass.constructor.apply(this, arguments);
        };
        
        /**
        * @property NAME
        * @description dd-drop-plugin
        * @type {String}
        */
        Drop.NAME = "dd-drop-plugin";
        /**
        * @property NS
        * @description The Drop instance will be placed on the Node instance under the drop namespace. It can be accessed via Node.drop;
        * @type {String}
        */
        Drop.NS = "drop";


        Y.extend(Drop, Y.DD.Drop);
        Y.Plugin.Drop = Drop;

