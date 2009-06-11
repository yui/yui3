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

var NodeList = function(config) {
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

            Y.Array.each(g_nodelists[this[UID]], function(node) {
                var UID = '_yuid',
                    instance = Y.Node._instances[node[UID]],
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
     * @param {Function} fn The function to apply. It receives 3 arguments:
     * the current node instance, the node's index, and the NodeList instance
     * @param {Object} context optional An optional context to apply the function with
     * Default context is the current Node instance
     * @chainable
     */
    each: function(fn, context) {
        var instance = this;
        Y.Array.each(g_nodelists[this[UID]], function(node, index) {
            node = Y.get(node);
            return fn.call(context || node, node, index, instance);
        });
        return instance;
    },

    batch: function(fn, context) {
        var nodelist = this,
            tmp = NodeList._getTempNode();

        Y.Array.each(g_nodelists[this[UID]], function(node, index) {
            var instance = Y.Node._instances[node[UID]];
            if (!instance) {
                g_nodes[tmp[UID]] = node;
                instance = tmp;
            }

            return fn.call(context || instance, instance, index, nodelist);
        });
        return nodelist;
    },

    /**
     * Executes the function once for each node until a true value is returned.
     * @method some
     * @param {Function} fn The function to apply. It receives 3 arguments:
     * the current node instance, the node's index, and the NodeList instance
     * @param {Object} context optional An optional context to execute the function from.
     * Default context is the current Node instance
     * @return {Boolean} Whether or not the function returned true for any node.
     */
    some: function(fn, context) {
        var instance = this;
        return Y.Array.some(g_nodelists[this[UID]], function(node, index) {
            node = Y.get(node);
            context = context || node;
            return fn.call(context, node, index, instance);
        });
    },

    /**
     * Returns the index of the node in the NodeList instance
     * or -1 if the node isn't found.
     * @method indexOf
     * @param {Y.Node || DOMNode} node the node to search for
     * @return {Int} the index of the node value or -1 if not found
     */
    indexOf: function(node) {
        return Y.Array.indexOf(g_nodelists[this[UID]], Y.Node.getDOMNode(node));
    },

    /**
     * Filters the NodeList instance down to only nodes matching the given selector.
     * @method filter
     * @param {String} selector The selector to filter against
     * @return {NodeList} NodeList containing the updated collection 
     * @see Selector
     */
    filter: function(selector) {
        return Y.all(Y.Selector.filter(g_nodelists[this[UID]], selector));
    },

    modulus: function(n, r) {
        r = r || 0;
        var nodes = [];
        NodeList.each(this, function(node, i) {
            if (i % n === r) {
                nodes.push(node);
            }
        });

        return Y.all(nodes);
    },

    odd: function() {
        return this.modulus(2, 1);
    },

    even: function() {
        return this.modulus(2);
    },

    destructor: function() {
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
        return this;
    },

    on: function(type, fn, context) {
        context = context || this;
        this.batch(function(node) {
            node.on.call(node, type, fn, context);
        });
    },

    after: function(type, fn, context) {
        context = context || this;
        this.batch(function(node) {
            node.after.call(node, type, fn, context);
        });
    },

    /**
     * Returns the current number of items in the NodeList.
     * @method size
     * @return {Int} The number of items in the NodeList. 
     */
    size: function() {
        return g_nodelists[this[UID]].length;
    },

    // one-off because we cant import from Node due to undefined return values
    get: function(name) {
        var ret = [],
            tmp = NodeList._getTempNode();

        NodeList.each(this, function(node) {
            var instance = Y.Node._instances[node[UID]];
            if (!instance) {
                g_nodes[tmp[UID]] = node;
                instance = tmp;
            }
            ret[ret.length] = instance.get(name);
        });

        return ret;
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
    }

}, true);

NodeList.importMethod(Y.Node.prototype, [
//    'after',
    'append',
    'create',
    'detach',
    'detachAll',
    'insert',
//    'on',
    'plug',
    'prepend',
    'remove',
    'set',
    'setContent',
    'unplug'
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
