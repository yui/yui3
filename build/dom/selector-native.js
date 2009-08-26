YUI.add('selector-native', function(Y) {

(function(Y) {
/**
 * The selector-native module provides support for native querySelector
 * @module dom
 * @submodule selector-native
 * @for Selector
 */

/**
 * Provides support for using CSS selectors to query the DOM 
 * @class Selector 
 * @static
 * @for Selector
 */

Y.namespace('Selector'); // allow native module to standalone

var COMPARE_DOCUMENT_POSITION = 'compareDocumentPosition',
    OWNER_DOCUMENT = 'ownerDocument',
    TMP_PREFIX = 'yui-tmp-',
    g_counter = 0;

var Selector = {
    _reLead: /^\s*([>+~]|:self)/,
    _reUnSupported: /!./g,

    _foundCache: [],

    _supportsNative: function() {
        // whitelist and feature detection to manage
        // future implementations manually
        return ( (Y.UA.ie >= 8 || Y.UA.webkit > 525) && // || Y.UA.gecko >= 1.9) &&
            document.querySelectorAll);
    },

    useNative: true,

    _toArray: function(nodes) { // TODO: move to Y.Array
        var ret = nodes,
            i, len;

        if (!nodes.slice) {
            try {
                ret = Array.prototype.slice.call(nodes);
            } catch(e) { // IE: requires manual copy
                ret = [];
                for (i = 0, len = nodes.length; i < len; ++i) {
                    ret[i] = nodes[i];
                }
            }
        }
        return ret;
    },

    _clearFoundCache: function() {
        var foundCache = Selector._foundCache,
            i, len;

        for (i = 0, len = foundCache.length; i < len; ++i) {
            try { // IE no like delete
                delete foundCache[i]._found;
            } catch(e) {
                foundCache[i].removeAttribute('_found');
            }
        }
        foundCache = [];
    },

    _compare: ('sourceIndex' in document.documentElement) ?
        function(nodeA, nodeB) {
            var a = nodeA.sourceIndex,
                b = nodeB.sourceIndex;

            if (a === b) {
                return 0;
            } else if (a > b) {
                return 1;
            }

            return -1;

        } : (document.documentElement[COMPARE_DOCUMENT_POSITION] ?
        function(nodeA, nodeB) {
            if (nodeA[COMPARE_DOCUMENT_POSITION](nodeB) & 4) {
                return -1;
            } else {
                return 1;
            }
        } :
        function(nodeA, nodeB) {
            var rangeA, rangeB, compare;
            if (nodeA && nodeB) {
                rangeA = nodeA[OWNER_DOCUMENT].createRange();
                rangeA.setStart(nodeA, 0);
                rangeB = nodeB[OWNER_DOCUMENT].createRange();
                rangeB.setStart(nodeB, 0);
                compare = rangeA.compareBoundaryPoints(Range.START_TO_END, rangeB);
            }

            return compare;
        
    }),

    _sort: function(nodes) {
        if (nodes) {
            nodes = Selector._toArray(nodes);
            if (nodes.sort) {
                nodes.sort(Selector._compare);
            }
        }

        return nodes;
    },

    _deDupe: function(nodes) {
        var ret = [],
            cache = Selector._foundCache,
            i, node;

        for (i = 0, node; node = nodes[i++];) {
            if (!node._found) {
                ret[ret.length] = cache[cache.length] = node;
                node._found = true;
            }
        }
        Selector._clearFoundCache();
        return ret;
    },

    // allows element scoped queries to begin with combinator
    // e.g. query('> p', document.body) === query('body > p')
    _prepQuery: function(root, selector) {
        var groups = selector.split(','),
            queries = [],
            inDoc = true,
            isDocRoot = (root && root.nodeType === 9),
            i, len;

        if (root) {
            if (!isDocRoot) {
                root.id = root.id || Y.guid();
                // break into separate queries for element scoping
                for (i = 0, len = groups.length; i < len; ++i) {
                    selector = '#' + root.id + ' ' + groups[i]; // prepend with root ID
                    queries.push({root: root, selector: selector});
                }
            } else {
                queries.push({root: root, selector: selector});
            }
        }

        return queries;
    },

    _nativeQuery: function(selector, root, firstOnly) {
        if (Selector._reUnSupported.test(selector)) {
            return Y.Selector.query(selector, root, firstOnly);
        }

        var ret = firstOnly ? null : [],
            queryName = firstOnly ? 'querySelector' : 'querySelectorAll',
            result,
            queries,
            i, query;

        root = root || Y.config.doc;

        if (selector) {
            queries = Selector._prepQuery(root, selector);
            ret = [];

            for (i = 0, query; query = queries[i++];) {
                try {
                    result = query.root[queryName](query.selector);
                    if (queryName === 'querySelectorAll') { // convert NodeList to Array
                        result = Selector._toArray(result);
                    }
                    ret = ret.concat(result);
                } catch(e) {
                }
            }

            if (queries.length > 1) { // remove dupes and sort by doc order 
                ret = Selector._sort(Selector._deDupe(ret));
            }
            ret = (firstOnly) ? (ret[0] || null) : ret;
        }
        return ret;
    },

    filter: function(nodes, selector) {
        var ret = [],
            i, node;

        if (nodes && selector) {
            for (i = 0, node; (node = nodes[i++]);) {
                if (Y.Selector.test(node, selector)) {
                    ret[ret.length] = node;
                }
            }
        } else {
        }

        return ret;
    },

    test: function(node, selector, root) {
        var ret = false,
            groups = selector.split(','),
            item,
            i, group;

        if (node && node.tagName) { // only test HTMLElements
            root = root || node.ownerDocument;

            if (!node.id) {
                node.id = TMP_PREFIX + g_counter++;
            }
            for (i = 0, group; group = groups[i++];) { // TODO: off-dom test
                group += '#' + node.id; // add ID for uniqueness
                item = Y.Selector.query(group, root, true);
                ret = (item === node);
                if (ret) {
                    break;
                }
            }
        }

        return ret;
    }
};

if (Y.UA.ie && Y.UA.ie <= 8) {
    Selector._reUnSupported = /:(?:nth|not|root|only|checked|first|last|empty)/;
}

// allow standalone selector-native module
if (Selector._supportsNative() && Selector.useNative) {
    Y.Selector.query = Y.Selector.query || Selector._nativeQuery;
}

Y.mix(Y.Selector, Selector, true);

})(Y);


}, '@VERSION@' ,{requires:['dom-base']});
