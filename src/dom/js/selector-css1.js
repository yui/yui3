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
            '': function(node, attr) { return node[attr]; }, // Just test for existence of attribute
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
                var result = Selector._query(selector, root, firstOnly);
                Y.log('query: returning ' + result[LENGTH], 'info', 'Selector');
                return result;
            },

        },

        _test: function(node, selector, token, deDupe) {
            token = token || Selector._tokenize(selector).pop();

            if ( !token || !node[TAG_NAME] || (deDupe && node._found) ) {
                return false;
            }

            for (var i = 0, attr; attr = token.tests[i++];) {
                if (attr.test) {
                    if (typeof attr.test === 'function') {
                        if (!attr.test(node, attr.name)) {
                            return false;
                        }
                    } else {
                        if (!attr.test.test(node[attr.name])) {
                            return false;
                        }
                    }
                }
            }

            return (token[PREVIOUS] && token[PREVIOUS][COMBINATOR]) ?
                    Selector._combinators[token[PREVIOUS][COMBINATOR]](node, token) :
                    true;
        },


        _filter: function(nodes, token, firstOnly, deDupe) {
            var result = firstOnly ? null : [],
                foundCache = Selector._foundCache;

            if (nodes) {
                for (var i = 0, len = nodes[LENGTH]; i < len; i++) {
                    if (! Selector._test(nodes[i], '', token, deDupe)) {
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
            }

            return result;
        },

        _query: function(selector, root, firstOnly, deDupe) {
            var result =  (firstOnly) ? null : [],
                node;

            if (!selector) {
                return result;
            }

            root = root || Y.config.doc;
            var groups = selector.split(','); // TODO: handle comma in attribute/pseudo

            if (groups[LENGTH] > 1) {
                var found;
                result = [];
                for (var i = 0, len = groups[LENGTH]; i < len; ++i) {
                    found = arguments.callee(groups[i], root, firstOnly, true);
                    result = result.concat(found); 
                }

                result = Selector._sort(result);
                Selector._clearFoundCache();
                return (firstOnly) ? result[0] : result;
            }

            var tokens = Selector._tokenize(selector),
                nodes = [],
                token = tokens.pop() || {},
                id = token.id;
                
            // use id shortcut when possible
            if (id) { // but not with element scoped queries
                node = Y.DOM.byId(id);
                nodes = node && Y.DOM.contains(root, node) ? [node] : [];
            }

            if (root && !nodes[LENGTH]) {
                nodes = root.getElementsByTagName(token.tag);
            }

            if (nodes[LENGTH]) {
                result = Selector._filter(nodes, token, firstOnly, deDupe); 
            }

            return result;
        },


        _getRegExp: function(str, flags) {
            var regexCache = Selector._regexCache;
            flags = flags || '';
            if (!regexCache[str + flags]) {
                regexCache[str + flags] = new RegExp(str, flags);
            }
            return regexCache[str + flags];
        },

        _combinators: {
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
                    var operator = match[2], 
                        val = match[3],
                        test = Selector.operators[operator] || null;

                    // operator tests may be string or function
                    if (typeof test === 'string') {
                        test = Selector._getRegExp(test.replace('{val}', val), 'i');
                    }
                    
                    if (test) {
                        token.tests.push({
                            name: match[1],
                            test: test
                        });
                    }

                    if (match[1] === 'id') { // store ID for fast-path match
                        token.id = match[1];
                    }
                }
            },
            {
                name: TAG_NAME,
                re: /^((?:-?[_a-z]+[\w-]*)|\*)/i,
                fn: function(token, match) {
                    var test = Selector.operators['='].replace('{val}', match[1]);
                    token.tag = match[1];

                    if (token.tag !== '*') {
                        token.tests.push({
                            name: TAG_NAME,
                            test: Selector._getRegExp(test, 'i') // TODO: case-sensitive? (XML)
                        });
                    }
                }
            },
            {
                name: COMBINATOR,
                re: /^\s*([>+~]|\s)\s*/,
                fn: function(token, match) {
                    token[COMBINATOR] = match[1];
                }
            },
            {
                name: PSEUDOS,
                re: /^:([\-\w]+)(?:\(['"]?(.+)['"]?\))*/i,
                fn: function(token, match) {
                    token.tests.push({
                        name: match[1],
                        test: Selector[PSEUDOS][match[1]]
                    });
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
            Combinator is attached to left-hand selector.
         */
        _tokenize: function(selector) {
            var token = Selector._getToken(),     // one token per simple selector (left selector holds combinator)
                tokens = [],    // array of tokens
                found = false,  // whether or not any matches were found this pass
                match;          // the regex match

            selector = Selector._replaceShorthand(selector);

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
                        found = true;
                        parser.fn(token, match);
                        selector = selector.replace(match[0], ''); // strip current match from selector
                        if (!selector[LENGTH] || parser.name === COMBINATOR) {
                            tokens.push(token);
                            token = Selector._getToken(token);
                        }
                    }
                }
            } while (found);

            return (!selector.length) ? tokens : [];
        },

        _replaceShorthand: function(selector) {
            var shorthand = Selector.shorthand;

            var attrs = selector.match(Selector._re.attr); // pull attributes to avoid false pos on "." and "#"
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

// TODO: IE8 quirks
if (Y.UA.ie && Y.UA.ie < 8) { // rewrite class for IE < 8
    SelectorCSS1.attrAliases['class'] = 'className';
}

Y.mix(Y.Selector, SelectorCSS1, true);

// only override native when not supported
if (!Y.Selector._supportsNative()) {
    Y.Selector.query = Selector._brute.query;
    Y.Selector.filter = Selector._brute.filter;
    Y.Selector.test = Selector._brute.test;
}
