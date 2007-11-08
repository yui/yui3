(function() {
var Dom = YAHOO.util.Dom,
    Event = YAHOO.util.Event,
    Lang = YAHOO.lang;


    var Draggable = function() {
        this.constructor.superclass.constructor.call(this, arguments);
    };

    Draggable.CONFIG = {
        'node': {
            set: function(node) {
                var node = YAHOO.util.Dom.get(node);
                return node;
            },
            validator: function(node) {
                return node && node.tagName; // HTMLElement
            } 
        }
    };

    var proto = {
        initializer : function(config) {
            config = config[0];
            this.__.node = config.parent.get('node').get('node');
            this.__.parent = config.parent;
            this.__.handle = this.__.node;
            if (config.handle) {
                this.__.handle = config.handle;
            }
            if (!this.__.parent._.rendered) {
                this.__.parent.on('beforeRender', function() {            
                    this.__.dd = new YAHOO.util.DD(this.__.node, this.__.node.id + '_draggable', { dragOnly: true });
                    Dom.addClass(this.__.handle, 'yui-draggable');
                    if (this.__.handle != this.__.node) {
                        this.__.dd.setHandleElId(this.__.handle);
                    }
                }, this, true);
            } else {
                this.__.dd = new YAHOO.util.DD(this.__.node, this.__.node.id + '_draggable', { dragOnly: true });
                Dom.addClass(this.__.handle, 'yui-draggable');
                if (this.__.handle != this.__.node) {
                    this.__.dd.setHandleElId(this.__.handle);
                }
            }

            YAHOO.log('init', 'info', 'Draggable');
        },
        destructor: function() {
            Dom.removeClass(this.__.handle, 'yui-draggable');
            this.__.dd.unreg();
        },
        initAttributes: function(attr) {
            /*
            this.setAttributeConfig('wrap', {
                writeOnce: true,
                value: attr.wrap || false
            });
            */
        },
        toString: function() {
            return 'Draggable';
        }


    };


    YAHOO.lang.extend(Draggable, YAHOO.util.Object, proto);
    YAHOO.util.Draggable = Draggable;
})();
