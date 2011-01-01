/**
 * RightAxisLayout contains algorithms for rendering a right axis.
 *
 * @constructor
 * @class RightAxisLayout
 * @extends Base
 * @param {Object} config
 */
function RightAxisLayout(config)
{
    RightAxisLayout.superclass.constructor.apply(this, arguments);
}

RightAxisLayout.ATTRS = {
    /**
     * Reference to the <code>Axis</code> using the strategy.
     *
     * @attribute axisRenderer
     * @type Axis
     * @protected
     */
    axisRenderer: {
        value: null
    }
};

Y.extend(RightAxisLayout, Y.Base, {
    /**
     * Sets the length of the tick on either side of the axis line.
     *
     * @method setTickOffset
     * @protected
     */
    setTickOffsets: function()
    {
        var ar = this.get("axisRenderer"),
            majorTicks = ar.get("styles").majorTicks,
            tickLength = majorTicks.length,
            halfTick = tickLength * 0.5,
            display = majorTicks.display;
        ar.set("topTickOffset",  0);
        ar.set("bottomTickOffset",  0);
        
        switch(display)
        {
            case "inside" :
                ar.set("leftTickOffset", tickLength);
                ar.set("rightTickOffset", 0);
            break;
            case "outside" : 
                ar.set("leftTickOffset", 0);
                ar.set("rightTickOffset", tickLength);
            break;
            case "cross" :
                ar.set("rightTickOffset", halfTick);
                ar.set("leftTickOffset", halfTick);
            break;
            default:
                ar.set("leftTickOffset", 0);
                ar.set("rightTickOffset", 0);
            break;
        }
    },

    /**
     * Draws a tick
     *
     * @method drawTick
     * @param {Object} pt Point on the axis in which the tick will intersect.
     * @param {Object) tickStyle Hash of properties to apply to the tick.
     * @protected
     */
    drawTick: function(pt, tickStyles)
    {
        var ar = this.get("axisRenderer"),
            style = ar.get("styles"),
            padding = style.padding,
            tickLength = tickStyles.length,
            start = {x:padding.left, y:pt.y},
            end = {x:padding.left + tickLength, y:pt.y};
        ar.drawLine(start, end, tickStyles);
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
        var ar = this.get("axisRenderer"),
            style = ar.get("styles"),
            padding = style.padding,
            majorTicks = style.majorTicks,
            tickLength = majorTicks.length,
            display = majorTicks.display,
            pt = {x:padding.left, y:padding.top};
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
        var ar = this.get("axisRenderer");
        return {x:point.x + ar.get("rightTickOffset"), y:point.y};
    },
    
    /**
     * Updates the value for the <code>maxLabelSize</code> for use in calculating total size.
     *
     * @method updateMaxLabelSize
     * @param {HTMLElement} label to measure
     * @protected
     */
    updateMaxLabelSize: function(label)
    {
        var ar = this.get("axisRenderer"),
            style = ar.get("styles").label,
            rot =  Math.min(90, Math.max(-90, style.rotation)),
            absRot = Math.abs(rot),
            radCon = Math.PI/180,
            sinRadians = parseFloat(parseFloat(Math.sin(absRot * radCon)).toFixed(8)),
            cosRadians = parseFloat(parseFloat(Math.cos(absRot * radCon)).toFixed(8)),
            m11 = cosRadians,
            m12 = rot > 0 ? -sinRadians : sinRadians,
            m21 = -m12,
            m22 = m11,
            max;
        if(!document.createElementNS)
        {
            label.style.filter = 'progid:DXImageTransform.Microsoft.Matrix(M11=' + m11 + ' M12=' + m12 + ' M21=' + m21 + ' M22=' + m22 + ' sizingMethod="auto expand")';
            this.set("maxLabelSize", Math.max(this.get("maxLabelSize"), label.offsetWidth));
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
            this.set("maxLabelSize",  Math.max(this.get("maxLabelSize"), max));
        }
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
        var ar = this.get("axisRenderer"),
            tickOffset = ar.get("rightTickOffset"),
            style = ar.get("styles").label,
            labelAlpha = style.alpha,
            filterString,
            margin = 0,
            leftOffset = pt.x,
            topOffset = pt.y,
            rot =  Math.min(Math.max(style.rotation, -90), 90),
            absRot = Math.abs(rot),
            radCon = Math.PI/180,
            sinRadians = parseFloat(parseFloat(Math.sin(absRot * radCon)).toFixed(8)),
            cosRadians = parseFloat(parseFloat(Math.cos(absRot * radCon)).toFixed(8)),
            m11 = cosRadians,
            m12 = rot > 0 ? -sinRadians : sinRadians,
            m21 = -m12,
            m22 = m11,
            labelWidth = Math.round(label.offsetWidth),
            labelHeight = Math.round(label.offsetHeight);
        if(style.margin && style.margin.right)
        {
            margin = style.margin.right;
        }
        if(!document.createElementNS)
        {
            label.style.filter = null;
            if(rot === 0)
            {
                topOffset -= labelHeight * 0.5;
            }
            else if(absRot === 90)
            {
                topOffset -= labelWidth * 0.5;
            }
            else if(rot > 0)
            {
                topOffset -= (cosRadians * (labelHeight * 0.5));
            }
            else
            {
                topOffset -= (sinRadians * labelWidth) +  (cosRadians * (labelHeight * 0.5));
            }
            leftOffset += margin;
            leftOffset += tickOffset;
            label.style.left = leftOffset + "px";
            label.style.top = topOffset + "px";
            if(Y.Lang.isNumber(labelAlpha) && labelAlpha < 1 && labelAlpha > -1 && !isNaN(labelAlpha))
            {
                filterString = "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + Math.round(labelAlpha * 100) + ")";
            }
            if(rot !== 0)
            {
                if(filterString)
                {
                    filterString += " ";
                }
                else
                {
                    filterString = ""; 
                }
                filterString += 'progid:DXImageTransform.Microsoft.Matrix(M11=' + m11 + ' M12=' + m12 + ' M21=' + m21 + ' M22=' + m22 + ' sizingMethod="auto expand")';
            }
            if(filterString)
            {
                label.style.filter = filterString;
            }
            return;
        }
        label.style.msTransform = "rotate(0deg)";
        labelWidth = Math.round(label.offsetWidth);
        labelHeight = Math.round(label.offsetHeight);
        if(rot === 0)
        {
            topOffset -= labelHeight * 0.5;
        }
        else if(rot === 90)
        {
            leftOffset += labelHeight;
            topOffset -= labelWidth * 0.5;
        }
        else if(rot === -90)
        {
            topOffset += labelWidth * 0.5;
        }
        else if(rot < 0)
        {
            topOffset -= (cosRadians * (labelHeight * 0.6)); 
        }
        else
        {
            topOffset -= cosRadians * (labelHeight * 0.6);
            leftOffset += sinRadians * labelHeight;
        }
        leftOffset += margin;
        leftOffset += tickOffset;
        label.style.left = leftOffset + "px";
        label.style.top = topOffset + "px";
        label.style.MozTransformOrigin =  "0 0";
        label.style.MozTransform = "rotate(" + rot + "deg)";
        label.style.webkitTransformOrigin = "0 0";
        label.style.webkitTransform = "rotate(" + rot + "deg)";
        label.style.msTransformOrigin =  "0 0";
        label.style.msTransform = "rotate(" + rot + "deg)";
        label.style.OTransformOrigin =  "0 0";
        label.style.OTransform = "rotate(" + rot + "deg)";
    },

    /**
     * Calculates the size and positions the content elements.
     *
     * @method setSizeAndPosition
     * @protected
     */
    setSizeAndPosition: function()
    {
        var ar = this.get("axisRenderer"),
            label = ar.get("styles").label,
            labelSize = this.get("maxLabelSize"),
            tickOffset = ar.get("rightTickOffset"),
            sz = tickOffset + labelSize;
        if(label.margin && label.margin.weight)
        {
            sz += label.margin.weight;
        }
        ar.set("width", sz);
        ar.get("contentBox").setStyle("width", sz);
    },
    
    /**
     * Adjusts position for inner ticks.
     *
     * @method offsetNodeForTick
     * @param {Node} cb contentBox of the axis
     * @protected
     */
    offsetNodeForTick: function(cb)
    {
        var ar = this.get("axisRenderer"),
            tickOffset = ar.get("leftTickOffset"),
            offset = 0 - tickOffset;
        cb.setStyle("left", offset);
    },

    /**
     * Assigns a height based on the size of the contents.
     *
     * @method setCalculatedSize
     * @protected
     */
    setCalculatedSize: function()
    {
        var ar = this.get("axisRenderer"),
            style = ar.get("styles").label,
            ttl = Math.round(ar.get("rightTickOffset") + this.get("maxLabelSize") + style.margin.left);
        ar.set("width", ttl);
    }
});

Y.RightAxisLayout = RightAxisLayout;
