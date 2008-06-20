
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

YUI.add('domclassname', function(Y) {

    var CLASS_NAME = 'className';

    var regexCache = {};

    var getRegExp = function(str, flags) {
        flags = flags || '';
        if (!regexCache[str + flags]) {
            regexCache[str + flags] = new RegExp(str, flags);
        }
        return regexCache[str + flags];
    };

    Y.mix(Y.DOM, {
        /**
         * Determines whether an HTMLElement has the given className.
         * @method hasClass
         * @param {String} className the class name to search for
         * @return {Boolean | Array} A boolean value or array of boolean values
         */
        hasClass: function(node, className) {
            var re = getRegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
            return re.test(node[CLASS_NAME]);
        },

        /**
         * Adds a class name to a given element or collection of elements.
         * @method addClass         
         * @param {String} className the class name to add to the class attribute
         * @return {Boolean | Array} A pass/fail boolean or array of booleans
         */
        addClass: function(node, className) {
            if (!Y.DOM.hasClass(node, className)) { // skip if already present 
                node[CLASS_NAME] = Y.Lang.trim([node[CLASS_NAME], className].join(' '));
            }
        },

        /**
         * Removes a class name from a given element or collection of elements.
         * @method removeClass         
         * @param {String} className the class name to remove from the class attribute
         * @return {Boolean | Array} A pass/fail boolean or array of booleans
         */
        removeClass: function(node, className) {
            if (className && Y.DOM.hasClass(node, className)) {
                node[CLASS_NAME] = Y.Lang.trim(node[CLASS_NAME].replace(getRegExp('(?:^|\\s+)' +
                                className + '(?:\\s+|$)'), ' '));

                if ( Y.DOM.hasClass(node, className) ) { // in case of multiple adjacent
                    Y.DOM.removeClass(node, className);
                }

            }                 
        },

        /**
         * Replace a class with another class for a given element or collection of elements.
         * If no oldClassName is present, the newClassName is simply added.
         * @method replaceClass  
         * @param {String} oldClassName the class name to be replaced
         * @param {String} newClassName the class name that will be replacing the old class name
         * @return {Boolean | Array} A pass/fail boolean or array of booleans
         */
        replaceClass: function(node, oldC, newC) {
            Y.DOM.addClass(node, newC);
            Y.DOM.removeClass(node, oldC);
        },

        /**
         * If the className exists on the node it is removed, if it doesn't exist it is added.
         * @method toggleClass  
         * @param {String} className the class name to be toggled
         */
        toggleClass: function(node, className) {
            if (Y.DOM.hasClass(node, className)) {
                Y.DOM.removeClass(node, className);
            } else {
                Y.DOM.addClass(node, className);
            }
        }
    });

}, '3.0.0', { requires: [ 'dom'] });
YUI.add('style', function(Y) {

    var OWNER_DOCUMENT = 'ownerDocument',
        DEFAULT_VIEW = 'defaultView',
        PX = 'px';

    var _alias = {};

    if (document.documentElement.style.cssFloat !== undefined) {
        _alias['float'] = 'cssFloat';
    } else if (document.documentElement.style.styleFloat !== undefined) {
        _alias['float'] = 'styleFloat';
    }

    // use alpha filter for IE opacity
    if (document.documentElement.style.opacity === undefined &&
            document.documentElement.filters) {
        _alias['opacity'] = {
            get: function(node) {
                var val = 100;
                try { // will error if no DXImageTransform
                    val = node.filters['DXImageTransform.Microsoft.Alpha'].opacity;

                } catch(e) {
                    try { // make sure its in the document
                        val = node.filters('alpha').opacity;
                    } catch(e) {
                    }
                }
                return val / 100;
            },

            set: function(node, val, style) {
                if (typeof style.filter == 'string') { // in case not appended
                    style.filter = 'alpha(opacity=' + val * 100 + ')';
                    
                    if (!node.currentStyle || !node.currentStyle.hasLayout) {
                        style.zoom = 1; // needs layout 
                    }
                }
            }
        }
    }


    Y.mix(Y.DOM, {
        setStyle: function(node, att, val) {
            var style = node.style;
            if (style) {
                if (_alias[att]) {
                    if (_alias[att].set) {
                        _alias[att].set(node, val, style);
                        return; // NOTE: return
                    } else {
                        att = _alias[att];
                    }
                }
                node.style[att] = val; 
            }
        },

        getStyle: function(node, att) {
            var style = node.style;
            if (_alias[att]) {
                if (style && _alias[att].get) {
                    return _alias[att].get(node, att, style); // NOTE: return
                } else {
                    att = _alias[att];
                }
            }

            var val = style ? style[att] : undefined;
            if (val === '') { // TODO: is empty string sufficient?
                val = Y.DOM.getComputedStyle(node, att);
            }

            return val;
        },

        getComputedStyle: function(node, att) {
            var view = node[OWNER_DOCUMENT][DEFAULT_VIEW];
            return view.getComputedStyle(node, '')[att];
        }
   });

    // IE getComputedStyle
    // TODO: unit-less lineHeight (e.g. 1.22)
    var re_compute = /[a-z]*(?:height|width|top|bottom|left|right|fontSize|color|visibility)/i,
        re_size = /^width|height$/,
        re_color = /color$/i,
        re_rgb = /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,
        re_hex = /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,
        re_unit = /^(\d[.\d]*)+(em|ex|px|gd|rem|vw|vh|vm|ch|mm|cm|in|pt|pc|deg|rad|ms|s|hz|khz|%){1}?/i;

    var getIEComputedStyle = function(el, property) {
        var value = '',
            current = el.currentStyle[property],
            match = re_compute.exec(property);

        if (!match || current.indexOf(PX) > -1) { // no need to convert
            value = current;
        } else if (match && computed[match[0]]) { // use compute function
            value = computed[match[0]](el, property);
        } else if (re_unit.test(current)) { // convert to pixel
            value = getPixel(el, property);
        }

        return value;
    };

    var getPixelLayout = function(el, prop) {
        var current = el.currentStyle[prop],                        // value of "width", "top", etc.
            capped = prop.charAt(0).toUpperCase() + prop.substr(1), // "Width", "Top", etc.
            offset = 'offset' + capped,                             // "offsetWidth", "offsetTop", etc.
            pixel = 'pixel' + capped,                               // "pixelWidth", "pixelTop", etc.
            value = '';

        if (current == 'auto') {
            var actual = el[offset]; // offsetHeight/Top etc.
            if (actual === undefined) { // likely "right" or "bottom"
                val = 0;
            }

            value = actual;
            if (re_size.test(prop)) { // account for box model diff 
                el.style[prop] = actual; 
                if (el[offset] > actual) {
                    // the difference is padding + border (works in Standards & Quirks modes)
                    value = actual - (el[offset] - actual);
                }
                el.style[prop] = 'auto'; // revert to auto
            }
        } else { // convert units to px
            if (!el.style[pixel] && !el.style[prop]) { // need to map style.width to currentStyle (no currentStyle.pixelWidth)
                el.style[prop] = current;              // no style.pixelWidth if no style.width
            }
            value = el.style[pixel];
        }
        return value + PX;
    };

    var getPixelBorder = function(el, property) {
        // clientHeight/Width = paddingBox (e.g. offsetWidth - borderWidth)
        // clientTop/Left = borderWidth
        var value = null;
        if (!el.currentStyle.hasLayout) {
            el.style.zoom = 1; // need layout to measure client
        }

        switch(property) {
            case 'borderTopWidth':
                value = el.clientTop;
                break;
            case 'borderBottomWidth':
                value = el.offsetHeight - el.clientHeight - el.clientTop;
                break;
            case 'borderLeftWidth':
                value = el.clientLeft;
                break;
            case 'borderRightWidth':
                value = el.offsetWidth - el.clientWidth - el.clientLeft;
                break;
        }
        return value + PX;
    };

    var getPixel = function(node, att) {
        // use pixelRight to convert to px
        var val = null,
            styleRight = node.currentStyle.right,
            current = node.currentStyle[att];

        node.style.right = current;
        val = node.style.pixelRight;
        node.style.right = styleRight; // revert

        return val + PX;
    };

    var getPixelMargin = function(node, att) {
        if (node.currentStyle[att] == 'auto') {
            val = 0 + PX;
        } else {
            val = getPixel(node, att);
        }
        return val;
    };

    var getVisibility = function(node, att) {
        var current;
        while ( (current = node.currentStyle) && current[att] == 'inherit') { // NOTE: assignment in test
            node = node.parentNode;
        }
        return (current) ? current[att] : 'visible';
    };

    var computed = {
        width: getPixelLayout,
        height: getPixelLayout,
        borderTopWidth: getPixelBorder,
        borderRightWidth: getPixelBorder,
        borderBottomWidth: getPixelBorder,
        borderLeftWidth: getPixelBorder,
        marginTop: getPixelMargin,
        marginRight: getPixelMargin,
        marginBottom: getPixelMargin,
        marginLeft: getPixelMargin,
        visibility: getVisibility
        //fontSize: getPixelFont,
        //color: getComputedColor
    };


    if (!window.getComputedStyle) {
        Y.DOM.getComputedStyle = getIEComputedStyle; 
    }
}, '3.0.0', { requires: ['dom'] });
/**
 * The selector module provides helper methods allowing CSS3 Selectors to be used with DOM elements.
 * @module selector
 * @title Selector Utility
 * @requires yahoo, dom
 */

