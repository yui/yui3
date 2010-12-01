/**
 * Algorithmic strategy for rendering a left axis.
 *
 * @class LeftAxisLayout
 * @extends Base
 * @param {Object} config
 * @constructor
 */
function LeftAxisLayout(config)
{
    LeftAxisLayout.superclass.constructor.apply(this, arguments);
}

LeftAxisLayout.ATTRS = {
    /**
     * Reference to the <code>Axis</code> using the strategy.
     */
    axisRenderer: {
        value: null
    },

    /**
     * @private
     */
    maxLabelSize: {
        value: 0
    }
};

Y.extend(LeftAxisLayout, Y.Base, {
    /**
     * Sets the length of the tick on either side of the axis line.
     *
     * @method setTickOffset
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
                ar.set("rightTickOffset",  tickLength);
            break;
            case "outside" : 
                ar.set("leftTickOffset",  tickLength);
            break;
            case "cross":
                ar.set("rightTickOffset", halfTick); 
                ar.set("leftTickOffset",  halfTick);
            break;
            default:
                ar.set("rightTickOffset", 0);
                ar.set("leftTickOffset", 0);
            break;
        }
    },
    
    /**
     * Draws a tick
     *
     * @method drawTick
     * @param {Object} pt Point on the axis in which the tick will intersect.
     * @param {Object) tickStyle Hash of properties to apply to the tick.
     */
    drawTick: function(pt, tickStyles)
    {
        var ar = this.get("axisRenderer"),
            style = ar.get("styles"),
            padding = style.padding,
            tickLength = tickStyles.length,
            start = {x:padding.left, y:pt.y},
            end = {x:tickLength + padding.left, y:pt.y};
        ar.drawLine(start, end, tickStyles);
    },

    /**
     * Calculates the coordinates for the first point on an axis.
     *
     * @method getLineStart
     * @return {Object}
     */
    getLineStart: function()
    {
        var ar = this.get("axisRenderer"),
            style = ar.get("styles"),
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
     */
    getLabelPoint: function(point)
    {
        var ar = this.get("axisRenderer");
        return {x:point.x - ar.get("leftTickOffset"), y:point.y};
    },
    
    /**
     * @private
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
            max;
        if(!document.createElementNS)
        {
            label.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(rotation=" + rot + ")";
            this.set("maxLabelSize", Math.max(this.get("maxLabelSize"), label.offsetWidth));
        }
        else
        {
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
     * Positions the label on the axis.
     *
     * @method positionLabel
     * @param label
     * @param {Object} pt Point on the axis in which the label is placed.
     */
    positionLabel: function(label, pt)
    {
        var ar = this.get("axisRenderer"),
            style = ar.get("styles").label,
            labelAlpha = style.alpha,
            filterString,
            margin = 0,
            leftOffset = pt.x,
            topOffset = pt.y,
            rot =  Math.min(90, Math.max(-90, style.rotation)),
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
                leftOffset -= labelWidth;
                topOffset -= label.offsetHeight * 0.5;
            }
            else if(absRot === 90)
            {
                leftOffset -= label.offsetHeight;
                topOffset -= labelWidth * 0.5;
            }
            else if(rot === -90)
            {
                leftOffset -= label.offsetHeight;
                topOffset -= labelWidth * 0.5;
            }
            else if(rot > 0)
            {
                leftOffset -= (cosRadians * labelWidth) + (label.offsetHeight * rot/90);
                topOffset -= (sinRadians * labelWidth) + (cosRadians * (label.offsetHeight * 0.5));
            }
            else
            {
                leftOffset -= (cosRadians * labelWidth) + (absRot/90 * label.offsetHeight);
                topOffset -= cosRadians * (label.offsetHeight * 0.5);
            }
            leftOffset -= margin;
            label.style.left = (this.get("maxLabelSize") + leftOffset) + "px";
            label.style.top = topOffset + "px";
            if(filterString)
            {
                filterString += " ";
            }
            if(Y.Lang.isNumber(labelAlpha))
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
        labelWidth = Math.round(labelWidth);
        labelHeight = Math.round(label.offsetHeight);
        if(rot === 0)
        {
            leftOffset -= labelWidth;
            topOffset -= label.offsetHeight * 0.5;
        }
        else if(rot === 90)
        {
            topOffset -= labelWidth * 0.5;
        }
        else if(rot === -90)
        {
            leftOffset -= label.offsetHeight;
            topOffset += labelWidth * 0.5;
        }
        else
        {
            if(rot < 0)
            {
                leftOffset -= (cosRadians * labelWidth) + (sinRadians * label.offsetHeight);
                topOffset += (sinRadians * labelWidth) - (cosRadians * (label.offsetHeight * 0.6)); 
            }
            else
            {
                leftOffset -= (cosRadians * labelWidth);
                topOffset -= (sinRadians * labelWidth) + (cosRadians * (label.offsetHeight * 0.6));
            }
        }
        leftOffset -= margin;
        label.style.left = (this.get("maxLabelSize") + leftOffset) + "px";
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
     */
    setSizeAndPosition: function()
    {
        var labelSize = this.get("maxLabelSize"),
            ar = this.get("axisRenderer"),
            style = ar.get("styles"),
            sz = style.line.weight,
            graphic = ar.get("graphic"),
            majorTicks = style.majorTicks,
            display = majorTicks.display,
            tickLen = majorTicks.length,
            margin = style.label.margin;
        if(display === "inside")
        {
            sz -= tickLen;
        }
        else if(display === "cross")
        {
            sz -= tickLen * 0.5;
        }
        if(margin && margin.right)
        {
            sz += margin.right;
        }
        sz += labelSize;
        sz = Math.round(sz);
        ar.set("width", sz);
        Y.one(graphic.node).setStyle("left", sz);
    },
    
    /**
     * Adjust the position of the Axis widget's content box for internal axes.
     *
     * @method offsetNodeForTick
     * @param {Node} cb Content box of the Axis.
     */
    offsetNodeForTick: function(cb)
    {
        var ar = this.get("axisRenderer"),
            styles = ar.get("styles"),
            majorTicks = styles.majorTicks,
            line = styles.line,
            weight,
            tickLength = majorTicks.length,
            display = majorTicks.display;
        if(line)
        {
            weight = line.weight || 0;
        }
        if(display === "inside")
        {
            cb.setStyle("left", (tickLength - weight) + "px");
        }
        else if (display === "cross")
        {
            cb.setStyle("left", (tickLength * 0.5) + "px");
        }
        else 
        {
            cb.setStyle("left", "0px");    
        }
    },

    /**
     * Sets the width of the axis based on its contents.
     *
     * @method setCalculatedSize
     */
    setCalculatedSize: function()
    {
        var ar = this.get("axisRenderer"),
            style = ar.get("styles").label,
            ttl = ar.get("leftTickOffset") + this.get("maxLabelSize") + style.margin.right;
            ar.set("width", Math.round(ttl));
    }
});

Y.LeftAxisLayout = LeftAxisLayout;
