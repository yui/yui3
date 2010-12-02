/**
 * Contains algorithms for rendering a top axis.
 */
function TopAxisLayout(config)
{
    TopAxisLayout.superclass.constructor.apply(this, arguments);
}

TopAxisLayout.ATTRS = {
    axisRenderer: {
        value: null
    }
};

Y.extend(TopAxisLayout, Y.Base, {
    /**
     * Sets the length of the tick on either side of the axis line.
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
                ar.set("bottomTickOffset",  tickLength);
            break;
            case "outside" : 
                ar.set("topTickOffset",  tickLength);
            break;
            case "cross":
                ar.set("topTickOffset",  halfTick);
                ar.set("bottomTickOffset",  halfTick);
            break;
        }
    },

    /**
     * Calculates the coordinates for the first point on an axis.
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
    
    /**
     * Draws a tick
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
     */
    getLabelPoint: function(pt)
    {
        var ar = this.get("axisRenderer");
        return {x:pt.x, y:pt.y - ar.get("topTickOffset")};
    },
    
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
            this.set("maxLabelSize", Math.max(this.get("maxLabelSize"), label.offsetHeight));
        }
        else
        {
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

    positionLabel: function(label, pt)
    {
        var ar = this.get("axisRenderer"),
            style = ar.get("styles").label,
            labelAlpha = style.alpha,
            filterString,
            margin = 0,
            leftOffset = pt.x,
            topOffset = pt.y,
            rot =  Math.max(-90, Math.min(90, style.rotation)),
            absRot = Math.abs(rot),
            radCon = Math.PI/180,
            sinRadians = parseFloat(parseFloat(Math.sin(absRot * radCon)).toFixed(8)),
            cosRadians = parseFloat(parseFloat(Math.cos(absRot * radCon)).toFixed(8)),
            m11,
            m12,
            m21,
            m22,
            labelWidth = Math.round(label.offsetWidth),
            labelHeight = Math.round(label.offsetHeight);
        rot = Math.min(90, rot);
        rot = Math.max(-90, rot);
        if(style.margin && style.margin.bottom)
        {
            margin = style.margin.bottom;
        }
        if(!document.createElementNS)
        {
            label.style.filter = null;
            m11 = cosRadians;
            m12 = rot > 0 ? -sinRadians : sinRadians;
            m21 = -m12;
            m22 = m11;
            if(rot === 0)
            {
                leftOffset -= labelWidth * 0.5;
                topOffset -= labelHeight;
            }
            else if(absRot === 90)
            {
                leftOffset -= labelHeight * 0.5;
                topOffset -= labelWidth;
            }
            else if(rot > 0)
            {
                leftOffset -= (cosRadians * labelWidth) + Math.min((sinRadians * labelHeight), (rot/180 * labelHeight));
                topOffset -= (sinRadians * labelWidth) + (cosRadians * (labelHeight));
            }
            else
            {
                leftOffset -= sinRadians * (labelHeight * 0.5);
                topOffset -= (sinRadians * labelWidth) + (cosRadians * (labelHeight));
            }
            topOffset -= margin;
            label.style.left = leftOffset;
            label.style.top = topOffset;
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
        labelWidth = Math.round(label.offsetWidth);
        labelHeight = Math.round(label.offsetHeight);
        if(rot === 0)
        {
            leftOffset -= labelWidth * 0.5;
            topOffset -= labelHeight;
        }
        else if(rot === 90)
        {
            leftOffset += labelHeight * 0.5;
            topOffset -= labelWidth;
        }
        else if(rot === -90)
        {
            leftOffset -= labelHeight * 0.5;
            topOffset -= 0;
        }
        else if(rot < 0)
        {
            
            leftOffset -= (sinRadians * (labelHeight * 0.6));
            topOffset -= (cosRadians * labelHeight);
        }
        else
        {
            leftOffset -= (cosRadians * labelWidth) - (sinRadians * (labelHeight * 0.6));
            topOffset -= (sinRadians * labelWidth) + (cosRadians * labelHeight);
        }
        topOffset -= margin;
        label.style.left = leftOffset + "px";
        label.style.top =  topOffset + "px";
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
     */
    setSizeAndPosition: function(labelSize)
    {
        var ar = this.get("axisRenderer"),
            style = ar.get("styles"),
            sz = style.line.weight,
            majorTicks = style.majorTicks,
            display = majorTicks.display,
            tickLen = majorTicks.length;
        if(display === "outside")
        {
            sz += tickLen;
        }
        else if(display === "cross")
        {
            sz += tickLen * 0.5;
        }
        sz += labelSize;
        ar.get("contentBox").setStyle("top", labelSize + "px");
        ar.set("height", sz);
    },
    
    offsetNodeForTick: function(cb)
    {
        var ar = this.get("axisRenderer"),
            majorTicks = ar.get("styles").majorTicks,
            tickLength = majorTicks.length,
            display = majorTicks.display;
        if(display === "inside")
        {
            cb.setStyle("marginBottom", (0 - tickLength) + "px");
        }
        else if (display === "cross")
        {
            cb.setStyle("marginBottom", (0 - (tickLength * 0.5)) + "px");
        }
    },

    setCalculatedSize: function()
    {
        var ar = this.get("axisRenderer"),
            style = ar.get("styles").label,
            ttl = ar.get("topTickOffset") + this.get("maxLabelSize") + style.margin.bottom;
            ar.set("height", ttl);
    }
});

Y.TopAxisLayout = TopAxisLayout;

