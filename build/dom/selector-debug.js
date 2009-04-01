YUI.add('selector', function(Y) {

Y.namespace('Selector'); // allow native module to standalone

var PARENT_NODE = 'parentNode',
    LENGTH = 'length',

NativeSelector = {
    _reLead: /^\s*([>+~]|:self)/,
    _reUnSupported: /!./,

    _foundCache: [],

    _supportsNative: function() {
        // whitelist and feature detection to manage
        // future implementations manually
        return ( (Y.UA.ie >= 8 || Y.UA.webkit > 525) &&
            document.querySelectorAll);
    },

    _toArray: function(nodes) { // TODO: move to Y.Array
        var ret = nodes;
        if (!nodes.slice) {
            try {
                ret = Array.prototype.slice.call(nodes);
            } catch(e) { // IE: requires manual copy
                ret = [];
                for (var i = 0, len = nodes[LENGTH]; i < len; ++i) {
                    ret[i] = nodes[i];
                }
            }
        }
        return ret;
    },

    _clearFoundCache: function() {
        var foundCache = NativeSelector._foundCache;
        for (var i = 0, len = foundCache[LENGTH]; i < len; ++i) {
            try { // IE no like delete
                delete foundCache[i]._found;
            } catch(e) {
                foundCache[i].removeAttribute('_found');
            }
        }
        foundCache = [];
    },

    _sort: function(nodes) {
        if (nodes) {
            nodes = NativeSelector._toArray(nodes);
            if (nodes.sort) {
                nodes.sort(function(a, b) {
                    return Y.DOM.srcIndex(a) - Y.DOM.srcIndex(b);
                });
            }
        }

        return nodes;
    },

    _deDupe: function(nodes) {
        var ret = [],
            cache = NativeSelector._foundCache;

        for (var i = 0, node; node = nodes[i++];) {
            if (!node._found) {
                ret[ret[LENGTH]] = cache[cache[LENGTH]] = node;
                node._found = true;
            }
        }
        NativeSelector._clearFoundCache();
        return ret;
    },

    // allows element scoped queries to begin with combinator
    // e.g. query('> p', document.body) === query('body > p')
    _prepQuery: function(root, selector) {
        var groups = selector.split(','),
            queries = [],
            isDocRoot = (root && root.nodeType === 9),
            scopeQuery = false,
            combinator,
            tmpRoot,
            tmpSelector;

        if (root) {
            if (!isDocRoot) {
                root.id = root.id || Y.guid();
                // break into separate queries for element scoping
                for (var i = 0, len = groups[LENGTH]; i < len; ++i) {
                    if (NativeSelector._reLead.test(groups[i])) {
                        combinator = RegExp.$1;
                        scopeQuery = true;
                        tmpRoot = root;
                        tmpSelector = '#' + root.id + ' ' + groups[i]; // prepend with root ID

                        if (combinator === '~' || combinator === '+') { // query from parentNode for sibling
                            if (root[PARENT_NODE]) {
                                tmpRoot = root[PARENT_NODE];
                            } else {
                                Y.log('unable to process initial combinator: ' + combinator +
                                        ' for root: ' + root + '; requires root[PARENT_NODE]',
                                        'error', 'Selector');
                            }
                        }
                    } else {
                        tmpRoot = root;
                        tmpSelector = groups[i];
                    }
                    queries.push({root: tmpRoot, selector: tmpSelector});
                }
            }
            if (!scopeQuery) {
                queries = [{root: root, selector: selector}]; // run as single query
            }
        }

        return queries;
    },

    _query: function(selector, root, firstOnly) {
        if (NativeSelector._reUnSupported.test(selector)) {
            return NativeSelector._brute.query(selector, root, firstOnly);
        }

        var ret = firstOnly ? null : [],
            queryName = firstOnly ? 'querySelector' : 'querySelectorAll',
            result,
            queries;

        root = root || Y.config.doc;

        if (selector) {
            queries = NativeSelector._prepQuery(root, selector);
            ret = [];

            for (var i = 0, query; query = queries[i++];) {
                try {
                    result = query.root[queryName](query.selector);
                    if (result && result.item) { // convert NodeList to Array
                        result = NativeSelector._toArray(result);
                    }
                    ret = ret.concat(result);
                } catch(e) {
                    Y.log('native selector error: ' + e, 'error', 'Selector');
                }
            }

            if (queries[LENGTH] > 1) { // remove dupes and sort by doc order 
                ret = NativeSelector._sort(NativeSelector._deDupe(ret));
            }
            ret = (!firstOnly) ? ret : ret[0] || null;
        }
        return ret;
    },

    _filter: function(nodes, selector) {
        var ret = [];

        if (nodes && selector) {
            for (var i = 0, node; (node = nodes[i++]);) {
                if (Y.Selector._test(node, selector)) {
                    ret[ret[LENGTH]] = node;
                }
            }
        } else {
            Y.log('invalid filter input (nodes: ' + nodes +
                    ', selector: ' + selector + ')', 'warn', 'Selector');
        }

        return ret;
    },

    _test: function(node, selector) {
        var ret = false,
            item;

        if (node && node[PARENT_NODE]) {
            node.id = node.id || Y.guid();
            selector += '#' + node.id; // add ID for uniqueness
            item = Y.Selector.query(selector, node[PARENT_NODE], true);
            ret = (item === node);
        }

        return ret;
    }
};

if (Y.UA.ie && Y.UA.ie <= 8) {
    NativeSelector._reUnSupported = /:(?:nth|not|root|only|checked|first|last|empty)/;
}



Y.mix(Y.Selector, NativeSelector, true);

// allow standalone selector-native module
if (NativeSelector._supportsNative()) {
    Y.Selector.query = NativeSelector._query;
    //Y.Selector.filter = NativeSelector._filter;
    //Y.Selector.test = NativeSelector._test;
}
Y.Selector.test = NativeSelector._test;
Y.Selector.filter = NativeSelector._filter;
/**
 * The selector-css1 module provides helper methods allowing CSS1 Selectors to be used with DOM elements.
 * @module selector-css1
 * @title Selector Utility
 * @requires yahoo, dom
 */

/**
 * Provides helper methods for collecting and filtering DOM elements.
 * @class Selector
 * @static
 */

var PARENT_NODE = 'parentNode',
    TAG_NAME = 'tagName',
    ATTRIBUTES = 'attributes',
    COMBINATOR = 'combinator',
    PSEUDOS = 'pseudos',
    PREVIOUS = 'previous',
    PREVIOUS_SIBLING = 'previousSibling',
    LENGTH = 'length',

    _childCache = [], // cache to cleanup expando node.children

    Selector = Y.Selector,

    SelectorCSS1 = {
        SORT_RESULTS: false,
        _children: function(node) {
            var ret = node.children;

            if (!ret) {
                ret = [];
                for (var i = 0, n; n = node.childNodes[i++];) {
                    if (n.tagName) {
                        ret[ret.length] = n;
                    }
                }
                _childCache[_childCache.length] = node;
                node.children = ret;
            }

            return ret;
        },

        _regexCache: {},

        _re: {
            attr: /(\[.*\])/g,
            urls: /^(?:href|src)/
        },

        /**
         * Mapping of shorthand tokens to corresponding attribute selector 
         * @property shorthand
         * @type object
         */
        shorthand: {
            '\\#(-?[_a-z]+[-\\w]*)': '[id=$1]',
            '\\.(-?[_a-z]+[-\\w]*)': '[className~=$1]'
        },

        /**
         * List of operators and corresponding boolean functions. 
         * These functions are passed the attribute and the current node's value of the attribute.
         * @property operators
         * @type object
         */
        operators: {
            '': function(node, m) { return Y.DOM.getAttribute(node, m[0]) !== ''; }, // Just test for existence of attribute
            //'': '.+',
            '=': '^{val}$', // equality
            '~=': '(?:^|\\s+){val}(?:\\s+|$)', // space-delimited
            '|=': '^{val}-?' // optional hyphen-delimited
        },

        pseudos: {
           'first-child': function(node) { 
                return Y.Selector._children(node[PARENT_NODE])[0] === node; 
            } 
        },

        _brute: {
            /**
             * Test if the supplied node matches the supplied selector.
             * @method test
             *
             * @param {HTMLElement | String} node An id or node reference to the HTMLElement being tested.
             * @param {string} selector The CSS Selector to test the node against.
             * @return{boolean} Whether or not the node matches the selector.
             * @static
            
            test: function(node, selector) {
                if (!node) {
                    return false;
                }

                var groups = selector ? selector.split(',') : [];
                if (groups[LENGTH] > 1) {
                    for (var i = 0, len = groups[LENGTH]; i < len; ++i) {
                        if ( Selector._test(node, groups[i]) ) { // passes if ANY group matches
                            return true;
                        }
                    }
                    return false;
                }
                return Selector._test(node, selector);
            },
             */

            /**
             * Filters a set of nodes based on a given CSS selector. 
             * @method filter
             *
             * @param {array} nodes A set of nodes/ids to filter. 
             * @param {string} selector The selector used to test each node.
             * @return{array} An array of nodes from the supplied array that match the given selector.
             * @static
            filter: function(nodes, selector) {
                var result = Selector._filter(nodes, Selector._tokenize(selector)[0]);
                Y.log('filter: returning:' + result[LENGTH], 'info', 'Selector');
                return result;
            },
             */

            /**
             * Retrieves a set of nodes based on a given CSS selector. 
             * @method query
             *
             * @param {string} selector The CSS Selector to test the node against.
             * @param {HTMLElement} root optional An HTMLElement to start the query from. Defaults to Y.config.doc
             * @param {Boolean} firstOnly optional Whether or not to return only the first match.
             * @return {Array} An array of nodes that match the given selector.
             * @static
             */
            query: function(selector, root, firstOnly) {
                var ret = [];
                if (selector) {
                    ret = Selector._query(selector, root, firstOnly);
                }

/*
                if (ret.item) {
                    ret = Selector._toArray(ret);
                }
*/
                Y.log('query: ' + selector + ' returning: ' + ret[LENGTH], 'info', 'Selector');
                Selector._cleanup();
                return (firstOnly) ? (ret[0] || null) : ret;
            }

        },
/*
        _test: function(node, selector, token, deDupe) {
            token = token || Selector._tokenize(selector).pop();
            var ret = false,
                i = 0,
                attr,
                tag = token.tag,
                nextTest;

            if ( //token && node && node[TAG_NAME] && // tagName limits to HTMLElements
                    (tag === '*' || tag === node[TAG_NAME]) &&
                    !(deDupe && node._found) ) {

                nextTest = token[PREVIOUS] ? 
                        Selector.combinators[token[PREVIOUS][COMBINATOR]]:
                        null;

                ret = true; // loop until false or all tests pass

                while (ret && (attr = token.tests[i])) {
                    if (attr.test.test) {
                        if (!attr.test.test(node[attr.name])) {
                            ret = false;
                            break;
                        }
                    } else {
                        if (!attr.test(node, attr.match)) {
                            ret = false;
                            break;
                        }
                    }
                    i++;
                }
                if (ret && nextTest) {
                    ret = nextTest(node, token);
                }
            }

            return ret;
        },
*/

        some: function() { return (Array.prototype.some) ?
            function(nodes, fn, context) {
                return Array.prototype.some.call(nodes, fn, context);
            } :
            function(nodes, fn, context) {
                for (var i = 0, node; node = nodes[i++];) {
                    if (fn.call(context, node, i, nodes)) {
                        return true;
                    }
                }
                return false;
            }
        }(),

/*
// dragons
        _filter: function(nodes, token, firstOnly, deDupe) {
            var result = [],
                foundCache = Selector._foundCache,
                previous = token[PREVIOUS],
                nextTest = previous ?
                        Selector.combinators[previous[COMBINATOR]]
                        : null,
                tag = token.tag,
                tests = token.tests,
                test,
                attr,
                j = 0;

            if (nodes && token) {
                outer:
                for (var i = 0, node; node = nodes[i++];) {
                    j = 0;
                    if (//node[TAG_NAME] && // tagName limits to HTMLElements
                            (tag === '*' || tag === node[TAG_NAME]) &&
                            !(deDupe && node._found) ) {
                        while ((attr = tests[j])) {
                            j++;
                            test = attr.test;
                            if (test.test) {
                                if (!test.test(node[attr.name])) {
                                    continue outer;
                                }
                            } else if (!test(node, attr.match)) {
                                continue outer;
                            }
                        }

                        if (nextTest && !nextTest(node, token)) {
                            continue outer;
                        }
*//*
                        if (nextTest) {
                            if (previous[COMBINATOR] === ' ') {
                                var tmpNode = node,
                                    tmpTag = previous.tag;

                                parent:
                                while ( (tmpNode = tmpNode[PARENT_NODE]) ) {
                                    j = 0;

                                    if (tmpTag === '*' || tmpTag === tmpNode[TAG_NAME]) {
                                        while ((attr = tests[j])) {
                                            j++;
                                            test = attr.test;
                                            if (test.test) {
                                                if (!test.test(tmpNode[attr.name])) {
                                                    continue parent;
                                                }
                                            } else if (!test(tmpNode, m)) {
                                                continue parent;
                                            }
                                        }
                                        break parent;
                                    } else {
                                        continue parent;
                                    }
                                    continue outer; // failed if we made it this far
                                }
                            } else if (nextTest(node, token)) {
                                continue outer;
                            }
                        }
*//*

                        if (deDupe) {
                            if (node._found) {
                                continue outer;
                            }
                            node._found = true;
                            foundCache[foundCache[LENGTH]] = node;
                        }

                        if (firstOnly) {
                            result = [node];
                            break outer;
                        } else {
                            result[result[LENGTH]] = node;
                        }

                    }

                }
            }

            return result;
        },
*/

        // TODO: make extensible? events?
        _cleanup: function() {
            for (var i = 0, node; node = _childCache[i++];) {
                delete node.children;
            }

            _childCache = [];
        },

        _query: function(selector, root, firstOnly, deDupe) {
            var ret = [],
                groups = selector.split(','), // TODO: handle comma in attribute/pseudo
                nodes = [],
                tokens,
                token;

            if (groups[LENGTH] > 1) {
                for (var i = 0, len = groups[LENGTH]; i < len; ++i) {
                    ret = ret.concat(arguments.callee(groups[i],
                            root, firstOnly, true)); 
                }

                ret = Selector.SORT_RESULT ? Selector._sort(ret) : ret;
                Selector._clearFoundCache();
            } else {
                root = root || Y.config.doc;

                if (root.nodeType !== 9) { // enforce element scope
                    selector = '#' + root.id + ' selector';
                    root = root.ownerDocument;
                }

                tokens = Selector._tokenize(selector);
                token = tokens.pop();

                if (token) {
                    if (tokens[0] && tokens[0].id) {
                        root = root.getElementById(tokens[0].id);
                    }

                    if (root && !nodes[LENGTH] && token.prefilter) {
                        nodes = token.prefilter(root, token);
                    }

                    if (nodes[LENGTH]) {
                        if (firstOnly) {
                            Selector.some(nodes, Selector._testToken, token);
                        } else {
                            Y.Array.each(nodes, Selector._testToken, token);
                        }
                    }
                    ret = token.result;
                }
            }

            return ret;
        },

        _testToken: function(node, index, nodes, token) {
            var token = token || this,
                tag = token.tag,
                previous = token[PREVIOUS],
                result = token.result,
                i = 0,
                nextTest = previous && previous[COMBINATOR] ?
                        Selector.combinators[previous[COMBINATOR]] :
                        null;

            if (//node[TAG_NAME] && // tagName limits to HTMLElements
                    (tag === '*' || tag === node[TAG_NAME]) &&
                    !(node._found) ) {
                while ((attr = token.tests[i])) {
                    i++;
                    test = attr.test;
                    if (test.test) {
                        if (!test.test(node[attr.name])) {
                            return false;
                        }
                    } else if (!test(node, attr.match)) {
                        return false;
                    }
                }

                if (nextTest && !nextTest(node, token)) {
                    return false;
                }

                result[result.length] = node;
                return true;
            }
            return false;
        },


        _getRegExp: function(str, flags) {
            var regexCache = Selector._regexCache;
            flags = flags || '';
            if (!regexCache[str + flags]) {
                regexCache[str + flags] = new RegExp(str, flags);
            }
            return regexCache[str + flags];
        },

        combinators: {
            ' ': function(node, token) {
/*
                var previous = token.previous,
                    match = previous.match,
                    tag = previous ? previous.tag : null;

                outer:
*/
                var test = Selector._testToken,
                    previous = token[PREVIOUS];
                while ( (node = node[PARENT_NODE]) ) {
                    if (test(node, null, null, previous)) {
                        return true;
                    }
                /*
                    if (tag && (tag === '*' || tag === node[TAG_NAME])) {
                        for (var i = 0, test; test = previous.tests[i++];) {
                            if (test.test.test) {
                                if (!test.test.test(node[test.name])) {
                                    continue outer;
                                }
                            } else {
                                if (!test.test(node, match)) {
                                    continue outer;
                                }
                            }
                        }
                        return true;
                    }
                */
                }  
                return false;
            },

            '>': function(node, token) {
                return Selector._testToken(node[PARENT_NODE], null, null, token[PREVIOUS]);
            },


            '+': function(node, token) {
                var sib = node[PREVIOUS_SIBLING];
                while (sib && sib.nodeType !== 1) {
                    sib = sib[PREVIOUS_SIBLING];
                }

                if (sib && Y.Selector._testToken(sib, null, null, token[PREVIOUS])) {
                    return true; 
                }
                return false;
            }

        },

        _parsers: [
            {
                name: TAG_NAME,
                re: /^((?:-?[_a-z]+[\w-]*)|\*)/i,
                fn: function(token, match) {
                    token.tag = match[1].toUpperCase();
                    token.prefilter = function(root) {
                        return root.getElementsByTagName(token.tag);
                    };
                    return true;
                }
            },
            {
                name: ATTRIBUTES,
                re: /^\[([a-z]+\w*)+([~\|\^\$\*!=]=?)?['"]?([^\]]*?)['"]?\]/i,
                fn: function(token, match) {
                    var val = match[3],
                        operator = !(match[2] && val) ? '' : match[2],
                        test = Selector.operators[operator];

                    // might be a function
                    if (typeof test === 'string') {
                        test = Selector._getRegExp(test.replace('{val}', val));
                    }
                    
                    if (match[1] === 'id' && val) { // store ID for fast-path match
                        token.id = val;
                        token.prefilter = function(root) {
                            var doc = root.nodeType === 9 ? root : root.ownerDocument,
                                node = doc.getElementById(val);
                            
                            return node ? [node] : [];
                        };
                    } else if (document.documentElement.getElementsByClassName && 
                            match[1].indexOf('class') === 0) {
                        test = true; // skip class test 
                        token.prefilter = function(root) {
                            return root.getElementsByClassName(val);
                        };
                    }
                    return test;

                }

            },
            {
                name: COMBINATOR,
                re: /^\s*([>+~]|\s)\s*/,
                fn: function(token, match) {
                    token[COMBINATOR] = match[1];
                    return !! Selector.combinators[token[COMBINATOR]];
                }
            },
            {
                name: PSEUDOS,
                re: /^:([\-\w]+)(?:\(['"]?(.+)['"]?\))*/i,
                fn: function(token, match) {
                    return Selector[PSEUDOS][match[1]];

                }
            }
            ],

        _getToken: function(token) {
            return {
                previous: token,
                combinator: ' ',
                tag: '*',
                prefilter: function(root) {
                    return root.getElementsByTagName('*');
                },
                tests: [],
                result: []
            };
        },

        /**
            Break selector into token units per simple selector.
            Combinator is attached to the previous token.
         */
        _tokenize: function(selector) {
            selector = selector || '';
            selector = Selector._replaceShorthand(Y.Lang.trim(selector)); 
            var token = Selector._getToken(),     // one token per simple selector (left selector holds combinator)
                tokens = [],    // array of tokens
                found = false,  // whether or not any matches were found this pass
                test,
                match;          // the regex match

            /*
                Search for selector patterns, store, and strip them from the selector string
                until no patterns match (invalid selector) or we run out of chars.

                Multiple attributes and pseudos are allowed, in any order.
                for example:
                    'form:first-child[type=button]:not(button)[lang|=en]'
            */
            outer:
            do {
                found = false; // reset after full pass
                for (var i = 0, parser; parser = Selector._parsers[i++];) {
                    if ( (match = parser.re.exec(selector)) ) { // note assignment
                        test = parser.fn(token, match);
                        if (test) {
                            if (test !== true) { // auto-pass
                                token.tests.push({
                                    name: match[1],
                                    test: test,
                                    match: match.slice(1)
                                });
                            }

                            found = true;
                            selector = selector.replace(match[0], ''); // strip current match from selector
                            if (!selector[LENGTH] || parser.name === COMBINATOR) {
                                tokens.push(token);
                                token = Selector._getToken(token);
                            }
                        } else {
                            found = false;
                            break outer;
                        }
                    }
                }
            } while (found && selector.length);

            if (!found || selector.length) { // not fully parsed
                Y.log('unsupported token encountered in: ' + selector, 'warn', 'Selector');
                tokens = [];
            }
            return tokens;
        },

        _replaceShorthand: function(selector) {
            var shorthand = Selector.shorthand,
                attrs = selector.match(Selector._re.attr); // pull attributes to avoid false pos on "." and "#"

            if (attrs) {
                selector = selector.replace(Selector._re.attr, 'REPLACED_ATTRIBUTE');
            }

            for (var re in shorthand) {
                if (shorthand.hasOwnProperty(re)) {
                    selector = selector.replace(Selector._getRegExp(re, 'gi'), shorthand[re]);
                }
            }

            if (attrs) {
                for (var i = 0, len = attrs[LENGTH]; i < len; ++i) {
                    selector = selector.replace('REPLACED_ATTRIBUTE', attrs[i]);
                }
            }
            return selector;
        }
    };

Y.mix(Y.Selector, SelectorCSS1, true);

// only override native when not supported
if (!Y.Selector._supportsNative()) {
    Y.Selector.query = Selector._brute.query;
    //Y.Selector.filter = Selector._brute.filter;
    //Y.Selector.test = Selector._brute.test;
}
/*
    an+b = get every _a_th node starting at the _b_th
    0n+b = no repeat ("0" and "n" may both be omitted (together) , e.g. "0n+1" or "1", not "0+1"), return only the _b_th element
    1n+b =  get every element starting from b ("1" may may be omitted, e.g. "1n+0" or "n+0" or "n")
    an+0 = get every _a_th element, "0" may be omitted 
*/

Y.Selector._reNth = /^(?:([-]?\d*)(n){1}|(odd|even)$)*([-+]?\d*)$/;

Y.Selector._getNth = function(node, expr, tag, reverse) {
    Y.Selector._reNth.test(expr);
    var a = parseInt(RegExp.$1, 10), // include every _a_ elements (zero means no repeat, just first _a_)
        n = RegExp.$2, // "n"
        oddeven = RegExp.$3, // "odd" or "even"
        b = parseInt(RegExp.$4, 10) || 0, // start scan from element _b_
        result = [],
        op;

    var siblings = node.parentNode.children || Selector._children(node.parentNode); 
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

Y.mix(Y.Selector.pseudos, {
    'root': function(node) {
        return node === node.ownerDocument.documentElement;
    },

    'nth-child': function(node, m) {
        return Y.Selector._getNth(node, m[1]);
    },

    'nth-last-child': function(node, m) {
        return Y.Selector._getNth(node, m[1], null, true);
    },

    'nth-of-type': function(node, m) {
        return Y.Selector._getNth(node, m[1], node.tagName);
    },
     
    'nth-last-of-type': function(node, m) {
        return Y.Selector._getNth(node, m[1], node.tagName, true);
    },
     
    'last-child': function(node) {
        var children = node.children || Y.Selector._children(node.parentNode);
        return children[children.length - 1] === node;
    },

    'first-of-type': function(node) {
        return Y.DOM._childrenByTag(node.parentNode, node.tagName)[0];
    },
     
    'last-of-type': function(node) {
        var children = Y.DOM._childrenByTag(node.parentNode, node.tagName);
        return children[children.length - 1];
    },
     
    'only-child': function(node) {
        var children = node.children || Y.Selector._children(node.parentNode);
        return children.length === 1 && children[0] === node;
    },

    'only-of-type': function(node) {
        return Y.DOM._childrenByTag(node.parentNode, node.tagName).length === 1;
    },

    'empty': function(node) {
        return node.childNodes.length === 0;
    },

    'not': function(node, m) {
        return !Y.Selector.test(node, m[1]);
    },

    'contains': function(node, m) {
        var text = node.innerText || node.textContent || '';
        return text.indexOf(m[1]) > -1;
    },

    'checked': function(node) {
        return node.checked === true;
    }
});

Y.mix(Y.Selector.operators, {
    '^=': '^{val}', // Match starts with value
    '$=': '{val}$', // Match ends with value
    '*=': '{val}' // Match contains value as substring 
});

Y.Selector.combinators['~'] = function(node, token) {
    var sib = node.previousSibling;
    while (sib) {
        if (sib.nodeType === 1 && Y.Selector._testToken(sib, null, null, token.previous)) {
            return true;
        }
        sib = sib.previousSibling;
    }

    return false;
}


}, '@VERSION@' ,{requires:['dom-base'], skinnable:false});
