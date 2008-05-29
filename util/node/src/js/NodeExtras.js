/**
 * Extended interface for Node
 * @module nodeextras
 */

YUI.add('nodeextras', function(Y) {

    /**
     * An interface for advanced DOM features.
     * @interface NodeExtras
     */

    var CLASS_NAME = 'className',
        OFFSET_TOP = 'offsetTop',
        POSITION = 'position',
        FIXED = 'fixed',
        RELATIVE = 'relative',
        LEFT = 'left',
        TOP = 'top',
        NODE_TYPE = 'nodeType',
        OFFSET_LEFT = 'offsetLeft',
        GET_BOUNDING_CLIENT_RECT = 'getBoundingClientRect',
        COMPARE_DOCUMENT_POSITION = 'compareDocumentPosition';

    var regexCache = {};
    var getRegExp = function(str, flags) {
        flags = flags || '';
        if (!regexCache[str + flags]) {
            regexCache[str + flags] = new RegExp(str, flags);
        }
        return regexCache[str + flags];
    };

    Y.Node.getters({
        /**
         * Normalizes nodeInnerText and textContent. 
         * @property text
         * @type String
         */
        'text': function(node) {
            return node.get('innerText') || node.get('textContent') || '';
        }
    });

    Y.Node.methods({
        /**
         * Determines whether an HTMLElement has the given className.
         * @method hasClass
         * @param {String} className the class name to search for
         * @return {Boolean | Array} A boolean value or array of boolean values
         */
        hasClass: function(node, className) {
            var re = getRegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
            return re.test(node.get(CLASS_NAME));
        },

        /**
         * Adds a class name to a given element or collection of elements.
         * @method addClass         
         * @param {String} className the class name to add to the class attribute
         * @return {Boolean | Array} A pass/fail boolean or array of booleans
         */
        addClass: function(node, className) {
            if (node.hasClass(className)) {
                return; // already present
            }
            
            //Y.log('addClass adding ' + className, 'info', 'Node');
            
            node.set(CLASS_NAME, Y.Lang.trim([node.get(CLASS_NAME), className].join(' ')));
        },

        /**
         * Removes a class name from a given element or collection of elements.
         * @method removeClass         
         * @param {String} className the class name to remove from the class attribute
         * @return {Boolean | Array} A pass/fail boolean or array of booleans
         */
        removeClass: function(node, className) {
            if (!className || !node.hasClass(className)) {
                return; // not present
            }                 

            //Y.log('removeClass removing ' + className, 'info', 'Node');
            
            node.set(CLASS_NAME,
                    Y.Lang.trim(node.get(CLASS_NAME).replace(getRegExp('(?:^|\\s+)' +
                            className + '(?:\\s+|$)'), ' ')));

            if ( node.hasClass(className) ) { // in case of multiple adjacent
                node.removeClass(className);
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
        replaceClass: function(node, newC, oldC) {
            //Y.log('replaceClass replacing ' + oldC + ' with ' + newC, 'info', 'Node');
        
            if ( !node.hasClass(oldC) ) {
                node.addClass(newC); // just add it if nothing to replace
                return; // NOTE: return
            }
        
            var re = getRegExp('(?:^|\\s+)' + oldC + '(?:\\s+|$)');
            node.set(CLASS_NAME, node.get(CLASS_NAME).replace(re, ' ' + newC + ' '));

            if ( node.hasClass(oldC) ) { // in case of multiple adjacent
                node.replaceClass(oldC, newC);
            }

            node.set(CLASS_NAME, Y.Lang.trim(node.get(CLASS_NAME))); // remove any trailing spaces
        },

        /**
         * If the className exists on the node it is removed, if it doesn't exist it is added.
         * @method toggleClass  
         * @param {String} className the class name to be toggled
         */
        toggleClass: function(node, className) {
            if (node.hasClass(className)) {
                node.removeClass(className);
            } else {
                node.addClass(className);
            }
        },        

        /**
         * Returns the previous sibling that is an HTMLElement. 
         * Returns the nearest HTMLElement sibling if no method provided.
         * @method previous
         * @param {Function} method A boolean function used to test siblings
         * that receives the sibling node being tested as its only argument
         * @return {Node} Node instance or null if not found
         */
        previous: function(node, method) {
            while (node) {
                node = node.get('previousSibling');
                if ( node && node.get(NODE_TYPE) === 1 ) {
                    if (!method || method(node)) {
                        return node;
                    }
                }
            }
            return null;
        }, 

        /**
         * Returns the next HTMLElement sibling that passes the boolean method. 
         * Returns the nearest HTMLElement sibling if no method provided.
         * @method next
         * @param {Function} method A boolean function used to test siblings
         * that receives the sibling node being tested as its only argument
         * @return {Object} HTMLElement or null if not found
         */
        next: function(node, method) {
            while (node) {
                node = node.get('nextSibling');
                if ( node && node.get(NODE_TYPE) === 1 ) {
                    if (!method || method(node)) {
                        return node;
                    }
                }
            }
            return null;
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
            if (Y.Node.get('document').get('documentElement').hasMethod(GET_BOUNDING_CLIENT_RECT)) {
                return function(node) {
                    var scrollLeft = node.get('docScrollX'),
                        scrollTop = node.get('docScrollY'),
                        box = node.invoke(GET_BOUNDING_CLIENT_RECT),
                        //Round the numbers so we get sane data back
                        xy = [Math.floor(box[LEFT]), Math.floor(box[TOP])];

                        if (Y.UA.ie) {
                            var off1 = 2, off2 = 2,
                            mode = Y.Node.get('document').get('compatMode'),
                            bLeft = Y.Node.get('document').get('documentElement').getStyle('borderLeftWidth'),
                            bTop = Y.Node.get('document').get('documentElement').getStyle('borderTopWidth');
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
                        var t = parseInt(node.getStyle('borderTopWidth'), 10) || 0,
                            l = parseInt(node.getStyle('borderLeftWidth'), 10) || 0;
                        if (Y.UA.gecko) {
                            if (getRegExp('/^t(able|d|h)$/', 'i').test(node.get('tagName'))) {
                                t = 0;
                                l = 0;
                            }
                        }
                        xy2[0] += l;
                        xy2[1] += t;
                        return xy2;
                    };

                    var xy = [node.get(OFFSET_LEFT), node.get(OFFSET_TOP)],
                    parentNode = node,
                    bCheck = ((Y.UA.gecko || (Y.UA.webkit > 519)) ? true : false);

                    while (parentNode = parentNode.get('offsetParent')) {
                        xy[0] += parentNode.get(OFFSET_LEFT);
                        xy[1] += parentNode.get(OFFSET_TOP);
                        if (bCheck) {
                            xy = calcBorders(parentNode, xy);
                        }
                    }

                    // account for any scrolled ancestors
                    if (node.getStyle(POSITION) != FIXED) {
                        parentNode = node;
                        var scrollTop, scrollLeft;

                        while (parentNode = parentNode.get('parentNode')) {
                            scrollTop = parentNode.get('scrollTop');
                            scrollLeft = parentNode.get('scrollLeft');

                            //Firefox does something funky with borders when overflow is not visible.
                            if (Y.UA.gecko && (parentNode.getStyle('overflow') !== 'visible')) {
	                            xy = calcBorders(parentNode, xy);
                            }
                            

                            if (scrollTop || scrollLeft) {
                                xy[0] -= scrollLeft;
                                xy[1] -= scrollTop;
                            }
                        }
                        xy[0] += node.get('docScrollX');
                        xy[1] += node.get('docScrollY');

                    } else {
                        //Fix FIXED position -- add scrollbars
                        if (Y.UA.opera || Y.UA.gecko) {
                            xy[0] -= node.get('docScrollX');
                            xy[1] -= node.get('docScrollY');
                        } else if (Y.UA.webkit) {
                            xy[0] += node.get('docScrollX');
                            xy[1] += node.get('docScrollY');
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
            var pos = node.getStyle(POSITION),
                delta = [ // assuming pixels; if not we will have to retry
                    parseInt( node.getStyle(LEFT), 10 ),
                    parseInt( node.getStyle(TOP), 10 )
                ];
        
            if (pos == 'static') { // default to relative
                pos = RELATIVE;
                node.setStyle(POSITION, RELATIVE);
            }

            var currentXY = node.getXY();

            if (currentXY === false) { // has to be part of doc to have xy
                YAHOO.log('xy failed: node not available', 'error', 'Node');
                return false; 
            }
            
            if ( isNaN(delta[0]) ) {// in case of 'auto'
                delta[0] = (pos == RELATIVE) ? 0 : node.get(OFFSET_LEFT);
            } 
            if ( isNaN(delta[1]) ) { // in case of 'auto'
                delta[1] = (pos == RELATIVE) ? 0 : node.get(OFFSET_TOP);
            } 

            if (xy[0] !== null) {
                node.setStyle(LEFT, xy[0] - currentXY[0] + delta[0] + 'px');
            }

            if (xy[1] !== null) {
                node.setStyle(TOP, xy[1] - currentXY[1] + delta[1] + 'px');
            }
          
            if (!noRetry) {
                var newXY = node.getXY();

                // if retry is true, try one more time if we miss 
               if ( (xy[0] !== null && newXY[0] != xy[0]) || 
                    (xy[1] !== null && newXY[1] != xy[1]) ) {
                   node.setXY(xy, true);
               }
            }        

            Y.log('setXY setting position to ' + xy, 'info', 'Node');
        }
    
    });

}, '3.0.0', { requires: ['node'] });
