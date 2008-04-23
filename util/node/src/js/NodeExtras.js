YUI.add('nodeextras', function(Y) {

    Y.use('node');

    var regexCache = {};
    var getRegExp = function(str, flags) {
        flags = flags || '';
        if (!regexCache[str + flags]) {
            regexCache[str + flags] = new RegExp(str, flags);
        }
        return regexCache[str + flags];
    };

    var NodeExtras = {
        /**
         * Determines whether an HTMLElement has the given className.
         * @method hasClass
         * @param {String} className the class name to search for
         * @return {Boolean | Array} A boolean value or array of boolean values
         */
        hasClass: function(className) {
            var re = getRegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
            return re.test(this.get('className'));
        },

        /**
         * Adds a class name to a given element or collection of elements.
         * @method addClass         
         * @param {String} className the class name to add to the class attribute
         * @return {Boolean | Array} A pass/fail boolean or array of booleans
         */
        addClass: function(className) {
            if (this.hasClass(node, className)) {
                return; // already present
            }
            
            //Y.log('addClass adding ' + className, 'info', 'Node');
            
            this.set('className', Y.lang.trim([this.get('className'), className].join(' ')));
        },

        /**
         * Removes a class name from a given element or collection of elements.
         * @method removeClass         
         * @param {String} className the class name to remove from the class attribute
         * @return {Boolean | Array} A pass/fail boolean or array of booleans
         */
        removeClass: function(className) {
            if (!className || !this.hasClass(className)) {
                return; // not present
            }                 

            //Y.log('removeClass removing ' + className, 'info', 'Node');
            
            this.set('className', Y.lang.trim(this.get('className').replace(getRegExp('(?:^|\\s+)'
                    + className + '(?:\\s+|$)'), ' ')));

            if ( this.hasClass(className) ) { // in case of multiple adjacent
                this.removeClass(className);
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
        replaceClass: function(newC, oldC) {
            //Y.log('replaceClass replacing ' + oldC + ' with ' + newC, 'info', 'Node');
        
            if ( !this.hasClass(oldC) ) {
                this.addClass(newC); // just add it if nothing to replace
                return; // NOTE: return
            }
        
            var re = getRegExp('(?:^|\\s+)' + oldC + '(?:\\s+|$)');
            this.set('className', this.get('className').replace(re, ' ' + newC + ' '));

            if ( this.hasClass(oldC) ) { // in case of multiple adjacent
                this.replaceClass(oldC, newC);
            }

            this.set('className', Y.lang.trim(this.get('className'))); // remove any trailing spaces
        },

        /**
         * Returns the previous sibling that is an HTMLElement. 
         * Returns the nearest HTMLElement sibling if no method provided.
         * @method getPreviousSiblingBy
         * @param {Function} method A boolean function used to test siblings
         * that receives the sibling node being tested as its only argument
         * @return {Node} Node instance or null if not found
         */
        previousSibling: function(method) {
            var node = this;
            while (node) {
                node = node.get('previousSibling');
                if ( node && node.get('nodeType') === 1 ) {
                    return node;
                }
            }
            return null;
        }, 

        /**
         * Returns the next HTMLElement sibling that passes the boolean method. 
         * Returns the nearest HTMLElement sibling if no method provided.
         * @method getNextSiblingBy
         * @param {Function} method A boolean function used to test siblings
         * that receives the sibling node being tested as its only argument
         * @return {Object} HTMLElement or null if not found
         */
        nextSibling: function(method) {
            var node = this;
            while (node) {
                node = node.get('nextSibling');
                if ( node && node.get('nodeType') === 1 ) {
                    return node;
                }
            }
            return null;
        },
        
        /**
         * Determines whether an HTMLElement is an ancestor of another HTML element in the DOM hierarchy.
         * @method contains
         * @param {String | HTMLElement} needle The possible descendent
         * @return {Boolean} Whether or not this node is an ancestor of needle
         */
        contains: function(needle) {
            if (this.hasMethod('contains'))  {
                return this.invoke('contains', this, needle);
            } else if ( this.hasMethod('compareDocumentPosition') ) { // gecko
                return !!(this.invoke('compareDocumentPosition', this, needle) & 16);
            }
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
            if (Y.Doc.get().get('documentElement').getBoundingClientRect) {
                return function() {
                    var doc = this.get('ownerDocument'),
                        body = doc.get('body');
                        scrollLeft = Math.max(doc.get('scrollLeft'), body.get('scrollLeft')),
                        scrollTop = Math.max(doc.get('scrollTop'), body.get('scrollTop')),
                        box = this.invoke('getBoundingClientRect'),
                        xy = [box.left, box.top];

                    if ((scrollTop || scrollLeft) && this.getStyle('position') != 'fixed') { // no scroll accounting for fixed
                        xy[0] += scrollLeft;
                        xy[1] += scrollTop;
                    }
                    return xy;
                };
            } else {
                return function(xy) { // manually calculate by crawling up offsetParents
                    var xy = [this.get('offsetLeft'), this.get('offsetTop')];

                    var parentNode = this;
                    while (parentNode = parentNode.get('offsetParent')) {
                        xy[0] += parentNode.get('offsetLeft');
                        xy[1] += parentNode.get('offsetTop');
                    }

                    // account for any scrolled ancestors
                    if (this.getStyle('position') != 'fixed') {
                        parentNode = this;
                        var scrollTop, scrollLeft;

                        while (parentNode = parentNode.get('parentNode')) {
                            scrollTop = parentNode.get('scrollTop');
                            scrollLeft = parentNode.get('scrollLeft');

                            if (scrollTop || scrollLeft) {
                                xy[0] -= scrollLeft;
                                xy[1] -= scrollTop;
                            }
                        }

                    }
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
        setXY: function(xy, noRetry) {
            var pos = this.getStyle('position'),
                delta = [ // assuming pixels; if not we will have to retry
                    parseInt( this.getStyle('left'), 10 ),
                    parseInt( this.getStyle('top'), 10 )
                ];
        
            if (pos == 'static') { // default to relative
                pos = 'relative';
                this.setStyle('position', pos);
            }

            var currentXY = this.getXY();
            if (currentXY === false) { // has to be part of doc to have xy
                YAHOO.log('xy failed: node not available', 'error', 'Node');
                return false; 
            }
            
            if ( isNaN(delta[0]) ) {// in case of 'auto'
                delta[0] = (pos == 'relative') ? 0 : this.get('offsetLeft');
            } 
            if ( isNaN(delta[1]) ) { // in case of 'auto'
                delta[1] = (pos == 'relative') ? 0 : this.get('offsetTop');
            } 

            if (pos[0] !== null) {
                this.setStyle('left', xy[0] - currentXY[0] + delta[0] + 'px');
            }

            if (pos[1] !== null) {
                this.setStyle('top', xy[1] - currentXY[1] + delta[1] + 'px');
            }
          
            if (!noRetry) {
                var newXY = this.getXY();

                // if retry is true, try one more time if we miss 
               if ( (xy[0] !== null && newXY[0] != xy[0]) || 
                    (xy[1] !== null && newXY[1] != xy[1]) ) {
                   this.setXY(xy, true);
               }
            }        

            Y.log('setXY setting position to ' + xy, 'info', 'Node');
        }
    
    };

    Y.mix(Y.Node, NodeExtras, 0, null, 4);

}, '3.0.0');
