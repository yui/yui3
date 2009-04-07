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

    /**
     * Retrieves the Node instance at the given index. 
     * @method item
     *
     * @param {Number} index The index of the target Node.
     * @return {Node} The Node instance at the given index.
     */
    item: function(index) {
        var nodes = g_nodelists[this[UID]] || [];
        return Y.get(nodes[index]);
    },

    /**
     * Applies the given function to each Node in the NodeList.
     * @method each
     * @param {Function} fn The function to apply 
     * @param {Object} context optional An optional context to apply the function with
     * Default context is the NodeList instance
     * @return {NodeList} NodeList containing the updated collection 
     * @chainable
     */
    each: function(fn, context) {
        var instance = this;
        context = context || this;
        Y.each(g_nodelists[this[UID]], function(node, index) {
            return fn.call(context, Y.get(node), index, instance);
        });
    },

    /**
     * Filters the NodeList instance down to only nodes matching the given selector.
     * @method filter
     * @param {String} selector The selector to filter against
     * @return {NodeList} NodeList containing the updated collection 
     * @see Selector
     */
    filter: function(selector) {
        return Node.scrubVal(Selector.filter(g_nodelists[this[UID]], selector), this);
    },

    get: function(attr) {
        if (!this.attrAdded(attr)) {
            this._addAttr(attr);
        }

        return NodeList.superclass.constructor.prototype.get.apply(this, arguments);
    },

    set: function(attr, val) {
        if (!this.attrAdded(attr)) {
            this._addAttr(attr);
        }

        return NodeList.superclass.constructor.prototype.set.apply(this, arguments);
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

    /**
     * Returns the current number of items in the NodeList.
     * @method size
     * @return {Int} The number of items in the NodeList. 
     */
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
