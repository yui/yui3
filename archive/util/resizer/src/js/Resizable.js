(function() {
var Dom = YAHOO.util.Dom,
    Event = YAHOO.util.Event,
    Lang = YAHOO.lang;


    var Resizable = function(parent, config) {
        this.constructor.superclass.constructor.call(this, arguments);
        this.__.parent = parent;
    };

    Resizable.CONFIG = {
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
            console.log(this, arguments);
            /*
            config = config[0];
            this.__.node = config.node.get('node');
            this.__.parent = config.parent;

            YAHOO.log('init', 'info', 'Resize');
            if (!this.__.parent._.rendered) {
                this.__.parent.on('beforeRender', function() {
                    this.resizer(this.__.node, config);
                }, this, true);
            } else {
                this.resizer(this.__.node, config);
            }
            */
        },
        resizer: function(node, config) {
            this.__.resizer = new YAHOO.util.Resize(node, config);
        },
        destructor: function() {
        },
        toString: function() {
            return 'Resizable';
        }


    };


    YAHOO.lang.extend(Resizable, YAHOO.util.Object, proto);
    YAHOO.util.Resizable = Resizable;
})();
