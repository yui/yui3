YUI.add('axis-tests', function(Y) {
    Y.MockPath = function(owner) {
        this.owner = owner;
        this.owner.drawingMethodString = "";
        this.currentMethod = "";
        this._attrs = {};
    };
    Y.MockPath.prototype = {
        set: function(attr, val) {
            this._attrs[attr] = val;
        },
        get: function(attr) {
            return this._attrs[attr];  
        },
        clear: function() {
            this.owner.drawingMethodString = "";
            this.currentMethod = "";
        },
        lineTo: function() {
            if(this.currentMethod != " l") {
                this.currentMethod = " l";
                this.owner.drawingMethodString += " l";
            }
            this.owner.drawingMethodString += arguments.toString();
        },
        moveTo: function() {
            if(this.currentMethod != " m") {
                this.currentMethod = " m";
                this.owner.drawingMethodString += " m";
            }
            this.owner.drawingMethodString += arguments.toString();
        },
        end: function() {
            this.owner.drawingMethodString += "z";
        }
    };
    Y.MockWriterAttr = function(owner) {
        this.owner = owner;    
    };
    Y.MockWriterAttr.prototype = {
        set: function(attr, val) {
            this.owner._bucket[attr] = val;
        },
        setStyle: function(attr, val) {
            this.owner._bucket[attr] = val;
        },
        render: function(val) {
            this.owner._bucket.render = val;
        },
        _redraw: function() {},
        append: function(val) {
            if(!this.owner._bucket.children) {
                this.owner._bucket.children = [];
            }
            this.owner._bucket.children.push(val);
        }
    };
    Y.MockGraphic = Y.Base.create("mockGrapic", Y.MockWriterAttr, [], {
        addShape: function(val) {
            if(!this.owner._bucket.shapes) {
                this.owner._bucket.shapes = [];
            }
            this.owner._bucket.shapes.push(val);
            return new Y.MockPath(this.owner);
        },

        destroy: function() {
            this.owner._mockGraphic = null;
        }
    });
    Y.MockNode = Y.Base.create("mockNode", Y.MockWriterAttr, [], {
        get: function(name) {
            return this["_" + name];
        },

        set: function(name, val) {
            this["_" + name] = val;
        },

        getDOMNode: function() {
            return this;
        },

        append: function(val) {
            if(!this._children) {
                this._children = [];
            }
            this._children.push(val);
            Y.MockNode.superclass.append.apply(this, [val]);
        },
        removeChild: function(val) {
            var indexOf,
                children = this._children,
                bucketChildren;
                
            if(children) {
                indexOf = Y.Array.indexOf(children, val);
                if(indexOf > -1) {
                    children.splice(indexOf, 0);
                }
            }
            if(this.owner && this.owner._bucket && this.owner._bucket.children) {
                bucketChildren =  this.owner._bucket.children;
                indexOf = Y.Array.indexOf(bucketChildren, val);
                if(indexOf > -1) {
                    bucketChildren.splice(indexOf, 0);
                }
            }
        }
    });
    Y.MockAxisWithBucket = Y.Base.create("mockAxisWithBucket", Y.Axis, [], {
        init: function() {
            this._bucket = {};
            this._mockWriter = new Y.MockWriterAttr(this);
            this._mockGraphic = new Y.MockGraphic(this);
            Y.MockAxisWithBucket.superclass.init.apply(this, arguments);
        },

        _drawAxis: function() {
            this._bucket._drawAxis = true;
        },

        _getLabel: function() {
            return {};
        },

        _getLabelByIndex: function(i, len, direction) {
            return direction + "_" + i;
        },

        _rotate: function() {
            //dummy method
        },

        _setTitle: function() {
        }
    }, { 
       ATTRS: {
            labelFunction: {
                lazyAdd: true,

                readOnly: true,

                getter: function() {
                    return function(val) {
                        return val;
                    };
                }
            },

            boundingBox: {
                lazyAdd: true,

                readOnly: true,

                getter: function() {
                    return this._mockWriter;
                }
            },

            contentBox: {
                lazyAdd: true,

                readOnly: true,

                getter: function() {
                    if(!this._mockContentBox) {
                        this._mockContentBox = new Y.MockNode(this);
                    }
                    return this._mockContentBox;
                }
            },

            graphic: {
                readOnly: true,
                getter: function() {
                    return this._mockGraphic;
                }
            },

            shape: {
                readOnly: true,

                getter: function() {
                    return this._mockWriter;
                }
            },

            calculatedWidth: {
                setter: function(val) {
                    this._bucket.calculatedWidth = val;
                }
            },

            calculatedHeight: {
                setter: function(val) {
                    this._bucket.calculatedHeight = val;
                }
            }
        }
    });
    
    //Use to unit test positionTitle and positionLabel methods
    Y.MockRotateMethodAxis = Y.Base.create("mockRotateMethodAxis", Y.Axis, [], {
        //Mock the _rotate method to write values in to public variables. 
        _rotate: function(label, props) {
            this.positionLabelProps = props;
        }
    });

    Y.MockAttr = function(cfg) {
        this._attrs = {};    
    };
    Y.MockAttr.prototype = {
        set: function(val) {
            this._attrs[val] = val;
            return val;
        },

        get: function(val) {
            return this._attrs[val];
        }

    };
    
    Y.MockShape = Y.Base.create("mockShape", Y.MockAttr, [], {

    });

    Y.AxisTest = function() {
        Y.AxisTest.superclass.constructor.apply(this, arguments);
    };
    Y.extend(Y.AxisTest, Y.ChartTestTemplate, {
        dataValues: [
            {date: "01/01/2009", open: 90.27, close: 170.27},
            {date: "01/02/2009", open: 91.55, close: 8.55},
            {date: "01/03/2009", open: 337.55, close: 400.55},
            {date: "01/04/2009", open: 220.27, close: 205.27},
            {date: "01/05/2009", open: 276.72, close: 239.72},
            {date: "01/06/2009", open: 85.27, close: 167.27},
            {date: "01/07/2009", open: 180.29, close: 179.29},
            {date: "01/08/2009", open: 216.21, close: 133.21},
            {date: "01/09/2009", open: 292.35, close: 304.35},
            {date: "01/10/2009", open: 80.23, close: 30.23},
            {date: "01/11/2009", open: 60.42, close: 97.42},
            {date: "01/12/2009", open: 303.55, close: 265.55},
            {date: "01/13/2009", open: 47.48, close: 71.48},
            {date: "01/14/2009", open: 327.64, close: 256.64},
            {date: "01/15/2009", open: 124.13, close: 61.13},
            {date: "01/16/2009", open: 58.21, close: 106.21},
            {date: "01/17/2009", open: 85.55, close: 151.55},
            {date: "01/18/2009", open: 277.76, close: 268.76},
            {date: "01/19/2009", open: 263.3, close: 270.3},
            {date: "01/20/2009", open: 196.88, close: 147.88},
            {date: "01/21/2009", open: 198.91, close: 211.91},
            {date: "01/22/2009", open: 229.28, close: 176.28}
        ],

        keys: ["open", "close"],
       
        _defaultMargins: {
            left: {
                top: 0,
                left: 0,
                right: 4,
                bottom: 0
            },
            right: {
                top: 0,
                left: 4,
                right: 0,
                bottom: 0
            },
            top: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 4
            },
            bottom: {
                top: 4,
                left: 0,
                right: 0,
                bottom: 0
            }
        },

        _layouts: {
            left: Y.LeftAxisLayout,
            top: Y.TopAxisLayout,
            right: Y.RightAxisLayout,
            bottom: Y.BottomAxisLayout
        },

        _tickOffsets: {
            left: function(display, length) {
                var offset = {
                    topTickOffset: 0,
                    bottomTickOffset: 0,
                    rightTickOffset: 0,
                    leftTickOffset: 0
                };
                switch(display)
                {
                    case "inside" :
                        offset.rightTickOffset =  length;
                    break;
                    case "outside" :
                        offset.leftTickOffset =  length;
                    break;
                    case "cross":
                        offset.rightTickOffset = length/2;
                        offset.leftTickOffset =  length/2;
                    break;
                }
                return offset;
            },
            right: function(display, length) {
                var offset = {
                    topTickOffset: 0,
                    bottomTickOffset: 0,
                    rightTickOffset: 0,
                    leftTickOffset: 0
                };
                switch(display)
                {
                    case "inside" :
                        offset.leftTickOffset = length;
                    break;
                    case "outside" :
                        offset.rightTickOffset = length;
                    break;
                    case "cross" : 
                        offset.rightTickOffset = length/2;
                        offset.leftTickOffset = length/2;
                    break;
                }
                return offset;
            },
            top: function(display, length) {
                var offset = {
                    topTickOffset: 0,
                    bottomTickOffset: 0,
                    rightTickOffset: 0,
                    leftTickOffset: 0
                };
                switch(display)
                {
                    case "inside" :
                        offset.bottomTickOffset = length;
                    break;
                    case "outside" :
                        offset.topTickOffset = length;
                    break;
                    case "cross" :
                        offset.bottomTickOffset = length/2;
                        offset.topTickOffset = length/2;
                    break;
                }
                return offset;
            },
            bottom: function(display, length) {
                var offset = {
                    topTickOffset: 0,
                    bottomTickOffset: 0,
                    rightTickOffset: 0,
                    leftTickOffset: 0
                };
                switch(display)
                {
                    case "inside" :
                        offset.topTickOffset = length;
                    break;
                    case "outside" :
                        offset.bottomTickOffset = length;
                    break;
                    case "cross" :
                        offset.bottomTickOffset = length/2;
                        offset.topTickOffset = length/2;
                    break;
                }
                return offset;
            }
        },

        _transformOrigins: {
            left: function(rot) {
                var transformOrigin;
                if(rot === 0)
                {
                    transformOrigin = "0,0";
                }
                else if(rot === 90)
                {
                    transformOrigin = "0.5,0";
                }
                else if(rot === -90)
                {
                    transformOrigin = "0.5,1";
                }
                else
                {
                    transformOrigin = "1,0.5";
                }
                return transformOrigin;
            },
            top: function(rot) {
                var transformOrigin;
                if(rot === 0)
                {
                    transformOrigin = "0,0";
                }
                else
                {
                    if(rot === 90)
                    {
                        transformOrigin = "1,0.5";
                    }
                    else if (rot === -90)
                    {
                        transformOrigin = "0,0.5";
                    }
                    else if(rot > 0)
                    {
                        transformOrigin = "1,0.5";
                    }
                    else
                    {
                        transformOrigin = "0,0.5";
                    }
                }
                return transformOrigin;
            },
            right: function(rot) {
                var transformOrigin;
                if(rot === 0)
                {
                    transformOrigin = "0,0";
                }
                else if(rot === 90)
                {
                    transformOrigin = "0.5,1";
                }
                else if(rot === -90)
                {
                    transformOrigin = "0.5,0";
                }
                else
                {
                    transformOrigin = "0,0.5";
                }
                return transformOrigin;
            },
            bottom: function(rot) {
                var transformOrigin;
                if(rot > 0)
                {
                    transformOrigin = "0,0.5";
                }
                else if(rot < 0)
                {
                    transformOrigin = "1,0.5";
                }
                else
                {
                    transformOrigin = "0,0";
                }
                return transformOrigin;
            }
        },

        _lineStarts: {
            left: function(padding, tickLength, display) {
                var pt = {x:padding.left, y:0};
                if(display === "outside")
                {
                    pt.x += tickLength;
                }
                else if(display === "cross")
                {
                    pt.x += tickLength/2;
                }
                return pt;
            },
            top: function(padding, tickLength, display) {
                var pt = {x:0, y:padding.top};
                if(display === "outside")
                {
                    pt.y += tickLength;
                }
                else if(display === "cross")
                {
                    pt.y += tickLength/2;
                }
                return pt;
            },
            right: function(padding, tickLength, display) {
                var pt = {x:padding.left, y:padding.top};
                if(display === "inside")
                {
                    pt.x += tickLength;
                }
                else if(display === "cross")
                {
                    pt.x += tickLength/2;
                }
                return pt;
            },
            bottom: function(padding, tickLength, display) {
                var pt = {x:0, y:padding.top};
                if(display === "inside")
                {
                    pt.y += tickLength;
                }
                else if(display === "cross")
                {
                    pt.y += tickLength/2;
                }
                return pt;
            }
        },
                
        _labelPoints: {
            left: function(point, tickOffset) {
                return {x:point.x - tickOffset, y:point.y};
            },
            top: function(point, tickOffset) {
                return {x:point.x, y:point.y - tickOffset};
            },
            right: function(point, tickOffset) {
                return {x:point.x + tickOffset, y:point.y};
            },
            bottom: function(point, tickOffset) {
                return {x:point.x, y:point.y + tickOffset};
            }
        },

        _getMaxLabelSize: function(props, position, labelWidth, labelHeight, maxLabelSize) {
            var direction = position === "left" || position === "right" ? "vertical" : "horizontal",
                rot = props.rot,
                absRot = props.absRot,
                sinRadians = props.sinRadians,
                cosRadians = props.cosRadians,
                max;
            if(direction === "horizontal") {
                if(rot === 0) {
                    max = labelHeight;
                } else if(absRot === 90) {
                    max = labelWidth;
                } else {
                    max = (sinRadians * labelWidth) + (cosRadians * labelHeight);
                }
            } else {
                if(rot === 0) {
                    max = labelWidth;
                } else if(absRot === 90) {
                    max = labelHeight;
                } else {
                    max = (cosRadians * labelWidth) + (sinRadians * labelHeight);
                }
            }
            return Math.max(maxLabelSize, max);
        },
        
        _getRotationProps: function(rotation) {
            var rot =  Math.min(90, Math.max(-90, rotation)),
                absRot = Math.abs(rot),
                radCon = Math.PI/180,
                sinRadians = parseFloat(parseFloat(Math.sin(absRot * radCon)).toFixed(8)),
                cosRadians = parseFloat(parseFloat(Math.cos(absRot * radCon)).toFixed(8));
            return {
                rot: rot,
                absRot: absRot,
                radCon: radCon,
                sinRadians: sinRadians,
                cosRadians: cosRadians
            };
        },

        _getTickStartAndEndPoints: function(pt, tickLength, padding) {
            var points,
                position = this.position,
                direction = position === "left" || position === "right" ? "vertical" : "horizontal";
            if(direction === "vertical") {
                points = {
                    start: {x:padding.left, y:pt.y},
                    end: {x:tickLength + padding.left, y:pt.y}
                };
            } else {
                points = {
                    start: {x:pt.x, y:padding.top},
                    end: {x:pt.x, y:tickLength + padding.top}
                };
            }
            return points;
        },

        //
        // Creates the test values to compare to the results of the Layout classes' positionTitle method
        //
        // @method _getTitleRotationProps
        // @param {Object} props Rotation properties for the axis.
        // @bounds {Object} The left, top, right and bottom bounds of a title.
        // @mockAxisWidth {Number} The width of the axis.
        // @mockAxisHeight {Number} The height of the axis.
        // @labelWidth {Number} The width of the label
        // @labelHeight {Number} The height of the label
        // @margin {Object} The top, right, bottom and left margin of the title
        // @return Object
        //
        _getTitleRotationProps: function(
            props, 
            bounds, 
            mockAxisWidth,
            mockAxisHeight,
            labelWidth, 
            labelHeight, 
            margin
        ) {
            switch(this.position) {
                case "left" :
                    bounds.width = bounds.right - bounds.left;
                    props.x = (labelWidth * -0.5) + (bounds.width * 0.5);
                    props.y = (mockAxisHeight * 0.5) - (labelHeight * 0.5);
                    if(margin && margin.left)
                    {
                        props.x += margin.left;
                    }
                break;
                case "top" :
                    bounds.height = bounds.bottom - bounds.top;
                    props.x = (mockAxisWidth * 0.5) - (labelWidth * 0.5);
                    props.y = bounds.height/2 - labelHeight/2;
                    if(margin && margin.top)
                    {
                        props.y += margin.top;
                    }
                break;
                case "right" :
                    bounds.width = bounds.right - bounds.left,
                    props.x = mockAxisWidth - (labelWidth * 0.5) - (bounds.width * 0.5),
                    props.y = (mockAxisHeight * 0.5) - (labelHeight * 0.5);
                    if(margin && margin.right)
                    {
                        props.x -= margin.left;
                    }
                break;
                case "bottom" :
                    bounds.height = bounds.bottom - bounds.top,
                    props.x = (mockAxisWidth * 0.5) - (labelWidth * 0.5),
                    props.y = mockAxisHeight - labelHeight/2 - bounds.height/2;
                    if(margin && margin.bottom)
                    {
                        props.y -= margin.bottom;
                    }
                break;
            }
            props.transformOrigin = ([0.5, 0.5]).toString();
            props.labelWidth = labelWidth;
            props.labelHeight = labelHeight;
            return props;
        },

        _getPositionLabelProps: function(labelWidth, labelHeight, pt, tickOffset, props, maxLabelSize, totalTitleSize, margin) {
            var leftOffset,
                topOffset,
                rot = props.rot,
                absRot = props.absRot;
            switch(this.position) {
                case "left" :
                    leftOffset = pt.x + totalTitleSize - tickOffset;
                    topOffset = pt.y;
                    if(rot === 0) {
                        leftOffset -= labelWidth;
                        topOffset -= labelHeight * 0.5;
                    } else if(rot === 90) {
                        leftOffset -= labelWidth * 0.5;
                    } else if(rot === -90) {
                        leftOffset -= labelWidth * 0.5;
                        topOffset -= labelHeight;
                    } else {
                        leftOffset -= labelWidth + (labelHeight * absRot/360);
                        topOffset -= labelHeight * 0.5;
                    }
                    leftOffset = leftOffset + maxLabelSize;
                    props.x = Math.round(leftOffset);
                    props.y = Math.round(topOffset);
                break;
                case "top" :
                    leftOffset = pt.x;
                    topOffset = pt.y + totalTitleSize + maxLabelSize;
                    if(rot === 0) {
                        leftOffset -= labelWidth * 0.5;
                        topOffset -= labelHeight;
                    } else {
                        if(rot === 90) {
                            leftOffset -= labelWidth;
                            topOffset -= (labelHeight * 0.5);
                        } else if (rot === -90) {
                            topOffset -= (labelHeight * 0.5);
                        } else if(rot > 0) {
                            leftOffset -= labelWidth;
                            topOffset -= labelHeight - (labelHeight * rot/180);
                        } else {
                            topOffset -= labelHeight - (labelHeight * absRot/180);
                        }
                    }
                    props.x = Math.round(leftOffset);
                    props.y = Math.round(topOffset);
                break;
                case "right" :
                    leftOffset = pt.x;
                    topOffset = pt.y;
                    if(rot === 0){
                        topOffset -= labelHeight * 0.5;
                    } else if(rot === 90) {
                        leftOffset -= labelWidth * 0.5;
                        topOffset -= labelHeight;
                    } else if(rot === -90) {
                        leftOffset -= labelWidth * 0.5;
                    } else {
                        topOffset -= labelHeight * 0.5;
                        leftOffset += labelHeight/2 * absRot/90;
                    }
                    if(margin && margin.left) {
                        leftOffset = leftOffset + margin.left;
                    }
                    leftOffset += tickOffset;
                    props.x = Math.round(leftOffset);
                    props.y = Math.round(topOffset);
                break;
                case "bottom" :
                    leftOffset = Math.round(pt.x);
                    topOffset = Math.round(pt.y);
                    if(rot > 0)
                    {
                        topOffset -= labelHeight/2 * rot/90;
                    }
                    else if(rot < 0)
                    {
                        leftOffset -= labelWidth;
                        topOffset -= labelHeight/2 * absRot/90;
                    }
                    else
                    {
                        leftOffset -= labelWidth * 0.5;
                    }
                    if(margin && margin.top) {
                        topOffset = topOffset + margin.top;
                    }
                    topOffset += tickOffset;
                    props.x = leftOffset;
                    props.y = topOffset;
                break;
            }
            props.labelWidth = labelWidth;
            props.labelHeight = labelHeight;
            return props;
        },
   
        //
        // Calculates the coordinates for the label based on rotation and label dimensions. Used to test the layout's 
        // _setRotationCoords method.
        //
        // @method _getRotationCoords
        // @param {Object} props Rotations properties
        // @param {Number} labelWidth Width of the label
        // @param {Number} labelHeight Height of the label
        // @return Object
        // 
        _getRotationCoords: function(props, labelWidth, labelHeight) {                    
            var rot = props.rot,
                absRot = props.absRot,
                leftOffset,
                topOffset;
            switch(this.position) {
                case "left" :
                    if(rot === 0) {
                        leftOffset = labelWidth;
                        topOffset = labelHeight * 0.5;
                    }
                    else if(rot === 90) {
                        topOffset = 0;
                        leftOffset = labelWidth * 0.5;
                    }
                    else if(rot === -90) {
                        leftOffset = labelWidth * 0.5;
                        topOffset = labelHeight;
                    } else {
                        leftOffset = labelWidth + (labelHeight * absRot/360);
                        topOffset = labelHeight * 0.5;
                    }
                    props.x -= leftOffset;
                    props.y -= topOffset;
                break;
                case "top" :
                    if(rot === 0) {
                        leftOffset = labelWidth * 0.5;
                        topOffset = labelHeight;
                    } else {
                        if(rot === 90) {
                            leftOffset = labelWidth;
                            topOffset = (labelHeight * 0.5);
                        } else if (rot === -90) {
                            topOffset = (labelHeight * 0.5);
                        } else if(rot > 0) {
                            leftOffset = labelWidth;
                            topOffset = labelHeight - (labelHeight * rot/180);
                        } else {
                            topOffset = labelHeight - (labelHeight * absRot/180);
                        }
                    }
                    props.x -= leftOffset;
                    props.y -= topOffset;
                break;
                case "right" :
                    leftOffset = 0;
                    topOffset = 0;
                    if(rot === 0) {
                        topOffset = labelHeight * 0.5;
                    }
                    else if(rot === 90) {
                        leftOffset = labelWidth * 0.5;
                        topOffset = labelHeight;
                    } else if(rot === -90) {
                        leftOffset = labelWidth * 0.5;
                    }
                    else {
                        topOffset = labelHeight * 0.5;
                        leftOffset = labelHeight/2 * absRot/90;
                    }
                    props.x -= leftOffset;
                    props.y -= topOffset;
                break;
                case "bottom" :
                    if(rot > 0) {
                        leftOffset = 0;
                        topOffset = labelHeight/2 * rot/90;
                    } else if(rot < 0) {
                        leftOffset = labelWidth;
                        topOffset = labelHeight/2 * absRot/90;
                    } else {
                        leftOffset = labelWidth * 0.5;
                        topOffset = 0;
                    }
                    props.x -= leftOffset;
                    props.y -= topOffset;
                break;
            }
        },

        //
        // Returns an values for calculated size and position of a label. Used to test the layout method setCalculatedSize.
        //
        // @method _getCalculatedSize
        // @param {Number} tickOffset The length of the tick offset
        // @param {Object} margin Margins for the label
        // @param {Number} maxLabelSize Largest size for an axis label
        // @param {Number} totalTitleSize The total dimensions used by an axis title
        // @param {Number} explicitSize The size of the axis if explicitly set
        // @return Object
        //
        _getCalculatedSize: function(tickOffset, margin, maxLabelSize, totalTitleSize, explicitSize) {
            var ttl,
                props = {},
                totalLabelSize;
            switch(this.position) {
                case "left" :
                    ttl = Math.round(totalTitleSize + tickOffset + maxLabelSize + margin.right);
                    if(explicitSize) {
                        ttl = explicitSize;
                    }
                    props.calculatedWidth = ttl;
                    props.x = ttl - tickOffset;
                break;
                case "top" :
                    totalLabelSize = margin.bottom + maxLabelSize,
                    ttl = Math.round(tickOffset + totalLabelSize + totalTitleSize);
                    if(explicitSize){
                       ttl = explicitSize;
                    }
                    props.calculatedHeight = ttl;
                    props.y = ttl - tickOffset;
                break;
                case "right" :
                    ttl = Math.round(tickOffset + maxLabelSize + totalTitleSize + margin.left);
                    if(explicitSize) {
                        ttl = explicitSize;
                    }
                    props.calculatedWidth = ttl;
                break;
                case "bottom" :
                    ttl = Math.round(tickOffset + maxLabelSize + margin.top + totalTitleSize);
                    if(explicitSize) {
                        ttl = explicitSize;
                    }
                    props.calculatedHeight = ttl;
                break;
            }
            return props;
        },
        
        _getLabelRotationStyles: function(x, y, rot, labelWidth, labelHeight, textAlpha) {
            var matrix = new Y.Matrix(),
                ydom = Y.DOM,
                label = {
                    style: {}
                },
                filterString,
                transformOrigin = (this._transformOrigins[this.position](rot)).split(","),
                offsetRect;
                
            if(document.createElementNS)
            {
                matrix.translate(x, y);
                matrix.rotate(rot);
                ydom.setStyle(label, "transformOrigin", (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%");
                ydom.setStyle(label, "transform", matrix.toCSSText());
            }
            else
            {
                if(Y.Lang.isNumber(textAlpha) && textAlpha < 1 && textAlpha > -1 && !isNaN(textAlpha))
                {
                    filterString = "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + Math.round(textAlpha * 100) + ")";
                }
                if(rot !== 0)
                {
                    //ms filters kind of, sort of uses a transformOrigin of 0, 0.
                    //we'll translate the difference to create a true 0, 0 origin.
                    matrix.rotate(rot);
                    offsetRect = matrix.getContentRect(labelWidth, labelHeight);
                    matrix.init();
                    matrix.translate(offsetRect.left, offsetRect.top);
                    matrix.translate(x, y);
                    this._simulateRotateWithTransformOrigin(matrix, rot, transformOrigin, labelWidth, labelHeight);
                    if(filterString)
                    {
                        filterString += " ";
                    }
                    else
                    {
                        filterString = "";
                    }
                    filterString += matrix.toFilterText();
                    ydom.setStyle(label, "left", matrix.dx + "px");
                    ydom.setStyle(label, "top", matrix.dy + "px");
                }
                else
                {
                    ydom.setStyle(label, "left", x + "px");
                    ydom.setStyle(label, "top", y + "px");
                }
                if(filterString)
                {
                    ydom.setStyle(label, "filter", filterString);
                }
            }
            return label;
        },

        _simulateRotateWithTransformOrigin: function(matrix, rot, transformOrigin, w, h)
        {
            var transformX = transformOrigin[0] * w,
                transformY = transformOrigin[1] * h;
            transformX = !isNaN(transformX) ? transformX : 0;
            transformY = !isNaN(transformY) ? transformY : 0;
            matrix.translate(transformX, transformY);
            matrix.rotate(rot);
            matrix.translate(-transformX, -transformY);
        },
    
        _getPoints: function(startPoint, len, edgeOffset, majorUnitDistance, direction, padding)
        {
            var points = [],
                i,
                staticCoord,
                dynamicCoord,
                constantVal,
                newPoint,
                coord;
            if(direction === "vertical")
            {
                staticCoord = "x";
                dynamicCoord = "y";
                padding = padding.top;
            }
            else
            {
                staticCoord = "y";
                dynamicCoord = "x";
                padding = padding.left;
            }
            constantVal = startPoint[staticCoord];
            coord = edgeOffset + padding;
            for(i = 0; i < len; i = i + 1)
            {
                newPoint = {};
                newPoint[staticCoord] = constantVal;
                newPoint[dynamicCoord] = coord;
                points.push(newPoint);
                coord = coord + majorUnitDistance;
            }
            return points;
        },
        
        setUp: function() {
            var position = this.position,
                cfg = {
                    dataProvider: this.dataValue,
                    keys: this.keys,
                    position: position
                };
            if(position === "right" || position === "left") {
                cfg.height = this.height;
            } else {
                cfg.width = this.width;
            }
            this.axis = new Y.Axis(cfg);
            if(position) {
                this.axisLayout = new this._layouts[position]();
            }
        },

        tearDown: function() {
            this.axis.destroy(true);
        },

        "test: Axis()" : function() {
            Y.Assert.isInstanceOf(Y.Axis, this.axis, "The axis should be and instanceof Axis.");
            Y.Assert.isNull(this.axis.get("type"), "The axis instance should be of type null.");
        },

        "test: _getDefaultMargins()" : function() {
            var defaultMargins = this._defaultMargins[this.position];
            margins = this.axisLayout._getDefaultMargins();
            for(key in defaultMargins) {
                if(defaultMargins.hasOwnProperty(key)) {
                    Y.Assert.isTrue(margins.hasOwnProperty(key), "The _defaultMargins object should have a " + key + " property.");
                    Y.Assert.areEqual(defaultMargins[key], margins[key], "The " + key + " margin should be " + defaultMargins[key] + ".");
                }
            }
        },
        
        "test: setTickOffsets()" : function() {
            var majorTicks = this.axis.get("styles").majorTicks,
                tickLength = majorTicks.length,
                tickOffsetMethod = this._tickOffsets[this.position],
                key,
                tickOffsets;
            
            this.axis.set("styles", {
                majorTicks:  {
                    display: "inside"
                }
            });
            tickOffsets = tickOffsetMethod("inside", tickLength);
            this.axisLayout.setTickOffsets.apply(this.axis);
            for(key in tickOffsets) {
                if(tickOffsets.hasOwnProperty(key)) {
                    Y.Assert.areEqual(tickOffsets[key], this.axis.get(key), "The axis attribute " + key + " should equal " + tickOffsets[key] + ".");
                }
            }
            this.axis.set("styles", {
                majorTicks:  {
                    display: "outside"
                }
            });
            tickOffsets = tickOffsetMethod("outside", tickLength);
            this.axisLayout.setTickOffsets.apply(this.axis);
            for(key in tickOffsets) {
                if(tickOffsets.hasOwnProperty(key)) {
                    Y.Assert.areEqual(tickOffsets[key], this.axis.get(key), "The axis attribute " + key + " should equal " + tickOffsets[key] + ".");
                }
            }

            this.axis.set("styles", {
                majorTicks:  {
                    display: "cross"
                }
            });
            tickOffsets = tickOffsetMethod("cross", tickLength);
            this.axisLayout.setTickOffsets.apply(this.axis);
            for(key in tickOffsets) {
                if(tickOffsets.hasOwnProperty(key)) {
                    Y.Assert.areEqual(tickOffsets[key], this.axis.get(key), "The axis attribute " + key + " should equal " + tickOffsets[key] + ".");
                }
            }

            this.axis.set("styles", {
                majorTicks:  {
                    display: "none"
                }
            });
            tickOffsets = tickOffsetMethod("none", tickLength);
            this.axisLayout.setTickOffsets.apply(this.axis);
            for(key in tickOffsets) {
                if(tickOffsets.hasOwnProperty(key)) {
                    Y.Assert.areEqual(tickOffsets[key], this.axis.get(key), "The axis attribute " + key + " should equal " + tickOffsets[key] + ".");
                }
            }
        },

        "test: drawTick()" : function() {
            var mockAxis = {
                    get: function(arg) {
                        return {
                            padding: {
                                left: 0,
                                top: 0,
                                right: 0,
                                bottom: 0
                            }
                        }
                    }
                },
                point = {
                    x: 10,
                    y: 10
                },
                tickLength = 8,
                testPoints = this._getTickStartAndEndPoints(point, tickLength, mockAxis.get());
            mockAxis.drawLine = function(path, start, end) {
                mockAxis.start = start;
                mockAxis.end = end;
            }
            this.axisLayout.drawTick.apply(mockAxis, [{}, point, {tickLength: tickLength}]);
        },

        "test: getLineStart()" : function() {
            var axis = this.axis,
                styles = this.axis.get("styles"),
                padding = styles.padding,
                majorTicks = styles.majorTicks,
                tickLength = majorTicks.length,
                getLineStart = this._lineStarts[this.position],
                testPoint,
                actualPoint,
                layout = this.axisLayout,
                display,
                displays = ["inside", "outside", "cross", "none"];

            while(displays.length > 0) {
                display = displays.shift();
                axis.set("styles", {
                   majorTicks: {
                        display:display   
                   }
                });
                testPoint = getLineStart(padding, tickLength, display);
                actualPoint = layout.getLineStart.apply(axis);
                Y.Assert.areEqual(testPoint.x, actualPoint.x, "The x coordinate for the line start should be " + testPoint.x + ".");
                Y.Assert.areEqual(testPoint.y, actualPoint.y, "The y coordinate for the line start should be " + testPoint.y + ".");
            }
        },

        "test: getLabelPoint()" : function() {
            var position = this.position,
                tickOffset = this.axis.get(position + "TickOffset"),
                getLabelPointMethod = this._labelPoints[position],
                point = {x: 10, y: 10},
                testPoint = getLabelPointMethod(point, tickOffset),
                actualPoint = this.axisLayout.getLabelPoint.apply(this.axis, [point]);
            Y.Assert.areEqual(testPoint.x, actualPoint.x, "The x coordinate for the label point should be " + testPoint.x + ".");
            Y.Assert.areEqual(testPoint.y, actualPoint.y, "The y coordinate for the label point should be " + testPoint.y + ".");
        },

        "test: _getTransformOrigin()" : function() {
            var transformOrigin,
                rotation,
                rotations = [0, 45, 90, -45, -90],
                len = 5,
                i,
                getTransformOriginMethod = this._transformOrigins[this.position];
            for(i = 0; i < len; i = i + 1) {
                rotation = rotations[i];
                transformOrigin = getTransformOriginMethod(rotation);
                Y.Assert.areEqual(
                    transformOrigin, 
                    this.axisLayout._getTransformOrigin(rotation).toString(), 
                    "The transformOrigin for a rotation of " + rotation + " should be " + transformOrigin + "."
                );
            }
        },

        "test: updateMaxLabelSize()" : function() {
            var smallLabelWidth = 80,
                labelHeight = 20,
                largeLabelWidth = 140,
                testMaxLabelSize,
                position = this.position,
                mockAxis,
                rotation,
                rotations = [0, 45, 90, -45, -90];

            while(rotations.length > 0) {
                rotation = rotations.shift();
                props = this._getRotationProps(rotation);
                mockAxis = {
                    _labelRotationProps: this._getRotationProps(rotation),
                    _maxLabelSize: 0
                };
                testMaxLabelSize = this._getMaxLabelSize(props, position, largeLabelWidth, labelHeight, mockAxis._maxLabelSize);
                this.axisLayout.updateMaxLabelSize.apply(mockAxis, [largeLabelWidth, labelHeight]);
                Y.Assert.areEqual(testMaxLabelSize, mockAxis._maxLabelSize);
            }
        },

        "test: getExplicitlySized()" : function() {
            var axis = this.axis,
                axisLayout = this.axisLayout,
                position = this.position,
                explicitSize = position === "left" || position === "right" ? "width" : "height";
            Y.Assert.isFalse(axisLayout.getExplicitlySized.apply(axis, [axis.get("styles")]), "The getExplicitlySizedMethod should return false.");
            axis.set(explicitSize, 180);
            Y.Assert.isTrue(axisLayout.getExplicitlySized.apply(axis, [axis.get("styles")]), "The getExplicitlySizedMethod should return true.");
        },
       
        "test: positionTitle()" : function() {
            var position = this.position,
                vertical = position === "left" || position === "right",
                labelWidth = 80,
                labelHeight = 20,
                wid = vertical ? 100 : 500,
                ht = vertical ? 500 : 100,
                rot = vertical ? 90 : 0,
                mockAxis = new Y.MockRotateMethodAxis({
                    width: wid, 
                    height: ht
                }),
                mockLabel = {
                  offsetWidth: labelWidth,
                  offsetHeight: labelHeight
                },
                testBounds,
                margin = mockAxis.get("styles").title.margin,
                positionLabelProps,
                key,
                testProps,
                matrix = new Y.Matrix();
            
            matrix.rotate(rot);
            mockAxis._titleBounds = matrix.getContentRect(labelWidth, labelHeight);
            testProps = this._getTitleRotationProps(
                this._getRotationProps(rot), 
                matrix.getContentRect(labelWidth, labelHeight),
                mockAxis.get("width"),
                mockAxis.get("height"),
                labelWidth, 
                labelHeight, 
                {top: 0, right: 0, bottom: 0, left: 0}
            );
            mockAxis._titleRotationProps = this._getRotationProps(rot);
            
            this.axisLayout.positionTitle.apply(mockAxis, [mockLabel]);
            positionLabelProps = mockAxis.positionLabelProps;
            positionLabelProps.transformOrigin = positionLabelProps.transformOrigin.toString();
            for(key in testProps) {
                if(testProps.hasOwnProperty(key)) {
                    Y.Assert.isTrue(positionLabelProps.hasOwnProperty(key), "The positionLabelProps should contain the property " + key + ".");
                    Y.Assert.areEqual(testProps[key], positionLabelProps[key], "The value of " + key + " should equal " + testProps[key] + ".");
                }
            }
            
            mockAxis.set("styles", {
                title: {
                    margin: {top: 4, right: 4, bottom: 4, left: 4} 
                }
            });
            testProps = this._getTitleRotationProps(
                this._getRotationProps(rot), 
                matrix.getContentRect(labelWidth, labelHeight),
                mockAxis.get("width"),
                mockAxis.get("height"),
                labelWidth, 
                labelHeight, 
                {top: 4, right: 4, bottom: 4, left: 4}
            );
            this.axisLayout.positionTitle.apply(mockAxis, [mockLabel]);
            positionLabelProps = mockAxis.positionLabelProps;
            positionLabelProps.transformOrigin = positionLabelProps.transformOrigin.toString();
            for(key in testProps) {
                if(testProps.hasOwnProperty(key)) {
                    Y.Assert.isTrue(positionLabelProps.hasOwnProperty(key), "The positionLabelProps should contain the property " + key + ".");
                    Y.Assert.areEqual(testProps[key], positionLabelProps[key], "The value of " + key + " should equal " + testProps[key] + ".");
                }
            }
        },

        "test: positionLabel()" : function() {
            var position = this.position,
                point = {},
                rotations = [90, -90, 0, 45, -45],
                rotation,
                vertical = position === "left" || position === "right",
                labelWidth = 80,
                labelHeight = 22,
                labelBounds,
                maxLabelWidth = 110,
                maxLabelHeight = 22,
                maxLabelBounds,
                maxLabelSize,
                totalTitleSize = 20,
                wid = vertical ? 100 : 500,
                ht = vertical ? 500 : 100,
                rot = vertical ? 90 : 0,
                mockAxis = new Y.MockRotateMethodAxis({
                    width: wid, 
                    height: ht
                }),
                mockLabel = {
                  offsetWidth: labelWidth,
                  offsetHeight: labelHeight
                },
                styles = mockAxis.get("styles"),
                titleMargin = 
                tickOffset = mockAxis.get(position + "TickOffset"),
                testBounds,
                margin = styles.title.margin,
                positionLabelProps,
                key,
                testProps,
                matrix = new Y.Matrix();
            if(vertical) {
                point.x = 0;
                point.y = 250;
                if(margin)
                {
                    margin.left = margin.left || 0;
                    margin.right = margin.right || 0;
                    totalTitleSize = totalTitleSize + margin.left + margin.right;
                }
            } else {
                point.x = 250;
                point.y = 0;
                if(margin)
                {
                    margin.top = margin.top || 0;
                    margin.bottom = margin.bottom || 0;
                    totalTitleSize = totalTitleSize + margin.top + margin.bottom;
                }
            }
            
            mockAxis._labelWidths = [70, 85, 80, 88, maxLabelWidth, labelWidth, 90, 80, 92, 86, 99];
            mockAxis._labelHeights = [22, 22, 22, 22, maxLabelHeight, labelHeight, 22, 22, 22, 22, 22]; 
            while(rotations.length > 0) {
                rotation = rotations.shift();
                matrix.init();
                matrix.rotate(rotation);
                testBounds = matrix.getContentRect(labelWidth, labelHeight); 
                maxLabelSize = vertical ? testBounds.right - testBounds.left : testBounds.bottom - testBounds.top;
                mockAxis._maxLabelSize = maxLabelSize;
                mockAxis._labelRotationProps = this._getRotationProps(rotation); 
                mockAxis._totalTitleSize = totalTitleSize;
                rotationProps = this._getRotationProps(rotation);
                this.axisLayout.positionLabel.apply(mockAxis, [mockLabel, point, styles, 5])
                positionLabelProps = mockAxis.positionLabelProps;
                testProps = this._getPositionLabelProps(labelWidth, labelHeight, point, tickOffset, rotationProps, maxLabelSize, totalTitleSize, margin); 
                for(key in testProps) {
                    if(testProps.hasOwnProperty(key)) {
                        Y.Assert.isTrue(positionLabelProps.hasOwnProperty(key), "The positionLabelProps should contain the property " + key + ".");
                        Y.Assert.areEqual(testProps[key], positionLabelProps[key], "The value of " + key + " should equal " + testProps[key] + ".");
                    }
                }
            }
            if(position === "right" || position === "bottom") {
                if(position === "right") {
                    margin.left = 4;
                } else {
                    margin.top = 4;
                }
                
                mockAxis.set("styles", {
                    label: {
                        margin: margin 
                    }
                });
                styles = mockAxis.get("styles");
                totalTitleSize = totalTitleSize + 4;
                mockAxis._maxLabelSize = maxLabelSize;
                mockAxis._labelRotationProps = this._getRotationProps(rotation); 
                mockAxis._totalTitleSize = totalTitleSize;
                rotationProps = this._getRotationProps(rotation);
                this.axisLayout.positionLabel.apply(mockAxis, [mockLabel, point, styles, 5])
                positionLabelProps = mockAxis.positionLabelProps;
                testProps = this._getPositionLabelProps(labelWidth, labelHeight, point, tickOffset, rotationProps, maxLabelSize, totalTitleSize, margin); 
                for(key in testProps) {
                    if(testProps.hasOwnProperty(key)) {
                        Y.Assert.isTrue(positionLabelProps.hasOwnProperty(key), "The positionLabelProps should contain the property " + key + ".");
                        Y.Assert.areEqual(testProps[key], positionLabelProps[key], "The value of " + key + " should equal " + testProps[key] + ".");
                    }
                }
            }
        },

        "test: _setRotationCoords()" : function() {
            var position = this.position,
                rotations = [90, -90, 0, 45, -45],
                rotation,
                labelWidth = 140,
                labelHeight = 22,
                key,
                props,
                testProps;
            while(rotations.length > 0) {
                rotation = rotations.shift();
                props = this._getRotationProps(rotation);
                props.labelWidth = labelWidth;
                props.labelHeight = labelHeight;
                this.axisLayout._setRotationCoords.apply(this.axis, [props]);
                testProps = this._getRotationCoords(rotation, labelWidth, labelHeight);
                for(key in testProps) {
                    if(testProps.hasOwnProperty(key)) {
                        Y.Assert.isTrue(props.hasOwnProperty(key), "The rotation coords props should have the " + key + " property.");
                        Y.Assert.areEqual(testProps[key], props[key], "The " + key + " value should equal " + testProps[key] + ".");
                    }
                }
            }
        },

        "test: setCalculatedSize()" : function() {
            var dumbdiv = document.createElement('div'),
                margin = {top: 0, right: 0, bottom: 0, left: 0},
                mockAxis = new Y.MockAxisWithBucket({
                    styles: {
                        label: {
                            margin: margin   
                        }
                    }
                }),
                axis = this.axis,
                axisLayout = this.axisLayout,
                position = this.position,
                vertical = position === "left" || position === "right",
                explicitSize = vertical ? "_explicitWidth" : "_explicitHeight",
                tickOffset = axis.get(position + "TickOffset"),
                maxLabelSize = 130,
                totalTitleSize = 22,
                explicitSize,
                bucket,
                key,
                testProps;
            mockAxis._totalTitleSize = totalTitleSize;
            mockAxis._maxLabelSize = maxLabelSize;
            axisLayout.setCalculatedSize.apply(mockAxis);
            bucket = mockAxis._bucket;
            testProps = this._getCalculatedSize(tickOffset, margin, maxLabelSize, totalTitleSize);
            
            for(key in testProps) {
                if(testProps.hasOwnProperty(key)) { 
                    Y.Assert.isTrue(bucket.hasOwnProperty(key), "The " + key + " property should exist on the mockAxis' " + bucket + ".");
                    Y.Assert.areEqual(testProps[key], bucket[key], "The " + key + " property should equal " + testProps[key] + ".");
                }
            }
            
            mockAxis[explicitSize] = 200;
            axisLayout.setCalculatedSize.apply(mockAxis);
            bucket = mockAxis._bucket;
            testProps = this._getCalculatedSize(tickOffset, margin, maxLabelSize, totalTitleSize, 200);
            
            for(key in testProps) {
                if(testProps.hasOwnProperty(key)) { 
                    Y.Assert.isTrue(bucket.hasOwnProperty(key), "The " + key + " property should exist on the mockAxis' " + bucket + ".");
                    Y.Assert.areEqual(testProps[key], bucket[key], "The " + key + " property should equal " + testProps[key] + ".");
                }
            }
        },
        
        "test: offsetNodeForTick()" : function() {
            var position = this.position,
                tickOffset,
                axisLayout = this.axisLayout,
                mockAxis = new Y.MockAxisWithBucket(),
                testOffset,
                bucket,
                style;
            if(position === "right" || position === "bottom") {
                style = position === "right" ? "left" : "top";
                axisLayout.setTickOffsets.apply(mockAxis);
                tickOffset = mockAxis.get(style + "TickOffset");
                testOffset = 0 - tickOffset;
                axisLayout.offsetNodeForTick.apply(mockAxis, [mockAxis.get("contentBox")]);
                bucket = mockAxis._bucket;
                Y.Assert.isTrue(bucket.hasOwnProperty(style), "The " + style + " + property should be set on the axis.");
                Y.Assert.areEqual(testOffset, bucket[style], "The " + style + " + property should equal " + testOffset + ".");
            }
        },

        "test: _getDefaultStyles()" : function() {
            var defaultMajorUnit = {
                    determinant: "count",
                    count: 11,
                    distance: 75
                },
                majorTicks = {
                    display:"inside",
                    length:4,
                    color:"#dad8c9",
                    weight:1,
                    alpha:1
                },
                minorTicks = {
                    display:"none",
                    length:2,
                    color:"#dad8c9",
                    weight:1
                },
                line = {
                    weight:1,
                    color:"#dad8c9",
                    alpha:1
                },
                top = "0px",
                left = "0px",
                width = "100px",
                height = "100px",
                label = {
                    color:"#808080",
                    alpha: 1,
                    fontSize:"85%",
                    rotation: 0
                },
                title = {
                    color:"#808080",
                    alpha: 1,
                    fontSize:"85%",
                    rotation: undefined
                },
                defaultMargins = {
                    top: undefined,
                    right: undefined,
                    bottom: undefined,
                    left: undefined
                },
                axisStyles = this.axis._getDefaultStyles(),
                key,
                axisMajorUnit;
           
           
            Y.Assert.isTrue(axisStyles.hasOwnProperty("majorUnit"), "The axis styles should include a majorUnit property.");
            axisMajorUnit = axisStyles.majorUnit;
            for(key in defaultMajorUnit) {
                if(defaultMajorUnit.hasOwnProperty(key)) {
                        Y.Assert.isTrue(axisMajorUnit.hasOwnProperty(key), "The default axis styles.majorUnit should contain a " + key + " property.");
                        Y.Assert.areEqual(
                        defaultMajorUnit[key], 
                        axisMajorUnit[key], 
                        "The default axis styles.majorUnit." + key + " property should be equal to the defaultMajorUnit." + key + " property."
                    ); 
                }
            }
            Y.Assert.isTrue(axisStyles.hasOwnProperty("hideOverlappingLabelTicks"), "The axis styles should include an hideOverlappingLabelTicks property.");
            Y.Assert.isFalse(axisStyles.hideOverlappingLabelTicks, "The value of styles.hideOverlappingLabelTicks should be false.");
            Y.Assert.isTrue(axisStyles.hasOwnProperty("title"), "The axis styles should include a title property."); 
            for(key in title) {
                if(title.hasOwnProperty(key)) {
                    Y.Assert.areEqual(title[key], axisStyles.title[key], "The " + key + " property of the title style should equal " + title[key] + "."); 
                }
            }
            Y.Assert.isTrue(axisStyles.hasOwnProperty("label"), "The axis styles should include a label property."); 
            for(key in label) {
                if(label.hasOwnProperty(key)) {
                    Y.Assert.areEqual(label[key], axisStyles.label[key], "The " + key + " property of the label style should equal " + label[key] + "."); 
                }
            }
            for(key in defaultMargins) {
                if(defaultMargins.hasOwnProperty(key)) {
                    Y.Assert.isUndefined(axisStyles.title.margin[key], "The " + key + " property of the title.margin style should equal " + defaultMargins[key] + ".");
                    Y.Assert.isUndefined(axisStyles.label.margin[key], "The " + key + " property of the label.margin style should equal " + defaultMargins[key] + ".");
                }
            }
            Y.Assert.isTrue(axisStyles.hasOwnProperty("top"), "The axis styles should include a top property."); 
            Y.Assert.areEqual(top, axisStyles.top, "The styles.top property should be " + top + ".");
            Y.Assert.isTrue(axisStyles.hasOwnProperty("left"), "The axis styles should include a left property."); 
            Y.Assert.areEqual(left, axisStyles.left, "The styles.left property should be " + left + ".");
            Y.Assert.isTrue(axisStyles.hasOwnProperty("width"), "The axis styles should include a width property."); 
            Y.Assert.areEqual(width, axisStyles.width, "The styles.width property should be " + width + ".");
            Y.Assert.isTrue(axisStyles.hasOwnProperty("height"), "The axis styles should include a height property."); 
            Y.Assert.areEqual(height, axisStyles.height, "The styles.height property should be " + height + ".");
            
            Y.Assert.isTrue(axisStyles.hasOwnProperty("majorTicks"), "The axis styles should include a majorTicks property."); 
            for(key in majorTicks) {
                if(majorTicks.hasOwnProperty(key)) {
                    Y.Assert.areEqual(majorTicks[key], axisStyles.majorTicks[key], "The " + key + " property of the majorTicks style should equal " + majorTicks[key] + ".");
                }
            }
            Y.Assert.isTrue(axisStyles.hasOwnProperty("minorTicks"), "The axis styles should include a minorTicks property."); 
            for(key in minorTicks) {
                if(minorTicks.hasOwnProperty(key)) {
                    Y.Assert.areEqual(minorTicks[key], axisStyles.minorTicks[key], "The " + key + " property of the minorTicks style should equal " + minorTicks[key] + ".");
                }
            }
            Y.Assert.isTrue(axisStyles.hasOwnProperty("line"), "The axis styles should include a line property."); 
            for(key in line) {
                if(line.hasOwnProperty(key)) {
                    Y.Assert.areEqual(line[key], axisStyles.line[key], "The " + key + " property of the line style should equal " + line[key] + ".");
                }
            }
        },

        "test: getLabelByIndex()" : function() {
            var position = this.position,
                index = 4,
                length = 10,
                direction = position === "left" || position === "right" ? "vertical" : "horizontal",
                mockAxis = {
                    get: function(val) {
                        return position;
                    }
                };
            mockAxis._getLabelByIndex = function() {
                mockAxis.index = arguments[0];
                mockAxis.length = arguments[1]
            };
            this.axis.getLabelByIndex.apply(mockAxis, [index, length]);
            Y.Assert.areEqual(index, mockAxis.index, "The index should equal " + index + ".");
            Y.Assert.areEqual(length, mockAxis.length, "The length should equal " + length + ".");
        },

        "test: _dataChangeHandler()" : function() {
            var mockAxis = {
                    rendered: false
                },
                axisDrawn = false;
            mockAxis._drawAxis = function() {
                axisDrawn = true;
            }
            mockAxis.get = function(val) {
                return mockAxis.rendered;  
            };

            this.axis._dataChangeHandler.apply(mockAxis);
            Y.Assert.isFalse(axisDrawn, "The axis should not draw.");
            mockAxis.rendered = true;
            this.axis._dataChangeHandler.apply(mockAxis);
            Y.Assert.isTrue(axisDrawn, "The axis should draw.");
        },

        "test: positionChangeHandler()" : function() {
            var mockAxis = {
                    graphic: "none",
                    updateHandlerCalled: false
                };
            mockAxis._updateGraphic = function(val) {
                mockAxis.graphic = val;
            };
            mockAxis._updateHandler = function() {
                mockAxis.updateHandlerCalled = true;
            };
            this.axis._positionChangeHandler.apply(mockAxis, [{newVal:"graphic"}]);
            Y.Assert.areEqual("graphic", mockAxis.graphic, "The graphic should be set.");
            Y.Assert.isTrue(mockAxis.updateHandlerCalled, "The _updateHandler method should be called.");
        },

        "test: _updateGraphic()" : function() {
            var position = this.position,
                mockGraphic = {},
                mockAxis = {};
            mockAxis._setCanvas = function() {
                mockAxis.graphic = mockGraphic;
            };
            mockAxis.get = function(val) {
                var graphic;
                if(mockAxis.graphic) {
                    graphic = mockAxis.graphic;
                }
                return graphic;
            };
            mockGraphic.destroy = function() {
               if(mockAxis.graphic) {
                   mockAxis.graphic = undefined;
               }
            };
        
            this.axis._updateGraphic.apply(mockAxis, [this.position]);
            Y.Assert.isNotUndefined(mockAxis.get("graphic"), "The axis should have a graphic instance.");
            Y.Assert.isNotNull(mockAxis.get("graphic"), "The axis should have a graphic instance.");
            
            this.axis._updateGraphic.apply(mockAxis, [this.position]);
            Y.Assert.isNotUndefined(mockAxis.get("graphic"), "The axis should have a graphic instance.");
            Y.Assert.isNotNull(mockAxis.get("graphic"), "The axis should have a graphic instance.");
            
            this.axis._updateGraphic.apply(mockAxis, ["none"]);
            Y.Assert.isUndefined(mockAxis.get("graphic"), "The Axis should not have a graphic instance.");
            
            this.axis._updateGraphic.apply(mockAxis, ["none"]);
            Y.Assert.isUndefined(mockAxis.get("graphic"), "The Axis should not have a graphic instance.");
        },
        
        "test: bindUI()" : function() {
            var axis = this.axis,
                eventListeners = [
                    "axis:dataProviderChange",
                    "axis:dataUpdate",
                    "axis:stylesChange",
                    "axis:overlapGraphChange",
                    "axis:positionChange",
                    "axis:widthChange",
                    "axis:heightChange",
                    "axis:calculatedWidthChange",
                    "axis:calculatedHeightChange"
                ],
                axisEvents,
                testEvent;
             axis.bindUI();
             axisEvents = axis._yuievt.events;
             while(eventListeners.length > 0) {
                testEvent = eventListeners.shift();
                Y.Assert.isTrue(axisEvents.hasOwnProperty(testEvent), "The " + testEvent + " should be present.");
             }
        },

        "test: _updateHandler(e)" : function() {
            var UpdateHandlerAxis = Y.Base.create("updateHandlerAxis", Y.Axis, [], {
                    _thisHasDrawn: false,

                    _drawAxis: function() {
                        this._thisHasDrawn = true;
                    }
                }, {
                    ATTRS: {
                        rendered: {
                            getter: function() {
                                return this._thisHasRendered;
                            }
                        }
                    }
                }),
                mockAxis = new UpdateHandlerAxis(),
                axis = this.axis;
            axis._updateHandler.apply(mockAxis);
            Y.Assert.isFalse(mockAxis._thisHasDrawn, "The axis should not have drawn.");
            mockAxis._thisHasRendered = true;
            axis._updateHandler.apply(mockAxis);
            Y.Assert.isTrue(mockAxis._thisHasDrawn, "The axis should have drawn.");
        },

        "test: renderUI()" : function() {
            var RenderUIAxis = Y.Base.create("renderUIAxis", Y.Axis, [], {
                    _updateGraphic: function(val) {
                        this._updateGraphicResult = val;    
                    }
                }),
                position = this.position,
                mockAxis = new RenderUIAxis({
                 position: this.position   
                });
            this.axis.renderUI.apply(mockAxis);
            Y.Assert.areEqual(position, mockAxis._updateGraphicResult, "The position of the axis should be " + position + ".");
        },

        "test: syncUI()" : function() {
            var SyncUIAxis = Y.Base.create("syncUIAxis", Y.Axis, [], {
                    _thisHasDrawn: false,

                    _drawAxis: function() {
                        this._thisHasDrawn = true;
                    }
                }),
                mockAxis = new SyncUIAxis(),
                axisLayout = this.axisLayout;
                
                this.axis.syncUI.apply(mockAxis);
                Y.Assert.isTrue(mockAxis._thisHasDrawn, "The axis should have drawn.");
                mockAxis._layout = axisLayout;
                this.axis.syncUI.apply(mockAxis);
                Y.Assert.isTrue(mockAxis._thisHasDrawn, "The axis should have drawn.");
        },

        "test: _setCanvas()" : function() {
            var position = this.position,
                vertical = position === "left" || position === "right",
                mockAxis = new Y.MockAxisWithBucket({
                    position: position
                }),
                defWidth = "400px",
                defHeight = "300px",
                parentNode = {
                    getStyle: function(val) {
                        if(val === "width") {
                            return defWidth;
                        } else {
                            return defHeight;
                        }
                    }
                },
                testBucket = {
                    position: "relative",
                    zIndex: 2,   
                    left: "0px",
                    top: "0px",
                    render: mockAxis.get("contentBox")
                },
                bucket,
                key;
            mockAxis._parentNode = parentNode;
            this.axis._setCanvas.apply(mockAxis);
            Y.Assert.isTrue(true);
            bucket = mockAxis._bucket;
            if(vertical) {
                testBucket.height = defHeight;
            } else {
                testBucket.width = defWidth;
            }
            for(key in testBucket) {
                if(testBucket.hasOwnProperty(key)) {
                    Y.Assert.isTrue(bucket.hasOwnProperty(key), "The " + key + " property should be set.");
                    Y.Assert.areEqual(testBucket[key], bucket[key], "The " + key + " property should equal " + testBucket[key] + ".");
                }
            }

            mockAxis.set("width", 200);
            mockAxis.set("height", 150);
            if(vertical) {
                testBucket.height = "150px";
            } else {
                testBucket.width = "200px";
            }
            this.axis._setCanvas.apply(mockAxis);
            for(key in testBucket) {
                if(testBucket.hasOwnProperty(key)) {
                    Y.Assert.isTrue(bucket.hasOwnProperty(key), "The " + key + " property should be set.");
                    Y.Assert.areEqual(testBucket[key], bucket[key], "The " + key + " property should equal " + testBucket[key] + ".");
                }
            }
        },

        "test: handleSizeChange(e)" : function() {
            var axis = this.axis,
                position = this.position,
                defWidth = 300,
                defHeight = 200,
                mockAxis = new Y.MockAxisWithBucket({
                    position: position,
                    width: defWidth,
                    height: defHeight
                }),
                vertical = position === "left" || position === "right",
                firstPass = vertical ? "width" : "height",
                secondPass = vertical ? "height" : "width",
                testBucket = {
                   width: defWidth,
                   height: defHeight 
                },
                bucket,
                key;
            
            axis._handleSizeChange.apply(mockAxis, [{attrName: firstPass}]);
            bucket = mockAxis._bucket;
            for(key in testBucket) {
                if(testBucket.hasOwnProperty(key)) {
                    Y.Assert.isTrue(bucket.hasOwnProperty(key), "The " + key + " property should be set.");
                    Y.Assert.areEqual(testBucket[key], bucket[key], "The " + key + " property should be equal to " + testBucket[key] + ".");
                }
            }
            testBucket._drawAxis = true;
            axis._handleSizeChange.apply(mockAxis, [{attrName: secondPass}]);
            for(key in testBucket) {
                if(testBucket.hasOwnProperty(key)) {
                    Y.Assert.isTrue(bucket.hasOwnProperty(key), "The " + key + " property should be set.");
                    Y.Assert.areEqual(testBucket[key], bucket[key], "The " + key + " property should be equal to " + testBucket[key] + ".");
                }
            }

        },

        "test: drawLine()" : function() {
            var moveTo = {},
                lineTo = {},
                path = {
                    moveTo: function(x, y) {
                        moveTo.x = x;
                        moveTo.y = y;
                    },
                    lineTo: function(x, y) {
                        lineTo.x = x;
                        lineTo.y = y;
                    }
                },
                startPoint = {
                    x: 10, 
                    y: 20
                },
                endPoint = {
                    x: 100,
                    y: 200
                },
                key;
            this.axis.drawLine(path, startPoint, endPoint);
            Y.Assert.areEqual(startPoint.x, moveTo.x, "The start x coordinate should be " + startPoint.x + ".");
            Y.Assert.areEqual(startPoint.y, moveTo.y, "The start y coordinate should be " + startPoint.y + ".");
            Y.Assert.areEqual(endPoint.x, lineTo.x, "The end x coordinate should be " + endPoint.x + ".");
            Y.Assert.areEqual(endPoint.y, lineTo.y, "The end y coordinate should be " + endPoint.y + ".");
        },

        "test: _getTextRotationProps(styles)" : function() {
            var position = this.position,
                testRotationProps,
                axisRotationProps,
                testRotation,
                setRotation = 45;
            this.axis.set("position", position);
            if(position === "left") {
                testRotation = -90;
            } else if (position === "right") {
                testRotation = 90;
            } else {
                testRotation = 0;
            }
            testRotationProps = this._getRotationProps(testRotation);
            axisRotationProps = this.axis._getTextRotationProps({});
            for(key in testRotationProps) {
                if(testRotationProps.hasOwnProperty(key)) {
                    Y.Assert.isTrue(axisRotationProps.hasOwnProperty(key), "The _getTextRotationProps should return an object that contains the " + key + " property.");
                    Y.Assert.areEqual(
                        testRotationProps[key], 
                        axisRotationProps[key], 
                        "The _getTextRotationProps methods should return an object whose " + key + "property equals " + testRotationProps[key] + "."
                    );

                }
            }

            testRotationProps = this._getRotationProps(setRotation);
            axisRotationProps = this.axis._getTextRotationProps({rotation: setRotation});
            for(key in testRotationProps) {
                if(testRotationProps.hasOwnProperty(key)) {
                    Y.Assert.isTrue(axisRotationProps.hasOwnProperty(key), "The _getTextRotationProps should return an object that contains the " + key + " property.");
                    Y.Assert.areEqual(
                        testRotationProps[key], 
                        axisRotationProps[key], 
                        "The _getTextRotationProps methods should return an object whose " + key + "property equals " + testRotationProps[key] + "."
                    );

                }
            }

        },

        "test: _drawAxis()" : function() {
            var DrawAxisMockAxis = Y.Base.create("drawAxisMockAxis", Y.Axis, [], {
                    _setTitle: function() {},

                    _getDataFromLabelValuesCalled: false,

                    _getDataFromLabelValues: function() {
                        this._getDataFromLabelValuesCalled = true;
                        return {
                            points: [],
                            values: []
                        };
                    },

                    _getLabelByIndex: function(i, len, direction) {
                        return "label_" + i;
                    }
                },
                {
                    ATTRS: {
                        labelFunction: {
                            value: function(val) {
                                return val;
                            }
                        }
                    }
                }),
                axis = this.axis,
                labelWidth = 80,
                labelHeight = 22,
                position = this.position,
                graphic = new Y.Graphic({render: document.body}),
                shapes,
                mockAxis = new DrawAxisMockAxis({
                    graphic: graphic
                }),
                mockLabel = {
                  offsetWidth: labelWidth,
                  offsetHeight: labelHeight,
                  style: {},
                  children: []
                },
                key,
                labels,
                testRotationProps,
                majorUnitCount,
                direction = position === "left" || position === "right" ? "vertical" : "horizontal",
                vertical = direction === "vertical",
                explicitSize = vertical ? "width" : "height";
            mockLabel.appendChild = function(val) {
                mockLabel.children.push(val);
            };
            mockAxis._drawing = true;
            mockAxis.set("styles", {
                label: {
                    margin: this.axisLayout._getDefaultMargins()
                }
            });
            this.axis._drawAxis.apply(mockAxis);
            Y.Assert.isTrue(mockAxis._callLater, "The call later property should be true if the axis is drawing."); 
            mockAxis._drawing = false;
            this.axis._drawAxis.apply(mockAxis);
            shapes = graphic.get("shapes");
            Y.Assert.isFalse(mockAxis._callLater, "The _callLater property should be false if the axis was not drawing when the _drawAxis method was called.");
            
            Y.Assert.areEqual(0,
                Y.Object.size(shapes), 
                "There should be 0 path instances if the _drawAxis method has not been executed with the position attribute being a value other than none."
            );
            
            mockAxis.set("position", position);
            majorUnitCount = mockAxis.getTotalMajorUnits();
            mockAxis.set("styles", {
                majorTicks: {
                    display: "none"
                }
            });
            this.axis._drawAxis.apply(mockAxis);
            shapes = graphic.get("shapes");
            labels = mockAxis.get("labels");
            testRotationProps = this._getRotationProps(mockAxis.get("styles").label.rotation);
            for(key in testRotationProps) {
                if(testRotationProps.hasOwnProperty(key)) {
                    Y.Assert.isTrue(mockAxis._labelRotationProps.hasOwnProperty(key), "The _labelRotationProps property should could contain a " + key + " value.");
                    Y.Assert.areEqual(
                        testRotationProps[key], 
                        mockAxis._labelRotationProps[key], 
                        "The _labelRotationProps." + key + " should equal " + testRotationProps[key] + "."
                    );
                }
            }
            Y.Assert.areEqual(1, Y.Object.size(shapes), "There should be 1 path instance if the majorTicks.style.position is equal to none.");
            Y.Assert.areEqual(majorUnitCount, labels.length, "The axis should have " + majorUnitCount + " labels."); 
            
            mockAxis.set("styles", {
                majorTicks: {
                    display: "inside"
                }
            });
            mockAxis.set(explicitSize, 450); 
            mockAxis.set("title", "Axis Title");
            mockAxis._layout.positionTitle = function() {
                //not testing this method here.
            };
            mockAxis._titleTextField = mockLabel;
            this.axis._drawAxis.apply(mockAxis);
            shapes = graphic.get("shapes");
            labels = mockAxis.get("labels");
            Y.Assert.areEqual(2, Y.Object.size(shapes), "There should be two path instances if the majorTicks.style.position is not equal to none.");
        
            //The mockaxis' _getDataFromLabelValues method returns an empty array after setting the bucket _getDataFromLabelValues property to true. 
            //The empty array forces the code to hit the len < 0 branch.
            mockAxis.set("labelValues", [
                "label1", 
                "label2",
                "label3",
                "label4",
                "label5",
                "label6"
            ]);
            this.axis._drawAxis.apply(mockAxis);
            Y.Assert.isTrue(mockAxis._getDataFromLabelValuesCalled, "The _getDataFromLabelValues should have been called.");
        
            mockAxis.set("labelValues", null);
            mockAxis._labelExplicitlySet = false;
            this.axis._drawAxis.apply(mockAxis);
            labels = mockAxis.get("labels");
            Y.Assert.areEqual(11, labels.length, "There should be 11 labels.");
            Y.Assert.areEqual("label_0", labels[0].innerHTML, "The value of the first label should be " + ("label_0") + ".");
            Y.Assert.areEqual("label_10", labels[labels.length-1].innerHTML, "The value of the first label should be " + ("label_10") + ".");
            
            mockAxis.set("hideFirstMajorUnit", true);
            this.axis._drawAxis.apply(mockAxis);
            labels = mockAxis.get("labels");
            Y.Assert.areEqual(10, labels.length, "There should be 10 labels.");
            Y.Assert.areEqual("label_1", labels[0].innerHTML, "The value of the first label should be " + ("label_1") + ".");
            Y.Assert.areEqual("label_10", labels[labels.length-1].innerHTML, "The value of the first label should be " + ("label_10") + ".");
        
            mockAxis.set("hideLastMajorUnit", true);
            this.axis._drawAxis.apply(mockAxis);
            labels = mockAxis.get("labels");
            Y.Assert.areEqual(9, labels.length, "There should be 9 labels.");
            Y.Assert.areEqual("label_1", labels[0].innerHTML, "The value of the first label should be " + ("label_1") + ".");
            Y.Assert.areEqual("label_9", labels[labels.length-1].innerHTML, "The value of the first label should be " + ("label_9") + ".");
        
            mockAxis.set("hideFirstMajorUnit", false);
            mockAxis.set("hideLastMajorUnit", false);
            this.axis._drawAxis.apply(mockAxis);
            labels = mockAxis.get("labels");
            Y.Assert.areEqual(11, labels.length, "There should be 11 labels.");
            Y.Assert.areEqual("label_0", labels[0].innerHTML, "The value of the first label should be " + ("label_0") + ".");
            Y.Assert.areEqual("label_10", labels[labels.length-1].innerHTML, "The value of the first label should be " + ("label_10") + ".");
        },

        "test: _setTotalTitleSize(styles)" : function() {
            var axis = this.axis,
                rotation,
                labelWidth = 80,
                labelHeight = 22,
                mockLabel = {
                  offsetWidth: labelWidth,
                  offsetHeight: labelHeight,
                  style: {},
                  childrend: []
                },
                position = this.position,
                vertical = position == "left" || position == "right",
                titleStyles,
                margin,
                matrix = new Y.Matrix(),
                bounds,
                size,
                titleBounds,
                defaultMargin = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                totalTitleSize;
            mockLabel.appendChild = function(val) {
                mockLabel.children.push(val);
            };

            if(position === "left") {
                rotation = -90;
            } else if(position === "right") {
                rotation = 90;
            } else {
                rotation = 0;
            }
            axis.set("position", position);
            axis.set("styles", {
                title: {
                    margin: defaultMargin
                }
            });
            titleStyles = axis.get("styles").title;
            margin = titleStyles.margin;
            matrix.rotate(rotation);
            bounds =  matrix.getContentRect(labelWidth, labelHeight);
            if(vertical) {
                size = bounds.right - bounds.left;
                if(margin) {
                    if(margin.left) {
                        size = size + margin.left;
                    }
                    if(margin.right) {
                        size = size + margin.right;
                    }
                }
            } else {
                size = bounds.bottom - bounds.top;
                if(margin) {
                    if(margin.top) {
                        size = size + margin.top;
                    }
                    if(margin.bottom) { 
                        size = size + margin.bottom;
                    }
                }
            }
            
            axis._titleTextField = mockLabel;
            axis.set("title", "Axis Title");
            axis._titleRotationProps = {rot: rotation}; 
            axis._setTotalTitleSize.apply(axis, [titleStyles]);
            titleBounds = axis._titleBounds;
            totalTitleSize = axis._totalTitleSize;
            for(key in bounds) {
                if(bounds.hasOwnProperty(key)) {
                    Y.Assert.isTrue(titleBounds.hasOwnProperty(key), "The _titleBounds property should have a value for " + key + ".");
                    Y.Assert.areEqual(bounds[key], titleBounds[key], "The _titleBounds." + key + " property should equal " + key + ".");
                }
            }
            Y.Assert.areEqual(size, totalTitleSize, "The _totalTitleSize property should equal " + size + ".");
        },

        "test: _setTitle()" : function() {
            var axis = this.axis,
                mockAxis = new Y.MockAxisWithBucket(),
                labelWidth = 80,
                labelHeight = 22,
                mockLabel = {
                  offsetWidth: labelWidth,
                  offsetHeight: labelHeight,
                  style: {},
                  children: []
                },
                removedChild,
                mockParent = {
                    removeChild: function(val) {
                        removedChild = val;   
                    }
                },
                testTotalTitleSize = 26,
                testRotationProps;
            mockAxis._getTextRotationProps = function() {
                //not testing _getTextRotationProps in this test
                return {};
            };
            mockAxis._setTotalTitleSize = function() {
                //not testing _setTotalSize in this test
                this._totalTitleSize = testTotalTitleSize;
            };
            mockLabel.appendChild = function(val) {
                mockLabel.children.push(val);
            };
            axis._setTitle.apply(mockAxis);
            Y.Assert.isUndefined(mockAxis._titleTextField, "The _titleTextField property should be undefined.");
            Y.Assert.isUndefined(mockAxis._totalTitleSize, "The _totalTitleSize property should be undefined."); 
           
            
            mockAxis.set("title", "Axis Title");
            axis._setTitle.apply(mockAxis);
            Y.Assert.isNotNull(mockAxis._titleTextField, "The _titleTextField property should be created.");
            Y.Assert.isNotUndefined(mockAxis._titleTextField, "The _titleTextField property should be created.");
            Y.Assert.isTrue(
                Y.Array.indexOf(mockAxis._bucket.children, mockAxis._titleTextField) > -1, 
                "The titleTextField should be appended to the contentBox."
            ); 
            
            mockAxis._titleTextField = mockLabel;
            axis._setTitle.apply(mockAxis);
            Y.Assert.areEqual(mockLabel, mockAxis._titleTextField, "The _titleTextField property should equal the title text field.");
            Y.Assert.areEqual(testTotalTitleSize, mockAxis._totalTitleSize, "The _totalTitleSize property should equal " + testTotalTitleSize + ".");
            
            mockAxis.set("title", null);
            axis._setTitle.apply(mockAxis);
            Y.Assert.isNull(mockAxis._titleTextField, "The _titleTextField property should be null.");
            Y.Assert.areEqual(0, mockAxis._totalTitleSize, "The _totalTitleSize property should be zero.");

            mockLabel.parentNode = mockParent;
            mockAxis._titleTextField = mockLabel;
            axis._setTitle.apply(mockAxis);
            Y.Assert.areEqual(removedChild, mockLabel, "The _titleTextField should be removed from the dom.");
            Y.Assert.isNull(mockAxis._titleTextField, "The _titleTextField property should be null.");
            Y.Assert.areEqual(0, mockAxis._totalTitleSize, "The _totalTitleSize property should be zero.");
        },

        "test: _rotate()" : function() {
            var axis = this.axis,
                rotations = [90, -90, 0, 45, -45],
                rotation,
                position = this.position,
                labelWidth = 80,
                labelHeight = 22,
                mockLabel = {
                  offsetWidth: labelWidth,
                  offsetHeight: labelHeight,
                  style: {},
                  children: []
                },
                x = 15,
                y = 15,
                ydom = Y.DOM,
                testLabel,
                testStyles,
                styles,
                key,
                matrix = new Y.Matrix();

            while(rotations.length > 0) {
                rotation = rotations.shift();
                testLabel = this._getLabelRotationStyles(x, y, rotation, labelWidth, labelHeight); 
                testStyles = testLabel.style;
                rotationProps = this._getRotationProps(rotation);
                rotationProps.x = 15;
                rotationProps.y = 15;
                rotationProps.transformOrigin = (this._transformOrigins[position](rotation)).split(",");
                rotationProps.labelWidth = labelWidth;
                rotationProps.labelHeight = labelHeight;
                axis._rotate(mockLabel, rotationProps);
                styles = mockLabel.style;
                for(key in testStyles) {
                    if(testStyles.hasOwnProperty(key)) {
                        Y.Assert.isTrue(styles.hasOwnProperty(key), "The label should have the style " + key + ".");
                        Y.Assert.areEqual(testStyles[key], styles[key], "The " + key + " style should be " + testStyles[key] + "."); 
                    }
                }
            }
        },

        "test: _simulateRotateWithTransformOrigin()" : function() {
            var axis = this.axis,
                position = this.position,
                getTransformOrigin = this._transformOrigins[position],
                matrix = new Y.Matrix(),
                testMatrix = new Y.Matrix(),
                labelWidth,
                labelHeight,
                rotations = [90, -90, 0, 45, -45],
                rotation,
                props,
                testProps;

                while(rotations.length > 0) {
                    rotation = rotations.shift();
                    transformOrigin = getTransformOrigin(rotation);
                    this._simulateRotateWithTransformOrigin(testMatrix, rotation, transformOrigin, labelWidth, labelHeight);
                    axis._simulateRotateWithTransformOrigin(matrix, rotation, transformOrigin, labelWidth, labelHeight);
                    Y.Assert.areEqual(testMatrix.a, matrix.a, "The a property of the matrices should be the same.");
                    Y.Assert.areEqual(testMatrix.b, matrix.b, "The b property of the matrices should be the same.");
                    Y.Assert.areEqual(testMatrix.c, matrix.c, "The c property of the matrices should be the same.");
                    Y.Assert.areEqual(testMatrix.d, matrix.d, "The d property of the matrices should be the same.");
                    Y.Assert.areEqual(testMatrix.dx, matrix.dx, "The dx property of the matrices should be the same.");
                    Y.Assert.areEqual(testMatrix.dy, matrix.dy, "The dy property of the matrices should be the same.");
                }

        },

        "test: getMaxLabelBounds()/getMinLabelBounds()" : function() {
            var max = 1000,
                min = 15,
                axis = this.axis,
                testMaxBounds = {
                    top: 100,
                    right: 200, 
                    bottom: 200,
                    left: 100
                },
                testMinBounds = {
                    top: 0,
                    right: 100,
                    bottom: 100,
                    left: 0
                },
                mockAxis = {
                    _getLabelBounds: function(val) {
                        if(val === max) {
                            return testMaxBounds;
                        } else {
                            return testMinBounds;
                        }
                        return val;   
                    },

                    getMaximumValue: function() {
                        return max;
                    },

                    getMinimumValue: function() {
                        return min;
                    }
                },
                maxBounds,
                minBounds,
                key;
            maxBounds = axis.getMaxLabelBounds.apply(mockAxis);
            minBounds = axis.getMinLabelBounds.apply(mockAxis);
            for(key in testMaxBounds) {
                if(testMaxBounds.hasOwnProperty(key)) {
                    Y.Assert.areEqual(testMaxBounds[key], maxBounds[key], "The " + key + " property of getMaxBounds should equal " + testMaxBounds[key] + ".");  
                }
            }
            for(key in testMinBounds) {
                if(testMinBounds.hasOwnProperty(key)) {
                    Y.Assert.areEqual(testMinBounds[key], minBounds[key], "The " + key + " property of getMinBounds should equal " + testMinBounds[key] + ".");  
                }
            }
        },

        "test: _getLabelBounds()" : function() {
            var labelWidth = 80,
                labelHeight = 22,
                GetLabelBoundsAxis = Y.Base.create("getLabelBoundsAxis", Y.Axis, [], {
                        getLabel: function(props) {
                            return { 
                                parentNode: {
                                    removeChild: function() {
                                        //do nothing, not testing removeChild method. No real dom nodes used in test, empty method prevents errors
                                    }
                                }
                            };
                        },
                        _removeChildren: function() {
                            //do nothing. not testing _removeChildren method. No real dom nodes used in test, empty method prevents errors
                        }
                    }, {
                    ATTRS: {
                        //labelFunction method is implemented by the Impl classes. We'll add a default one to avoid errors
                        labelFunction: {
                            value: function(val, format) {
                                return val;
                            }   
                        },
                        //overwrite appendLabelFunction to set predefined offsetWidth and offsetHeight to our mock label. The _getLabelBounds method only uses
                        //this method to be able to ascertain the offsetWidth/offsetHeight. We'll just set one.
                        appendLabelFunction: {
                            value: function(textField, val) {
                                textField.offsetWidth = labelWidth;
                                textField.offsetHeight = labelHeight;
                            }
                        }
                    }
                }),
                position = this.position,
                mockAxis = new GetLabelBoundsAxis({position:position}),
                axis = this.axis,
                rotations = [90, -90, 0, 45, -45],
                rotation,
                axisLabelText = "axis label",
                axisLabel = document.createElement("span"),
                matrix = new Y.Matrix(), 
                labelStyles = axis.get("styles").label,
                customStyles = {
                    rotation: "rotation",
                    margin: "margin",
                    alpha: "alpha"
                },
                getTransformOrigin = this._transformOrigins[position],
                transformOrigin,
                key,
                props,
                labelBounds,
                testBounds;
            mockAxis._layout = this.axisLayout; 
            
            while(rotations.length > 0) {
                rotation = rotations.shift();
                props = {};
                props.rot = rotation;
                props.absRot = Math.abs(rotation);
                props.transformOrigin = getTransformOrigin(rotation).split(",");
                props.x = 0;
                props.y = 0;
                this._getRotationCoords(props, labelWidth, labelHeight);
                matrix.init();
                matrix.translate(props.x, props.y);
                this._simulateRotateWithTransformOrigin(matrix, props.rot, props.transformOrigin, labelWidth, labelHeight);
                testBounds = matrix.getContentRect(labelWidth, labelHeight);
                mockAxis.set("styles", {
                    label: {
                        rotation: rotation
                    }   
                });
                labelBounds = axis._getLabelBounds.apply(mockAxis, [axisLabelText]);
                for(key in testBounds) {
                    if(testBounds.hasOwnProperty(key)) {
                        Y.Assert.isTrue(labelBounds.hasOwnProperty(key), "The _getLabelBounds method should return an object with the " + key + " property.");
                        Y.Assert.areEqual(testBounds[key], labelBounds[key], "The _getLabelBounds should return a " + key + " property with a value of " + testBounds[key] + ".");
                    }
                }
            }
        },

        "test: destructor()" : function() {
           var DestructorAxis = Y.Base.create("destructorAxis", Y.MockAxisWithBucket, [], {
                    _addLabel: function(label) {
                        var cb = this.get("contentBox");
                        cb.append(label);    
                    },
                    _removeChildren: function() {
                        //do nothing. not testing _removeChildren method. No real dom nodes used in test, empty method prevents errors
                    }
               },
               { 
                   ATTRS: {
                        labels: {
                           readOnly: true,
                           getter: function() {
                                var cb = this.get("contentBox"),
                                    labels = cb._children;
                                return labels;
                           }
                        }
                   }
               }),
               bucket,
               mockAxis = new DestructorAxis();
            //add labels to be destroyed
            mockAxis._addLabel("label1");
            mockAxis._addLabel("label2");
            mockAxis._addLabel("label3");

            Y.Assert.isNotNull(mockAxis.get("labels"), "There should be labels in the mockAxis.");
            Y.Assert.isNotUndefined(mockAxis.get("labels"), "There should be labels in the mockAxis.");
            Y.Assert.areEqual(3, mockAxis.get("labels").length, "There should be 3 labels.");
            Y.Assert.isNotNull(mockAxis.get("graphic"), "There should be a graphic instance.");
            
            this.axis.destructor.apply(mockAxis);
            Y.Assert.areEqual(0, mockAxis.get("labels").length, "All of the labels should be removed.");
            Y.Assert.isNull(mockAxis.get("graphic"), "There should be a graphic instance.");
        },

        "test: _setText()" : function() {
            var label = document.createElement("span"),
                labelText = "axis label",
                axis = this.axis;

            axis._setText(label, labelText);
            Y.Assert.areEqual(labelText, label.innerHTML, "The contents of the label should be " + labelText + ".");
            axis._setText(label, 327);
            Y.Assert.areEqual("327", label.innerHTML, "The contents of the label should be 327.");
    
        },

        "test: _clearLabelCache()" : function() {
            var axis = this.axis,
                label,
                labels = [],
                axis = this.axis,
                i,
                len = 11;
            this.axis._clearLabelCache();
            Y.Assert.areEqual(0, axis._labelCache.length, "The should not be any labels in the cache.");
            for(i = 0; i < len; i = i + 1) {
                label = document.createElement('span');
                label.appendChild(document.createTextNode("label # " + (i + 1)));
                document.body.appendChild(label);
                labels.push(label);
            }
            this.axis._labelCache = labels;
            this.axis._clearLabelCache();
            Y.Assert.areEqual(0, axis._labelCache.length, "The should not be any labels in the cache.");
        },
        "test: getMajorUnitDistance()" : function() {
            var position = this.position,
                vertical = position === "left" || position === "right",
                size = vertical ? "height" : "width",
                length = 400,
                distance = length/7;
            this.axis.set("size", length);
            this.axis.set("position", position);
            this.axis.set("styles", {
                majorUnit: {
                    count: 8
                }
            });
            Y.Assert.areEqual(
                distance, 
                this.axis.getMajorUnitDistance(8, length, this.axis.get("styles").majorUnit),
                "The getMajorUnitDistance method should return " + distance + "."
            ); 
            this.axis.set("styles", {
                majorUnit: {
                    determinant: "distance",
                    distance: distance
                }
            });
            Y.Assert.areEqual(
                distance, 
                this.axis.getMajorUnitDistance(8, length, this.axis.get("styles").majorUnit),
                "The getMajorUnitDistance method should return " + distance + "."
            );
            this.axis.set("styles", {
                majorUnit: {
                    determinant: "random"   
                }
            });
            Y.Assert.isUndefined(
                this.axis.getMajorUnitDistance(8, length, this.axis.get("styles").majorUnit), 
                "An invalid majorUnit.determinant should result in the getMajorUnitDistance method returning undefined."
            );
        },

        "test: _hasDataOverflow()" : function() {
            var axis = this.axis;
            Y.Assert.isFalse(axis._hasDataOverflow(), "The _hasOverflow method should return false.");
            axis.set("maximum", 400);   
            Y.Assert.isTrue(axis._hasDataOverflow(), "The _hasOverflow method should return true.");
        },

        "test: getMaximumValue()/getMinimumValue()" : function() {
            var axis = this.axis,
                max = 300,
                min = 100;
            axis.set("maximum", max);
            axis.set("minimum", min);
            Y.Assert.areEqual(max, axis.getMaximumValue(), "The getMaximumValue method should return " + max + ".");
            Y.Assert.areEqual(min, axis.getMinimumValue(), "The getMinimumValue method should return " + min + ".");
        },

        "test: set('calculatedWidth')/set('calculatedHeight')" : function() {
            var axis = this.axis,
                val = 3000;
            axis.set("calculatedWidth", val);
            axis.set("calculatedHeight", val);
            Y.Assert.areEqual(val, axis.get("calculatedWidth"), "The calculatedWidth should be " + val + ".");
            Y.Assert.areEqual(val, axis.get("calculatedHeight"), "The calculatedHeight should be " + val + ".");
        },

        "test: get('tickPoints')" : function() {
            var axis = this.axis,
                majorUnitCount = axis.get("styles").majorUnit.count,
                setCount = 8;
            axis._tickPoints = setCount;
            Y.Assert.areEqual(setCount, axis.get("tickPoints"), "The tickPoints attribute should be " + setCount + ".");
            axis.set("position", "none");
            Y.Assert.areEqual(majorUnitCount, axis.get("tickPoints"), "The tickPoints attribute should be " + majorUnitCount + "."); 
        },

        "test: get('maxLabelSize')" : function() {
            var axis = this.axis,
                testSize = 120;
            axis.set("maxLabelSize", testSize);
            Y.Assert.areEqual(testSize, axis.get("maxLabelSize"), "The attribue maxLabelSize should equal " + testSize + ".");
        },

        "test: set('position')" : function() {
            var position = this.position,
                none = "none";
            this.axis.set("position", position);
            Y.Assert.areEqual(this.position, this.axis.get("position"), "The axis position should be " + position + ".");
            this.axis.set("position", none);
            Y.Assert.areEqual(none, this.axis.get("position"), "The axis position should be " + none + ".");
        },

        "test: get/set('labelValues')" : function() {
            var axis = this.axis,
                testLabelValues = ["label1", "label2", "label3"],
                testLabelValues2 = ["label4", "label5", "label6", "label7"];
            Y.Assert.isUndefined(axis.get("labelValues"), "The should not be a value for the labelValues attribute.");
            axis.set("labelValues", testLabelValues);
            Y.Assert.areEqual(testLabelValues, axis.get("labelValues"), "The labelValues attribute should have been set.");
            Y.Assert.isTrue(axis._labelValuesExplicitlySet, "The value of the _labelValuesExplicitlySet should bet true.");
            axis.set("labelValues", testLabelValues2, {src: "internal"});
            Y.Assert.areEqual(testLabelValues2, axis.get("labelValues"), "The labelValues attribute should have been set.");
            //Don't run this test until fix for #2533172 is available  
            //Y.Assert.isFalse(axis._labelValuesExplicitlySet, "The value of the _labelValuesExplicitlySet should be false.");

        },

        "test: getTotalMajorUnits()" : function() {
            var position = this.position,
                vertical = position === "left" || position === "right",
                size = vertical ? "height" : "width",
                length = 400,
                distance = length/7;
            this.axis.set(size, length);
            this.axis.set("position", position);
            Y.Assert.areEqual(11, this.axis.getTotalMajorUnits(), "The getTotalMajorUnits method should return 11.");
            this.axis.set("styles", {
                majorUnit: {
                    count: 8
                }
            });
            Y.Assert.areEqual(8, this.axis.getTotalMajorUnits(), "The getTotalMajorUnits method should return 8.");
        

           this.axis.set("styles", {
                majorUnit: {
                    determinant: "distance",
                    distance: distance 
                }
           });
           Y.Assert.areEqual(8, this.axis.getTotalMajorUnits(), "The getTotalMajorUnits method should return 8.");
        },

        "test: _getPoints()" : function() {
            var axis = this.axis,
                styles = axis.get("styles"),
                i,
                len = axis.getTotalMajorUnits(), 
                position = this.position,
                direction = position === "left" || position === "right" ? "vertical" : "horizontal",
                layouts = {
                    left: Y.LeftAxisLayout,
                    top: Y.TopAxisLayout,
                    right: Y.RightAxisLayout,
                    bottom: Y.BottomAxisLayout
                },
                startPoint = axis.getFirstPoint(layouts[position].prototype.getLineStart.apply(axis)),
                edgeOffset = 0,
                majorUnitDistance = axis.getMajorUnitDistance(len, axis.getLength(), styles.majorUnit),
                axisPoints,
                testPoints,
                axisPoint,
                testPoint,
                assertFn = function() {
                    axisPoints = axis._getPoints.apply(axis, [
                        startPoint,
                        len,
                        edgeOffset,
                        majorUnitDistance,
                        direction
                    ]);
                    testPoints = this._getPoints(
                        startPoint,
                        len,
                        edgeOffset,
                        majorUnitDistance,
                        direction,
                        styles.padding
                    );
                    for(i = 0; i < len; i = i + 1) {
                        testPoint = testPoints[i];
                        axisPoint = axisPoints[i];
                        Y.Assert.areEqual(testPoint.x, axisPoint.x, "The x value for the " + i + " index of the axis points should be " + testPoint.x + "."); 
                        Y.Assert.areEqual(testPoint.y, axisPoint.y, "The y value for the " + i + " index of the axis points should be " + testPoint.y + "."); 
                    }
                };
            assertFn.apply(this);
        }
    });

    var suite = new Y.Test.Suite("Charts: Axis"),
        leftAxisTests = new Y.AxisTest({
            name: "Left Axis Tests",
            position: "left",
            height: 400
        }),
        rightAxisTests = new Y.AxisTest({
            name: "Right AxisTests",
            position: "right",
            height: 400
        }),
        topAxisTests = new Y.AxisTest({
            name: "Top Axis Tests",
            position: "top",
            width: 700
        }),
        bottomAxisTests = new Y.AxisTest({
            name: "Bottom Axis Tests",
            position: "bottom",
            width: 700
        });

    suite.add(leftAxisTests);
    suite.add(topAxisTests);
    suite.add(rightAxisTests);
    suite.add(bottomAxisTests);

    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['axis', 'chart-test-template']});
