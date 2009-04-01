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
