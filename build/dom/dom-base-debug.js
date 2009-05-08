YUI.add('dom-base', function(Y) {

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

    UNDEFINED = undefined,

    re_tag = /<([a-z]+)/i;

Y.DOM = {
    /**
     * Returns the HTMLElement with the given ID (Wrapper for document.getElementById).
     * @method byId         
     * @param {String} id the id attribute 
     * @param {Object} doc optional The document to search. Defaults to current document 
     * @return {HTMLElement | null} The HTMLElement with the id, or null if none found. 
     */
    byId: function(id, doc) {
        doc = doc || Y.config.doc;
        // TODO: IE Name
        return doc.getElementById(id);
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

// TODO: pull out sugar (rely on _childBy, byAxis, etc)?
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

    /*
     * Finds all HTMLElement childNodes matching the given tag.
     * @method childrenByTag
     * @param {HTMLElement} element The html element.
     * @param {String} tag The tag to search for.
     * @param {Function} fn optional An optional boolean test to apply.
     * The optional function is passed the current HTMLElement being tested as its only argument.
     * If no function is given, all children with the given tag are collected.
     * @return {Array} The collection of child elements.
     * TODO: deprecate?  Webkit children.tags() returns grandchildren
     */
    _childrenByTag: function() {
        if (document[DOCUMENT_ELEMENT].children) {
            return function(element, tag, fn, toArray) { // TODO: keep toArray option?
                tag = (tag && tag !== '*') ? tag.toUpperCase() : null;
                var elements = [],
                    wrapFn = fn;
                if (element) {
                    if (tag && !Y.UA.webkit) { // children.tags() broken in safari
                        elements = element.children.tags(tag);
                    } else {
                        elements = element.children;
                        if (tag) {
                            wrapFn = function(el) {
                                return el[TAG_NAME].toUpperCase() === tag && (!fn || fn(el));
                            }
                        }
                    }

                    elements = Y.DOM.filterElementsBy(elements, wrapFn);
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
        return Y.DOM._childrenByTag(element, null, fn);
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

    /**
     * Inserts the new node as the previous sibling of the reference node 
     * @method insertBefore
     * @param {String | HTMLElement} newNode The node to be inserted
     * @param {String | HTMLElement} referenceNode The node to insert the new node before 
     * @return {HTMLElement} The node that was inserted (or null if insert fails) 
     */
    insertBefore: function(newNode, referenceNode) {
        if (!newNode || !referenceNode || !referenceNode[PARENT_NODE]) {
            YAHOO.log('insertAfter failed: missing or invalid arg(s)', 'error', 'DOM');
            return null;
        }
        return referenceNode[PARENT_NODE].insertBefore(newNode, referenceNode);
    },

    /**
     * Inserts the new node as the next sibling of the reference node 
     * @method insertAfter
     * @param {String | HTMLElement} newNode The node to be inserted
     * @param {String | HTMLElement} referenceNode The node to insert the new node after 
     * @return {HTMLElement} The node that was inserted (or null if insert fails) 
     */
    insertAfter: function(newNode, referenceNode) {
        if (!newNode || !referenceNode || !referenceNode[PARENT_NODE]) {
            YAHOO.log('insertAfter failed: missing or invalid arg(s)', 'error', 'DOM');
            return null;
        }       

        if (referenceNode[NEXT_SIBLING]) {
            return referenceNode[PARENT_NODE].insertBefore(newNode, referenceNode[NEXT_SIBLING]); 
        } else {
            return referenceNode[PARENT_NODE].appendChild(newNode);
        }
    },

    /**
     * Creates a new dom node using the provided markup string. 
     * @method create
     * @param {String} html The markup used to create the element
     * @param {HTMLDocument} doc An optional document context 
     * @param {Boolean} execScripts Whether or not any provided scripts should be executed.
     * If execScripts is false, all scripts are stripped.
     */
    create: function(html, doc, execScripts) {
        doc = doc || Y.config.doc;
        var m = re_tag.exec(html),
            create = Y.DOM._create,
            custom = Y.DOM.creators,
            tag, node;

        if (m && custom[m[1]]) {
            if (typeof custom[m[1]] === 'function') {
                create = custom[m[1]];
            } else {
                tag = custom[m[1]];
            }
        }

        node = create(html, doc, tag);

        return node;
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
        if (el && el.setAttribute) {
            attr = Y.DOM.CUSTOM_ATTRIBUTES[attr] || attr;
            el.setAttribute(attr, val);
        }
    },


    /**
     * Provides a normalized attribute interface. 
     * @method getAttibute
     * @param {String | HTMLElement} el The target element for the attribute.
     * @param {String} attr The attribute to get.
     * @return {String} The current value of the attribute. 
     */
    getAttribute: function(el, attr) {
        var ret = '';
        if (el && el.getAttribute) {
            attr = Y.DOM.CUSTOM_ATTRIBUTES[attr] || attr;
            ret = el.getAttribute(attr, 2);

            if (ret === null) {
                ret = ''; // per DOM spec
            }
        }
        return ret;
    },

    srcIndex: (document.documentElement.sourceIndex) ?
        function(node) {
            return (node && node.sourceIndex) ? node.sourceIndex : null;
        } :
        function(node) {
            return (node && node[OWNER_DOCUMENT]) ? 
                    [].indexOf.call(node[OWNER_DOCUMENT].
                            getElementsByTagName('*'), node) : null;
        },

    isWindow: function(obj) {
        return obj.alert && obj.document;
    },

    _create: function(html, doc, tag) {
        tag = tag || 'div';
        var frag = doc.createElement(tag);
        frag.innerHTML = Y.Lang.trim(html);
        return frag.removeChild(frag[FIRST_CHILD]);
    },

    insertHTML: function(node, content, where, execScripts) {
        var scripts,
            newNode = Y.DOM.create(content);

        switch(where) {
            case 'innerHTML': 
                node.innerHTML = content; // TODO: purge?
                newNode = node;
                break;
            case 'beforeBegin':
                Y.DOM.insertBefore(newNode, node);
                break;
            case 'afterBegin':
                Y.DOM.insertBefore(newNode, node[FIRST_CHILD]);
                break;
            case 'afterEnd':
                Y.DOM.insertAfter(newNode, node);
                break;
            default: // and 'beforeEnd'
                node.appendChild(newNode);
        }

        if (execScripts) {
            if (newNode.nodeName.toUpperCase() === 'SCRIPT' && !Y.UA.gecko) {
                scripts = [newNode]; // execute the new script
            } else {
                scripts = newNode.getElementsByTagName('script');
            }
            Y.DOM._execScripts(scripts);
        } else { // prevent any scripts from being injected
            Y.DOM._stripScripts(newNode);
        }

        return newNode;
    },

    VALUE_SETTERS: {},

    VALUE_GETTERS: {},

    getValue: function(node) {
        var ret = '', // TODO: return null?
            getter;

        if (node && node[TAG_NAME]) {
            getter = Y.DOM.VALUE_GETTERS[node[TAG_NAME].toLowerCase()];

            if (getter) {
                ret = getter(node);
            } else {
                ret = node.value;
            }
        }

        return (typeof ret === 'string') ? ret : '';
    },

    setValue: function(node, val) {
        var setter;

        if (node && node[TAG_NAME]) {
            setter = Y.DOM.VALUE_SETTERS[node[TAG_NAME].toLowerCase()];

            if (setter) {
                setter(node, val);
            } else {
                node.value = val;
            }
        }
    },

    _stripScripts: function(node) {
        var scripts = node.getElementsByTagName('script');
        for (var i = 0, script; script = scripts[i++];) {
            script.parentNode.removeChild(script);
        }
    },

    _execScripts: function(scripts, startIndex) {
        var newScript;
        startIndex = startIndex || 0;

        for (var i = startIndex, script; script = scripts[i++];) {
            newScript = script.ownerDocument.createElement('script');
            script.parentNode.replaceChild(newScript, script);
            if (script.text) {
                newScript.text = script.text;
            } else if (script.src) {
                newScript.src = script.src;

                 // "pause" while loading to ensure exec order 
                // FF reports typeof onload as "undefined", so try IE first
                if (typeof newScript.onreadystatechange !== 'undefined') {
                    newScript.onreadystatechange = function() {
                        if (/loaded|complete/.test(script.readyState)) {
                            event.srcElement.onreadystatechange = null; 
                            // timer to help ensure exec order
                            setTimeout(function() {Y.DOM._execScripts(scripts, i++)}, 0);
                        }
                    };
                } else {
                    newScript.onload = function(e) {
                        e.target.onload = null; 
                        Y.DOM._execScripts(scripts, i++);
                    };
                }
                return; // NOTE: early return to chain async loading
            }
        }
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
        re_tbody = /(?:\/(?:thead|tfoot|tbody|caption|col|colgroup)>)+\s*<tbody/,

        TABLE_OPEN = '<table>',
        TABLE_CLOSE = '</table>';

    if (Y.UA.gecko || Y.UA.ie) { // require custom creation code for certain element types
        Y.mix(creators, {
            option: function(html, doc) {
                var frag = create('<select>' + html + '</select>');
                return frag[FIRST_CHILD];
            },

            tr: function(html, doc) {
                var frag = creators.tbody('<tbody>' + html + '</tbody>', doc);
                return frag[FIRST_CHILD];
            },

            td: function(html, doc) {
                var frag = creators.tr('<tr>' + html + '</tr>', doc);
                return frag[FIRST_CHILD];
            }, 

            tbody: function(html, doc) {
                var frag = create(TABLE_OPEN + html + TABLE_CLOSE, doc);
                return frag[FIRST_CHILD];
            },

            legend: 'fieldset'
        });

        creators.col = creators.tbody; // IE wraps in colgroup
    }

    if (Y.UA.ie) {
        creators.col = creators.link = Y.DOM._IESimpleCreate;

        Y.mix(creators, {
        // TODO: thead/tfoot with nested tbody
            tbody: function(html, doc) {
                var frag = create(TABLE_OPEN + html + TABLE_CLOSE, doc),
                    tb = frag.children.tags('tbody')[0];

                if (frag.children[LENGTH] > 1 && tb && !re_tbody.test(html)) {
                    tb[PARENT_NODE].removeChild(tb);
                }
                return frag;
            },

            script: function(html, doc) {
                var frag = doc.createElement('div');

                frag.innerHTML = '-' + html;
                return frag.removeChild(frag[FIRST_CHILD][NEXT_SIBLING]);
            }

        });

        Y.mix(Y.DOM.VALUE_GETTERS, {
            button: function(node) {
                return (node.attributes && node.attributes.value) ? node.attributes.value.value : '';
            }
        });

        Y.mix(Y.DOM.VALUE_SETTERS, {
            // IE: node.value changes the button text, which should be handled via innerHTML
            button: function(node, val) {
                var attr = node.attributes['value'];
                if (!attr) {
                    attr = node[OWNER_DOCUMENT].createAttribute('value');
                    node.setAttributeNode(attr);
                }

                attr.value = val;
            }
        });
    }

    if (Y.UA.gecko || Y.UA.ie) {
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

    Y.mix(Y.DOM.VALUE_GETTERS, {
        option: function(node) {
            var attrs = node.attributes;
            return (attrs.value && attrs.value.specified) ? node.value : node.text;
        },

        select: function(node) {
            var val = node.value,
                options = node.options,
                i, opt;

            if (options && val === '') {
                if (node.multiple) {
                    Y.log('multiple select normalization not implemented', 'warn', 'DOM');
                } else {
                    val = Y.DOM.getValue(options[node.selectedIndex], 'value');
                }
            }

            return val;
        }
    });
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
        //Y.log('replaceClass replacing ' + oldC + ' with ' + newC, 'info', 'Node');
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



}, '@VERSION@' ,{requires:['event'], skinnable:false});
