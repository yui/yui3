(function(Y) {
/** 
 * The DOM utility provides a cross-browser abtraction layer
 * normalizing DOM tasks, and adds extra helper functionality
 * for other common tasks. 
 * @module dom
 * @submodule dom-base
 * @for DOM
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
    PREVIOUS_SIBLING = 'previousSibling',
    NEXT_SIBLING = 'nextSibling',
    CONTAINS = 'contains',
    COMPARE_DOCUMENT_POSITION = 'compareDocumentPosition',
    EMPTY_STRING = '',

    documentElement = Y.config.doc.documentElement,

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
        // handle dupe IDs and IE name collision
        return Y.DOM.allById(id, doc)[0] || null;
    },

    // @deprecated
    children: function(node, tag) {
        var ret = [];
        if (node) {
            tag = tag || '*';
            ret = Y.Selector.query('> ' + tag, node); 
        }
        return ret;
    },

    // @deprecated
    firstByTag: function(tag, root) {
        var ret;
        root = root || Y.config.doc;

        if (tag && root.getElementsByTagName) {
            ret = root.getElementsByTagName(tag)[0];
        }

        return ret || null;
    },

    /**
     * Returns the text content of the HTMLElement. 
     * @method getText         
     * @param {HTMLElement} element The html element. 
     * @return {String} The text content of the element (includes text of any descending elements).
     */
    getText: (documentElement.textContent !== undefined) ?
        function(element) {
            var ret = '';
            if (element) {
                ret = element.textContent;
            }
            return ret || '';
        } : function(element) {
            var ret = '';
            if (element) {
                ret = element.innerText;
            }
            return ret || '';
        },

    /**
     * Sets the text content of the HTMLElement. 
     * @method setText         
     * @param {HTMLElement} element The html element. 
     * @param {String} content The content to add. 
     */
    setText: (documentElement.textContent !== undefined) ?
        function(element, content) {
            if (element) {
                element.textContent = content;
            }
        } : function(element, content) {
            if (element) {
                element.innerText = content;
            }
        },

    /*
     * Finds the previous sibling of the element.
     * @method previous
     * @deprecated Use elementByAxis
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

    /*
     * Finds the next sibling of the element.
     * @method next
     * @deprecated Use elementByAxis
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

    /*
     * Finds the ancestor of the element.
     * @method ancestor
     * @param {HTMLElement} element The html element.
     * @param {Function} fn optional An optional boolean test to apply.
     * The optional function is passed the current DOM node being tested as its only argument.
     * If no function is given, the parentNode is returned.
     * @param {Boolean} testSelf optional Whether or not to include the element in the scan 
     * @return {HTMLElement | null} The matching DOM node or null if none found. 
     */
    ancestor: function(element, fn, testSelf) {
        var ret = null;
        if (testSelf) {
            ret = (!fn || fn(element)) ? element : null;

        }
        return ret || Y.DOM.elementByAxis(element, PARENT_NODE, fn, null);
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
        var ret = false,
            rootNode;

        if (element && element.nodeType) {
            (doc) || (doc = element[OWNER_DOCUMENT]);

            rootNode = doc[DOCUMENT_ELEMENT];

            // contains only works with HTML_ELEMENT
            if (rootNode && rootNode.contains && element.tagName) {
                ret = rootNode.contains(element);
            } else {
                ret = Y.DOM.contains(rootNode, element);
            }
        }

        return ret;

    },

   allById: function(id, root) {
        root = root || Y.config.doc;
        var nodes = [],
            ret = [],
            i,
            node;

        if (root.querySelectorAll) {
            ret = root.querySelectorAll('[id="' + id + '"]');
        } else if (root.all) {
            nodes = root.all(id);
            if (nodes && nodes.nodeType) { // root.all may return one or many
                nodes = [nodes];
            }

            if (nodes && nodes.length) {
                for (i = 0; node = nodes[i++];) { // check for a match
                    if (node.attributes && node.attributes.id
                            && node.attributes.id.value === id) { // avoid false positive for node.name & form.id
                        ret.push(node);
                    }
                }
            }
        } else {
            ret = [Y.DOM._getDoc(root).getElementById(id)];
        }
    
        return ret;
   },

    /**
     * Creates a new dom node using the provided markup string. 
     * @method create
     * @param {String} html The markup used to create the element
     * @param {HTMLDocument} doc An optional document context 
     * @return {HTMLElement|DocumentFragment} returns a single HTMLElement 
     * when creating one node, and a documentFragment when creating
     * multiple nodes.
     */
    create: function(html, doc) {
        if (typeof html === 'string') {
            html = Y.Lang.trim(html); // match IE which trims whitespace from innerHTML

        }

        doc = doc || Y.config.doc;
        var m = re_tag.exec(html),
            create = Y.DOM._create,
            custom = Y.DOM.creators,
            ret = null,
            tag, nodes;

        if (html != undefined) { // not undefined or null
            if (m && custom[m[1]]) {
                if (typeof custom[m[1]] === 'function') {
                    create = custom[m[1]];
                } else {
                    tag = custom[m[1]];
                }
            }

            nodes = create(html, doc, tag).childNodes;

            if (nodes.length === 1) { // return single node, breaking parentNode ref from "fragment"
                ret = nodes[0].parentNode.removeChild(nodes[0]);
            } else if (nodes[0] && nodes[0].className === 'yui3-big-dummy') { // using dummy node to preserve some attributes (e.g. OPTION not selected)
                if (nodes.length === 2) {
                    ret = nodes[0].nextSibling;
                } else {
                    nodes[0].parentNode.removeChild(nodes[0]); 
                     ret = Y.DOM._nl2frag(nodes, doc);
                }
            } else { // return multiple nodes as a fragment
                 ret = Y.DOM._nl2frag(nodes, doc);
            }
        }

        return ret;
    },

    _nl2frag: function(nodes, doc) {
        var ret = null,
            i, len;

        if (nodes && (nodes.push || nodes.item) && nodes[0]) {
            doc = doc || nodes[0].ownerDocument; 
            ret = doc.createDocumentFragment();

            if (nodes.item) { // convert live list to static array
                nodes = Y.Array(nodes, 0, true);
            }

            for (i = 0, len = nodes.length; i < len; i++) {
                ret.appendChild(nodes[i]); 
            }
        } // else inline with log for minification
        else { Y.log('unable to convert ' + nodes + ' to fragment', 'warn', 'dom'); }
        return ret;
    },


    CUSTOM_ATTRIBUTES: (!documentElement.hasAttribute) ? { // IE < 8
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
    setAttribute: function(el, attr, val, ieAttr) {
        if (el && attr && el.setAttribute) {
            attr = Y.DOM.CUSTOM_ATTRIBUTES[attr] || attr;
            el.setAttribute(attr, val, ieAttr);
        }
        else { Y.log('bad input to setAttribute', 'warn', 'dom'); }
    },


    /**
     * Provides a normalized attribute interface. 
     * @method getAttibute
     * @param {String | HTMLElement} el The target element for the attribute.
     * @param {String} attr The attribute to get.
     * @return {String} The current value of the attribute. 
     */
    getAttribute: function(el, attr, ieAttr) {
        ieAttr = (ieAttr !== undefined) ? ieAttr : 2;
        var ret = '';
        if (el && attr && el.getAttribute) {
            attr = Y.DOM.CUSTOM_ATTRIBUTES[attr] || attr;
            ret = el.getAttribute(attr, ieAttr);

            if (ret === null) {
                ret = ''; // per DOM spec
            }
        }
        else { Y.log('bad input to getAttribute', 'warn', 'dom'); }
        return ret;
    },

    isWindow: function(obj) {
        return !!(obj && obj.alert && obj.document);
    },

    _fragClones: {},

    _create: function(html, doc, tag) {
        tag = tag || 'div';

        var frag = Y.DOM._fragClones[tag];
        if (frag) {
            frag = frag.cloneNode(false);
        } else {
            frag = Y.DOM._fragClones[tag] = doc.createElement(tag);
        }
        frag.innerHTML = html;
        return frag;
    },

    _removeChildNodes: function(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    },

    /**
     * Inserts content in a node at the given location 
     * @method addHTML
     * @param {HTMLElement} node The node to insert into
     * @param {String | HTMLElement} content The content to be inserted 
     * @param {String | HTMLElement} where Where to insert the content
     * If no "where" is given, content is appended to the node
     * Possible values for "where"
     * <dl>
     * <dt>HTMLElement</dt>
     * <dd>The element to insert before</dd>
     * <dt>"replace"</dt>
     * <dd>Replaces the existing HTML</dd>
     * <dt>"before"</dt>
     * <dd>Inserts before the existing HTML</dd>
     * <dt>"before"</dt>
     * <dd>Inserts content before the node</dd>
     * <dt>"after"</dt>
     * <dd>Inserts content after the node</dd>
     * </dl>
     */
    addHTML: function(node, content, where) {
        var nodeParent = node.parentNode,
            newNode;
            
        if (content !== undefined && content !== null) {
            if (content.nodeType) { // domNode
                newNode = content;
            } else { // create from string and cache
                newNode = Y.DOM.create(content);
            }
        }

        if (where) {
            if (where.nodeType) { // insert regardless of relationship to node
                // TODO: check if node.contains(where)?
                where.parentNode.insertBefore(newNode, where);
            } else {
                switch (where) {
                    case 'replace':
                        while (node.firstChild) {
                            node.removeChild(node.firstChild);
                        }
                        if (newNode) { // allow empty content to clear node
                            node.appendChild(newNode);
                        }
                        break;
                    case 'before':
                        nodeParent.insertBefore(newNode, node);
                        break;
                    case 'after':
                        if (node.nextSibling) { // IE errors if refNode is null
                            nodeParent.insertBefore(newNode, node.nextSibling);
                        } else {
                            nodeParent.appendChild(newNode);
                        }
                        break;
                    default:
                        node.appendChild(newNode);
                }
            }
        } else {
            node.appendChild(newNode);
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

        // workaround for IE8 JSON stringify bug
        // which converts empty string values to null
        if (ret === EMPTY_STRING) {
            ret = EMPTY_STRING; // for real
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

    siblings: function(node, fn) {
        var nodes = [],
            sibling = node;

        while ((sibling = sibling[PREVIOUS_SIBLING])) {
            if (sibling[TAG_NAME] && (!fn || fn(sibling))) {
                nodes.unshift(sibling);
            }
        }

        sibling = node;
        while ((sibling = sibling[NEXT_SIBLING])) {
            if (sibling[TAG_NAME] && (!fn || fn(sibling))) {
                nodes.push(sibling);
            }
        }

        return nodes;
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
        var doc = Y.config.doc;
        if (element) {
            doc = (element[NODE_TYPE] === 9) ? element : // element === document
                element[OWNER_DOCUMENT] || // element === DOM node
                element.document || // element === window
                Y.config.doc; // default
        }

        return doc;
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

    _batch: function(nodes, fn, arg1, arg2, arg3, etc) {
        fn = (typeof fn === 'string') ? Y.DOM[fn] : fn;
        var result,
            args = Array.prototype.slice.call(arguments, 2),
            i = 0,
            ret;

        if (fn && nodes) {
            while ((node = nodes[i++])) {
                result = result = fn.call(Y.DOM, node, arg1, arg2, arg3, etc);
                if (typeof result !== 'undefined') {
                    (ret) || (ret = []);
                    ret.push(result);
                }
            }
        }

        return (typeof ret !== 'undefined') ? ret : nodes;
    },

    creators: {}
};


(function(Y) {
    var creators = Y.DOM.creators,
        create = Y.DOM.create,
        re_tbody = /(?:\/(?:thead|tfoot|tbody|caption|col|colgroup)>)+\s*<tbody/,

        TABLE_OPEN = '<table>',
        TABLE_CLOSE = '</table>';

    if (Y.UA.ie) {
        Y.mix(creators, {
        // TODO: thead/tfoot with nested tbody
            // IE adds TBODY when creating TABLE elements (which may share this impl)
            tbody: function(html, doc) {
                var frag = create(TABLE_OPEN + html + TABLE_CLOSE, doc),
                    tb = frag.children.tags('tbody')[0];

                if (frag.children.length > 1 && tb && !re_tbody.test(html)) {
                    tb[PARENT_NODE].removeChild(tb); // strip extraneous tbody
                }
                return frag;
            },

            script: function(html, doc) {
                var frag = doc.createElement('div');

                frag.innerHTML = '-' + html;
                frag.removeChild(frag[FIRST_CHILD]);
                return frag;
            }

        }, true);

        Y.mix(Y.DOM.VALUE_GETTERS, {
            button: function(node) {
                return (node.attributes && node.attributes.value) ? node.attributes.value.value : '';
            }
        });

        Y.mix(Y.DOM.VALUE_SETTERS, {
            // IE: node.value changes the button text, which should be handled via innerHTML
            button: function(node, val) {
                var attr = node.attributes.value;
                if (!attr) {
                    attr = node[OWNER_DOCUMENT].createAttribute('value');
                    node.setAttributeNode(attr);
                }

                attr.value = val;
            },

            select: function(node, val) {
                for (var i = 0, options = node.getElementsByTagName('option'), option;
                        option = options[i++];) {
                    if (Y.DOM.getValue(option) === val) {
                        Y.DOM.setAttribute(option, 'selected', true);
                        break;
                    }
                }
            }
        });

        Y.DOM.creators.col = Y.DOM.creators.link = Y.DOM.creators.style = Y.DOM.creators.script;
    }

    if (Y.UA.gecko || Y.UA.ie) {
        Y.mix(creators, {
            option: function(html, doc) {
                return create('<select><option class="yui3-big-dummy" selected></option>' + html + '</select>', doc);
            },

            tr: function(html, doc) {
                return create('<tbody>' + html + '</tbody>', doc);
            },

            td: function(html, doc) {
                return create('<tr>' + html + '</tr>', doc);
            }, 

            tbody: function(html, doc) {
                return create(TABLE_OPEN + html + TABLE_CLOSE, doc);
            }
        });

        Y.mix(creators, {
            legend: 'fieldset',
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
                options = node.options;

            if (options && options.length && val === '') {
                // TODO: implement multipe select
                if (node.multiple) {
                    Y.log('multiple select normalization not implemented', 'warn', 'DOM');
                } else {
                    val = Y.DOM.getValue(options[node.selectedIndex]);
                }
            }

            return val;
        }
    });
})(Y);

})(Y);