YUI.add('selector', function(Y) {
/**
 * Provides helper methods for collecting and filtering DOM elements.
 * @class Selector
 * @static
 */

var NODE_TYPE = 'nodeType',
    NODE_NAME = 'nodeName',
    TAG_NAME = 'tagName',
    ATTRIBUTES = 'attributes',
    PSEUDOS = 'pseudos',
    PARENT_NODE = 'parentNode',
    FIRST_CHILD = 'firstChild',
    LAST_CHILD = 'lastChild',
    PREVIOUS_SIBLING = 'previousSibling',
    NEXT_SIBLING = 'nextSibling';

var reNth = /^(?:([-]?\d*)(n){1}|(odd|even)$)*([-+]?\d*)$/;

Y.Selector = {
    /**
     * Default document for use queries 
     * @property document
     * @type object
     * @default window.document
     */
    document: Y.config.doc,
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
        //'(?:(?:[^\\)\\]\\s*>+~,]+)(?:-?[_a-z]+[-\\w]))+#(-?[_a-z]+[-\\w]*)': '[id=$1]',
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
            return getNth(node, val, node[TAG_NAME]);
        },
         
        'nth-last-of-type': function(node, val) {
            return getNth(node, val, node[TAG_NAME], true);
        },
         
        'first-child': function(node) {
            return Y.DOM.firstChild(node[PARENT_NODE]) === node;
        },

        'last-child': function(node) {
            return Y.DOM.lastChild(node[PARENT_NODE]) === node;
        },

        'first-of-type': function(node, val) {
            return Y.DOM.firstChildByTag(node[PARENT_NODE], node[TAG_NAME]) === node;
        },
         
        'last-of-type': function(node, val) {
            return Y.DOM.lastChildByTag(node[PARENT_NODE], node[TAG_NAME]) === node;
        },
         
        'only-child': function(node) {
            var children = Y.DOM.children(node[PARENT_NODE]);
            return children.length === 1 && children[0] === node;
        },

        'only-of-type': function(node) {
            return Y.DOM.childrenByTag(node[PARENT_NODE], node[TAG_NAME]).length === 1;
        },

        'empty': function(node) {
            return node.childNodes.length === 0;
        },

        'not': function(node, simple) {
            return !Y.Selector.test(node, simple);
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
        node = Y.Selector.document.getElementById(node) || node;

        if (!node) {
            return false;
        }

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
        nodes = nodes || [];

        var node,
            result = [],
            tokens = tokenize(selector);

        if (!nodes.item) { // if not HTMLCollection, handle arrays of ids and/or nodes
            for (var i = 0, len = nodes.length; i < len; ++i) {
                if (!nodes[i][TAG_NAME]) { // tagName limits to HTMLElements 
                    node = Y.Selector.document.getElementById(nodes[i]);
                    if (node) { // skip IDs that return null 
                        nodes[i] = node;
                    } else {
                    }
                }
            }
        }
        result = rFilter(nodes, tokenize(selector)[0]);
        clearParentCache();
        return result;
    },

    /**
     * Retrieves a set of nodes based on a given CSS selector. 
     * @method query
     *
     * @param {string} selector The CSS Selector to test the node against.
     * @param {HTMLElement | String} root optional An id or HTMLElement to start the query from. Defaults to Selector.document.
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
    var result =  (firstOnly) ? null : [];
    if (!selector) {
        return result;
    }

    var groups = selector.split(','); // TODO: handle comma in attribute/pseudo

    if (groups.length > 1) {
        var found;
        for (var i = 0, len = groups.length; i < len; ++i) {
            found = arguments.callee(groups[i], root, firstOnly, true);
            result = firstOnly ? found : result.concat(found); 
        }
        clearFoundCache();
        return result;
    }

    if (root && !root[NODE_NAME]) { // assume ID
        root = Y.Selector.document.getElementById(root);
        if (!root) {
            return result;
        }
    }

    root = root || Y.Selector.document;
    var tokens = tokenize(selector);
    var idToken = tokens[getIdTokenIndex(tokens)],
        nodes = [],
        node,
        id,
        token = tokens.pop() || {};
        
    if (idToken) {
        id = getId(idToken[ATTRIBUTES]);
    }

    // use id shortcut when possible
    if (id) {
        node = Y.Selector.document.getElementById(id);

        if (node && (root[NODE_NAME] == '#document' || Y.DOM.contains(node, root))) {
            if ( rTestNode(node, null, idToken) ) {
                if (idToken === token) {
                    nodes = [node]; // simple selector
                } else {
                    root = node; // start from here
                }
            }
        } else {
            return result;
        }
    }

    if (root && !nodes.length) {
        nodes = root.getElementsByTagName(token.tag);
    }

    if (nodes.length) {
        result = rFilter(nodes, token, firstOnly, deDupe); 
        //result = Y.DOM.filterByAttributes(nodes, token[ATTRIBUTES]);
    }
    clearParentCache();
    return result;
};

var rFilter = function(nodes, token, firstOnly, deDupe) {
    var result = firstOnly ? null : [];

    for (var i = 0, len = nodes.length; i < len; i++) {
        if (! rTestNode(nodes[i], '', token, deDupe)) {
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
            foundCache[foundCache.length] = nodes[i];
        }

        result[result.length] = nodes[i];
    }

    return result;
};

var rTestNode = function(node, selector, token, deDupe) {
    token = token || tokenize(selector).pop() || {};

    if (!node[TAG_NAME] ||
        (token.tag !== '*' && node[TAG_NAME].toUpperCase() !== token.tag) ||
        (deDupe && node._found) ) {
        return false;
    }

    if (token[ATTRIBUTES].length) {
        var attribute;
        for (var i = 0, len = token[ATTRIBUTES].length; i < len; ++i) {
            attribute = node.getAttribute(token[ATTRIBUTES][i][0], 2);
            if (attribute === undefined) {
                return false;
            }
            if ( Y.Selector.operators[token[ATTRIBUTES][i][1]] &&
                    !Y.Selector.operators[token[ATTRIBUTES][i][1]](attribute, token[ATTRIBUTES][i][2])) {
                return false;
            }
        }
    }

    if (token[PSEUDOS].length) {
        for (var i = 0, len = token[PSEUDOS].length; i < len; ++i) {
            if (Y.Selector[PSEUDOS][token[PSEUDOS][i][0]] &&
                    !Y.Selector[PSEUDOS][token[PSEUDOS][i][0]](node, token[PSEUDOS][i][1])) {
                return false;
            }
        }
    }

    return (token.previous && token.previous.combinator !== ',') ?
            combinators[token.previous.combinator](node, token) :
            true;
};


var foundCache = [];
var parentCache = [];
var regexCache = {};

var clearFoundCache = function() {
    for (var i = 0, len = foundCache.length; i < len; ++i) {
        try { // IE no like delete
            delete foundCache[i]._found;
        } catch(e) {
            foundCache[i].removeAttribute('_found');
        }
    }
    foundCache = [];
};

var clearParentCache = function() {
    if (!document.documentElement.children) { // caching children lookups for gecko
        return function() {
            for (var i = 0, len = parentCache.length; i < len; ++i) {
                delete parentCache[i]._children;
            }
            parentCache = [];
        };
    } else return function() {}; // do nothing
}();

var getRegExp = function(str, flags) {
    flags = flags || '';
    if (!regexCache[str + flags]) {
        regexCache[str + flags] = new RegExp(str, flags);
    }
    return regexCache[str + flags];
};

var combinators = {
    ' ': function(node, token) {
        while (node = node.parentNode) {
            if (rTestNode(node, '', token.previous)) {
                return true;
            }
        }  
        return false;
    },

    '>': function(node, token) {
        return rTestNode(node.parentNode, null, token.previous);
    },
    '+': function(node, token) {
        var sib = node.previousSibling;
        while (sib && sib.nodeType !== 1) {
            sib = sib.previousSibling;
        }

        if (sib && rTestNode(sib, null, token.previous)) {
            return true; 
        }
        return false;
    },

    '~': function(node, token) {
        var sib = node.previousSibling;
        while (sib) {
            if (sib.nodeType === 1 && rTestNode(sib, null, token.previous)) {
                return true;
            }
            sib = sib.previousSibling;
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
    reNth.test(expr);

    var a = parseInt(RegExp.$1, 10), // include every _a_ elements (zero means no repeat, just first _a_)
        n = RegExp.$2, // "n"
        oddeven = RegExp.$3, // "odd" or "even"
        b = parseInt(RegExp.$4, 10) || 0, // start scan from element _b_
        result = [],
        siblings;

    if (tag) {
        siblings = Y.DOM.childrenByTag(node.parentNode, tag);
console.log(siblings);
    } else {
        siblings = Y.DOM.children(node.parentNode);
    }

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
        if (getId(tokens[i][ATTRIBUTES])) {
            return i;
        }
    }
    return -1;
};

var patterns = {
    tag: /^((?:-?[_a-z]+[\w-]*)|\*)/i,
    attributes: /^\[([a-z]+\w*)+([~\|\^\$\*!=]=?)?['"]?([^\]]*?)['"]?\]/i,
    //attributes: /^\[([a-z]+\w*)+([~\|\^\$\*!=]=?)?['"]?([^'"\]]*)['"]?\]*/i,
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
                if (!Y.Object.owns(patterns, re)) {
                    continue;
                }
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
                    token[ATTRIBUTES] = fixAttributes(token[ATTRIBUTES]);
                    token[PSEUDOS] = token[PSEUDOS] || [];
                    token.tag = token.tag ? token.tag.toUpperCase() : '*';
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
    var aliases = Y.Selector.attrAliases;
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
    var shorthand = Y.Selector.shorthand;
    var attrs = selector.match(patterns[ATTRIBUTES]); // pull attributes to avoid false pos on "." and "#"
    if (attrs) {
        selector = selector.replace(patterns[ATTRIBUTES], 'REPLACED_ATTRIBUTE');
    }
    for (var re in shorthand) {
        if (!Y.Object.owns(shorthand, re)) {
            continue;
        }
        selector = selector.replace(getRegExp(re, 'gi'), shorthand[re]);
    }

    if (attrs) {
        for (var i = 0, len = attrs.length; i < len; ++i) {
            selector = selector.replace('REPLACED_ATTRIBUTE', attrs[i]);
        }
    }
    return selector;
};

Y.Selector.patterns = patterns;

if (Y.UA.ie) { // rewrite class for IE (others use getAttribute('class')
    Y.Selector.attrAliases['class'] = 'className';
    Y.Selector.attrAliases['for'] = 'htmlFor';
}

}, '3.0.0');
/**
 * Extended interface for DOM
 * @module domposition
 */

