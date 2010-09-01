/**
 * Contains algorithms for rendering a bottom axis.
 */
function BottomAxisLayout(config)
{
    BottomAxisLayout.superclass.constructor.apply(this, arguments);
}

BottomAxisLayout.ATTRS = {
    axisRenderer: {
        value:null
    },

    maxLabelSize: {
        value: 0
    }
};

Y.extend(BottomAxisLayout, Y.Base, {
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
                ar.set("topTickOffset",  tickLength);
            break;
            case "outside" : 
                ar.set("bottomTickOffset",  tickLength);
            break;
            case "cross":
                ar.set("topTickOffset",  halfTick);
                ar.set("bottomTickOffset",  halfTick);
            break;
        }
    },
    
    /**
     * Calculates the size and positions the content elements.
     */
    setSizeAndPosition: function()
    {
        var labelSize = this.get("maxLabelSize"),
            ar = this.get("axisRenderer"),
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
        ar.set("height", sz);
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
    getLabelPoint: function(point)
    {
        var ar = this.get("axisRenderer");
        return {x:point.x, y:point.y + ar.get("bottomTickOffset")};
    },
    
    /**
     * Rotate and position labels.
     */
    positionLabel: function(label, pt)
    {
        var ar = this.get("axisRenderer"),
            style = ar.get("styles").label,
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
            max = 0,
            maxLabelSize = this.get("maxLabelSize");
        if(label.margin && label.margin.top)
        {
            margin = label.margin.top;
        }
        if(Y.UA.ie)
        {
            m11 = cosRadians;
            m12 = rot > 0 ? -sinRadians : sinRadians;
            m21 = -m12;
            m22 = m11;
            label.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(rotation=0)";
            if(absRot === 90)
            {
                leftOffset -= label.offsetHeight * 0.5;
            }
            else if(rot < 0)
            {
                leftOffset -= cosRadians * label.offsetWidth;
                leftOffset -= sinRadians * (label.offsetHeight * 0.5);
            }
            else if(rot > 0)
            {
                leftOffset -= sinRadians * (label.offsetHeight * 0.5);
            }
            else
            {
                leftOffset -= label.offsetWidth * 0.5;
            }
            topOffset += margin;
            label.style.left = leftOffset + "px";
            label.style.top = topOffset + "px";
            label.style.filter = 'progid:DXImageTransform.Microsoft.Matrix(M11=' + m11 + ' M12=' + m12 + ' M21=' + m21 + ' M22=' + m22 + ' sizingMethod="auto expand")';
            this.set("maxLabelSize", Math.max(label.offsetHeight, maxLabelSize));
            return;
        }
        if(rot === 0)
        {
            leftOffset -= label.offsetWidth * 0.5;
            max = label.offsetHeight;
        }
        else if(absRot === 90)
        {
            max = label.offsetWidth;
            if(rot === 90)
            {
                leftOffset += label.offsetHeight * 0.5;
            }
            else
            {
                topOffset += max;
                leftOffset -= label.offsetHeight * 0.5;
            }
        }
        else 
        {
            max = (sinRadians * label.offsetWidth) + (cosRadians * label.offsetHeight); 
            if(rot < 0)
            {
                leftOffset -= (cosRadians * label.offsetWidth) + (sinRadians * (label.offsetHeight * 0.6));
                topOffset += sinRadians * label.offsetWidth;
            }
            else
            {
                leftOffset += sinRadians * (label.offsetHeight * 0.6);
            }
        }
        topOffset += margin;
        label.style.left = leftOffset + "px";
        label.style.top = topOffset + "px";
        label.style.MozTransformOrigin =  "0 0";
        label.style.MozTransform = "rotate(" + rot + "deg)";
        label.style.webkitTransformOrigin = "0 0";
        label.style.webkitTransform = "rotate(" + rot + "deg)";
        this.set("maxLabelSize", Math.max(max, maxLabelSize));
    },

    /**
     * Adjusts position for inner ticks.
     */
    offsetNodeForTick: function(node)
    {
        var ar = this.get("axisRenderer"),
            majorTicks = ar.get("styles").majorTicks,
            tickLength = majorTicks.length,
            display = majorTicks.display;
        if(display === "inside")
        {
            node.style.marginTop = (0 - tickLength) + "px";
        }
        else if (display === "cross")
        {
            node.style.marginTop = (0 - (tickLength * 0.5)) + "px";
        }
    }
});

Y.BottomAxisLayout = BottomAxisLayout;
