(function() {
    var Y = YAHOO.util,     // internal shorthand
        Dom = Y.Dom,
        id_counter = 0,     // for use with generateId
        reClassNameCache = {},          // cache regexes for className
        document = window.document;     // cache for faster lookups
    
    // brower detection
    var isOpera = YAHOO.env.ua.opera,
        isSafari = YAHOO.env.ua.webkit, 
        isGecko = YAHOO.env.ua.gecko,
        isIE = YAHOO.env.ua.ie; 
    
    // regex cache
    var patterns = {
        ROOT_TAG: /^body|html$/i // body for quirks mode, html for standards
    };

    var getClassRegEx = function(className) {
        var re = reClassNameCache[className];
        if (!re) {
            re = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
            reClassNameCache[className] = re;
        }
        return re;
    };

    var testElement = function(node, method) {
        return node && node.nodeType == 1 && ( !method || method(node) );
    };

    /**
     * Returns a array of HTMLElements with the given class.
     * For optimized performance, include a tag and/or root node when possible.
     * @method getElementsByClassName
     * @param {String} className The class name to match against
     * @param {String} tag (optional) The tag name of the elements being collected
     * @param {String | HTMLElement} root (optional) The HTMLElement or an ID to use as the starting point 
     * @param {Function} apply (optional) A function to apply to each element when found 
     * @return {Array} An array of elements that have the given class name
     */
    Dom.getElementsByClassName = function(className, tag, root, apply) {
        tag = tag || '*';
        root = (root) ? Y.Dom.get(root) : null || document; 
        if (!root) {
            return [];
        }

        var nodes = [],
            elements = root.getElementsByTagName(tag),
            re = getClassRegEx(className);

        for (var i = 0, len = elements.length; i < len; ++i) {
            if ( re.test(elements[i].className) ) {
                nodes[nodes.length] = elements[i];
                if (apply) {
                    apply.call(elements[i], elements[i]);
                }
            }
        }
        
        return nodes;
    };
        
    /**
     * Determines whether an HTMLElement is an ancestor of another HTML element in the DOM hierarchy.
     * @method isAncestor
     * @param {String | HTMLElement} haystack The possible ancestor
     * @param {String | HTMLElement} needle The possible descendent
     * @return {Boolean} Whether or not the haystack is an ancestor of needle
     */
    Dom.isAncestor = function(haystack, needle) {
        haystack = Y.Dom.get(haystack);
        needle = Y.Dom.get(needle);
        
        if (!haystack || !needle) {
            return false;
        }

        if (haystack.contains && needle.nodeType && !isSafari) { // safari contains is broken
            YAHOO.log('isAncestor returning ' + haystack.contains(needle), 'info', 'Dom');
            return haystack.contains(needle);
        }
        else if ( haystack.compareDocumentPosition && needle.nodeType ) {
            YAHOO.log('isAncestor returning ' + !!(haystack.compareDocumentPosition(needle) & 16), 'info', 'Dom');
            return !!(haystack.compareDocumentPosition(needle) & 16);
        } else if (needle.nodeType) {
            // fallback to crawling up (safari)
            return !!this.getAncestorBy(needle, function(el) {
                return el == haystack; 
            }); 
        }
        YAHOO.log('isAncestor failed; most likely needle is not an HTMLElement', 'error', 'Dom');
        return false;
    };
        
    /**
     * Determines whether an HTMLElement is present in the current document.
     * @method inDocument         
     * @param {String | HTMLElement} el The element to search for
     * @return {Boolean} Whether or not the element is present in the current document
     */
    Dom.inDocument = function(el) {
        return this.isAncestor(document.documentElement, el);
    };
    
   /**
     * Returns the nearest ancestor that passes the test applied by supplied boolean method.
     * For performance reasons, IDs are not accepted and argument validation omitted.
     * @method getAncestorBy
     * @param {HTMLElement} node The HTMLElement to use as the starting point 
     * @param {Function} method - A boolean method for testing elements which receives the element as its only argument.
     * @return {Object} HTMLElement or null if not found
     */
    Dom.getAncestorBy = function(node, method) {
        while (node = node.parentNode) { // NOTE: assignment
            if ( testElement(node, method) ) {
                YAHOO.log('getAncestorBy returning ' + node, 'info', 'Dom');
                return node;
            }
        } 

        YAHOO.log('getAncestorBy returning null (no ancestor passed test)', 'error', 'Dom');
        return null;
    };
    
    /**
     * Returns the nearest ancestor with the given className.
     * @method getAncestorByClassName
     * @param {String | HTMLElement} node The HTMLElement or an ID to use as the starting point 
     * @param {String} className
     * @return {Object} HTMLElement
     */
    Dom.getAncestorByClassName = function(node, className) {
        node = Y.Dom.get(node);
        if (!node) {
            YAHOO.log('getAncestorByClassName failed: invalid node argument', 'error', 'Dom');
            return null;
        }
        var method = function(el) { return Y.Dom.hasClass(el, className); };
        return Y.Dom.getAncestorBy(node, method);
    };

    /**
     * Returns the nearest ancestor with the given tagName.
     * @method getAncestorByTagName
     * @param {String | HTMLElement} node The HTMLElement or an ID to use as the starting point 
     * @param {String} tagName
     * @return {Object} HTMLElement
     */
    Dom.getAncestorByTagName = function(node, tagName) {
        node = Y.Dom.get(node);
        if (!node) {
            YAHOO.log('getAncestorByTagName failed: invalid node argument', 'error', 'Dom');
            return null;
        }
        var method = function(el) {
             return el.tagName && el.tagName.toUpperCase() == tagName.toUpperCase();
        };

        return Y.Dom.getAncestorBy(node, method);
    };

    /**
     * Returns the previous sibling that is an HTMLElement. 
     * For performance reasons, IDs are not accepted and argument validation omitted.
     * Returns the nearest HTMLElement sibling if no method provided.
     * @method getPreviousSiblingBy
     * @param {HTMLElement} node The HTMLElement to use as the starting point 
     * @param {Function} method A boolean function used to test siblings
     * that receives the sibling node being tested as its only argument
     * @return {Object} HTMLElement or null if not found
     */
    Dom.getPreviousSiblingBy = function(node, method) {
        while (node) {
            node = node.previousSibling;
            if ( testElement(node, method) ) {
                return node;
            }
        }
        return null;
    };

    /**
     * Returns the previous sibling that is an HTMLElement 
     * @method getPreviousSibling
     * @param {String | HTMLElement} node The HTMLElement or an ID to use as the starting point 
     * @return {Object} HTMLElement or null if not found
     */
    Dom.getPreviousSibling = function(node) {
        node = Y.Dom.get(node);
        if (!node) {
            YAHOO.log('getPreviousSibling failed: invalid node argument', 'error', 'Dom');
            return null;
        }

        return Y.Dom.getPreviousSiblingBy(node);
    };

    /**
     * Returns the next HTMLElement sibling that passes the boolean method. 
     * For performance reasons, IDs are not accepted and argument validation omitted.
     * Returns the nearest HTMLElement sibling if no method provided.
     * @method getNextSiblingBy
     * @param {HTMLElement} node The HTMLElement to use as the starting point 
     * @param {Function} method A boolean function used to test siblings
     * that receives the sibling node being tested as its only argument
     * @return {Object} HTMLElement or null if not found
     */
    Dom.getNextSiblingBy = function(node, method) {
        while (node) {
            node = node.nextSibling;
            if ( testElement(node, method) ) {
                return node;
            }
        }
        return null;
    };

    /**
     * Returns the next sibling that is an HTMLElement 
     * @method getNextSibling
     * @param {String | HTMLElement} node The HTMLElement or an ID to use as the starting point 
     * @return {Object} HTMLElement or null if not found
     */
    Dom.getNextSibling = function(node) {
        node = Y.Dom.get(node);
        if (!node) {
            YAHOO.log('getNextSibling failed: invalid node argument', 'error', 'Dom');
            return null;
        }

        return Y.Dom.getNextSiblingBy(node);
    };

    /**
     * Returns the first HTMLElement child that passes the test method. 
     * @method getFirstChildBy
     * @param {HTMLElement} node The HTMLElement to use as the starting point 
     * @param {Function} method A boolean function used to test children
     * that receives the node being tested as its only argument
     * @return {Object} HTMLElement or null if not found
     */
    Dom.getFirstChildBy = function(node, method) {
        var child = ( testElement(node.firstChild, method) ) ? node.firstChild : null;
        return child || Y.Dom.getNextSiblingBy(node.firstChild, method);
    };

    /**
     * Returns the first HTMLElement child. 
     * @method getFirstChild
     * @param {String | HTMLElement} node The HTMLElement or an ID to use as the starting point 
     * @return {Object} HTMLElement or null if not found
     */
    Dom.getFirstChild = function(node, method) {
        node = Y.Dom.get(node);
        if (!node) {
            YAHOO.log('getFirstChild failed: invalid node argument', 'error', 'Dom');
            return null;
        }
        return Y.Dom.getFirstChildBy(node);
    };

    /**
     * Returns the last HTMLElement child that passes the test method. 
     * @method getLastChildBy
     * @param {HTMLElement} node The HTMLElement to use as the starting point 
     * @param {Function} method A boolean function used to test children
     * that receives the node being tested as its only argument
     * @return {Object} HTMLElement or null if not found
     */
    Dom.getLastChildBy = function(node, method) {
        if (!node) {
            YAHOO.log('getLastChild failed: invalid node argument', 'error', 'Dom');
            return null;
        }
        var child = ( testElement(node.lastChild, method) ) ? node.lastChild : null;
        return child || Y.Dom.getPreviousSiblingBy(node.lastChild, method);
    };

    /**
     * Returns the last HTMLElement child. 
     * @method getLastChild
     * @param {String | HTMLElement} node The HTMLElement or an ID to use as the starting point 
     * @return {Object} HTMLElement or null if not found
     */
    Dom.getLastChild = function(node) {
        node = Y.Dom.get(node);
        return Y.Dom.getLastChildBy(node);
    };

    /**
     * Returns an array of HTMLElement childNodes that pass the test method. 
     * @method getChildrenBy
     * @param {HTMLElement} node The HTMLElement to start from
     * @param {Function} method A boolean function used to test children
     * that receives the node being tested as its only argument
     * @return {Array} A static array of HTMLElements
     */
    Dom.getChildrenBy = function(node, method) {
        var child = Y.Dom.getFirstChildBy(node, method);
        var children = child ? [child] : [];

        Y.Dom.getNextSiblingBy(child, function(node) {
            if ( !method || method(node) ) {
                children[children.length] = node;
            }
            return false; // fail test to collect all children
        });

        return children;
    };

    /**
     * Returns an array of HTMLElement childNodes. 
     * @method getChildren
     * @param {String | HTMLElement} node The HTMLElement or an ID to use as the starting point 
     * @return {Array} A static array of HTMLElements
     */
    Dom.getChildren = function(node) {
        node = Y.Dom.get(node);
        if (!node) {
            YAHOO.log('getChildren failed: invalid node argument', 'error', 'Dom');
        }

        return Y.Dom.getChildrenBy(node);
    };

    /**
     * Inserts the new node as the previous sibling of the reference node 
     * @method insertBefore
     * @param {String | HTMLElement} newNode The node to be inserted
     * @param {String | HTMLElement} referenceNode The node to insert the new node before 
     * @return {HTMLElement} The node that was inserted (or null if insert fails) 
     */
    Dom.insertBefore = function(newNode, referenceNode) {
        newNode = Y.Dom.get(newNode); 
        referenceNode = Y.Dom.get(referenceNode); 
        
        if (!newNode || !referenceNode || !referenceNode.parentNode) {
            YAHOO.log('insertAfter failed: missing or invalid arg(s)', 'error', 'Dom');
            return null;
        }       

        return referenceNode.parentNode.insertBefore(newNode, referenceNode); 
    };

    /**
     * Inserts the new node as the next sibling of the reference node 
     * @method insertAfter
     * @param {String | HTMLElement} newNode The node to be inserted
     * @param {String | HTMLElement} referenceNode The node to insert the new node after 
     * @return {HTMLElement} The node that was inserted (or null if insert fails) 
     */
    Dom.insertAfter = function(newNode, referenceNode) {
        newNode = Y.Dom.get(newNode); 
        referenceNode = Y.Dom.get(referenceNode); 
        
        if (!newNode || !referenceNode || !referenceNode.parentNode) {
            YAHOO.log('insertAfter failed: missing or invalid arg(s)', 'error', 'Dom');
            return null;
        }       

        if (referenceNode.nextSibling) {
            return referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling); 
        } else {
            return referenceNode.parentNode.appendChild(newNode);
        }
    };
})();
