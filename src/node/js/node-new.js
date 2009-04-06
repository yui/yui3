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
    // TODO: move to Attribute
    hasAttr: function(attr) {
        return !!this._conf.get(attr);  
    },

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

    addNode: function(node, position) {
        //return Y.DOM.insertNode(node, position);
    },

    on: function(type, fn, context, arg) {
        var args = g_slice.call(arguments, 0);

        args.splice(2, 0, g_nodes[this[UID]]);
        if (Node.DOM_EVENTS[type]) {
            Y.Event.attach.apply(Y.Event, args);
        }

        return SuperConstrProto.on.apply(this, arguments);
    },

    get: function(attr) {
        if (!this.hasAttr(attr)) {
            this._addDOMAttr(attr);
        }

        return SuperConstrProto.get.apply(this, arguments);
    },

    set: function(attr, val) {
        if (!this.hasAttr(attr)) {
            this._addDOMAttr(attr);
        }

        SuperConstrProto.set.apply(this, arguments);
    },

    destructor: function() {
        g_nodes[this[UID]] = [];
        delete Node._instances[this[UID]];
    }
}, true);

Y.Node = Node;
Y.get = Y.Node.get;
