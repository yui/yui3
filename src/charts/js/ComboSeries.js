/**
 * The ComboSeries class renders a combination of lines, plots and area fills in a single series. Each
 * series type has a corresponding boolean attribute indicating if it is rendered. By default, lines and plots 
 * are rendered and area is not. 
 *
 * @class ComboSeries
 * @extends CartesianSeries, Fills, Lines, Plots
 * @constructor
 */
Y.ComboSeries = Y.Base.create("comboSeries", Y.CartesianSeries, [Y.Fills, Y.Lines, Y.Plots], {
	/**
     * @protected
     * 
     * Draws the series.
     *
     * @method drawSeries
     */
    drawSeries: function()
    {
        this.get("graphic").clear();
        if(this.get("showAreaFill"))
        {
            this.drawFill.apply(this, this._getClosingPoints());
        }
        if(this.get("showLines")) 
        {
            this.drawLines();
        }
        if(this.get("showMarkers"))
        {
            this.drawPlots();
        }   
    },

    /**
     * @private
     */
    _getDefaultStyles: function()
    {
        var styles = Y.ComboSeries.superclass._getDefaultStyles();
        styles.line = this._getLineDefaults();
        styles.marker = this._getPlotDefaults();
        styles.area = this._getAreaDefaults();
        return styles;
    }
},
{
    ATTRS: {
        /**
         * @private
         */
        type: {
            value:"combo"
        },

        /**
         * Indicates whether a fill is displayed.
         *
         * @attribute showAreaFill
         * @type Boolean
         * @default false
         */
        showAreaFill: {
            value: false
        },

        /**
         * Indicates whether lines are displayed.
         *
         * @attribute showLines
         * @type Boolean
         * @default true
         */
        showLines: {
            value: true
        },

        /**
         * Indicates whether markers are displayed.
         *
         * @attribute showMarkers
         * @type Boolean
         * @default true
         */
        showMarkers: {
            value: true
        },

        /**
         * Reference to the styles of the markers. These styles can also
         * be accessed through the <code>styles</code> attribute. Below are default
         * values:
         *  <table width="100%">
         *      <tr><th>NAME</th><th>DESCRIPTION</th><th>VALUE</th></tr>
         *      <tr><td>fill</td><td colspan="2"> hash containing the following values:</td></tr>
         *      <tr><td></td><td colspan="2">
         *          <table width="100%">
         *              <tr><th>NAME</th><th>DESCRIPTION</th><th>VALUE</th></tr>
         *              <tr><td>color:</td><td>Color of the fill.</td><td>The default value is determined by the order of the series on the graph. The color
         *              will be retrieved from the below array:<br/>
         *              <code>["#6084d0", "#eeb647", "#6c6b5f", "#d6484f", "#ce9ed1", "#ff9f3b", "#93b7ff", "#e0ddd0", "#94ecba", "#309687"]</code>
         *              </td></tr>
         *              <tr><td>alpha:</td><td> Number from 0 to 1 indicating the opacity of the marker fill.</td><td>1</td></tr>
         *          </table>
         *      </td><tr>
         *      <tr><td>border</td><td colspan="2">hash containing the following values:</td></tr>
         *      <tr><td></td><td colspan="2">
         *          <table width="100%">
         *              <tr><th>NAME</th><th>DESCRIPTION</th><th>VALUE</th></tr>
         *              <tr><td>color:</td><td> Color of the border.</td><td>The default value is determined by the order of the series on the graph. The color
         *              will be retrieved from the below array:<br/>
         *              <code>["#205096", "#b38206", "#000000", "#94001e", "#9d6fa0", "#e55b00", "#5e85c9", "#adab9e", "#6ac291", "#006457"]</code>
         *              <tr><td>alpha:</td><td> Number from 0 to 1 indicating the opacity of the marker border.</td><td>1</td></tr>
         *              <tr><td>weight:</td><td> Number indicating the width of the border.</td><td>1</td></tr>
         *          </table>
         *      </td></tr>
         *      <tr><td>width</td><td>indicates the width of the marker.</td><td>10</td></tr>
         *      <tr><td>height</td><td>indicates the height of the marker</td><td>10</td></tr>
         *      <tr><td>over</td><td>hash containing styles for markers when highlighted by a <code>mouseover</code> event.</td><td>The default 
         *      values for each style is null. When an over style is not set, the non-over value will be used. For example,
         *      the default value for <code>marker.over.fill.color</code> is equivalent to <code>marker.fill.color</code>.</td></tr>
         *  </table>
         *
         * @attribute marker
         * @type Object
         */
        marker: {
            lazyAdd: false,
            getter: function()
            {
                return this.get("styles").marker;
            },
            setter: function(val)
            {
                this.set("styles", {marker:val});
            }
        },
        
        /**
         * Reference to the styles of the lines. These styles can also be accessed through the <code>styles</code> attribute.
         * Below are the default values:
         *  <table width="100%">
         *      <tr><th>NAME</th><th>DESCRIPTION</th><th>VALUE</th></tr>
         *      <tr><td>color:</td><td>The color of the line.</td><td> The default value is determined by the order of the series on the graph. The color will be
         *      retrieved from the following array: 
         *      <code>["#426ab3", "#d09b2c", "#000000", "#b82837", "#b384b5", "#ff7200", "#779de3", "#cbc8ba", "#7ed7a6", "#007a6c"]</code>
         *      <tr><td>weight: </td><td>Number that indicates the width of the line.</td><td>6</td></tr>
         *      <tr><td>alpha:</td><td> Number between 0 and 1 that indicates the opacity of the line.</td><td> 1</td></tr>
         *      <tr><td>lineType:</td><td>Indicates whether the line is solid or dashed.</td><td>solid.</td></tr> 
         *      <tr><td>dashLength:</td><td>When the <code>lineType</code> is dashed, indicates the length of the dash.</td><td> 10.</td></tr>
         *      <tr><td>gapSpace:</td><td>When the <code>lineType</code> is dashed, indicates the distance between dashes.</td><td> 10.</td></tr>
         *      <tr><td>connectDiscontinuousPoints:</td><td>Indicates whether or not to connect lines when there is a missing or null value between points.</td><td> true.</td></tr> 
         *      <tr><td>discontinuousType:</td><td>Indicates whether the line between discontinuous points is solid or dashed.</td><td> solid.</td></tr>
         *      <tr><td>discontinuousDashLength:</td><td>When the <code>discontinuousType</code> is dashed, indicates the length of the dash.</td><td> 10.</td></tr>
         *      <tr><td>discontinuousGapSpace:</td><td>When the <code>discontinuousType</code> is dashed, indicates the distance between dashes.</td><td> 10.</td></tr>
         *  </table>
         *
         * @attribute line
         * @type Object
         */
        line: {
            lazyAdd: false,
            getter: function()
            {
                return this.get("styles").line;
            },
            setter: function(val)
            {
                this.set("styles", {line:val});
            }
        },
        
        /**
         * Reference to the styles of the area fills. These styles can also be accessed through the <code>styles</code> attribute.
         * Below are the default values:
         *
         *  <table width="100%">
         *      <tr><th>NAME</th><th>DESCRIPTION</th><th>VALUE</th></tr>
         *      <tr><td>color</td><td>color of the fill</td><td>The default value is determined by the order of the series on the graph. The color will be 
         *      retrieved from the following array:
         *      <code>["#66007f", "#a86f41", "#295454", "#996ab2", "#e8cdb7", "#90bdbd","#000000","#c3b8ca", "#968373", "#678585"]</code>
         *      </td></tr>
         *      <tr><td>alpha</td><td>Number between 0 and 1 thad indicates the opacity of the fill.</td><td>1</td></tr>
         *  </table>
         *
         * @attribute area
         * @type Object
         */
        area: {
            lazyAdd: false,
            getter: function()
            {
                return this.get("styles").area;
            },
            setter: function(val)
            {
                this.set("styles", {area:val});
            }
        }
    }
});



		

		