YUI.add('screen', function(Y) {

    /**
     * An interface for advanced DOM features.
     * @interface DOMScreen
     */

    var OFFSET_TOP = 'offsetTop',
        OWNER_DOCUMENT = 'ownerDocument',
        COMPAT_MODE = 'compatMode',
        DEFAULT_VIEW = 'defaultView',
        PARENT_WINDOW = 'parentWindow',
        OFFSET_LEFT = 'offsetLeft',
        OFFSET_PARENT = 'offsetParent',
        DOCUMENT_ELEMENT = 'documentElement',
        POSITION = 'position',
        FIXED = 'fixed',
        RELATIVE = 'relative',
        LEFT = 'left',
        TOP = 'top',
        SCROLL_LEFT = 'scrollLeft',
        SCROLL_TOP = 'scrollTop',
        NODE_TYPE = 'nodeType',
        GET_BOUNDING_CLIENT_RECT = 'getBoundingClientRect',
        COMPARE_DOCUMENT_POSITION = 'compareDocumentPosition',
        RE_TABLE = /^t(able|d|h)$/i,
        getNode = Y.Node.getDOMNode;

    var getDoc = function(node) {
        node = node || {};
        return (node[NODE_TYPE] === 9) ? node : node[OWNER_DOCUMENT] || Y.config.doc;
    };

    var getWinSize = function(node) {
        var doc = getDoc(),
            win = doc[DEFAULT_VIEW] || doc[PARENT_WINDOW],
            mode = doc[COMPAT_MODE],
            height = win.innerHeight,
            width = win.innerWidth,
            root = doc[DOCUMENT_ELEMENT];
    
        if ( mode && !Y.UA.opera ) { // IE, Gecko
            if (mode != 'CSS1Compat') { // Quirks
                root = doc.body; 
            }
            height = root.clientHeight;
            width = root.clientWidth;
        }
        return { 'height': height, 'width': width }; 
    };

    var getDocSize = function(node) {
        var doc = getDoc(),
            root = doc[DOCUMENT_ELEMENT];

        if (doc[COMPAT_MODE] != 'CSS1Compat') {
            root = doc.body;
        }

        return {
            'height': root.scrollHeight,
            'width': root.scrollWidth
        }
    };

    Y.mix(Y.DOM, {

        /**
         * Returns the inner height of the viewport (exludes scrollbar). 
         * @method winHeight
         */
        winHeight: function(node) {
            var h = getWinSize(node).height;
            return h;
        },

        /**
         * Returns the inner width of the viewport (exludes scrollbar). 
         * @method winWidth
         */
        winWidth: function(node) {
            var w = getWinSize(node).width;
            return w;
        },

        /**
         * Document height 
         * @method docHeight
         */
        docHeight:  function(node) {
            var h = getDocSize(node).height;
            return Math.max(h, getWinSize(node).height);
        },

        /**
         * Document width 
         * @method docWidth
         */
        docWidth:  function(node) {
            var w = getDocSize(node).width;
            return Math.max(w, getWinSize(node).width);
        },

        /**
         * Amount page has been scroll vertically 
         * @method docScrollX
         */
        docScrollX: function(node) {
            var doc = getDoc();
            return Math.max(doc[DOCUMENT_ELEMENT][SCROLL_LEFT], doc.body[SCROLL_LEFT]);
        },

        /**
         * Amount page has been scroll horizontally 
         * @method docScrollY
         */
        docScrollY:  function(node) {
            var doc = getDoc();
            return Math.max(doc[DOCUMENT_ELEMENT][SCROLL_TOP], doc.body[SCROLL_TOP]);
        },

        /**
         * Gets the current position of an element based on page coordinates. 
         * Element must be part of the DOM tree to have page coordinates
         * (display:none or elements not appended return false).
         * @method getXY
         * @return {Array} The XY position of the element

         TODO: test inDocument/display
         */
        getXY: function() {
            if (document.documentElement[GET_BOUNDING_CLIENT_RECT]) {
                return function(node) {
                    var scrollLeft = Y.DOM.docScrollX(node),
                        scrollTop = Y.DOM.docScrollY(node),
                        box = node[GET_BOUNDING_CLIENT_RECT](),
                        doc = node.ownerDocument,
                        //Round the numbers so we get sane data back
                        xy = [Math.floor(box[LEFT]), Math.floor(box[TOP])];

                        if (Y.UA.ie) {
                            var off1 = 2, off2 = 2,
                            mode = doc.compatMode,
                            bLeft = Y.DOM.getComputedStyle(doc[DOCUMENT_ELEMENT], 'borderLeftWidth'),
                            bTop = Y.DOM.getComputedStyle(doc[DOCUMENT_ELEMENT], 'borderTopWidth');

                            if (Y.UA.ie === 6) {
                                if (mode !== 'BackCompat') {
                                    off1 = 0;
                                    off2 = 0;
                                }
                            }
                            
                            if ((mode == 'BackCompat')) {
                                if (bLeft !== 'medium') {
                                    off1 = parseInt(bLeft, 10);
                                }
                                if (bTop !== 'medium') {
                                    off2 = parseInt(bTop, 10);
                                }
                            }
                            
                            xy[0] -= off1;
                            xy[1] -= off2;
                        }

                    if ((scrollTop || scrollLeft)) {
                        xy[0] += scrollLeft;
                        xy[1] += scrollTop;
                    }
                    return xy;                   
                };
            } else {
                return function(node) { // manually calculate by crawling up offsetParents
                    //Calculate the Top and Left border sizes (assumes pixels)
                    var calcBorders = function(node, xy2) {
                        var t = parseInt(Y.DOM.getStyle(node, 'borderTopWidth'), 10) || 0,
                            l = parseInt(Y.DOM.getStyle(node, 'borderLeftWidth'), 10) || 0;
                        if (Y.UA.gecko) {
                            if (RE_TABLE.test(node['tagName'])) {
                                t = 0;
                                l = 0;
                            }
                        }
                        xy2[0] += l;
                        xy2[1] += t;
                        return xy2;
                    };

                    var xy = [node[OFFSET_LEFT], node[OFFSET_TOP]],
                    parentNode = node,
                    bCheck = ((Y.UA.gecko || (Y.UA.webkit > 519)) ? true : false);

                    while (parentNode = parentNode[OFFSET_PARENT]) {
                        xy[0] += parentNode[OFFSET_LEFT];
                        xy[1] += parentNode[OFFSET_TOP];
                        if (bCheck) {
                            xy = calcBorders(parentNode, xy);
                        }
                    }

                    // account for any scrolled ancestors
                    if (Y.DOM.getStyle(node, POSITION) != FIXED) {
                        parentNode = node;
                        var scrollTop, scrollLeft;

                        while (parentNode = parentNode['parentNode']) {
                            scrollTop = parentNode['scrollTop'];
                            scrollLeft = parentNode['scrollLeft'];

                            //Firefox does something funky with borders when overflow is not visible.
                            if (Y.UA.gecko && (Y.DOM.getStyle(parentNode, 'overflow') !== 'visible')) {
	                            xy = calcBorders(parentNode, xy);
                            }
                            

                            if (scrollTop || scrollLeft) {
                                xy[0] -= scrollLeft;
                                xy[1] -= scrollTop;
                            }
                        }
                        xy[0] += Y.DOM.docScrollX(node);
                        xy[1] += Y.DOM.docScrollY(node);

                    } else {
                        //Fix FIXED position -- add scrollbars
                        if (Y.UA.opera) {
                            xy[0] -= Y.DOM.docScrollX(node);
                            xy[1] -= Y.DOM.docScrollY(node);
                        } else if (Y.UA.webkit || Y.UA.gecko) {
                            xy[0] += Y.DOM.docScrollX(node);
                            xy[1] += Y.DOM.docScrollY(node);
                        }
                    }
                    //Round the numbers so we get sane data back
                    xy[0] = Math.floor(xy[0]);
                    xy[1] = Math.floor(xy[1]);

                    return xy;                
                };
            }
        }(),// NOTE: Executing for loadtime branching

        /**
         * Set the position of an html element in page coordinates, regardless of how the element is positioned.
         * The element(s) must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
         * @method setXY
         * @param {Array} xy Contains X & Y values for new position (coordinates are page-based)
         * @param {Boolean} noRetry By default we try and set the position a second time if the first fails
         */
        setXY: function(node, xy, noRetry) {
            var pos = Y.DOM.getStyle(node, POSITION),
                delta = [ // assuming pixels; if not we will have to retry
                    parseInt( Y.DOM.getStyle(node, LEFT), 10 ),
                    parseInt( Y.DOM.getStyle(node, TOP), 10 )
                ];
        
            if (pos == 'static') { // default to relative
                pos = RELATIVE;
                Y.DOM.setStyle(node, POSITION, RELATIVE);
            }

            var currentXY = Y.DOM.getXY(node);

            if (currentXY === false) { // has to be part of doc to have xy
                return false; 
            }
            
            if ( isNaN(delta[0]) ) {// in case of 'auto'
                delta[0] = (pos == RELATIVE) ? 0 : node[OFFSET_LEFT];
            } 
            if ( isNaN(delta[1]) ) { // in case of 'auto'
                delta[1] = (pos == RELATIVE) ? 0 : node[OFFSET_TOP];
            } 

            if (xy[0] !== null) {
                Y.DOM.setStyle(node, LEFT, xy[0] - currentXY[0] + delta[0] + 'px');
            }

            if (xy[1] !== null) {
                Y.DOM.setStyle(node, TOP, xy[1] - currentXY[1] + delta[1] + 'px');
            }
          
            if (!noRetry) {
                var newXY = Y.DOM.getXY(node);

                // if retry is true, try one more time if we miss 
               if ( (xy[0] !== null && newXY[0] != xy[0]) || 
                    (xy[1] !== null && newXY[1] != xy[1]) ) {
                   Y.DOM.setXY(node, xy, true);
               }
            }        

        }
    });

}, '3.0.0', { requires: ['dom'] });
YUI.add('region', function(Y) {
    
    var OFFSET_HEIGHT = 'offsetHeight',
        OFFSET_WIDTH = 'offsetWidth',
        TAG_NAME = 'tagName'

    var getOffsets = function(r1, r2) {

        var t = Math.max(r1.top,    r2.top   ),
            r = Math.min(r1.right,  r2.right ),
            b = Math.min(r1.bottom, r2.bottom),
            l = Math.max(r1.left,   r2.left  );
        
        return {
            top: t,
            bottom: b,
            left: l,
            right: r
        };
    };

    Y.mix(Y.DOM, {
        /**
         * Returns an Object literal containing the following about this node: (top, right, bottom, left) positions, height and width
         * @method region
         @return {Object} Object literal containing the following about this node: (top, right, bottom, left) positions, height and width
         */
        region: function(node) {
            var x = Y.DOM.getXY(node);
            return {
                '0': x[0],
                '1': x[1],
                top: x[1],
                right: x[0] + node[OFFSET_WIDTH],
                bottom: x[1] + node[OFFSET_HEIGHT],
                left: x[0],
                height: node[OFFSET_HEIGHT],
                width: node[OFFSET_WIDTH]
            };
            
        },

        /**
         * Find the intersect information for this node and the node passed in.
         * @method intersect
         * @param {Object} node2 The node to check the interect with
         * @param {Object} altRegion An object literal containing the region for this node if we already have the data (for performance i.e. DragDrop)
         * @return {Object} Returns an Object literal with the intersect information for the nodes
         */
        intersect: function(node, node2, altRegion) {
            var r = altRegion || Y.DOM.region(node), region = {};

            var n = node2;
            if (n[TAG_NAME]) {
                region = Y.DOM.region(n);
            } else if (Y.Lang.isObject(node2)) {
                region = node2;
            } else {
                return false;
            }
            
            var off = getOffsets(region, r);
            return {
                top: off.top,
                right: off.right,
                bottom: off.bottom,
                left: off.left,
                area: ((off.bottom - off.top) * (off.right - off.left)),
                yoff: ((off.bottom - off.top)),
                xoff: (off.right - off.left),
                inRegion: Y.DOM.inRegion(node, false, altRegion)
            };
            
        },
        /**
         * Check if any part of this node is in the passed region
         * @method inRegion
         * @param {Object} node2 The node to get the region from or an Object literal of the region
         * $param {Boolean} all Should all of the node be inside the region
         * @param {Object} altRegion An object literal containing the region for this node if we already have the data (for performance i.e. DragDrop)
         * @return {Boolean} True if in region, false if not.
         */
        inRegion: function(node, node2, all, altRegion) {
            var region = {},
                r = altRegion || Y.DOM.region(node);

            var n = node2;
            if (n[TAG_NAME]) {
                region = Y.DOM.region(n);
            } else if (Y.Lang.isObject(node2)) {
                region = node2;
            } else {
                return false;
            }
                
            if (all) {
                return ( r.left   >= region.left   &&
                    r.right  <= region.right  && 
                    r.top    >= region.top    && 
                    r.bottom <= region.bottom    );
            } else {
                var off = getOffsets(region, r);
                if (off.bottom >= off.top && off.right >= off.left) {
                    return true;
                } else {
                    return false;
                }
                
            }
        },

        /**
         * Check if any part of this node is in the viewport
         * @method inViewportRegion
         * $param {Boolean} all Should all of the node be inside the region
         * @param {Object} altRegion An object literal containing the region for this node if we already have the data (for performance i.e. DragDrop)
         * @return {Boolean} True if in region, false if not.
         */
        inViewportRegion: function(node, all, altRegion) {
            return Y.DOM.inRegion(node, Y.DOM.viewportRegion(node), all, altRegion);
                
        },

        viewportRegion: function(node) {
            node = node || Y.config.doc.documentElement;
            var r = {
                top: Y.DOM.docScrollY(node),
                right: Y.DOM.winWidth(node) + Y.DOM.docScrollX(node),
                bottom: (Y.DOM.docScrollY(node) + Y.DOM.winHeight(node)),
                left: Y.DOM.docScrollX(node)
            };

            return r;
        }
    });

}, '3.0.0', { requires: ['dom', 'screen'] });
