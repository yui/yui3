YUI.add('node', function(Y) {

    /**
     * The NodeList Utility provides a DOM-like interface for interacting with DOM nodes.
     * @module node
     * @submodule node-list
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

Y.Array._diff = function(a, b) {
    var removed = [],
        present = false;

    outer:
    for (var i = 0, lenA = a.length; i < lenA; i++) {
        present = false;
        for (var j = 0, lenB = b.length; j < lenB; j++) {
            if (a[i] === b[j]) {
                present = true;
                continue outer;
            }
        }
        if (!present) {
            removed[removed.length] = a[i];
        }
    }
    return removed;
};

Y.Array.diff = function(a, b) {
    return {
        added: Y.Array._diff(b, a),
        removed: Y.Array._diff(a, b)
    }; 
};

// "globals"
var g_nodelists = [],
    g_slice = Array.prototype.slice,

    UID = '_yuid',

    NodeList = function(config) {
        var doc = config.doc || Y.config.doc,
            nodes = config.nodes || [];

        if (typeof nodes === 'string') {
            this._query = nodes;
            nodes = Y.Selector.query(nodes, doc);
        }

        Y.stamp(this);
        NodeList._instances[this[UID]] = this;
        g_nodelists[this[UID]] = nodes;

        NodeList.superclass.constructor.apply(this, arguments);
    };
// end "globals"

NodeList.NAME = 'NodeList';

NodeList.ATTRS = {
    style: {
        value: {}
    }
};

NodeList._instances = [];

NodeList.each = function(instance, fn, context) {
    var nodes = g_nodelists[instance[UID]];
    if (nodes && nodes.length) {
        Y.Array.each(nodes, fn, context || instance);
    } else {
        Y.log('no nodes bound to ' + this, 'warn', 'NodeList');
    }
};

// call with instance context
NodeList.DEFAULT_SETTER = function(attr, val) {
    var tmp = NodeList._tmpNode =
            NodeList._tmpNode || Y.Node.create('<div>');
    NodeList.each(this, function(node) {
        var instance = Y.Node._instances[node[UID]];
        // TODO: use node.set if instance exists
        if (!instance) {
            g_nodes[tmp[UID]] = node;
            instance = tmp;
        }
        instance.set(attr, val);
    });
};

// call with instance context
NodeList.DEFAULT_GETTER = function(attr) {
    var tmp = NodeList._tmpNode =
            NodeList._tmpNode || Y.Node.create('<div>'),
        ret = [];

    // TODO: use node.get if instance exists
    NodeList.each(this, function(node) {
        var instance = Y.Node._instances[node[UID]];
        if (!instance) { // reuse tmp instance
            g_nodes[tmp[UID]] = node;
            instance = tmp;
        }
        ret[ret.length] = instance.get(attr);
    });
    return ret;
};

Y.extend(NodeList, Y.Base);

Y.mix(NodeList.prototype, {
    initializer: function(config) {
    },

    // TODO: move to Attribute
    hasAttr: function(attr) {
        return this._conf.get(attr);  
    },

    get: function(attr) {
        if (!this.hasAttr(attr)) {
            this._addAttr(attr);
        }

        return NodeList.superclass.constructor.prototype.get.apply(this, arguments);
    },

    set: function(attr, val) {
        if (!this.hasAttr(attr)) {
            this._addAttr(attr);
        }

        NodeList.superclass.constructor.prototype.set.apply(this, arguments);
    },

    on: function(type, fn, context, arg) {
        var args = g_slice.call(arguments, 0),
            ret;

        args.splice(2, 0, g_nodelists[this[UID]]);
        if (Node.DOM_EVENTS[type]) {
            Y.Event.attach.apply(Y.Event, args);
        }

        return NodeList.superclass.constructor.prototype.on.apply(this, arguments);
    },

    destructor: function() {
        g_nodelists[this[UID]] = [];
        delete NodeList._instances[this[UID]];
    },

    refresh: function() {
        var doc,
            diff,
            oldList = g_nodelists[this[UID]];
        if (this._query) {
            if (g_nodelists[this[UID]] &&
                    g_nodelists[this[UID]][0] && 
                    g_nodelists[this[UID]][0].ownerDocument) {
                doc = g_nodelists[this[UID]][0].ownerDocument;
            }

            g_nodelists[this[UID]] = Y.Selector.query(this._query, doc || Y.config.doc);        
            diff = Y.Array.diff(oldList, g_nodelists[this[UID]]); 
            diff.added = diff.added ? Y.all(diff.added) : null;
            diff.removed = diff.removed ? Y.all(diff.removed) : null;
            this.fire('refresh', diff);
        }
    },

    size: function() {
        return g_nodelists[this[UID]].length;
    },

    toString: function() {
        var str = '',
            errorMsg = this[UID] + ': not bound to any nodes',
            nodes = g_nodelists[this[UID]];

        if (nodes && nodes[0]) {
            var node = nodes[0];
            str += node[NODE_NAME];
            if (node.id) {
                str += '#' + node.id; 
            }

            if (node.className) {
                str += '.' + node.className.replace(' ', '.'); 
            }

            if (nodes.length > 1) {
                str += '...[' + nodes.length + ' items]';
            }
        }
        return str || errorMsg;
    },

    _addAttr: function(attr) {
        var nodes = g_nodelists[this[UID]] || [];
        this.addAttr(attr, {
            getter: function() {
                return NodeList.DEFAULT_GETTER.call(this, attr);
            },

            setter: function(val) {
                NodeList.DEFAULT_SETTER.call(this, attr, val);
            }
        });
    }
}, true);

Y.NodeList = NodeList;
Y.all = function(nodes, doc, restrict) {
    var nodelist = new NodeList({
        nodes: nodes,
        doc: doc,
        restrict: restrict
    });

    // zero-length result returns null
    return nodelist.size() ? nodelist : null;
};
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
    text: {
        getter: function() {
            return Y.DOM.getText(g_nodes[this[UID]]);
        },

        readOnly: true
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


}, '@VERSION@' ,{requires:['dom']});
