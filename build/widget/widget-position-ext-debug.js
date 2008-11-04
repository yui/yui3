YUI.add('widget-position-ext', function(Y) {

        var L = Y.Lang,
            ALIGN = "align",

            BINDUI = "bindUI",
            SYNCUI = "syncUI",

            OFFSET_WIDTH = "offsetWidth",
            OFFSET_HEIGHT = "offsetHeight",
            VIEWPORT_REGION = "viewportRegion",

            AlignChange = "alignChange";

        function PositionExt(config) {
            Y.after(this._syncUIPosExtras, this, SYNCUI);
            Y.after(this._bindUIPosExtras, this, BINDUI);
        }

        PositionExt.ATTRS = {

            align: {
                value:null
            },

            center: {
                set: function(val) {
                    return this._setAlignCenter(val);
                },
                value:false
            }
        };

        PositionExt.TL = "tl";
        PositionExt.TR = "tr";
        PositionExt.BL = "bl";
        PositionExt.BR = "br";
        PositionExt.CT = "ct";
        PositionExt.CR = "cr";
        PositionExt.CB = "cb";
        PositionExt.CL = "cl";
        PositionExt.CC = "cc";

        PositionExt.prototype = {

            _syncUIPosExtras : function() {
                this._uiSetAlign(this.get(ALIGN));
            },

            _bindUIPosExtras : function() {
                this.after(AlignChange, this._onAlignChange);
            },

            _setAlignCenter : function(val) {
                if (val) {
                    this.set(ALIGN, {
                        node: val === true ? null : val,
                        points: [PositionExt.CC, PositionExt.CC]
                    });
                }
                return val;
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

                var nodeRegion, widgetPoint, nodePoint, xy;

                if (!node) {
                    nodeRegion = this._posNode.get(VIEWPORT_REGION);
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
                    widgetPoint = points[0];
                    nodePoint = points[1];

                    // TODO: Optimize KWeight - Would lookup table help?
                    switch (nodePoint) {
                        case PositionExt.TL:
                            xy = [nodeRegion.left, nodeRegion.top];
                            break;
                        case PositionExt.TR:
                            xy = [nodeRegion.right, nodeRegion.top];
                            break;
                        case PositionExt.BL:
                            xy = [nodeRegion.left, nodeRegion.bottom];
                            break;
                        case PositionExt.BR:
                            xy = [nodeRegion.right, nodeRegion.bottom];
                            break;
                        case PositionExt.CT:
                            xy = [nodeRegion.left + Math.floor(nodeRegion.width/2), nodeRegion.top];
                            break;
                        case PositionExt.CB:
                            xy = [nodeRegion.left + Math.floor(nodeRegion.width/2), nodeRegion.bottom];
                            break;
                        case PositionExt.CL:
                            xy = [nodeRegion.left, nodeRegion.top + Math.floor(nodeRegion.height/2)];
                            break;
                        case PositionExt.CR:
                            xy = [nodeRegion.right, nodeRegion.top + Math.floor(nodeRegion.height/2), widgetPoint];
                            break;
                        case PositionExt.CC:
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
                var widgetNode = this._posNode,
                    xy;

                switch (widgetPoint) {
                    case PositionExt.TL:
                        xy = [x, y];
                        break;
                    case PositionExt.TR:
                        xy = [x - widgetNode.get(OFFSET_WIDTH), y];
                        break;
                    case PositionExt.BL:
                        xy = [x, y - widgetNode.get(OFFSET_HEIGHT)];
                        break;
                    case PositionExt.BR:
                        xy = [x - widgetNode.get(OFFSET_WIDTH), y - widgetNode.get(OFFSET_HEIGHT)];
                        break;
                    case PositionExt.CT:
                        xy = [x - (widgetNode.get(OFFSET_WIDTH)/2), y];
                        break;
                    case PositionExt.CB:
                        xy = [x - (widgetNode.get(OFFSET_WIDTH)/2), y - widgetNode.get(OFFSET_HEIGHT)];
                        break;
                    case PositionExt.CL:
                        xy = [x, y - (widgetNode.get(OFFSET_HEIGHT)/2)];
                        break;
                    case PositionExt.CR:
                        xy = [(x - widgetNode.get(OFFSET_WIDTH)), y - (widgetNode.get(OFFSET_HEIGHT)/2)];
                        break;
                    case PositionExt.CC:
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
                this.align(element, [PositionExt.CC, PositionExt.CC]);
            }
        };

        Y.WidgetPositionExt = PositionExt;



}, '@VERSION@' ,{requires:['widget', 'widget-position']});
