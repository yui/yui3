(function() {
    var Y = YAHOO.util,
        YUI = YAHOO.lang.CONST;

    // constructor
    var Element = function Element(node, attributes) {
        YAHOO.log('constructor called', 'life', 'Element');
        attributes = attributes || {};

        attributes.node = Y.Dom.get(node) ||
                document.createElement(Element.DEFAULT_TAG_NAME);

        attributes.id = Y.Dom.generateId(attributes.node);
        if (_instances[attributes.id]) {
            throw('Element error: element already exists');
        }

        Element.superclass.constructor.call(this, attributes);
        this._.node = attributes.node;
    };

    Element.get = function(node) { // TODO: what about config? reconfigure existing Element? No config?
        node = Y.Dom.get(node);
        var id = node.id;
        return _instances[id] || new Element(id);
    };

    Element.DEFAULT_TAG_NAME = YUI.DIV;

    Element.CONFIG = {
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
        },
        'visible' : {
            set: function(val) {
                if (val) {
                    Y.Dom.removeClass(this._.node, YUI.CSS.HIDDEN);
                } else {
                    Y.Dom.addClass(this._.node, YUI.CSS.HIDDEN);
                }
            },
            value: true
        },
        'disabled' : {
            set: function(val) {
                if (val) {
                    Y.Dom.addClass(this.get('node'), YUI.CSS.DISABLED);
                } else {
                    Y.Dom.removeClass(this.get('node'), YUI.CSS.DISABLED);
                }
            },
            value: false
        },
        'focused' : {
            set: function(val) {
                if (val) {
                    //this.get('node').focus();
                } else {
                    //this.get('node').blur();
                }
            },
            value: false
        }
    };

    // private
    var _instances = {};

    // public 
    var proto = {
        initializer: function(attributes) {
            YAHOO.log('initializer called', 'life', 'Element');
            for (var namespace in Element.BEHAVIORS) {
                this[namespace] = new Element.BEHAVIORS[namespace].behavior(this._.node);
            }

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

        addBehavior: function(namespace, behavior, config) {
            if (this[namespace]) {
                throw('behavior namespace' + namespace + ' already in use');
            }
            this[namespace] = new behavior(config);
        },

        removeBehavior: function(namespace) {
            delete this[namespace];
        },

        hasBehavior: function(namespace) {
            return namespace in this;
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
            return Y.AttributeProvider.prototype.get.apply(this, arguments);
        },

        setStyle: function(prop, val) {
            Y.Dom.setStyle(this._.node, prop, val);
        },

        getStyle: function(prop, val) {
            Y.Dom.getStyle(this._.node, prop);
        },

        toString: function() {
            return 'Element: ' + this.get('id');
        }
    };

    YAHOO.lang.extend(Element, Y.Object, proto);
    Y.Element = Element;
    //YAHOO.lang.augmentObject(Element, Y.Object); // add static members



})();
