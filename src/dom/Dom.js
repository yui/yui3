/**
 * The dom module provides helper methods for manipulating Dom elements.
 * @module dom
 *
 */

(function() {
    var Y = YAHOO.util,     // internal shorthand
        id_counter = 0,     // for use with generateId
        reClassNameCache = {},          // cache regexes for className
        document = window.document;     // cache for faster lookups
    
    /**
     * Provides helper methods for DOM elements.
     * @namespace YAHOO.util
     * @class Dom
     */
    YAHOO.util.Dom = {
        /**
         * Returns an HTMLElement reference.
         * @method get
         * @param {String | HTMLElement |Array} el Accepts a string to use as an ID for getting a DOM reference, an actual DOM reference, or an Array of IDs and/or HTMLElements.
         * @return {HTMLElement | Array} A DOM reference to an HTML element or an array of HTMLElements.
         */
        get: function(el) {
            if (el && (el.nodeType || el.item)) { // Node, or NodeList
                return el;
            }

            if (YAHOO.lang.isString(el) || !el) { // id or null
                return document.getElementById(el);
            }
            
            if (el.length !== undefined) { // array-like 
                var c = [];
                for (var i = 0, len = el.length; i < len; ++i) {
                    c[c.length] = Y.Dom.get(el[i]);
                }
                
                return c;
            }

            return el; // some other object, just pass it back
        },

        /**
         * Determines whether an HTMLElement has the given className.
         * @method hasClass
         * @param {String | HTMLElement | Array} el The element or collection to test
         * @param {String} className the class name to search for
         * @return {Boolean | Array} A boolean value or array of boolean values
         */
        hasClass: function(el, className) {
            var re = getClassRegEx(className);

            var f = function(el) {
                YAHOO.log('hasClass returning ' + re.test(el.className), 'info', 'Dom');
                return re.test(el.className);
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
    
        /**
         * Adds a class name to a given element or collection of elements.
         * @method addClass         
         * @param {String | HTMLElement | Array} el The element or collection to add the class to
         * @param {String} className the class name to add to the class attribute
         * @return {Boolean | Array} A pass/fail boolean or array of booleans
         */
        addClass: function(el, className) {
            var f = function(el) {
                if (this.hasClass(el, className)) {
                    return false; // already present
                }
                
                YAHOO.log('addClass adding ' + className, 'info', 'Dom');
                
                el.className = YAHOO.lang.trim([el.className, className].join(' '));
                return true;
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
    
        /**
         * Removes a class name from a given element or collection of elements.
         * @method removeClass         
         * @param {String | HTMLElement | Array} el The element or collection to remove the class from
         * @param {String} className the class name to remove from the class attribute
         * @return {Boolean | Array} A pass/fail boolean or array of booleans
         */
        removeClass: function(el, className) {
            var re = getClassRegEx(className);
            
            var f = function(el) {
                if (!className || !this.hasClass(el, className)) {
                    return false; // not present
                }                 

                YAHOO.log('removeClass removing ' + className, 'info', 'Dom');
                
                var c = el.className;
                el.className = c.replace(re, ' ');
                if ( this.hasClass(el, className) ) { // in case of multiple adjacent
                    this.removeClass(el, className);
                }

                el.className = YAHOO.lang.trim(el.className); // remove any trailing spaces
                return true;
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Replace a class with another class for a given element or collection of elements.
         * If no oldClassName is present, the newClassName is simply added.
         * @method replaceClass  
         * @param {String | HTMLElement | Array} el The element or collection to remove the class from
         * @param {String} oldClassName the class name to be replaced
         * @param {String} newClassName the class name that will be replacing the old class name
         * @return {Boolean | Array} A pass/fail boolean or array of booleans
         */
        replaceClass: function(el, oldClassName, newClassName) {
            if (!newClassName || oldClassName === newClassName) { // avoid infinite loop
                return false;
            }
            
            var re = getClassRegEx(oldClassName);

            var f = function(el) {
                YAHOO.log('replaceClass replacing ' + oldClassName + ' with ' + newClassName, 'info', 'Dom');
            
                if ( !this.hasClass(el, oldClassName) ) {
                    this.addClass(el, newClassName); // just add it if nothing to replace
                    return true; // NOTE: return
                }
            
                el.className = el.className.replace(re, ' ' + newClassName + ' ');

                if ( this.hasClass(el, oldClassName) ) { // in case of multiple adjacent
                    this.replaceClass(el, oldClassName, newClassName);
                }

                el.className = YAHOO.lang.trim(el.className); // remove any trailing spaces
                return true;
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        },
        
        /**
         * Returns an ID and applies it to the element "el", if provided.
         * @method generateId  
         * @param {String | HTMLElement | Array} el (optional) An optional element array of elements to add an ID to (no ID is added if one is already present).
         * @param {String} prefix (optional) an optional prefix to use (defaults to "yui-gen").
         * @return {String | Array} The generated ID, or array of generated IDs (or original ID if already present on an element)
         */
        generateId: function(el, prefix) {
            prefix = prefix || 'yui-gen';

            var f = function(el) {
                if (el && el.id) { // do not override existing ID
                    YAHOO.log('generateId returning existing id ' + el.id, 'info', 'Dom');
                    return el.id;
                } 

                var id = prefix + id_counter++;
                YAHOO.log('generateId generating ' + id, 'info', 'Dom');

                if (el) {
                    el.id = id;
                }
                
                return id;
            };

            // batch fails when no element, so just generate and return single ID
            return Y.Dom.batch(el, f, Y.Dom, true) || f.apply(Y.Dom, arguments);
        },

        /**
         * Returns a array of HTMLElements that pass the test applied by supplied boolean method.
         * For optimized performance, include a tag and/or root node when possible.
         * @method getElementsBy
         * @param {Function} method - A boolean method for testing elements which receives the element as its only argument.
         * @param {String} tag (optional) The tag name of the elements being collected
         * @param {String | HTMLElement} root (optional) The HTMLElement or an ID to use as the starting point 
         * @param {Function} apply (optional) A function to apply to each element when found 
         * @return {Array} Array of HTMLElements
         */
        getElementsBy: function(method, tag, root, apply) {
            tag = tag || '*';
            root = (root) ? Y.Dom.get(root) : null || document; 

            if (!root) {
                return [];
            }

            var nodes = [],
                elements = root.getElementsByTagName(tag);
            
            for (var i = 0, len = elements.length; i < len; ++i) {
                if ( method(elements[i]) ) {
                    nodes[nodes.length] = elements[i];
                    if (apply) {
                        apply(elements[i]);
                    }
                }
            }

            YAHOO.log('getElementsBy returning ' + nodes, 'info', 'Dom');
            
            return nodes;
        },
        
        /**
         * Runs the supplied method against each item in the Collection/Array.
         * The method is called with the element(s) as the first arg, and the optional param as the second ( method(el, o) ).
         * @method batch
         * @param {String | HTMLElement | Array} el (optional) An element or array of elements to apply the method to
         * @param {Function} method The method to apply to the element(s)
         * @param {Any} o (optional) An optional arg that is passed to the supplied method
         * @param {Boolean} override (optional) Whether or not to override the scope of "method" with "o"
         * @return {Any | Array} The return value(s) from the supplied method
         */
        batch: function(el, method, o, override) {
            el = (el && (el.tagName || el.item)) ? el : Y.Dom.get(el); // skip get() when possible

            if (!el || !method) {
                YAHOO.log('batch failed: invalid arguments', 'error', 'Dom');
                return false;
            } 
            var scope = (override) ? o : window;
            
            if (el.tagName || el.length === undefined) { // element or not array-like 
                return method.call(scope, el, o);
            } 

            var collection = [];
            
            for (var i = 0, len = el.length; i < len; ++i) {
                collection[collection.length] = method.call(scope, el[i], o);
            }
            
            return collection;
        }
    };
    var getClassRegEx = function(className) {
        var re = reClassNameCache[className];
        if (!re) {
            re = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
            reClassNameCache[className] = re;
        }
        return re;
    };

})();
