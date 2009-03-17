YUI.add('dom', function(Y) {

/** 
 * The DOM utility provides a cross-browser abtraction layer
 * normalizing DOM tasks, and adds extra helper functionality
 * for other common tasks. 
 * @module dom
 * @submodule dom-base
 *
 */

/**
 * Provides DOM helper methods.
 * @class DOM
 *
 */
var NODE_TYPE = 'nodeType',
    OWNER_DOCUMENT = 'ownerDocument',
    DOCUMENT_ELEMENT = 'documentElement',
    DEFAULT_VIEW = 'defaultView',
    PARENT_WINDOW = 'parentWindow',
    TAG_NAME = 'tagName',
    PARENT_NODE = 'parentNode',
    FIRST_CHILD = 'firstChild',
    LAST_CHILD = 'lastChild',
    PREVIOUS_SIBLING = 'previousSibling',
    NEXT_SIBLING = 'nextSibling',
    CONTAINS = 'contains',
    COMPARE_DOCUMENT_POSITION = 'compareDocumentPosition',
    INNER_TEXT = 'innerText',
    TEXT_CONTENT = 'textContent',
    LENGTH = 'length',

    UNDEFINED = undefined;

var re_tag = /<([a-z]+)/i;

var templateCache = {};

Y.DOM = {
    /**
     * Returns the HTMLElement with the given ID (Wrapper for document.getElementById).
     * @method byId         
     * @param {String} id the id attribute 
     * @param {Object} doc optional The document to search. Defaults to current document 
     * @return {HTMLElement | null} The HTMLElement with the id, or null if none found. 
     */
    byId: function(id, doc) {
        return Y.DOM._getDoc(doc).getElementById(id);
    },

    /**
     * Returns the text content of the HTMLElement. 
     * @method getText         
     * @param {HTMLElement} element The html element. 
     * @return {String} The text content of the element (includes text of any descending elements).
     */
    getText: function(element) {
        var text = element ? element[TEXT_CONTENT] : '';
        if (text === UNDEFINED && INNER_TEXT in element) {
            text = element[INNER_TEXT];
        } 
        return text || '';
    },

    /**
     * Finds the firstChild of the given HTMLElement. 
     * @method firstChild
     * @param {HTMLElement} element The html element. 
     * @param {Function} fn optional An optional boolean test to apply.
     * The optional function is passed the current HTMLElement being tested as its only argument.
     * If no function is given, the first found is returned.
     * @return {HTMLElement | null} The first matching child html element.
     */
    firstChild: function(element, fn) {
        return Y.DOM._childBy(element, null, fn);
    },

    firstChildByTag: function(element, tag, fn) {
        return Y.DOM._childBy(element, tag, fn);
    },

    /**
     * Finds the lastChild of the given HTMLElement.
     * @method lastChild
     * @param {HTMLElement} element The html element.
     * @param {String} tag The tag to search for.
     * @param {Function} fn optional An optional boolean test to apply.
     * The optional function is passed the current HTMLElement being tested as its only argument.
     * If no function is given, the first found is returned.
     * @return {HTMLElement | null} The first matching child html element.
     */
    lastChild: function(element, fn) {
        return Y.DOM._childBy(element, null, fn, true);
    },

    lastChildByTag: function(element, tag, fn) {
        return Y.DOM._childBy(element, tag, fn, true);
    },

    /**
     * Finds all HTMLElement childNodes matching the given tag.
     * @method childrenByTag
     * @param {HTMLElement} element The html element.
     * @param {String} tag The tag to search for.
     * @param {Function} fn optional An optional boolean test to apply.
     * The optional function is passed the current HTMLElement being tested as its only argument.
     * If no function is given, all children with the given tag are collected.
     * @return {Array} The collection of child elements.
     */
    childrenByTag: function() {
        if (document[DOCUMENT_ELEMENT].children) {
            return function(element, tag, fn, toArray) { // TODO: keep toArray option?
                tag = (tag && tag !== '*') ? tag : null;
                var elements = [];
                if (element) {
                    elements = (tag) ? element.children.tags(tag) : element.children; 

                    if (fn || toArray) {
                        elements = Y.DOM.filterElementsBy(elements, fn);
                    }
                }

                return elements;
            };
        } else {
            return function(element, tag, fn) {
                tag = (tag && tag !== '*') ? tag.toUpperCase() : null;
                var elements = [],
                    wrapFn = fn;

                if (element) {
                    elements = element.childNodes; 
                    if (tag) { // wrap fn and add tag test TODO: allow tag in filterElementsBy?
                        wrapFn = function(el) {
                            return el[TAG_NAME].toUpperCase() === tag && (!fn || fn(el));
                        };
                    }

                    elements = Y.DOM.filterElementsBy(elements, wrapFn);
                }
                return elements;
            };
        }
    }(),

    /**
     * Finds all HTMLElement childNodes.
     * @method children
     * @param {HTMLElement} element The html element.
     * @param {Function} fn optional An optional boolean test to apply.
     * The optional function is passed the current HTMLElement being tested as its only argument.
     * If no function is given, all children are collected.
     * @return {Array} The collection of child elements.
     */
    children: function(element, fn) {
        return Y.DOM.childrenByTag(element, null, fn);
    },

    /**
     * Finds the previous sibling of the element.
     * @method previous
     * @param {HTMLElement} element The html element.
     * @param {Function} fn optional An optional boolean test to apply.
     * The optional function is passed the current DOM node being tested as its only argument.
     * If no function is given, the first sibling is returned.
     * @param {Boolean} all optional Whether all node types should be scanned, or just element nodes.
     * @return {HTMLElement | null} The matching DOM node or null if none found. 
     */
    previous: function(element, fn, all) {
        return Y.DOM.elementByAxis(element, PREVIOUS_SIBLING, fn, all);
    },

    /**
     * Finds the next sibling of the element.
     * @method next
     * @param {HTMLElement} element The html element.
     * @param {Function} fn optional An optional boolean test to apply.
     * The optional function is passed the current DOM node being tested as its only argument.
     * If no function is given, the first sibling is returned.
     * @param {Boolean} all optional Whether all node types should be scanned, or just element nodes.
     * @return {HTMLElement | null} The matching DOM node or null if none found. 
     */
    next: function(element, fn, all) {
        return Y.DOM.elementByAxis(element, NEXT_SIBLING, fn, all);
    },

    /**
     * Finds the ancestor of the element.
     * @method ancestor
     * @param {HTMLElement} element The html element.
     * @param {Function} fn optional An optional boolean test to apply.
     * The optional function is passed the current DOM node being tested as its only argument.
     * If no function is given, the parentNode is returned.
     * @param {Boolean} all optional Whether all node types should be scanned, or just element nodes.
     * @return {HTMLElement | null} The matching DOM node or null if none found. 
     */
     // TODO: optional stopAt node?
    ancestor: function(element, fn, all) {
        return Y.DOM.elementByAxis(element, PARENT_NODE, fn, all);
    },

    /**
     * Searches the element by the given axis for the first matching element.
     * @method elementByAxis
     * @param {HTMLElement} element The html element.
     * @param {String} axis The axis to search (parentNode, nextSibling, previousSibling).
     * @param {Function} fn optional An optional boolean test to apply.
     * @param {Boolean} all optional Whether all node types should be returned, or just element nodes.
     * The optional function is passed the current HTMLElement being tested as its only argument.
     * If no function is given, the first element is returned.
     * @return {HTMLElement | null} The matching element or null if none found.
     */
    elementByAxis: function(element, axis, fn, all) {
        while (element && (element = element[axis])) { // NOTE: assignment
                if ( (all || element[TAG_NAME]) && (!fn || fn(element)) ) {
                    return element;
                }
        }
        return null;
    },

    /**
     * Finds all elements with the given tag.
     * @method byTag
     * @param {String} tag The tag being search for. 
     * @param {HTMLElement} root optional An optional root element to start from.
     * @param {Function} fn optional An optional boolean test to apply.
     * The optional function is passed the current HTMLElement being tested as its only argument.
     * If no function is given, all elements with the given tag are returned.
     * @return {Array} The collection of matching elements.
     */
    byTag: function(tag, root, fn) {
        root = root || Y.config.doc;

        var elements = root.getElementsByTagName(tag),
            retNodes = [];

        for (var i = 0, len = elements[LENGTH]; i < len; ++i) {
            if ( !fn || fn(elements[i]) ) {
                retNodes[retNodes[LENGTH]] = elements[i];
            }
        }
        return retNodes;
    },

    /**
     * Finds the first element with the given tag.
     * @method firstByTag
     * @param {String} tag The tag being search for. 
     * @param {HTMLElement} root optional An optional root element to start from.
     * @param {Function} fn optional An optional boolean test to apply.
     * The optional function is passed the current HTMLElement being tested as its only argument.
     * If no function is given, the first match is returned. 
     * @return {HTMLElement} The matching element.
     */
    firstByTag: function(tag, root, fn) {
        root = root || Y.config.doc;

        var elements = root.getElementsByTagName(tag),
            ret = null;

        for (var i = 0, len = elements[LENGTH]; i < len; ++i) {
            if ( !fn || fn(elements[i]) ) {
                ret = elements[i];
                break;
            }
        }
        return ret;
    },

    /**
     * Filters a collection of HTMLElements by the given attributes.
     * @method filterElementsBy
     * @param {Array} elements The collection of HTMLElements to filter.
     * @param {Function} fn A boolean test to apply.
     * The function is passed the current HTMLElement being tested as its only argument.
     * If no function is given, all HTMLElements are kept.
     * @return {Array} The filtered collection of HTMLElements.
     */
    filterElementsBy: function(elements, fn, firstOnly) {
        var ret = (firstOnly) ? null : [];
        for (var i = 0, len = elements[LENGTH]; i < len; ++i) {
            if (elements[i][TAG_NAME] && (!fn || fn(elements[i]))) {
                if (firstOnly) {
                    ret = elements[i];
                    break;
                } else {
                    ret[ret[LENGTH]] = elements[i];
                }
            }
        }

        return ret;
    },

    /**
     * Determines whether or not one HTMLElement is or contains another HTMLElement.
     * @method contains
     * @param {HTMLElement} element The containing html element.
     * @param {HTMLElement} needle The html element that may be contained.
     * @return {Boolean} Whether or not the element is or contains the needle.
     */
    contains: function(element, needle) {
        var ret = false;

        if ( !needle || !element || !needle[NODE_TYPE] || !element[NODE_TYPE]) {
            ret = false;
        } else if (element[CONTAINS])  {
            if (Y.UA.opera || needle[NODE_TYPE] === 1) { // IE & SAF contains fail if needle not an ELEMENT_NODE
                ret = element[CONTAINS](needle);
            } else {
                ret = Y.DOM._bruteContains(element, needle); 
            }
        } else if (element[COMPARE_DOCUMENT_POSITION]) { // gecko
            if (element === needle || !!(element[COMPARE_DOCUMENT_POSITION](needle) & 16)) { 
                ret = true;
            }
        }

        return ret;
    },

    /**
     * Determines whether or not the HTMLElement is part of the document.
     * @method inDoc
     * @param {HTMLElement} element The containing html element.
     * @param {HTMLElement} doc optional The document to check.
     * @return {Boolean} Whether or not the element is attached to the document. 
     */
    inDoc: function(element, doc) {
        doc = doc || Y.config.doc;
        return Y.DOM.contains(doc.documentElement, element);
    },

// TODO: dont return collection
    create: function(html, doc) {
        doc = doc || Y.config.doc;
        var m = re_tag.exec(html);
        var create = Y.DOM._create,
            custom = Y.DOM.creators,
            tag, ret;

        if (m && custom[m[1]]) {
            if (typeof custom[m[1]] === 'function') {
                create = custom[m[1]];
            } else {
                tag = custom[m[1]];
            }
        }
        ret = create(html, doc, tag);
        return (ret.childNodes.length > 1) ? ret.childNodes : ret.childNodes[0]; // collection or item
        //return ret.firstChild;
    },

    CUSTOM_ATTRIBUTES: (!document.documentElement.hasAttribute) ? { // IE < 8
        'for': 'htmlFor',
        'class': 'className'
    } : { // w3c
        'htmlFor': 'for',
        'className': 'class' 
    },

    /**
     * Provides a normalized attribute interface. 
     * @method setAttibute
     * @param {String | HTMLElement} el The target element for the attribute.
     * @param {String} attr The attribute to set.
     * @param {String} val The value of the attribute.
     */
    setAttribute: function(el, attr, val) {
        attr = Y.DOM.CUSTOM_ATTRIBUTES[attr] || attr;
        el.setAttribute(attr, val);
    },


    /**
     * Provides a normalized attribute interface. 
     * @method getAttibute
     * @param {String | HTMLElement} el The target element for the attribute.
     * @param {String} attr The attribute to get.
     * @return {String} The current value of the attribute. 
     */
    getAttribute: function(el, attr) {
        attr = Y.DOM.CUSTOM_ATTRIBUTES[attr] || attr;
        var ret = el.getAttribute(attr);
        if (!document.documentElement.hasAttribute) { // IE < 8
            if (el.getAttributeNode) {
                ret = el.getAttributeNode(attr);
                ret = (ret) ? ret.value : null;
            } else {
                ret = el.getAttribute(attr);
            }

        }
        if (ret === null) {
            ret = ''; // per DOM spec
        }
        return ret;
    },

    _create: function(html, doc, tag) {
        tag = tag || 'div';
        var frag = templateCache[tag] || doc.createElement(tag);
        frag.innerHTML = Y.Lang.trim(html);
        return frag;
    },

    /**
     * Brute force version of contains.
     * Used for browsers without contains support for non-HTMLElement Nodes (textNodes, etc).
     * @method _bruteContains
     * @private
     * @param {HTMLElement} element The containing html element.
     * @param {HTMLElement} needle The html element that may be contained.
     * @return {Boolean} Whether or not the element is or contains the needle.
     */
    _bruteContains: function(element, needle) {
        while (needle) {
            if (element === needle) {
                return true;
            }
            needle = needle.parentNode;
        }
        return false;
    },

// TODO: move to Lang?
    /**
     * Memoizes dynamic regular expressions to boost runtime performance. 
     * @method _getRegExp
     * @private
     * @param {String} str The string to convert to a regular expression.
     * @param {String} flags optional An optinal string of flags.
     * @return {RegExp} An instance of RegExp
     */
    _getRegExp: function(str, flags) {
        flags = flags || '';
        Y.DOM._regexCache = Y.DOM._regexCache || {};
        if (!Y.DOM._regexCache[str + flags]) {
            Y.DOM._regexCache[str + flags] = new RegExp(str, flags);
        }
        return Y.DOM._regexCache[str + flags];
    },

// TODO: make getDoc/Win true privates?
    /**
     * returns the appropriate document.
     * @method _getDoc
     * @private
     * @param {HTMLElement} element optional Target element.
     * @return {Object} The document for the given element or the default document. 
     */
    _getDoc: function(element) {
        element = element || {};

        return (element[NODE_TYPE] === 9) ? element : // element === document
                element[OWNER_DOCUMENT] || // element === DOM node
                element.document || // element === window
                Y.config.doc; // default
    },

    /**
     * returns the appropriate window.
     * @method _getWin
     * @private
     * @param {HTMLElement} element optional Target element.
     * @return {Object} The window for the given element or the default window. 
     */
    _getWin: function(element) {
        var doc = Y.DOM._getDoc(element);
        return doc[DEFAULT_VIEW] || doc[PARENT_WINDOW] || Y.config.win;
    },

    // TODO: document this
    _childBy: function(element, tag, fn, rev) {
        var ret = null,
            root, axis;

        if (element) {
            if (rev) {
                root = element[LAST_CHILD];
                axis = PREVIOUS_SIBLING;
            } else {
                root = element[FIRST_CHILD];
                axis = NEXT_SIBLING;
            }

            if (Y.DOM._testElement(root, tag, fn)) { // is the matching element
                ret = root;
            } else { // need to scan nextSibling axis of firstChild to find matching element
                ret = Y.DOM.elementByAxis(root, axis, fn);
            }
        }
        return ret;

    },

    _testElement: function(element, tag, fn) {
        tag = (tag && tag !== '*') ? tag.toUpperCase() : null;
        return (element && element[TAG_NAME] &&
                (!tag || element[TAG_NAME].toUpperCase() === tag) &&
                (!fn || fn(element)));
    },

    creators: {},

    _IESimpleCreate: function(html, doc) {
        doc = doc || Y.config.doc;
        return doc.createElement(html);
    }
};


(function() {
    var creators = Y.DOM.creators,
        create = Y.DOM.create,
        re_tbody = /(?:\/(?:thead|tfoot|tbody|caption|col|colgroup)>)+\s*<tbody/;

    var TABLE_OPEN = '<table>',
        TABLE_CLOSE = '</table>';

    if (Y.UA.gecko || Y.UA.ie) { // require custom creation code for certain element types
        Y.mix(creators, {
            option: function(html, doc) {
                var frag = create('<select>' + html + '</select>');
                return frag;
            },

            tr: function(html, doc) {
                var frag = creators.tbody('<tbody>' + html + '</tbody>', doc);
                return frag.firstChild;
            },

            td: function(html, doc) {
                var frag = creators.tr('<tr>' + html + '</tr>', doc);
                return frag.firstChild;
            }, 

            tbody: function(html, doc) {
                var frag = create(TABLE_OPEN + html + TABLE_CLOSE, doc);
                return frag;
            },

            legend: 'fieldset'
        });

        creators.col = creators.tbody; // IE wraps in colgroup
    }

    if (Y.UA.ie) {
        // TODO: allow multiples ("<link><link>")
        creators.col = creators.script = creators.link = Y.DOM._IESimpleCreate; 

        // TODO: thead/tfoot with nested tbody
        creators.tbody = function(html, doc) {
            var frag = create(TABLE_OPEN + html + TABLE_CLOSE, doc);
            var tb = frag.children.tags('tbody')[0];
            if (frag.children.length > 1 && tb && !re_tbody.test(html)) {
                tb.parentNode.removeChild(tb);
            }
            return frag;
        };

    }

    if (Y.UA.gecko || Y.UA.ie) { // require custom creation code for certain element types
        Y.mix(creators, {
                th: creators.td,
                thead: creators.tbody,
                tfoot: creators.tbody,
                caption: creators.tbody,
                colgroup: creators.tbody,
                col: creators.tbody,
                optgroup: creators.option
        });
    }
})();
/** 
 * The DOM utility provides a cross-browser abtraction layer
 * normalizing DOM tasks, and adds extra helper functionality
 * for other common tasks. 
 * @module dom
 * @submodule dom-base
 * @for DOM
 */

var CLASS_NAME = 'className';

Y.mix(Y.DOM, {
    /**
     * Determines whether a DOM element has the given className.
     * @method hasClass
     * @param {HTMLElement} element The DOM element. 
     * @param {String} className the class name to search for
     * @return {Boolean} Whether or not the element has the given class. 
     */
    hasClass: function(node, className) {
        var re = Y.DOM._getRegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
        return re.test(node[CLASS_NAME]);
    },

    /**
     * Adds a class name to a given DOM element.
     * @method addClass         
     * @param {HTMLElement} element The DOM element. 
     * @param {String} className the class name to add to the class attribute
     */
    addClass: function(node, className) {
        if (!Y.DOM.hasClass(node, className)) { // skip if already present 
            node[CLASS_NAME] = Y.Lang.trim([node[CLASS_NAME], className].join(' '));
        }
    },

    /**
     * Removes a class name from a given element.
     * @method removeClass         
     * @param {HTMLElement} element The DOM element. 
     * @param {String} className the class name to remove from the class attribute
     */
    removeClass: function(node, className) {
        if (className && Y.DOM.hasClass(node, className)) {
            node[CLASS_NAME] = Y.Lang.trim(node[CLASS_NAME].replace(Y.DOM._getRegExp('(?:^|\\s+)' +
                            className + '(?:\\s+|$)'), ' '));

            if ( Y.DOM.hasClass(node, className) ) { // in case of multiple adjacent
                Y.DOM.removeClass(node, className);
            }
        }                 
    },

    /**
     * Replace a class with another class for a given element.
     * If no oldClassName is present, the newClassName is simply added.
     * @method replaceClass  
     * @param {HTMLElement} element The DOM element. 
     * @param {String} oldClassName the class name to be replaced
     * @param {String} newClassName the class name that will be replacing the old class name
     */
    replaceClass: function(node, oldC, newC) {
        Y.DOM.addClass(node, newC);
        Y.DOM.removeClass(node, oldC);
    },

    /**
     * If the className exists on the node it is removed, if it doesn't exist it is added.
     * @method toggleClass  
     * @param {HTMLElement} element The DOM element. 
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

/** 
 * Add style management functionality to DOM.
 * @module dom
 * @submodule dom-style
 * @for DOM
 */

var DOCUMENT_ELEMENT = 'documentElement',
    DEFAULT_VIEW = 'defaultView',
    OWNER_DOCUMENT = 'ownerDocument',
    STYLE = 'style',
    FLOAT = 'float',
    CSS_FLOAT = 'cssFloat',
    STYLE_FLOAT = 'styleFloat',
    TRANSPARENT = 'transparent',
    VISIBLE = 'visible',
    WIDTH = 'width',
    HEIGHT = 'height',
    BORDER_TOP_WIDTH = 'borderTopWidth',
    BORDER_RIGHT_WIDTH = 'borderRightWidth',
    BORDER_BOTTOM_WIDTH = 'borderBottomWidth',
    BORDER_LEFT_WIDTH = 'borderLeftWidth',
    GET_COMPUTED_STYLE = 'getComputedStyle',

    DOCUMENT = Y.config.doc,
    UNDEFINED = undefined,

    re_color = /color$/i;


Y.mix(Y.DOM, {
    CUSTOM_STYLES: {},


    /**
     * Sets a style property for a given element.
     * @method setStyle
     * @param {HTMLElement} An HTMLElement to apply the style to.
     * @param {String} att The style property to set. 
     * @param {String|Number} val The value. 
     */
    setStyle: function(node, att, val, style) {
        style = node[STYLE],
            CUSTOM_STYLES = Y.DOM.CUSTOM_STYLES;

        if (style) {
            if (att in CUSTOM_STYLES) {
                if (CUSTOM_STYLES[att].set) {
                    CUSTOM_STYLES[att].set(node, val, style);
                    return; // NOTE: return
                } else if (typeof CUSTOM_STYLES[att] === 'string') {
                    att = CUSTOM_STYLES[att];
                }
            }
            style[att] = val; 
        }
    },

    /**
     * Returns the current style value for the given property.
     * @method getStyle
     * @param {HTMLElement} An HTMLElement to get the style from.
     * @param {String} att The style property to get. 
     */
    getStyle: function(node, att) {
        var style = node[STYLE],
            CUSTOM_STYLES = Y.DOM.CUSTOM_STYLES,
            val = '';

        if (style) {
            if (att in CUSTOM_STYLES) {
                if (CUSTOM_STYLES[att].get) {
                    return CUSTOM_STYLES[att].get(node, att, style); // NOTE: return
                } else if (typeof CUSTOM_STYLES[att] === 'string') {
                    att = CUSTOM_STYLES[att];
                }
            }
            val = style[att];
            if (val === '') { // TODO: is empty string sufficient?
                val = Y.DOM[GET_COMPUTED_STYLE](node, att);
            }
        }

        return val;
    },

    /**
     * Sets multiple style properties.
     * @method setStyles
     * @param {HTMLElement} node An HTMLElement to apply the styles to. 
     * @param {Object} hash An object literal of property:value pairs. 
     */
    setStyles: function(node, hash) {
        Y.each(hash, function(v, n) {
            Y.DOM.setStyle(node, n, v);
        }, Y.DOM);
    },

    /**
     * Returns the computed style for the given node.
     * @method getComputedStyle
     * @param {HTMLElement} An HTMLElement to get the style from.
     * @param {String} att The style property to get. 
     * @return {String} The computed value of the style property. 
     */
    getComputedStyle: function(node, att) {
        var val = '',
            doc = node[OWNER_DOCUMENT];

        if (node[STYLE]) {
            val = doc[DEFAULT_VIEW][GET_COMPUTED_STYLE](node, '')[att];
        }
        return val;
    }
});

// normalize reserved word float alternatives ("cssFloat" or "styleFloat")
if (DOCUMENT[DOCUMENT_ELEMENT][STYLE][CSS_FLOAT] !== UNDEFINED) {
    Y.DOM.CUSTOM_STYLES[FLOAT] = CSS_FLOAT;
} else if (DOCUMENT[DOCUMENT_ELEMENT][STYLE][STYLE_FLOAT] !== UNDEFINED) {
    Y.DOM.CUSTOM_STYLES[FLOAT] = STYLE_FLOAT;
}

// fix opera computedStyle default color unit (convert to rgb)
if (Y.UA.opera) {
    Y.DOM[GET_COMPUTED_STYLE] = function(node, att) {
        var view = node[OWNER_DOCUMENT][DEFAULT_VIEW],
            val = view[GET_COMPUTED_STYLE](node, '')[att];

        if (re_color.test(att)) {
            val = Y.Color.toRGB(val);
        }

        return val;
    };

}

// safari converts transparent to rgba(), others use "transparent"
if (Y.UA.webkit) {
    Y.DOM[GET_COMPUTED_STYLE] = function(node, att) {
        var view = node[OWNER_DOCUMENT][DEFAULT_VIEW],
            val = view[GET_COMPUTED_STYLE](node, '')[att];

        if (val === 'rgba(0, 0, 0, 0)') {
            val = TRANSPARENT; 
        }

        return val;
    };

}


/**
 * Adds position and region management functionality to DOM.
 * @module dom
 * @submodule dom-screen
 * @for DOM
 */

var OFFSET_TOP = 'offsetTop',

    DOCUMENT_ELEMENT = 'documentElement',
    COMPAT_MODE = 'compatMode',
    OFFSET_LEFT = 'offsetLeft',
    OFFSET_PARENT = 'offsetParent',
    POSITION = 'position',
    FIXED = 'fixed',
    RELATIVE = 'relative',
    LEFT = 'left',
    TOP = 'top',
    SCROLL_LEFT = 'scrollLeft',
    SCROLL_TOP = 'scrollTop',
    _BACK_COMPAT = 'BackCompat',
    MEDIUM = 'medium',
    HEIGHT = 'height',
    WIDTH = 'width',
    BORDER_LEFT_WIDTH = 'borderLeftWidth',
    BORDER_TOP_WIDTH = 'borderTopWidth',
    GET_BOUNDING_CLIENT_RECT = 'getBoundingClientRect',
    GET_COMPUTED_STYLE = 'getComputedStyle',

    // TODO: how about thead/tbody/tfoot/tr?
    // TODO: does caption matter?
    RE_TABLE = /^t(?:able|d|h)$/i;

Y.mix(Y.DOM, {
    /**
     * Returns the inner height of the viewport (exludes scrollbar). 
     * @method winHeight

     */
    winHeight: function(node) {
        var h = Y.DOM._getWinSize(node)[HEIGHT];
        return h;
    },

    /**
     * Returns the inner width of the viewport (exludes scrollbar). 
     * @method winWidth

     */
    winWidth: function(node) {
        var w = Y.DOM._getWinSize(node)[WIDTH];
        return w;
    },

    /**
     * Document height 
     * @method docHeight

     */
    docHeight:  function(node) {
        var h = Y.DOM._getDocSize(node)[HEIGHT];
        return Math.max(h, Y.DOM._getWinSize(node)[HEIGHT]);
    },

    /**
     * Document width 
     * @method docWidth
     */
    docWidth:  function(node) {
        var w = Y.DOM._getDocSize(node)[WIDTH];
        return Math.max(w, Y.DOM._getWinSize(node)[WIDTH]);
    },

    /**
     * Amount page has been scroll vertically 
     * @method docScrollX
     */
    docScrollX: function(node) {
        var doc = Y.DOM._getDoc(node);
        return Math.max(doc[DOCUMENT_ELEMENT][SCROLL_LEFT], doc.body[SCROLL_LEFT]);
    },

    /**
     * Amount page has been scroll horizontally 
     * @method docScrollY
     */
    docScrollY:  function(node) {
        var doc = Y.DOM._getDoc(node);
        return Math.max(doc[DOCUMENT_ELEMENT][SCROLL_TOP], doc.body[SCROLL_TOP]);
    },

    /**
     * Gets the current position of an element based on page coordinates. 
     * Element must be part of the DOM tree to have page coordinates
     * (display:none or elements not appended return false).
     * @method getXY
     * @param element The target element
     * @return {Array} The XY position of the element

     TODO: test inDocument/display
     */
    getXY: function() {
        if (document[DOCUMENT_ELEMENT][GET_BOUNDING_CLIENT_RECT]) {
            return function(node) {
                if (!node) {
                    return false;
                }
                var scrollLeft = Y.DOM.docScrollX(node),
                    scrollTop = Y.DOM.docScrollY(node),
                    box = node[GET_BOUNDING_CLIENT_RECT](),
                    doc = Y.DOM._getDoc(node),
                    //Round the numbers so we get sane data back
                    xy = [Math.floor(box[LEFT]), Math.floor(box[TOP])];

                    if (Y.UA.ie) {
                        var off1 = 2, off2 = 2,
                        mode = doc[COMPAT_MODE],
                        bLeft = Y.DOM[GET_COMPUTED_STYLE](doc[DOCUMENT_ELEMENT], BORDER_LEFT_WIDTH),
                        bTop = Y.DOM[GET_COMPUTED_STYLE](doc[DOCUMENT_ELEMENT], BORDER_TOP_WIDTH);

                        if (Y.UA.ie === 6) {
                            if (mode !== _BACK_COMPAT) {
                                off1 = 0;
                                off2 = 0;
                            }
                        }
                        
                        if ((mode == _BACK_COMPAT)) {
                            if (bLeft !== MEDIUM) {
                                off1 = parseInt(bLeft, 10);
                            }
                            if (bTop !== MEDIUM) {
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

                // gecko may return sub-pixel (non-int) values
                xy[0] = Math.floor(xy[0]);
                xy[1] = Math.floor(xy[1]);

                return xy;                   
            };
        } else {
            return function(node) { // manually calculate by crawling up offsetParents
                //Calculate the Top and Left border sizes (assumes pixels)
                var xy = [node[OFFSET_LEFT], node[OFFSET_TOP]],
                    parentNode = node,
                    // TODO: refactor with !! or just falsey
                    bCheck = ((Y.UA.gecko || Y.UA.webkit > 519) ? true : false);

                // TODO: worth refactoring for TOP/LEFT only?
                while ((parentNode = parentNode[OFFSET_PARENT])) {
                    xy[0] += parentNode[OFFSET_LEFT];
                    xy[1] += parentNode[OFFSET_TOP];
                    if (bCheck) {
                        xy = Y.DOM._calcBorders(parentNode, xy);
                    }
                }

                // account for any scrolled ancestors
                if (Y.DOM.getStyle(node, POSITION) != FIXED) {
                    parentNode = node;
                    var scrollTop, scrollLeft;

                    while ((parentNode = parentNode.parentNode)) {
                        scrollTop = parentNode[SCROLL_TOP];
                        scrollLeft = parentNode[SCROLL_LEFT];

                        //Firefox does something funky with borders when overflow is not visible.
                        if (Y.UA.gecko && (Y.DOM.getStyle(parentNode, 'overflow') !== 'visible')) {
                                xy = Y.DOM._calcBorders(parentNode, xy);
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
     * Gets the current X position of an element based on page coordinates. 
     * Element must be part of the DOM tree to have page coordinates
     * (display:none or elements not appended return false).
     * @method getX
     * @param element The target element
     * @return {Int} The X position of the element
     */

    getX: function(node) {
        return Y.DOM.getXY(node)[0];
    },

    /**
     * Gets the current Y position of an element based on page coordinates. 
     * Element must be part of the DOM tree to have page coordinates
     * (display:none or elements not appended return false).
     * @method getY
     * @param element The target element
     * @return {Int} The Y position of the element
     */

    getY: function(node) {
        return Y.DOM.getXY(node)[1];
    },

    /**
     * Set the position of an html element in page coordinates.
     * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @method setXY
     * @param element The target element
     * @param {Array} xy Contains X & Y values for new position (coordinates are page-based)
     * @param {Boolean} noRetry By default we try and set the position a second time if the first fails
     */
    setXY: function(node, xy, noRetry) {
        var pos = Y.DOM.getStyle(node, POSITION),
            setStyle = Y.DOM.setStyle,

            delta = [ // assuming pixels; if not we will have to retry
                parseInt( Y.DOM[GET_COMPUTED_STYLE](node, LEFT), 10 ),
                parseInt( Y.DOM[GET_COMPUTED_STYLE](node, TOP), 10 )
            ];
    
        if (pos == 'static') { // default to relative
            pos = RELATIVE;
            setStyle(node, POSITION, pos);
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
            setStyle(node, LEFT, xy[0] - currentXY[0] + delta[0] + 'px');
        }

        if (xy[1] !== null) {
            setStyle(node, TOP, xy[1] - currentXY[1] + delta[1] + 'px');
        }
      
        if (!noRetry) {
            var newXY = Y.DOM.getXY(node);

            // if retry is true, try one more time if we miss 
           if ( (xy[0] !== null && newXY[0] != xy[0]) || 
                (xy[1] !== null && newXY[1] != xy[1]) ) {
               Y.DOM.setXY(node, xy, true);
           }
        }        

    },

    /**
     * Set the X position of an html element in page coordinates, regardless of how the element is positioned.
     * The element(s) must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @method setX
     * @param element The target element
     * @param {Int} x The X values for new position (coordinates are page-based)
     */
    setX: function(node, x) {
        return Y.DOM.setXY(node, [x, null]);
    },

    /**
     * Set the Y position of an html element in page coordinates, regardless of how the element is positioned.
     * The element(s) must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @method setY
     * @param element The target element
     * @param {Int} y The Y values for new position (coordinates are page-based)
     */
    setY: function(node, y) {
        return Y.DOM.setXY(node, [null, y]);
    },

    _calcBorders: function(node, xy2) {
        var t = parseInt(Y.DOM[GET_COMPUTED_STYLE](node, BORDER_TOP_WIDTH), 10) || 0,
            l = parseInt(Y.DOM[GET_COMPUTED_STYLE](node, BORDER_LEFT_WIDTH), 10) || 0;
        if (Y.UA.gecko) {
            if (RE_TABLE.test(node.tagName)) {
                t = 0;
                l = 0;
            }
        }
        xy2[0] += l;
        xy2[1] += t;
        return xy2;
    },

    _getWinSize: function(node) {
        var doc = Y.DOM._getDoc(),
            win = doc.defaultView || doc.parentWindow,
            mode = doc[COMPAT_MODE],
            h = win.innerHeight,
            w = win.innerWidth,
            root = doc[DOCUMENT_ELEMENT];

        if ( mode && !Y.UA.opera ) { // IE, Gecko
            if (mode != 'CSS1Compat') { // Quirks
                root = doc.body; 
            }
            h = root.clientHeight;
            w = root.clientWidth;
        }
        return { height: h, width: w }; 
    },

    _getDocSize: function(node) {
        var doc = Y.DOM._getDoc(),
            root = doc[DOCUMENT_ELEMENT];

        if (doc[COMPAT_MODE] != 'CSS1Compat') {
            root = doc.body;
        }

        return { height: root.scrollHeight, width: root.scrollWidth };
    }
});
/**
 * Adds position and region management functionality to DOM.
 * @module dom
 * @submodule dom-screen
 * @for DOM
 */

var OFFSET_WIDTH = 'offsetWidth',
    OFFSET_HEIGHT = 'offsetHeight',
    TOP = 'top',
    RIGHT = 'right',
    BOTTOM = 'bottom',
    LEFT = 'left',
    TAG_NAME = 'tagName';

var getOffsets = function(r1, r2) {
    var t = Math.max(r1[TOP], r2[TOP]),
        r = Math.min(r1[RIGHT], r2[RIGHT]),
        b = Math.min(r1[BOTTOM], r2[BOTTOM]),
        l = Math.max(r1[LEFT], r2[LEFT]),
        ret = {};
    
    ret[TOP] = t;
    ret[RIGHT] = r;
    ret[BOTTOM] = b;
    ret[LEFT] = l;
    return ret;
};

var DOM = DOM || Y.DOM;
Y.mix(DOM, {
    /**
     * Returns an Object literal containing the following about this element: (top, right, bottom, left)
     * @method region
     * @param {HTMLElement} element The DOM element. 
     @return {Object} Object literal containing the following about this element: (top, right, bottom, left)
     */
    region: function(node) {
        var x = DOM.getXY(node),
            ret = false;
        
        if (x) {
            ret = {
                '0': x[0],
                '1': x[1],
                top: x[1],
                right: x[0] + node[OFFSET_WIDTH],
                bottom: x[1] + node[OFFSET_HEIGHT],
                left: x[0],
                height: node[OFFSET_HEIGHT],
                width: node[OFFSET_WIDTH]
            };
        }

        return ret;
    },

    /**
     * Find the intersect information for the passes nodes.
     * @method intersect
     * @param {HTMLElement} element The first element 
     * @param {HTMLElement | Object} element2 The element or region to check the interect with
     * @param {Object} altRegion An object literal containing the region for the first element if we already have the data (for performance i.e. DragDrop)
     @return {Object} Object literal containing the following intersection data: (top, right, bottom, left, area, yoff, xoff, inRegion)
     */
    intersect: function(node, node2, altRegion) {
        var r = altRegion || DOM.region(node), region = {};

        var n = node2;
        if (n[TAG_NAME]) {
            region = DOM.region(n);
        } else if (Y.Lang.isObject(node2)) {
            region = node2;
        } else {
            return false;
        }
        
        var off = getOffsets(region, r);
        return {
            top: off[TOP],
            right: off[RIGHT],
            bottom: off[BOTTOM],
            left: off[LEFT],
            area: ((off[BOTTOM] - off[TOP]) * (off[RIGHT] - off[LEFT])),
            yoff: ((off[BOTTOM] - off[TOP])),
            xoff: (off[RIGHT] - off[LEFT]),
            inRegion: DOM.inRegion(node, node2, false, altRegion)
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
            r = altRegion || DOM.region(node);

        var n = node2;
        if (n[TAG_NAME]) {
            region = DOM.region(n);
        } else if (Y.Lang.isObject(node2)) {
            region = node2;
        } else {
            return false;
        }
            
        if (all) {
            return (
                r[LEFT]   >= region[LEFT]   &&
                r[RIGHT]  <= region[RIGHT]  && 
                r[TOP]    >= region[TOP]    && 
                r[BOTTOM] <= region[BOTTOM]  );
        } else {
            var off = getOffsets(region, r);
            if (off[BOTTOM] >= off[TOP] && off[RIGHT] >= off[LEFT]) {
                return true;
            } else {
                return false;
            }
            
        }
    },

    /**
     * Check if any part of this element is in the viewport
     * @method inViewportRegion
     * @param {HTMLElement} element The DOM element. 
     * @param {Boolean} all Should all of the node be inside the region
     * @param {Object} altRegion An object literal containing the region for this node if we already have the data (for performance i.e. DragDrop)
     * @return {Boolean} True if in region, false if not.
     */
    inViewportRegion: function(node, all, altRegion) {
        return DOM.inRegion(node, DOM.viewportRegion(node), all, altRegion);
            
    },

    /**
     * Returns an Object literal containing the following about the visible region of viewport: (top, right, bottom, left)
     * @method viewportRegion
     @return {Object} Object literal containing the following about the visible region of the viewport: (top, right, bottom, left)
     */
    viewportRegion: function(node) {
        node = node || Y.config.doc.documentElement;
        var r = {};
        r[TOP] = DOM.docScrollY(node);
        r[RIGHT] = DOM.winWidth(node) + DOM.docScrollX(node);
        r[BOTTOM] = (DOM.docScrollY(node) + DOM.winHeight(node));
        r[LEFT] = DOM.docScrollX(node);

        return r;
    }
});
/**
 * Add style management functionality to DOM.
 * @module dom
 * @submodule dom-style
 * @for DOM
 */

var CLIENT_TOP = 'clientTop',
    CLIENT_LEFT = 'clientLeft',
    PARENT_NODE = 'parentNode',
    RIGHT = 'right',
    HAS_LAYOUT = 'hasLayout',
    PX = 'px',
    FILTER = 'filter',
    FILTERS = 'filters',
    OPACITY = 'opacity',
    AUTO = 'auto',
    CURRENT_STYLE = 'currentStyle';

// use alpha filter for IE opacity
if (document[DOCUMENT_ELEMENT][STYLE][OPACITY] === UNDEFINED &&
        document[DOCUMENT_ELEMENT][FILTERS]) {
    Y.DOM.CUSTOM_STYLES[OPACITY] = {
        get: function(node) {
            var val = 100;
            try { // will error if no DXImageTransform
                val = node[FILTERS]['DXImageTransform.Microsoft.Alpha'][OPACITY];

            } catch(e) {
                try { // make sure its in the document
                    val = node[FILTERS]('alpha')[OPACITY];
                } catch(err) {
                }
            }
            return val / 100;
        },

        set: function(node, val, style) {
            if (typeof style[FILTER] == 'string') { // in case not appended
                style[FILTER] = 'alpha(' + OPACITY + '=' + val * 100 + ')';
                
                if (!node[CURRENT_STYLE] || !node[CURRENT_STYLE][HAS_LAYOUT]) {
                    style.zoom = 1; // needs layout 
                }
            }
        }
    };
}

// IE getComputedStyle
// TODO: unit-less lineHeight (e.g. 1.22)
var re_size = /^width|height$/,
    re_unit = /^(\d[.\d]*)+(em|ex|px|gd|rem|vw|vh|vm|ch|mm|cm|in|pt|pc|deg|rad|ms|s|hz|khz|%){1}?/i;

var ComputedStyle = {
    CUSTOM_STYLES: {},

    get: function(el, property) {
        var value = '',
            current = el[CURRENT_STYLE][property];

        if (property === OPACITY) {
            value = Y.DOM.CUSTOM_STYLES[OPACITY].get(el);        
        } else if (!current || (current.indexOf && current.indexOf(PX) > -1)) { // no need to convert
            value = current;
        } else if (Y.DOM.IE.COMPUTED[property]) { // use compute function
            value = Y.DOM.IE.COMPUTED[property](el, property);
        } else if (re_unit.test(current)) { // convert to pixel
            value = Y.DOM.IE.ComputedStyle.getPixel(el, property);
        } else {
            value = current;
        }

        return value;
    },

    getOffset: function(el, prop) {
        var current = el[CURRENT_STYLE][prop],                        // value of "width", "top", etc.
            capped = prop.charAt(0).toUpperCase() + prop.substr(1), // "Width", "Top", etc.
            offset = 'offset' + capped,                             // "offsetWidth", "offsetTop", etc.
            pixel = 'pixel' + capped,                               // "pixelWidth", "pixelTop", etc.
            value = '';

        if (current == AUTO) {
            var actual = el[offset]; // offsetHeight/Top etc.
            if (actual === UNDEFINED) { // likely "right" or "bottom"
                value = 0;
            }

            value = actual;
            if (re_size.test(prop)) { // account for box model diff 
                el[STYLE][prop] = actual; 
                if (el[offset] > actual) {
                    // the difference is padding + border (works in Standards & Quirks modes)
                    value = actual - (el[offset] - actual);
                }
                el[STYLE][prop] = AUTO; // revert to auto
            }
        } else { // convert units to px
            if (!el[STYLE][pixel] && !el[STYLE][prop]) { // need to map style.width to currentStyle (no currentStyle.pixelWidth)
                el[STYLE][prop] = current;              // no style.pixelWidth if no style.width
            }
            value = el[STYLE][pixel];
        }
        return value + PX;
    },

    getBorderWidth: function(el, property) {
        // clientHeight/Width = paddingBox (e.g. offsetWidth - borderWidth)
        // clientTop/Left = borderWidth
        var value = null;
        if (!el[CURRENT_STYLE][HAS_LAYOUT]) { // TODO: unset layout?
            el[STYLE].zoom = 1; // need layout to measure client
        }

        switch(property) {
            case BORDER_TOP_WIDTH:
                value = el[CLIENT_TOP];
                break;
            case BORDER_BOTTOM_WIDTH:
                value = el.offsetHeight - el.clientHeight - el[CLIENT_TOP];
                break;
            case BORDER_LEFT_WIDTH:
                value = el[CLIENT_LEFT];
                break;
            case BORDER_RIGHT_WIDTH:
                value = el.offsetWidth - el.clientWidth - el[CLIENT_LEFT];
                break;
        }
        return value + PX;
    },

    getPixel: function(node, att) {
        // use pixelRight to convert to px
        var val = null,
            styleRight = node[CURRENT_STYLE][RIGHT],
            current = node[CURRENT_STYLE][att];

        node[STYLE][RIGHT] = current;
        val = node[STYLE].pixelRight;
        node[STYLE][RIGHT] = styleRight; // revert

        return val + PX;
    },

    getMargin: function(node, att) {
        var val;
        if (node[CURRENT_STYLE][att] == AUTO) {
            val = 0 + PX;
        } else {
            val = Y.DOM.IE.ComputedStyle.getPixel(node, att);
        }
        return val;
    },

    getVisibility: function(node, att) {
        var current;
        while ( (current = node[CURRENT_STYLE]) && current[att] == 'inherit') { // NOTE: assignment in test
            node = node[PARENT_NODE];
        }
        return (current) ? current[att] : VISIBLE;
    },

    getColor: function(node, att) {
        var current = node[CURRENT_STYLE][att];

        if (!current || current === TRANSPARENT) {
            Y.DOM.elementByAxis(node, PARENT_NODE, null, function(parent) {
                current = parent[CURRENT_STYLE][att];
                if (current && current !== TRANSPARENT) {
                    node = parent;
                    return true;
                }
            });
        }

        return Y.Color.toRGB(current);
    },

    getBorderColor: function(node, att) {
        var current = node[CURRENT_STYLE];
        var val = current[att] || current.color;
        return Y.Color.toRGB(Y.Color.toHex(val));
    }

};

//fontSize: getPixelFont,
var IEComputed = {};

// TODO: top, right, bottom, left
IEComputed[WIDTH] = IEComputed[HEIGHT] = ComputedStyle.getOffset;

IEComputed.color = IEComputed.backgroundColor = ComputedStyle.getColor;

IEComputed[BORDER_TOP_WIDTH] = IEComputed[BORDER_RIGHT_WIDTH] =
        IEComputed[BORDER_BOTTOM_WIDTH] = IEComputed[BORDER_LEFT_WIDTH] =
        ComputedStyle.getBorderWidth;

IEComputed.marginTop = IEComputed.marginRight = IEComputed.marginBottom =
        IEComputed.marginLeft = ComputedStyle.getMargin;

IEComputed.visibility = ComputedStyle.getVisibility;
IEComputed.borderColor = IEComputed.borderTopColor =
        IEComputed.borderRightColor = IEComputed.borderBottomColor =
        IEComputed.borderLeftColor = ComputedStyle.getBorderColor;

if (!Y.config.win[GET_COMPUTED_STYLE]) {
    Y.DOM[GET_COMPUTED_STYLE] = ComputedStyle.get; 
}

Y.namespace('DOM.IE');
Y.DOM.IE.COMPUTED = IEComputed;
Y.DOM.IE.ComputedStyle = ComputedStyle;

/*!
 * Sizzle CSS Selector Engine - v1.0
 *  Copyright 2009, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?/g,
	done = 0,
	toString = Object.prototype.toString,
	arraySplice = Array.prototype.splice,
	arrayPush = Array.prototype.push,
	arraySort = Array.prototype.sort;

var Sizzle = function(selector, context, results, seed) {
	results = results || [];
	var origContext = context = context || document;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var parts = [], m, set, checkSet, check, mode, extra, prune = true, contextXML = isXML(context);
	
	// Reset the position of the chunker regexp (start from head)
	chunker.lastIndex = 0;
	
	while ( (m = chunker.exec(selector)) !== null ) {
		parts.push( m[1] );
		
		if ( m[2] ) {
			extra = RegExp.rightContext;
			break;
		}
	}

	if ( parts.length > 1 && origPOS.exec( selector ) ) {
		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context );
		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] )
					selector += parts.shift();

				set = posProcess( selector, set );
			}
		}
	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {
			var ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ? Sizzle.filter( ret.expr, ret.set )[0] : ret.set[0];
		}

		if ( context ) {
			var ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );
			set = ret.expr ? Sizzle.filter( ret.expr, ret.set ) : ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray(set);
			} else {
				prune = false;
			}

			while ( parts.length ) {
				var cur = parts.pop(), pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}
		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		throw "Syntax error, unrecognized expression: " + (cur || selector);
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			arrayPush.apply( results, checkSet );
		} else if ( context && context.nodeType === 1 ) {
			for ( var i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && contains(context, checkSet[i])) ) {
					arrayPush.call( results, set[i] );
				}
			}
		} else {
			for ( var i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					arrayPush.call( results, set[i] );
				}
			}
		}
	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function(results){
	if ( sortOrder ) {
		hasDuplicate = false;
		arraySort.call(results, sortOrder);

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[i-1] ) {
					arraySplice.call(results, i--, 1);
				}
			}
		}
	}
};

Sizzle.matches = function(expr, set){
	return Sizzle(expr, null, null, set);
};

Sizzle.find = function(expr, context, isXML){
	var set, match;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var type = Expr.order[i], match;
		
		if ( (match = Expr.match[ type ].exec( expr )) ) {
			var left = RegExp.leftContext;

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace(/\\/g, "");
				set = Expr.find[ type ]( match, context, isXML );
				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = context.getElementsByTagName("*");
	}

	return {set: set, expr: expr};
};

Sizzle.filter = function(expr, set, inplace, not){
	var old = expr, result = [], curLoop = set, match, anyFound,
		isXMLFilter = set && set[0] && isXML(set[0]);

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.match[ type ].exec( expr )) != null ) {
				var filter = Expr.filter[ type ], found, item;
				anyFound = false;

				if ( curLoop == result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;
					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;
								} else {
									curLoop[i] = false;
								}
							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr == old ) {
			if ( anyFound == null ) {
				throw "Syntax error, unrecognized expression: " + expr;
			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],
	match: {
		ID: /#((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF_-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF_-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*_-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF_-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/
	},
	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},
	attrHandle: {
		href: function(elem){
			return elem.getAttribute("href");
		}
	},
	relative: {
		"+": function(checkSet, part, isXML){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !/\W/.test(part),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag && !isXML ) {
				part = part.toUpperCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},
		">": function(checkSet, part, isXML){
			var isPartStr = typeof part === "string";

			if ( isPartStr && !/\W/.test(part) ) {
				part = isXML ? part : part.toUpperCase();

				for ( var i = 0, l = checkSet.length; i < l; i++ ) {
					var elem = checkSet[i];
					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName === part ? parent : false;
					}
				}
			} else {
				for ( var i = 0, l = checkSet.length; i < l; i++ ) {
					var elem = checkSet[i];
					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},
		"": function(checkSet, part, isXML){
			var doneName = done++, checkFn = dirCheck;

			if ( !part.match(/\W/) ) {
				var nodeCheck = part = isXML ? part : part.toUpperCase();
				checkFn = dirNodeCheck;
			}

			checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
		},
		"~": function(checkSet, part, isXML){
			var doneName = done++, checkFn = dirCheck;

			if ( typeof part === "string" && !part.match(/\W/) ) {
				var nodeCheck = part = isXML ? part : part.toUpperCase();
				checkFn = dirNodeCheck;
			}

			checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
		}
	},
	find: {
		ID: function(match, context, isXML){
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				return m ? [m] : [];
			}
		},
		NAME: function(match, context, isXML){
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [], results = context.getElementsByName(match[1]);

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},
		TAG: function(match, context){
			return context.getElementsByTagName(match[1]);
		}
	},
	preFilter: {
		CLASS: function(match, curLoop, inplace, result, not, isXML){
			match = " " + match[1].replace(/\\/g, "") + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").indexOf(match) >= 0) ) {
						if ( !inplace )
							result.push( elem );
					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},
		ID: function(match){
			return match[1].replace(/\\/g, "");
		},
		TAG: function(match, curLoop){
			for ( var i = 0; curLoop[i] === false; i++ ){}
			return curLoop[i] && isXML(curLoop[i]) ? match[1] : match[1].toUpperCase();
		},
		CHILD: function(match){
			if ( match[1] == "nth" ) {
				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(
					match[2] == "even" && "2n" || match[2] == "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},
		ATTR: function(match, curLoop, inplace, result, not, isXML){
			var name = match[1].replace(/\\/g, "");
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},
		PSEUDO: function(match, curLoop, inplace, result, not){
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( match[3].match(chunker).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);
				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
					if ( !inplace ) {
						result.push.apply( result, ret );
					}
					return false;
				}
			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},
		POS: function(match){
			match.unshift( true );
			return match;
		}
	},
	filters: {
		enabled: function(elem){
			return elem.disabled === false && elem.type !== "hidden";
		},
		disabled: function(elem){
			return elem.disabled === true;
		},
		checked: function(elem){
			return elem.checked === true;
		},
		selected: function(elem){
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			elem.parentNode.selectedIndex;
			return elem.selected === true;
		},
		parent: function(elem){
			return !!elem.firstChild;
		},
		empty: function(elem){
			return !elem.firstChild;
		},
		has: function(elem, i, match){
			return !!Sizzle( match[3], elem ).length;
		},
		header: function(elem){
			return /h\d/i.test( elem.nodeName );
		},
		text: function(elem){
			return "text" === elem.type;
		},
		radio: function(elem){
			return "radio" === elem.type;
		},
		checkbox: function(elem){
			return "checkbox" === elem.type;
		},
		file: function(elem){
			return "file" === elem.type;
		},
		password: function(elem){
			return "password" === elem.type;
		},
		submit: function(elem){
			return "submit" === elem.type;
		},
		image: function(elem){
			return "image" === elem.type;
		},
		reset: function(elem){
			return "reset" === elem.type;
		},
		button: function(elem){
			return "button" === elem.type || elem.nodeName.toUpperCase() === "BUTTON";
		},
		input: function(elem){
			return /input|select|textarea|button/i.test(elem.nodeName);
		}
	},
	setFilters: {
		first: function(elem, i){
			return i === 0;
		},
		last: function(elem, i, match, array){
			return i === array.length - 1;
		},
		even: function(elem, i){
			return i % 2 === 0;
		},
		odd: function(elem, i){
			return i % 2 === 1;
		},
		lt: function(elem, i, match){
			return i < match[3] - 0;
		},
		gt: function(elem, i, match){
			return i > match[3] - 0;
		},
		nth: function(elem, i, match){
			return match[3] - 0 == i;
		},
		eq: function(elem, i, match){
			return match[3] - 0 == i;
		}
	},
	filter: {
		PSEUDO: function(elem, match, i, array){
			var name = match[1], filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || "").indexOf(match[3]) >= 0;
			} else if ( name === "not" ) {
				var not = match[3];

				for ( var i = 0, l = not.length; i < l; i++ ) {
					if ( not[i] === elem ) {
						return false;
					}
				}

				return true;
			}
		},
		CHILD: function(elem, match){
			var type = match[1], node = elem;
			switch (type) {
				case 'only':
				case 'first':
					while (node = node.previousSibling)  {
						if ( node.nodeType === 1 ) return false;
					}
					if ( type == 'first') return true;
					node = elem;
				case 'last':
					while (node = node.nextSibling)  {
						if ( node.nodeType === 1 ) return false;
					}
					return true;
				case 'nth':
					var first = match[2], last = match[3];

					if ( first == 1 && last == 0 ) {
						return true;
					}
					
					var doneName = match[0],
						parent = elem.parentNode;
	
					if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
						var count = 0;
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 
						parent.sizcache = doneName;
					}
					
					var diff = elem.nodeIndex - last;
					if ( first == 0 ) {
						return diff == 0;
					} else {
						return ( diff % first == 0 && diff / first >= 0 );
					}
			}
		},
		ID: function(elem, match){
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},
		TAG: function(elem, match){
			return (match === "*" && elem.nodeType === 1) || elem.nodeName === match;
		},
		CLASS: function(elem, match){
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},
		ATTR: function(elem, match){
			var name = match[1],
				result = Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value != check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},
		POS: function(elem, match, i, array){
			var name = match[2], filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS;

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + /(?![^\[]*\])(?![^\(]*\))/.source );
}

var makeArray = function(array, results) {
	array = Array.prototype.slice.call( array );

	if ( results ) {
		arrayPush.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
try {
	Array.prototype.slice.call( document.documentElement.childNodes );

// Provide a fallback method if it does not work
} catch(e){
	makeArray = function(array, results) {
		var ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );
		} else {
			if ( typeof array.length === "number" ) {
				for ( var i = 0, l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}
			} else {
				for ( var i = 0; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		var ret = a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
} else if ( "sourceIndex" in document.documentElement ) {
	sortOrder = function( a, b ) {
		var ret = a.sourceIndex - b.sourceIndex;
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
} else if ( document.createRange ) {
	sortOrder = function( a, b ) {
		var aRange = a.ownerDocument.createRange(), bRange = b.ownerDocument.createRange();
		aRange.selectNode(a);
		aRange.collapse(true);
		bRange.selectNode(b);
		bRange.collapse(true);
		var ret = aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date).getTime();
	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	var root = document.documentElement;
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( !!document.getElementById( id ) ) {
		Expr.find.ID = function(match, context, isXML){
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : [];
			}
		};

		Expr.filter.ID = function(elem, match){
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function(match, context){
			var results = context.getElementsByTagName(match[1]);

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";
	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {
		Expr.attrHandle.href = function(elem){
			return elem.getAttribute("href", 2);
		};
	}
})();

if ( document.querySelectorAll ) (function(){
	var oldSizzle = Sizzle, div = document.createElement("div");
	div.innerHTML = "<p class='TEST'></p>";

	// Safari can't handle uppercase or unicode characters when
	// in quirks mode.
	if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
		return;
	}
	
	Sizzle = function(query, context, extra, seed){
		context = context || document;

		// Only use querySelectorAll on non-XML documents
		// (ID selectors don't work in non-HTML documents)
		if ( !seed && context.nodeType === 9 && !isXML(context) ) {
			try {
				return makeArray( context.querySelectorAll(query), extra );
			} catch(e){}
		}
		
		return oldSizzle(query, context, extra, seed);
	};

	for ( var prop in oldSizzle ) {
		Sizzle[ prop ] = oldSizzle[ prop ];
	}
})();

if ( document.getElementsByClassName && document.documentElement.getElementsByClassName ) (function(){
	var div = document.createElement("div");
	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	if ( div.getElementsByClassName("e").length === 0 )
		return;

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 )
		return;

	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function(match, context, isXML) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	var sibDir = dir == "previousSibling" && !isXML;
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
			if ( sibDir && elem.nodeType === 1 ){
				elem.sizcache = doneName;
				elem.sizset = i;
			}
			elem = elem[dir];
			var match = false;

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					//match = checkSet[elem.sizset];
					match = checkSet[i];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem.sizcache = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	var sibDir = dir == "previousSibling" && !isXML;
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
			if ( sibDir && elem.nodeType === 1 ) {
				elem.sizcache = doneName;
				elem.sizset = i;
			}
			elem = elem[dir];
			var match = false;

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem.sizcache = doneName;
						elem.sizset = i;
					}
					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

var contains = document.compareDocumentPosition ?  function(a, b){
	return a.compareDocumentPosition(b) & 16;
} : function(a, b){
	return a !== b && (a.contains ? a.contains(b) : true);
};

var isXML = function(elem){
	return elem.nodeType === 9 && elem.documentElement.nodeName !== "HTML" ||
		!!elem.ownerDocument && elem.ownerDocument.documentElement.nodeName !== "HTML";
};

var posProcess = function(selector, context){
	var tmpSet = [], later = "", match,
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE

window.Sizzle = Sizzle;

})();
Y.Selector = {
    query: function(selector, root, firstOnly) {
        var ret = firstOnly ? null : [];

        root = root || Y.config.doc; // default to configured document

        if (typeof root === 'string') { // allow string input TODO: do we need this?
            root = Y.DOM.byId(root);
        }

        if (root) {
            if (firstOnly) {
                ret = Sizzle(selector + ':first', root)[0] || null;
            } else {
                ret  = Sizzle(selector, root)
            }
        }
        return ret;
    },
    test: function(node, selector) {
        var matches,
            ret = false;

        if (node && selector) {
            matches = Sizzle.matches(selector, [node]);
            if (matches.length) {
                ret = (matches[0] === node);
            }
        } else {
        }
        return ret;
    },

    filter: function(nodes, selector) {
        nodes = nodes || [];
        return Sizzle.matches(selector, nodes); 
    }
};
/**
 * Add style management functionality to DOM.
 * @module dom
 * @submodule dom-style
 * @for DOM
 */

var TO_STRING = 'toString',
    PARSE_INT = parseInt,
    RE = RegExp;

Y.Color = {
    KEYWORDS: {
        black: '000',
        silver: 'c0c0c0',
        gray: '808080',
        white: 'fff',
        maroon: '800000',
        red: 'f00',
        purple: '800080',
        fuchsia: 'f0f',
        green: '008000',
        lime: '0f0',
        olive: '808000',
        yellow: 'ff0',
        navy: '000080',
        blue: '00f',
        teal: '008080',
        aqua: '0ff'
    },

    re_RGB: /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,
    re_hex: /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,
    re_hex3: /([0-9A-F])/gi,

    toRGB: function(val) {
        if (!Y.Color.re_RGB.test(val)) {
            val = Y.Color.toHex(val);
        }

        if(Y.Color.re_hex.exec(val)) {
            val = 'rgb(' + [
                PARSE_INT(RE.$1, 16),
                PARSE_INT(RE.$2, 16),
                PARSE_INT(RE.$3, 16)
            ].join(', ') + ')';
        }
        return val;
    },

    toHex: function(val) {
        val = Y.Color.KEYWORDS[val] || val;
        if (Y.Color.re_RGB.exec(val)) {
            var r = (RE.$1.length === 1) ? '0' + RE.$1 : Number(RE.$1),
                g = (RE.$2.length === 1) ? '0' + RE.$2 : Number(RE.$2),
                b = (RE.$3.length === 1) ? '0' + RE.$3 : Number(RE.$3);

            val = [
                r[TO_STRING](16),
                g[TO_STRING](16),
                b[TO_STRING](16)
            ].join('');
        }

        if (val.length < 6) {
            val = val.replace(Y.Color.re_hex3, '$1$1');
        }

        if (val !== 'transparent' && val.indexOf('#') < 0) {
            val = '#' + val;
        }

        return val.toLowerCase();
    }
};



}, '@VERSION@' );
