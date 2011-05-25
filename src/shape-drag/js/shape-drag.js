       /**
        * Simple Drag plugin that can be attached to any object that implements all methods used to 
        * perform a drag operation.
        *
        * @module dd
        * @submodule shape-drag
        */
       /**
        * Simple Drag plugin that can be attached to any object that implements all methods used to 
        * perform a drag operation.
        *
        * @class ShapeDrag
        * @extends DD.Drag
        * @constructor
        * @namespace Plugin
        */


        var Drag = function(config) {
            config.node = config.host;
            Drag.superclass.constructor.call(this, config);
        };
        
        /**
         * @property NAME
         * @description dd-plugin
         * @type {String}
         */
        Drag.NAME = "shape-drag";

        /**
         * @property NS
         * @description The Drag instance will be placed on the Node instance under the dd namespace. It can be accessed via Node.dd;
         * @type {String}
         */
        Drag.NS = "dd";


        Drag.ATTRS = {
            /**
             * @attribute node
             * @description  Instance to use as the element to initiate a drag operation
             * @type Node
             */
            node: {
                setter: function(val)
                {
                    return this.getDraggable(val);
                }
            },
            /**
             * @attribute dragNode
             * @description Instance to use as the draggable element, defaults to node
             * @type Node
             */
            dragNode: {
                setter: function(val)
                {
                    return this.getDraggable(val);
                }
            }
        };
        
        Y.extend(Drag, Y.DD.Drag, {
            getDraggable: function (val)
            {
                var draggable;
                if(val.setXY && val.getXY && val.test && val.contains)
                {
                    draggable = val;
                }
                else
                {
                    Y.error('DD.ShapeDrag: Invalid Object Given: ' + val);
                }
                return draggable;
            }
        });
        Y.namespace('Plugin');
        Y.Plugin.ShapeDrag = Drag;
