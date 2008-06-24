
YUI.add('dom', function(Y) {

    var NODE_TYPE = 'nodeType',
        TAG_NAME = 'tagName',
        FIRST_CHILD = 'firstChild',
        LAST_CHILD = 'lastChild',
        PREVIOUS_SIBLING = 'previousSibling',
        NEXT_SIBLING = 'nextSibling',
        CONTAINS = 'contains',
        COMPARE_DOCUMENT_POSITION = 'compareDocumentPosition';

    var RE_KIN_FOLK = /^parentNode|(?:previous|next)Sibling|(?:first|last)Child$/;

    var DOM = {
        byId: function(id, doc) {
            doc = doc || Y.config.doc;
            return doc.getElementById(id);
        },

        getText: function(node) {
            var text = node.textContent;
            if (text === undefined && 'innerText' in node) {
                text = text.innerText;
            } 
            return text;
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
            if (document.documentElement.children) {
                return function(node, tag, fn, toArray) {
                    nodes = node.children.tags(tag.toUpperCase()); 

                    if (fn || toArray) {
                        fn = fn || function() { return true; };
                        nodes = Y.DOM.filterElementsBy(nodes, fn);
                    }

                    return nodes;
                }
            } else {
                return function(node, tag, fn) {
                    var nodes = node.childNodes,
                        tag = tag.toUpperCase();

                    var wrapFn = function(el) {
                        return el[TAG_NAME].toUpperCase() === tag && (!fn || fn(el));
                    };

                    return Y.DOM.filterElementsBy(nodes, wrapFn);
                };
            }
        }(),

        children: function(node, fn) {
            return Y.DOM.getChildrenByTag(node, '*', fn);
        },

        filterByAttributes: function(nodes, attr, fn) { // Match one of space seperated words 
            var s = ' ',
                pass = false,
                retNodes = [];

            outer:
            for (var i = 0, len = nodes.length; i < len; ++i) {
                for (var j = 0, attLen = attr.length; j < attLen; ++j) {
                    pass = false;
                    if (attr[j][0] = 'class') {
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
                    retNodes[retNodes.length] = nodes[i];
                }
            }
            return retNodes;
        },

        // collection of nextSibling, previousSibling, parentNode
        elementsByAxis: function(node, axis, tag, fn) {
            tag = (tag) ? tag.toUpperCase() : null;
            var ret = [];

            while (node = node[axis]) { // NOTE: assignment
                if (node[TAG_NAME]) {
                    if ( (!tag || (tag && node[TAG_NAME].toUpperCase() === tag)) &&
                            (!fn || fn(node)) ) {

                        ret[ret.length] = node;
                    }
                }
            }
            return ret;
        },

        // nextSibling, previousSibling, parentNode
        elementByAxis: function(node, axis, tag, fn) {
            var ret = null;

            while (node = node[axis]) { // NOTE: assignment
                if (node[TAG_NAME]) {
                    if ( (!tag || (tag && node[TAG_NAME].toUpperCase() === tag)) &&
                            (!fn || fn(node)) ) {

                        ret = node;
                        break;
                    }
                }
            }
            return ret;
        },

        byTag: function(tag, node, fn) {
            node = node || Y.config.doc;

            var nodes = node.getElementsByTagName(tag),
                retNodes = [];

            for (var i = 0, len = nodes.length; i < len; ++i) {
                if ( !fn || fn(nodes[i]) ) {
                    retNodes[retNodes.length] = nodes[i];
                }
            }
            return retNodes;
        },

        filterElementsBy: function(nodes, fn, firstOnly) {
            var ret = nodes;
            if (fn) {
                ret = (firstOnly) ? null : [];
                for (var i = 0, len = nodes.length; i < len; ++i) {
                    if (nodes[i][TAG_NAME] && fn(nodes[i])) {
                        if (firstOnly) {
                            ret = nodes[i];
                            break;
                        } else {
                            ret[ret.length] = nodes[i];
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
                    ret = crawlContains(node, needle); 
                }
            } else if (node[COMPARE_DOCUMENT_POSITION]) { // gecko
                if (node === needle || !!(node[COMPARE_DOCUMENT_POSITION](needle) & 16)) { 
                    ret = true;
                }
            }

            return ret;

        }

    };

    var crawlContains = function(node, needle) {
        while (needle) {
            if (node === needle) {
                return true;

            }
            needle = needle.parentNode;
        }
        return false;
    };

    Y.DOM = DOM;
}, '3.0.0');
