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

                Y.log('query: ' + selector + ' returning: ' + ret[LENGTH], 'info', 'Selector');
                Selector._cleanup();
                return (firstOnly) ? (ret[0] || null) : ret;
            }

        },
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
                var test = Selector._testToken,
                    previous = token[PREVIOUS];
                while ( (node = node[PARENT_NODE]) ) {
                    if (test(node, null, null, previous)) {
                        return true;
                    }
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
}
