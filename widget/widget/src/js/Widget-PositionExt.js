YUI.add("widget-position-extras", function(Y) {

        var L = Y.Lang,
            Node = Y.Node,

            VISIBLE = "visible",
            CONSTRAIN = "constrain",
            CENTER = "center",
            ALIGN = "align",
            XY_COORD = "xy",

            RENDERUI = "renderUI",
            BINDUI = "bindUI",
            SYNCUI = "syncUI",

            OFFSET_WIDTH = "offsetWidth",
            OFFSET_HEIGHT = "offsetHeight",
            VIEWPORT_REGION = "viewportRegion",

            VisibleChange = "visibleChange",
            XYChange = "xyChange",

            ConstrainChange = "constrainChange",
            CenterChange = "centerChange",
            AlignChange = "alignChange";

        function PositionExtras(config) {
            // TODO: If Plugin
            // PositionExtras.constructor.superclass.apply(this, arguments);
            // this._initPositionExtras();
        }

        PositionExtras.ATTRS = {

            align: {
                value:null
            },

            center: {
                set: function(val) {
                    if (val) {
                        this.set(ALIGN, { 
                            node: val === true ? null : val,
                            points: [PositionExtras.CC, PositionExtras.CC]
                        });
                    }
                    return val;
                },
                value:null
            }
        };

        PositionExtras.TL = "tl";
        PositionExtras.TR = "tr";
        PositionExtras.BL = "bl";
        PositionExtras.BR = "br";
        PositionExtras.CT = "ct";
        PositionExtras.CR = "cr";
        PositionExtras.CB = "cb";
        PositionExtras.CL = "cl";
        PositionExtras.CC = "cc";

        PositionExtras.prototype = {

            _initPositionExtras : function() {
                Y.after(this._syncUIPosExtras, this, SYNCUI);
                Y.after(this._bindUIPosExtras, this, BINDUI);
            },

            _syncUIPosExtras : function() {
                // this._uiSetConstrained(this.get(CONSTRAINED));
                this._uiSetAlign(this.get(ALIGN));
            },

            _bindUIPosExtras : function() {
                // this.after(Constrain, this._onConstrainChange);
                this.after(AlignChange, this._onAlignChange);
            },

            _onAlignChange : function(e) {
                this._uiSetAlign(e.newVal);
            },

            _uiSetAlign: function (val) {
                if (val) {
                    this.align(val.node, val.points, val.triggers);
                }
            },

            align: function (node, points, triggers) {

                if (!L.isArray(points) || points.length != 2) {
                    Y.fail("align: Invalid Points Arguments");
                    return;
                }

                var nodeRegion;

                if (!node) {
                    nodeRegion = this._posEl.get("viewportRegion");
                    // TODO: Setup resize/scroll listeners if Viewport
                } else {
                    node = Y.Node.get(node);
                    if (node) {
                        nodeRegion = node.get("region");
                    }
                }

                // TODO: Until normalized in Node/Dom
                nodeRegion.width = nodeRegion.width || nodeRegion.right - nodeRegion.left;
                nodeRegion.height = nodeRegion.height || nodeRegion.bottom - nodeRegion.top;

                if (nodeRegion) {
                    var widgetPoint = points[0],
                        nodePoint = points[1],
                        xy;

                    // TODO: Optimize KWeight - Would lookup table help?
                    switch (nodePoint) {
                        case PositionExtras.TL:
                            xy = [nodeRegion.left, nodeRegion.top];
                            break;
                        case PositionExtras.TR:
                            xy = [nodeRegion.right, nodeRegion.top];
                            break;
                        case PositionExtras.BL:
                            xy = [nodeRegion.left, nodeRegion.bottom];
                            break;
                        case PositionExtras.BR:
                            xy = [nodeRegion.right, nodeRegion.bottom];
                            break;
                        case PositionExtras.CT:
                            xy = [nodeRegion.left + Math.floor(nodeRegion.width/2), nodeRegion.top];
                            break;
                        case PositionExtras.CB:
                            xy = [nodeRegion.left + Math.floor(nodeRegion.width/2), nodeRegion.bottom];
                            break;
                        case PositionExtras.CL:
                            xy = [nodeRegion.left, nodeRegion.top + Math.floor(nodeRegion.height/2)];
                            break;
                        case PositionExtras.CR:
                            xy = [nodeRegion.right, nodeRegion.top + Math.floor(nodeRegion.height/2), widgetPoint];
                            break;
                        case PositionExtras.CC:
                            xy = [nodeRegion.left + Math.floor(nodeRegion.width/2), nodeRegion.top + Math.floor(nodeRegion.height/2), widgetPoint];
                            break;
                        default:
                            Y.log("align: Invalid Points Arguments", "info", "widget-position-extras");
                            break;
                    }

                    if (xy) {
                        this._align(widgetPoint, xy[0], xy[1]);
                    }
                }
            },

            _align : function(widgetPoint, x, y) {
                var widgetNode = this._posEl,
                    xy;

                switch (widgetPoint) {
                    case PositionExtras.TL:
                        xy = [x, y];
                        break;
                    case PositionExtras.TR:
                        xy = [x - widgetNode.get(OFFSET_WIDTH), y];
                        break;
                    case PositionExtras.BL:
                        xy = [x, y - widgetNode.get(OFFSET_HEIGHT)];
                        break;
                    case PositionExtras.BR:
                        xy = [x - widgetNode.get(OFFSET_WIDTH), y - widgetNode.get(OFFSET_HEIGHT)];
                        break;
                    case PositionExtras.CT:
                        xy = [x - (widgetNode.get(OFFSET_WIDTH)/2), y];
                        break;
                    case PositionExtras.CB:
                        xy = [x - (widgetNode.get(OFFSET_WIDTH)/2), y - widgetNode.get(OFFSET_HEIGHT)];
                        break;
                    case PositionExtras.CL:
                        xy = [x, y - (widgetNode.get(OFFSET_HEIGHT)/2)];
                        break;
                    case PositionExtras.CR:
                        xy = [(x - widgetNode.get(OFFSET_WIDTH)), y - (widgetNode.get(OFFSET_HEIGHT)/2)];
                        break;
                    case PositionExtras.CC:
                        xy = [x - (widgetNode.get(OFFSET_WIDTH)/2), y - (widgetNode.get(OFFSET_HEIGHT)/2)];
                        break;
                    default:
                        Y.log("align: Invalid Points Argument", "info", "widget-position-extras");
                        break;
                }

                if (xy) {
                    this.move(xy);
                }
            },

            /**
             * Centers the container in the viewport, or if an element is passed in,
             * to the element.
             *
             * @method center
             */
            center: function (element) {
                this.align(element, [PositionExtras.CC, PositionExtras.CC]);
            }

            /*
            getConstrainedXY: function(x, y, element) {
                // TODO: Element support
                var container = this._getRegion(element, true),
                    offsetHeight = this._posEl.get(OFFSET_HEIGHT),
                    offsetWidth = this._posEl.get(OFFSET_WIDTH);

                return [this._constrain(x, offsetWidth, container.width, container.scrollLeft), 
                        this._constrain(y, offsetHeight, container.height, container.scrollTop)];
            },

            _constrainOnMove: function (type, e) {
                // TODO: How to modify?
                var pos = e.newVal;
                return this.getConstrainedXY(pos[0], pos[1]);
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

            /*
            _onConstrainChange : function(e) {
                this._uiSetConstrained(e.newVal);
            },

            _onCenteredChange : function(e) {
                this._uiSetCentered(e.newVal);
            },
            */

            /*
            _uiSetConstrained: function (val) {
                if (val) {
                    var listeners = {};

                    listeners[XY] = {fn:Y.bind(this._constrainOnMove, this), when:"before"};
                    listeners[Visible] = {fn:Y.bind(this._primeFromDOM, this), when:"before"};

                    this.attachListeners(CONSTRAIN, listeners);
                } else {
                    this.detachListeners(CONSTRAIN);
                }
            },
            */

            /*
            _uiSetCentered: function (val) {

                if (val) {
                    var node = (val === true) ? null : Y.Node.get(val);
                    this.center(node);

                    var listeners = {},
                        center = Y.bind(this.center, this, val);

                    // listeners[WindowResize] = listeners[WindowScroll] = listeners[Visible] = center;
                    // listeners[Visible] = {fn:center, when:"before"};
                    this.attachListeners(CENTER, listeners);
                } else {
                    this.detachListeners(CENTER);
                }
            },
            */
        };

        Y.WidgetPositionExtras = PositionExtras;

        // TODO: If plugin
        // Y.extend(PositionExtras, Y.Base, proto);

    }, "3.0.0");
