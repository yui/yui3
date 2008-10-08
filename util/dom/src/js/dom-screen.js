/**
 * Adds position and region management functionality to DOM.
 * @module dom
 * @submodule dom-screen
 * @for DOM
 */

var OFFSET_TOP = 'offsetTop',
    BODY = 'body',
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
    HEIGHT = 'height',
    WIDTH = 'width',
    BORDER_LEFT_WIDTH = 'borderLeftWidth',
    BORDER_TOP_WIDTH = 'borderTopWidth',
    GET_BOUNDING_CLIENT_RECT = 'getBoundingClientRect',
    GET_COMPUTED_STYLE = 'getComputedStyle',
    RE_TABLE = /^t(?:able|d|h)$/i;

var DOM = DOM || Y.DOM;

Y.mix(DOM, {
    /**
     * Returns the inner height of the viewport (exludes scrollbar). 
     * @method winHeight
     * @return {Int} The pixel height of the viewport.
     */
    winHeight: function(node) {
        var h = DOM._getWinSize(node)[HEIGHT];
        Y.log('winHeight returning ' + h, 'info', 'DOM');
        return h;
    },

    /**
     * Returns the inner width of the viewport (exludes scrollbar). 
     * @method winWidth
     * @return {Int} The pixel width of the viewport.
     */
    winWidth: function(node) {
        var w = DOM._getWinSize(node)[WIDTH];
        Y.log('winWidth returning ' + w, 'info', 'DOM');
        return w;
    },

    /**
     * Document height 
     * @method docHeight
     * @return {Int} The pixel height of the document.
     */
    docHeight:  function(node) {
        var h = DOM._getDocSize(node)[HEIGHT];
        Y.log('docHeight returning ' + h, 'info', 'DOM');
        return Math.max(h, DOM._getWinSize(node)[HEIGHT]);
    },

    /**
     * Document width 
     * @method docWidth
     * @return {Int} The pixel width of the document.
     */
    docWidth:  function(node) {
        var w = DOM._getDocSize(node)[WIDTH];
        Y.log('docWidth returning ' + w, 'info', 'DOM');
        return Math.max(w, DOM._getWinSize(node)[WIDTH]);
    },

    /**
     * Amount page has been scroll vertically 
     * @method docScrollX
     * @return {Int} The scroll amount in pixels.
     */
    docScrollX: function(node) {
        var doc = DOM._getDoc();
        return Math.max(doc[DOCUMENT_ELEMENT][SCROLL_LEFT], doc[BODY][SCROLL_LEFT]);
    },

    /**
     * Amount page has been scroll horizontally 
     * @method docScrollY
     * @return {Int} The scroll amount in pixels.
     */
    docScrollY:  function(node) {
        var doc = DOM._getDoc();
        return Math.max(doc[DOCUMENT_ELEMENT][SCROLL_TOP], doc[BODY][SCROLL_TOP]);
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
        var _floor = Math.floor(),
            _docScrollX = DOM.docScrollX,
            _docScrollY = DOM.docScrollY;

        if (document[DOCUMENT_ELEMENT][GET_BOUNDING_CLIENT_RECT]) {
            return function(node) {
                var xy = false;
                if (node) {
                    var scrollLeft = _docScrollX(node),
                        scrollTop = _docScrollY(node),
                        box = node[GET_BOUNDING_CLIENT_RECT](),
                        doc = DOM._getDoc(node);

                    xy = [_floor(box[LEFT]), _floor(box[TOP])];
                        if (Y.UA.ie) {
                            var off1 = 2, off2 = 2,
                            mode = doc[COMPAT_MODE],
                            bLeft = DOM[GET_COMPUTED_STYLE](doc[DOCUMENT_ELEMENT], BORDER_LEFT_WIDTH),
                            bTop = DOM[GET_COMPUTED_STYLE](doc[DOCUMENT_ELEMENT], BORDER_TOP_WIDTH);

                            if (Y.UA.ie === 6) {
                                if (mode !== _BACK_COMPAT) {
                                    off1 = 0;
                                    off2 = 0;
                                }
                            }
                            
                            if ((mode == _BACK_COMPAT)) {
                                off1 = parseInt(bLeft, 10);
                                off2 = parseInt(bTop, 10);
                            }
                            
                            xy[0] -= off1;
                            xy[1] -= off2;
                        }

                    if ((scrollTop || scrollLeft)) {
                        xy[0] += scrollLeft;
                        xy[1] += scrollTop;
                    }

                    // gecko may return sub-pixel (non-int) values
                    xy[0] = _floor(xy[0]);
                    xy[1] = _floor(xy[1]);
                }
                return xy;                   
            };
        } else {
            return function(node) { // manually calculate by crawling up offsetParents
                //Calculate the Top and Left border sizes (assumes pixels)
                var xy = [node[OFFSET_LEFT], node[OFFSET_TOP]],
                    parentNode = node,
                    bCheck = ((Y.UA.gecko || (Y.UA.webkit > 519)) ? true : false);

                while ((parentNode = parentNode[OFFSET_PARENT])) {
                    xy[0] += parentNode[OFFSET_LEFT];
                    xy[1] += parentNode[OFFSET_TOP];
                    if (bCheck) {
                        xy = DOM._calcBorders(parentNode, xy);
                    }
                }

                // account for any scrolled ancestors
                if (DOM.getStyle(node, POSITION) != FIXED) {
                    parentNode = node;
                    var scrollTop, scrollLeft;

                    while ((parentNode = parentNode.parentNode)) {
                        scrollTop = parentNode[SCROLL_TOP];
                        scrollLeft = parentNode[SCROLL_LEFT];

                        //Firefox does something funky with borders when overflow is not visible.
                        if (Y.UA.gecko && (DOM.getStyle(parentNode, 'overflow') !== 'visible')) {
                                xy = DOM._calcBorders(parentNode, xy);
                        }
                        

                        if (scrollTop || scrollLeft) {
                            xy[0] -= scrollLeft;
                            xy[1] -= scrollTop;
                        }
                    }
                    xy[0] += _docScrollX(node);
                    xy[1] += _docScrollY(node);

                } else {
                    //Fix FIXED position -- add scrollbars
                    if (Y.UA.webkit || Y.UA.gecko) {
                        xy[0] += _docScrollX(node);
                        xy[1] += _docScrollY(node);
                    }
                }
                //Round the numbers so we get sane data back
                xy[0] = _floor(xy[0]);
                xy[1] = _floor(xy[1]);

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
        return DOM.getXY(node)[0];
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
        return DOM.getXY(node)[1];
    },

    /**
     * Set the position of an html element in page coordinates.
     * The element must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @method setXY
     * @param element The target element
     * @param {Array} xy Contains X & Y values for new position (coordinates are page-based)
     * @param {Boolean} noRetry By default we try and set the position a second time if the first fails
     */
    setXY: function(node, xy) {
        var pos = DOM.getStyle(node, POSITION),
            setStyle = DOM.setStyle,
            currentXY = DOM.getXY(node),
            delta = [ // assuming pixels; if not we will have to retry
                parseInt( DOM[GET_COMPUTED_STYLE](node, LEFT), 10 ),
                parseInt( DOM[GET_COMPUTED_STYLE](node, TOP), 10 )
            ];
    
        if (pos == 'static') { // default to relative
            pos = RELATIVE;
            setStyle(node, POSITION, pos);
        }

        if (currentXY) { // has to be part of doc to have xy
            if (xy[0] !== null) {
                setStyle(node, LEFT, xy[0] - currentXY[0] + delta[0] + 'px');
            }

            if (xy[1] !== null) {
                setStyle(node, TOP, xy[1] - currentXY[1] + delta[1] + 'px');
            }
          
            Y.log('setXY setting position to ' + xy, 'info', 'Node');
        } else {
            Y.log('xy failed: node not available', 'error', 'Node');
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
        return DOM.setXY(node, [x, null]);
    },

    /**
     * Set the Y position of an html element in page coordinates, regardless of how the element is positioned.
     * The element(s) must be part of the DOM tree to have page coordinates (display:none or elements not appended return false).
     * @method setY
     * @param element The target element
     * @param {Int} y The Y values for new position (coordinates are page-based)
     */
    setY: function(node, y) {
        return DOM.setXY(node, [null, y]);
    },

    _calcBorders: function(node, xy2) {
        var t = parseInt(DOM[GET_COMPUTED_STYLE](node, BORDER_TOP_WIDTH), 10) || 0,
            l = parseInt(DOM[GET_COMPUTED_STYLE](node, BORDER_LEFT_WIDTH), 10) || 0;
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
        var doc = DOM._getDoc(),
            win = doc.defaultView || doc.parentWindow,
            mode = doc[COMPAT_MODE],
            h = win.innerHeight,
            w = win.innerWidth,
            root = doc[DOCUMENT_ELEMENT];

        if ( mode && !Y.UA.opera ) { // IE, Gecko
            if (mode != 'CSS1Compat') { // Quirks
                root = doc[BODY]; 
            }
            h = root.clientHeight;
            w = root.clientWidth;
        }
        return { height: h, width: w }; 
    },

    _getDocSize: function(node) {
        var doc = DOM._getDoc(),
            root = doc[DOCUMENT_ELEMENT];

        if (doc[COMPAT_MODE] != 'CSS1Compat') {
            root = doc[BODY];
        }

        return { height: root.scrollHeight, width: root.scrollWidth };
    }
});

