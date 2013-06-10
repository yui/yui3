/**
 * Provides functionality for creating a gantt series.
 *
 * @module charts
 * @submodule series-gantt
 */

/**
 * An abstract class for creating gantt series instances.
 *
 * @class GanttSeries
 * @extends CartesianSeries
 * @constructor
 * @param {Object} config (optional) Configuration parameters.
 * @submodule series-gantt
 */
Y.GanttSeries = Y.Base.create("ganttSeries", Y.CartesianSeries, [Y.Plots], {
    /**
     * Draws the series.
     *
     * @method drawSeries
     * @protected
     */
    drawSeries: function()
    {
        var xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            styles = this._copyObject(this.get("styles")),
            markerStyles = styles.marker,
            markerHeight = markerStyles.height,
            padding = styles.padding,
            len = ycoords.length,
            keys = this.get("ganttkeys"),
            startcoords = xcoords[keys.start],
            endcoords = xcoords[keys.end],
            fillColors,
            borderColors,
            graphOrder = this.get("graphOrder"),
            i;
        if(Y.Lang.isArray(markerStyles.fill.color))
        {
            fillColors = markerStyles.fill.color;   
        }
        if(Y.Lang.isArray(markerStyles.border.color))
        {
            borderColors = markerStyles.border.color;   
        }
        this._createMarkerCache();
        for(i = 0; i < len; i = i + 1)
        {
            if(isNaN(ycoords[i]) || isNaN(startcoords[i]) || isNaN(endcoords[i]))
            {
                this._markers.push(null);
            }
            else
            {
                markerStyles.x = startcoords[i];
                markerStyles.y = ycoords[i] - markerHeight/2;
                markerStyles.width = endcoords[i] - markerStyles.x;
                if(fillColors)
                {
                    markerStyles.fill.color = fillColors[i % fillColors.length];
                }
                if(borderColors)
                {
                    markerStyles.border.color = borderColors[i % borderColors.length];
                }
                marker = this.getMarker(markerStyles, graphOrder, i);
            }
        }
        this._clearMarkerCache();
    },
     
    /**
     * Resizes and positions markers based on a mouse interaction.
     *
     * @method updateMarkerState
     * @param {String} type state of the marker
     * @param {Number} i index of the marker
     * @protected
     */
    updateMarkerState: function(type, i) {
        if(this._markers && this._markers[i])
        {
            var w,
                h,
                styles = this._copyObject(this.get("styles").marker),
                state = this._getState(type),
                marker = this._markers[i],
                markerStyles = state === "off" || !styles[state] ? styles : styles[state];
                markerStyles.fill.color = this._getItemColor(markerStyles.fill.color, i);
                markerStyles.border.color = this._getItemColor(markerStyles.border.color, i);
                markerStyles.y = marker.get("y");
                markerStyles.x = marker.get("x");
                markerStyles.width = marker.get("width");
                markerStyles.stroke = markerStyles.border;
                marker.set(markerStyles);
                marker.set("visible", this.get("visible"));
        }
    },

    /**   
     * Gets the default style values for the markers.
     *
     * @method _getPlotDefaults
     * @return Object
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
            height: 12,
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
         * @default gantt
         */
        type: {
            value: "gantt"
        },

        /**
         * Values to be used for start and end keys.
         *
         * @attribute gantkeys 
         * @type Object
         */
        ganttkeys: {
            valueFn: function() {
                return {
                    start: "start",
                    end: "end"
                };
            }
        }
    }
});
