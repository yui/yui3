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
            Y.log('winHeight returning ' + h, 'info', 'DOM');
            return h;
        },

        /**
         * Returns the inner width of the viewport (exludes scrollbar). 
         * @method winWidth
         */
        winWidth: function(node) {
            var w = getWinSize(node).width;
            Y.log('winWidth returning ' + w, 'info', 'DOM');
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
                Y.log('xy failed: node not available', 'error', 'Node');
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

            Y.log('setXY setting position to ' + xy, 'info', 'Node');
        }
    });

}, '3.0.0', { requires: ['dom'] });
