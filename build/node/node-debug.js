/**
 * The selector module provides helper methods allowing CSS3 Selectors to be used with DOM elements.
 * @module selector
 * @title Selector Utility
 * @namespace YAHOO.util
 * @requires yahoo, dom
 */

YUI.add('selector', function(Y) {
/**
 * Provides helper methods for collecting and filtering DOM elements.
 * @namespace YAHOO.util
 * @class Selector
 * @static
 */
var Selector = function() {};

var reNth = /^(?:([-]?\d*)(n){1}|(odd|even)$)*([-+]?\d*)$/;

Selector.prototype = {
    /**
     * Default document for use queries 
     * @property document
     * @type object
     * @default window.document
     */
    document: window.document,
    /**
     * Mapping of attributes to aliases, normally to work around HTMLAttributes
     * that conflict with JS reserved words.
     * @property attrAliases
     * @type object
     */
    attrAliases: {
    },

    /**
     * Mapping of shorthand tokens to corresponding attribute selector 
     * @property shorthand
     * @type object
     */
    shorthand: {
        //'(?:(?:[^\\)\\]\\s*>+~,]+)(?:-?[_a-z]+[-\\w]))+#(-?[_a-z]+[-\\w]*)': '[id=$1]',
        '\\#(-?[_a-z]+[-\\w]*)': '[id=$1]',
        '\\.(-?[_a-z]+[-\\w]*)': '[class~=$1]'
    },

    /**
     * List of operators and corresponding boolean functions. 
     * These functions are passed the attribute and the current node's value of the attribute.
     * @property operators
     * @type object
     */
    operators: {
        '=': function(attr, val) { return attr === val; }, // Equality
        '!=': function(attr, val) { return attr !== val; }, // Inequality
        '~=': function(attr, val) { // Match one of space seperated words 
            var s = ' ';
            return (s + attr + s).indexOf((s + val + s)) > -1;
        },
        '|=': function(attr, val) { return getRegExp('^' + val + '[-]?').test(attr); }, // Match start with value followed by optional hyphen
        '^=': function(attr, val) { return attr.indexOf(val) === 0; }, // Match starts with value
        '$=': function(attr, val) { return attr.lastIndexOf(val) === attr.length - val.length; }, // Match ends with value
        '*=': function(attr, val) { return attr.indexOf(val) > -1; }, // Match contains value as substring 
        '': function(attr, val) { return attr; } // Just test for existence of attribute
    },

    /**
     * List of pseudo-classes and corresponding boolean functions. 
     * These functions are called with the current node, and any value that was parsed with the pseudo regex.
     * @property pseudos
     * @type object
     */
    pseudos: {
        'root': function(node) {
            return node === node.ownerDocument.documentElement;
        },

        'nth-child': function(node, val) {
            return getNth(node, val);
        },

        'nth-last-child': function(node, val) {
            return getNth(node, val, null, true);
        },

        'nth-of-type': function(node, val) {
            return getNth(node, val, node.tagName);
        },
         
        'nth-last-of-type': function(node, val) {
            return getNth(node, val, node.tagName, true);
        },
         
        'first-child': function(node) {
            return getChildren(node.parentNode)[0] === node;
        },

        'last-child': function(node) {
            var children = getChildren(node.parentNode);
            return children[children.length - 1] === node;
        },

        'first-of-type': function(node, val) {
            return getChildren(node.parentNode, node.tagName.toLowerCase())[0];
        },
         
        'last-of-type': function(node, val) {
            var children = getChildren(node.parentNode, node.tagName.toLowerCase());
            return children[children.length - 1];
        },
         
        'only-child': function(node) {
            var children = getChildren(node.parentNode);
            return children.length === 1 && children[0] === node;
        },

        'only-of-type': function(node) {
            return getChildren(node.parentNode, node.tagName.toLowerCase()).length === 1;
        },

        'empty': function(node) {
            return node.childNodes.length === 0;
        },

        'not': function(node, simple) {
            return !Selector.test(node, simple);
        },

        'contains': function(node, str) {
            var text = node.innerText || node.textContent || '';
            return text.indexOf(str) > -1;
        },
        'checked': function(node) {
            return node.checked === true;
        }
    },

    /**
     * Test if the supplied node matches the supplied selector.
     * @method test
     *
     * @param {HTMLElement | String} node An id or node reference to the HTMLElement being tested.
     * @param {string} selector The CSS Selector to test the node against.
     * @return{boolean} Whether or not the node matches the selector.
     * @static
    
     */
    test: function(node, selector) {
        node = Selector.document.getElementById(node) || node;

        if (!node) {
            return false;
        }

        var groups = selector ? selector.split(',') : [];
        if (groups.length) {
            for (var i = 0, len = groups.length; i < len; ++i) {
                if ( rTestNode(node, groups[i]) ) { // passes if ANY group matches
                    return true;
                }
            }
            return false;
        }
        return rTestNode(node, selector);
    },

    /**
     * Filters a set of nodes based on a given CSS selector. 
     * @method filter
     *
     * @param {array} nodes A set of nodes/ids to filter. 
     * @param {string} selector The selector used to test each node.
     * @return{array} An array of nodes from the supplied array that match the given selector.
     * @static
     */
    filter: function(nodes, selector) {
        nodes = nodes || [];

        var node,
            result = [],
            tokens = tokenize(selector);

        if (!nodes.item) { // if not HTMLCollection, handle arrays of ids and/or nodes
            YAHOO.log('filter: scanning input for HTMLElements/IDs', 'info', 'Selector');
            for (var i = 0, len = nodes.length; i < len; ++i) {
                if (!nodes[i].tagName) { // tagName limits to HTMLElements 
                    node = Selector.document.getElementById(nodes[i]);
                    if (node) { // skip IDs that return null 
                        nodes[i] = node;
                    } else {
                        YAHOO.log('filter: skipping invalid node', 'warn', 'Selector');
                    }
                }
            }
        }
        result = rFilter(nodes, tokenize(selector)[0]);
        clearParentCache();
        YAHOO.log('filter: returning:' + result.length, 'info', 'Selector');
        return result;
    },

    /**
     * Retrieves a set of nodes based on a given CSS selector. 
     * @method query
     *
     * @param {string} selector The CSS Selector to test the node against.
     * @param {HTMLElement | String} root optional An id or HTMLElement to start the query from. Defaults to Selector.document.
     * @param {Boolean} firstOnly optional Whether or not to return only the first match.
     * @return {Array} An array of nodes that match the given selector.
     * @static
     */
    query: function(selector, root, firstOnly) {
        var result = query(selector, root, firstOnly);
        YAHOO.log('query: returning ' + result, 'info', 'Selector');
        return result;
    }
};

var query = function(selector, root, firstOnly, deDupe) {
    var result =  (firstOnly) ? null : [];
    if (!selector) {
        return result;
    }

    var groups = selector.split(','); // TODO: handle comma in attribute/pseudo

    if (groups.length > 1) {
        var found;
        for (var i = 0, len = groups.length; i < len; ++i) {
            found = arguments.callee(groups[i], root, firstOnly, true);
            result = firstOnly ? found : result.concat(found); 
        }
        clearFoundCache();
        return result;
    }

    if (root && !root.nodeName) { // assume ID
        root = Selector.document.getElementById(root);
        if (!root) {
            YAHOO.log('invalid root node provided', 'warn', 'Selector');
            return result;
        }
    }

    root = root || Selector.document;
    var tokens = tokenize(selector);
    var idToken = tokens[getIdTokenIndex(tokens)],
        nodes = [],
        node,
        id,
        token = tokens.pop() || {};
        
    if (idToken) {
        id = getId(idToken.attributes);
    }

    // use id shortcut when possible
    if (id) {
        node = Selector.document.getElementById(id);

        if (node && (root.nodeName == '#document' || contains(node, root))) {
            if ( rTestNode(node, null, idToken) ) {
                if (idToken === token) {
                    nodes = [node]; // simple selector
                } else {
                    root = node; // start from here
                }
            }
        } else {
            return result;
        }
    }

    if (root && !nodes.length) {
        nodes = root.getElementsByTagName(token.tag);
    }

    if (nodes.length) {
        result = rFilter(nodes, token, firstOnly, deDupe); 
    }
    clearParentCache();
    return result;
};

var contains = function() {
    if (document.documentElement.contains && !YAHOO.env.ua.webkit < 422)  { // IE & Opera, Safari < 3 contains is broken
        return function(needle, haystack) {
            return haystack.contains(needle);
        };
    } else if ( document.documentElement.compareDocumentPosition ) { // gecko
        return function(needle, haystack) {
            return !!(haystack.compareDocumentPosition(needle) & 16);
        };
    } else  { // Safari < 3
        return function(needle, haystack) {
            var parent = needle.parentNode;
            while (parent) {
                if (needle === parent) {
                    return true;
                }
                parent = parent.parentNode;
            } 
            return false;
        }; 
    }
}();

var rFilter = function(nodes, token, firstOnly, deDupe) {
    var result = firstOnly ? null : [];

    for (var i = 0, len = nodes.length; i < len; i++) {
        if (! rTestNode(nodes[i], '', token, deDupe)) {
            continue;
        }

        if (firstOnly) {
            return nodes[i];
        }
        if (deDupe) {
            if (nodes[i]._found) {
                continue;
            }
            nodes[i]._found = true;
            foundCache[foundCache.length] = nodes[i];
        }

        result[result.length] = nodes[i];
    }

    return result;
};

var rTestNode = function(node, selector, token, deDupe) {
    token = token || tokenize(selector).pop() || {};

    if (!node.tagName ||
        (token.tag !== '*' && node.tagName.toUpperCase() !== token.tag) ||
        (deDupe && node._found) ) {
        return false;
    }

    if (token.attributes.length) {
        var attribute;
        for (var i = 0, len = token.attributes.length; i < len; ++i) {
            attribute = node.getAttribute(token.attributes[i][0], 2);
            if (attribute === undefined) {
                return false;
            }
            if ( Selector.operators[token.attributes[i][1]] &&
                    !Selector.operators[token.attributes[i][1]](attribute, token.attributes[i][2])) {
                return false;
            }
        }
    }

    if (token.pseudos.length) {
        for (var i = 0, len = token.pseudos.length; i < len; ++i) {
            if (Selector.pseudos[token.pseudos[i][0]] &&
                    !Selector.pseudos[token.pseudos[i][0]](node, token.pseudos[i][1])) {
                return false;
            }
        }
    }

    return (token.previous && token.previous.combinator !== ',') ?
            combinators[token.previous.combinator](node, token) :
            true;
};


var foundCache = [];
var parentCache = [];
var regexCache = {};

var clearFoundCache = function() {
    YAHOO.log('getBySelector: clearing found cache of ' + foundCache.length + ' elements');
    for (var i = 0, len = foundCache.length; i < len; ++i) {
        try { // IE no like delete
            delete foundCache[i]._found;
        } catch(e) {
            foundCache[i].removeAttribute('_found');
        }
    }
    foundCache = [];
    YAHOO.log('getBySelector: done clearing foundCache');
};

var clearParentCache = function() {
    if (!document.documentElement.children) { // caching children lookups for gecko
        return function() {
            for (var i = 0, len = parentCache.length; i < len; ++i) {
                delete parentCache[i]._children;
            }
            parentCache = [];
        };
    } else return function() {}; // do nothing
}();

var getRegExp = function(str, flags) {
    flags = flags || '';
    if (!regexCache[str + flags]) {
        regexCache[str + flags] = new RegExp(str, flags);
    }
    return regexCache[str + flags];
};

var combinators = {
    ' ': function(node, token) {
        while (node = node.parentNode) {
            if (rTestNode(node, '', token.previous)) {
                return true;
            }
        }  
        return false;
    },

    '>': function(node, token) {
        return rTestNode(node.parentNode, null, token.previous);
    },
    '+': function(node, token) {
        var sib = node.previousSibling;
        while (sib && sib.nodeType !== 1) {
            sib = sib.previousSibling;
        }

        if (sib && rTestNode(sib, null, token.previous)) {
            return true; 
        }
        return false;
    },

    '~': function(node, token) {
        var sib = node.previousSibling;
        while (sib) {
            if (sib.nodeType === 1 && rTestNode(sib, null, token.previous)) {
                return true;
            }
            sib = sib.previousSibling;
        }

        return false;
    }
};

var getChildren = function() {
    if (document.documentElement.children) { // document for capability test
        return function(node, tag) {
            return (tag) ? node.children.tags(tag) : node.children || [];
        };
    } else {
        return function(node, tag) {
            if (node._children) {
                return node._children;
            }
            var children = [],
                childNodes = node.childNodes;

            for (var i = 0, len = childNodes.length; i < len; ++i) {
                if (childNodes[i].tagName) {
                    if (!tag || childNodes[i].tagName.toLowerCase() === tag) {
                        children[children.length] = childNodes[i];
                    }
                }
            }
            node._children = children;
            parentCache[parentCache.length] = node;
            return children;
        };
    }
}();

/*
    an+b = get every _a_th node starting at the _b_th
    0n+b = no repeat ("0" and "n" may both be omitted (together) , e.g. "0n+1" or "1", not "0+1"), return only the _b_th element
    1n+b =  get every element starting from b ("1" may may be omitted, e.g. "1n+0" or "n+0" or "n")
    an+0 = get every _a_th element, "0" may be omitted 
*/
var getNth = function(node, expr, tag, reverse) {
    if (tag) tag = tag.toLowerCase();
    reNth.test(expr);
    var a = parseInt(RegExp.$1, 10), // include every _a_ elements (zero means no repeat, just first _a_)
        n = RegExp.$2, // "n"
        oddeven = RegExp.$3, // "odd" or "even"
        b = parseInt(RegExp.$4, 10) || 0, // start scan from element _b_
        result = [];

    var siblings = getChildren(node.parentNode, tag);

    if (oddeven) {
        a = 2; // always every other
        op = '+';
        n = 'n';
        b = (oddeven === 'odd') ? 1 : 0;
    } else if ( isNaN(a) ) {
        a = (n) ? 1 : 0; // start from the first or no repeat
    }

    if (a === 0) { // just the first
        if (reverse) {
            b = siblings.length - b + 1; 
        }

        if (siblings[b - 1] === node) {
            return true;
        } else {
            return false;
        }

    } else if (a < 0) {
        reverse = !!reverse;
        a = Math.abs(a);
    }

    if (!reverse) {
        for (var i = b - 1, len = siblings.length; i < len; i += a) {
            if ( i >= 0 && siblings[i] === node ) {
                return true;
            }
        }
    } else {
        for (var i = siblings.length - b, len = siblings.length; i >= 0; i -= a) {
            if ( i < len && siblings[i] === node ) {
                return true;
            }
        }
    }
    return false;
};

var getId = function(attr) {
    for (var i = 0, len = attr.length; i < len; ++i) {
        if (attr[i][0] == 'id' && attr[i][1] === '=') {
            return attr[i][2];
        }
    }
};

var getIdTokenIndex = function(tokens) {
    for (var i = 0, len = tokens.length; i < len; ++i) {
        if (getId(tokens[i].attributes)) {
            return i;
        }
    }
    return -1;
};

var patterns = {
    tag: /^((?:-?[_a-z]+[\w-]*)|\*)/i,
    attributes: /^\[([a-z]+\w*)+([~\|\^\$\*!=]=?)?['"]?([^\]]*?)['"]?\]/i,
    //attributes: /^\[([a-z]+\w*)+([~\|\^\$\*!=]=?)?['"]?([^'"\]]*)['"]?\]*/i,
    pseudos: /^:([-\w]+)(?:\(['"]?(.+)['"]?\))*/i,
    combinator: /^\s*([>+~]|\s)\s*/
};

/**
    Break selector into token units per simple selector.
    Combinator is attached to left-hand selector.
 */
var tokenize = function(selector) {
    var token = {},     // one token per simple selector (left selector holds combinator)
        tokens = [],    // array of tokens
        id,             // unique id for the simple selector (if found)
        found = false,  // whether or not any matches were found this pass
        match;          // the regex match

    selector = replaceShorthand(selector); // convert ID and CLASS shortcuts to attributes

    /*
        Search for selector patterns, store, and strip them from the selector string
        until no patterns match (invalid selector) or we run out of chars.

        Multiple attributes and pseudos are allowed, in any order.
        for example:
            'form:first-child[type=button]:not(button)[lang|=en]'
    */
    do {
        found = false; // reset after full pass
        for (var re in patterns) {
                if (!YAHOO.lang.hasOwnProperty(patterns, re)) {
                    continue;
                }
                if (re != 'tag' && re != 'combinator') { // only one allowed
                    token[re] = token[re] || [];
                }
            if (match = patterns[re].exec(selector)) { // note assignment
                found = true;
                if (re != 'tag' && re != 'combinator') { // only one allowed
                    //token[re] = token[re] || [];

                    // capture ID for fast path to element
                    if (re === 'attributes' && match[1] === 'id') {
                        token.id = match[3];
                    }

                    token[re].push(match.slice(1));
                } else { // single selector (tag, combinator)
                    token[re] = match[1];
                }
                selector = selector.replace(match[0], ''); // strip current match from selector
                if (re === 'combinator' || !selector.length) { // next token or done
                    token.attributes = fixAttributes(token.attributes);
                    token.pseudos = token.pseudos || [];
                    token.tag = token.tag ? token.tag.toUpperCase() : '*';
                    tokens.push(token);

                    token = { // prep next token
                        previous: token
                    };
                }
            }
        }
    } while (found);

    return tokens;
};

var fixAttributes = function(attr) {
    var aliases = Selector.attrAliases;
    attr = attr || [];
    for (var i = 0, len = attr.length; i < len; ++i) {
        if (aliases[attr[i][0]]) { // convert reserved words, etc
            attr[i][0] = aliases[attr[i][0]];
        }
        if (!attr[i][1]) { // use exists operator
            attr[i][1] = '';
        }
    }
    return attr;
};

var replaceShorthand = function(selector) {
    var shorthand = Selector.shorthand;
    var attrs = selector.match(patterns.attributes); // pull attributes to avoid false pos on "." and "#"
    if (attrs) {
        selector = selector.replace(patterns.attributes, 'REPLACED_ATTRIBUTE');
    }
    for (var re in shorthand) {
        if (!YAHOO.lang.hasOwnProperty(shorthand, re)) {
            continue;
        }
        selector = selector.replace(getRegExp(re, 'gi'), shorthand[re]);
    }

    if (attrs) {
        for (var i = 0, len = attrs.length; i < len; ++i) {
            selector = selector.replace('REPLACED_ATTRIBUTE', attrs[i]);
        }
    }
    return selector;
};

Selector = new Selector();
Selector.patterns = patterns;
Y.Selector = Selector;

if (YAHOO.env.ua.ie) { // rewrite class for IE (others use getAttribute('class')
    Y.Selector.attrAliases['class'] = 'className';
    Y.Selector.attrAliases['for'] = 'htmlFor';
}

}, '3.0.0');
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

    // private factory
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

    // returns HTMLElement
    var getDOMNode = function(root, node) {
        if (typeof node == 'string') {
            return Selector.query(node, root, true);
        }

        return      (node && node._yuid) ? _cache[node._yuid] :
                    (node && node.nodeName) ?  node :
                    null;
    };

    /** 
     * Wraps the inputs value of the method in a node instance
     * Wraps the return value of the method in a node instance
     * For use with methods that accept and return nodes
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

    /** 
     * Wraps the return value of the method in a node instance
     * For use with methods that return nodes
     */
    var nodeOut = function(method, a, b, c, d, e) {
        return create(_cache[this._yuid][method](a, b, c, d, e));
    };

    /** 
     * Passes method directly to HTMLElement
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
        /**
         * Set the value of the property/attribute on the HTMLElement bound to this Node.
         * Only strings/numbers/booleans are passed through unless a SETTER exists.
         * @method set
         * @param {String} prop Property to set 
         * @param {any} val Value to apply to the given property
         */
        set: function(prop, val) {
            node = _cache[this._yuid];
            if (prop in SETTERS) { // use custom setter
                SETTERS[prop](node, prop, val); 
            } else if (RE_VALID_PROP_TYPES.test(typeof node[prop]) || prop in PROPS_WRITE) { // safe to write
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

        /**
         * Tests whether or not the bound HTMLElement has any child nodes. 
         * @method hasChildNodes
         * @return {Boolean} Whether or not the HTMLElement has childNodes 
         */
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

        /**
         * Tests whether or not the bound HTMLElement can use the given method. 
         * @method hasMethod
         * @param {String} method The method to check for 
         * @return {Boolean} Whether or not the HTMLElement can use the method 
         */
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
        /**
         * Retrieves a Node instance based on the given CSS selector. 
         * @method query
         *
         * @param {string} selector The CSS selector to test against.
         * @return {NodeList} A NodeList instance for the matching HTMLCollection/Array.
         */
        query: Element.prototype.query,

        /**
         * Retrieves a nodeList based on the given CSS selector. 
         * @method queryAll
         *
         * @param {string} selector The CSS selector to test against.
         * @return {NodeList} A NodeList instance for the matching HTMLCollection/Array.
         */
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
YUI.add('nodeextras', function(Y) {

    Y.use('node');

    var regexCache = {};
    var getRegExp = function(str, flags) {
        flags = flags || '';
        if (!regexCache[str + flags]) {
            regexCache[str + flags] = new RegExp(str, flags);
        }
        return regexCache[str + flags];
    };

    var NodeExtras = {
        /**
         * Determines whether an HTMLElement has the given className.
         * @method hasClass
         * @param {String} className the class name to search for
         * @return {Boolean | Array} A boolean value or array of boolean values
         */
        hasClass: function(className) {
            var re = getRegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
            return re.test(this.get('className'));
        },

        /**
         * Adds a class name to a given element or collection of elements.
         * @method addClass         
         * @param {String} className the class name to add to the class attribute
         * @return {Boolean | Array} A pass/fail boolean or array of booleans
         */
        addClass: function(className) {
            if (this.hasClass(node, className)) {
                return; // already present
            }
            
            //Y.log('addClass adding ' + className, 'info', 'Node');
            
            this.set('className', Y.lang.trim([this.get('className'), className].join(' ')));
        },

        /**
         * Removes a class name from a given element or collection of elements.
         * @method removeClass         
         * @param {String} className the class name to remove from the class attribute
         * @return {Boolean | Array} A pass/fail boolean or array of booleans
         */
        removeClass: function(className) {
            if (!className || !this.hasClass(className)) {
                return; // not present
            }                 

            //Y.log('removeClass removing ' + className, 'info', 'Node');
            
            this.set('className', Y.lang.trim(this.get('className').replace(getRegExp('(?:^|\\s+)'
                    + className + '(?:\\s+|$)'), ' ')));

            if ( this.hasClass(className) ) { // in case of multiple adjacent
                this.removeClass(className);
            }
        },

        /**
         * Replace a class with another class for a given element or collection of elements.
         * If no oldClassName is present, the newClassName is simply added.
         * @method replaceClass  
         * @param {String} oldClassName the class name to be replaced
         * @param {String} newClassName the class name that will be replacing the old class name
         * @return {Boolean | Array} A pass/fail boolean or array of booleans
         */
        replaceClass: function(newC, oldC) {
            //Y.log('replaceClass replacing ' + oldC + ' with ' + newC, 'info', 'Node');
        
            if ( !this.hasClass(oldC) ) {
                this.addClass(newC); // just add it if nothing to replace
                return; // NOTE: return
            }
        
            var re = getRegExp('(?:^|\\s+)' + oldC + '(?:\\s+|$)');
            this.set('className', this.get('className').replace(re, ' ' + newC + ' '));

            if ( this.hasClass(oldC) ) { // in case of multiple adjacent
                this.replaceClass(oldC, newC);
            }

            this.set('className', Y.lang.trim(this.get('className'))); // remove any trailing spaces
        },

        /**
         * Returns the previous sibling that is an HTMLElement. 
         * Returns the nearest HTMLElement sibling if no method provided.
         * @method getPreviousSiblingBy
         * @param {Function} method A boolean function used to test siblings
         * that receives the sibling node being tested as its only argument
         * @return {Node} Node instance or null if not found
         */
        previousSibling: function(method) {
            var node = this;
            while (node) {
                node = node.get('previousSibling');
                if ( node && node.get('nodeType') === 1 ) {
                    return node;
                }
            }
            return null;
        }, 

        /**
         * Returns the next HTMLElement sibling that passes the boolean method. 
         * Returns the nearest HTMLElement sibling if no method provided.
         * @method getNextSiblingBy
         * @param {Function} method A boolean function used to test siblings
         * that receives the sibling node being tested as its only argument
         * @return {Object} HTMLElement or null if not found
         */
        nextSibling: function(method) {
            var node = this;
            while (node) {
                node = node.get('nextSibling');
                if ( node && node.get('nodeType') === 1 ) {
                    return node;
                }
            }
            return null;
        },
        
        /**
         * Determines whether an HTMLElement is an ancestor of another HTML element in the DOM hierarchy.
         * @method contains
         * @param {String | HTMLElement} needle The possible descendent
         * @return {Boolean} Whether or not this node is an ancestor of needle
         */
        contains: function(needle) {
            if (this.hasMethod('contains'))  {
                return this.invoke('contains', this, needle);
            } else if ( this.hasMethod('compareDocumentPosition') ) { // gecko
                return !!(this.invoke('compareDocumentPosition', this, needle) & 16);
            }
        },

        /**
         * Gets the current position of an element based on page coordinates. 
         * Element must be part of the DOM tree to have page coordinates
         * (display:none or elements not appended return false).
         * @method getXY
         * @return {Array} The XY position of the element

         TODO: test inDocument/display
         */
        getXY: function() {
            if (Y.Doc.get().get('documentElement').getBoundingClientRect) {
                return function() {
                    var doc = this.get('ownerDocument'),
                        body = doc.get('body');
                        scrollLeft = Math.max(doc.get('scrollLeft'), body.get('scrollLeft')),
                        scrollTop = Math.max(doc.get('scrollTop'), body.get('scrollTop')),
                        box = this.invoke('getBoundingClientRect'),
                        xy = [box.left, box.top];

                    if ((scrollTop || scrollLeft) && this.getStyle('position') != 'fixed') { // no scroll accounting for fixed
                        xy[0] += scrollLeft;
                        xy[1] += scrollTop;
                    }
                    return xy;
                };
            } else {
                return function(xy) { // manually calculate by crawling up offsetParents
                    var xy = [this.get('offsetLeft'), this.get('offsetTop')];

                    var parentNode = this;
                    while (parentNode = parentNode.get('offsetParent')) {
                        xy[0] += parentNode.get('offsetLeft');
                        xy[1] += parentNode.get('offsetTop');
                    }

                    // account for any scrolled ancestors
                    if (this.getStyle('position') != 'fixed') {
                        parentNode = this;
                        var scrollTop, scrollLeft;

                        while (parentNode = parentNode.get('parentNode')) {
                            scrollTop = parentNode.get('scrollTop');
                            scrollLeft = parentNode.get('scrollLeft');

                            if (scrollTop || scrollLeft) {
                                xy[0] -= scrollLeft;
                                xy[1] -= scrollTop;
                            }
                        }

                    }
                    return xy;
                };
            }
        }(),// NOTE: Executing for loadtime branching

        /**
         * Set the position of an html element in page coordinates, regardless of how the element is positioned.
         * The element(s) must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method setXY
         * @param {Array} xy Contains X & Y values for new position (coordinates are page-based)
         * @param {Boolean} noRetry By default we try and set the position a second time if the first fails
         */
        setXY: function(xy, noRetry) {
            var pos = this.getStyle('position'),
                delta = [ // assuming pixels; if not we will have to retry
                    parseInt( this.getStyle('left'), 10 ),
                    parseInt( this.getStyle('top'), 10 )
                ];
        
            if (pos == 'static') { // default to relative
                pos = 'relative';
                this.setStyle('position', pos);
            }

            var currentXY = this.getXY();
            if (currentXY === false) { // has to be part of doc to have xy
                YAHOO.log('xy failed: node not available', 'error', 'Node');
                return false; 
            }
            
            if ( isNaN(delta[0]) ) {// in case of 'auto'
                delta[0] = (pos == 'relative') ? 0 : this.get('offsetLeft');
            } 
            if ( isNaN(delta[1]) ) { // in case of 'auto'
                delta[1] = (pos == 'relative') ? 0 : this.get('offsetTop');
            } 

            if (pos[0] !== null) {
                this.setStyle('left', xy[0] - currentXY[0] + delta[0] + 'px');
            }

            if (pos[1] !== null) {
                this.setStyle('top', xy[1] - currentXY[1] + delta[1] + 'px');
            }
          
            if (!noRetry) {
                var newXY = this.getXY();

                // if retry is true, try one more time if we miss 
               if ( (xy[0] !== null && newXY[0] != xy[0]) || 
                    (xy[1] !== null && newXY[1] != xy[1]) ) {
                   this.setXY(xy, true);
               }
            }        

            YAHOO.log('setXY setting position to ' + xy, 'info', 'Node');
        }
    
    };

    Y.mix(Y.Node, NodeExtras, 0, null, 4);

}, '3.0.0');
YAHOO.register("node", YAHOO.util.Node, {version: "@VERSION@", build: "@BUILD@"});
