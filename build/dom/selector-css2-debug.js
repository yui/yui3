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

    TMP_PREFIX = 'yui-tmp-',

    g_counter = 0,
    g_idCache = [],
    g_passCache = {},

    g_childCache = [], // cache to cleanup expando node.children

    Selector = Y.Selector,

    SelectorCSS2 = {
        SORT_RESULTS: true,
        _children: function(node, tag) {
            var ret = node.children || node._children,
                i,
                children = [],
                childNodes,
                child;

            if ((!ret && node[TAG_NAME]) || (ret && tag)) { // only HTMLElements have children
                childNodes = ret || node.childNodes;
                ret = [];
                for (i = 0, child; child = childNodes[i++];) {
                    if (child.tagName) {
                        if (!tag || tag === child.tagName) {
                            ret.push(child);
                        }
                        if (!node.children) {
                            children.push(child);
                        }
                    }
                }
                if (!node.children && !node._children) {
                    node._children = children;
                    g_childCache.push(node);
                }
            }

            return ret || [];
        },

        _regexCache: {},

        _re: {
            attr: /(\[.*\])/g,
            pseudos: /:([\-\w]+(?:\(?:['"]?(.+)['"]?\)))*/i,
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
            '': function(node, attr) { return Y.DOM.getAttribute(node, attr) !== ''; }, // Just test for existence of attribute
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
            var ret = [];

            if (Selector.useNative && Selector._supportsNative() && // use native
                !Selector._reUnSupported.test(selector)) { // unless selector is not supported
                return Selector._nativeQuery.apply(Selector, arguments);
                
            }
            if (selector) {
                ret = Selector._query.apply(Selector, arguments);
            }

            Y.log('query: ' + selector + ' returning: ' + ret.length, 'info', 'Selector');
            Selector._cleanup();
            return (firstOnly) ? (ret[0] || null) : ret;

        },

        // TODO: make extensible? events?
        _cleanup: function() {
            for (var i = 0, node; node = g_childCache[i++];) {
                delete node._children;
            }
        /*
            for (i = 0, node; node = g_idCache[i++];) {
                node.removeAttribute('id');
            }
        */

            g_childCache = [];
            //g_passCache = {};
            //g_idCache = [];
        },

        _query: function(selector, root, firstOnly, deDupe) {
            var ret = [],
                groups = selector.split(','), // TODO: handle comma in attribute/pseudo
                nodes = [],
                rootDoc,
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

                ret = Selector._deDupe(ret);
                ret = Selector.SORT_RESULTS ? Selector._sort(ret) : ret;
            } else {
                root = root || Y.config.doc;

                tokens = Selector._tokenize(selector);

                if (root.tagName) { // enforce element scope
                    if (!root.id) { // by prepending ID
                        root.id = Y.guid();
                    }
                    selector = '#' + root.id + ' ' + selector;
                    rootDoc = root.ownerDocument;
                    tokens = Selector._tokenize(selector); // regenerate tokens
                } else {
                    rootDoc = root;
                }

                // if we have an initial ID, set to root when in document
                if (tokens[0] && rootDoc === root &&  
                        (id = tokens[0].id) &&
                        rootDoc.getElementById(id)) {
                    root = rootDoc.getElementById(id);
                }

                token = tokens[tokens.length - 1];
                if (token) {
                    // prefilter nodes
                    id = token.id;
                    className = token.className;
                    tagName = token.tagName || '*';

                    // try ID first
                    if (id) {
                        if (rootDoc.getElementById(id)) { // if in document
                        nodes = [rootDoc.getElementById(id)]; // TODO: DOM.byId?
                    }
                    // try className if supported
                    } else if (className) {
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
                len = tokens.length,
                n = len - 1,
                result = [],
                node = nodes[0],
                tmpNode = node,
                getters = Y.Selector.getters,
                operator,
                combinator,
                token,
                path,
                pass,
                FUNCTION = 'function',
                value,
                tests,
                test;

            //do {
            for (i = 0; tmpNode = node = nodes[i++];) {
                n = len - 1;
                path = null;
                
                testLoop:
                while (tmpNode && tmpNode.tagName) {
                    token = tokens[n];
                    //pass = g_passCache[tmpNode.id];
                    tests = token.tests;
                    j = tests.length;
                    if (j && !pass) {
                        while ((test = tests[--j])) {
                            operator = test[1];
                            value = tmpNode[test[0]];

                            // skip node as soon as a test fails 
                            if (getters[test[0]]) {
                                value = getters[test[0]](tmpNode, test[0]);
                            }
                            if ((operator === '=' && value !== test[2]) ||  // fast path for equality
                                (operator.test && !operator.test(value)) ||  // regex test
                                (operator.call && !operator(tmpNode, test[0]))) { // function test

                                // skip non element nodes or non-matching tags
                                if ((tmpNode = tmpNode[path])) {
                                    while (tmpNode &&
                                        (!tmpNode.tagName ||
                                            (token.tagName && token.tagName !== tmpNode.tagName))
                                    ) {
                                        tmpNode = tmpNode[path]; 
                                    }
                                }
                                continue testLoop;
                            }
                        }
                    }

                    n--; // move to next token
                    // now that we've passed the test, move up the tree by combinator
                    if (!pass && (combinator = token.combinator)) {
                        path = combinator.axis;
                        tmpNode = tmpNode[path];

                        // skip non element nodes
                        while (tmpNode && !tmpNode.tagName) {
                            tmpNode = tmpNode[path]; 
                        }

                        if (combinator.direct) { // one pass only
                            path = null; 
                        }

                    } else { // success if we made it this far
                        result.push(node);
                        /*
                        if (!pass) {
                            if (!tmpNode.id) {
                                tmpNode.id = TMP_PREFIX + g_counter++;
                                g_idCache.push(tmpNode);
                            }
                            //g_passCache[tmpNode.id] = 1;
                        }
                        */
                        if (firstOnly) {
                            return result;
                        }
                        break;
                    }
                }
            }// while (tmpNode = node = nodes[++i]);
            node = tmpNode = null;
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
                    var operator = match[2] || '',
                        operators = Y.Selector.operators,
                        test;

                    // add prefiltering for ID and CLASS
                    if ((match[1] === 'id' && operator === '=') ||
                            (match[1] === 'className' &&
                            document.getElementsByClassName &&
                            (operator === '~=' || operator === '='))) {
                        token.prefilter = match[1];
                        token[match[1]] = match[3];
                    }

                    // add tests
                    if (operator in operators) {
                        test = operators[operator];
                        if (typeof test === 'string') {
                            test = Y.Selector._getRegExp(test.replace('{val}', match[3]));
                        }
                        match[2] = test;
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

                    if (tag !== '*' && (!token.last || token.prefilter)) {
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
                    var test = Selector[PSEUDOS][match[1]];
                    if (test) { // reorder match array
                        return [match[2], test];
                    }
                }
            }
            ],

        _getToken: function(token) {
            return {
                tagName: null,
                id: null,
                className: null,
                attributes: {},
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
                        if (parser !== COMBINATOR ) {
                            token.selector = selector;
                        }
                        selector = selector.replace(match[0], ''); // strip current match from selector
                        if (!selector.length) {
                            token.last = true;
                        }

                        if (Selector._attrFilters[match[1]]) { // convert class to className, etc.
                            match[1] = Selector._attrFilters[match[1]];
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
                Y.log('query: ' + query + ' contains unsupported token in: ' + selector, 'warn', 'Selector');
                tokens = [];
            }
            return tokens;
        },

        _replaceShorthand: function(selector) {
            var shorthand = Selector.shorthand,
                attrs = selector.match(Selector._re.attr), // pull attributes to avoid false pos on "." and "#"
                pseudos = selector.match(Selector._re.pseudos), // pull attributes to avoid false pos on "." and "#"
                re, i, len;

            if (pseudos) {
                selector = selector.replace(Selector._re.pseudos, 'REPLACED_PSEUDO');
            }

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
            if (pseudos) {
                for (i = 0, len = pseudos.length; i < len; ++i) {
                    selector = selector.replace('REPLACED_PSEUDO', pseudos[i]);
                }
            }
            return selector;
        },

        _attrFilters: {
            'class': 'className',
            'for': 'htmlFor'
        },

        getters: {
            href: function(node, attr) {
                return Y.DOM.getAttribute(node, attr);
            }
        }
    };

Y.mix(Y.Selector, SelectorCSS2, true);
Y.Selector.getters.src = Y.Selector.getters.rel = Y.Selector.getters.href;


}, '@VERSION@' ,{requires:['selector-native'], skinnable:false});
