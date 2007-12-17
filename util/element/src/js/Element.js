(function() {
    var Y = YAHOO.util,
        YUI = YAHOO.lang.CONST;

    // constructor
    var Element = function Element(attributes) {
        YAHOO.log('constructor called', 'life', 'Element');

        var attr = {};
        YAHOO.lang.augmentObject(attr, attributes); // break obj ref 
        attr.node = attributes.node || Y.Dom.get(attributes.id) || document.createElement(Element.DEFAULT_TAG_NAME);
        attr.id = attributes.id || Y.Dom.generateId(attributes.node);

        if (_instances[attr.id]) {
            throw new Error('Element error: element already exists');
        }

        Element.superclass.constructor.call(this, attr);
    };

    Element.get = function(node) { // TODO: what about config? reconfigure existing Element? No config?
        node = Y.Dom.get(node);
        var id = node ? node.id : Y.Dom.generateId();
        return _instances[id] || new Element( {id: id} );
    };

    Element.create = function(template) { // TODO: what about config? reconfigure existing Element? No config?
        node = Y.Dom.get(node);
        var id = node.id;
        return _instances[id] || new Element(id);
    };

    Element.DEFAULT_TAG_NAME = YUI.DIV;

    Element.CONFIG = {
        'node': {
            set: function(node) {
                this._node = node;
                this.set(YUI.ID, Y.Dom.generateId(node));
            },
            validator: function(node) {
                return !!node.tagName;
            }
        },
        'id': {
            set: function(id) {
                if (_instances[this._node.id]) {
                    delete _instances[this._node.id];
                }
                _instances[id] = this;
                this._node.id = id;
            }
        },
        'visible' : {
            set: function(val) {
                if (val) {
                    Y.Dom.removeClass(this._node, YUI.CLASSES.HIDDEN);
                } else {
                    Y.Dom.addClass(this._node, YUI.CLASSES.HIDDEN);
                }
            },
            value: true
        },
        'disabled' : {
            set: function(val) {
                if (val) {
                    Y.Dom.addClass(this.get('node'), YUI.CLASSES.DISABLED);
                } else {
                    Y.Dom.removeClass(this.get('node'), YUI.CLASSES.DISABLED);
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

            this._node = this.get('node');
            for (var attribute in attributes) { //  
                if (this._node[attribute] !== undefined) { // set HTMLAttributes
                    this.set(attribute, attributes[attribute]);
                }
            }

            _instances[this.get('id')] = this;
        },

        // returning false from before event prevents default
        destructor: function() {
            YAHOO.log('Element destructor called', 'life', 'Element');
            var children = this._node[YUI.CHILDREN] || this._node[YUI.CHILD_NODES];
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
            if (this._node[prop] !== undefined) {
                if (!this._configs[prop]) {
                    this.setAttributeConfig(prop);
                }
                if (!this._configs[prop].set) { // default to setting HTMLElement attribute
                    this._node[prop] = val;
                }
            }
            return Y.AttributeProvider.prototype.set.apply(this, arguments);
        },

        get: function(prop) {
            // if HTMLAttribute, return from node, unless attribute.get()
            if (this._node[prop] !== undefined) {
                if (this._configs[prop] && !this._configs[prop].get) { 
                    return this._node[prop];
                }
            }
            return Y.AttributeProvider.prototype.get.apply(this, arguments);
        },

        setStyle: function(prop, val) {
            Y.Dom.setStyle(this._node, prop, val);
        },

        getStyle: function(prop, val) {
            Y.Dom.getStyle(this._node, prop);
        },

        addClass: function(className) {
            Y.Dom.addClass(this._node, className);
        },

        insertBefore: function(node, refNode) {
            if ( !Y.Dom.isAncestor(this._node, refNode) ) {
                this._node.appendChild(node);
                YAHOO.log('insertBefore: appended ' + node + ' to ' + this, 'info', 'Element'); 
            } else {
                Y.Dom.insertBefore(node, refNode);
                YAHOO.log(node + ' inserted before ' + refNode, 'info', 'Element'); 
            }
        },

        insertAfter: function(node, refNode) {
            if ( !refNode || !Y.Dom.isAncestor(this._node, refNode) ) {
                this._node.appendChild(node);
                YAHOO.log('insertAfter: appended ' + node + ' to ' + this, 'info', 'Element'); 
            } else {
                Y.Dom.insertAfter(node, refNode);
                YAHOO.log(node + ' inserted after ' + refNode, 'info', 'Element'); 
            }
        },

        hasClass: function(className) {
            return Y.Dom.hasClass(this._node, className);
        },

        removeClass: function(className) {
            Y.Dom.removeClass(this._node, className);
        },

        getChildren: function() {
            return Y.Dom.getChildren(this._node);
        },

        appendTo: function(parent, beforeNode) {
            parent = Y.Dom.get(parent);
            beforeNode = Y.Dom.get(beforeNode);
            if (beforeNode) {
                beforeNode.parentNode.insertBefore(this._node, beforeNode);
            } else {
                parent.appendChild(this._node);
            }
        }, 

        toString: function() {
            return 'Element: ' + this.get('id');
        }
    };

    YAHOO.lang.extend(Element, Y.Object, proto);
    Y.Element = Element;
    //YAHOO.lang.augmentObject(Element, Y.Object); // add static members



})();
