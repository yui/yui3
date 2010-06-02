function TopAxisLayout(renderer)
{
    TopAxisLayout.superclass.constructor.apply(this, arguments);
}

TopAxisLayout.ATTRS = {
    axisRenderer: {
        lazyAdd: false,

        getter: function()
        {
            return this._axisRenderer;
        },
        setter: function(val)
        {
            this._axisRenderer = val;
            return val;
        }
    }
};

Y.extend(TopAxisLayout, Y.Base, {
    _axisRenderer: null,

    setTickOffsets: function()
    {
        var ar = this.get("axisRenderer"),
            majorTicks = ar.get("styles").majorTicks,
            tickLength = majorTicks.length,
            halfTick = tickLength * 0.5,
            display = majorTicks.display;
        ar.set("leftTickOffset",  0);
        ar.set("rightTickOffset",  0);
        ar.set("maxTickLength", tickLength);
        
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

    positionLabel: function(label, pt)
    {
        var ar = this.get("axisRenderer"),
            style = ar.get("styles").label,
            leftOffset = 0,
            topOffset = 0,
            rot =  Math.max(-90, Math.min(90, style.rotation)),
            absRot = Math.abs(rot),
            radCon = Math.PI/180,
            sinRadians = Math.sin(absRot * radCon),
            cosRadians = Math.cos(absRot * radCon);
        if(rot === 0)
        {
            leftOffset = label.offsetWidth * 0.5;
            topOffset = label.offsetHeight;
            label.style.left = (pt.x - leftOffset) + "px";
            label.style.top =  ((pt.y - topOffset)) + "px";
        }
        else if(rot === 90)
        {
            leftOffset = label.offsetHeight * 0.5;
            topOffset = label.offsetWidth;
            label.style.left = (pt.x + leftOffset) + "px";
            label.style.top =  (pt.y - topOffset) + "px";
        }
        else if(rot === -90)
        {
            leftOffset = label.offsetHeight * 0.5;
            topOffset = 0;
            label.style.left = (pt.x - leftOffset) + "px";
            label.style.top = (pt.y - topOffset) + "px";
        }
        else if(rot < 0)
        {
            
            leftOffset = (sinRadians * (label.offsetHeight * 0.6));
            topOffset = (cosRadians * label.offsetHeight);
            label.style.left = (pt.x - leftOffset) + "px";
            label.style.top = (pt.y - topOffset) + "px";
        }
        else
        {
            topOffset = (sinRadians * label.offsetWidth) + (cosRadians * label.offsetHeight);
            leftOffset = (cosRadians * label.offsetWidth) - (sinRadians * (label.offsetHeight * 0.6));
            label.style.left = (pt.x - leftOffset) + "px";
            label.style.top = (pt.y - topOffset) + "px";
            
        }
        label.style.MozTransformOrigin =  "0 0";
        label.style.MozTransform = "rotate(" + rot + "deg)";
        label.style.webkitTransformOrigin = "0 0";
        label.style.webkitTransform = "rotate(" + rot + "deg)";
    },

    offsetNodeForTick: function(node)
    {
        var offset,
            ar = this.get("axisRenderer"),
            majorTicks = ar.get("styles").majorTicks,
            tickLength = majorTicks.length,
            display = majorTicks.display;
        if(display === "inside")
        {
            node.style.marginBottom = (0 - tickLength) + "px";
        }
        else if (display === "cross")
        {
            node.style.marginBottom = (0 - (tickLength * 0.5)) + "px";
        }
    }
});

Y.TopAxisLayout = TopAxisLayout;

