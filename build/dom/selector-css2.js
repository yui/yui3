YUI.add('selector-css2', function(Y) {

/**
 * The selector module provides helper methods allowing CSS2 Selectors to be used with DOM elements.
 * @module dom
 * @submodule selector-css2
 * @for Selector
 */

/**
 * Provides helper methods for collecting and filtering DOM elements.
 */

var PARENT_NODE = 'parentNode',
    TAG_NAME = 'tagName',
    ATTRIBUTES = 'attributes',
    COMBINATOR = 'combinator',
    PSEUDOS = 'pseudos',
    PREVIOUS = 'previous',
    PREVIOUS_SIBLING = 'previousSibling',

    _childCache = [], // cache to cleanup expando node.children

    Selector = Y.Selector,

    SelectorCSS2 = {
        SORT_RESULTS: true,
        _children: function(node) {
            var ret = node.children,
                i, n;

            if (!ret && node[TAG_NAME]) { // only HTMLElements have children
                ret = [];
                for (i = 0, n; n = node.childNodes[i++];) {
                    if (n.tagName) {
                        ret[ret.length] = n;
                    }
                }
                _childCache[_childCache.length] = node;
                node.children = ret;
            }

            return ret || [];
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
            //'=': '^{val}$', // equality
            '~=': '(?:^|\\s+){val}(?:\\s+|$)', // space-delimited
            '|=': '^{val}-?' // optional hyphen-delimited
        },

        pseudos: {
           'first-child': function(node) { 
                return Y.Selector._children(node[PARENT_NODE])[0] === node; 
            } 
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
            var ret = [],
                query = (Selector._supportsNative() && Selector.useNative) ?
                    Selector._nativeQuery : Selector._query;
            if (selector) {
                ret = query(selector, root, firstOnly);
            }

            Selector._cleanup();
            return (firstOnly) ? (ret[0] || null) : ret;

        },

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
                token,
                id,
                className,
                tagName,
                i, len;

            if (groups.length > 1) {
                for (i = 0, len = groups.length; i < len; ++i) {
                    ret = ret.concat(arguments.callee(groups[i],
                            root, firstOnly, true)); 
                }

                ret = Selector.SORT_RESULTS ? Selector._sort(ret) : ret;
                Selector._clearFoundCache();
            } else {
                root = root || Y.config.doc;

                if (root.nodeType !== 9) { // enforce element scope
                    if (!root.id) {
                        root.id = Y.guid();
                    }
                    // fast-path ID when possible
                    // TODO: no prefilter for off-dom id
                    if (root.ownerDocument.getElementById(root.id)) {
                        selector = '#' + root.id + ' ' + selector;
                        root = root.ownerDocument;

                    }
                }

                tokens = Selector._tokenize(selector, root);
                token = tokens[tokens.length - 1];

                if (token) {
                    if (deDupe) {
                        token.deDupe = true; // TODO: better approach?
                    }
                    if (tokens[0] &&
                        root.nodeType === 9 && 
                        (id = tokens[0].attributes.id) &&
                        root.getElementById(id.value)) {
                        root = root.getElementById(id.value);
                    }

                    // prefilter nodes
                    id = token.id;
                    className = token.className;
                    tagName = token.tagName;

                    // try ID first
                    if (id && Y.config.doc.getElementById(id)) {
                        nodes = [Y.config.doc.getElementById(id)]; // TODO: DOM.byId?
                    // try className if supported
                    } else if (className && root.getElementsByClassName) {
                        nodes = root.getElementsByClassName(className);
                    } else if (tagName) { // default to tagName
                        nodes = root.getElementsByTagName(tagName || '*');
                    }
                    if (nodes.length) {
                        ret = Selector._filterNodes(nodes, tokens, firstOnly);
                    }
                }
            }

            return ret;
        },
        
        _filterNodes: function(nodes, tokens, firstOnly) {
            var i = 0,
                j,
                n,
                len = tokens.length,
                result = [],
                EQ = '=',
                node = nodes[0],
                tmpNode = node,
                operator,
                combinator,
                token,
                path,
                broke,
                test;

            do {
            //for (i = 0; tmpNode = node = nodes[i++];) {
                n = len - 1;
                path = null;
                
                //tests:
                while (tmpNode && tmpNode.tagName) {
                    broke = false;
                    token = tokens[n];
                    j = token.tests.length;
                    while ((test = token.tests[--j])) {
                        operator = test[1];
                        if (/*(operator === EQ &&*/ tmpNode[test[0]] !== test[2]) {//|| 
                            //(operator.test && !operator.test(tmpNode[test[0]]))) { 
                            tmpNode = tmpNode[path];
                            broke = true;
                            break;
                        }
                    }

                    if (broke) {
                        continue;
                    }

                    if ((combinator = token.combinator)) {
                        path = combinator.axis;
                        tmpNode = tmpNode[path];
                        n--; // move to next token

                        if (combinator.direct) {
                            path = null; // one pass only
                        }

                        continue;
                    } else { // success if we made it this far
                        result[result.length] = node;
                        if (firstOnly) {
                            return result;
                        }
                        break;
                    }
                }
            } while (tmpNode = node = nodes[++i]);
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

        combinators: {
            ' ': {
                axis: 'parentNode'
            },

            '>': {
                axis: 'parentNode',
                direct: true
            },


            '+': {
                axis: 'previousSibling',
                direct: true
            }
        },

        _parsers: [
            {
                name: ATTRIBUTES,
                re: /^\[([a-z]+\w*)+([~\|\^\$\*!=]=?)?['"]?([^\]]*?)['"]?\]/i,
                fn: function(match, token) {
                    var operator = match[2];
                    if (match[1] === 'id' ||
                            (match[1] === 'className' &&
                            document.getElementsByClassName &&
                            (operator === '~=' || operator === '='))) {
                        token.prefilter = match[1];
                        token[match[1]] = match[3];
                    }
                    if (Y.Selector.operators[operator]) {
                        match[2] = Y.Selector._getRegExp(Y.Selector.operators[operator].replace('{val}', match[3]));
                    }
                    if (!token.last || token.prefilter !== match[1]) {
                        return match.slice(1);
                    }
                }

            },
            {
                name: TAG_NAME,
                re: /^((?:-?[_a-z]+[\w-]*)|\*)/i,
                fn: function(match, token) {
                    var tag = match[1].toUpperCase();
                    token.tagName = tag;

                    if (!token.last || token.prefilter) {
                        return [TAG_NAME, '=', tag];
                    }
                    if (!token.prefilter) {
                        token.prefilter = 'tagName';
                    }
                }
            },
            {
                name: COMBINATOR,
                re: /^\s*([>+~]|\s)\s*/,
                fn: function(match, token) {
                }
            },
            {
                name: PSEUDOS,
                re: /^:([\-\w]+)(?:\(['"]?(.+)['"]?\))*/i,
                fn: function(match, token) {
                    token.pseudos[match[1]] = Selector[PSEUDOS][match[1]];
                }
            }
            ],

        _getToken: function(token) {
            return {
                tagName: null,
                id: null,
                className: null,
                attributes: {},
                pseudos: {},
                combinator: null,
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
                query = selector, // original query for debug report
                tokens = [],    // array of tokens
                found = false,  // whether or not any matches were found this pass
                match,         // the regex match
                test,
                i, parser;

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
                for (i = 0, parser; parser = Selector._parsers[i++];) {
                    if ( (match = parser.re.exec(selector)) ) { // note assignment
                        if (parser !== COMBINATOR) {
                            token.selector = match[0];
                        }
                        selector = selector.replace(match[0], ''); // strip current match from selector
                        if (!selector.length) {
                            token.last = true;
                        }
                        test = parser.fn(match, token);
                        if (test) {
                            token.tests.push(test);
                        }
                        if (!selector.length || parser.name === COMBINATOR) {
                            tokens.push(token);
                            token = Selector._getToken(token);
                            if (parser.name === COMBINATOR) {
                                token.combinator = Y.Selector.combinators[match[1]];
                            }
                        }
                        found = true;
                    }
                }
            } while (found && selector.length);

            if (!found || selector.length) { // not fully parsed
                tokens = [];
            }
            return tokens;
        },

        _replaceShorthand: function(selector) {
            var shorthand = Selector.shorthand,
                attrs = selector.match(Selector._re.attr), // pull attributes to avoid false pos on "." and "#"
                re, i, len;

            if (attrs) {
                selector = selector.replace(Selector._re.attr, 'REPLACED_ATTRIBUTE');
            }

            for (re in shorthand) {
                if (shorthand.hasOwnProperty(re)) {
                    selector = selector.replace(Selector._getRegExp(re, 'gi'), shorthand[re]);
                }
            }

            if (attrs) {
                for (i = 0, len = attrs.length; i < len; ++i) {
                    selector = selector.replace('REPLACED_ATTRIBUTE', attrs[i]);
                }
            }
            return selector;
        }
    };

Y.mix(Y.Selector, SelectorCSS2, true);


}, '@VERSION@' ,{requires:['selector-native'], skinnable:false});
