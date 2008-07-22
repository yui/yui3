/**
 * @class DOM
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
    OFFSET_HEIGHT = 'offsetHeight',
    OFFSET_WIDTH = 'offsetWidth',
    CONTAINS = 'contains',
    COMPARE_DOCUMENT_POSITION = 'compareDocumentPosition',
    INNER_TEXT = 'innerText',
    TEXT_CONTENT = 'textContent',
    CLIENT_HEIGHT = 'clientHeight',
    CLIENT_WIDTH = 'clientWidth',
    LENGTH = 'length',
    STRING = 'string',

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
        return Y.DOM._getDoc(doc).getElementById(id); // @tested
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
        return text || ''; // @tested
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
        return Y.DOM._childBy(element, null, fn); // @tested
    },

    firstChildByTag: function(element, tag, fn) {
        return Y.DOM._childBy(element, tag, fn); // @tested
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
        return Y.DOM._childBy(element, null, fn, true); // @tested
    },

    lastChildByTag: function(element, tag, fn) {
        return Y.DOM._childBy(element, tag, fn, true); // @tested
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

                return elements; // @tested
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

                    elements = Y.DOM.filterElementsBy(elements, wrapFn); // @tested
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
        return Y.DOM.childrenByTag(element, null, fn); // @tested
    },

    previous: function(element, fn) {
        return Y.DOM.elementByAxis(element, PREVIOUS_SIBLING, fn);
    },

    next: function(element, fn) {
        return Y.DOM.elementByAxis(element, NEXT_SIBLING, fn);
    },

    ancestor: function(element, fn) {
        return Y.DOM.elementByAxis(element, PARENT_NODE, fn);
    },

    /**
     * @method insertBefore 
     * @param {String | HTMLElement} newNode The node to be inserted 
     * @param {String | HTMLElement} referenceNode The node to insert the new node before  
     * @return {HTMLElement} The node that was inserted (or null if insert fails)  
     */ 
    insertBefore: function(newNode, referenceNode, parentNode) { 
        parentNode = parentNode || referenceNode[PARENT_NODE];
        if (!referenceNode) {
            if (parentNode[FIRST_CHILD]) {
                parentNode.insertBefore(newNode, parentNode.firstChild);
            } else {
                parentNode.appendChild(newNode);
            }
        } else {
            return parentNode.insertBefore(newNode, referenceNode);  
        }
    }, 

    /** 
     * Inserts the new node as the next sibling of the reference node  
     * @method insertAfter 
     * @param {String | HTMLElement} newNode The node to be inserted 
     * @param {String | HTMLElement} referenceNode The node to insert the new node after  
     * @return {HTMLElement} The node that was inserted (or null if insert fails)  
     */ 
    insertAfter: function(newNode, referenceNode, parentNode) { 
        parentNode = parentNode || referenceNode[PARENT_NODE];
        if (referenceNode[NEXT_SIBLING]) { 
            return parentNode.insertBefore(newNode, referenceNode[NEXT_SIBLING]);  
        } else { 
            return parentNode.appendChild(newNode); 
        } 
    },

    /**
     * Searches the element by the given axis for matching elements.
     * @method elementsByAxis
     * @param {HTMLElement} element The html element.
     * @param {String} axis The axis to search (parentNode, nextSibling, previousSibling).
     * @param {String} tag optional An optional tag to restrict the search to. 
     * @param {Function} fn optional An optional boolean test to apply.
     * The optional function is passed the current HTMLElement being tested as its only argument.
     * If no function is given, all elements along the axis are collected.
     * @return {Array} The collection of elements.
     */
    elementsByAxis: function(element, axis, fn) {
        var ret = [];

        while (element && (element = element[axis])) { // NOTE: assignment
            if ( element[TAG_NAME] && (!fn || fn(element)) ) {
                ret[ret[LENGTH]] = element;
            }
        }
        return ret;
    },

    /**
     * Searches the element by the given axis for the first matching element.
     * @method elementByAxis
     * @param {HTMLElement} element The html element.
     * @param {String} axis The axis to search (parentNode, nextSibling, previousSibling).
     * @param {Function} fn optional An optional boolean test to apply.
     * The optional function is passed the current HTMLElement being tested as its only argument.
     * If no function is given, the first element is returned.
     * @return {HTMLElement | null} The matching element or null if none found.
     */
    elementByAxis: function(element, axis, fn) {
        while (element && (element = element[axis])) { // NOTE: assignment
                if ( element[TAG_NAME] && (!fn || fn(element)) ) { // TODO: all nodeTypes option?
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
     * If no function is given, all elements with the given tag are returned.
     * @return {Array} The collection of matching elements.
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

        if (!needle || !element) {
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

    _create: function(html, doc, tag) {
        tag = tag || 'div';
        var frag = templateCache[tag] || doc.createElement(tag);
        frag.innerHTML = html;
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

    /**
     * returns the appropriate document.
     * @method _getDoc
     * @private
     * @param {HTMLElement} element optional Target element.
     * @return {Object} The document for the given element or the default document. 
     */
    _getDoc: function(element) {
        element = element || {};
        return (element[NODE_TYPE] === 9) ? element : element[OWNER_DOCUMENT] ||
                                                Y.config.doc;
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
        return (element.document) ? element : doc[DEFAULT_VIEW] ||
                                        doc[PARENT_WINDOW] || Y.config.win;
    },

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
