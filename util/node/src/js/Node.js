(function() {
/**
 * The node module abstracts common DOM tasks.
 * @module node
 */
var M = function(Y) {
    
    var reNth = /^(?:([-]?\d*)(n){1}|(odd|even)$)*([-+]?\d*)$/;

    var foundCache = [];
    var regexCache = {};

    var clearFoundCache = function() {
        Y.log('getBySelector: clearing found cache of ' + foundCache.length + ' elements');
        for (var i = 0, len = foundCache.length; i < len; ++i) {
            try { // IE no like delete
                delete foundCache[i]._found;
            } catch(e) {
                foundCache[i].removeAttribute('_found');
            }
        }
        foundCache = [];
        Y.log('getBySelector: done clearing foundCache');
    };

    var getRegExp = function(str, flags) {
        flags = flags || '';
        if (!regexCache[str + flags]) {
            regexCache[str + flags] = new RegExp(str, flags);
        }
        return regexCache[str + flags];
    };

    var combinators = {
        ' ': function(node, token) {
            node = node.parentNode;
            while (node && node.tagName) {
                if (rTestNode(node, null, token.previous)) {
                    return true;
                }
                node = node.parentNode;
            }  
            return false;
        },

        '>': function(node, token) {
            return rTestNode(node.parentNode, null, token.previous);
        },

        '+': function(node, token) {
            var sib = _.previousSibling(node);
            if (sib && rTestNode(sib, null, token.previous)) {
                return true; 
            }
            return false;
        },

        '~': function(node, token) {
            var sib = _.previousSibling(node);
            while (sib) {
                if (rTestNode(sib, null, token.previous)) {
                    return true;
                }
                sib = _.previousSibling(sib);
            }

            return false;
        }
    };

    /*
        an+b = get every _a_th node starting at the _b_th
        0n+b = no repeat ("0" and "n" may both be omitted (together) , e.g. "0n+1" or "1", not "0+1"), return only the _b_th element
        1n+b =  get every element starting from b ("1" may may be omitted, e.g. "1n+0" or "n+0" or "n")
        an+0 = get every _a_th element, "0" may be omitted 
    */
    var getNth = function(node, expr, tag, reverse) {
        var re = reNth;

        if (tag) {
            tag = tag.toLowerCase();
        }
        re.test(expr);

        var a = parseInt(RegExp.$1, 10), // include every _a_ elements (zero means no repeat, just first _a_)
            n = RegExp.$2, // "n"
            oddeven = RegExp.$3, // "odd" or "even"
            b = parseInt(RegExp.$4, 10) || 0, // start scan from element _b_
            result = [];

        var siblings = _.children(node.parentNode, tag);

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
        attributes: /^\[([a-z]+\w*)+([~\|\^\$\*!=]=?)?['"]?([^\]]*)['"]?\]*/i,
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
                        token.tag = token.tag || '*';
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
        var attrs = selector.match(patterns.attributes); // pull attributes to avoid false pos on "." and "#" in attrs/pseudos
        if (attrs) {
            selector = selector.replace(patterns.attributes, 'REPLACED_ATTRIBUTE');
        }
        for (var re in shorthand) {
            selector = selector.replace(getRegExp(re, 'gi'), shorthand[re]);
        }

        if (attrs) { // put atts back
            for (var i = 0, len = attrs.length; i < len; ++i) {
                selector = selector.replace('REPLACED_ATTRIBUTE', attrs[i]);
            }
        }
        return selector;
    };
    var Selector = {
        /**
         * Mapping of attributes to aliases, normally to work around HTMLAttributes
         * that conflict with JS reserved words.
         * @property attrAliases
         * @type object
         */
        attrAliases: {
            'for': 'htmlFor'
        },

        /**
         * Mapping of shorthand tokens to corresponding attribute selector 
         * @property shorthand
         * @type object
         */
        shorthand: {
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
                return _.children(node.parentNode)[0] === node;
            },

            'last-child': function(node) {
                var children = _.children(node.parentNode);
                return children[children.length - 1] === node;
            },

            'first-of-type': function(node, val) {
                return _.children(node.parentNode, node.tagName.toLowerCase())[0];
            },
             
            'last-of-type': function(node, val) {
                var children = _.children(node.parentNode, node.tagName.toLowerCase());
                return children[children.length - 1];
            },
             
            'only-child': function(node) {
                var children = _.children(node.parentNode);
                return children.length === 1 && children[0] === node;
            },

            'only-of-type': function(node) {
                return _.children(node.parentNode, node.tagName.toLowerCase()).length === 1;
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
            node = Y.config.doc.getElementById(node) || node;
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
            if (!arr || !selector) {
                Y.log('filter: invalid input, returning array as is', 'warn', 'Selector');
            }

            result = rFilter(nodes, tokenize(selector)[0]);
            Y.log('filter: returning:' + result.length, 'info', 'Selector');
            return result;
        },

        /**
         * Retrieves a set of nodes based on a given CSS selector. 
         * @method query
         *
         * @param {string} selector The CSS Selector to test the node against.
         * @param {HTMLElement | String} root optional An id or HTMLElement to start the query from. Defaults to Y.config.doc.
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
        var result = firstOnly ? null : [];

        if (!selector) {
            return result; // no nodes for you
        }
        var groups = selector.split(','); // TODO: attributes && contains pseudo allows comma

        if (groups.length > 1) {
            var found;
            for (var i = 0, len = groups.length; i < len; ++i) {
                    found = arguments.callee(groups[i], root, firstOnly, true); 
                if (firstOnly) {
                    result = found;
                } else {
                    result = result.concat(found); 
                }
            }
            clearFoundCache();
            return result;
        }

        if (root && !root.tagName) {
            root = Y.config.doc.getElementById(root);
            if (!root) {
                Y.log('invalid root node provided', 'warn', 'Selector');
                return firstOnly ? null : [];
            }
        }

        root = root || Y.config.doc;
        var tokens = tokenize(selector);
        var idToken = tokens[getIdTokenIndex(tokens)],
            nodes = [],
            node,
            id,
            token = tokens.pop() || {};
            
        if (idToken) {
            id = getId(idToken.attributes);
        }

        // if no root is specified use id shortcut if possible
        if (id) {
            if (id === token.id) { // only one target
                nodes = [Y.config.doc.getElementById(id)] || root;
            } else { // reset root to id node if passes
                node = Y.config.doc.getElementById(id);
                if (root === Y.config.doc || _.contains(node, root)) {
                    if ( node && rTestNode(node, null, idToken) ) {
                        root = node; // start from here
                    }
                } else {
                    return result;
                }
            }
        }

        if (root && !nodes.length) {
            nodes = root.getElementsByTagName(token.tag);
        }

        if (nodes.length) {
            result = rFilter(nodes, token, firstOnly, deDupe); 
        }
        return result;
    };

    var rFilter = function(nodes, token, firstOnly, deDupe) {
        var result = firstOnly ? null : [];

        for (var i = 0, len = nodes.length; i < len; ++i) {
            if (!rTestNode(nodes[i], 0, token) || (deDupe && nodes[i]._found) ) {
                continue;
            }

            if (firstOnly) {
                return nodes[i];
            }
            if (deDupe) {
                nodes[i]._found = true;
                foundCache[foundCache.length] = nodes[i];
            }

            result[result.length] = nodes[i];
        }

        return result;
    };

    var rTestNode = function(node, selector, token) {
        token = token || tokenize(selector).pop() || {};

        if (!node || node._found || (token.tag != '*' && node.tagName.toLowerCase() != token.tag)) {
            return false;
        } 

        var ops = Selector.operators,
            ps = Selector.pseudos,
            attr = token.attributes,
            pseudos = token.pseudos,
            prev = token.previous;

        if (attr.length) {
            for (var i = 0, len = attr.length; i < len; ++i) {
                if (ops[attr[i][1]] &&
                        !ops[attr[i][1]](node.getAttribute(attr[i][0], 2),
                                attr[i][2])) {
                    return false;
                }
            }
        }

        if (pseudos.length) {
            for (i = 0, len = pseudos.length; i < len; ++i) {
                if (ps[pseudos[i][0]] &&
                        !ps[pseudos[i][0]](node, pseudos[i][1])) {
                    return false;
                }
            }
        }

        if (prev) {
            if (prev.combinator !== ',') {
                return combinators[prev.combinator](node, token);
            }
        }
        return true;

    };


    if (YAHOO.env.ua.ie) { // rewrite class for IE (others use getAttribute('class')
        Selector.attrAliases['class'] = 'className';
    }
    /**
     * Provides both an HTMLElement facade and static DOM methods.
     * 
     * Methods that return HTMLElements always return Node instances.
     *
     * Methods that return HTMLCollections always return NodeList instances.
     *
     * DOM properties are called as methods (e.g. "foo.tagName" -> "foo.tagName()") 
     *
     * usage:
     * <pre><code>

     * var node = Node.get('#foo'); // returns a Node instance bound to element with ID = foo
     * node.style('color', 'red');
     *
     * Node.style('#foo', 'color', 'red'); // applies to element with ID = foo 
     *
     * var node = Node.get('.foo'); // Node instance bound to the first matching element
     * node.style('color', 'red');
     *
     * Node.style('.foo', 'color', 'red'); // applies to first matching element

     * Node.get('#foo').removeChild('#bar'); // returns Node instance of #bar
     * Node.removeChild('#foo', '#bar');    // ditto
     *
     * Node.get('#foo').children(); // returns NodeList instance of #foo children
     * Node.children('#foo');      // ditto

     *</code></pre> 
     *
     * @class Node
     */
    Y.Node = function(node) {
        return this.init.apply(this, arguments);
    };

    var PROPERTIES = {
            READ: [
            'offsetWidth',
            'offsetHeight',
            'clientHeight',
            'clientWidth',
            'offsetTop',
            'offsetLeft',
            'offsetParent',
            'parentNode',
            'scrollWidth',
            'scrollHeight',
            'tagName',
            'nodeName',
            'nodeType',
            'text'
        ],

        WRITE: [
            'scrollTop',
            'scrollLeft'
        ]
    };

    var regexCache = {}; // TODO: move to store
    var _store = {
        nodes: {},
        styles: {},
        regex: {}
    };

/*
    var _store = new Y.State();
    _store.add({'styles':{}, 'nodes': {}});

*/
    var getRootNode = function(node) {
        return _store.nodes[node._id];
        //return _store.get(nodes, node._id);
        //return _store.data.nodes[node._id];
    };

    // for use with methods that accept DOMNodes, Y.Nodes, or Strings (selectors)
    var getDOMNode = function(node) {
        if (Y.lang.isString(node)) {
            var root = node.search(/^\*/) ? null : getRootNode(this); // "*" prefix resets root
            return Selector.query(node, root, true);

        }
        return      (node.att) ? getRootNode(node) :
                    (node.nodeName) ?  node :
                    null;
    };


    /**
     * Factory method for creating Nodes.
     * String is treated as Selector
     * @method get
     * @static
     * @param node {String|Node|HTMLElement}
     * @return {Node}
     */
    Y.Node.get = function(node) {
        if (node.att) {
            return node; // is a Node instance TODO: better Node detection (instanceof, etc.)
        }

        // TODO: allow caching?
        return new Y.Node(node);
    };

    /**
     * Returns the HTMLElement bound to the Node instance.
     * @method getDOMNode
     * @static
     * @param node {Node}
     * @return {HTMLElement}
     */
    Y.Node.getDOMNode = getRootNode; // insecure

    var _createNode = function(data) {
        var frag = Y.config.doc.createElement('div');
        if (typeof data == 'string') { // TODO: strip scripts
            frag.innerHTML = (typeof data == 'string') ? data : _createHTML(data);
        }
        return frag.firstChild;
    };

    var _createHTML = function(jsonml) {
        var html = [];
        var att = [];

        if (Y.lang.isString(jsonml)) { // text node
            return jsonml;
        }

        if (!jsonml || !jsonml.push) { // isArray
            return ''; // expecting array 
        }

        var tag = jsonml[0];
        if (!Y.lang.isString(tag)) {
            return null; // bad tag error
        }

        for (var i = 1, len = jsonml.length; i < len; ++i) {
            if (typeof jsonml[i] === 'string' || jsonml[i].push) {
                html[html.length] = _createHTML(jsonml[i]);
            } else if (typeof jsonml[i] == 'object') {
                for (var attr in jsonml[i]) {
                    att[att.length] = ' ' + attr + '="' + jsonml[i][attr] + '"';
                }
            }
        }
        return '<' + tag + att.join('') + '>' + html.join('') + '</' + tag + '>';
        
    };

    Y.Node.create = function(jsonml) {
        return new Y.Node(_createNode(jsonml));
    };

    Y.Node.prototype = {
        init: function(node) {
            if (Y.lang.isString(node)) { // selector
                node = Selector.query(node, null, true);
            }
            
            if (!node || node.nodeType !== 1) {
                Y.log('invalid node', 'error', 'Node');
                return null;
            }

            this._id = Y.stamp(node); //node.id = node.id || 'yui-gen' + _idCounter++;

            _store.nodes[this._id] = node;
            _store.styles[this._id] = node.style;
            //_store.data.nodes[this._id] = node;
            //_store.data.styles[this._id] = node.style;
            return this;
        }
    };

    var xy = function() {
        if (document.documentElement.getBoundingClientRect) { // IE
            return function(node, xy) {
                if (xy !== undefined) { // set
                    return setXY(node, xy);
                } // else get
                var doc = node.ownerDocument,
                    scrollLeft = Math.max(doc.scrollLeft, doc.body.scrollLeft),
                    scrollTop = Math.max(doc.scrollTop, doc.body.scrollTop),
                    box = node.getBoundingClientRect(),
                    xy = [box.left, box.top];

                if ((scrollTop || scrollLeft) && _.style(node, 'position') != 'fixed') { // no scroll accounting for fixed
                    xy[0] += scrollLeft;
                    xy[1] += scrollTop;
                }
                return xy;
            };
        } else {
            return function(node, xy, noScroll) { // manually calculate by crawling up offsetParents
                if (xy !== undefined) { // set
                    return setXY(node, xy, noScroll);
                } // else get
                var xy = [node.offsetLeft, node.offsetTop];

                var parentNode = node;
                while (parentNode = parentNode.offsetParent) {
                    xy[0] += parentNode.offsetLeft;
                    xy[1] += parentNode.offsetTop;
                }

                // account for any scrolled ancestors
                if (!noScroll && _.style(node, 'position') != 'fixed') {
                    parentNode = node;
                    while (parentNode = parentNode.parentNode) {// &&
                            //parentNode.nodeName.toUpperCase() != 'HTML') {
                        if (parentNode.scrollTop || parentNode.scrollLeft) {
                            xy[0] -= parentNode.scrollLeft;
                            xy[1] -= parentNode.scrollTop;
                        }
                    }

                }
                return xy;
            };
        }
    }();// NOTE: Executing for loadtime branching

    
    var setXY = function(node, xy, noRetry) {
        var style = _.style,
            pos = style(node, 'position'),
            delta = [ // assuming pixels; if not we will have to retry
                parseInt( style(node, 'left'), 10 ),
                parseInt( style(node, 'top'), 10 )
            ];
    
        if (pos == 'static') { // default to relative
            pos = 'relative';
            style(node, 'position', pos);
        }

        var currentXY = _.xy(node);
        if (currentXY === false) { // has to be part of doc to have xy
            YAHOO.log('xy failed: node not available', 'error', 'Node');
            return false; 
        }
        
        if ( isNaN(delta[0]) ) {// in case of 'auto'
            delta[0] = (pos == 'relative') ? 0 : node.offsetLeft;
        } 
        if ( isNaN(delta[1]) ) { // in case of 'auto'
            delta[1] = (pos == 'relative') ? 0 : node.offsetTop;
        } 

        if (pos[0] !== null) { node.style.left = xy[0] - currentXY[0] + delta[0] + 'px'; }
        if (pos[1] !== null) { node.style.top = xy[1] - currentXY[1] + delta[1] + 'px'; }
      
        if (!noRetry) {
            var newXY = _.xy(node);

            // if retry is true, try one more time if we miss 
           if ( (xy[0] !== null && newXY[0] != xy[0]) || 
                (xy[1] !== null && newXY[1] != xy[1]) ) {
               setXY(node, xy, true);
           }
        }        

        YAHOO.log('xy setting position to ' + pos, 'info', 'Node');
    };
    
    var _ = {
        att: function(node, attr, val) { // overloaded for set/get
            if (val !== undefined) { // set
                if (attr.indexOf('class') > -1) { // TODO: abstract this out
                    node.className = val;
                } else { 
                    if (node[attr] !== undefined) { // disallow custom attributes
                        node.setAttribute(attr, val); // no DOM0 set for security
                    } else {
                        Y.log('invalid attribute "' + attr + '"', 'error', 'Node');
                    }
                }
                return;
            } // else get

            if (attr.indexOf('class') > -1) { // TODO: abstract this out
                return node.className;
            }
            return node.getAttribute(attr, 2); // get (no DOM0 for security)
        },

        atts: function(node, atts) { // overloaded for set/get/getAll
            if (atts) { // set
                Y.each(atts, function(val, att) { // set 1 one or more
                    Y.Node.att(node, att, val);
                });
                return;
            }

            // else get
            var attributes = {};
            Y.each(node.attributes, function(att, index) {
                attributes[att.nodeName] = node.getAttribute(att.nodeName);
            });
            return attributes;

        },

        queryAll: function(node, selector) {
            return Selector.query(selector, node);
        },

        query: function(node, selector) {
            return Selector.query(selector, node, true);
        },

        hasChildren: function(node) {
            return !!_.children(node).length;
        },

        hasChildNodes: function(node) {
            return !!node.childNodes.length;
        },

        childNodes: function(node) {
            return node.childNodes;
        },

        replaceChild: function(node, newNode, oldNode) {
            newNode = getDOMNode.call(this, newNode);
            oldNode = getDOMNode.call(this, oldNode);
            node.insertBefore(newNode, oldNode);
            return node.removeChild(oldNode); // return replaced per spec
        },

        removeChild: function(node, child) { // returns removed
            child = getDOMNode(child);
            return node.removeChild(child);
        },

        insertBefore: function(node, child, refNode) {
            child = getDOMNode(child);
            refNode = getDOMNode(refNode);
            return node.insertBefore(child, refNode); 
        },

        appendChild: function(node, child) {
            child = getDOMNode(child);
            node.appendChild(child);
            return child;
        },

        nextSibling: function(node) {
            while ( (node = node.nextSibling) && !node.tagName );
            return node;
        },

        previousSibling: function(node) {
            while ( (node = node.previousSibling) && !node.tagName );
            return node;
        },

        // TODO: allow access to textNodes?
        firstChild: function(node) {
            var child = ( node.firstChild && node.firstChild.nodeType === 1 ) ? node.firstChild : null;
            return child || Y.Node.nextSibling(node.firstChild);
        },

        lastChild: function(node) {
            var child = ( node.lastChild && node.lastChild.nodeType === 1 ) ? node.lastChild : null;
            return child || Y.Node.previousSibling(node.firstChild);
        },

        innerHTML: function(node, html) { // overloaded for get/set
            if (html !== undefined) { // set
                node.innerHTML = html;
                return this;
            }

            return node.innerHTML; // get
        },

        style: function(node, attr, val) { // overloaded for get/set
            if (!node.uid) {
                Y.stamp(node);
                _store.styles[node.uid] = node.style; // for faster style access
            }

            var style = _store.styles[node.uid];
            //var style = node.style;

            if (val !== undefined) { // set 
                style[attr] = val; 
                return;
            } // else set
            return style[attr] || Y.Node.computedStyle(node, attr);
        },

        styles: function(node, styles) {
            Y.each(styles, function(val, attribute) {
                node.style(attribute, val);
            }, Y.Node);
        },

        focus: function(node) {
            node.focus();
        },

        blur: function(node) {
            node.blur();
        },

        hasClass: function(node, className) {
            var re = getRegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
            return re.test(node.className);
        },

        addClass: function(node, className) {
            if (Y.Node.hasClass(node, className)) {
                return; // already present
            }
            
            //Y.log('addClass adding ' + className, 'info', 'Node');
            
            node.className = Y.lang.trim([node.className, className].join(' '));
        },

        removeClass: function(node, className) {
            if (!className || !Y.Node.hasClass(node, className)) {
                return; // not present
            }                 

            //Y.log('removeClass removing ' + className, 'info', 'Node');
            
            node.className = Y.lang.trim(node.className.replace(getRegExp('(?:^|\\s+)'
                    + className + '(?:\\s+|$)'), ' '));

            if ( Y.Node.hasClass(node, className) ) { // in case of multiple adjacent
                Y.Node.removeClass(node, className);
            }
        },

        replaceClass: function(node, newC, oldC) {
            Y.log('replaceClass replacing ' + oldC + ' with ' + newC, 'info', 'Node');
        
            if ( !Y.Node.hasClass(node, oldC) ) {
                //Y.Node.addClass(node, newC); // just add it if nothing to replace
                return; // NOTE: return
            }
        
            var re = getRegExp('(?:^|\\s+)' + oldC + '(?:\\s+|$)');
            node.className = node.className.replace(re, ' ' + newC + ' ');

            if ( Y.Node.hasClass(node, oldC) ) { // in case of multiple adjacent
                Y.Node.replaceClass(node, oldC, newC);
            }

            node.className = Y.lang.trim(node.className); // remove any trailing spaces
        },

        addListener: function() {
            Y.Event.addListener.apply(Y.Event, arguments);
        },

        removeListener: function() {
            Y.Event.removeListener.apply(Y.Event, arguments);
        },

        contains: function() {
            if (document.documentElement.contains)  {
                return function(haystack, needle) {
                    needle = getDOMNode(needle);
                    return haystack.contains(needle);
                };
            } else if ( document.documentElement.compareDocumentPosition ) { // gecko
                return function(haystack, needle) {
                    needle = getDOMNode(needle);
                    return !!(haystack.compareDocumentPosition(needle) & 16);
                };
            }
        }(),

        children: function() {
            if (document.documentElement.children) { // document for capability test
                return function(node, tag) {
                    return (tag) ? node.children.tags(tag) : node.children || [];
                };
            } else { // gecko
                return function(node, tag) {
                    var children = [],
                        childNodes = node.childNodes;

                    for (var i = 0, len = childNodes.length; i < len; ++i) {
                        if (childNodes[i].tagName) {
                            if (!tag || childNodes[i].tagName.toLowerCase() === tag) {
                                children[children.length] = childNodes[i];
                            }
                        }
                    }
                    return children;
                };
            }
        }(),

        scrollIntoView: function(node) {
            node.scrollIntoView();
        },

        xy: xy
    };

/*
    if (document.defaultView && document.defaultView.getComputedStyle) { // W3C DOM method
        _.computedStyle = function(node, property) {
            var computed = document.defaultView.getComputedStyle(node, '');
            var value = (computed) ? computed[property] : null;
            return value;
        };
    } else if (document.documentElement.currentStyle) { // IE method
        _.computedStyle = function(node, property) {
            return node.currentStyle[property];
        };
    }
*/
    _.on = _.addListener;

    //Y._Dom = _; // TODO: expose?

// IE getComputedStyle
    var regex = {
        layout:     /^height|width|top|bottom|left|right$/,
        size:       /^width|height$/,
        unit:       /^(\d[.\d]*)+(em|ex|px|gd|rem|vw|vh|vm|ch|mm|cm|in|pt|pc|deg|rad|ms|s|hz|khz|%){1}?/i      
    };

    // branching at load instead of runtime
    if (document.defaultView && document.defaultView.getComputedStyle) { // W3C DOM method
        _.computedStyle = function(el, property) {
            var computed = document.defaultView.getComputedStyle(el, '');
            var value = (computed) ? computed[property] : null;
            return value;
        };
    } else if (document.documentElement.currentStyle) { // IE method
        // Implement computedStyle in IE
        // TODO: unit-less lineHeight (e.g. 1.22)
        _.computedStyle = function(el, property) {
            var value = null,
                current = el.currentStyle[property];

            if (current === undefined || current.indexOf('px') > -1) {
                return current; // no need to convert
            }
            if (regex.layout.test(property)) {
                value = getPixelLayout(el, property);
            } else {
                value = getPixel(el, property);
            }

            return value !== null ? value + 'px' : el.style[property] || current;
        };
    }

    var getPixelLayout = function(el, prop) {
        var current = el.currentStyle[prop],                        // value of "width", "top", etc.
            capped = prop.charAt(0).toUpperCase() + prop.substr(1), // "Width", "Top", etc.
            offset = 'offset' + capped,                             // "offsetWidth", "offsetTop", etc.
            pixel = 'pixel' + capped,                               // "pixelWidth", "pixelTop", etc.
            value = null;

        if (current == 'auto') {
            var actual = el[offset]; // offsetHeight/Top etc.
            if (actual === undefined) { // likely "right" or "bottom"
                return 0;
            }

            value = actual;
            if (regex.size.test(prop)) { // account for box model diff 
                el.style[prop] = actual + 'px'; 
                if (el[offset] > actual) {
                    // the difference is padding + border (works in Standards & Quirks modes)
                    value = parseInt(actual - (el[offset] - actual));
                }
                el.style[prop] = 'auto'; // revert to auto
            }
        } else if (current.indexOf('px') > -1) { // no need to compute
               value = parseInt(current); 
        } else { // convert units to px
            if (!el.style[pixel] && !el.style[prop]) { // need to map style.width to currentStyle (no currentStyle.pixelWidth)
                el.style[prop] = current;              // no style.pixelWidth if no style.width
            }
            value = el.style[pixel];
        }
        return value;
    };

    var getPixel = function(el, property) {
        // use pixelRight to convert to px
        var value = null,
            styleRight = el.currentStyle.right,
            current = el.currentStyle[property];

        el.style.right = current;
        value = el.style.pixelRight;
        el.style.right = styleRight; // revert

        return value;
    };

    var applyStatic = function(f) {
        Y.Node[f] = function(node, arg1, arg2, arg3) {
            node = (node && node.nodeType === 1) ? node : // DOMNode
                   (node && node._id) ? _nodes[node._id] : // Y.Node
                    Selector.query(node, null, true); // selector
                                
            if (!node) {
                throw new Error('invalid node');
            }

            var returnVal = _[f].call(this, node, arg1, arg2, arg3);
            if (returnVal !== undefined) {
                if (returnVal.nodeType) { // wrap DOMNode
                    returnVal = Y.Node.get(returnVal);
                } else if (returnVal.item) { // wrap DOMNodeList
                    returnVal = Y.NodeList.get(returnVal);
                }
            }
            return returnVal;
        };
    };

    var applyProto = function(f) {
        Y.Node.prototype[f] = function(arg1, arg2, arg3) {
            var returnVal = _[f].call(this, _store.nodes[this._id], arg1, arg2, arg3);
            if (returnVal === undefined) {
                return this;
            } else if (returnVal.nodeType) { // wrap DOMNode
                return Y.Node.get(returnVal);
            } else if (returnVal.item) { // wrap DOMNodeList
                return Y.NodeList.get(returnVal);
            }
            return returnVal;
        };
    };

    for (var f in _) {
        applyProto(f);
        applyStatic(f);
    }

    Y.Node.style = function(node, att, val) {
        node = node.nodeType === 1 ? node : Selector.query(node, null, true); 
        return _.style(node, att, val); 
    };

    Y.Node.prototype.style = function(att, val) {
        if (att == 'opacity') {
            //setOpacity;

            // getOpacity;
        }
        if (val !== undefined) {
            _store.styles[this._id][att] = val;
            return this;
        }
        return _store.styles[this._id][att];
        return _.style(_store.nodes[this._id], att, val) || this;
    };
    // dynamically create prototype methods for simple DOM properties

    // readonly
    var PROPF = {
        read: function(prop) {
            return function() {
                return getRootNode(this)[prop];
            };
        },

        // read/write
        write: function(prop) {
            return function(val) {
                if (val) { // set
                    getRootNode(this)[prop] = val;
                    return this;
                }
                return getRootNode(this)[prop]; // get
            };
        }
    };

    Y.each(PROPERTIES, function(props, type) {
            Y.each(props, function(prop) {
                Y.Node.prototype[prop] = PROPF[type.toLowerCase()]([prop]);
        });

    });

    var applyInstance = function(instance, nodes, f) {
        instance[f] = function() {
            var extraArgs = [].concat.call(arguments);
            return each(nodes, function(node) {
                var args = [node].concat(extraArgs);
                return Y.Node[f].apply(Y.Node, args);
            });
        };
    };

    var _nodeLists = {};

    Y.NodeList = function(nodes) {
        nodes = Y.lang.isString(nodes) ? Selector.query(nodes) : nodes;
        this._id = Y.guid();
        _nodeLists[this._id] = nodes;
        //this._nodes = nodes;
    };

    Y.NodeList.prototype = {
        item: function(index) {
            return Y.Node.get(_nodeLists[this._id][index]);
        },

        filter: function(selector) {
            Selector.filter(nodes, selector);
            return this;
        },

        length: function() {
            return _nodeLists[this._id].length;
        }
    };

    Y.each(_, function(f, name) {
        Y.NodeList.prototype[name] = function(arg1, arg2, arg3) {
            var nodes = _nodeLists[this._id];

            for (var i = 0, len = nodes.length; i < len; ++i) {
                f.call(this, nodes[i], arg1, arg2, arg3);
            }
            return this; // always chains
        };
    });

    Y.NodeList.style = function(att, val) {
        var nodes = _nodeLists[this._id];

        for (var i = 0, len = nodes.length; i < len; ++i) {
            _.style(nodes[i], att, val);
        }
        return this; // always chains
    };

    Y.NodeList.get = function(nodes) {
        return new Y.NodeList(nodes); 
    };

    var each = function(nodes, f) { // private each to prevent hijack
        var result = [];

        for (var i = 0, len = nodes.length; i < len; ++i) {
            result[result.length] = f(nodes[i]);
        }
        return result;
    };


};

YUI.add("node", M, "3.0.0");
})();
