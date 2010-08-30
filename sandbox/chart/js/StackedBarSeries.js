function StackedBarSeries(config)
{
	StackedBarSeries.superclass.constructor.apply(this, arguments);
}

StackedBarSeries.NAME = "stackedBarSeries";

StackedBarSeries.ATTRS = {
	type: {
        value: "stackedBar"
    },
    direction: {
        value: "vertical"
    },

    negativeBaseValues: {
        value: null
    },

    positiveBaseValues: {
        value: null
    }
};

Y.extend(StackedBarSeries, Y.CartesianSeries, {
    /**
     * @private
     */
    renderUI: function()
    {
        this._setNode();
    },
    
    bindUI: function()
    {
        Y.delegate("mouseover", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
        Y.delegate("mousedown", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
        Y.delegate("mouseup", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
        Y.delegate("mouseout", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
    },
    
    drawSeries: function()
	{
	    if(this.get("xcoords").length < 1) 
		{
			return;
		}
        var style = this._mergeStyles(this.get("styles"), {}),
            w = style.width,
            h = style.height,
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            i = 0,
            len = xcoords.length,
            top = ycoords[0],
            type = this.get("type"),
            graph = this.get("graph"),
            seriesCollection = graph.seriesTypes[type],
            totalHeight = 0,
            ratio,
            order = this.get("order"),
            lastCollection,
            negativeBaseValues,
            positiveBaseValues,
            useOrigin = order === 0,
            node = Y.Node.one(this._parentNode).get("parentNode"),
            left,
            marker,
            bb;
        totalHeight = len * h;
        this._createMarkerCache();
        if(totalHeight > node.offsetHeight)
        {
            ratio = this.height/totalHeight;
            h *= ratio;
            h = Math.max(h, 1);
        }
        if(!useOrigin)
        {
            lastCollection = seriesCollection[order - 1];
            negativeBaseValues = lastCollection.get("negativeBaseValues");
            positiveBaseValues = lastCollection.get("positiveBaseValues");
        }
        else
        {
            negativeBaseValues = [];
            positiveBaseValues = [];
        }
        this.set("negativeBaseValues", negativeBaseValues);
        this.set("positiveBaseValues", positiveBaseValues);
        for(i = 0; i < len; ++i)
        {
            top = ycoords[i];
            left = xcoords[i];
            
            if(useOrigin)
            {
                w = left - this._leftOrigin;
                if(left > this._leftOrigin)
                {
                    positiveBaseValues[i] = left;
                    negativeBaseValues[i] = this._leftOrigin;
                }
                else if(left < this._leftOrigin)
                {   
                    positiveBaseValues[i] = this._leftOrigin;
                    negativeBaseValues[i] = left;
                }
                else
                {
                    positiveBaseValues[i] = left;
                    negativeBaseValues[i] = this._leftOrigin;
                }
                left -= w;
            }
            else
            {
                if(left < this._leftOrigin)
                {
                    left = negativeBaseValues[i] - (this._leftOrigin - xcoords[i]);
                    w = negativeBaseValues[i] - left;
                    negativeBaseValues[i] = left;
                }
                else if(left > this._leftOrigin)
                {
                    left += (positiveBaseValues[i] - this._leftOrigin);
                    w = left - positiveBaseValues[i];
                    positiveBaseValues[i] = left;
                    left -= w;
                }
            }
            top -= h/2;        
            style.width = w;
            style.height = h;
            marker = this.getMarker.apply(this, [{index:i, styles:style}]);
            bb = marker.get("boundingBox");
            bb.setStyle("position", "absolute");
            bb.setStyle("left", left + "px");
            bb.setStyle("top", top + "px");
        }
        this._clearMarkerCache();
 	},
    
    /**
     * @private
     * Resizes and positions markers based on a mouse interaction.
     */
    _markerEventHandler: function(e)
    {
        var type = e.type,
            marker = Y.Widget.getByNode(e.currentTarget),
            ycoords = this.get("ycoords"),
            i = marker.get("index") || Y.Array.indexOf(this.get("markers"), marker),
            h = marker.get("height");
        switch(type)
        {
            case "mouseout" :
                marker.set("state", "off");
            break;
            case "mouseover" :
                marker.set("state", "over");
            break;
            case "mouseup" :
                marker.set("state", "over");
            break;
            case "mousedown" :
                marker.set("state", "down");
            break;
        }
        marker.get("boundingBox").setStyle("top", (ycoords[i] - h/2) + "px");    
    },
	
	/**
	 * @private
	 */
    _getDefaultStyles: function()
    {
        return {
            fill: {
                alpha: "1",
                colors: [],
                alphas: [],
                ratios: [],
                rotation: 0
            },
            width: 6,
            height: 6,
            shape: "rect",
            padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }
        };
    }
});

Y.StackedBarSeries = StackedBarSeries;
