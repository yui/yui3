Y.StackedColumnSeries = Y.Base.create("stackedColumnSeries", Y.ColumnSeries, [Y.StackingUtil], {
    /**
	 * @private
	 */
	drawSeries: function()
	{
	    if(this.get("xcoords").length < 1) 
		{
			return;
		}
        var style = this.get("styles").marker, 
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
            ratio,
            order = this.get("order"),
            graphOrder = this.get("graphOrder"),
            left,
            marker,
            lastCollection,
            negativeBaseValues,
            positiveBaseValues,
            useOrigin = order === 0,
            totalWidth = len * w,
            mnode;
        this._createMarkerCache();
        if(totalWidth > this.get("width"))
        {
            ratio = this.width/totalWidth;
            w *= ratio;
            w = Math.max(w, 1);
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
            if(useOrigin)
            {
                h = this._bottomOrigin - top;
                if(top < this._bottomOrigin)
                {
                    positiveBaseValues[i] = top;
                    negativeBaseValues[i] = this._bottomOrigin;
                }
                else if(top > this._bottomOrigin)
                {
                    positiveBaseValues[i] = this._bottomOrigin;
                    negativeBaseValues[i] = top;
                }
                else
                {
                    positiveBaseValues[i] = top;
                    negativeBaseValues[i] = top;
                }
            }
            else 
            {
                if(top > this._bottomOrigin)
                {
                    top += (negativeBaseValues[i] - this._bottomOrigin);
                    h = negativeBaseValues[i] - top;
                    negativeBaseValues[i] = top;
                }
                else if(top < this._bottomOrigin)
                {
                    top = positiveBaseValues[i] - (this._bottomOrigin - ycoords[i]);
                    h = positiveBaseValues[i] - top;
                    positiveBaseValues[i] = top;
                }
            }
            left = xcoords[i] - w/2;
            style.width = w;
            style.height = h;
            marker = this.getMarker(style, graphOrder, i);
            mnode = Y.one(marker.parentNode);
            mnode.setStyle("position", "absolute");
            mnode.setStyle("left", left);
            mnode.setStyle("top", top);
        }
        this._clearMarkerCache();
    },

    /**
     * @private
     * Resizes and positions markers based on a mouse interaction.
     */
    updateMarkerState: function(type, i)
    {
        if(this._markers[i])
        {
            var styles,
                markerStyles,
                state = this._getState(type),
                xcoords = this.get("xcoords"),
                marker = this._markers[i],
                offset = 0;        
            styles = this.get("styles").marker;
            markerStyles = state == "off" || !styles[state] ? styles : styles[state]; 
            markerStyles.height = marker.height;
            marker.update(markerStyles);
            offset = styles.width * 0.5;
            if(marker.parentNode)
            {
                Y.one(marker.parentNode).setStyle("left", (xcoords[i] - offset));
            }
        }
    },
	
	/**
	 * @private
	 */
    _getPlotDefaults: function()
    {
        var defs = {
            fill:{
                type: "solid",
                alpha: 1,
                colors:null,
                alphas: null,
                ratios: null
            },
            border:{
                weight: 0,
                alpha: 1
            },
            width: 24,
            height: 24,
            shape: "rect",

            padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }
        };
        defs.fill.color = this._getDefaultColor(this.get("graphOrder"), "fill");
        defs.border.color = this._getDefaultColor(this.get("graphOrder"), "border");
        return defs;
    }
}, {
    ATTRS: {
        type: {
            value: "stackedColumn"
        },

        negativeBaseValues: {
            value: null
        },

        positiveBaseValues: {
            value: null
        }
    }
});

