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
        present = false,
        i, j, lenA, lenB;

    outer:
    for (i = 0, lenA = a.length; i < lenA; i++) {
        present = false;
        for (j = 0, lenB = b.length; j < lenB; j++) {
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
var g_nodelists = {},
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

        if (config.restricted) {
            g_restrict = this[UID];
        }
        NodeList.superclass.constructor.apply(this, arguments);
    };
// end "globals"

NodeList.NAME = 'NodeList';

/**
 * Retrieves the DOM nodes bound to a NodeList instance
 * @method getDOMNodes
 * @static
 *
 * @param {Y.NodeList} node The NodeList instance
 * @return {Array} The array of DOM nodes bound to the NodeList
 */
NodeList.getDOMNodes = function(nodeList) {
    return g_nodelists[nodeList[UID]];
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

NodeList.addMethod = function(name, fn, context) {
    var tmp = NodeList._getTempNode();
    if (name && fn) {
        NodeList.prototype[name] = function() {
            var ret = [],
                args = arguments;

            NodeList.each(this, function(node) {
                var instance = Y.Node._instances[node[UID]],
                    ctx,
                    result;

                if (!instance) {
                    g_nodes[tmp[UID]] = node;
                    instance = tmp;
                }
                ctx = context || instance;
                result = fn.apply(ctx, args);
                if (result !== undefined && result !== instance) {
                    ret[ret.length] = result;
                }
            });

            // TODO: remove tmp pointer
            return ret.length ? ret : this;
        };
    } else {
        Y.log('unable to add method: ' + name, 'warn', 'Node');
    }
};

NodeList.importMethod = function(host, name, altName) {
    if (typeof name === 'string') {
        altName = altName || name;
        NodeList.addMethod(name, host[name]);
    } else {
        Y.each(name, function(n) {
            NodeList.importMethod(host, n);
        });
    }
};

NodeList._getTempNode = function() {
    var tmp = NodeList._tempNode;
        if (!tmp) {
            tmp = Y.Node.create('<div></div>');
            NodeList._tempNode = tmp;
        }
    return tmp;
};

// call with instance context
NodeList.DEFAULT_SETTER = function(attr, val) {
    var tmp = NodeList._getTempNode();
    NodeList.each(this, function(node) {
        var instance = Y.Node._instances[node[UID]];
        if (!instance) {
            g_nodes[tmp[UID]] = node;
            instance = tmp;
        }
        instance.set(attr, val);
    });
};

// call with instance context
NodeList.DEFAULT_GETTER = function(attr) {
    var tmp = NodeList._getTempNode(),
        ret = [];

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
    /**
     * Retrieves the Node instance at the given index. 
     * @method item
     *
     * @param {Number} index The index of the target Node.
     * @return {Node} The Node instance at the given index.
     */
    item: function(index) {
        return Y.get((g_nodelists[this[UID]] || [])[index]);
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
        Y.Array.each(g_nodelists[this[UID]], function(node, index) {
            return fn.call(context, Y.get(node), index, instance);
        });
        return instance;
    },

    /**
     * Filters the NodeList instance down to only nodes matching the given selector.
     * @method filter
     * @param {String} selector The selector to filter against
     * @return {NodeList} NodeList containing the updated collection 
     * @see Selector
     */
    filter: function(selector) {
        return Node.scrubVal(Y.Selector.filter(g_nodelists[this[UID]], selector), this);
    },

    get: function(attr) {
        if (!this.attrAdded(attr) && (!this._conf.data.getter || !this._conf.data.getter[attr])) {
        //if (!this.attrAdded(attr)) {
            //this._addAttr(attr);
            return NodeList.DEFAULT_GETTER.call(this, attr);
            //return NodeList.DEFAULT_GETTER.call(this, attr);
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
        var args = g_slice.call(arguments, 0);

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

    plug: function() {
        var args = arguments;
        this.each(function(node) {
            node.plug.apply(node, args);
        });
        return this;
    },

    unplug: function() {
        var args = arguments;
        this.each(function(node) {
            node.unplug.apply(node, args);
        });
        return this;
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
        return this;
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
            nodes = g_nodelists[this[UID]],
            node;

        if (nodes && nodes[0]) {
            node = nodes[0];
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
        this.addAttr(attr.split(DOT)[0], {
            getter: function() {
                return NodeList.DEFAULT_GETTER.call(this, attr);
            },

            setter: function(val) {
                NodeList.DEFAULT_SETTER.call(this, attr, val);
            }
        });
    }
}, true);

NodeList.importMethod(Y.Node.prototype, [
    'addEventListener',
    'removeEventListener'
]);

Y.NodeList = NodeList;
Y.all = function(nodes, doc, restrict) {
    // TODO: propagate restricted to nodes?
    var nodeList = new NodeList({
        nodes: nodes,
        doc: doc,
        restricted: restrict
    });

    // zero-length result returns null
    return nodeList;
};
Y.Node.all = Y.all; // TODO: deprecated
