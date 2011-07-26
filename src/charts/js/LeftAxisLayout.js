/**
 * Algorithmic strategy for rendering a left axis.
 *
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
     * @param {Object} pt Point on the axis in which the tick will intersect.
     * @param {Object} tickStyle Hash of properties to apply to the tick.
     * @protected
     */
    drawTick: function(pt, tickStyles)
    {
        var host = this,
            style = host.get("styles"),
            padding = style.padding,
            tickLength = tickStyles.length,
            start = {x:padding.left, y:pt.y},
            end = {x:tickLength + padding.left, y:pt.y};
        host.drawLine(start, end, tickStyles);
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
            m11 = props.m11,
            m12 = props.m12,
            m21 = props.m21,
            m22 = props.m22,
            max;
        if(!DOCUMENT.createElementNS)
        {
            label.style.filter = 'progid:DXImageTransform.Microsoft.Matrix(M11=' + m11 + ' M12=' + m12 + ' M21=' + m21 + ' M22=' + m22 + ' sizingMethod="auto expand")';
            host.set("maxLabelSize", Math.max(host.get("maxLabelSize"), label.offsetWidth));
        }
        else
        {
            label.style.msTransform = "rotate(0deg)";
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
            host.set("maxLabelSize",  Math.max(host.get("maxLabelSize"), max));
        }
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
            label.style.left = Math.round(x) + "px";
            label.style.top = Math.round(y) + "px";
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
            tickOffset = host.get("leftTickOffset"),
            style = host.get("styles").label,
            margin = 0,
            leftOffset = pt.x + this._titleSize,
            topOffset = pt.y,
            props = this._labelRotationProps,
            rot = props.rot,
            absRot = props.absRot,
            sinRadians = props.sinRadians,
            cosRadians = props.cosRadians,
            maxLabelSize = host.get("maxLabelSize"),
            labelWidth = Math.round(label.offsetWidth),
            labelHeight = Math.round(label.offsetHeight);
        if(style.margin && style.margin.right)
        {
            margin = style.margin.right;
        }
        if(!DOCUMENT.createElementNS)
        {
            label.style.filter = null; 
            labelWidth = Math.round(label.offsetWidth);
            labelHeight = Math.round(label.offsetHeight);
            if(rot === 0)
            {
                leftOffset = labelWidth;
                topOffset -= labelHeight * 0.5;
            }
            else if(absRot === 90)
            {
                leftOffset = labelHeight;
                topOffset -= labelWidth * 0.5;
            }
            else if(rot > 0)
            {
                leftOffset = (cosRadians * labelWidth) + (labelHeight * rot/90);
                topOffset -= (sinRadians * labelWidth) + (cosRadians * (labelHeight * 0.5));
            }
            else
            {
                leftOffset = (cosRadians * labelWidth) + (absRot/90 * labelHeight);
                topOffset -= cosRadians * (labelHeight * 0.5);
            }
            leftOffset += tickOffset;
            label.style.left = Math.round((pt.x + this._titleSize + maxLabelSize) - leftOffset) + "px";
            label.style.top = Math.round(topOffset) + "px";
            this._rotate(label, this._labelRotationProps);
            return;
        }
        label.style.msTransform = "rotate(0deg)";
        labelWidth = Math.round(label.offsetWidth);
        labelHeight = Math.round(label.offsetHeight);
        if(rot === 0)
        {
            leftOffset -= labelWidth;
            topOffset -= labelHeight * 0.5;
        }
        else if(rot === 90)
        {
            topOffset -= labelWidth * 0.5;
        }
        else if(rot === -90)
        {
            leftOffset -= labelHeight;
            topOffset += labelWidth * 0.5;
        }
        else
        {
            if(rot < 0)
            {
                leftOffset -= (cosRadians * labelWidth) + (sinRadians * labelHeight);
                topOffset += (sinRadians * labelWidth) - (cosRadians * (labelHeight * 0.6)); 
            }
            else
            {
                leftOffset -= (cosRadians * labelWidth);
                topOffset -= (sinRadians * labelWidth) + (cosRadians * (labelHeight * 0.6));
            }
        }
        props.x = Math.round(host.get("maxLabelSize") + leftOffset);
        props.y = Math.round(topOffset);
        this._rotate(label, this._labelRotationProps);
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
            labelSize = host.get("maxLabelSize"),
            style = host.get("styles"),
            leftTickOffset = host.get("leftTickOffset"),
            sz = labelSize + leftTickOffset,
            graphic = host.get("graphic"),
            margin = style.label.margin;
        if(margin && margin.right)
        {
            sz += margin.right;
        }
        sz += this._titleSize;
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
            tickOffset = host.get("leftTickOffset"),
            max = host.get("maxLabelSize"),
            ttl = Math.round(this._titleSize + tickOffset + max + label.margin.right);
        host.get("contentBox").setStyle("width", ttl);
        host.set("width", ttl);
    }
};

Y.LeftAxisLayout = LeftAxisLayout;
