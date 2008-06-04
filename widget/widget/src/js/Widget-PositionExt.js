/**
 * @extension Y.widget.PositionExtras
 * 
 * @requires-events 
 * @requires-attrs widget, root
 * @requires-methods none
 */

YUI.add("widget-position-extras", function(Y) {

        var Lang = Y.lang,
            Node = Y.Node,

            VISIBLE = "visible",
            CONSTRAIN = "constrain",
            CENTER = "center",
            CONTEXT = "context",
            XY_COORD = "xy",
            ROOT = "root",
            RENDERUI = "renderUI",
            BINDUI = "bindUI",
            SYNCUI = "syncUI",

            OFFSET_WIDTH = "offsetWidth",
            OFFSET_HEIGHT = "offsetHeight",
            SCROLL_TOP = "scrollTop",
            SCROLL_LEFT = "scrollLeft",
            WIN_WIDTH = "winWidth",
            WIN_HEIGHT = "winHeight",
            DOC_SCROLL_Y = "docScrollY",
            DOC_SCROLL_X = "docScrollX",

            WindowResize = "window:resize",
            WindowScroll = "window:scroll",
            Visible = "visibleChange",
            XY = "xyChange",
            Constrain = "constrainChange",
            Center = "centerChange",
            Context = "contextChange";

        function PositionExtras(config) {
            // TODO: If Plugin
            // PositionExtras.constructor.superclass.apply(this, arguments);
        }

        // Static Properties
        var stats = {

            ATTRS : {
                constrain: {
                    value:null
                },
                // supercedes: ["x", "y", "xy"]
                center: { 
                    value:null
                },
                context: {
                    value:null
                }
            },

            TL: "tl",
            TR: "tr",
            BL: "bl",
            BR: "br",
            CT: "ct",
            CR: "cr",
            CB: "cb",
            CL: "cl",

            BUFFER : 10
        };

        Y.mix(PositionExtras, stats);

        var proto = {

            initPositionExtras : function() {
                Y.after(this._posextSyncUI, this, SYNCUI);
                Y.after(this._posextBindUI, this, BINDUI);
            },

            _posextSyncUI : function() {
                this._uiSetConstrained();
                this._uiSetCentered();
                this._uiSetContext();
            },

            _posextBindUI : function() {
                this.on(Constrain, Y.bind(this._uiSetConstrained, this));
                this.on(Center, Y.bind(this._uiSetCentered, this));
                this.on(Context, Y.bind(this._uiSetContext, this));
            },

            /**
             * Centers the container in the viewport, or if an element is passed in,
             * to the element.
             *
             * @method center
             */
            center: function (element) {
                var buffer = PositionExtras.BUFFER,
                    elementWidth = this._posEl.get(OFFSET_WIDTH),
                    elementHeight = this._posEl.get(OFFSET_HEIGHT),
                    container = this._getRegion(element, true),
                    x,
                    y;

                if (elementWidth < container.width) {
                    x = (container.width / 2) - (elementWidth / 2) + container.scrollLeft;
                } else {
                    x = buffer + container.scrollLeft;
                }

                if (elementHeight < container.height) {
                    y = (container.height / 2) - (elementHeight / 2) + container.scrollTop;
                } else {
                    y = buffer + container.scrollTop;
                }

                this.set(XY_COORD, [Math.floor(x + container.left), Math.floor(y + container.top)]);
            },

            /**
            * Aligns the Overlay to its context element using the specified corner 
            * points (represented by the constants TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, 
            * and BOTTOM_RIGHT.
            * @method align
            * @param {String} elementAlign  The String representing the corner of 
            * the Overlay that should be aligned to the context element
            * @param {String} contextAlign  The corner of the context element 
            * that the elementAlign corner should stick to.
            */
            align: function (elementMagnet, contextMagnet) {

                var contextArgs = this.get(CONTEXT),
                    context,
                    contextRegion,
                    me = this;

                if (contextArgs) {
                    context = Y.Node.get(contextArgs[0]);

                    elementMagnet = elementMagnet || contextArgs[1];
                    contextMagnet = contextMagnet || contextArgs[2];

                    if (context) {
                        contextRegion = this._getRegion(context, false);

                        switch (contextMagnet) {
                            case PositionExtras.TL:
                                this._align(contextRegion.left, contextRegion.top, elementMagnet);
                                break;
                            case PositionExtras.TR:
                                this._align(contextRegion.right, contextRegion.top, elementMagnet);
                                break;
                            case PositionExtras.BL:
                                this._align(contextRegion.left, contextRegion.bottom, elementMagnet);
                                break;
                            case PositionExtras.BR:
                                this._align(contextRegion.right, contextRegion.bottom, elementMagnet);
                                break;
                            case PositionExtras.CT:
                                this._align(contextRegion.left + Math.floor(contextRegion.width/2), contextRegion.top , elementMagnet);
                                break;
                            case PositionExtras.CB:
                                this._align(contextRegion.left + Math.floor(contextRegion.width/2), contextRegion.bottom, elementMagnet);
                                break;
                            case PositionExtras.CL:
                                this._align(contextRegion.left, contextRegion.top + Math.floor(contextRegion.height/2), elementMagnet);
                                break;
                            case PositionExtras.CR:
                                this._align(contextRegion.right, contextRegion.top + Math.floor(contextRegion.height/2), elementMagnet);
                                break;
                        }
                    }
                }
            },

            /**
             * Given x, y coordinate values, returns the calculated coordinates required to 
             * position the Overlay if it is to be constrained to the viewport, based on the 
             * current element size, viewport dimensions and scroll values.
             *
             * @param {Number} x The X coordinate value to be constrained
             * @param {Number} y The Y coordinate value to be constrained
             * @return {Array} The constrained x and y coordinates at index 0 and 1 respectively;
             */
            getConstrainedXY: function(x, y, element) {
                // TODO: Element support
                var container = this._getRegion(element, true),
                    offsetHeight = this._posEl.get(OFFSET_HEIGHT),
                    offsetWidth = this._posEl.get(OFFSET_WIDTH);

                return [this._constrain(x, offsetWidth, container.width, container.scrollLeft), 
                        this._constrain(y, offsetHeight, container.height, container.scrollTop)];
            },

            /**
            * The default event handler for the moveEvent if the 
            * "constraintoviewport" is set to true.
            * @method constrain
            * @param {String} type The CustomEvent type (usually the property name)
            * @param {Object[]} args The CustomEvent arguments. For configuration 
            * handlers, args[0] will equal the newly applied value for the property.
            * @param {Object} obj The scope object. For configuration handlers, 
            * this will usually equal the owner.
            */
            _constrainOnMove: function (type, e) {
                // TODO: How to modify?
                var pos = e.newVal;
                return this.getConstrainedXY(pos[0], pos[1]);
            },

            /**
             * The default event handler fired when the "centered" property
             * is changed.
             * @method setFixedCenter
             * @param {String} type The CustomEvent type (usually the property name)
             * @param {Object[]} args The CustomEvent arguments. For configuration
             * handlers, args[0] will equal the newly applied value for the property.
             * @param {Object} obj The scope object. For configuration handlers,
             * this will usually equal the owner.
             */
            _uiSetCentered: function () {

                var val = this.get(CENTER);
                if (val) {
                    if (val === true) {
                        val = null;
                    } else {
                        val = Y.Node.get(val);
                    }
                    this.center(val);

                    var listeners = {},
                        center = Y.bind(this.center, this, val);

                    // listeners[WindowResize] = listeners[WindowScroll] = listeners[Visible] = center;
                    // listeners[Visible] = {fn:center, when:"before"};
                    this.attachListeners(CENTER, listeners);
                } else {
                    this.detachListeners(CENTER);
                }
            },

            /**
             * The default event handler fired when the "constraintoviewport" 
             * property is changed.
             * @method configConstrainToViewport
             * @param {String} type The CustomEvent type (usually the property name)
             * @param {Object[]} args The CustomEvent arguments. For configuration 
             * handlers, args[0] will equal the newly applied value for 
             * the property.
             * @param {Object} obj The scope object. For configuration handlers, 
             * this will usually equal the owner.
             */
            _uiSetConstrained: function () {
                var val = Y.Node.get(this.get(CONSTRAIN));
                if (val) {
                    var listeners = {};

                    listeners[XY] = {fn:Y.bind(this._constrainOnMove, this), when:"before"};
                    listeners[Visible] = {fn:Y.bind(this._primeFromDOM, this), when:"before"};

                    this.attachListeners(CONSTRAIN, listeners);
                } else {
                    this.detachListeners(CONSTRAIN);
                }
            },

             /**
              * The default event handler fired when the "context" property
              * is changed.
              * @method configContext
              * @param {String} type The CustomEvent type (usually the property name)
              * @param {Object[]} args The CustomEvent arguments. For configuration 
              * handlers, args[0] will equal the newly applied value for the property.
              * @param {Object} obj The scope object. For configuration handlers, 
              * this will usually equal the owner.
              */
            _uiSetContext: function () {
                this.align();
            },

            _align : function(x, y, elementAlign) {
                var element = this._posEl;

                switch (elementAlign) {
                    case PositionExtras.TL:
                        this.move(x, y);
                        break;
                    case PositionExtras.TR:
                        this.move((x - element.get(OFFSET_WIDTH)), y);
                        break;
                    case PositionExtras.BL:
                        this.move(x, (y - element.get(OFFSET_HEIGHT)));
                        break;
                    case PositionExtras.BR:
                        this.move((x - element.get(OFFSET_WIDTH)), (y - element.get(OFFSET_HEIGHT)));
                        break;
                    case PositionExtras.CT:
                        this.move(x - (element.get(OFFSET_WIDTH)/2), y);
                        break;
                    case PositionExtras.CB:
                        this.move(x - (element.get(OFFSET_WIDTH)/2), (y - element.get(OFFSET_HEIGHT)));
                        break;
                    case PositionExtras.CL:
                        this.move(x, (y - (element.get(OFFSET_HEIGHT)/2)));
                        break;
                    case PositionExtras.CR:
                        this.move((x - element.get(OFFSET_WIDTH)), (y - (element.get(OFFSET_HEIGHT)/2)));
                        break;
                }
            },

            _constrain : function(pos, elSize, cPosition, cSize, cScroll) {

                var buffer = PositionExtras.BUFFER;

                if (elSize + buffer < cSize) {

                    var lowerConstraint = cPosition + cScroll + buffer;
                    var upperConstraint = cPosition + cScroll + cSize - elSize - buffer;

                    if (pos < lowerConstraint) {
                        pos = lowerConstraint;
                    } else if (pos > upperConstraint) {
                        pos = upperConstraint;
                    }
                } else {
                    pos = cPosition + cScroll + buffer;
                }

                return pos;
            },

            _getRegion: function(element, inclScroll) {
                var dim = {},
                    xy = (element) ? element.getXY() : [0,0],
                    doc = (element) ? null : this._root; // Node.get("document") not working for scroll XY;

                dim.left = xy[0];
                dim.top = xy[1];

                dim.width  = (element) ? element.get(OFFSET_WIDTH) : doc.get(WIN_WIDTH);
                dim.height = (element) ? element.get(OFFSET_HEIGHT) : doc.get(WIN_HEIGHT);
                dim.right  = (element) ? dim.left + dim.width : dim.width;
                dim.bottom = (element) ? dim.top + dim.height : dim.height;

                if (inclScroll) {
                    dim.scrollTop  = (element) ? element.get(SCROLL_TOP) : doc.get(DOC_SCROLL_Y);
                    dim.scrollLeft = (element) ? element.get(SCROLL_LEFT) : doc.get(DOC_SCROLL_X);
                }

                return dim;
            }
        };

        PositionExtras.prototype = proto;

        Y.WidgetPositionExtras = PositionExtras;

        // TODO: If plugin
        // Y.extend(PositionExtras, Y.Base, proto);

    }, "3.0.0");
