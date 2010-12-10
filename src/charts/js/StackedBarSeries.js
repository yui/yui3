/**
 * The StackedBarSeries renders bar chart in which series are stacked horizontally to show
 * their contribution to the cumulative total.
 *
 * @class StackedBarSeries
 * @extends BarSeries
 * @uses StackingUtil
 * @constructor
 */
Y.StackedBarSeries = Y.Base.create("stackedBarSeries", Y.BarSeries, [Y.StackingUtil], {
    /**
     * @protected
     *
     * Draws the series.
     *
     * @method drawSeries
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
            totalHeight = len * h,
            mnode;
        this._createMarkerCache();
        if(totalHeight > this.get("height"))
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
            marker = this.getMarker(style, graphOrder, i);
            mnode = Y.one(marker.parentNode);
            mnode.setStyle("position", "absolute");
            mnode.setStyle("left", left);
            mnode.setStyle("top", top);
        }
        this._clearMarkerCache();
    },

    /**
     * @protected
     *
     * Resizes and positions markers based on a mouse interaction.
     *
     * @method updateMarkerState
     * @param {String} type state of the marker
     * @param {Number} i index of the marker
     */
    updateMarkerState: function(type, i)
    {
        if(this._markers[i])
        {
            var state = this._getState(type),
                ycoords = this.get("ycoords"),
                marker = this._markers[i],
                styles = this.get("styles").marker,
                h = styles.height,
                markerStyles = state == "off" || !styles[state] ? styles : styles[state]; 
            markerStyles.width = marker.width;
            marker.update(markerStyles);
            if(marker.parentNode)
            {
                Y.one(marker.parentNode).setStyle("top", (ycoords[i] - h/2));
            }
        }
    },
	
    /**
     * @protected
     *
     * Returns default values for the <code>styles</code> attribute.
     * 
     * @method _getPlotDefaults
     * @return Object
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
        /**
         * Read-only attribute indicating the type of series.
         *
         * @attribute type
         * @type String
         * @default stackedBar
         */
        type: {
            value: "stackedBar"
        },

        /**
         * Direction of the series
         *
         * @attribute direction
         * @type String
         * @default vertical
         */
        direction: {
            value: "vertical"
        },

        /**
         * @private
         */
        negativeBaseValues: {
            value: null
        },

        /**
         * @private
         */
        positiveBaseValues: {
            value: null
        }
    }
});

