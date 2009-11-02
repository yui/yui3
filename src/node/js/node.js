/**
 * The Node Utility provides a DOM-like interface for interacting with DOM nodes.
 * @module node
 * @submodule node-base
 */    

/**
 * The Node class provides a wrapper for manipulating DOM Nodes.
 * Node properties can be accessed via the set/get methods.
 * Use Y.get() to retrieve Node instances.
 *
 * <strong>NOTE:</strong> Node properties are accessed using
 * the <code>set</code> and <code>get</code> methods.
 *
 * @class Node
 * @constructor
 * @for Node
 */

// "globals"
var DOT = '.',
    NODE_NAME = 'nodeName',
    NODE_TYPE = 'nodeType',
    OWNER_DOCUMENT = 'ownerDocument',
    TAG_NAME = 'tagName',
    UID = '_yuid',

    Node = function(node) {
        var uid = node[UID];

        if (uid && Node._instances[uid] && Node._instances[uid]._node !== node) {
            node[UID] = null; // unset existing uid to prevent collision (via clone or hack)
        }

        uid = Y.stamp(node);
        if (!uid) { // stamp failed; likely IE non-HTMLElement
            uid = Y.guid();
        }

        this[UID] = uid;

        this._node = node;
        Node._instances[uid] = this;

        this._stateProxy = node; // when augmented with Attribute

        if (this._initPlugins) { // when augmented with Plugin.Host
            this._initPlugins();
        }
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

Node.re_aria = /^(?:role$|aria-)/;

Node.DOM_EVENTS = {
    abort: true,
    beforeunload: true,
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
    message: true,
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

Node._instances = {};

/**
 * Retrieves the DOM node bound to a Node instance
 * @method Node.getDOMNode
 * @static
 *
 * @param {Y.Node || HTMLNode} node The Node instance or an HTMLNode
 * @return {HTMLNode} The DOM node bound to the Node instance.  If a DOM node is passed
 * as the node argument, it is simply returned.
 */
Node.getDOMNode = function(node) {
    if (node) {
        return (node.nodeType) ? node : node._node || null;
    }
    return null;
};
 
Node.scrubVal = function(val, node) {
    if (node && val) { // only truthy values are risky
        if (typeof val === 'object' || typeof val === 'function') { // safari nodeList === function
            if (NODE_TYPE in val || Y.DOM.isWindow(val)) {// node || window
                val = Node.get(val);
            } else if ((val.item && !val._nodes) || // dom collection or Node instance
                    (val[0] && val[0][NODE_TYPE])) { // array of DOM Nodes
                val = Y.all(val);
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
            var args = Y.Array(arguments),
                ret;

            if (args[0] && args[0] instanceof Node) {
                args[0] = args[0]._node;
            }

            if (args[1] && args[1] instanceof Node) {
                args[1] = args[1]._node;
            }
            args.unshift(this._node);
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

/**
 * Returns a single Node instance bound to the node or the
 * first element matching the given selector.
 * @method Y.one
 * @static
 * @param {String | HTMLElement} node a node or Selector 
 * @param {Y.Node || HTMLElement} doc an optional document to scan. Defaults to Y.config.doc. 
 */
Node.one = function(node) {
    var instance = null,
        cachedNode,
        uid;

    if (node) {
        if (typeof node === 'string') {
            if (node.indexOf('doc') === 0) { // doc OR document
                node = Y.config.doc;
            } else if (node.indexOf('win') === 0) { // win OR window
                node = Y.config.win;
            } else {
                node = Y.Selector.query(node, null, true);
            }
            if (!node) {
                return null;
            }
        } else if (node instanceof Node) {
            return node; // NOTE: return
        }

        uid = node._yuid;
        instance = Node._instances[uid]; // reuse exising instances
        cachedNode = instance ? instance._node : null;
        if (!instance || (cachedNode && node !== cachedNode)) { // new Node when nodes don't match
            instance = new Node(node);
        }
    }
    return instance;
};

/**
 * Returns a single Node instance bound to the node or the
 * first element matching the given selector.
 * @method Y.get
 * @deprecated Use Y.one
 * @static
 * @param {String | HTMLElement} node a node or Selector 
 * @param {Y.Node || HTMLElement} doc an optional document to scan. Defaults to Y.config.doc. 
 */
Node.get = function() {
    Y.log('Y.get is deprecated, use Y.one', 'warn', 'deprecated');
    return Node.one.apply(Node, arguments);
};

/**
 * Creates a new dom node using the provided markup string. 
 * @method create
 * @static
 * @param {String} html The markup used to create the element
 * @param {HTMLDocument} doc An optional document context 
 * @return {Node} A Node instance bound to a DOM node or fragment 
 */
Node.create = function() {
    return Node.get(Y.DOM.create.apply(Y.DOM, arguments));
};

Node.ATTRS = {
    /**
     * Allows for getting and setting the text of an element.
     * Formatting is preserved and special characters are treated literally.
     * @config text
     * @type String
     */
    text: {
        getter: function() {
            return Y.DOM.getText(this._node);
        },

        setter: function(content) {
            Y.DOM.setText(this._node, content);
            return content;
        }
    },

    'options': {
        getter: function() {
            return this._node.getElementsByTagName('option');
        }
    },

     // IE: elements collection is also FORM node which trips up scrubVal.
     // preconverting to NodeList
     // TODO: break out for IE only
    'elements': {
        getter: function() {
            return Y.all(this._node.elements);
        }
    },

    /**
     * Returns a NodeList instance of all HTMLElement children.
     * @readOnly
     * @config children
     * @type NodeList
     */
    'children': {
        getter: function() {
            var node = this._node,
                children = node.children,
                childNodes, i, len;

            if (!children) {
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
            return Y.DOM.getValue(this._node);
        },

        setter: function(val) {
            Y.DOM.setValue(this._node, val);
            return val;
        }
    },

    data: {
        getter: function() {
            return this._data;
        },

        setter: function(val) {
            this._data = val;
            return val;
        }
    }
};

// call with instance context
Node.DEFAULT_SETTER = function(name, val) {
    var node = this._stateProxy,
        strPath;

    if (name.indexOf(DOT) > -1) {
        strPath = name;
        name = name.split(DOT);
        // only allow when defined on node
        Y.Object.setValue(node, name, val);
    } else if (node[name] !== undefined) { // pass thru DOM properties 
        node[name] = val;
    }

    return val;
};

// call with instance context
Node.DEFAULT_GETTER = function(name) {
    var node = this._stateProxy,
        val;

    if (name.indexOf && name.indexOf(DOT) > -1) {
        val = Y.Object.getValue(node, name.split(DOT));
    } else if (node[name] !== undefined) { // pass thru from DOM
        val = node[name];
    }

    return val;
};

Y.augment(Node, Y.Event.Target);

Y.mix(Node.prototype, {
    toString: function() {
        var str = '',
            errorMsg = this[UID] + ': not bound to a node',
            node = this._node;

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

    /**
     * Returns an attribute value on the Node instance
     * @method get
     * @param {String} attr The attribute to be set
     * @return {any} The current value of the attribute
     */
    get: function(attr) {
        var val;

        if (this._getAttr) { // use Attribute imple
            val = this._getAttr(attr);
        } else {
            val = this._get(attr);
        }

        if (val) {
            val = Y.Node.scrubVal(val, this);
        }
        return val;
    },

    _get: function(attr) {
        var attrConfig = Node.ATTRS[attr],
            val;

        if (attrConfig && attrConfig.getter) {
            val = attrConfig.getter.call(this);
        } else if (Node.re_aria.test(attr)) {
            val = this._node.getAttribute(attr, 2); 
        } else {
            val = Node.DEFAULT_GETTER.apply(this, arguments);
        }

        return val;
    },

    /**
     * Sets an attribute on the Node instance.
     * @method set
     * @param {String} attr The attribute to be set.  
     * @param {any} val The value to set the attribute to.  
     * @chainable
     */
    set: function(attr, val) {
        var attrConfig = Node.ATTRS[attr];

        if (this._setAttr) { // use Attribute imple
            this._setAttr.apply(this, arguments);
        } else { // use setters inline
            if (attrConfig && attrConfig.setter) {
                attrConfig.setter.call(this, val);
            } else if (Node.re_aria.test(attr)) { // special case Aria
                this._node.setAttribute(attr, val);
            } else {
                Node.DEFAULT_SETTER.apply(this, arguments);
            }
        }

        return this;
    },

    /**
     * Sets multiple attributes. 
     * @method setAttrs
     * @param {Object} attrMap an object of name/value pairs to set  
     * @chainable
     */
    setAttrs: function(attrMap) {
        if (this._setAttrs) { // use Attribute imple
            this._setAttrs(attrMap);
        } else { // use setters inline
            Y.Object.each(attrMap, function(v, n) {
                this.set(n, v); 
            }, this);
        }

        return this;
    },

    /**
     * Returns an object containing the values for the requested attributes. 
     * @method getAttrs
     * @param {Array} attrs an array of attributes to get values  
     * @return {Object} An object with attribute name/value pairs.
     */
    getAttrs: function(attrs) {
        var ret = {};
        if (this._getAttrs) { // use Attribute imple
            this._getAttrs(attrs);
        } else { // use setters inline
            Y.Array.each(attrs, function(v, n) {
                ret[v] = this.get(v); 
            }, this);
        }

        return ret;
    },

    /**
     * Creates a new Node using the provided markup string. 
     * @method create
     * @param {String} html The markup used to create the element
     * @param {HTMLDocument} doc An optional document context 
     * @return {Node} A Node instance bound to a DOM node or fragment 
     */
    create: Node.create,

    /**
     * Compares nodes to determine if they match.
     * Node instances can be compared to each other and/or HTMLElements.
     * @method compareTo
     * @param {HTMLElement | Node} refNode The reference node to compare to the node.
     * @return {Boolean} True if the nodes match, false if they do not. 
     */
    compareTo: function(refNode) {
        var node = this._node;
        if (refNode instanceof Y.Node) { 
            refNode = refNode._node;
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
        var node = this._node;
        doc = (doc) ? doc._node || doc : node[OWNER_DOCUMENT];
        if (doc.documentElement) {
            return Y.DOM.contains(doc.documentElement, node);
        }
    },

    getById: function(id) {
        var node = this._node,
            ret = Y.DOM.byId(id, node[OWNER_DOCUMENT]);
        if (ret && Y.DOM.contains(node, ret)) {
            ret = Y.one(ret);
        } else {
            ret = null;
        }
        return ret;
    },

   /**
     * Returns the nearest ancestor that passes the test applied by supplied boolean method.
     * @method ancestor
     * @param {String | Function} fn A selector string or boolean method for testing elements.
     * If a function is used, it receives the current node being tested as the only argument.
     * @return {Node} The matching Node instance or null if not found
     */
    ancestor: function(fn) {
        return Node.get(Y.DOM.elementByAxis(this._node, 'parentNode', _wrapFn(fn)));
    },

    /**
     * Returns the previous matching sibling. 
     * Returns the nearest element node sibling if no method provided.
     * @method previous
     * @param {String | Function} fn A selector or boolean method for testing elements.
     * If a function is used, it receives the current node being tested as the only argument.
     * @return {Node} Node instance or null if not found
     */
    previous: function(fn, all) {
        return Node.get(Y.DOM.elementByAxis(this._node, 'previousSibling', _wrapFn(fn), all));
    }, 

    /**
     * Returns the next matching sibling. 
     * Returns the nearest element node sibling if no method provided.
     * @method next
     * @param {String | Function} fn A selector or boolean method for testing elements.
     * If a function is used, it receives the current node being tested as the only argument.
     * @return {Node} Node instance or null if not found
     */
    next: function(fn, all) {
        return Node.get(Y.DOM.elementByAxis(this._node, 'nextSibling', _wrapFn(fn), all));
    },
        
    /**
     * Retrieves a Node instance of nodes based on the given CSS selector. 
     * @method one
     *
     * @param {string} selector The CSS selector to test against.
     * @return {Node} A Node instance for the matching HTMLElement.
     */
    one: function(selector) {
        return Y.one(Y.Selector.query(selector, this._node, true));
    },

    /**
     * Retrieves a Node instance of nodes based on the given CSS selector. 
     * @method query
     * @deprecated Use one()
     * @param {string} selector The CSS selector to test against.
     * @return {Node} A Node instance for the matching HTMLElement.
     */
    query: function(selector) {
        Y.log('query() is deprecated, use one()', 'warn', 'deprecated');
        return this.one(selector);
    },

    /**
     * Retrieves a nodeList based on the given CSS selector. 
     * @method all
     *
     * @param {string} selector The CSS selector to test against.
     * @return {NodeList} A NodeList instance for the matching HTMLCollection/Array.
     */
    all: function(selector) {
        var nodelist = Y.all(Y.Selector.query(selector, this._node));
        nodelist._query = selector;
        nodelist._queryRoot = this;
        return nodelist;
    },

    /**
     * Retrieves a nodeList based on the given CSS selector. 
     * @method queryAll
     * @deprecated Use all()
     * @param {string} selector The CSS selector to test against.
     * @return {NodeList} A NodeList instance for the matching HTMLCollection/Array.
     */
    queryAll: function(selector) {
        Y.log('queryAll() is deprecated, use all()', 'warn', 'deprecated');
        return this.all(selector);
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
        return Y.Selector.test(this._node, selector);
    },

    /**
     * Removes the node from its parent.
     * Shortcut for myNode.get('parentNode').removeChild(myNode);
     * @method remove
     * @chainable
     *
     */
    remove: function(destroy) {
        var node = this._node;
        node.parentNode.removeChild(node);
        if (destroy) {
            this.destroy(true);
        }
        return this;
    },

    /**
     * Replace the node with the other node. This is a DOM update only
     * and does not change the node bound to the Node instance.
     * Shortcut for myNode.get('parentNode').replaceChild(newNode, myNode);
     * @method replace
     * @chainable
     *
     */
    replace: function(newNode) {
        var node = this._node;
        node.parentNode.replaceChild(newNode, node);
        return this;
    },

    purge: function(recurse, type) {
        Y.Event.purgeElement(this._node, recurse, type);
    },

    destroy: function(purge) {
        delete Node._instances[this[UID]];
        if (purge) {
            this.purge(true);
        }

        if (this.unplug) {
            this.unplug();
        }

        this._node._yuid = null;
        this._node = null;
        this._stateProxy = null;
    },

    /**
     * Invokes a method on the Node instance 
     * @method invoke
     * @param {String} method The name of the method to invoke
     * @param {Any}  a, b, c, etc. Arguments to invoke the method with. 
     * @return Whatever the underly method returns. 
     * DOM Nodes and Collections return values
     * are converted to Node/NodeList instances.
     *
     */
    invoke: function(method, a, b, c, d, e) {
        var node = this._node,
            ret;

        if (a && a instanceof Y.Node) {
            a = a._node;
        }

        if (b && b instanceof Y.Node) {
            b = b._node;
        }

        ret = node[method](a, b, c, d, e);    
        return Y.Node.scrubVal(ret, this);
    },

    /**
     * Applies the given function to each Node in the NodeList.
     * @method each
     * @deprecated Use NodeList
     * @param {Function} fn The function to apply 
     * @param {Object} context optional An optional context to apply the function with
     * Default context is the NodeList instance
     * @chainable
     */
    each: function(fn, context) {
        context = context || this;
        Y.log('each is deprecated on Node', 'warn', 'deprecated');
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
        Y.log('item is deprecated on Node', 'warn', 'deprecated');
        return this;
    },

    /**
     * Returns the current number of items in the Node.
     * @method size
     * @deprecated Use NodeList
     * @return {Int} The number of items in the Node. 
     */
    size: function() {
        Y.log('size is deprecated on Node', 'warn', 'deprecated');
        return this._node ? 1 : 0;
    },

    /**
     * Inserts the content before the reference node. 
     * @method insert
     * @param {String | Y.Node | HTMLElement} content The content to insert 
     * @param {Int | Y.Node | HTMLElement | String} where The position to insert at.
     * @chainable
     */
    insert: function(content, where) {
        var node = this._node;

        if (content) {
            if (typeof where === 'number') { // allow index
                where = this._node.childNodes[where];
            }

            if (typeof content !== 'string') { // allow Node or NodeList/Array instances
                if (content._node) { // Node
                    content = content._node;
                } else if (content._nodes || (!content.nodeType && content.length)) { // NodeList or Array
                    Y.each(content._nodes, function(n) {
                        Y.DOM.addHTML(node, n, where);
                    });

                    return this; // NOTE: early return
                }
            }
            Y.DOM.addHTML(node, content, where);
        }
        return this;
    },

    /**
     * Inserts the content as the firstChild of the node. 
     * @method prepend
     * @param {String | Y.Node | HTMLElement} content The content to insert 
     * @chainable
     */
    prepend: function(content) {
        return this.insert(content, 0);
    },

    /**
     * Inserts the content as the lastChild of the node. 
     * @method append
     * @param {String | Y.Node | HTMLElement} content The content to insert 
     * @chainable
     */
    append: function(content) {
        return this.insert(content, null);
    },

    /**
     * Replaces the node's current content with the content.
     * @method setContent
     * @param {String | Y.Node | HTMLElement} content The content to insert 
     * @chainable
     */
    setContent: function(content) {
        Y.DOM.addHTML(this._node, content, 'replace');
        return this;
    },

    // TODO: need this?
    hasMethod: function(method) {
        var node = this._node;
        return (node && (typeof node === 'function'));
    }
}, true);

Y.Node = Node;
Y.get = Y.Node.get;
Y.one = Y.Node.one;
