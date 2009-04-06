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

/* Array._diff
    from: http://www.deepakg.com/prog/2009/01/ruby-like-difference-between-two-arrays-in-javascript/
*/
var DIFF_DELIM = '__::__';
Y.Array._diff = function(a, b) {
    if (a.join && b.join) {
        return DIFF_DELIM + a.join(DIFF_DELIM + DIFF_DELIM) + DIFF_DELIM.
                replace(Y.DOM._getRegExp('(' + DIFF_DELIM +
                b.join(DIFF_DELIM + '|' + DIFF_DELIM) + DIFF_DELIM + ')', 'g'),'').
                replace(Y.DOM._getRegExp('^' + DIFF_DELIM), '').
                replace(Y.DOM._getRegExp(DIFF_DELIM + '$'), '').
                split(DIFF_DELIM + DIFF_DELIM);
        } else {
            Y.log('invalid arg passed to diff: ' + a + ' or ' + b, 'warn', 'Array');
        }
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
        if (!instance) {
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
        var doc = config.doc || Y.config.doc,
            nodes = config.nodes || [];

        if (typeof nodes === 'string') {
            this._query = nodes;
            nodes = Y.Selector.query(nodes, doc);
        }

        NodeList._instances[this[UID]] = this;
        g_nodelists[this[UID]] = nodes;
    },

    // TODO: move to Attribute
    hasAttr: function(attr) {
        return this._conf.get(attr);  
    },

    get: function(attr) {
        if (!this.hasAttr(attr)) {
            this._addDOMAttr(attr);
        }

        return NodeList.superclass.constructor.prototype.get.apply(this, arguments);
    },

    set: function(attr, val) {
        if (!this.hasAttr(attr)) {
            this._addDOMAttr(attr);
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
        var doc;
        if (this._query) {
            if (g_nodelists[this[UID]] &&
                    g_nodelists[this[UID]][0] && 
                    g_nodelists[this[UID]][0].ownerDocument) {
                doc = g_nodelists[this[UID]][0].ownerDocument;
            }

            g_nodelists[this[UID]] = Y.Selector.query(this._query, doc || Y.config.doc);        
        }
    },

    size: function() {
        return g_nodelists[this[UID]].length;
    },

    toString: function() {
        var str = '',
            errorMsg = this[UID] + ': not bound to any nodes',
            nodes = g_nodelists[this[UID]] || {};

        if (nodes) {
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

    _addDOMAttr: function(attr) {
        var nodes = g_nodelists[this[UID]] || [];
        // for efficiency, only test if first node has DOM property 
        if (nodes[0] && nodes[0][attr] !== undefined) {
            this.addAttr(attr, {
                getter: function() {
                    return NodeList.DEFAULT_GETTER.call(this, attr);
                },

                setter: function(val) {
                    NodeList.DEFAULT_SETTER.call(this, attr, val);
                },
                //value: val
            });
        }
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
