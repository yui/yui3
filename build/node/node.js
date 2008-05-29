/**
 * The selector module provides helper methods allowing CSS3 Selectors to be used with DOM elements.
 * @module selector
 * @title Selector Utility
 * @requires yahoo, dom
 */

YUI.add('selector', function(Y) {
/**
 * Provides helper methods for collecting and filtering DOM elements.
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
    document: Y.config.doc,
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
            for (var i = 0, len = nodes.length; i < len; ++i) {
                if (!nodes[i].tagName) { // tagName limits to HTMLElements 
                    node = Selector.document.getElementById(nodes[i]);
                    if (node) { // skip IDs that return null 
                        nodes[i] = node;
                    } else {
                    }
                }
            }
        }
        result = rFilter(nodes, tokenize(selector)[0]);
        clearParentCache();
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
    if (document.documentElement.contains && !Y.UA.webkit < 422)  { // IE & Opera, Safari < 3 contains is broken
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
    for (var i = 0, len = foundCache.length; i < len; ++i) {
        try { // IE no like delete
            delete foundCache[i]._found;
        } catch(e) {
            foundCache[i].removeAttribute('_found');
        }
    }
    foundCache = [];
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
                if (!Y.Object.owns(patterns, re)) {
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
        if (!Y.Object.owns(shorthand, re)) {
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

if (Y.UA.ie) { // rewrite class for IE (others use getAttribute('class')
    Y.Selector.attrAliases['class'] = 'className';
    Y.Selector.attrAliases['for'] = 'htmlFor';
}

}, '3.0.0');
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
        NODE_TYPE = 'nodeType',
        COMPAT_MODE = 'compatMode',
        PARENT_NODE = 'parentNode',
        SCROLL_TOP = 'scrollTop',
        SCROLL_LEFT = 'scrollLeft',
        COMPARE_DOCUMENT_POSITION = 'compareDocumentPosition',
        CONTAINS = 'contains';

    var RE_VALID_PROP_TYPES = /(?:string|boolean|number)/;

    var Selector = Y.Selector;
    var _instances = {};
    var _nodes = {};
    var _styles = {};
    var _restrict = null;

    // private factory
    var wrap = function(node) {
        var ret = null;

        if (node && NODE_TYPE in node) {
/*
            var instance = _instances[node.id];
            if (instance) {
                if (node === _nodes[instance._yuid]) {
                    ret = instance; // reuse existing Nodes if nodes match
                }
            }
*/
            ret = new Node(node);
        } else if (node && ('item' in node || 'push' in node) && 'length' in node) {
            ret = new NodeList(node);
        }

        return ret;
    };

    var getDoc = function(node) {
        node = _nodes[node._yuid];
        return (node[NODE_TYPE] === 9) ? node : node[OWNER_DOCUMENT];
    };

    // returns HTMLElement
    var getDOMNode = function(node) {
        if (node && !node.nodeType && node._yuid) {
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
         * Returns a NodeList instance. 
         * @property children
         * @type NodeList
         */
        'children': function(node) {
            node = _nodes[node._yuid];
            var children = node.children;

            if (children === undefined) {
                var childNodes = node.childNodes;
                children = [];

                for (var i = 0, len = childNodes.length; i < len; ++i) {
                    if (childNodes[i].tagName) {
                        children[children.length] = childNodes[i];
                    }
                }
            }
            return children;
        },

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
         * @property offsetParent
         * @type Node
         */
        'offsetParent': ELEMENT_NODE,

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
        'body': DOCUMENT_NODE,

        // form
        /**
         * Returns a NodeList instance. 
         * @property elements
         * @type NodeList
         */
        'elements': ELEMENT_NODE,

        /**
         * Returns a NodeList instance. 
         * @property options
         * @type NodeList
         */
        'options': ELEMENT_NODE,


        // table
        /**
         * Returns a NodeList instance. 
         * @property rows
         * @type NodeList
         */
        'rows': ELEMENT_NODE,

        /**
         * Returns a NodeList instance. 
         * @property cells
         * @type NodeList
         */
        'cells': ELEMENT_NODE,

        /**
         * Returns a Node instance. 
         * @property tHead
         * @type Node
         */
        'tHead': ELEMENT_NODE,

        /**
         * Returns a Node instance. 
         * @property tFoot
         * @type Node
         */
        'tFoot': ELEMENT_NODE,

        /**
         * Returns a NodeList instance. 
         * @property tBodies
         * @type NodeList
         */
        'tBodies': ELEMENT_NODE
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
        'getBoundingClientRect': true
    };

    var Node = function(node) {
        if (!node || !node[NODE_TYPE]) {
            return null;
        }

        if (!node.id) {
            //node.id = Y.guid();
        }

        _nodes[Y.stamp(this)] = node;
        _styles[Y.stamp(this)] = node.style;
        //_instances[node.id] = this;

    };

    var getWinSize = function(node) {
        var doc = getDoc(node),
            win = doc[DEFAULT_VIEW] || doc[PARENT_WINDOW],
            mode = doc[COMPAT_MODE],
            height = win.innerHeight,
            width = win.innerWidth,
            root = doc[DOCUMENT_ELEMENT];
    
        if ( mode && !Y.UA.opera ) { // IE, Gecko
            if (mode != 'CSS1Compat') { // Quirks
                root = doc.body; 
            }
            height = root.clientHeight;
            width = root.clientWidth;
        }
        return { 'height': height, 'width': width }; 
    };

    var getDocSize = function(node) {
        var doc = getDoc(node),
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
            return h;
        },

        /**
         * Returns the inner width of the viewport (exludes scrollbar). 
         * @property winWidth
         * @type String
         */
        'winWidth': function(node) {
            var w = getWinSize(node).width;
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
            var doc = getDoc(node);
            return Math.max(doc[DOCUMENT_ELEMENT][SCROLL_LEFT], doc.body[SCROLL_LEFT]);
        },

        /**
         * Amount page has been scroll horizontally 
         * @property docScrollY
         * @type Number
         */
        'docScrollY':  function(node) {
            var doc = getDoc(node);
            return Math.max(doc[DOCUMENT_ELEMENT][SCROLL_TOP], doc.body[SCROLL_TOP]);
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
        getById: function(id) {
            var node = getDoc(this).getElementById(id);
            var root = _nodes[this._yuid];

            // contrain to root unless doc
            if ( root[NODE_TYPE] !== 9 && !this[CONTAINS](node)) {
                node = null;
            }

            return wrap(node);
        },

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
            if (prop in GETTERS) { // use custom getter
                val = GETTERS[prop](this, prop); // passing Node instance
            } else if (prop in PROPS_WRAP) { // wrap DOM object (HTMLElement, HTMLCollection, Document)
                if (Y.Lang.isFunction(PROPS_WRAP[prop])) {
                    val = PROPS_WRAP[prop](this);
                } else {
                    val = node[prop];
                }

                if (_restrict && _restrict[this._yuid] && !contains(node, val)) {
                    val = null; // not allowed to go outside of root node
                } else {
                    val = wrap(val);
                }
            } else if (RE_VALID_PROP_TYPES.test(typeof node[prop])) { // safe to read
                val = node[prop];
            }
            return val;
        },

        invoke: function(method, a, b, c, d, e) {
            if (a) { // first 2 may be Node instances or strings
                a = (a[NODE_TYPE]) ? a : getDOMNode(a);
                if (b) {
                    b = (b[NODE_TYPE]) ? b : getDOMNode(b);
                }
            }
            var node = _nodes[this._yuid];
            if (node && METHODS_INVOKE[method] && node[method]) {
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
            var node = _nodes[this._yuid] || {};
            return node.id || node[NODE_NAME] || 'undefined node';
        },

        /**
         * Retrieves a single node based on the given CSS selector. 
         * @method query
         *
         * @param {string} selector The CSS selector to test against.
         * @return {Node} A Node instance for the matching HTMLElement.
         */
        query: function(selector) {
            return wrap(Selector.query(selector, _nodes[this._yuid], true));
        },

        /**
         * Retrieves a nodeList based on the given CSS selector. 
         * @method queryAll
         *
         * @param {string} selector The CSS selector to test against.
         * @return {NodeList} A NodeList instance for the matching HTMLCollection/Array.
         */
        queryAll: function(selector) {
            return wrap(Selector.query(selector, _nodes[this._yuid]));
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
         * @method setStyle
         * @param {String} attr The style attribute to set. 
         * @param {String|Number} val The value. 
         */
        setStyle: function(attr, val) {
             _styles[this._yuid][attr] = val;
            return this;
        },

        /**
         * Sets multiple style properties.
         * @method setStyles
         * @param {Object} hash An object literal of property:value pairs. 
         */
        setStyles: function(hash) {
            Y.each(hash, function(v, n) {
                this.setStyle(n, v);
            }, this);
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
            refNode = refNode[NODE_TYPE] ? refNode : _nodes[refNode._yuid];
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
                    return node;
                }
            } 

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
        },

        /**
         * Determines whether an HTMLElement is an ancestor of another HTML element in the DOM hierarchy.
         * @method contains
         * @param {String | HTMLElement} needle The possible descendent
         * @return {Boolean} Whether or not this node is an ancestor of needle
         */
        contains: function(needle) {
            node = _nodes[this._yuid];
            needle = getDOMNode(needle);
            return contains(node, needle);
        },

        plug: function(PluginClass, config) {
            config = config || {};
            config.owner = this;
            if (PluginClass && PluginClass.NS) {
                this[PluginClass.NS] = new PluginClass(config);
            }
        }
    };

    var contains = function(node, needle) {
        var ret = false;

        if (!needle || !node) {
            ret = false;
        } else if (node[CONTAINS])  {
            ret = node[CONTAINS](needle);
        } else if (node[COMPARE_DOCUMENT_POSITION]) { // gecko
            if (node === needle || !!(node[COMPARE_DOCUMENT_POSITION](needle) & 16)) { 
                ret = true;
            }
        }

        return ret;

    };

    var slice = [].slice;
    Y.each(METHODS, function(fn, method) {
        Node.prototype[method] = function() {
            return fn.apply(this, [method].concat(slice.call(arguments)));
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

        if (Y.Lang.isString(jsonml)) { // text node
            return jsonml;
        }

        if (!jsonml || !jsonml.push) { // isArray
            return ''; // expecting array 
        }

        var tag = jsonml[0];
        if (!Y.Lang.isString(tag)) {
            return null; // bad tag error
        }

        var tmpAtt;
        for (var i = 1, len = jsonml.length; i < len; ++i) {
            if (typeof jsonml[i] === 'string' || jsonml[i].push) {
                html[html.length] = _createHTML(jsonml[i]);
            } else if (typeof jsonml[i] == 'object') {
                for (var attr in jsonml[i]) {
                    tmpAtt = (attr != 'className') ? attr : 'class';

                    if (jsonml[i].hasOwnProperty(attr)) {
                        att[att.length] = ' ' + tmpAtt + '="' + jsonml[i][attr] + '"';
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
        return wrap(_createNode(jsonml));
    };

    Node.getById = function(id, doc) {
        doc = (doc && doc[NODE_TYPE]) ? doc : Y.config.doc;
        return wrap(doc.getElementById(id));
    };

    /**
     * Retrieves a Node instance for the given object/string. 
     * @method get
     *
     * Use 'document' string to retrieve document Node instance from string
     * @param {document|HTMLElement|HTMLCollection|Array|String} node The object to wrap.
     * @param {document|Node} doc optional The document containing the node. Defaults to current document.
     * @param {boolean} isRoot optional Whether or not this node should be treated as a root node. Root nodes
     * aren't allowed to traverse outside their DOM tree.
     * @return {Node} A wrapper instance for the supplied object.
     */
    Node.get = function(node, doc, isRoot) {
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

        node = wrap(node);

        if (isRoot) {
            _restrict = _restrict || {};
            _restrict[node._yuid] = node;
        }

        return node;
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
        // TODO: input validation
        _nodes[Y.stamp(this)] = nodes;
    };

    // used to call Node methods against NodeList nodes
    var _tmpNode = Node.create('<div></div>');

    NodeList.prototype = {};

    Y.each(Node.prototype, function(fn, method) {
        var ret;
        var a = [];
        NodeList.prototype[method] = function() {
            var nodes = _nodes[this._yuid];
            var node = _tmpNode;
            if (typeof method == 'function') {
                for (var i = 0, len = nodes.length; i < len; ++i) {
                    _nodes[node._yuid] = nodes[i];
                    ret = node[method].apply(node, arguments);
                    if (ret !== undefined) {
                        a[i] = ret;
                    }
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
            var node = _tmpNode;
            for (var i = 0, len = nodes.length; i < len; ++i) {
                _nodes[node._yuid] = nodes[i];
                node.set(name, val);
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
            var node = _tmpNode;
            var ret = [];
            for (var i = 0, len = nodes.length; i < len; ++i) {
                ret[i] = node.get(name);
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
            return wrap(Selector.filter(_nodes[this._yuid], selector));
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
            var node = _tmpNode; // reusing single instance for each node
            for (var i = 0, len = nodes.length; i < len; ++i) {
                _nodes[node._yuid] = nodes[i]; // remap Node instance to current node
                fn.call(context, node, i, this);
            }
            return this;
        },

        /**
         * Returns the current number of items in the NodeList.
         * @method size
         * @return {Int} The number of items in the NodeList. 
         */
        size: function() {
            return _nodes[this._yuid].length;
        },

        toString: function() {
            var node = _nodes[this._yuid] || [];
            return 'NodeList (' + node.length + ' items)';
        }

    }, true);

    Y.Node = Node;
    Y.NodeList = NodeList;
}, '3.0.0', { requires: ['selector'] });
/**
 * Extended interface for Node
 * @module nodeextras
 */

YUI.add('nodeextras', function(Y) {

    /**
     * An interface for advanced DOM features.
     * @interface NodeExtras
     */

    var CLASS_NAME = 'className',
        OFFSET_TOP = 'offsetTop',
        POSITION = 'position',
        FIXED = 'fixed',
        RELATIVE = 'relative',
        LEFT = 'left',
        TOP = 'top',
        NODE_TYPE = 'nodeType',
        OFFSET_LEFT = 'offsetLeft',
        GET_BOUNDING_CLIENT_RECT = 'getBoundingClientRect',
        COMPARE_DOCUMENT_POSITION = 'compareDocumentPosition';

    var regexCache = {};
    var getRegExp = function(str, flags) {
        flags = flags || '';
        if (!regexCache[str + flags]) {
            regexCache[str + flags] = new RegExp(str, flags);
        }
        return regexCache[str + flags];
    };

    Y.Node.getters({
        /**
         * Normalizes nodeInnerText and textContent. 
         * @property text
         * @type String
         */
        'text': function(node) {
            return node.get('innerText') || node.get('textContent') || '';
        }
    });

    Y.Node.methods({
        /**
         * Determines whether an HTMLElement has the given className.
         * @method hasClass
         * @param {String} className the class name to search for
         * @return {Boolean | Array} A boolean value or array of boolean values
         */
        hasClass: function(node, className) {
            var re = getRegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
            return re.test(node.get(CLASS_NAME));
        },

        /**
         * Adds a class name to a given element or collection of elements.
         * @method addClass         
         * @param {String} className the class name to add to the class attribute
         * @return {Boolean | Array} A pass/fail boolean or array of booleans
         */
        addClass: function(node, className) {
            if (node.hasClass(className)) {
                return; // already present
            }
            
            
            node.set(CLASS_NAME, Y.Lang.trim([node.get(CLASS_NAME), className].join(' ')));
        },

        /**
         * Removes a class name from a given element or collection of elements.
         * @method removeClass         
         * @param {String} className the class name to remove from the class attribute
         * @return {Boolean | Array} A pass/fail boolean or array of booleans
         */
        removeClass: function(node, className) {
            if (!className || !node.hasClass(className)) {
                return; // not present
            }                 

            
            node.set(CLASS_NAME,
                    Y.Lang.trim(node.get(CLASS_NAME).replace(getRegExp('(?:^|\\s+)' +
                            className + '(?:\\s+|$)'), ' ')));

            if ( node.hasClass(className) ) { // in case of multiple adjacent
                node.removeClass(className);
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
        replaceClass: function(node, newC, oldC) {
        
            if ( !node.hasClass(oldC) ) {
                node.addClass(newC); // just add it if nothing to replace
                return; // NOTE: return
            }
        
            var re = getRegExp('(?:^|\\s+)' + oldC + '(?:\\s+|$)');
            node.set(CLASS_NAME, node.get(CLASS_NAME).replace(re, ' ' + newC + ' '));

            if ( node.hasClass(oldC) ) { // in case of multiple adjacent
                node.replaceClass(oldC, newC);
            }

            node.set(CLASS_NAME, Y.Lang.trim(node.get(CLASS_NAME))); // remove any trailing spaces
        },

        /**
         * Returns the previous sibling that is an HTMLElement. 
         * Returns the nearest HTMLElement sibling if no method provided.
         * @method previous
         * @param {Function} method A boolean function used to test siblings
         * that receives the sibling node being tested as its only argument
         * @return {Node} Node instance or null if not found
         */
        previous: function(node, method) {
            while (node) {
                node = node.get('previousSibling');
                if ( node && node.get(NODE_TYPE) === 1 ) {
                    if (!method || method(node)) {
                        return node;
                    }
                }
            }
            return null;
        }, 

        /**
         * Returns the next HTMLElement sibling that passes the boolean method. 
         * Returns the nearest HTMLElement sibling if no method provided.
         * @method next
         * @param {Function} method A boolean function used to test siblings
         * that receives the sibling node being tested as its only argument
         * @return {Object} HTMLElement or null if not found
         */
        next: function(node, method) {
            while (node) {
                node = node.get('nextSibling');
                if ( node && node.get(NODE_TYPE) === 1 ) {
                    if (!method || method(node)) {
                        return node;
                    }
                }
            }
            return null;
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
            if (Y.Node.get('document').get('documentElement').hasMethod(GET_BOUNDING_CLIENT_RECT)) {
                return function(node) {
                    var scrollLeft = node.get('docScrollX');
                        scrollTop = node.get('docScrollY');
                        box = node.invoke(GET_BOUNDING_CLIENT_RECT),
                        xy = [box[LEFT], box[TOP]];

                    if ((scrollTop || scrollLeft) && node.getStyle(POSITION) != FIXED) { // no scroll accounting for fixed
                        xy[0] += scrollLeft;
                        xy[1] += scrollTop;
                    }
                    return xy;
                };
            } else {
                return function(node) { // manually calculate by crawling up offsetParents
                    var xy = [node.get(OFFSET_LEFT), node.get(OFFSET_TOP)];

                    var parentNode = node;
                    while (parentNode = parentNode.get('offsetParent')) {
                        xy[0] += parentNode.get(OFFSET_LEFT);
                        xy[1] += parentNode.get(OFFSET_TOP);
                    }

                    // account for any scrolled ancestors
                    if (node.getStyle(POSITION) != FIXED) {
                        parentNode = node;
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
        setXY: function(node, xy, noRetry) {
            var pos = node.getStyle(POSITION),
                delta = [ // assuming pixels; if not we will have to retry
                    parseInt( node.getStyle(LEFT), 10 ),
                    parseInt( node.getStyle(TOP), 10 )
                ];
        
            if (pos == 'static') { // default to relative
                pos = RELATIVE;
                node.setStyle(POSITION, RELATIVE);
            }

            var currentXY = node.getXY();
            if (currentXY === false) { // has to be part of doc to have xy
                return false; 
            }
            
            if ( isNaN(delta[0]) ) {// in case of 'auto'
                delta[0] = (pos == RELATIVE) ? 0 : node.get(OFFSET_LEFT);
            } 
            if ( isNaN(delta[1]) ) { // in case of 'auto'
                delta[1] = (pos == RELATIVE) ? 0 : node.get(OFFSET_TOP);
            } 

            if (pos[0] !== null) {
                node.setStyle(LEFT, xy[0] - currentXY[0] + delta[0] + 'px');
            }

            if (pos[1] !== null) {
                node.setStyle(TOP, xy[1] - currentXY[1] + delta[1] + 'px');
            }
          
            if (!noRetry) {
                var newXY = node.getXY();

                // if retry is true, try one more time if we miss 
               if ( (xy[0] !== null && newXY[0] != xy[0]) || 
                    (xy[1] !== null && newXY[1] != xy[1]) ) {
                   node.setXY(xy, true);
               }
            }        

        }
    
    });

}, '3.0.0', { requires: ['node'] });
