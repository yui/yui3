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
 * @class Node
 * @constructor
 */

// "globals"
var g_nodes = {},
    g_restrict = {},
    g_slice = Array.prototype.slice,

    DOT = '.',
    NODE_NAME = 'nodeName',
    NODE_TYPE = 'nodeType',
    OWNER_DOCUMENT = 'ownerDocument',
    TAG_NAME = 'tagName',
    UID = '_yuid',

    SuperConstr = Y.Base,
    SuperConstrProto = Y.Base.prototype,

    Node = function(node, restricted) {
        var config = null;
        this[UID] = Y.stamp(node);
        if (!this[UID]) { // stamp failed; likely IE non-HTMLElement
            this[UID] = Y.guid(); 
        }

        g_nodes[this[UID]] = node;
        Node._instances[this[UID]] = this;

        if (restricted) {
            config = {
                restricted: restricted
            };
            g_restrict[this[UID]] = true; 
        }

        this._lazyAttrInit = true;
        this._silentInit = true;
        SuperConstr.call(this, config);
    },

    // used with previous/next/ancestor tests
    _wrapFn = function(fn) {
        var ret = null;
        if (fn) {
            ret = (typeof fn === 'string') ?
            function(n) {
                return Y.Selector.test(n, fn);
            } : 
            function(n) {
                return fn(Node.get(n));
            };
        }

        return ret;
    };
// end "globals"

Node.NAME = 'Node';

Node.DOM_EVENTS = {
    abort: true,
    blur: true,
    change: true,
    click: true,
    close: true,
    command: true,
    contextmenu: true,
    drag: true,
    dragstart: true,
    dragenter: true,
    dragover: true,
    dragleave: true,
    dragend: true,
    drop: true,
    dblclick: true,
    error: true,
    focus: true,
    keydown: true,
    keypress: true,
    keyup: true,
    load: true,
    mousedown: true,
    mousemove: true,
    mouseout: true, 
    mouseover: true, 
    mouseup: true,
    mousemultiwheel: true,
    mousewheel: true,
    submit: true,
    mouseenter: true,
    mouseleave: true,
    scroll: true,
    reset: true,
    resize: true,
    select: true,
    textInput: true,
    unload: true
};

// Add custom event adaptors to this list.  This will make it so
// that delegate, key, available, contentready, etc all will
// be available through Node.on
Y.mix(Node.DOM_EVENTS, Y.Env.evt.plugins);

Node.EXEC_SCRIPTS = true;

Node._instances = {};

Node.plug = function() {
    var args = g_slice.call(arguments, 0);
    args.unshift(Node);
    Y.Base.plug.apply(Y.Base, args);
    return Node;
};

Node.unplug = function() {
    var args = g_slice.call(arguments, 0);
    args.unshift(Node);
    Y.Base.unplug.apply(Y.Base, args);
    return Node;
};

/**
 * Retrieves the DOM node bound to a Node instance
 * @method getDOMNode
 * @static
 *
 * @param {Y.Node || HTMLNode} node The Node instance or an HTMLNode
 * @return {HTMLNode} The DOM node bound to the Node instance.  If a DOM node is passed
 * as the node argument, it is simply returned.
 */
Node.getDOMNode = function(node) {
    if (node) {
        if (node instanceof Node) {
            node = g_nodes[node[UID]];
        } else if (!node[NODE_NAME] || Y.DOM.isWindow(node)) { // must already be a DOMNode 
            node = null;
        }
    }
    return node || null;
};
 
