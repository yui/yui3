/**
 * DOM Abstractions.
 * @module dom
 */

YUI.add('node', function(Y) {

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


    var RE_VALID_PROP_TYPES = /(?:string|boolean|number)/;

    Y.use('selector'); // TODO: need this?  should be able to "use" from "add"
    var Selector = Y.Selector;
    var _cache = {};

    var create = function(node) {
        if (!node) {
            return null;
        }
        if (!node.nodeName && node.get) {
            return node; // Node instance
        }

        if (node.item && 'length' in node) {
            return new NodeList(node);
        }

        switch(node.nodeType) {
            case ELEMENT_NODE:
                return new Element(node);

            case DOCUMENT_NODE:
                return new Doc(node);

            default: // BASIC NODE (TEXT_NODE, etc.)
                return new Node(node);
        }
    };

    var getDOMNode = function(root, node) {
        if (typeof node == 'string') {
            return Selector.query(node, root, true);
        }

        return      (node && node._yuid) ? _cache[node._yuid] :
                    (node && node.nodeName) ?  node :
                    null;
    };

    /** 
     * Wraps the return value of the method in a node instance
     * For use with methods that return nodes
     */
    var nodeInOut = function(method, a, b, c, d, e) {
        if (a) { // first 2 may be Node instances or strings
            a = (!a.nodeName) ? getDOMNode(_cache[this._yuid], a) : a;
            if (b) {
                b = (!b.nodeName) ? getDOMNode(_cache[this._yuid], b) : b;
            }
        }
        return create(_cache[this._yuid][method](a, b, c, d, e));
    };

    var nodeOut = function(method, a, b, c, d, e) {
        return create(_cache[this._yuid][method](a, b, c, d, e));
    };
    /** 
     */
    var rawOut = function(method, a, b, c, d, e) {
        return _cache[this._yuid][method](a, b, c, d, e);
    };
    var PROPS_WRAP = {
        'parentNode': BASE_NODE,
        'childNodes': BASE_NODE,
        'firstChild': BASE_NODE,
        'lastChild': BASE_NODE,
        'previousSibling': BASE_NODE,
        'nextSibling': BASE_NODE,
        'ownerDocument': BASE_NODE,

        'offsetParent': ELEMENT_NODE,

        'documentElement': DOCUMENT_NODE,
        'body': DOCUMENT_NODE,

        // form
        'elements': ELEMENT_NODE
    };

    var PROPS_READ = { // white list (currently all strings|numbers|booleans are allowed)
    };

    var PROPS_WRITE = { // white list (currently all strings|numbers|booleans are allowed)
    };

    var SETTERS = { // custom setters for specific properties

    };

    var GETTERS = {};
    GETTERS[ELEMENT_NODE] = { // custom getters for specific properties
        'text': function(node) {
            return node.innerText || node.textContent || '';
        },

        children: function() {
            return this.queryAll('> *');
        }
    };

    GETTERS[DOCUMENT_NODE] = { // custom getters for specific properties
        'height':  function(doc) {
            var win = doc.defaultView || doc.parentWindow;
            var h = (doc.compatMode != 'CSS1Compat') ?
                    doc.body.scrollHeight : doc.documentElement.scrollHeight; // body first for safari
            return Math.max(h, WIN_GETTERS['height'](win));
        },

        'width':  function(doc) {
            var win = doc.defaultView || doc.parentWindow;
            var w = (doc.compatMode != 'CSS1Compat') ?
                    doc.body.scrollWidth : doc.documentElement.scrollWidth; // body first for safari
            return Math.max(w, WIN_GETTERS['width'](win));
        },

        'scrollTop':  function(doc) {
            return Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);
        },

        'scrollLeft':  function(doc) {
            return Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
        }
    };

    var METHODS = {};

    METHODS[BASE_NODE] = {
        insertBefore: nodeInOut,
        replaceChild: nodeInOut,
        removeChild: nodeInOut,
        appendChild: nodeInOut,
        cloneNode: nodeOut
    };

    var METHODS_INVOKE = {
        'getBoundingClientRect': true,
        'contains': true,
        'compareDocumentPosition': true
    };

    var Node = function(node) {
        if (!node || !node.nodeName) {
            return null;
            throw new Error('Node: invalid node');
        }
        _cache[Y.stamp(this)] = node;
    };

    Node.prototype = {
        set: function(prop, val) {
            node = _cache[this._yuid];
            if (prop in SETTERS) { // use custom setter
                SETTERS[prop](node, prop, val); 
            } else if (RE_VALID_PROP_TYPES.test(typeof node[prop]) || prop in PROPS_WRITE) { // safe to write
                node[prop] = val;
            }
            return this;
        },

        get: function(prop) {
            var val;
            node = _cache[this._yuid];
            if (prop in PROPS_WRAP) { // wrap DOM object (HTMLElement, HTMLCollection, Document, Window)
                val = create(node[prop]);
            } else if (GETTERS[node.nodeType] && GETTERS[node.nodeType][prop]) { // use custom getter
                val = GETTERS[node.nodeType][prop].call(this, node, prop, val);
            } else if (RE_VALID_PROP_TYPES.test(typeof node[prop]) || prop in PROPS_READ) { // safe to read
                val = node[prop];
            }
            return val;
        },

        hasChildNodes: function() {
            return !!_cache[this._yuid].childNodes.length;
        },

        invoke: function(method, a, b, c, d, e) {
           var  node = _cache[this._yuid];
            if (METHODS_INVOKE[method] && node[method]) {
                return node[method](a, b, c, d, e);
            }
            return null;
        },

        hasMethod: function(str, method) {
            return !!(METHODS_INVOKE[method] && _cache[this._yuid][method]);
        }

        //normalize: function() {},
        //isSupported: function(feature, version) {},

    };

    Y.each(METHODS[BASE_NODE], function(fn, method) {
        Node.prototype[method] = function() {
            var args = [].splice.call(arguments, 0);
            args.unshift(method);
            return fn.apply(this, args);
        };
    });

    METHODS[ELEMENT_NODE] = {
        getAttribute: rawOut,
        setAttribute: rawOut,
        removeAttribute: rawOut,
        hasAttribute: rawOut,
        scrollIntoView: rawOut,

        getElementsByTagName: nodeOut,

        focus: rawOut,
        blur: rawOut,
        submit: rawOut,
        reset: rawOut

    };
    var Element = function(node) {
        Element.superclass.constructor.call(this, node);
    };

    Y.extend(Element, Node, {
        /**
         * Retrieves a single node based on the given CSS selector. 
         * @method query
         *
         * @param {string} selector The CSS selector to test against.
         * @return {Node} A Node instance for the matching HTMLElement.
         */
        query: function(selector) {
            return new Element(Selector.query(selector, _cache[this._yuid], true));
        },

        /**
         * Retrieves a nodeList based on the given CSS selector. 
         * @method queryAll
         *
         * @param {string} selector The CSS selector to test against.
         * @return {NodeList} A NodeList instance for the matching HTMLCollection/Array.
         */
        queryAll: function(selector) {
            return new NodeList(Selector.query(selector, _cache[this._yuid]));
        },

        /**
         * Test if the supplied node matches the supplied selector.
         * @method test
         *
         * @param {string} selector The CSS selector to test against.
         * @return {boolean} Whether or not the node matches the selector.
         */
        test: function(selector) {
            return Selector.test(_cache[this._yuid], selector);
        },

        /**
         * Retrieves a style attribute from the given node.
         * @method getStyle
         * @param {String} attr The style attribute to retrieve. 
         * @return {String} The current value of the style property for the element.
         */
        getStyle: function(attr) {
            var node = _cache[this._yuid];
            var val = node.style[attr];
            var view = node.ownerDocument.defaultView;
            if (val === '') { // TODO: is empty string sufficient?
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
             _cache[this._yuid].style[attr] = val;
        },

        /**
         * Compares nodes to determine if they match.
         * Node instances can be compared to each other and/or HTMLElements/selectors.
         * @method compareTo
         * @param {String | HTMLElement | Node} refNode The reference node to compare to the node.
         * @return {Boolean} True if the nodes match, false if they do not. 
         */
        compareTo: function(refNode) {
            refNode = refNode._yuid ? _cache[refNode._yuid] : refNode;
            return _cache[this._yuid] === refNode;
        },

       /**
         * Returns the nearest ancestor that passes the test applied by supplied boolean method.
         * @method getAncestorBy
         * @param {Function} method - A boolean method for testing elements which receives the element as its only argument.
         * @return {Object} HTMLElement or null if not found
         */
        ancestor: function(test) {
            var node = this;
            while (node = node.get('parentNode')) { // NOTE: assignment
                if ( test(node) ) {
                    YAHOO.log('getAncestorBy returning ' + node, 'info', 'Dom');
                    return node;
                }
            } 

            YAHOO.log('ancestor returning null (no ancestor passed test)', 'error', 'Node');
            return null;
        }
        
    });

    Y.each(METHODS[ELEMENT_NODE], function(fn, method) {
        Element.prototype[method] = function() {
            var args = [].splice.call(arguments, 0);
            args.unshift(method);
            return fn.apply(this, args);
        };
    });

    var Doc = function(node) {
        node = node || Y.config.doc;
        Doc.superclass.constructor.call(this, node);
    };

    
    Doc.get = function(doc, node) {
        if (!doc) {
            return create(Y.config.doc);
        }

        if (doc.nodeName != '#document') {
            node = doc;
            doc = Y.config.doc;
        }
        if (node && typeof node == 'string') {
            node = Selector.query(node, doc, true);
        }
        return create(node);
    };

    Doc.queryAll = function(doc, selector, root) {
        if (doc.nodeName != '#document') {
            selector = doc;
            doc = Y.config.doc;
        }

        root = root || doc;
        return new NodeList(Selector.query(selector, root));
        return new NodeList(nodes);

    };


    METHODS[DOCUMENT_NODE] = {
        createElement: nodeOut,
        //createDocumentFragment: fragReturn,
        createTextNode: nodeInOut,

        getElementsByTagName: nodeOut,

        //createElementNS: nodeOut,
        //getElementsByTagNameNS: nodeOut,
        getElementById: nodeOut
    };

    Y.extend(Doc, Node, {
        query: Element.prototype.query,

        queryAll: Element.prototype.queryAll,

        test: function() {
            Element.prototype.test.apply(this, arguments);
        },

        getElementsBy: function(method, test, tag, root, apply) {
            tag = tag || '*';
            doc = doc.nodeName ? new Doc(doc) : doc;

            if (root) {
                root = (root.tagName) ? new Element(root) : (root.get) ? root : null;
            } else {
                root = doc;
            }

            var elements;

            if (root) {
                elements = root.getElementsByTagName(tag);
            } else {
                elements = [];
            }

            var nodes = [],
                item;
            
            for (var i = 0, len = elements.length(); i < len; ++i) {
                item = elements.item(i);
                if ( test(item) ) {
                    nodes[nodes.length] = item;
                    if (apply) {
                        apply(item);
                    }
                }
            }

            YAHOO.log('getElementsBy returning ' + nodes, 'info', 'Dom');
            
            return new Y.NodeList(nodes);
        }
    });

    Y.each(METHODS[DOCUMENT_NODE], function(fn, method) {
        Doc.prototype[method] = function() {
            var args = [].splice.call(arguments, 0);
            args.unshift(method);
            return fn.apply(this, args);
        };
    });

    var NodeList = function(nodes) {
        _cache[Y.stamp(this)] = nodes;
    };

    // include here to allow access to private Node class
    NodeList.prototype = {
        length: function() {
            return _cache[this._yuid].length;
        },

        item: function(index) {
            var node = _cache[this._yuid][index];
            return (node && node.tagName) ? create(node) : (node && node.get) ? node : null;
        },

        set: function(name, val) {
            var nodes = _cache[this._yuid];
            for (var i = 0, len = nodes.length; i < len; ++i) {
                Node.set(nodes[i], name, val);
            }

            return this;
        },

        get: function(name) {
            var nodes = _cache[this._yuid];
            var ret = [];
            for (var i = 0, len = nodes.length; i < len; ++i) {
                ret[i] = Node.get(nodes[i], name);
            }

            return ret;
        },

        filter: function(selector) {
            return new NodeList(Selector.filter(_cache[this._yuid], selector));
        }
    };

    Y.each(Element.prototype, function(fn, method) {
        var ret;
        var a = [];
        NodeList.prototype[method] = function(a, b, c, d, e) {
            for (var i = 0, len = nodes.length; i < len; ++i) {
                ret = Element[method].call(Element, nodes[i], a, b, c, d, e);
                if (ret !== Element) {
                    a[i] = ret;
                }
            }

            return a.length ? a : this;
        };
    });

    // TODO: merge with NODE statics?
    var WIN_PROPS_WRAP = {
        'document': 1,
        'window': 1,
        'top': 1,
        'opener': 1,
        'parent': 1,
        'frameElement': 1
    };

    var WIN_GETTERS = {
        'height': function(win) {
            var h = win.innerHeight, // Safari, Opera
            doc = win.document,
            mode = doc.compatMode;
        
            if ( (mode || Y.env.ua.ie) && !Y.env.ua.opera ) { // IE, Gecko
                h = (mode == 'CSS1Compat') ?
                        doc.documentElement.clientHeight : // Standards
                        doc.body.clientHeight; // Quirks
            }
        
            YAHOO.log('GETTERS:height returning ' + h, 'info', 'Win');
            return h;
        },

        'width': function(win) {
            var w = win.innerWidth, // Safari, Opera
            doc = win.document,
            mode = doc.compatMode;
        
            if ( (mode || Y.env.ua.ie) && !Y.env.ua.opera ) { // IE, Gecko
                w = (mode == 'CSS1Compat') ?
                        doc.documentElement.clientWidth : // Standards
                        doc.body.clientWidth; // Quirks
            }
        
            YAHOO.log('GETTERS:width returning ' + w, 'info', 'Win');
            return w;
        }
    };
    var WIN_SETTERS = {};
    var WIN_PROPS_READ = {};
    var WIN_PROPS_WRITE = {};


    var Win = function(win) {
        win = win || Y.config.win; // TODO: abstract window ref?
        _cache[Y.stamp(this)] = win; 
    };

    Win.prototype = {
        get: function(prop) {
            var val;
            var node = _cache[this._yuid];
            if (prop in WIN_PROPS_WRAP) { // wrap DOM object (HTMLElement, HTMLCollection, Document, Window)
                val = create(node[prop]);
            } else if (prop in WIN_GETTERS) { // use custom setter
                val = WIN_GETTERS[prop](node, prop, val);
            } else if (RE_VALID_PROP_TYPES.test(typeof node[prop]) || prop in WIN_PROPS_READ) { // safe to read
                val = node[prop];
            }
            return val;
        },

        set: function(prop, val) {
            var node = _cache[this._yuid];
            if (prop in WIN_SETTERS) { // use custom setter
                WIN_SETTERS[prop](node, prop, val); 
            } else if (RE_VALID_PROP_TYPES.test(typeof node[prop]) || prop in WIN_PROPS_WRITE) { // safe to write
                node[prop] = val;
            }
            return this;
        },

        'scrollTo': rawOut,
        'scrollBy': rawOut,
        'resizeTo': rawOut,
        'resizeBy': rawOut,
        'moveTo': rawOut,
        'moveBy': rawOut


/* TODO: allow?
        'focus': rawOut,
        'blur': rawOut,

        'close': rawOut,
        'open': nodeInOut,

        'forward': rawOut,
        'back': rawOut,
*/
    };

    Y.Node = Element;
    Y.NodeList = NodeList;
    Y.Doc = Doc;
    Y.Win = Win;
}, '3.0.0');
