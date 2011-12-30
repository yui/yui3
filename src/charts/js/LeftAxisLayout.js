/**
 * Algorithmic strategy for rendering a left axis.
 *
 * @module charts
 * @class LeftAxisLayout
 * @constructor
 */
LeftAxisLayout = function() {};

LeftAxisLayout.prototype = {
    /**
     *  Default margins for text fields.
     *
     *  @private
     *  @method _getDefaultMargins
     *  @return Object
     */
    _getDefaultMargins: function() 
    {
        return {
            top: 0,
            left: 0,
            right: 4,
            bottom: 0
        };
    },

    /**
     * Sets the length of the tick on either side of the axis line.
     *
     * @method setTickOffset
     * @protected
     */
    setTickOffsets: function()
    {
        var host = this,
            majorTicks = host.get("styles").majorTicks,
            tickLength = majorTicks.length,
            halfTick = tickLength * 0.5,
            display = majorTicks.display;
        host.set("topTickOffset",  0);
        host.set("bottomTickOffset",  0);
        
        switch(display)
        {
            case "inside" :
                host.set("rightTickOffset",  tickLength);
                host.set("leftTickOffset", 0);
            break;
            case "outside" : 
                host.set("rightTickOffset", 0);
                host.set("leftTickOffset",  tickLength);
            break;
            case "cross":
                host.set("rightTickOffset", halfTick); 
                host.set("leftTickOffset",  halfTick);
            break;
            default:
                host.set("rightTickOffset", 0);
                host.set("leftTickOffset", 0);
            break;
        }
    },
    
    /**
     * Draws a tick
     *
     * @method drawTick
     * @param {Path} path reference to the path `Path` element in which to draw the tick.
     * @param {Object} pt Point on the axis in which the tick will intersect.
     * @param {Object} tickStyle Hash of properties to apply to the tick.
     * @protected
     */
    drawTick: function(path, pt, tickStyles)
    {
        var host = this,
            style = host.get("styles"),
            padding = style.padding,
            tickLength = tickStyles.length,
            start = {x:padding.left, y:pt.y},
            end = {x:tickLength + padding.left, y:pt.y};
        host.drawLine(path, start, end);
    },

    /**
     * Calculates the coordinates for the first point on an axis.
     *
     * @method getLineStart
     * @return {Object}
     * @protected
     */
    getLineStart: function()
    {
        var style = this.get("styles"),
            padding = style.padding,
            majorTicks = style.majorTicks,
            tickLength = majorTicks.length,
            display = majorTicks.display,
            pt = {x:padding.left, y:0};
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
    
    /**
     * Calculates the point for a label.
     *
     * @method getLabelPoint
     * @param {Object} point Point on the axis in which the tick will intersect.
     * @return {Object} 
     * @protected
     */
    getLabelPoint: function(point)
    {
        return {x:point.x - this.get("leftTickOffset"), y:point.y};
    },
    
    /**
     * Updates the value for the `maxLabelSize` for use in calculating total size.
     *
     * @method updateMaxLabelSize
     * @param {HTMLElement} label to measure
     * @protected
     */
    updateMaxLabelSize: function(label)
    {
        var host = this,
            props = this._labelRotationProps,
            rot = props.rot,
            absRot = props.absRot,
            sinRadians = props.sinRadians,
            cosRadians = props.cosRadians,
            max;
        if(rot === 0)
        {
            max = label.offsetWidth;
        }
        else if(absRot === 90)
        {
            max = label.offsetHeight;
        }
        else
        {
            max = (cosRadians * label.offsetWidth) + (sinRadians * label.offsetHeight);
        }
        host._maxLabelSize = Math.max(host._maxLabelSize, max);
    },

    /**
     * Rotate and position title.
     *
     * @method positionTitle
     * @param {HTMLElement} label to rotate position
     * @protected
     */
    positionTitle: function(label)
    {
        var host = this,
            max,
            styles = host.get("styles").title,
            props = this._getTextRotationProps(styles),
            rot = props.rot,
            absRot = props.absRot,
            sinRadians = props.sinRadians,
            cosRadians = props.cosRadians,
            x = 0,
            y = this.get("height")/2,
            leftOffset = 0,
            topOffset = 0,
            labelWidth = label.offsetWidth,
            labelHeight = label.offsetHeight;
        if(Y.config.doc.createElementNS)
        {
            if(rot === 0)
            {
                max = labelWidth;
                topOffset -= labelHeight * 0.5;
            }
            else if(absRot === 90)
            {
                max = labelHeight;
                if(rot === 90)
                {
                    leftOffset += labelHeight;
                    topOffset -= labelWidth * 0.5;
                }
                else
                {
                    topOffset += labelWidth * 0.5;
                }
            }
            else
            {
                max = (cosRadians * labelWidth) + (sinRadians * labelHeight);
                if(rot > 0)
                {
                    topOffset -= ((sinRadians * labelWidth) + (cosRadians * labelHeight))/2;
                    leftOffset += Math.min(labelHeight, (sinRadians * labelHeight));
                }
                else
                {
                    topOffset += (sinRadians * labelWidth)/2 - (cosRadians * labelHeight)/2;
                }
            }
            y += topOffset;
            x += leftOffset;
            props.x = Math.round(x);
            props.y = Math.round(y);
        }
        else
        {
            label.style.filter = null; 
            labelWidth = Math.round(label.offsetWidth);
            labelHeight = Math.round(label.offsetHeight);
            if(rot === 0)
            {
                topOffset -= labelHeight * 0.5;
                max = labelWidth;
            }
            else if(rot === 90)
            {
                topOffset -= labelWidth * 0.5;
                max = labelHeight;
            }
            else if(rot === -90)
            {
                topOffset -= labelWidth * 0.5;
                max = labelHeight;
            }
            else
            {
                max = (cosRadians * labelWidth) + (sinRadians * labelHeight);
                topOffset -= ((sinRadians * labelWidth) + (cosRadians * labelHeight))/2;
            }
            y += topOffset;
            x += leftOffset;
            props.x = Math.round(x);
            props.y = Math.round(y);
        }
        this._titleSize = max;
        this._rotate(label, props);
    },

    /**
     * Rotate and position labels.
     *
     * @method positionLabel
     * @param {HTMLElement} label to rotate position
     * @param {Object} pt hash containing the x and y coordinates in which the label will be positioned
     * against.
     * @protected
     */
    positionLabel: function(label, pt)
    {
        var host = this,
            style = host.get("styles").label,
            titleStyles = host.get("styles").title,
            margin = 0,
            totalTitleSize = this.get("title") ? this._titleSize + titleStyles.margin.right + titleStyles.margin.left : 0,
            leftOffset = pt.x + totalTitleSize,
            topOffset = pt.y,
            props = this._labelRotationProps,
            rot = props.rot,
            absRot = props.absRot,
            maxLabelSize = host._maxLabelSize,
            labelWidth = Math.round(label.offsetWidth),
            labelHeight = Math.round(label.offsetHeight);
        if(style.margin && style.margin.right)
        {
            margin = style.margin.right;
        }
        if(rot === 0)
        {
            leftOffset -= labelWidth;
            topOffset -= labelHeight * 0.5;
        }
        else if(rot === 90)
        {
            leftOffset -= labelWidth * 0.5;
            props.transformOrigin = [0.5, 0];
        }
        else if(rot === -90)
        {
            leftOffset -= labelWidth * 0.5;
            topOffset -= labelHeight;
            props.transformOrigin = [0.5, 1];
        }
        else
        {
            leftOffset -= labelWidth + (labelHeight * absRot/360);
            topOffset -= labelHeight * 0.5;
            props.transformOrigin = [1, 0.5];
        }
        props.labelWidth = labelWidth;
        props.labelHeight = labelHeight;
        props.x = Math.round(maxLabelSize + leftOffset);
        props.y = Math.round(topOffset);
        this._rotate(label, props);
    },

    /**
     * Calculates the size and positions the content elements.
     *
     * @method setSizeAndPosition
     * @protected
     */
    setSizeAndPosition: function()
    {
        var host = this,
            labelSize = host._maxLabelSize,
            style = host.get("styles"),
            leftTickOffset = host.get("leftTickOffset"),
            sz = labelSize + leftTickOffset,
            graphic = host.get("graphic"),
            titleMargin = style.title.margin,
            totalTitleSize = host.get("title") ? titleMargin.left + titleMargin.right + host._titleSize : 0,
            margin = style.label.margin;
        if(margin && margin.right)
        {
            sz += margin.right;
        }
        sz += totalTitleSize;
        sz = Math.round(sz);
        host.set("width", sz);
        host.get("contentBox").setStyle("width", sz);
        graphic.set("x", sz - leftTickOffset);
    },
    
    /**
     * Adjust the position of the Axis widget's content box for internal axes.
     *
     * @method offsetNodeForTick
     * @param {Node} cb Content box of the Axis.
     * @protected
     */
    offsetNodeForTick: function(cb)
    {
    },

    /**
     * Sets the width of the axis based on its contents.
     *
     * @method setCalculatedSize
     * @protected
     */
    setCalculatedSize: function()
    {
        var host = this,
            style = host.get("styles"),
            label = style.label,
            titleMargin = style.title.margin,
            tickOffset = host.get("leftTickOffset"),
            max = host._maxLabelSize,
            totalTitleSize = host.get("title") ? titleMargin.left + titleMargin.right + host._titleSize : 0,
            ttl = Math.round(totalTitleSize + tickOffset + max + label.margin.right);
        host.get("contentBox").setStyle("width", ttl);
        host.set("width", ttl);
    }
};

Y.LeftAxisLayout = LeftAxisLayout;
