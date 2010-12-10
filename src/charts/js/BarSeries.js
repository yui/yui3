/**
 * The BarSeries class renders bars positioned vertically along a category or time axis. The bars'
 * lengths are proportional to the values they represent along a horizontal axis.
 * and the relevant data points.
 *
 * @class BarSeries
 * @extends MarkerSeries
 * @uses Histogram
 * @constructor
 */
Y.BarSeries = Y.Base.create("barSeries", Y.MarkerSeries, [Y.Histogram], {
    /**
     * @private
     */
    renderUI: function()
    {
        this._setNode();
    },

    /**
     * @private
     */
    _getMarkerDimensions: function(xcoord, ycoord, calculatedSize, offset)
    {
        var config = {
            top: ycoord + offset,
            left: this._leftOrigin
        };
        config.calculatedSize = xcoord - config.left;
        return config;
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
            var styles = Y.clone(this.get("styles").marker),
                markerStyles,
                state = this._getState(type),
                xcoords = this.get("xcoords"),
                ycoords = this.get("ycoords"),
                marker = this._markers[i],
                graph = this.get("graph"),
                seriesCollection = graph.seriesTypes[this.get("type")],
                seriesLen = seriesCollection.length,
                seriesSize = 0,
                offset = 0,
                renderer,
                n = 0,
                ys = [],
                order = this.get("order");
            markerStyles = state == "off" || !styles[state] ? styles : styles[state]; 
            markerStyles.fill.color = this._getItemColor(markerStyles.fill.color, i);
            markerStyles.border.color = this._getItemColor(markerStyles.border.color, i);
            markerStyles.width = (xcoords[i] - this._leftOrigin);
            marker.update(markerStyles);
            for(; n < seriesLen; ++n)
            {
                renderer = seriesCollection[n].get("markers")[i];
                ys[n] = ycoords[i] + seriesSize;
                seriesSize += renderer.height;
                if(order > n)
                {
                    offset = seriesSize;
                }
                offset -= seriesSize/2;
            }
            for(n = 0; n < seriesLen; ++n)
            {
                renderer = Y.one(seriesCollection[n]._graphicNodes[i]);
                renderer.setStyle("top", (ys[n] - seriesSize/2));
            }
        }
    }
}, {
    ATTRS: {
        /**
         * Read-only attribute indicating the type of series.
         *
         * @attribute type
         * @type String
         * @default bar
         */
        type: {
            value: "bar"
        },

        /**
         * Indicates the direction of the category axis that the bars are plotted against.
         *
         * @attribute direction
         * @type String
         */
        direction: {
            value: "vertical"
        }
    }
});
