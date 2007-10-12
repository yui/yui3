(function() {
    var Y = YAHOO.util,
        YUI = YAHOO.lang.CONST;

    // constructor
    var Class = function Element(node, attributes) {
        YAHOO.log('constructor called', 'life', 'Element');
        attributes = attributes || {};
            attributes.node = Y.Dom.get(node) ||
                    document.createElement(Class.DEFAULT_TAG_NAME);

        attributes.id = Y.Dom.generateId(attributes.node);

        this._ = { node: attributes.node };
        Class.superclass.constructor.call(this, attributes);
    };

    Class.DEFAULT_TAG_NAME = YUI.DIV;

    Class.CONFIG = {
        'node': {
            set: function(node) {
                this._.node = node;
                this.set(YUI.ID, Y.Dom.generateId(node));
            },
            validator: function(node) {
                return !!node.tagName;
            }
        },
        'id': {
            set: function(id) {
                if (_instances[this._.node.id]) {
                    delete _instances[this._.node.id];
                }
                _instances[id] = this;
                this._.node.id = id;
            }
        }
    };

    Class.getById = function(id) {
        return _instances[id];
    };

    // private
    var _instances = {};

    // public 
    var proto = {
        init: function(attributes) {
            YAHOO.log('init called', 'life', 'Element');
            _instances[this.get('id')] = this;
        },
    
        // returning false from before event prevents default
        destructor: function() {
            YAHOO.log('Element destructor called', 'life', 'Element');
            var children = this._.node[YUI.CHILDREN] || this._.node[YUI.CHILD_NODES];
            var id;
            while (children.length) {
                id = children[0].id;
                children[0].parentNode.removeChild(children[0]);
                if (id) {
                    var el = Widget.getById(id);
                    if (el) {
                        el.destroy();
                    }
                }
            }
        },

        set: function(prop, val) {
            if (this._.node[prop] !== undefined) {
                if (!this._configs[prop]) {
                    this.setAttributeConfig(prop);
                }
                if (!this._configs[prop].set) { // default to setting HTMLElement attribute
                    this._.node[prop] = val;
                }
            }
            Y.AttributeProvider.prototype.set.apply(this, arguments);
        },

        get: function(prop) {
            // if HTMLAttribute, return from node, unless attribute.get()
            if (this._.node[prop] !== undefined) {
                if (this._configs[prop] && !this._configs[prop].get) { 
                    return this._.node[prop];
                }
            }
            Y.AttributeProvider.prototype.get.apply(this, arguments);
        },

        toString: function() {
            return 'Element: ' + this.get('id');
        }
    };

    // protected
    proto._ = null;

    YAHOO.lang.extend(Class, Y.Object, proto);
    //YAHOO.lang.augmentObject(Class, Y.Object); // add static members
    Y.Element = Class;

})();
