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

// "globals"
var g_nodes = [],
    g_slice = Array.prototype.slice,

    DOT = '.',
    NODE_NAME = 'nodeName',
    NODE_TYPE = 'nodeTypType',
    TAG_NAME = 'tagName',
    UID = '_yuid',

    Node = function(config) {
        this[UID] = Y.stamp(config.node);
        g_nodes[this[UID]] = config.node;
        Node._instances[this[UID]] = this;

        SuperConstr.apply(this, arguments);
    },

    SuperConstr = Y.Base,
    SuperConstrProto = Y.Base.prototype;
// end "globals"

Node.NAME = 'Node';

Node.DOM_EVENTS = {
    click: true
};

Node._instances = {};

Node.getDOMNode = function(instance) {
    return g_nodes[instance[UID]];
};

Node.scrubVal = function(val, node, depth) {
    if (val !== undefined) {
        if (typeof val === 'object' || typeof val === 'function') { // safari nodeList === function
            if (val !== null && (
                    NODE_TYPE in val || // dom node
                    val.item || // dom collection or Node instance
                    (val[0] && val[0][NODE_TYPE]) || // assume array of nodes
                    val.document) // window TODO: restrict?
                ) { 
                if (node && _restrict && _restrict[node._yuid] && !node.contains(val)) {
                    val = null; // not allowed to go outside of root node
                } else {
                    if (val[NODE_TYPE] || val.document) { // node or window
                        val = Y.get(val);
                    } else { // assume nodeList
                        val = Y.all(val);
                    }
                }
            } else {
                depth = (depth === undefined) ? 4 : depth;
                if (depth > 0) {
                    for (var i in val) { // TODO: test this and pull hasOwnProperty check if safe?
                        if (val.hasOwnProperty && val.hasOwnProperty(i)) {
                            val[i] = Node.scrubVal(val[i], node, --depth);
                        }
                    }
                }
                
            }
        }
    } else {
        val = node; // for chaining
    }

    return val;
};

Node.importMethod = function(host, name, altName) {
    if (typeof name === 'string') {
        altName = altName || name;
        console.log(arguments);
        if (host && host[name] && typeof host[name] === 'function') {
            Node.prototype[altName] = function() {
                var args = g_slice.call(arguments),
                    ret;

                args.unshift(g_nodes[this[UID]]);
                ret = Node.scrubVal(host[name].apply(host, args), this);
                return ret;
            };
        }
    } else {
        Y.each(name, function(n) {
            Node.importMethod(host, n);
        });
    }
};

Node.get = function(node, doc, restrict) {
    var instance = null;
    node = (typeof node === 'string') ? Y.Selector.query(node, doc, true) : node;

    if (node) {
        instance = Node._instances[node[UID]] || // reuse exising instances
                new Node({
                    node: node,
                    restricted: restrict
                });
    }
    return instance;
};

Node.create = function() {
    return Y.get(Y.DOM.create.apply(Y.DOM, arguments));
};

Node.ATTRS = {
/*
    style: {
        setter: function(val, e) {
            var node = g_nodes[this[UID]],
                name = e.attrName,
                path;

            if (node) {
               if (typeof val === 'string' && name.indexOf(DOT) > -1) {
                    path = name.split('.');
                    Y.DOM.setStyle(node, path[1], val);
                } else { // assume multiple styles
                    Y.DOM.setStyles(node, val);
                }
            } else {
                Y.log('unable to set style: ' + name + ' on node :' + this, 'warn', 'Node');
            }
        },
        value: {}
    },
*/
    text: {
        getter: function() {
            return Y.DOM.getText(g_nodes[this[UID]]);
        },

        readOnly: true
    },

    'options': {
        getter: function() {
            var node = g_nodes[this[UID]];
            return (node) ? Y.all(node.getElementsByTagName('option')) : [];
        }
    },

    /**
     * Returns a NodeList instance. 
     * @property children
     * @type NodeList
     */
    'children': {
        getter: function() {
            var node = g_nodes[this[UID]],
                children = node.children;

            if (children === undefined) {
                var childNodes = node.childNodes;
                children = [];

                for (var i = 0, len = childNodes.length; i < len; ++i) {
                    if (childNodes[i][TAG_NAME]) {
                        children[children.length] = childNodes[i];
                    }
                }
            }
            return Y.all(children);
        }
    },

    restricted: {
        writeOnce: true,
        value: false
    }
};

