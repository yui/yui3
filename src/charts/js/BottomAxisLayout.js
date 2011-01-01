/**
 * Contains algorithms for rendering a bottom axis.
 *
 * @class BottomAxisLayout
 * @Constructor
 */
function BottomAxisLayout(config)
{
    BottomAxisLayout.superclass.constructor.apply(this, arguments);
}

BottomAxisLayout.ATTRS = {
    /**
     * Reference to the <code>Axis</code> using the strategy.
     *
     * @attribute axisRenderer
     * @type Axis
     * @protected
     */
    axisRenderer: {
        value:null
    },
    
    /**
     * Length in pixels of largest text bounding box. Used to calculate the height of the axis.
     *
     * @attribute maxLabelSize
     * @type Number
     * @protected
     */
    maxLabelSize: {
        value: 0
    }
};

Y.extend(BottomAxisLayout, Y.Base, {
    /**
     * Sets the length of the tick on either side of the axis line.
     *
     * @method setTickOffsets
     * @protected
     */
    setTickOffsets: function()
    {
        var ar = this.get("axisRenderer"),
            majorTicks = ar.get("styles").majorTicks,
            tickLength = majorTicks.length,
            halfTick = tickLength * 0.5,
            display = majorTicks.display;
        ar.set("leftTickOffset",  0);
        ar.set("rightTickOffset",  0);

        switch(display)
        {
            case "inside" :
                ar.set("topTickOffset", tickLength);
                ar.set("bottomTickOffset", 0);
            break;
            case "outside" : 
                ar.set("topTickOffset", 0);
                ar.set("bottomTickOffset", tickLength);
            break;
            case "cross":
                ar.set("topTickOffset",  halfTick);
                ar.set("bottomTickOffset",  halfTick);
            break;
            default:
                ar.set("topTickOffset", 0);
                ar.set("bottomTickOffset", 0);
            break;
        }
    },

    /**
     * Calculates the coordinates for the first point on an axis.
     *
     * @method getLineStart
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
            pt = {x:0, y:padding.top};
        if(display === "inside")
        {
            pt.y += tickLength;
        }
        else if(display === "cross")
        {
            pt.y += tickLength/2;
        }
        return pt; 
    },
    
    /**
     * Draws a tick
     *
     * @method drawTick
     * @param {Object} pt hash containing x and y coordinates
     * @param {Object} tickStyles hash of properties used to draw the tick
     * @protected
     */
    drawTick: function(pt, tickStyles)
    {
        var ar = this.get("axisRenderer"),
            style = ar.get("styles"),
            padding = style.padding,
            tickLength = tickStyles.length,
            start = {x:pt.x, y:padding.top},
            end = {x:pt.x, y:tickLength + padding.top};
        ar.drawLine(start, end, tickStyles);
    },

    /**
     * Calculates the point for a label.
     *
     * @method getLabelPoint
     * @param {Object} pt hash containing x and y coordinates
     * @return Object
     * @protected
     */
    getLabelPoint: function(point)
    {
        var ar = this.get("axisRenderer");
        return {x:point.x, y:point.y + ar.get("bottomTickOffset")};
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
            this.set("maxLabelSize", Math.max(this.get("maxLabelSize"), label.offsetHeight));
        }
        else
        {
            label.style.msTransform = "rotate(0deg)";
            if(rot === 0)
            {
                max = label.offsetHeight;
            }
            else if(absRot === 90)
            {
                max = label.offsetWidth;
            }
            else
            {
                max = (sinRadians * label.offsetWidth) + (cosRadians * label.offsetHeight); 
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
            tickOffset = ar.get("bottomTickOffset"),
            style = ar.get("styles").label,
            labelAlpha = style.alpha,
            filterString,
            margin = 0,
            leftOffset = Math.round(pt.x),
            topOffset = Math.round(pt.y),
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
        if(style.margin && style.margin.top)
        {
            margin = style.margin.top;
        }
        if(!document.createElementNS)
        {
            m11 = cosRadians;
            m12 = rot > 0 ? -sinRadians : sinRadians;
            m21 = -m12;
            m22 = m11;
            label.style.filter = null;
            labelWidth = Math.round(label.offsetWidth);
            labelHeight = Math.round(label.offsetHeight);
            if(absRot === 90)
            {
                leftOffset -= labelHeight * 0.5;
            }
            else if(rot < 0)
            {
                leftOffset -= cosRadians * labelWidth;
                leftOffset -= sinRadians * (labelHeight * 0.5);
            }
            else if(rot > 0)
            {
               leftOffset -= sinRadians * (labelHeight * 0.5);
            }
            else
            {
                leftOffset -= labelWidth * 0.5;
            }
            topOffset += margin;
            topOffset += tickOffset;
            label.style.left = Math.round(leftOffset) + "px";
            label.style.top = Math.round(topOffset) + "px";
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
            leftOffset -= labelWidth * 0.5;
        }
        else if(absRot === 90)
        {
            if(rot === 90)
            {
                leftOffset += labelHeight * 0.5;
            }
            else
            {
                topOffset += labelWidth;
                leftOffset -= labelHeight * 0.5;
            }
        }
        else 
        {
            if(rot < 0)
            {
                leftOffset -= (cosRadians * labelWidth) + (sinRadians * (labelHeight * 0.6));
                topOffset += sinRadians * labelWidth;
            }
            else
            {
                leftOffset += Math.round(sinRadians * (labelHeight * 0.6));
            }
        }
        topOffset += margin;
        topOffset += tickOffset;
        label.style.left = Math.round(leftOffset) + "px";
        label.style.top = Math.round(topOffset) + "px";
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
        var labelSize = this.get("maxLabelSize"),
            ar = this.get("axisRenderer"),
            tickLength = ar.get("bottomTickLength"),
            style = ar.get("styles"),
            sz = tickLength + labelSize,
            margin = style.label.margin;
        if(margin && margin.top)
        {   
            sz += margin.top;
        }
        sz = Math.round(sz);
        ar.set("height", sz);
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
        var ar = this.get("axisRenderer");
        ar.get("contentBox").setStyle("top", 0 - ar.get("topTickOffset"));
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
            ttl = Math.round(ar.get("bottomTickOffset") + this.get("maxLabelSize") + style.margin.top);
        ar.set("height", ttl);
    }
});

Y.BottomAxisLayout = BottomAxisLayout;
