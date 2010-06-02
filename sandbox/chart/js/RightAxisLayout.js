function RightAxisLayout(renderer)
{
    RightAxisLayout.superclass.constructor.apply(this, arguments);
}

RightAxisLayout.ATTRS = {
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

Y.extend(RightAxisLayout, Y.Base, {
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
                ar.set("leftTickOffset",  tickLength);
            break;
            case "outside" : 
                ar.set("rightTickOffset",  tickLength);
            break;
            case "cross":
                ar.set("rightTickOffset",  halfTick);
                ar.set("leftTickOffset",  halfTick);
            break;
        }
    },

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
     */
    getLabelPoint: function(point)
    {
        var ar = this.get("axisRenderer");
        return {x:point.x + ar.get("rightTickOffset"), y:point.y};
    },

    positionLabel: function(label, pt)
    {
        var ar = this.get("axisRenderer"),
            style = ar.get("styles").label,
            leftOffset = 0,
            topOffset = 0,
            rot =  style.rotation,
            absRot = Math.abs(rot),
            radCon = Math.PI/180,
            sinRadians = Math.sin(absRot * radCon),
            cosRadians = Math.cos(absRot * radCon);
            rot = Math.min(90, rot);
            rot = Math.max(-90, rot);
        if(rot === 0)
        {
            topOffset = label.offsetHeight * 0.5;
            label.style.left = pt.x + "px";
            label.style.top =  (pt.y - topOffset) + "px";
        }
        else if(rot === 90)
        {
            leftOffset = label.offsetHeight;
            topOffset = label.offsetWidth * 0.5;
            label.style.left = (pt.x + leftOffset) + "px";
            label.style.top =  (pt.y - topOffset) + "px";
        }
        else if(rot === -90)
        {
            topOffset = label.offsetWidth * 0.5;
            label.style.left = pt.x + "px";
            label.style.top = (pt.y + topOffset) + "px";
        }
        else if(rot < 0)
        {
            topOffset = (cosRadians * (label.offsetHeight * 0.6)); 
            label.style.left = pt.x + "px";
            label.style.top = (pt.y - topOffset) + "px";
        }
        else
        {
            topOffset = cosRadians * (label.offsetHeight * 0.6);
            leftOffset = sinRadians * label.offsetHeight;
            label.style.left = (pt.x + leftOffset) + "px";
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
            node.style.marginLeft = (0 - tickLength) + "px";
        }
        else if (display === "cross")
        {
            node.style.marginLeft = (0 - (tickLength * 0.5)) + "px";
        }
    }
});

Y.RightAxisLayout = RightAxisLayout;
