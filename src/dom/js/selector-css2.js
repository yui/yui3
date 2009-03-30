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

    Selector = Y.Selector,

    SelectorCSS1 = {
        SORT_RESULTS: false,
        _regexCache: {},

        _re: {
            attr: /(\[.*\])/g,
            urls: /^(?:href|src)/
        },

        /**
         * Mapping of attributes to aliases, normally to work around HTMLAttributes
         * that conflict with JS reserved words.
         * @property attrAliases
         * @type object
         */
        attrAliases: {
            'for': 'htmlFor',
            'class': 'className'
        },

        /**
         * Mapping of shorthand tokens to corresponding attribute selector 
         * @property shorthand
         * @type object
         */
        shorthand: {
            '\\#(-?[_a-z]+[-\\w]*)': '[id=$1]',
            '\\.(-?[_a-z]+[-\\w]*)': '[className~=$1]',
        },

        /**
         * List of operators and corresponding boolean functions. 
         * These functions are passed the attribute and the current node's value of the attribute.
         * @property operators
         * @type object
         */
        operators: {
            '': function(node, m) { return Y.DOM.getAttribute(node, m[0]) !== ''; }, // Just test for existence of attribute
            '=': '^{val}$', // equality
            '~=': '(?:^|\\s+){val}(?:\\s+|$)', // space-delimited
            '|=': '^{val}-?' // optional hyphen-delimited
        },

        pseudos: {
           'first-child': function(node) { 
                return Y.DOM.children(node[PARENT_NODE])[0] === node; 
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
            
             */
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
                var result = Selector._filter(nodes, Selector._tokenize(selector)[0]);
                Y.log('filter: returning:' + result[LENGTH], 'info', 'Selector');
                return result;
            },

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

                if (ret.item) {
                    ret = Selector._toArray(ret);
                }
                Y.log('query: ' + selector + ' returning: ' + ret[LENGTH], 'info', 'Selector');
                return (firstOnly) ? (ret[0] || null) : ret;
            },

        },

        _test: function(node, selector, token, deDupe) {
            token = token || Selector._tokenize(selector).pop();
            var ret = false,
                i = 0,
                attr,
                nextTest;

            if ( token && node && node[TAG_NAME] && // tagName limits to HTMLElements
                    (token.tag === '*' || token.tag === node[TAG_NAME]) &&
                    !(deDupe && node._found) ) {

                nextTest = token[PREVIOUS] ? 
                        Selector.combinators[token.previous[COMBINATOR]]:
                        null;

                ret = true; // loop until false or all tests pass

                while (ret && (attr = token.tests[i])) {
                    if (typeof attr.test === 'function') {
                        if (!attr.test(node, token.match)) {
                            ret = false;
                            break;
                        }
                    } else {
                        if (!attr.test.test(node[attr.name])) {
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


        _filter: function(nodes, token, firstOnly, deDupe) {
            var result = [],
                foundCache = Selector._foundCache;

            if (nodes) {
                for (var i = 0, len = nodes[LENGTH]; i < len; i++) {
                    if (! Selector._test(nodes[i], '', token, deDupe)) {
                        continue;
                    }

                    if (firstOnly) {
                        return [nodes[i]];
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
            }

            return result;
        },

        _query: function(selector, root, firstOnly, deDupe) {
            var ret = [],
                groups = selector.split(','), // TODO: handle comma in attribute/pseudo
                tokens,
                token,
                nodes = [],
                node;

            if (groups[LENGTH] > 1) {
                for (var i = 0, len = groups[LENGTH]; i < len; ++i) {
                    ret = ret.concat(arguments.callee(groups[i],
                            root, firstOnly, true)); 
                }

                ret = Selector.SORT_RESULT ? Selector._sort(ret) : ret;
                Selector._clearFoundCache();
            } else {
                tokens = Selector._tokenize(selector),
                root = root || Y.config.doc;

                token = tokens.pop();

                if (token) {
                    if (root.nodeType === 9 && tokens[0] && tokens[0].id) {
                        root = root.getElementById(tokens[0].id);
                    }

                    if (root && !nodes[LENGTH] && token.prefilter) {
                        nodes = token.prefilter(root, token.match);
                    }

                    if (nodes[LENGTH]) {
                        ret = Selector._filter(nodes, token, firstOnly, deDupe); 
                    }
                }
            }

            return ret;
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
                while ( (node = node[PARENT_NODE]) ) {
                    if (Selector._test(node, '', token[PREVIOUS])) {
                        return true;
                    }
                }  
                return false;
            },

            '>': function(node, token) {
                return Selector._test(node[PARENT_NODE], null, token[PREVIOUS]);
            },


            '+': function(node, token) {
                var sib = node[PREVIOUS_SIBLING];
                while (sib && sib.nodeType !== 1) {
                    sib = sib[PREVIOUS_SIBLING];
                }

                if (sib && Y.Selector._test(sib, null, token[PREVIOUS])) {
                    return true; 
                }
                return false;
            }

        },

        _parsers: [
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
                    
                    if (match[1] === 'id') { // store ID for fast-path match
                        token.id = match[3];
                        token.prefilter = function(root, m) {
                            var doc = root.nodeType === 9 ? root : root.ownerDocument;
                            return [doc.getElementById(m[2])];
                        };
                    } else if (document.documentElement.getElementsByClassName && 
                            match[1].indexOf('class') === 0) {
                        token.prefilter = function(root, m) {
                            return root.getElementsByClassName(m[2]);
                        };
                    }
                    return test;

                },

            },
            {
                name: TAG_NAME,
                re: /^((?:-?[_a-z]+[\w-]*)|\*)/i,
                fn: function(token, match) {
                    token.tag = match[1].toUpperCase();
                    return true;
                },
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
                tests: []
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
            do {
                found = false; // reset after full pass
                for (var i = 0, parser; parser = Selector._parsers[i++];) {
                    if ( (match = parser.re.exec(selector)) ) { // note assignment
                        test = parser.fn(token, match);
                        if (test) {
                            if (test !== true) { // auto-pass
                                token.tests.push({name: match[1], test: test});
                            }

                            token.match = match.slice(1);
                            found = true;
                            selector = selector.replace(match[0], ''); // strip current match from selector
                            if (!selector[LENGTH] || parser.name === COMBINATOR) {
                                if (!token.prefilter) {
                                    token.prefilter = function(root) {
                                        return root.getElementsByTagName(token.tag);
                                    }
                                }
                                tokens.push(token);
                                token = Selector._getToken(token);
                            }
                        } else {
                            found = false;
                        }
                    }
                }
            } while (found && selector.length);

            if (selector.length) { // not fully parsed
                Y.log('unsupported token encountered in: ' + selector, 'warn', 'Selector');
                tokens = [];
            }
            console.log(tokens);
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
    Y.Selector.filter = Selector._brute.filter;
    Y.Selector.test = Selector._brute.test;
}