Node.scrubVal = function(val, node, depth) {
    var isWindow = false;
    if (node && val) { // only truthy values are risky
        if (typeof val === 'object' || typeof val === 'function') { // safari nodeList === function
            if (NODE_TYPE in val || Y.DOM.isWindow(val)) {// node || window
                if (g_restrict[node[UID]] && !node.contains(val)) {
                    val = null; // not allowed to go outside of root node
                } else {
                    val = Node.get(val);
                }
            } else if (val.item || // dom collection or Node instance // TODO: check each node for restrict? block ancestor?
                    (val[0] && val[0][NODE_TYPE])) { // array of DOM Nodes
                val = Y.all(val);
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
    } else if (val === undefined) {
        val = node; // for chaining
    }

    return val;
};

Node.addMethod = function(name, fn, context) {
    if (name && fn && typeof fn === 'function') {
        Node.prototype[name] = function() {
            context = context || this;
            var args = g_slice.call(arguments),
                ret;

            if (args[0] && args[0] instanceof Node) {
                args[0] = Node.getDOMNode(args[0]);
            }

            if (args[1] && args[1] instanceof Node) {
                args[1] = Node.getDOMNode(args[1]);
            }
            args.unshift(g_nodes[this[UID]]);
            ret = Node.scrubVal(fn.apply(context, args), this);
            return ret;
        };
    } else {
        Y.log('unable to add method: ' + name, 'warn', 'Node');
    }
};

Node.importMethod = function(host, name, altName) {
    if (typeof name === 'string') {
        altName = altName || name;
        Node.addMethod(altName, host[name], host);
    } else {
        Y.each(name, function(n) {
            Node.importMethod(host, n);
        });
    }
};

Node.get = function(node, doc, restrict) {
    var instance = null;

    if (typeof node === 'string') {
        if (node.indexOf('doc') === 0) { // doc OR document
            node = Y.config.doc;
        } else if (node.indexOf('win') === 0) { // doc OR document
            node = Y.config.win;
        } else {
            node = Y.Selector.query(node, doc, true);
        }
    }

    if (node) {
        instance = Node._instances[node[UID]]; // reuse exising instances
        if (!instance) {
            instance = new Node(node, restrict);
        } else if (restrict) {
            g_restrict[instance[UID]] = true;
            instance._set('restricted', true);
        }
    }
    // TODO: restrict on subsequent call?
    return instance;
};

Node.create = function() {
    return Node.get(Y.DOM.create.apply(Y.DOM, arguments));
};

Node.ATTRS = {
    text: {
        getter: function() {
            return Y.DOM.getText(g_nodes[this[UID]]);
        },

        readOnly: true
    },

    'options': {
        getter: function() {
            return this.getElementsByTagName('option');
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
                children = node.children,
                childNodes, i, len;

            if (children === undefined) {
                childNodes = node.childNodes;
                children = [];

                for (i = 0, len = childNodes.length; i < len; ++i) {
                    if (childNodes[i][TAG_NAME]) {
                        children[children.length] = childNodes[i];
                    }
                }
            }
            return Y.all(children);
        }
    },

    value: {
        getter: function() {
            return Y.DOM.getValue(g_nodes[this[UID]]);
        },

        setter: function(val) {
            return Y.DOM.setValue(g_nodes[this[UID]], val);
        }
    },

/*
    style: {
        getter: function(attr) {
            return Y.DOM.getStyle(g_nodes[this[UID]].style, attr);
        }
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
        strPath;

    if (name.indexOf(DOT) > -1) {
        strPath = name;
        name = name.split(DOT);
        Y.Object.setValue(node, name, val);
    } else if (node[name] !== undefined) { // only set DOM attributes
        node[name] = val;
    }

    return this;
};

// call with instance context
Node.DEFAULT_GETTER = function(name) {
    var node = g_nodes[this[UID]],
        val;

    if (name.indexOf && name.indexOf(DOT) > -1) {
        val = Y.Object.getValue(node, name.split(DOT));
    } else {
        val = node[name];
    }

    return val ? Y.Node.scrubVal(val, this) : val;
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
        var domNode = g_nodes[this[UID]];

        if (domNode && domNode[attr] !== undefined) {
            this.addAttr(attr, {
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

    get: function(attr) {
        if (!this.attrAdded(attr)) { // use DEFAULT_GETTER for unconfigured attrs
            if (Node.re_aria && Node.re_aria.test(attr)) { // except for aria
                this._addAriaAttr(attr);
            } else {
                return Node.DEFAULT_GETTER.apply(this, arguments);
            }
        }

        return SuperConstrProto.get.apply(this, arguments);
    },

    set: function(attr, val) {
        if (!this.attrAdded(attr)) { // use DEFAULT_SETTER for unconfigured attrs
            // except for aria
            if (Node.re_aria && Node.re_aria.test(attr)) {
                this._addAriaAttr(attr);
            //  or chained properties or if no change listeners
            } else if (attr.indexOf(DOT) < 0 && this._yuievt.events['Node:' + attr + 'Change']) {
                this._addDOMAttr(attr);
            } else {
                Node.DEFAULT_SETTER.call(this, attr, val);
                return this; // NOTE: return
            }
        }
        SuperConstrProto.set.apply(this, arguments);
        return this;
    },

    create: Node.create,

    /**
     * Compares nodes to determine if they match.
     * Node instances can be compared to each other and/or HTMLElements.
     * @method compareTo
     * @param {HTMLElement | Node} refNode The reference node to compare to the node.
     * @return {Boolean} True if the nodes match, false if they do not. 
     */
    compareTo: function(refNode) {
        var node = g_nodes[this[UID]];
        if (refNode instanceof Y.Node) { 
            refNode = Y.Node.getDOMNode(refNode);
        }
        return node === refNode;
    },

    /**
     * Determines whether the node is appended to the document.
     * @method inDoc
     * @param {Node|HTMLElement} doc optional An optional document to check against.
     * Defaults to current document. 
     * @return {Boolean} Whether or not this node is appended to the document. 
     */
    inDoc: function(doc) {
        var node = g_nodes[this[UID]];
        doc = (doc) ? Node.getDOMNode(doc) : node[OWNER_DOCUMENT];
        if (doc.documentElement) {
            return Y.DOM.contains(doc.documentElement, node);
        }
    },

    getById: function(id) {
        var node = g_nodes[this[UID]],
            ret = Y.DOM.byId(id, node[OWNER_DOCUMENT]);
        if (ret && Y.DOM.contains(node, ret)) {
            ret = Y.get(ret);
        } else {
            ret = null;
        }
        return ret;
    },

   /**
     * Returns the nearest ancestor that passes the test applied by supplied boolean method.
     * @method ancestor
     * @param {String | Function} fn A selector or boolean method for testing elements.
     * If a function is used, it receives the current node being tested as the only argument.
     * @return {Node} The matching Node instance or null if not found
     */
    ancestor: function(fn) {
        return Node.get(Y.DOM.elementByAxis(g_nodes[this[UID]], 'parentNode', _wrapFn(fn)));
    },

    /**
     * Returns the previous matching sibling. 
     * Returns the nearest element node sibling if no method provided.
     * @method previous
     * @param {String | Function} fn A selector or boolean method for testing elements.
     * If a function is used, it receives the current node being tested as the only argument.
     * @param {Boolean} all optional Whether all node types should be returned, or just element nodes.
     * @return {Node} Node instance or null if not found
     */
    previous: function(fn, all) {
        return Node.get(Y.DOM.elementByAxis(g_nodes[this[UID]], 'previousSibling', _wrapFn(fn), all));
    }, 

    /**
     * Returns the next matching sibling. 
     * Returns the nearest element node sibling if no method provided.
     * @method next
     * @param {String | Function} fn A selector or boolean method for testing elements.
     * If a function is used, it receives the current node being tested as the only argument.
     * @param {Boolean} all optional Whether all node types should be returned, or just element nodes.
     * @return {Node} Node instance or null if not found
     */
    next: function(node, fn, all) {
        return Node.get(Y.DOM.elementByAxis(g_nodes[this[UID]], 'nextSibling', _wrapFn(fn), all));
    },
        
    /**
     * Retrieves a Node instance of nodes based on the given CSS selector. 
     * @method query
     *
     * @param {string} selector The CSS selector to test against.
     * @return {Node} A Node instance for the matching HTMLElement.
     */
    query: function(selector) {
        return Y.get(Y.Selector.query(selector, g_nodes[this[UID]], true));
    },

    /**
     * Retrieves a nodeList based on the given CSS selector. 
     * @method queryAll
     *
     * @param {string} selector The CSS selector to test against.
     * @return {NodeList} A NodeList instance for the matching HTMLCollection/Array.
     */
    queryAll: function(selector) {
        return Y.all(Y.Selector.query(selector, g_nodes[this[UID]]));
    },

    // TODO: allow fn test
    /**
     * Test if the supplied node matches the supplied selector.
     * @method test
     *
     * @param {string} selector The CSS selector to test against.
     * @return {boolean} Whether or not the node matches the selector.
     */
    test: function(selector) {
        return Y.Selector.test(g_nodes[this[UID]], selector);
    },

    /**
     * Removes the node from its parent.
     * Shortcut for myNode.get('parentNode').removeChild(myNode);
     * @method remove
     * @chainable
     *
     */
    remove: function() {
        var node = g_nodes[this[UID]];
        node.parentNode.removeChild(node);
        return this;
    },

    // TODO: safe enough? 
    invoke: function(method, a, b, c, d, e) {
        var node = g_nodes[this[UID]],
            ret;

        if (a && a instanceof Y.Node) {
            a = Node.getDOMNode(a);
        }

        if (b && b instanceof Y.Node) {
            b = Node.getDOMNode(b);
        }

        ret = node[method](a, b, c, d, e);    
        return Y.Node.scrubVal(ret, this);
    },

    destructor: function() {
        //var uid = this[UID];

        //delete g_nodes[uid];
        //delete g_restrict[uid];
        //delete Node._instances[uid];
    },

    /**
     * Applies the given function to each Node in the NodeList.
     * @method each
     * @deprecated Use NodeList
     * @param {Function} fn The function to apply 
     * @param {Object} context optional An optional context to apply the function with
     * Default context is the NodeList instance
     * @return {NodeList} NodeList containing the updated collection 
     * @chainable
     */
    each: function(fn, context) {
        context = context || this;
        Y.log('each is deprecated on Node', 'warn', 'Node');
        return fn.call(context, this);
    },

    /**
     * Retrieves the Node instance at the given index. 
     * @method item
     * @deprecated Use NodeList
     *
     * @param {Number} index The index of the target Node.
     * @return {Node} The Node instance at the given index.
     */
    item: function(index) {
        Y.log('item is deprecated on Node', 'warn', 'Node');
        return this;
    },

    /**
     * Returns the current number of items in the Node.
     * @method size
     * @deprecated Use NodeList
     * @return {Int} The number of items in the Node. 
     */
    size: function() {
        Y.log('size is deprecated on Node', 'warn', 'Node');
        return g_nodes[this[UID]] ? 1 : 0;
    },

    /**
     * Inserts the content before the reference node. 
     * @method insert
     * @param {String | Y.Node | HTMLElement} content The content to insert 
     * @param {Int | Y.Node | HTMLElement | String} where The position to insert at.
     * @param {Boolean} execScripts Whether or not to execute any scripts found in
     * the content.  If false, all scripts will be stripped out.
     * @chainable
     */
    //TODO: restrict
    insert: function(content, where, execScripts) {
        if (content) {
            execScripts = (execScripts && Node.EXEC_SCRIPTS);
            if (typeof where === 'number') { // allow index
                where = g_nodes[this[UID]].childNodes[where];
            }
            if (typeof content !== 'string') { // pass the DOM node
                content = Y.Node.getDOMNode(content);
            }
            if (!where || // only allow inserting into this Node's subtree
                (!g_restrict[this[UID]] || 
                    (typeof where !== 'string' && this.contains(where)))) { 
                Y.DOM.addHTML(g_nodes[this[UID]], content, where, execScripts);
            }
        }
        return this;
    },

    /**
     * Inserts the content as the firstChild of the node. 
     * @method prepend
     * @param {String | Y.Node | HTMLElement} content The content to insert 
     * @param {Boolean} execScripts Whether or not to execute any scripts found in
     * the content.  If false, all scripts will be stripped out.
     * @chainable
     */
    prepend: function(content, execScripts) {
        return this.insert(content, 0, execScripts);
    },

    /**
     * Inserts the content as the lastChild of the node. 
     * @method append
     * @param {String | Y.Node | HTMLElement} content The content to insert 
     * @param {Boolean} execScripts Whether or not to execute any scripts found in
     * the content.  If false, all scripts will be stripped out.
     * @chainable
     */
    append: function(content, execScripts) {
        return this.insert(content, null, execScripts);
    },

    /**
     * Replaces the node's current content with the content.
     * @method setContent
     * @param {String | Y.Node | HTMLElement} content The content to insert 
     * @param {Boolean} execScripts Whether or not to execute any scripts found in
     * the content.  If false, all scripts will be stripped out.
     * @chainable
     */
    setContent: function(content, execScripts) {
        execScripts = (execScripts && Node.EXEC_SCRIPTS);
        Y.DOM.addHTML(g_nodes[this[UID]], content, 'replace', execScripts);
        return this;
    },

    // TODO: need this?
    hasMethod: function(method) {
        var node = g_nodes[this[UID]];
        return (node && (typeof node === 'function'));
    }
}, true);

Y.Node = Node;
Y.get = Y.Node.get;
