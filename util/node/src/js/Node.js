/**
 * DOM Abstractions.
 * @module node
 */

YUI.add('node', function(Y) {

    /**
     * A wrapper for DOM Nodes.
     * Node properties can be accessed via the set/get methods.
     * With the exception of the noted properties,
     * only strings, numbers, and booleans are passed through. 
     * Use Y.get() or Y.Node.get() to create Node instances.
     *
     * @class Node
     */

    var BASE_NODE                   = 0, 
        ELEMENT_NODE                = 1,
        ATTRIBUTE_NODE              = 2,
        TEXT_NODE                   = 3,
        CDATA_SECTION_NODE          = 4,
        ENTITY_REFERENCE_NODE       = 5,
        ENTITY_NODE                 = 6,
        PROCESSING_INSTRUCTION_NODE = 7,
        COMMENT_NODE                = 8,
        DOCUMENT_NODE               = 9,
        DOCUMENT_TYPE_NODE          = 10,
        DOCUMENT_FRAGMENT_NODE      = 11,
        NOTATION_NODE               = 12;


    var OWNER_DOCUMENT = 'ownerDocument',
        DEFAULT_VIEW = 'defaultView',
        PARENT_WINDOW = 'parentWindow',
        DOCUMENT_ELEMENT = 'documentElement',
        NODE_NAME = 'nodeName',
        COMPAT_MODE = 'compatMode',
        PARENT_NODE = 'parentNode',
        SCROLL_TOP = 'scrollTop',
        SCROLL_LEFT = 'scrollLeft',
        NODE_TYPE = 'nodeType';

    var RE_VALID_PROP_TYPES = /(?:string|boolean|number)/;

    Y.use('selector'); // TODO: need this?  should be able to "use" from "add"
    var Selector = Y.Selector;
    var _nodes = {};
    var _styles = {};

    // private factory
    var wrap = function(node) {
        if (!node) {
            return null;
        }

        if ( (node.item || node.push) && 'length' in node) {
            return new NodeList(node);
        }

        return new Node(node);
    };

    // returns HTMLElement
    var getDOMNode = function(node) {
        if (node[NODE_TYPE]) {
            return node;
        } else if (node._yuid) {
            node = _nodes[node._yuid];
        }

        return  node || null;

    };

    /**
     * Wraps the input and outputs of a node instance
     */
    var nodeInOut = function(method, a, b, c, d, e) {
        if (a) { // first 2 may be Node instances or nodes (TODO: or strings?)
            a = getDOMNode(a);
            if (b) {
                b = getDOMNode(b);
            }
        }
        return wrap(_nodes[this._yuid][method](a, b, c, d, e));
    };

    /*
     * Wraps the return value in a node instance
     */
    var nodeOut = function(method, a, b, c, d, e) {
        return wrap(_nodes[this._yuid][method](a, b, c, d, e));
    };

    /* 
     * Returns directy from node method call 
     */
    var rawOut = function(method, a, b, c, d, e) {
        return _nodes[this._yuid][method](a, b, c, d, e);
    };

    var noOut = function(method, a, b, c, d, e) {
        _nodes[this._yuid][method](a, b, c, d, e);
        return this;
    };
    var PROPS_WRAP = {

        /**
         * Returns a Node instance. 
         * @property parentNode
         * @type Node
         */
        'parentNode': BASE_NODE,

        /**
         * Returns a NodeList instance. 
         * @property childNodes
         * @type NodeList
         */
        'childNodes': BASE_NODE,

        /**
         * Returns a Node instance. 
         * @property firstChild
         * @type Node
         */
        'firstChild': BASE_NODE,

        /**
         * Returns a Node instance. 
         * @property lastChild
         * @type Node
         */
        'lastChild': BASE_NODE,

        /**
         * Returns a Node instance. 
         * @property previousSibling
         * @type Node
         */
        'previousSibling': BASE_NODE,

        /**
         * Returns a Node instance. 
         * @property previousSibling
         * @type Node
         */
        'nextSibling': BASE_NODE,

        /**
         * Returns a Node instance. 
         * @property ownerDocument
         * @type Doc
         */
        'ownerDocument': BASE_NODE,

        /**
         * Returns a Node instance. 
         * Only valid for HTMLElement nodes.
         * @property offsetParent
         * @type Node
         */
        'offsetParent': ELEMENT_NODE,

        // form
        'elements': ELEMENT_NODE,

        /**
         * Returns a Node instance. 
         * @property documentElement
         * @type Node
         */
        'documentElement': DOCUMENT_NODE,

        /**
         * Returns a Node instance. 
         * @property body
         * @type Node
         */
        'body': DOCUMENT_NODE

    };

    var METHODS = {
        /**
         * Passes through to DOM method.
         * @method insertBefore
         * @param {String | HTMLElement | Node} node Node to be inserted 
         * @param {String | HTMLElement | Node} refNode Node to be inserted before
         */
        insertBefore: nodeInOut,

        /**
         * Passes through to DOM method.
         * @method replaceChild
         * @param {String | HTMLElement | Node} node Node to be inserted 
         * @param {String | HTMLElement | Node} refNode Node to be replaced 
         * @return {Node} The replaced node 
         */
        replaceChild: nodeInOut,

        /**
         * Passes through to DOM method.
         * @method removeChild
         * @param {String | HTMLElement | Node} node Node to be removed 
         * @return {Node} The removed node 
         */
        removeChild: nodeInOut,

        /**
         * Passes through to DOM method.
         * @method appendChild
         * @param {String | HTMLElement | Node} node Node to be appended 
         * @return {Node} The appended node 
         */
        appendChild: nodeInOut,

        /**
         * Passes through to DOM method.
         * @method hasChildNodes
         * @return {Boolean} Whether or not the node has any childNodes 
         */
        hasChildNodes: rawOut,

        /**
         * Passes through to DOM method.
         * @method cloneNode
         * @param {String | HTMLElement | Node} node Node to be cloned 
         * @return {Node} The clone 
         */
        cloneNode: nodeOut,

        /**
         * Passes through to DOM method.
         * @method getAttribute
         * @param {String} attribute The attribute to retrieve 
         * @return {String} The current value of the attribute 
         */
        getAttribute: rawOut,

        /**
         * Passes through to DOM method.
         * @method setAttribute
         * @param {String} attribute The attribute to set 
         * @param {String} The value to apply to the attribute 
         */
        setAttribute: noOut,

        /**
         * Passes through to DOM method.
         * @method hasAttribute
         * @param {String} attribute The attribute to test for 
         * @return {Boolean} Whether or not the attribute is present 
         */
        hasAttribute: rawOut,

        /**
         * Passes through to DOM method.
         * @method scrollIntoView
         */
        scrollIntoView: noOut,

        /**
         * Passes through to DOM method.
         * @method getElementsByTagName
         * @param {String} tagName The tagName to collect 
         * @return {NodeList} A NodeList representing the HTMLCollection
         */
        getElementsByTagName: nodeOut,

        /**
         * Passes through to DOM method.
         * @method focus
         */
        focus: noOut,

        /**
         * Passes through to DOM method.
         * @method blur
         */
        blur: noOut,

        /**
         * Passes through to DOM method.
         * Only valid on FORM elements
         * @method submit
         */
        submit: noOut,

        /**
         * Passes through to DOM method.
         * Only valid on FORM elements
         * @method reset
         */
        reset: noOut
    };

    var METHODS_INVOKE = {
        'getBoundingClientRect': true,
        'contains': true,
        'compareDocumentPosition': true
    };

    var Node = function(node) {
        if (!node || !node[NODE_NAME]) {
            Y.log('invalid node:' + node, 'error', 'Node');
            return null;
        }
        _nodes[Y.stamp(this)] = node;
        _styles[Y.stamp(this)] = node.style;
    };

    var getWinSize = function(node) {
        node = _nodes[node._yuid];
        var doc = (node[NODE_TYPE] == DOCUMENT_NODE) ? node : node[OWNER_DOCUMENT],
            win = doc[DEFAULT_VIEW] || doc[PARENT_WINDOW],
            mode = doc[COMPAT_MODE],
            height = win.innerHeight,
            width = win.innerWidth,
            root = doc[DOCUMENT_ELEMENT];
    
        if ( mode && !Y.ua.opera ) { // IE, Gecko
            if (mode != 'CSS1Compat') { // Quirks
                root = doc.body; 
            }
            height = root.clientHeight;
            width = root.clientWidth;
        }
        return { 'height': height, 'width': width }; 
    };

    var getDocSize = function(node) {
        node = _nodes[node._yuid];
        var doc = (node[NODE_TYPE] == DOCUMENT_NODE) ? node : node[OWNER_DOCUMENT],
            root = doc[DOCUMENT_ELEMENT];

        if (doc[COMPAT_MODE] != 'CSS1Compat') {
            root = doc.body;
        }

        return {
            'height': root.scrollHeight,
            'width': root.scrollWidth
        }
    };

    var SETTERS = {};
    var GETTERS = {
        /**
         * Returns the inner height of the viewport (exludes scrollbar). 
         * @property winHeight
         * @type String
         */
        'winHeight': function(node) {
            var h = getWinSize(node).height;
            Y.log('GETTERS:winHeight returning ' + h, 'info', 'Node');
            return h;
        },

        /**
         * Returns the inner width of the viewport (exludes scrollbar). 
         * @property winWidth
         * @type String
         */
        'winWidth': function(node) {
            var w = getWinSize(node).width;
            Y.log('GETTERS:winWidth returning ' + w, 'info', 'Node');
            return w;
        },

        /**
         * Document height 
         * @property docHeight
         * @type Number
         */
        'docHeight':  function(node) {
            var h = getDocSize(node).height;
            return Math.max(h, getWinSize(node).height);
        },

        /**
         * Document width 
         * @property docWidth
         * @type Number
         */
        'docWidth':  function(node) {
            var w = getDocSize(node).width;
            return Math.max(w, getWinSize(node).width);
        },

        /**
         * Amount page has been scroll vertically 
         * @property docScrollX
         * @type Number
         */
        'docScrollX':  function(node) {
            var doc = _nodes[node._yuid][OWNER_DOCUMENT];
            return Math.max(doc[DOCUMENT_ELEMENT][SCROLL_TOP], doc.body[SCROLL_TOP]);
        },

        /**
         * Amount page has been scroll horizontally 
         * @property docScrollY
         * @type Number
         */
        'docScrollY':  function(node) {
            var doc = _nodes[node._yuid][OWNER_DOCUMENT];
            return Math.max(doc[DOCUMENT_ELEMENT][SCROLL_LEFT], doc.body[SCROLL_LEFT]);
        }
    };

    Node.setters = function(prop, fn) {
        if (typeof prop == 'string') {
            SETTERS[prop] = fn;
        } else { // assume object
            Y.each(prop, function(fn, prop) {
                Node.setters(prop, fn);
            });
        } 
    };

    Node.getters = function(prop, fn) {
        if (typeof prop == 'string') {
            return GETTERS[prop] = fn;
        } else { // assume object
            Y.each(prop, function(fn, prop) {
                Node.getters(prop, fn);
            });
        } 
    };

    Node.methods = function(name, fn) {
        if (typeof name == 'string') {
            Node.prototype[name] = function(a, b, c, d, e) {
                var ret = fn(this, a, b, c, d, e);
                if (ret === undefined) {
                    ret = this;
                }
                return ret;
            };

            NodeList.prototype[name] = function(a, b, c, d, e) {
                var ret = [];
                this.each(function(node) {
                    ret.push(node[name](a, b, c, d, e));
                });
                if (!ret.length) {
                    ret = this;
                }
                return ret;
            };
            
        } else { // assume object
            Y.each(name, function(fn, name) {
                Node.methods(name, fn);
            });
        }
    };

    Node.prototype = {
        /**
         * Set the value of the property/attribute on the HTMLElement bound to this Node.
         * Only strings/numbers/booleans are passed through unless a SETTER exists.
         * @method set
         * @param {String} prop Property to set 
         * @param {any} val Value to apply to the given property
         */
        set: function(prop, val) {
            var node = _nodes[this._yuid];
            if (prop in SETTERS) { // use custom setter
                SETTERS[prop](this, prop, val);  // passing Node instance
            } else if (RE_VALID_PROP_TYPES.test(typeof node[prop])) { // safe to write
                node[prop] = val;
            }
            return this;
        },

        /**
         * Get the value of the property/attribute on the HTMLElement bound to this Node.
         * Only strings/numbers/booleans are passed through unless a GETTER exists.
         * @method get
         * @param {String} prop Property to get 
         * @return {any} Current value of the property
         */
        get: function(prop) {
            var val;
            var node = _nodes[this._yuid];
            if (prop in PROPS_WRAP) { // wrap DOM object (HTMLElement, HTMLCollection, Document)
                val = wrap(node[prop]);
            } else if (GETTERS[prop]) { // use custom getter
                val = GETTERS[prop](this, prop); // passing Node instance
            } else if (RE_VALID_PROP_TYPES.test(typeof node[prop])) { // safe to read
                val = node[prop];
            }
            return val;
        },

        invoke: function(method, a, b, c, d, e) {
            if (a) { // first 2 may be Node instances or strings
                a = (a[NODE_NAME]) ? a : getDOMNode(a);
                if (b) {
                    b = (b[NODE_NAME]) ? b : getDOMNode(b);
                }
            }
           var  node = _nodes[this._yuid];
            if (METHODS_INVOKE[method] && node[method]) {
                return node[method](a, b, c, d, e);
            }
            return null;
        },

        /**
         * Tests whether or not the bound HTMLElement can use the given method. 
         * @method hasMethod
         * @param {String} method The method to check for 
         * @return {Boolean} Whether or not the HTMLElement can use the method 
         */
        hasMethod: function(method) {
            return !!(METHODS_INVOKE[method] && _nodes[this._yuid][method]);
        },

        //normalize: function() {},
        //isSupported: function(feature, version) {},
        toString: function() {
            return this.get('id') || this.get(NODE_NAME);
        },

        /**
         * Retrieves a single node based on the given CSS selector. 
         * @method query
         *
         * @param {string} selector The CSS selector to test against.
         * @return {Node} A Node instance for the matching HTMLElement.
         */
        query: function(selector) {
            return new Node(Selector.query(selector, _nodes[this._yuid], true));
        },

        /**
         * Retrieves a nodeList based on the given CSS selector. 
         * @method queryAll
         *
         * @param {string} selector The CSS selector to test against.
         * @return {NodeList} A NodeList instance for the matching HTMLCollection/Array.
         */
        queryAll: function(selector) {
            return new NodeList(Selector.query(selector, _nodes[this._yuid]));
        },

        /**
         * Test if the supplied node matches the supplied selector.
         * @method test
         *
         * @param {string} selector The CSS selector to test against.
         * @return {boolean} Whether or not the node matches the selector.
         */
        test: function(selector) {
            return Selector.test(_nodes[this._yuid], selector);
        },

        /**
         * Retrieves a style attribute from the given node.
         * @method getStyle
         * @param {String} attr The style attribute to retrieve. 
         * @return {String} The current value of the style property for the element.
         */
        getStyle: function(attr) {
            var style = _styles[this._yuid];
            var val = style[attr];
            if (val === '') { // TODO: is empty string sufficient?
                var node = _nodes[this._yuid];
                var view = node[OWNER_DOCUMENT][DEFAULT_VIEW];
                if (view && view.getComputedStyle) {
                    val = view.getComputedStyle(node, '')[attr];
                } else if (node.currentStyle) {
                    val =  node.currentStyle[attr];
                }
            }

            if (val === undefined) {
                val = ''; // TODO: more robust
            }
            return val;
        },

        /**
         * Applies a CSS style to a given node.
         * @method getStyle
         * @param {String} attr The style attribute to retrieve. 
         * @return {String} The current value of the style property for the element.
         */
        setStyle: function(attr, val) {
             _styles[this._yuid][attr] = val;
            return this;
        },

        /**
         * Compares nodes to determine if they match.
         * Node instances can be compared to each other and/or HTMLElements/selectors.
         * @method compareTo
         * @param {String | HTMLElement | Node} refNode The reference node to compare to the node.
         * @return {Boolean} True if the nodes match, false if they do not. 
         */
        compareTo: function(refNode) {
            refNode = refNode[NODE_NAME] ? refNode : _nodes[refNode._yuid];
            return _nodes[this._yuid] === refNode;
        },

       /*
         * Returns the nearest ancestor that passes the test applied by supplied boolean method.
         * @method ancestor
         * @param {Function} method - A boolean method for testing elements which receives the element as its only argument.
         * @return {Node} The matching Node instance or null if not found
         */
        ancestor: function(test) {
            var node = this;
            while (node = node.get(PARENT_NODE)) { // NOTE: assignment
                if ( test(node) ) {
                    Y.log('ancestor returning ' + node, 'info', 'Node');
                    return node;
                }
            } 

            Y.log('ancestor returning null (no ancestor passed test)', 'error', 'Node');
            return null;
        },

       /*
         * Attaches a handler for the given DOM event.
         * @method attach
         * @param {String} type The type of DOM Event to listen for 
         * @param {Function} fn The handler to call when the event fires 
         * @param {Object} arg An argument object to pass to the handler 
         */

        attach: function(type, fn, arg) {
            var args = [].slice.call(arguments, 0);
            args.unshift(_nodes[this._yuid]);
            return Y.Event.addListener.apply(Y.Event, args);
        },

       /*
         * Alias for attach.
         * @method on
         * @param {String} type The type of DOM Event to listen for 
         * @param {Function} fn The handler to call when the event fires 
         * @param {Object} arg An argument object to pass to the handler 
         * @see attach
         */

        on: function(type, fn, arg) {
            return this.attach.apply(this, arguments);
        },

        addEventListener: function(type, fn, arg) {
            return Y.Event.nativeAdd(_nodes[this._yuid], type, fn, arg);
        },
        
       /**
         * Attaches a handler for the given DOM event.
         * @method detach
         * @param {String} type The type of DOM Event
         * @param {Function} fn The handler to call when the event fires 
         */
        detach: function(type, fn) {
            var args = [].slice.call(arguments, 0);
            args.unshift(_nodes[this._yuid]);
            return Y.Event.removeListener.apply(Y.Event, args);
        },

        removeEventListener: function(type, fn) {
            return Y.Event.nativeRemove(_nodes[this._yuid], type, fn);
        },

       /**
         * Creates a Node instance from HTML string or jsonml
         * @method create
         * @param {String|Array} html The string or jsonml to create from 
         * @return {Node} A new Node instance 
         */
        create: function(html) {
            return Y.Node.create(html);
        }
    };

    Y.each(METHODS, function(fn, method) {
        Node.prototype[method] = function() {
            var args = [].slice.call(arguments, 0);
            args.unshift(method);
            return fn.apply(this, args);
        };
    });

    var _createNode = function(data) {
        var frag = Y.config.doc.createElement('div');
        frag.innerHTML = _createHTML(data);
        return frag.firstChild;
    };

    var _createHTML = function(jsonml) {
        var html = [];
        var att = [];

        if (Y.lang.isString(jsonml)) { // text node
            return jsonml;
        }

        if (!jsonml || !jsonml.push) { // isArray
            return ''; // expecting array 
        }

        var tag = jsonml[0];
        if (!Y.lang.isString(tag)) {
            return null; // bad tag error
        }

        for (var i = 1, len = jsonml.length; i < len; ++i) {
            if (typeof jsonml[i] === 'string' || jsonml[i].push) {
                html[html.length] = _createHTML(jsonml[i]);
            } else if (typeof jsonml[i] == 'object') {
                for (var attr in jsonml[i]) {
                    if (jsonml[i].hasOwnProperty(attr)) {
                        att[att.length] = ' ' + attr + '="' + jsonml[i][attr] + '"';
                    }
                }
            }
        }
        return '<' + tag + att.join('') + '>' + html.join('') + '</' + tag + '>';
        
    };

    /** 
     *  Creates a Node instance from an HTML string or jsonml
     * @method create
     * @param {String | Array} jsonml HTML string or jsonml
     */
    Node.create = function(jsonml) {
        return new Node(_createNode(jsonml));
    };

    Node.byId = function(id, doc) {
        doc = (doc && doc[NODE_TYPE]) ? doc : Y.config.doc;
        return doc.getElementById(id);
    };

    /**
     * Retrieves a Node instance for the given object/string. 
     * @method get
     *
     * Use 'document' string to retrieve document Node instance from string
     * @param {document|HTMLElement|HTMLCollection|Array|String} node The object to wrap.
     * @param {document|Node} doc optional The document containing the node. Defaults to current document.
     * @return {Node} A wrapper instance for the supplied object.
     */
    Node.get = function(node, doc) {
        if (node instanceof Node) {
            return node;
        }

        if (!doc) {
            doc = Y.config.doc;
        } else if (doc._yuid && _nodes[doc._yuid]) {
            doc = _nodes[doc._yuid]; 
        }
    
        if (node && typeof node == 'string') {
            switch(node) {
                case 'document':
                    node = Y.config.doc;
                    break;
                default: 
                    node = Selector.query(node, doc, true);
            }
        }

        return wrap(node);
    };

    /**
     * Retrieves a NodeList instance for the given object/string. 
     * @method all
     * @param {HTMLCollection|Array|String} node The object to wrap.
     * @param {document|Node} doc optional The document containing the node. Defaults to current document.
     * @return {NodeList} A wrapper instance for the supplied nodes.
     */
    Node.all = function(nodes, doc) {
        if (nodes instanceof NodeList) {
            return nodes;
        }

        if (!doc) {
            doc = Y.config.doc;
        } else if (doc._yuid && _nodes[doc._yuid]) {
            doc = _nodes[doc._yuid]; 
        }
    
        if (nodes && typeof nodes == 'string') {
            nodes = Selector.query(nodes, doc);
        }

        return wrap(nodes);

    };

    /** 
     * A wrapper for interacting with DOM elements
     * @class NodeList
     */
    var NodeList = function(nodes) {
        _nodes[Y.stamp(this)] = nodes;
    };

    NodeList.prototype = {};
    Y.each(Node.prototype, function(fn, method) {
        var ret;
        var a = [];
        NodeList.prototype[method] = function() {
            var nodes = _nodes[this._yuid];
            var node = new Node(Y.doc.config.createElement('div'));
            for (var i = 0, len = nodes.length; i < len; ++i) {
                _nodes[node._yuid] = nodes[i];
                ret = node[method].apply(node, arguments);
                if (ret !== undefined) {
                    a[i] = ret;
                }
            }

            return a.length ? a : this;
        };
    });

    Y.mix(NodeList.prototype, {
        /**
         * Retrieves the Node instance at the given index. 
         * @method item
         *
         * @param {Number} index The index of the target Node.
         * @return {Node} The Node instance at the given index.
         */
        item: function(index) {
            var node = _nodes[this._yuid][index];
            return (node && node.tagName) ? wrap(node) : (node && node.get) ? node : null;
        },

        /**
         * Set the value of the property/attribute on all HTMLElements bound to this NodeList.
         * Only strings/numbers/booleans are passed through unless a SETTER exists.
         * @method set
         * @param {String} prop Property to set 
         * @param {any} val Value to apply to the given property
         * @see Node
         */
        set: function(name, val) {
            var nodes = _nodes[this._yuid];
            for (var i = 0, len = nodes.length; i < len; ++i) {
                Node.set(nodes[i], name, val);
            }

            return this;
        },

        /**
         * Get the value of the property/attribute for each of the HTMLElements bound to this NodeList.
         * Only strings/numbers/booleans are passed through unless a GETTER exists.
         * @method get
         * @param {String} prop Property to get 
         * @return {Array} Array containing the current values mapped to the Node indexes 
         * @see Node
         */
        get: function(name) {
            if (name == 'length') {
                return _nodes[this._yuid].length;
            }
            var nodes = _nodes[this._yuid];
            var ret = [];
            for (var i = 0, len = nodes.length; i < len; ++i) {
                ret[i] = Node.get(nodes[i], name);
            }

            return ret;
        },

        /**
         * Filters the NodeList instance down to only nodes matching the given selector.
         * @method filter
         * @param {String} selector The selector to filter against
         * @return {NodeList} NodeList containing the updated collection 
         * @see Selector
         */
        filter: function(selector) {
            return new NodeList(Selector.filter(_nodes[this._yuid], selector));
        },

        /**
         * Applies the given function to each Node in the NodeList.
         * @method each
         * @param {Function} fn The function to apply 
         * @return {NodeList} NodeList containing the updated collection 
         * @see Y.each
         */
        each: function(fn, context) {
            context = context || this;
            var nodes = _nodes[this._yuid];
            var node = new Node(Y.config.doc.createElement('div')); // reusing single instance for each node
            for (var i = 0, len = nodes.length; i < len; ++i) {
                _nodes[node._yuid] = nodes[i]; // remap Node instance to current node
                fn.call(context, node, i, this);
            }
            return this;
        }
    }, true);

    Y.Node = Node;
    Y.NodeList = NodeList;
}, '3.0.0');