// call with instance context
Node.DEFAULT_SETTER = function(name, val) {
    var node = g_nodes[this[UID]],
        strPath, path;

    if (name.indexOf(DOT) !== -1) {
        strPath = name;
        path = name.split(DOT);
        name = path.shift();

        if (path) {
           val = Y.Object.setValue(node[name], path, val);

           if (val === undefined) {
               Y.log('set ' + strPath + 'failed; attribute sub path is invalid', 'error', 'attribute');
               allowSet = false;
           }
        }
    } else {
        node[name] = val;    
    }
    return val;
};

// call with instance context
Node.DEFAULT_GETTER = function(attr) {
    var node = g_nodes[this[UID]];
    return node[attr];
};

Y.extend(Node, Y.Base);

Y.mix(Node.prototype, {
    toString: function() {
        var str = '',
            errorMsg = this[UID] + ': not bound to a node',
            node = g_nodes[this[UID]];

        if (node) {
            str += node[NODE_NAME];
            if (node.id) {
                str += '#' + node.id; 
            }

            if (node.className) {
                str += '.' + node.className.replace(' ', '.'); 
            }

            // TODO: add yuid?
            str += ' ' + this[UID];
        }
        return str || errorMsg;
    },

    _addDOMAttr: function(attr) {
        var domNode = g_nodes[this[UID]],
            topAttr = attr.split('.')[0]; // support foo.bar

        if (domNode && domNode[topAttr] !== undefined) {
            this.addAttr(topAttr, {
                getter: function() {
                    return Node.DEFAULT_GETTER.call(this, attr);
                },

                setter: function(val) {
                    return Node.DEFAULT_SETTER.call(this, attr, val);
                }
            });
        } else {
            Y.log('unable to add DOM attribute: ' + attr + ' to node: ' + this, 'warn', 'Node');
        }
    },

    addNode: function(content, where) {
        return Y.DOM.insertNode(g_nodes[this[UID]], content, where);
    },

    on: function(type, fn, context, arg) {
        var args = g_slice.call(arguments, 0);
        args.splice(2, 0, g_nodes[this[UID]]);

        if (Node.DOM_EVENTS[type]) {
            Y.Event.attach.apply(Y.Event, args);
        }

        return SuperConstrProto.on.apply(this, arguments);
    },

   /**
     * Detaches a DOM event handler. 
     * @method detach
     * @param {String} type The type of DOM Event
     * @param {Function} fn The handler to call when the event fires 
     */
    detach: function(type, fn) {
        var args = _slice.call(arguments, 0);
        args.splice(2, 0, g_nodes[this[UID]]);
        return Y.Event.detach.apply(Y.Event, args);
    },

    get: function(attr) {
        if (!this.attrAdded(attr)) {
            this._addDOMAttr(attr);
        }

        return SuperConstrProto.get.apply(this, arguments);
    },

    set: function(attr, val) {
        if (!this.attrAdded(attr)) {
            this._addDOMAttr(attr);
        }

        return SuperConstrProto.set.apply(this, arguments);
    },

    // TODO: safe enough? 
    invoke: function(node, method, a, b, c, d, e) {
        var ret;

        if (a) { // first 2 may be Node instances
            a = (a[NODE_TYPE]) ? a : Node.getDOMNode(a);
            if (b) {
                b = (b[NODE_TYPE]) ? b : Node.getDOMNode(b);
            }
        }

        ret = node[method](a, b, c, d, e);    
        return ret;
    },

    destructor: function() {
        g_nodes[this[UID]] = [];
        delete Node._instances[this[UID]];
    }
}, true);

Y.Node = Node;
Y.get = Y.Node.get;
