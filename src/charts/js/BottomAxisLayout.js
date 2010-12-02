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
    
    /**
     * Rotate and position labels.
     */
    positionLabel: function(label, pt)
    {
        var ar = this.get("axisRenderer"),
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
            label.style.left = Math.round(leftOffset) + "px";
            label.style.top = Math.round(topOffset) + "px";
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
     */
    setSizeAndPosition: function()
    {
        var labelSize = this.get("maxLabelSize"),
            ar = this.get("axisRenderer"),
            style = ar.get("styles"),
            sz = style.line.weight,
            majorTicks = style.majorTicks,
            display = majorTicks.display,
            tickLen = majorTicks.length,
            margin = style.label.margin;
        if(display === "outside")
        {
            sz += tickLen;
        }
        else if(display === "cross")
        {
            sz += tickLen * 0.5;
        }
        if(margin && margin.top)
        {   
            sz += margin.top;
        }
        sz += labelSize;
        sz = Math.round(sz);
        ar.set("height", sz);
    },

    /**
     * Adjusts position for inner ticks.
     */
    offsetNodeForTick: function(cb)
    {
        var ar = this.get("axisRenderer"),
            styles = ar.get("styles"),
            majorTicks = styles.majorTicks,
            tickLength = majorTicks.length,
            display = majorTicks.display,
            line = styles.line,
            weight;
        if(line)
        {
            weight = line.weight || 0;
        }
        if(display === "inside")
        {
            cb.setStyle("marginTop", (0 - (tickLength - weight/2)) + "px");
        }
        else if (display === "cross")
        {
            cb.setStyle("marginTop", (0 - (tickLength * 0.5)) + "px");
        }
    },

    setCalculatedSize: function()
    {
        var ar = this.get("axisRenderer"),
            style = ar.get("styles").label,
            ttl = ar.get("bottomTickOffset") + this.get("maxLabelSize") + style.margin.top;
            ar.set("height", Math.round(ttl));
    }
});

Y.BottomAxisLayout = BottomAxisLayout;
