(function() {
    var Y = YAHOO.util,
        YUI = YAHOO.lang.CONST;

    // constructor
    var Class = function Widget(node, attributes) {
        YAHOO.log('constructor called', 'info', 'Widget');
        attributes = attributes || {};
        attributes.node = new Y.Element(node);

        Class.superclass.constructor.call(this, attributes);
    };

    Class.CONFIG = {
        'node': {
            set: function(node) {
                // TODO: require Y.Element? re-initialize?
            },
            validator: function(el) {
                return true;//!!el.tagName || el.get;
            }
        }
    };

    Class.getByNodeId = function(id) {
        return _instances[id]; 
    };
    
    var _instances = {};

    // public 
    var proto = {
        init: function(attributes) {
            YAHOO.log('init called', 'info', 'Widget');
            _instances[attributes.node.get(YUI.ID)] = this;
        },

        render: function() {
            var constructor = this.constructor,
                retVal = this.fireEvent(YUI.BeforeRender);

            if (retVal === false) { // returning false from beforeEvent cancels TODO: use preventDefault/stopPropagation instead?
                return false;
            }

            while (constructor && constructor.prototype) { // call destructors from bottom up
                constructor.prototype.renderer.apply(this, arguments);
                constructor = constructor.superclass ? constructor.superclass.constructor : null;
            }

            this.fireEvent(YUI.Render);
        },

        renderer: function() {

        },

        destructor: function() {
            YAHOO.log('destructor called', 'info', 'Widget');
            this.get('node').destroy();
        },

        toString: function() {
            return 'Widget: ' + this.get('node').get('id');
        }
    };

    YAHOO.lang.extend(Class, Y.Object, proto);
    //YAHOO.lang.augmentObject(Class, Y.Object); // add static members
    YAHOO.widget.Widget = Class;

})();
