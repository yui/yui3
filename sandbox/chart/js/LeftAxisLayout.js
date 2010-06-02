function LeftAxisLayout(renderer)
{
    LeftAxisLayout.superclass.constructor.apply(this, arguments);
}

LeftAxisLayout.ATTRS = {
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

Y.extend(LeftAxisLayout, Y.Base, {
    _axisRenderer: null,

    setTickOffsets: function()
    {
        var ar = this.get("axisRenderer"),
            majorTicks = ar.get("styles").majorTicks,
            tickLength = majorTicks.length,
            halfTick = tickLength * 0.5,
            display = majorTicks.display;
        ar.set("topTickOffset",  0);
        ar.set("bottomTickOffset",  0);
        ar.set("maxTickLength", tickLength);
        
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
     * Draws a tick
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
     * Calculates the point for a label.
     */
    getLabelPoint: function(point)
    {
        var ar = this.get("axisRenderer");
        return {x:point.x - ar.get("leftTickOffset"), y:point.y};
    },

    positionLabel: function(label, pt)
    {
        var ar = this.get("axisRenderer"),
            style = ar.get("styles").label,
            leftOffset = 0,
            topOffset = 0,
            rot =  Math.min(90, Math.max(-90, style.rotation)),
            absRot = Math.abs(rot),
            radCon = Math.PI/180,
            sinRadians = Math.sin(absRot * radCon),
            cosRadians = Math.cos(absRot * radCon);
        if(rot === 0)
        {
            leftOffset = label.offsetWidth;
            topOffset = label.offsetHeight * 0.5;
            label.style.left = (pt.x - leftOffset) + "px";
            label.style.top =  (pt.y - topOffset) + "px";
        }
        else if(rot === 90)
        {
            leftOffset = 0;
            topOffset = label.offsetWidth * 0.5;
            label.style.left = (pt.x - leftOffset) + "px";
            label.style.top =  (pt.y - topOffset) + "px";
        }
        else if(rot === -90)
        {
            leftOffset = label.offsetHeight;
            topOffset = label.offsetWidth * 0.5;
            label.style.left = (pt.x - leftOffset) + "px";
            label.style.top = (pt.y + topOffset) + "px";
        }
        else if(rot < 0)
        {
            
            leftOffset = (cosRadians * label.offsetWidth) + (sinRadians * label.offsetHeight);
            topOffset = (sinRadians * label.offsetWidth) - (cosRadians * (label.offsetHeight * 0.6)); 
            label.style.left = (pt.x - leftOffset) + "px";
            label.style.top = (pt.y + topOffset) + "px";
        }
        else
        {
            topOffset = (sinRadians * label.offsetWidth) + (cosRadians * (label.offsetHeight * 0.6));
            leftOffset = (cosRadians * label.offsetWidth);
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
            node.style.marginRight = (0 - tickLength) + "px";
        }
        else if (display === "cross")
        {
            node.style.marginRight = (0 - (tickLength * 0.5)) + "px";
        }
    }
});

Y.LeftAxisLayout = LeftAxisLayout;
