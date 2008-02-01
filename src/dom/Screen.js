(function() {

    var M = function(Y) {

        var Dom = Y.Dom,
            document = Y.config.doc;     // cache for faster lookups
        
        // brower detection
        var isOpera = Y.ua.opera,
            isSafari = Y.ua.webkit, 
            isGecko = Y.ua.gecko,
            isIE = Y.ua.ie; 
        
        // regex cache
        var patterns = {
            ROOT_TAG: /^body|html$/i // body for quirks mode, html for standards
        };

        var getXY = function() {
            if (document.documentElement.getBoundingClientRect) { // IE
                return function(el) {
                    var box = el.getBoundingClientRect();

                    var rootNode = el.ownerDocument;
                    return [box.left + Y.Dom.getDocumentScrollLeft(rootNode), box.top +
                            Y.Dom.getDocumentScrollTop(rootNode)];
                };
            } else {
                return function(el) { // manually calculate by crawling up offsetParents
                    var pos = [el.offsetLeft, el.offsetTop];
                    var parentNode = el.offsetParent;

                    // safari: subtract body offsets if el is abs (or any offsetParent), unless body is offsetParent
                    var accountForBody = (isSafari &&
                            Y.Dom.getStyle(el, 'position') == 'absolute' &&
                            el.offsetParent == el.ownerDocument.body);

                    if (parentNode != el) {
                        while (parentNode) {
                            pos[0] += parentNode.offsetLeft;
                            pos[1] += parentNode.offsetTop;
                            if (!accountForBody && isSafari && 
                                    Y.Dom.getStyle(parentNode,'position') == 'absolute' ) { 
                                accountForBody = true;
                            }
                            parentNode = parentNode.offsetParent;
                        }
                    }

                    if (accountForBody) { //safari doubles in this case
                        pos[0] -= el.ownerDocument.body.offsetLeft;
                        pos[1] -= el.ownerDocument.body.offsetTop;
                    } 
                    parentNode = el.parentNode;

                    // account for any scrolled ancestors
                    while ( parentNode.tagName && !patterns.ROOT_TAG.test(parentNode.tagName) ) 
                    {
                       // work around opera inline/table scrollLeft/Top bug
                       if (Y.Dom.getStyle(parentNode, 'display').search(/^inline|table-row.*$/i)) { 
                            pos[0] -= parentNode.scrollLeft;
                            pos[1] -= parentNode.scrollTop;
                        }
                        
                        parentNode = parentNode.parentNode; 
                    }

                    return pos;
                };
            }
        }(); // NOTE: Executing for loadtime branching

        Dom.getXY = function(el) {
            var f = function(el) {
                // has to be part of document to have pageXY
                if ( (el.parentNode === null || el.offsetParent === null ||
                        this.getStyle(el, 'display') == 'none') && el != el.ownerDocument.body) {
                    Y.log('getXY failed: element not available', 'error', 'Dom');
                    return false;
                }
                
                Y.log('getXY returning ' + getXY(el), 'info', 'Dom');
                return getXY(el);
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        };
            
        Dom.getX = function(el) {
            var f = function(el) {
                return Y.Dom.getXY(el)[0];
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        };
            
        Dom.getY = function(el) {
            var f = function(el) {
                return Y.Dom.getXY(el)[1];
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        };
            
        Dom.setXY = function(el, pos, noRetry) {
            var f = function(el) {
                var style_pos = this.getStyle(el, 'position');
                if (style_pos == 'static') { // default to relative
                    this.setStyle(el, 'position', 'relative');
                    style_pos = 'relative';
                }

                var pageXY = this.getXY(el);
                if (pageXY === false) { // has to be part of doc to have pageXY
                    Y.log('setXY failed: element not available', 'error', 'Dom');
                    return false; 
                }
                
                var delta = [ // assuming pixels; if not we will have to retry
                    parseInt( this.getStyle(el, 'left'), 10 ),
                    parseInt( this.getStyle(el, 'top'), 10 )
                ];
            
                if ( isNaN(delta[0]) ) {// in case of 'auto'
                    delta[0] = (style_pos == 'relative') ? 0 : el.offsetLeft;
                } 
                if ( isNaN(delta[1]) ) { // in case of 'auto'
                    delta[1] = (style_pos == 'relative') ? 0 : el.offsetTop;
                } 
        
                if (pos[0] !== null) { el.style.left = pos[0] - pageXY[0] + delta[0] + 'px'; }
                if (pos[1] !== null) { el.style.top = pos[1] - pageXY[1] + delta[1] + 'px'; }
              
                if (!noRetry) {
                    var newXY = this.getXY(el);

                    // if retry is true, try one more time if we miss 
                   if ( (pos[0] !== null && newXY[0] != pos[0]) || 
                        (pos[1] !== null && newXY[1] != pos[1]) ) {
                       this.setXY(el, pos, true);
                   }
                }        
        
                Y.log('setXY setting position to ' + pos, 'info', 'Dom');
            };
            
            Y.Dom.batch(el, f, Y.Dom, true);
        };
            
        Dom.setX = function(el, x) {
            Y.Dom.setXY(el, [x, null]);
        };
        
        Dom.setY = function(el, y) {
            Y.Dom.setXY(el, [null, y]);
        };
            
        Dom.getRegion = function(el) {
            var f = function(el) {
                if ( (el.parentNode === null || el.offsetParent === null ||
                        this.getStyle(el, 'display') == 'none') && el != document.body) {
                    Y.log('getRegion failed: element not available', 'error', 'Dom');
                    return false;
                }

                var region = Y.Region.getRegion(el);
                Y.log('getRegion returning ' + region, 'info', 'Dom');
                return region;
            };
            
            return Y.Dom.batch(el, f, Y.Dom, true);
        };
            
        /**
         * Returns the width of the client (viewport).
         * @method getClientWidth
         * @deprecated Now using getViewportWidth.  This interface left intact for back compat.
         * @return {Int} The width of the viewable area of the page.
         */
        Dom.getClientWidth = function() {
            return Y.Dom.getViewportWidth();
        };
        
        /**
         * Returns the height of the client (viewport).
         * @method getClientHeight
         * @deprecated Now using getViewportHeight.  This interface left intact for back compat.
         * @return {Int} The height of the viewable area of the page.
         */
        Dom.getClientHeight = function() {
            return Y.Dom.getViewportHeight();
        };
        
        Dom.getDocumentHeight = function() {
            var scrollHeight = (document.compatMode != 'CSS1Compat') ? document.body.scrollHeight : document.documentElement.scrollHeight;

            var h = Math.max(scrollHeight, Y.Dom.getViewportHeight());
            Y.log('getDocumentHeight returning ' + h, 'info', 'Dom');
            return h;
        };
        
        Dom.getDocumentWidth = function() {
            var scrollWidth = (document.compatMode != 'CSS1Compat') ? document.body.scrollWidth : document.documentElement.scrollWidth;
            var w = Math.max(scrollWidth, Y.Dom.getViewportWidth());
            Y.log('getDocumentWidth returning ' + w, 'info', 'Dom');
            return w;
        };

        Dom.getViewportHeight = function() {
            var height = self.innerHeight; // Safari, Opera
            var mode = document.compatMode;
        
            if ( (mode || isIE) && !isOpera ) { // IE, Gecko
                height = (mode == 'CSS1Compat') ?
                        document.documentElement.clientHeight : // Standards
                        document.body.clientHeight; // Quirks
            }
        
            Y.log('getViewportHeight returning ' + height, 'info', 'Dom');
            return height;
        };
        
        Dom.getViewportWidth = function() {
            var width = self.innerWidth;  // Safari
            var mode = document.compatMode;
            
            if (mode || isIE) { // IE, Gecko, Opera
                width = (mode == 'CSS1Compat') ?
                        document.documentElement.clientWidth : // Standards
                        document.body.clientWidth; // Quirks
            }
            Y.log('getViewportWidth returning ' + width, 'info', 'Dom');
            return width;
        };
     
        Dom.getDocumentScrollLeft = function(doc) {
            doc = doc || document;
            return Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
        };

        Dom.getDocumentScrollTop = function(doc) {
            doc = doc || document;
            return Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);
        };

        /**
         * Creates a Region based on the viewport relative to the document. 
         * @method getClientRegion
         * @return {Region} A Region object representing the viewport which accounts for document scroll
         */
        Dom.getClientRegion = function() {
            var t = Y.Dom.getDocumentScrollTop(),
                l = Y.Dom.getDocumentScrollLeft(),
                r = Y.Dom.getViewportWidth() + l,
                b = Y.Dom.getViewportHeight() + t;

            return new Y.Region(t, r, b, l);
        };
        

        /**
         * Provides helper methods for positioning and managing viewport 
         * @namespace YAHOO.util
         * @class Screen
         */
        Y.Screen = {
            /**
             * Set the position of an html element in page coordinates, regardless of how the element is positioned.
             * The element(s) must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
             * @method setXY
             * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements
             * @param {Array} pos Contains X & Y values for new position (coordinates are page-based)
             * @param {Boolean} noRetry By default we try and set the position a second time if the first fails
             */
            setXY: Y.Dom.setXY,
            /**
             * Gets the current position of an element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
             * @method getXY
             * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements
             * @return {Array} The XY position of the element(s)
             */
            getXY: Y.Dom.getXY,
            /**
             * Set the X position of an html element in page coordinates, regardless of how the element is positioned.
             * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
             * @method setX
             * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
             * @param {Int} x The value to use as the X coordinate for the element(s).
             */
            setX: Y.Dom.setX,
            /**
             * Gets the current X position of an element based on page coordinates.  The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
             * @method getX
             * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements
             * @return {Number | Array} The X position of the element(s)
             */
            getX: Y.Dom.getX,
            /**
             * Set the Y position of an html element in page coordinates, regardless of how the element is positioned.
             * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
             * @method setY
             * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
             * @param {Int} x To use as the Y coordinate for the element(s).
             */
            setY: Y.Dom.setY,
            /**
             * Gets the current Y position of an element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
             * @method getY
             * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements
             * @return {Number | Array} The Y position of the element(s)
             */
            getY: Y.Dom.getY,
            /**
             * Returns the region position of the given element.
             * The element must be part of the DOM tree to have a region (display:none or elements not appended return false).
             * @method getRegion
             * @param {String | HTMLElement | Array} el Accepts a string to use as an ID, an actual DOM reference, or an Array of IDs and/or HTMLElements.
             * @return {Region | Array} A Region or array of Region instances containing "top, left, bottom, right" member data.
             */
            getRegion: Y.Dom.getRegion,
            getClientRegion: Y.Dom.getClientRegion,
            /**
             * Returns the current height of the viewport.
             * @method getViewportWidth
             * @return {Int} The height of the viewable area of the page (excludes scrollbars).
             */
            getViewportWidth: Y.Dom.getViewportWidth,
            /**
             * Returns the current height of the viewport.
             * @method getViewportHeight
             * @return {Int} The height of the viewable area of the page (excludes scrollbars).
             */
            getViewportHeight: Y.Dom.getViewportHeight,
            /**
             * Returns the width of the document.
             * @method getDocumentWidth
             * @return {Int} The width of the actual document (which includes the body and its margin).
             */
            getDocumentWidth: Y.Dom.getDocumentWidth,
            /**
             * Returns the height of the document.
             * @method getDocumentHeight
             * @return {Int} The height of the actual document (which includes the body and its margin).
             */
            getDocumentHeight: Y.Dom.getDocumentHeight,
            /**
             * Returns the top scroll value of the document 
             * @method getDocumentScrollTop
             * @param {HTMLDocument} document (optional) The document to get the scroll value of
             * @return {Int}  The amount that the document is scrolled to the top
             */
            getDocumentScrollTop: Y.Dom.getDocumentScrollTop,
            /**
             * Returns the left scroll value of the document 
             * @method getDocumentScrollLeft
             * @param {HTMLDocument} document (optional) The document to get the scroll value of
             * @return {Int}  The amount that the document is scrolled to the left
             */
            getDocumentScrollLeft: Y.Dom.getDocumentScrollLeft
        };

    };

    YUI.add("screen", M, "3.0.0");

})();
