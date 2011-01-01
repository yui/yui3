/**
 * PieSeries visualizes data as a circular chart divided into wedges which represent data as a 
 * percentage of a whole.
 *
 * @class PieSeries
 * @constructor
 * @extends MarkerSeries
 */
Y.PieSeries = Y.Base.create("pieSeries", Y.MarkerSeries, [], { 
    /**
     * @private
     */
    _map: null,

    /**
     * @private
     */
    _image: null,

    /**
     * @private
     */
    _setMap: function()
    {
        var id = "pieHotSpotMapi_" + Math.round(100000 * Math.random()),
            cb = this.get("graph").get("contentBox"),
            areaNode;
        if(this._image)
        {
            cb.removeChild(this._image);
            while(this._areaNodes && this._areaNodes.length > 0)
            {
                areaNode = this._areaNodes.shift();
                this._map.removeChild(areaNode);
            }
            cb.removeChild(this._map);
        }
        this._image = document.createElement("img"); 
        this._image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAABCAYAAAD9yd/wAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABJJREFUeNpiZGBgSGPAAgACDAAIkABoFyloZQAAAABJRU5ErkJggg==";
        cb.appendChild(this._image);
        this._image.setAttribute("usemap", "#" + id);
        this._image.style.zIndex = 3;
        this._image.style.opacity = 0;
        this._image.setAttribute("alt", "imagemap");
        this._map = document.createElement("map");
        this._map.style.zIndex = 5;
        cb.appendChild(this._map);
        this._map.setAttribute("name", id);
        this._map.setAttribute("id", id);
        this._areaNodes = [];
    },

    /**
     * @private
     */
    _categoryDisplayName: null,
    
    /**
     * @private
     */
    _valueDisplayName: null,

    /**
     * @private
     */
    addListeners: function()
    {
        var categoryAxis = this.get("categoryAxis"),
            valueAxis = this.get("valueAxis");
        if(categoryAxis)
        {
            categoryAxis.after("dataReady", Y.bind(this._categoryDataChangeHandler, this));
            categoryAxis.after("dataUpdate", Y.bind(this._categoryDataChangeHandler, this));
        }
        if(valueAxis)
        {
            valueAxis.after("dataReady", Y.bind(this._valueDataChangeHandler, this));
            valueAxis.after("dataUpdate", Y.bind(this._valueDataChangeHandler, this));
        }
        this.after("categoryAxisChange", this.categoryAxisChangeHandler);
        this.after("valueAxisChange", this.valueAxisChangeHandler);
        this.after("stylesChange", this._updateHandler);
    },
    
    /**
     * @private
     */
    validate: function()
    {
        this.draw();
        this._renderered = true;
    },

    /**
     * @private
     */
    _categoryAxisChangeHandler: function(e)
    {
        var categoryAxis = this.get("categoryAxis");
        categoryAxis.after("dataReady", Y.bind(this._categoryDataChangeHandler, this));
        categoryAxis.after("dataUpdate", Y.bind(this._categoryDataChangeHandler, this));
    },
    
    /**
     * @private
     */
    _valueAxisChangeHandler: function(e)
    {
        var valueAxis = this.get("valueAxis");
        valueAxis.after("dataReady", Y.bind(this._valueDataChangeHandler, this));
        valueAxis.after("dataUpdate", Y.bind(this._valueDataChangeHandler, this));
    },
	
    /**
     * Constant used to generate unique id.
     *
     * @private
     */
    GUID: "pieseries",
	
    /**
     * @private (protected)
     * Handles updating the graph when the x < code>Axis</code> values
     * change.
     */
    _categoryDataChangeHandler: function(event)
    {
       if(this._rendered && this.get("categoryKey") && this.get("valueKey"))
        {
            this.draw();
        }
    },

    /**
     * @private (protected)
     * Handles updating the chart when the y <code>Axis</code> values
     * change.
     */
    _valueDataChangeHandler: function(event)
    {
        if(this._rendered && this.get("categoryKey") && this.get("valueKey"))
        {
            this.draw();
        }
    },
   
    /**
     * @protected
     *
     * Draws the series. Overrides the base implementation.
     *
     * @method draw
     */
    draw: function()
    {
        var graph = this.get("graph"),
            w = graph.get("width"),
            h = graph.get("height");
        if(isFinite(w) && isFinite(h) && w > 0 && h > 0)
        {   
            this._rendered = true;
            this.drawSeries();
            this.fire("drawingComplete");
        }
    },

    /**
     * @private
     */
    drawPlots: function()
    {
        var values = this.get("valueAxis").getDataByKey(this.get("valueKey")).concat(),
            catValues = this.get("categoryAxis").getDataByKey(this.get("categoryKey")).concat(),
            totalValue = 0,
            itemCount = values.length,
            styles = this.get("styles").marker,
            fillColors = styles.fill.colors,
            fillAlphas = styles.fill.alphas || ["1"],
            borderColors = styles.border.colors,
            borderWeights = [styles.border.weight],
            borderAlphas = [styles.border.alpha],
            tbw = borderWeights.concat(),
            tbc = borderColors.concat(),
            tba = borderAlphas.concat(),
            tfc,
            tfa,
            padding = styles.padding,
            graph = this.get("graph"),
            w = graph.get("width") - (padding.left + padding.right),
            h = graph.get("height") - (padding.top + padding.bottom),
            startAngle = -90,
            halfWidth = w / 2,
            halfHeight = h / 2,
            radius = Math.min(halfWidth, halfHeight),
            i = 0,
            value,
            angle = 0,
            lc,
            la,
            lw,
            wedgeStyle,
            marker,
            graphOrder = this.get("graphOrder"),
            isCanvas = DRAWINGAPI == "canvas";

        for(; i < itemCount; ++i)
        {
            value = values[i];
            
            values.push(value);
            if(!isNaN(value))
            {
                totalValue += value;
            }
        }
        
        tfc = fillColors ? fillColors.concat() : null;
        tfa = fillAlphas ? fillAlphas.concat() : null;
        this._createMarkerCache();
        if(isCanvas)
        {
            this._setMap();
            this._image.width = w;
            this._image.height = h;
        }
        for(i = 0; i < itemCount; i++)
        {
            value = values[i];
            if(totalValue === 0)
            {
                angle = 360 / values.length;
            }
            else
            {
                angle = 360 * (value / totalValue);
            }
            angle = Math.round(angle);
            if(tfc && tfc.length < 1)
            {
                tfc = fillColors.concat();
            }
            if(tfa && tfa.length < 1)
            {
                tfa = fillAlphas.concat();
            }
            if(tbw && tbw.length < 1)
            {
                tbw = borderWeights.concat();
            }
            if(tbw && tbc.length < 1)
            {
                tbc = borderColors.concat();
            }
            if(tba && tba.length < 1)
            {
                tba = borderAlphas.concat();
            }
            lw = tbw ? tbw.shift() : null;
            lc = tbc ? tbc.shift() : null;
            la = tba ? tba.shift() : null;
            startAngle += angle;
            wedgeStyle = {
                border: {
                    color:lc,
                    weight:lw,
                    alpha:la
                },
                fill: {
                    color:tfc ? tfc.shift() : this._getDefaultColor(i, "slice"),
                    alpha:tfa ? tfa.shift() : null
                },
                shape: "wedge",
                props: {
                    arc: angle,
                    radius: radius,
                    startAngle: startAngle,
                    x: halfWidth,
                    y: halfHeight
                },
                width: w,
                height: h
            };
            marker = this.getMarker(wedgeStyle, graphOrder, i);
            if(isCanvas)
            {
                this._addHotspot(wedgeStyle.props, graphOrder, i);
            }
        }
        this._clearMarkerCache();
    },

    _addHotspot: function(cfg, seriesIndex, index)
    {
        var areaNode = document.createElement("area"),
            i = 1,
            x = cfg.x,
            y = cfg.y, 
            arc = cfg.arc,
            startAngle = cfg.startAngle - arc, 
            endAngle = cfg.startAngle,
            radius = cfg.radius, 
            ax = x + Math.cos(startAngle / 180 * Math.PI) * radius,
            ay = y + Math.sin(startAngle / 180 * Math.PI) * radius,
            bx = x + Math.cos(endAngle / 180 * Math.PI) * radius,
            by = y + Math.sin(endAngle / 180 * Math.PI) * radius,
            numPoints = Math.floor(arc/10) - 1,
            divAngle = (arc/(Math.floor(arc/10)) / 180) * Math.PI,
            angleCoord = Math.atan((ay - y)/(ax - x)),
            pts = x + ", " + y + ", " + ax + ", " + ay,
            cosAng,
            sinAng,
            multDivAng;
        for(i = 1; i <= numPoints; ++i)
        {
            multDivAng = divAngle * i;
            cosAng = Math.cos(angleCoord + multDivAng);
            sinAng = Math.sin(angleCoord + multDivAng);
            if(startAngle <= 90)
            {
                pts += ", " + (x + (radius * Math.cos(angleCoord + (divAngle * i))));
                pts += ", " + (y + (radius * Math.sin(angleCoord + (divAngle * i))));
            }
            else
            {
                pts += ", " + (x - (radius * Math.cos(angleCoord + (divAngle * i))));
                pts += ", " + (y - (radius * Math.sin(angleCoord + (divAngle * i))));
            }
        }
        pts += ", " + bx + ", " + by;
        pts += ", " + x + ", " + y;
        this._map.appendChild(areaNode);
        areaNode.setAttribute("class", "yui3-seriesmarker");
        areaNode.setAttribute("id", "hotSpot_" + seriesIndex + "_" + index);
        areaNode.setAttribute("shape", "polygon");
        areaNode.setAttribute("coords", pts);
        this._areaNodes.push(areaNode);

    },

    /**
     * Resizes and positions markers based on a mouse interaction.
     *
     * @protected
     * @method updateMarkerState
     * @param {String} type state of the marker
     * @param {Number} i index of the marker
     */
    updateMarkerState: function(type, i)
    {
        if(this._markers[i])
        {
            var state = this._getState(type),
                markerStyles,
                indexStyles,
                marker = this._markers[i],
                styles = this.get("styles").marker; 
            markerStyles = state == "off" || !styles[state] ? styles : styles[state]; 
            indexStyles = this._mergeStyles(markerStyles, {});
            indexStyles.fill.color = indexStyles.fill.colors[i % indexStyles.fill.colors.length];
            indexStyles.fill.alpha = indexStyles.fill.alphas[i % indexStyles.fill.alphas.length];
            marker.update(indexStyles);
        }
    },
    
    /**
     * @private
     */
    _createMarker: function(styles, order, index)
    {
        var cfg = Y.clone(styles),
            marker;
        cfg.graphic = this.get("graphic");
        marker = new Y.Shape(cfg);
        marker.addClass("yui3-seriesmarker");
        marker.node.setAttribute("id", "series_" + order + "_" + index);
        return marker;
    },
    
    /**
     * @private
     */
    _clearMarkerCache: function()
    {
        var len = this._markerCache.length,
            i = 0,
            marker;
        for(; i < len; ++i)
        {
            marker = this._markerCache[i];
            if(marker && marker.node && marker.parentNode)
            {
                marker.parentNode.removeChild(marker.node);
            }
        }
        this._markerCache = [];
    },

    /**
     * @private
     */
    _getPlotDefaults: function()
    {
         var defs = {
            padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            },
            fill:{
                alphas:["1"]
            },
            border: {
                weight: 0,
                alpha: 1
            }
        };
        defs.fill.colors = this._defaultSliceColors;
        defs.border.colors = this._defaultBorderColors;
        return defs;
    },

    /**
     * @private
     */
    _defaultLineColors:["#426ab3", "#d09b2c", "#000000", "#b82837", "#b384b5", "#ff7200", "#779de3", "#cbc8ba", "#7ed7a6", "#007a6c"],

    /**
     * @private
     */
    _defaultFillColors:["#6084d0", "#eeb647", "#6c6b5f", "#d6484f", "#ce9ed1", "#ff9f3b", "#93b7ff", "#e0ddd0", "#94ecba", "#309687"],
    
    /**
     * @private
     */
    _defaultBorderColors:["#205096", "#b38206", "#000000", "#94001e", "#9d6fa0", "#e55b00", "#5e85c9", "#adab9e", "#6ac291", "#006457"],
    
    /**
     * @private
     */
    _defaultSliceColors: ["#66007f", "#a86f41", "#295454", "#996ab2", "#e8cdb7", "#90bdbd","#000000","#c3b8ca", "#968373", "#678585"],

    /**
     * @private
     * @description Colors used if style colors are not specified
     */
    _getDefaultColor: function(index, type)
    {
        var colors = {
                line: this._defaultLineColors,
                fill: this._defaultFillColors,
                border: this._defaultBorderColors,
                slice: this._defaultSliceColors
            },
            col = colors[type],
            l = col.length;
        index = index || 0;
        if(index >= l)
        {
            index = index % l;
        }
        type = type || "fill";
        return colors[type][index];
    }
}, {
    ATTRS: {
        /**
         * Read-only attribute indicating the type of series.
         *
         * @attribute type
         * @type String
         * @default pie
         */
        type: {		
            value: "pie"
        },
        
        /**
         * Order of this instance of this <code>type</code>.
         *
         * @attribute order
         * @type Number
         */
        order: {},

        /**
         * Reference to the <code>Graph</code> in which the series is drawn into.
         *
         * @attribute graph
         * @type Graph
         */
        graph: {},
        
        /**
         * Reference to the <code>Axis</code> instance used for assigning 
         * category values to the graph.
         *
         * @attribute categoryAxis
         * @type Axis
         */
        categoryAxis: {
            value: null,

            validator: function(value)
            {
                return value !== this.get("categoryAxis");
            }
        },
        
        /**
         * Reference to the <code>Axis</code> instance used for assigning 
         * series values to the graph.
         *
         * @attribute categoryAxis
         * @type Axis
         */
        valueAxis: {
            value: null,

            validator: function(value)
            {
                return value !== this.get("valueAxis");
            }
        },

        /**
         * Indicates which array to from the hash of value arrays in 
         * the category <code>Axis</code> instance.
         */
        categoryKey: {
            value: null,

            validator: function(value)
            {
                return value !== this.get("categoryKey");
            }
        },
        /**
         * Indicates which array to from the hash of value arrays in 
         * the value <code>Axis</code> instance.
         */
        valueKey: {
            value: null,

            validator: function(value)
            {
                return value !== this.get("valueKey");
            }
        },

        /**
         * Name used for for displaying category data
         *
         * @attribute categoryDisplayName
         * @type String
         */
        categoryDisplayName: {
            setter: function(val)
            {
                this._categoryDisplayName = val;
                return val;
            },

            getter: function()
            {
                return this._categoryDisplayName || this.get("categoryKey");
            }
        },

        /**
         * Name used for for displaying value data
         *
         * @attribute valueDisplayName
         * @type String
         */
        valueDisplayName: {
            setter: function(val)
            {
                this._valueDisplayName = val;
                return val;
            },

            getter: function()
            {
                return this._valueDisplayName || this.get("valueKey");
            }
        },
        
        /**
         * @private
         */
        slices: null
        
        /**
         * Style properties used for drawing markers. This attribute is inherited from <code>MarkerSeries</code>. Below are the default values:
         *  <dl>
         *      <dt>fill</dt><dd>A hash containing the following values:
         *          <dl>
         *              <dt>colors</dt><dd>An array of colors to be used for the marker fills. The color for each marker is retrieved from the 
         *              array below:<br/>
         *              <code>["#66007f", "#a86f41", "#295454", "#996ab2", "#e8cdb7", "#90bdbd","#000000","#c3b8ca", "#968373", "#678585"]</code>
         *              </dd>
         *              <dt>alphas</dt><dd>An array of alpha references (Number from 0 to 1) indicating the opacity of each marker fill. The default value is [1].</dd>
         *          </dl>
         *      </dd>
         *      <dt>border</dt><dd>A hash containing the following values:
         *          <dl>
         *              <dt>color</dt><dd>An array of colors to be used for the marker borders. The color for each marker is retrieved from the
         *              array below:<br/>
         *              <code>["#205096", "#b38206", "#000000", "#94001e", "#9d6fa0", "#e55b00", "#5e85c9", "#adab9e", "#6ac291", "#006457"]</code>
         *              <dt>alpha</dt><dd>Number from 0 to 1 indicating the opacity of the marker border. The default value is 1.</dd>
         *              <dt>weight</dt><dd>Number indicating the width of the border. The default value is 1.</dd>
         *          </dl>
         *      </dd>
         *      <dt>over</dt><dd>hash containing styles for markers when highlighted by a <code>mouseover</code> event. The default 
         *      values for each style is null. When an over style is not set, the non-over value will be used. For example,
         *      the default value for <code>marker.over.fill.color</code> is equivalent to <code>marker.fill.color</code>.</dd>
         *  </dl>
         *
         * @attribute styles
         * @type Object
         */
    }
});
