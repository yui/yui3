YUI.add('dd-plugin', function(Y) {

       /**
        * 3.x DragDrop
        * @class DragPlugin
        * @module dd-plugin
        * @namespace Plugin
        * @extends drag
        * @constructor
        */

        Y.Plugin = Y.Plugin || {};

        var Drag = function(config) {
            config.node = config.owner;
            Drag.superclass.constructor.apply(this, arguments);
        };

        Drag.NAME = "dd-plugin";
        Drag.NS = "dd";


        Y.extend(Drag, Y.DD.Drag);
        Y.Plugin.Drag = Drag;



}, '@VERSION@' ,{skinnable:false, requires:['dd-drag'], optional:['dd-constrain', 'dd-proxy']});
