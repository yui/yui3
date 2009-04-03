    /**
     * The Node Utility provides a DOM-like interface for interacting with DOM nodes.
     * @module node
     * @submodule node-base
     */    

    /**
     * The NodeList class provides a wrapper for manipulating DOM NodeLists.
     * NodeList properties can be accessed via the set/get methods.
     * Use Y.get() to retrieve NodeList instances.
     *
     * <strong>NOTE:</strong> NodeList properties are accessed using
     * the <code>set</code> and <code>get</code> methods.
     *
     * @class NodeList
     * @constructor
     */

var g_nodes = [],
    g_slice = Array.prototype.slice,

    NODE_NAME = 'nodeName',

Node = function() {
    Node.superclass.constructor.apply(this, arguments);
};

Node.NAME = 'Node';

Node.DOM_EVENTS = {
    click: true

};

Node._instances = [];

Node.get = function(node, doc, restrict) {
    var instance = Node._instances[node.id] || new Node({
        node: node,
        doc: doc,
        restrict: restrict
    });

    // null node returns null instance
    return (g_nodes[instance._yuid]) ? instance : null;
};

Node.ATTRS = {
    style: {
        value: {}
    }
};

// call with instance context
Node.DEFAULT_SETTER = function(attr, val) {
    var node = g_nodes[this._yuid];
    node[attr] = val;
};

// call with instance context
Node.DEFAULT_GETTER = function(attr) {
    var node = g_nodes[this._yuid];
    return node[attr];
};

Y.extend(Node, Y.Base);

Y.mix(Node.prototype, {
    initializer: function(config) {
        var doc = config.doc || Y.config.doc,
            node = config.node || null,
            uid;

        if (typeof node === 'string') {
            node = Y.Selector.query(node, doc, true);
        }

        if (node) {
            uid = node._yuid || Y.guid();
            try {
            } catch(e) {
                // IE: expandos only allowed on HTMLElements
            }

            this._yuid = uid;
            Node._instances[uid] = this;
            g_nodes[uid] = node;
        } else {
            Y.log('node not found: ' + config.node, 'error', 'Node');
        }
    },

    // TODO: move to Attribute
    hasAttr: function(attr) {
        return this._conf.get(attr);  
    },

    toString: function() {
        var str = '',
            errorMsg = this._yuid + ': not bound to a node',
            node = g_nodes[this._yuid] || {};

        if (node) {
            str += node[NODE_NAME];
            if (node.id) {
                str += '#' + node.id; 
            }

            if (node.className) {
                str += '.' + node.className.replace(' ', '.'); 
            }

            // TODO: add yuid?
        }
        return str || errorMsg;
    },

    _addDOMAttr: function(attr) {
        var domNode = g_nodes[this._yuid],
            topAttr = attr.split('.')[0]; // support foo.bar

        if (domNode && domNode[topAttr] !== undefined) {
            this.addAttr(topAttr, {
                getter: function() {
                    return Node.DEFAULT_GETTER.call(this, attr);
                },

                setter: function(val) {
                    Node.DEFAULT_SETTER.call(this, attr, val);
                }
            });
        } else {
            Y.log('unable to add DOM attribute: ' + attr + ' to node: ' + this, 'warn', 'Node');
        }
    },

    on: function(type, fn, context, arg) {
        var args = g_slice.call(arguments, 0),
            ret;

        args.splice(2, 0, g_nodes[this._yuid]);
        if (Node.DOM_EVENTS[type]) {
            Y.Event.attach.apply(Y.Event, args);
        }

        return Node.superclass.constructor.prototype.on.apply(this, arguments);
    },

    get: function(attr) {
        if (!this.hasAttr(attr)) {
            this._addDOMAttr(attr);
        }

        return Node.superclass.constructor.prototype.get.apply(this, arguments);
    },

    set: function(attr, val) {
        if (!this.hasAttr(attr)) {
            this._addDOMAttr(attr);
        }

        Node.superclass.constructor.prototype.set.apply(this, arguments);
    },

    destructor: function() {
        g_nodes[this._yuid] = [];
        delete Node._instances[this._yuid];
    }
}, true);

Y.Node = Node;
Y.get = Y.Node.get;
