YUI.add('dom', function(Y) {

var NODE_TYPE = 'nodeType',
    OWNER_DOCUMENT = 'ownerDocument',
    DOCUMENT_ELEMENT = 'documentElement',
    TAG_NAME = 'tagName',
    PARENT_NODE = 'parentNode',
    FIRST_CHILD = 'firstChild',
    LAST_CHILD = 'lastChild',
    PREVIOUS_SIBLING = 'previousSibling',
    NEXT_SIBLING = 'nextSibling',
    OFFSET_HEIGHT = 'offsetHeight',
    OFFSET_WIDTH = 'offsetWidth',
    CONTAINS = 'contains',
    COMPARE_DOCUMENT_POSITION = 'compareDocumentPosition',
    INNER_TEXT = 'innerText',
    TEXT_CONTENT = 'textContent',
    CLIENT_HEIGHT = 'clientHeight',
    CLIENT_WIDTH = 'clientWidth',
    LENGTH = 'length',
    STRING = 'string',
    UNDEFINED = undefined;

Y.DOM = {
    byId: function(id, doc) {
        doc = doc || Y.config.doc;
        return doc.getElementById(id);
    },

    getText: function(node) {
        var text = node[TEXT_CONTENT];
        if (text === UNDEFINED && INNER_TEXT in node) {
            text = text[INNER_TEXT];
        } 
        return text || '';
    },

    firstChild: function(node, fn) {
        return Y.DOM.elementByAxis(node[FIRST_CHILD], NEXT_SIBLING, fn);
    },

    firstChildByTag: function(node, tag, fn) {
        return Y.DOM.elementByAxis(node[FIRST_CHILD], NEXT_SIBLING, tag, fn);
    },

    lastChild: function(node, fn) {
        return Y.DOM.elementByAxis(node[LAST_CHILD], PREVIOUS_SIBLING, fn);
    },

    lastChildByTag: function(node, tag, fn) {
        return Y.DOM.elementByAxis(node[LAST_CHILD], PREVIOUS_SIBLING, tag, fn);
    },

    childrenByTag: function() {
        if (document[DOCUMENT_ELEMENT].children) {
            return function(node, tag, fn, toArray) {
                var nodes = node.children.tags(tag.toUpperCase()); 

                if (fn || toArray) {
                    fn = fn || function() { return true; };
                    nodes = Y.DOM.filterElementsBy(nodes, fn);
                }

                return nodes;
            };
        } else {
            return function(node, tag, fn) {
                tag = tag.toUpperCase();
                var nodes = node.childNodes;

                var wrapFn = function(el) {
                    return el[TAG_NAME].toUpperCase() === tag && (!fn || fn(el));
                };

                return Y.DOM.filterElementsBy(nodes, wrapFn);
            };
        }
    }(),

    children: function(node, fn) {
        return Y.DOM.childrenByTag(node, '*', fn);
    },

    filterByAttributes: function(nodes, attr, fn) { // Match one of space seperated words 
        var s = ' ',
            pass = false,
            retNodes = [];

        outer:
        for (var i = 0, len = nodes[LENGTH]; i < len; ++i) {
            for (var j = 0, attLen = attr[LENGTH]; j < attLen; ++j) {
                pass = false;
                if (attr[j][0] === 'class') {
                    attr[j][0] = 'className';                        
                }
                if (!nodes[i][attr[j][0]] || 
                        !( (s + nodes[i][attr[j][0]] + s).indexOf(s + attr[j][2] + s) > -1)) {
                    continue outer;
                }
                pass = true;
            }
            if ( fn && !fn(nodes[i]) ) {
                pass = false;
            }
            if (pass) {
                retNodes[retNodes[LENGTH]] = nodes[i];
            }
        }
        return retNodes;
    },

    // collection of nextSibling, previousSibling, parentNode
    elementsByAxis: function(node, axis, tag, fn) {
        tag = (tag) ? tag.toUpperCase() : null;
        var ret = [];

        while ((node = node[axis])) { // NOTE: assignment
            if (node[TAG_NAME]) {
                if ( (!tag || (tag && node[TAG_NAME].toUpperCase() === tag)) &&
                        (!fn || fn(node)) ) {

                    ret[ret[LENGTH]] = node;
                }
            }
        }
        return ret;
    },

    // nextSibling, previousSibling, parentNode
    elementByAxis: function(node, axis, tag, fn) {
        while ((node = node[axis])) { // NOTE: assignment
            if (node[TAG_NAME]) {
                if ( (!tag || (tag && node[TAG_NAME].toUpperCase() === tag)) &&
                        (!fn || fn(node)) ) {

                    return node;
                }
            }
        }
        return null;
    },

    byTag: function(tag, node, fn) {
        node = node || Y.config.doc;

        var nodes = node.getElementsByTagName(tag),
            retNodes = [];

        for (var i = 0, len = nodes[LENGTH]; i < len; ++i) {
            if ( !fn || fn(nodes[i]) ) {
                retNodes[retNodes[LENGTH]] = nodes[i];
            }
        }
        return retNodes;
    },

    filterElementsBy: function(nodes, fn, firstOnly) {
        var ret = nodes;
        if (fn) {
            ret = (firstOnly) ? null : [];
            for (var i = 0, len = nodes[LENGTH]; i < len; ++i) {
                if (nodes[i][TAG_NAME] && fn(nodes[i])) {
                    if (firstOnly) {
                        ret = nodes[i];
                        break;
                    } else {
                        ret[ret[LENGTH]] = nodes[i];
                    }
                }
            }
        }

        return ret;
    },

    contains: function(node, needle) {
        var ret = false;

        if (!needle || !node) {
            ret = false;
        } else if (node[CONTAINS])  {
            if (Y.UA.opera || needle[NODE_TYPE] === 1) { // IE & SAF contains fail if needle not an ELEMENT_NODE
                ret = node[CONTAINS](needle);
            } else {
                ret = Y.DOM._crawlContains(node, needle); 
            }
        } else if (node[COMPARE_DOCUMENT_POSITION]) { // gecko
            if (node === needle || !!(node[COMPARE_DOCUMENT_POSITION](needle) & 16)) { 
                ret = true;
            }
        }

        return ret;
    },

    _crawlContains: function(node, needle) {
        while (needle) {
            if (node === needle) {
                return true;
            }
            needle = needle.parentNode;
        }
        return false;
    },


    _getRegExp: function(str, flags) {
        flags = flags || '';
        Y.DOM._regexCache = Y.DOM._regexCache || {};
        if (!Y.DOM._regexCache[str + flags]) {
            Y.DOM._regexCache[str + flags] = new RegExp(str, flags);
        }
        return Y.DOM._regexCache[str + flags];
    }

};

/**
 * The selector module provides helper methods allowing CSS3 Selectors to be used with DOM elements.
 * @module selector
 * @title Selector Utility
 * @requires yahoo, dom
 */

/**
 * Provides helper methods for collecting and filtering DOM elements.
 * @class Selector
 * @static
 */

var ATTRIBUTES = 'attributes',
    PSEUDOS = 'pseudos',
    COMBINATOR = 'combinator',
    TAG = 'tag',
    PREVIOUS = 'previous',
    REPLACE = 'replace';

Y.Selector = {
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
        '~=': function(attr, val) { // Match one of space seperated words 
            var s = ' ';
            return (s + attr + s).indexOf((s + val + s)) > -1;
        },
        '|=': function(attr, val) { return Y.DOM._getRegExp('^' + val + '[-]?').test(attr); }, // Match start with value followed by optional hyphen
        '': function(attr, val) { return attr; } // Just test for existence of attribute
    },

    /**
     * List of pseudo-classes and corresponding boolean functions. 
     * These functions are called with the current node, and any value that was parsed with the pseudo regex.
     * @property pseudos
     * @type object
     */
    pseudos: {
        'first-child': function(node) {
            return Y.DOM.firstChild(node[PARENT_NODE]) === node;
        }
    },

    combinators: {
        ' ': function(node, token) {
            while ((node = node[PARENT_NODE])) {
                if (Y.Selector._rTestNode(node, '', token[PREVIOUS])) {
                    return true;
                }
            }  
            return false;
        },

        '>': function(node, token) {
            return Y.Selector._rTestNode(node[PARENT_NODE], null, token[PREVIOUS]);
        },

        '+': function(node, token) {
            var sib = node[PREVIOUS_SIBLING];
            while (sib && sib[NODE_TYPE] !== 1) {
                sib = sib[PREVIOUS_SIBLING];
            }

            if (sib && Y.Selector._rTestNode(sib, null, token[PREVIOUS])) {
                return true; 
            }
            return false;
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
        node = (typeof node === 'string') ? Y.Selector.document.getElementById(node) : node;

        if (!node) {
            return false;
        }

        var groups = selector ? selector.split(',') : [];
        if (groups[LENGTH]) {
            for (var i = 0, len = groups[LENGTH]; i < len; ++i) {
                if ( Y.Selector._rTestNode(node, groups[i]) ) { // passes if ANY group matches
                    return true;
                }
            }
            return false;
        }
        return Y.Selector._rTestNode(node, selector);
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
            result = [];

        if (!nodes.item) { // if not HTMLCollection, handle arrays of ids and/or nodes
            Y.log('filter: scanning input for HTMLElements/IDs', 'info', 'Selector');
            for (var i = 0, len = nodes[LENGTH]; i < len; ++i) {
                if (!nodes[i][TAG_NAME]) { // tagName limits to HTMLElements 
                    node = Y.Selector.document.getElementById(nodes[i]);
                    if (node) { // skip IDs that return null 
                        nodes[i] = node;
                    } else {
                        Y.log('filter: skipping invalid node', 'warn', 'Selector');
                    }
                }
            }
        }
        result = Y.Selector._rFilter(nodes, Y.Selector._tokenize(selector)[0]);
        Y.log('filter: returning:' + result[LENGTH], 'info', 'Selector');
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
        var result = Y.Selector._query(selector, root, firstOnly);
        Y.log('query: ' + selector + ' returning ' + result, 'info', 'Selector');
        return result;
    },

    _query: function(selector, root, firstOnly, deDupe) {
        var result =  (firstOnly) ? null : [];
        if (!selector) {
            return result;
        }

        var groups = selector.split(','); // TODO: handle comma in attribute/pseudo

        if (groups[LENGTH] > 1) {
            var found;
            for (var i = 0, len = groups[LENGTH]; i < len; ++i) {
                found = arguments.callee(groups[i], root, firstOnly, true);
                result = firstOnly ? found : result.concat(found); 
            }
            Y.Selector._clearFoundCache();
            return result;
        }

        if (typeof root === STRING) { // assume ID
            root = Y.Selector.document.getElementById(root);
            if (!root) {
                Y.log('invalid root node provided', 'warn', 'Selector');
                return result;
            }
        }

        root = root || Y.Selector.document;
        var tokens = Y.Selector._tokenize(selector);
        var idToken = tokens[Y.Selector._getIdTokenIndex(tokens)],
            nodes = [],
            node,
            id,
            token = tokens.pop() || {};
            
        if (idToken) {
            id = Y.Selector._getId(idToken[ATTRIBUTES]);
        }

        // use id shortcut when possible
        if (id) {
            node = Y.Selector.document.getElementById(id);

            if (node && (root[NODE_TYPE] == 9 || Y.DOM.contains(root, node))) {
                if ( Y.Selector._rTestNode(node, null, idToken) ) {
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

        if (root && !nodes[LENGTH]) {
            nodes = root.getElementsByTagName(token[TAG]);
        }

        if (nodes[LENGTH]) {
            result = Y.Selector._rFilter(nodes, token, firstOnly, deDupe); 
            //result = Y.DOM.filterByAttributes(nodes, token[ATTRIBUTES]);
        }
        return result;
    },

    _rFilter: function(nodes, token, firstOnly, deDupe) {
        var result = firstOnly ? null : [],
            foundCache = Y.Selector._foundCache;

        for (var i = 0, len = nodes[LENGTH]; i < len; i++) {
            if (! Y.Selector._rTestNode(nodes[i], '', token, deDupe)) {
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
                foundCache[foundCache[LENGTH]] = nodes[i];
            }

            result[result[LENGTH]] = nodes[i];
        }

        return result;
    },

    _rTestNode: function(node, selector, token, deDupe) {
        token = token || Y.Selector._tokenize(selector).pop() || {};
        var operators = Y.Selector.operators,
            pseudos = Y.Selector.pseudos,
            i, len;

        if (!node[TAG_NAME] ||
            (token[TAG] !== '*' && node[TAG_NAME].toUpperCase() !== token[TAG]) ||
            (deDupe && node._found) ) {
            return false;
        }

        if (token[ATTRIBUTES][LENGTH]) {
            var attribute;
            for (i = 0, len = token[ATTRIBUTES][LENGTH]; i < len; ++i) {
                attribute = node.getAttribute(token[ATTRIBUTES][i][0], 2);
                if (attribute === UNDEFINED) {
                    return false;
                }
                if ( operators[token[ATTRIBUTES][i][1]] &&
                        !operators[token[ATTRIBUTES][i][1]](attribute, token[ATTRIBUTES][i][2])) {
                    return false;
                }
            }
        }

        if (token[PSEUDOS][LENGTH]) {
            for (i = 0, len = token[PSEUDOS][LENGTH]; i < len; ++i) {
                if (pseudos[token[PSEUDOS][i][0]] &&
                        !pseudos[token[PSEUDOS][i][0]](node, token[PSEUDOS][i][1])) {
                    return false;
                }
            }
        }

        return (token[PREVIOUS] && token[PREVIOUS][COMBINATOR] !== ',') ?
                Y.Selector.combinators[token[PREVIOUS][COMBINATOR]](node, token) :
                true;
    },

    _foundCache: [],

    _clearFoundCache: function() {
        var foundCache = Y.Selector._foundCache;
        Y.log('getBySelector: clearing found cache of ' + foundCache[LENGTH] + ' elements');
        for (var i = 0, len = foundCache[LENGTH]; i < len; ++i) {
            try { // IE no like delete
                delete foundCache[i]._found;
            } catch(e) {
                foundCache[i].removeAttribute('_found');
            }
        }

        foundCache = [];
        Y.log('getBySelector: done clearing foundCache');
    },

    _getId: function(attr) {
        for (var i = 0, len = attr[LENGTH]; i < len; ++i) {
            if (attr[i][0] == 'id' && attr[i][1] === '=') {
                return attr[i][2];
            }
        }
    },

    _getIdTokenIndex: function(tokens) {
        for (var i = 0, len = tokens[LENGTH]; i < len; ++i) {
            if (Y.Selector._getId(tokens[i][ATTRIBUTES])) {
                return i;
            }
        }
        return -1;
    },

    _patterns: {
        tag: /^((?:-?[_a-z]+[\-\w]*)|\*)/i,
        attributes: /^\[([a-z]+\w*)+([~\|\^\$\*!=]=?)?['"]?([^\]]*?)['"]?\]/i,
        //attributes: /^\[([a-z]+\w*)+([~\|\^\$\*!=]=?)?['"]?([^'"\]]*)['"]?\]*/i,
        pseudos: /^:([\-\w]+)(?:\(['"]?(.+)['"]?\))*/i,
        combinator: /^\s*([>+~]|\s)\s*/
    },

    /**
        Break selector into token units per simple selector.
        Combinator is attached to left-hand selector.
     */
    _tokenize: function(selector) {
        var token = {},     // one token per simple selector (left selector holds combinator)
            tokens = [],    // array of tokens
            found = false,  // whether or not any matches were found this pass
            patterns = Y.Selector._patterns,
            match;          // the regex match

        selector = Y.Selector._replaceShorthand(selector); // convert ID and CLASS shortcuts to attributes

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
                if (patterns.hasOwnProperty(re)) {
                    if (re != TAG && re != COMBINATOR) { // only one allowed
                        token[re] = token[re] || [];
                    }
                    if ((match = patterns[re].exec(selector))) { // note assignment
                        found = true;
                        if (re != TAG && re != COMBINATOR) { // only one allowed
                            //token[re] = token[re] || [];

                            // capture ID for fast path to element
                            if (re === 'attributes' && match[1] === 'id') {
                                token.id = match[3];
                            }

                            token[re].push(match.slice(1));
                        } else { // single selector (tag, combinator)
                            token[re] = match[1];
                        }
                        selector = selector[REPLACE](match[0], ''); // strip current match from selector
                        if (re === COMBINATOR || !selector[LENGTH]) { // next token or done
                            token[ATTRIBUTES] = Y.Selector._fixAttributes(token[ATTRIBUTES]);
                            token[PSEUDOS] = token[PSEUDOS] || [];
                            token[TAG] = token[TAG] ? token[TAG].toUpperCase() : '*';
                            tokens.push(token);

                            token = { // prep next token
                                previous: token
                            };
                        }
                    }
                }
            }
        } while (found);

        return tokens;
    },

    _fixAttributes: function(attr) {
        var aliases = Y.Selector.attrAliases;
        attr = attr || [];
        for (var i = 0, len = attr[LENGTH]; i < len; ++i) {
            if (aliases[attr[i][0]]) { // convert reserved words, etc
                attr[i][0] = aliases[attr[i][0]];
            }
            if (!attr[i][1]) { // use exists operator
                attr[i][1] = '';
            }
        }
        return attr;
    },

    _replaceShorthand: function(selector) {
        var shorthand = Y.Selector.shorthand,
            patterns = Y.Selector._patterns,
            attrs = selector.match(patterns[ATTRIBUTES]); // pull attributes to avoid false pos on "." and "#"

        if (attrs) {
            selector = selector[REPLACE](patterns[ATTRIBUTES], 'REPLACED_ATTRIBUTE');
        }
        for (var re in shorthand) {
            if (shorthand.hasOwnProperty(re)) {
                selector = selector[REPLACE](Y.DOM._getRegExp(re, 'gi'), shorthand[re]);
            }
        }

        if (attrs) {
            for (var i = 0, len = attrs[LENGTH]; i < len; ++i) {
                selector = selector[REPLACE]('REPLACED_ATTRIBUTE', attrs[i]);
            }
        }
        return selector;
    }

};


if (Y.UA.ie) { // rewrite class for IE (others use getAttribute('class')
    Y.Selector.attrAliases['class'] = 'className';
    Y.Selector.attrAliases['for'] = 'htmlFor';
}


var CLASS_NAME = 'className';

Y.mix(Y.DOM, {
    /**
     * Determines whether an HTMLElement has the given className.
     * @method hasClass
     * @param {String} className the class name to search for
     * @return {Boolean | Array} A boolean value or array of boolean values
     */
    hasClass: function(node, className) {
        var re = Y.DOM._getRegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
        return re.test(node[CLASS_NAME]);
    },

    /**
     * Adds a class name to a given element or collection of elements.
     * @method addClass         
     * @param {String} className the class name to add to the class attribute
     * @return {Boolean | Array} A pass/fail boolean or array of booleans
     */
    addClass: function(node, className) {
        if (!Y.DOM.hasClass(node, className)) { // skip if already present 
            node[CLASS_NAME] = Y.Lang.trim([node[CLASS_NAME], className].join(' '));
        }
    },

    /**
     * Removes a class name from a given element or collection of elements.
     * @method removeClass         
     * @param {String} className the class name to remove from the class attribute
     * @return {Boolean | Array} A pass/fail boolean or array of booleans
     */
    removeClass: function(node, className) {
        if (className && Y.DOM.hasClass(node, className)) {
            node[CLASS_NAME] = Y.Lang.trim(node[CLASS_NAME].replace(Y.DOM._getRegExp('(?:^|\\s+)' +
                            className + '(?:\\s+|$)'), ' '));

            if ( Y.DOM.hasClass(node, className) ) { // in case of multiple adjacent
                Y.DOM.removeClass(node, className);
            }

            //Y.log('removeClass removing ' + className, 'info', 'Node');
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
    replaceClass: function(node, oldC, newC) {
        //Y.log('replaceClass replacing ' + oldC + ' with ' + newC, 'info', 'Node');
        Y.DOM.addClass(node, newC);
        Y.DOM.removeClass(node, oldC);
    },

    /**
     * If the className exists on the node it is removed, if it doesn't exist it is added.
     * @method toggleClass  
     * @param {String} className the class name to be toggled
     */
    toggleClass: function(node, className) {
        if (Y.DOM.hasClass(node, className)) {
            Y.DOM.removeClass(node, className);
        } else {
            Y.DOM.addClass(node, className);
        }
    }
});

var TO_STRING = 'toString',
    RE = RegExp,
    re_color = /color$/i,
    re_rgb = /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,
    re_hex = /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,
    re_hex3 = /([0-9A-F])/gi;

Y.Color = {
    KEYWORDS: {
        black: '000',
        silver: 'c0c0c0',
        gray: '808080',
        white: 'fff',
        maroon: '800000',
        red: 'f00',
        purple: '800080',
        fuchsia: 'f0f',
        green: '008000',
        lime: '0f0',
        olive: '808000',
        yellow: 'ff0',
        navy: '000080',
        blue: '00f',
        teal: '008080',
        aqua: '0ff'
    },

    toRGB: function(val) {
        val = Y.Color.toHex(val);

        if(re_hex.exec(val)) {
            val = 'rgb(' + [
                parseInt(RE.$1, 16),
                parseInt(RE.$2, 16),
                parseInt(RE.$3, 16)
            ].join(', ') + ')';
        }
        return val;
    },

    toHex: function(val) {
        val = Y.Color.KEYWORDS[val] || val;
        if (re_rgb.exec(val)) {
            val = [
                Number(RE.$1)[TO_STRING](16),
                Number(RE.$2)[TO_STRING](16),
                Number(RE.$3)[TO_STRING](16)
            ].join('');
        }

        if (val[LENGTH] < 6) {
            val = val.replace(re_hex3, '$1$1');
        }

        return (val.indexOf('#') < 0 ? val = '#' + val : val).toLowerCase();
    }
};

var DEFAULT_VIEW = 'defaultView',
    STYLE = 'style',
    FLOAT = 'float',
    CSS_FLOAT = 'cssFloat',
    STYLE_FLOAT = 'styleFloat',
    TRANSPARENT = 'transparent',
    VISIBLE = 'visible',
    WIDTH = 'width',
    HEIGHT = 'height',
    GET_COMPUTED_STYLE = 'getComputedStyle',

    DOCUMENT = Y.config.doc,
    DOM = Y.DOM;


Y.mix(DOM, {
    CUSTOM_STYLES: {},

    setStyle: function(node, att, val) {
        var style = node[STYLE],
            CUSTOM_STYLES = Y.DOM.CUSTOM_STYLES;
        if (style) {
            if (CUSTOM_STYLES[att]) {
                if (CUSTOM_STYLES[att].set) {
                    CUSTOM_STYLES[att].set(node, val, style);
                    return; // NOTE: return
                } else {
                    att = CUSTOM_STYLES[att];
                }
            }
            node[STYLE][att] = val; 
        }
    },

    getStyle: function(node, att) {
        var style = node[STYLE],
            CUSTOM_STYLES = Y.DOM.CUSTOM_STYLES;
        if (CUSTOM_STYLES[att]) {
            if (style && CUSTOM_STYLES[att].get) {
                return CUSTOM_STYLES[att].get(node, att, style); // NOTE: return
            } else {
                att = CUSTOM_STYLES[att];
            }
        }

        var val = style ? style[att] : UNDEFINED;
        if (val === '') { // TODO: is empty string sufficient?
            val = DOM[GET_COMPUTED_STYLE](node, att);
        }

        return val;
    },

    getComputedStyle: function(node, att) {
        var view = node[OWNER_DOCUMENT][DEFAULT_VIEW];
        return view[GET_COMPUTED_STYLE](node, '')[att];
    }
});

if (DOCUMENT[DOCUMENT_ELEMENT][STYLE][CSS_FLOAT] !== UNDEFINED) {
    Y.DOM.CUSTOM_STYLES[FLOAT] = CSS_FLOAT;
} else if (DOCUMENT[DOCUMENT_ELEMENT][STYLE][STYLE_FLOAT] !== UNDEFINED) {
    Y.DOM.CUSTOM_STYLES[FLOAT] = STYLE_FLOAT;
}

if (Y.UA.opera) { // opera defaults to hex instead of RGB
    DOM[GET_COMPUTED_STYLE] = function(node, att) {
        var view = node[OWNER_DOCUMENT][DEFAULT_VIEW],
            val = view[GET_COMPUTED_STYLE](node, '')[att];

        if (re_color.test(att)) {
            val = Y.Color.toRGB(val);
        }

        return val;
    };

}

if (Y.UA.webkit) { // safari converts transparent to rgba()
    DOM[GET_COMPUTED_STYLE] = function(node, att) {
        var view = node[OWNER_DOCUMENT][DEFAULT_VIEW],
            val = view[GET_COMPUTED_STYLE](node, '')[att];

        if (val === 'rgba(0, 0, 0, 0)') {
            val = 'transparent'; 
        } else if (val === 'auto') { // top or left
            val = 0;
        }

        return val;
    };

}

/**
* Extended interface for DOM
* @module domscreen
*/

/**
 * An interface for advanced DOM features.
 * @interface DOMScreen
 */

var OFFSET_TOP = 'offsetTop',
    COMPAT_MODE = 'compatMode',
    PARENT_WINDOW = 'parentWindow',
    OFFSET_LEFT = 'offsetLeft',
    OFFSET_PARENT = 'offsetParent',
    POSITION = 'position',
    FIXED = 'fixed',
    RELATIVE = 'relative',
    LEFT = 'left',
    TOP = 'top',
    SCROLL_LEFT = 'scrollLeft',
    SCROLL_TOP = 'scrollTop',
    GET_BOUNDING_CLIENT_RECT = 'getBoundingClientRect',
    RE_TABLE = /^t(able|d|h)$/i;

var getDoc = function(node) {
    node = node || {};
    return (node[NODE_TYPE] === 9) ? node : node[OWNER_DOCUMENT] || Y.config.doc;
};

var getWinSize = function(node) {
    var doc = getDoc(),
        win = doc[DEFAULT_VIEW] || doc[PARENT_WINDOW],
        mode = doc[COMPAT_MODE],
        height = win.innerHeight,
        width = win.innerWidth,
        root = doc[DOCUMENT_ELEMENT];

    if ( mode && !Y.UA.opera ) { // IE, Gecko
        if (mode != 'CSS1Compat') { // Quirks
            root = doc.body; 
        }
        height = root[CLIENT_HEIGHT];
        width = root[CLIENT_WIDTH];
    }
    return { 'height': height, 'width': width }; 
};

var getDocSize = function(node) {
    var doc = getDoc(),
        root = doc[DOCUMENT_ELEMENT];

    if (doc[COMPAT_MODE] != 'CSS1Compat') {
        root = doc.body;
    }

    return {
        'height': root.scrollHeight,
        'width': root.scrollWidth
    };
};

Y.mix(Y.DOM, {

    /**
     * Returns the inner height of the viewport (exludes scrollbar). 
     * @method winHeight
     */
    winHeight: function(node) {
        var h = getWinSize(node)[HEIGHT];
        Y.log('winHeight returning ' + h, 'info', 'DOM');
        return h;
    },

    /**
     * Returns the inner width of the viewport (exludes scrollbar). 
     * @method winWidth
     */
    winWidth: function(node) {
        var w = getWinSize(node)[WIDTH];
        Y.log('winWidth returning ' + w, 'info', 'DOM');
        return w;
    },

    /**
     * Document height 
     * @method docHeight
     */
    docHeight:  function(node) {
        var h = getDocSize(node)[HEIGHT];
        return Math.max(h, getWinSize(node)[HEIGHT]);
    },

    /**
     * Document width 
     * @method docWidth
     */
    docWidth:  function(node) {
        var w = getDocSize(node)[WIDTH];
        return Math.max(w, getWinSize(node)[WIDTH]);
    },

    /**
     * Amount page has been scroll vertically 
     * @method docScrollX
     */
    docScrollX: function(node) {
        var doc = getDoc();
        return Math.max(doc[DOCUMENT_ELEMENT][SCROLL_LEFT], doc.body[SCROLL_LEFT]);
    },

    /**
     * Amount page has been scroll horizontally 
     * @method docScrollY
     */
    docScrollY:  function(node) {
        var doc = getDoc();
        return Math.max(doc[DOCUMENT_ELEMENT][SCROLL_TOP], doc.body[SCROLL_TOP]);
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
        if (document.documentElement[GET_BOUNDING_CLIENT_RECT]) {
            return function(node) {
                var scrollLeft = Y.DOM.docScrollX(node),
                    scrollTop = Y.DOM.docScrollY(node),
                    box = node[GET_BOUNDING_CLIENT_RECT](),
                    doc = node.ownerDocument,
                    //Round the numbers so we get sane data back
                    xy = [Math.floor(box[LEFT]), Math.floor(box[TOP])];

                    if (Y.UA.ie) {
                        var off1 = 2, off2 = 2,
                        mode = doc.compatMode,
                        bLeft = Y.DOM.getComputedStyle(doc[DOCUMENT_ELEMENT], 'borderLeftWidth'),
                        bTop = Y.DOM.getComputedStyle(doc[DOCUMENT_ELEMENT], 'borderTopWidth');

                        if (Y.UA.ie === 6) {
                            if (mode !== 'BackCompat') {
                                off1 = 0;
                                off2 = 0;
                            }
                        }
                        
                        if ((mode == 'BackCompat')) {
                            if (bLeft !== 'medium') {
                                off1 = parseInt(bLeft, 10);
                            }
                            if (bTop !== 'medium') {
                                off2 = parseInt(bTop, 10);
                            }
                        }
                        
                        xy[0] -= off1;
                        xy[1] -= off2;
                    }

                if ((scrollTop || scrollLeft)) {
                    xy[0] += scrollLeft;
                    xy[1] += scrollTop;
                }
                return xy;                   
            };
        } else {
            return function(node) { // manually calculate by crawling up offsetParents
                //Calculate the Top and Left border sizes (assumes pixels)
                var calcBorders = function(node, xy2) {
                    var t = parseInt(Y.DOM.getComputedStyle(node, 'borderTopWidth'), 10) || 0,
                        l = parseInt(Y.DOM.getComputedStyle(node, 'borderLeftWidth'), 10) || 0;
                    if (Y.UA.gecko) {
                        if (RE_TABLE.test(node[TAG_NAME])) {
                            t = 0;
                            l = 0;
                        }
                    }
                    xy2[0] += l;
                    xy2[1] += t;
                    return xy2;
                };

                var xy = [node[OFFSET_LEFT], node[OFFSET_TOP]],
                parentNode = node,
                bCheck = ((Y.UA.gecko || (Y.UA.webkit > 519)) ? true : false);

                while ((parentNode = parentNode[OFFSET_PARENT])) {
                    xy[0] += parentNode[OFFSET_LEFT];
                    xy[1] += parentNode[OFFSET_TOP];
                    if (bCheck) {
                        xy = calcBorders(parentNode, xy);
                    }
                }

                // account for any scrolled ancestors
                if (Y.DOM.getStyle(node, POSITION) != FIXED) {
                    parentNode = node;
                    var scrollTop, scrollLeft;

                    while ((parentNode = parentNode[PARENT_NODE])) {
                        scrollTop = parentNode[SCROLL_TOP];
                        scrollLeft = parentNode[SCROLL_LEFT];

                        //Firefox does something funky with borders when overflow is not visible.
                        if (Y.UA.gecko && (Y.DOM.getStyle(parentNode, 'overflow') !== VISIBLE)) {
                                xy = calcBorders(parentNode, xy);
                        }
                        

                        if (scrollTop || scrollLeft) {
                            xy[0] -= scrollLeft;
                            xy[1] -= scrollTop;
                        }
                    }
                    xy[0] += Y.DOM.docScrollX(node);
                    xy[1] += Y.DOM.docScrollY(node);

                } else {
                    //Fix FIXED position -- add scrollbars
                    if (Y.UA.opera) {
                        xy[0] -= Y.DOM.docScrollX(node);
                        xy[1] -= Y.DOM.docScrollY(node);
                    } else if (Y.UA.webkit || Y.UA.gecko) {
                        xy[0] += Y.DOM.docScrollX(node);
                        xy[1] += Y.DOM.docScrollY(node);
                    }
                }
                //Round the numbers so we get sane data back
                xy[0] = Math.floor(xy[0]);
                xy[1] = Math.floor(xy[1]);

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
        var pos = Y.DOM.getStyle(node, POSITION),
            delta = [ // assuming pixels; if not we will have to retry
                parseInt( Y.DOM.getComputedStyle(node, LEFT), 10 ),
                parseInt( Y.DOM.getComputedStyle(node, TOP), 10 )
            ];
    
        if (pos == 'static') { // default to relative
            pos = RELATIVE;
            Y.DOM.setStyle(node, POSITION, pos);
        }

        var currentXY = Y.DOM.getXY(node);

        if (currentXY === false) { // has to be part of doc to have xy
            Y.log('xy failed: node not available', 'error', 'Node');
            return false; 
        }
        
        if ( isNaN(delta[0]) ) {// in case of 'auto'
            delta[0] = (pos == RELATIVE) ? 0 : node[OFFSET_LEFT];
        } 
        if ( isNaN(delta[1]) ) { // in case of 'auto'
            delta[1] = (pos == RELATIVE) ? 0 : node[OFFSET_TOP];
        } 

        if (xy[0] !== null) {
            Y.DOM.setStyle(node, LEFT, xy[0] - currentXY[0] + delta[0] + 'px');
        }

        if (xy[1] !== null) {
            Y.DOM.setStyle(node, TOP, xy[1] - currentXY[1] + delta[1] + 'px');
        }
      
        if (!noRetry) {
            var newXY = Y.DOM.getXY(node);

            // if retry is true, try one more time if we miss 
           if ( (xy[0] !== null && newXY[0] != xy[0]) || 
                (xy[1] !== null && newXY[1] != xy[1]) ) {
               Y.DOM.setXY(node, xy, true);
           }
        }        

        Y.log('setXY setting position to ' + xy, 'info', 'Node');
    }
});

var getOffsets = function(r1, r2) {

    var t = Math.max(r1.top,    r2.top   ),
        r = Math.min(r1.right,  r2.right ),
        b = Math.min(r1.bottom, r2.bottom),
        l = Math.max(r1.left,   r2.left  );
    
    return {
        top: t,
        bottom: b,
        left: l,
        right: r
    };
};

Y.mix(Y.DOM, {
    /**
     * Returns an Object literal containing the following about this node: (top, right, bottom, left) positions, height and width
     * @method region
     @return {Object} Object literal containing the following about this node: (top, right, bottom, left) positions, height and width
     */
    region: function(node) {
        var x = Y.DOM.getXY(node);
        return {
            '0': x[0],
            '1': x[1],
            top: x[1],
            right: x[0] + node[OFFSET_WIDTH],
            bottom: x[1] + node[OFFSET_HEIGHT],
            left: x[0],
            height: node[OFFSET_HEIGHT],
            width: node[OFFSET_WIDTH]
        };
        
    },

    /**
     * Find the intersect information for this node and the node passed in.
     * @method intersect
     * @param {Object} node2 The node to check the interect with
     * @param {Object} altRegion An object literal containing the region for this node if we already have the data (for performance i.e. DragDrop)
     * @return {Object} Returns an Object literal with the intersect information for the nodes
     */
    intersect: function(node, node2, altRegion) {
        var r = altRegion || Y.DOM.region(node), region = {};

        var n = node2;
        if (n[TAG_NAME]) {
            region = Y.DOM.region(n);
        } else if (Y.Lang.isObject(node2)) {
            region = node2;
        } else {
            return false;
        }
        
        var off = getOffsets(region, r);
        return {
            top: off.top,
            right: off.right,
            bottom: off.bottom,
            left: off.left,
            area: ((off.bottom - off.top) * (off.right - off.left)),
            yoff: ((off.bottom - off.top)),
            xoff: (off.right - off.left),
            inRegion: Y.DOM.inRegion(node, node2, false, altRegion)
        };
        
    },
    /**
     * Check if any part of this node is in the passed region
     * @method inRegion
     * @param {Object} node2 The node to get the region from or an Object literal of the region
     * $param {Boolean} all Should all of the node be inside the region
     * @param {Object} altRegion An object literal containing the region for this node if we already have the data (for performance i.e. DragDrop)
     * @return {Boolean} True if in region, false if not.
     */
    inRegion: function(node, node2, all, altRegion) {
        var region = {},
            r = altRegion || Y.DOM.region(node);

        var n = node2;
        if (n[TAG_NAME]) {
            region = Y.DOM.region(n);
        } else if (Y.Lang.isObject(node2)) {
            region = node2;
        } else {
            return false;
        }
            
        if (all) {
            return ( r.left   >= region.left   &&
                r.right  <= region.right  && 
                r.top    >= region.top    && 
                r.bottom <= region.bottom    );
        } else {
            var off = getOffsets(region, r);
            if (off.bottom >= off.top && off.right >= off.left) {
                return true;
            } else {
                return false;
            }
            
        }
    },

    /**
     * Check if any part of this node is in the viewport
     * @method inViewportRegion
     * $param {Boolean} all Should all of the node be inside the region
     * @param {Object} altRegion An object literal containing the region for this node if we already have the data (for performance i.e. DragDrop)
     * @return {Boolean} True if in region, false if not.
     */
    inViewportRegion: function(node, all, altRegion) {
        return Y.DOM.inRegion(node, Y.DOM.viewportRegion(node), all, altRegion);
            
    },

    viewportRegion: function(node) {
        node = node || Y.config.doc.documentElement;
        var r = {
            top: Y.DOM.docScrollY(node),
            right: Y.DOM.winWidth(node) + Y.DOM.docScrollX(node),
            bottom: (Y.DOM.docScrollY(node) + Y.DOM.winHeight(node)),
            left: Y.DOM.docScrollX(node)
        };

        return r;
    }
});
var CLIENT_TOP = 'clientTop',
    CLIENT_LEFT = 'clientLeft',
    RIGHT = 'right',
    HAS_LAYOUT = 'hasLayout',
    BORDER_TOP_WIDTH = 'borderTopWidth',
    BORDER_RIGHT_WIDTH = 'borderRightWidth',
    BORDER_BOTTOM_WIDTH = 'borderBottomWidth',
    BORDER_LEFT_WIDTH = 'borderLeftWidth',
    PX = 'px',
    FILTER = 'filter',
    FILTERS = 'filters',
    OPACITY = 'opacity',
    AUTO = 'auto',
    CURRENT_STYLE = 'currentStyle';

// use alpha filter for IE opacity
if (document[DOCUMENT_ELEMENT][STYLE][OPACITY] === UNDEFINED &&
        document[DOCUMENT_ELEMENT][FILTERS]) {
    Y.DOM.CUSTOM_STYLES[OPACITY] = {
        get: function(node) {
            var val = 100;
            try { // will error if no DXImageTransform
                val = node[FILTERS]['DXImageTransform.Microsoft.Alpha'][OPACITY];

            } catch(e) {
                try { // make sure its in the document
                    val = node[FILTERS]('alpha')[OPACITY];
                } catch(e) {
                    Y.log('getStyle: IE opacity filter not found; returning 1', 'warn', 'DOM');
                }
            }
            return val / 100;
        },

        set: function(node, val, style) {
            if (typeof style[FILTER] == STRING) { // in case not appended
                style[FILTER] = 'alpha(' + OPACITY + '=' + val * 100 + ')';
                
                if (!node[CURRENT_STYLE] || !node[CURRENT_STYLE][HAS_LAYOUT]) {
                    style.zoom = 1; // needs layout 
                }
            }
        }
    };
}

// IE getComputedStyle
// TODO: unit-less lineHeight (e.g. 1.22)
var re_size = /^width|height$/,
    re_unit = /^(\d[.\d]*)+(em|ex|px|gd|rem|vw|vh|vm|ch|mm|cm|in|pt|pc|deg|rad|ms|s|hz|khz|%){1}?/i;

var ComputedStyle = {
    CUSTOM_STYLES: {},

    get: function(el, property) {
        var value = '',
            current = el[CURRENT_STYLE][property];

        if (!current || current.indexOf(PX) > -1) { // no need to convert
            value = current;
        } else if (DOM.IE.COMPUTED[property]) { // use compute function
            value = DOM.IE.COMPUTED[property](el, property);
        } else if (re_unit.test(current)) { // convert to pixel
            value = DOM.IE.ComputedStyle.getPixel(el, property);
        }

        return value;
    },

    getOffset: function(el, prop) {
        var current = el[CURRENT_STYLE][prop],                        // value of "width", "top", etc.
            capped = prop.charAt(0).toUpperCase() + prop.substr(1), // "Width", "Top", etc.
            offset = 'offset' + capped,                             // "offsetWidth", "offsetTop", etc.
            pixel = 'pixel' + capped,                               // "pixelWidth", "pixelTop", etc.
            value = '';

        if (current == AUTO) {
            var actual = el[offset]; // offsetHeight/Top etc.
            if (actual === UNDEFINED) { // likely "right" or "bottom"
                value = 0;
            }

            value = actual;
            if (re_size.test(prop)) { // account for box model diff 
                el[STYLE][prop] = actual; 
                if (el[offset] > actual) {
                    // the difference is padding + border (works in Standards & Quirks modes)
                    value = actual - (el[offset] - actual);
                }
                el[STYLE][prop] = AUTO; // revert to auto
            }
        } else { // convert units to px
            if (!el[STYLE][pixel] && !el[STYLE][prop]) { // need to map style.width to currentStyle (no currentStyle.pixelWidth)
                el[STYLE][prop] = current;              // no style.pixelWidth if no style.width
            }
            value = el[STYLE][pixel];
        }
        return value + PX;
    },

    getBorderWidth: function(el, property) {
        // clientHeight/Width = paddingBox (e.g. offsetWidth - borderWidth)
        // clientTop/Left = borderWidth
        var value = null;
        if (!el[CURRENT_STYLE][HAS_LAYOUT]) { // TODO: unset layout?
            el[STYLE].zoom = 1; // need layout to measure client
        }

        switch(property) {
            case BORDER_TOP_WIDTH:
                value = el[CLIENT_TOP];
                break;
            case BORDER_BOTTOM_WIDTH:
                value = el[OFFSET_HEIGHT] - el[CLIENT_HEIGHT] - el[CLIENT_TOP];
                break;
            case BORDER_LEFT_WIDTH:
                value = el[CLIENT_LEFT];
                break;
            case BORDER_RIGHT_WIDTH:
                value = el[OFFSET_WIDTH] - el[CLIENT_WIDTH] - el[CLIENT_LEFT];
                break;
        }
        return value + PX;
    },

    getPixel: function(node, att) {
        // use pixelRight to convert to px
        var val = null,
            styleRight = node[CURRENT_STYLE][RIGHT],
            current = node[CURRENT_STYLE][att];

        node[STYLE][RIGHT] = current;
        val = node[STYLE].pixelRight;
        node[STYLE][RIGHT] = styleRight; // revert

        return val + PX;
    },

    getMargin: function(node, att) {
        var val;
        if (node[CURRENT_STYLE][att] == AUTO) {
            val = 0 + PX;
        } else {
            val = DOM.IE.ComputedStyle.getPixel(node, att);
        }
        return val;
    },

    getVisibility: function(node, att) {
        var current;
        while ( (current = node[CURRENT_STYLE]) && current[att] == 'inherit') { // NOTE: assignment in test
            node = node[PARENT_NODE];
        }
        return (current) ? current[att] : VISIBLE;
    },

    getColor: function(node, att) {
        var current = node[CURRENT_STYLE][att];

        if (!current || current === TRANSPARENT) {
            DOM.elementByAxis(node, PARENT_NODE, null, function(parent) {
                current = parent[CURRENT_STYLE][att];
                if (current && current !== TRANSPARENT) {
                    node = parent;
                    return true;
                }
            });
        }

        return Y.Color.toRGB(current);
    },

    getBorderColor: function(node, att) {
        var current = node[CURRENT_STYLE];
        var val = current[att] || current.color;
        return Y.Color.toRGB(Y.Color.toHex(val));
    }

};

//fontSize: getPixelFont,
var IEComputed = {};

IEComputed[WIDTH] = IEComputed[HEIGHT] = ComputedStyle.getOffset;

IEComputed.color = IEComputed.backgroundColor = ComputedStyle.getColor;

IEComputed[BORDER_TOP_WIDTH] = IEComputed[BORDER_RIGHT_WIDTH] =
        IEComputed[BORDER_BOTTOM_WIDTH] = IEComputed[BORDER_LEFT_WIDTH] =
                ComputedStyle.getBorderWidth;

IEComputed.marginTop = IEComputed.marginRight = IEComputed.marginBottom =
        IEComputed.marginLeft = ComputedStyle.getMargin;

IEComputed.visibility = ComputedStyle.getVisibility;
IEComputed.borderTopColor = IEComputed.borderRightColor =
        IEComputed.borderBottomColor = IEComputed.borderLeftColor =
                ComputedStyle.getBorderColor;

if (!Y.config.win[GET_COMPUTED_STYLE]) {
    DOM[GET_COMPUTED_STYLE] = ComputedStyle.get; 
}

Y.namespace('DOM.IE');
DOM.IE.COMPUTED = IEComputed;
DOM.IE.ComputedStyle = ComputedStyle;


Y.mix(Y.Selector.operators, {
    '^=': function(attr, val) { return attr.indexOf(val) === 0; }, // Match starts with value
    '$=': function(attr, val) { return attr.lastIndexOf(val) === attr[LENGTH] - val[LENGTH]; }, // Match ends with value
    '*=': function(attr, val) { return attr.indexOf(val) > -1; }, // Match contains value as substring 
    '!=': function(attr, val) { return attr !== val; } // Inequality
});

Y.mix(Y.Selector.pseudos, {
        'root': function(node) {
            return node === node[OWNER_DOCUMENT][DOCUMENT_ELEMENT];
        },

        'nth-child': function(node, val) {
            return getNth(node, val);
        },

        'nth-last-child': function(node, val) {
            return getNth(node, val, null, true);
        },

        'nth-of-type': function(node, val) {
            return getNth(node, val, node[TAG_NAME]);
        },
         
        'nth-last-of-type': function(node, val) {
            return getNth(node, val, node[TAG_NAME], true);
        },

        'last-child': function(node) {
            return Y.DOM.lastChild(node[PARENT_NODE]) === node;
        },

        'first-of-type': function(node, val) {
            return Y.DOM.firstChildByTag(node[PARENT_NODE], node[TAG_NAME]) === node;
        },
         
        'last-of-type': function(node, val) {
            return Y.DOM.lastChildByTag(node[PARENT_NODE], node[TAG_NAME]) === node;
        },
         
        'only-child': function(node) {
            var children = Y.DOM.children(node[PARENT_NODE]);
            return children[LENGTH] === 1 && children[0] === node;
        },

        'only-of-type': function(node) {
            return Y.DOM.childrenByTag(node[PARENT_NODE], node[TAG_NAME])[LENGTH] === 1;
        },

        'empty': function(node) {
            return node.childNodes[LENGTH] === 0;
        },

        'not': function(node, simple) {
            return !Y.Selector.test(node, simple);
        },

        'contains': function(node, str) {
            return Y.DOM.getText(node).indexOf(str) > -1;
        },

        'checked': function(node) {
            return node.checked === true;
        }
});

Y.mix(Y.Selector.combinators, {
    '~': function(node, token) {
        var sib = node[PREVIOUS_SIBLING];
        while (sib) {
            if (sib[NODE_TYPE] === 1 && Y.Selector._rTestNode(sib, null, token[PREVIOUS])) {
                return true;
            }
            sib = sib[PREVIOUS_SIBLING];
        }

        return false;
    }
});


var reNth = /^(?:([-]?\d*)(n){1}|(odd|even)$)*([-+]?\d*)$/;

/*
    an+b = get every _a_th node starting at the _b_th
    0n+b = no repeat ("0" and "n" may both be omitted (together) , e.g. "0n+1" or "1", not "0+1"), return only the _b_th element
    1n+b =  get every element starting from b ("1" may may be omitted, e.g. "1n+0" or "n+0" or "n")
    an+0 = get every _a_th element, "0" may be omitted 
*/
var getNth = function(node, expr, tag, reverse) {
    reNth.test(expr);

    var a = parseInt(RegExp.$1, 10), // include every _a_ elements (zero means no repeat, just first _a_)
        n = RegExp.$2, // "n"
        oddeven = RegExp.$3, // "odd" or "even"
        b = parseInt(RegExp.$4, 10) || 0, // start scan from element _b_
        result = [],
        op,
        siblings;

    if (tag) {
        siblings = Y.DOM.childrenByTag(node.parentNode, tag);
    } else {
        siblings = Y.DOM.children(node.parentNode);
    }

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
            b = siblings[LENGTH] - b + 1; 
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
        for (var i = b - 1, len = siblings[LENGTH]; i < len; i += a) {
            if ( i >= 0 && siblings[i] === node ) {
                return true;
            }
        }
    } else {
        for (var i = siblings[LENGTH] - b, len = siblings[LENGTH]; i >= 0; i -= a) {
            if ( i < len && siblings[i] === node ) {
                return true;
            }
        }
    }
    return false;
};



}, '@VERSION@' );
