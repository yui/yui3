/**
 * The CartesianChart class creates a chart with horizontal and vertical axes.
 *
 * @class CartesianChart
 * @extends ChartBase
 * @constructor
 */
Y.CartesianChart = Y.Base.create("cartesianChart", Y.Widget, [Y.ChartBase], {
    /**
     * @private
     */
    renderUI: function()
    {
        var tt = this.get("tooltip"),
            overlay;
        //move the position = absolute logic to a class file
        this.get("boundingBox").setStyle("position", "absolute");
        this.get("contentBox").setStyle("position", "absolute");
        this._addAxes();
        this._addGridlines();
        this._addSeries();
        if(tt && tt.show)
        {
            this._addTooltip();
        }
        //If there is a style definition. Force them to set.
        this.get("styles");
        if(this.get("interactionType") == "planar")
        {
            overlay = document.createElement("div");
            this.get("contentBox").appendChild(overlay);
            this._overlay = Y.one(overlay); 
            this._overlay.setStyle("position", "absolute");
            this._overlay.setStyle("background", "#fff");
            this._overlay.setStyle("opacity", 0);
            this._overlay.addClass("yui3-overlay");
            this._overlay.setStyle("zIndex", 4);
        }
        this._redraw();
    },

    /**
     * @private
     */
    _planarEventDispatcher: function(e)
    {
        var graph = this.get("graph"),
            bb = this.get("boundingBox"),
            cb = graph.get("contentBox"),
            x = e.pageX,
            offsetX = x - cb.getX(),
            posX = x - bb.getX(),
            y = e.pageY,
            offsetY = y - cb.getY(),
            posY = y - bb.getY(),
            sc = graph.get("seriesCollection"),
            series,
            i = 0,
            index,
            oldIndex = this._selectedIndex,
            item,
            items = [],
            categoryItems = [],
            valueItems = [],
            direction = this.get("direction"),
            hasMarkers,
            coord = direction == "horizontal" ? offsetX : offsetY,
            //data columns and area data could be created on a graph level
            markerPlane = direction == "horizontal" ? sc[0].get("xMarkerPlane") : sc[0].get("yMarkerPlane"),
            len = markerPlane.length;
       for(; i < len; ++i)
       {
            if(coord <= markerPlane[i].end && coord >= markerPlane[i].start)
            {
                index = i;
                break;
            }
       }
       len = sc.length;
       for(i = 0; i < len; ++i)
       {
            series = sc[i];
            hasMarkers = series.get("markers");
            if(hasMarkers && !isNaN(oldIndex) && oldIndex > -1)
            {
                series.updateMarkerState("mouseout", oldIndex);
            }
            if(series.get("ycoords")[index] > -1)
            {
                if(hasMarkers && !isNaN(index) && index > -1)
                {
                    series.updateMarkerState("mouseover", index);
                }
                item = this.getSeriesItems(series, index);
                categoryItems.push(item.category);
                valueItems.push(item.value);
                items.push(series);
            }
                
        }
        this._selectedIndex = index;
        
        /**
         * Broadcasts when <code>interactionType</code> is set to <code>planar</code> and a series' marker plane has received a mouseover event.
         * 
         *
         * @event planarEvent:mouseover
         * @preventable false
         * @param {EventFacade} e Event facade with the following additional
         *   properties:
         *  <dl>
         *      <dt>categoryItem</dt><dd>An array of hashes, each containing information about the category <code>Axis</code> of each marker whose plane has been intersected.</dd>
         *      <dt>valueItem</dt><dd>An array of hashes, each containing information about the value <code>Axis</code> of each marker whose plane has been intersected.</dd>
         *      <dt>x</dt><dd>The x-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>y</dt><dd>The y-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>items</dt><dd>An array including all the series which contain a marker whose plane has been intersected.</dd>
         *      <dt>index</dt><dd>Index of the markers in their respective series.</dd>
         *  </dl>
         */
        /**
         * Broadcasts when <code>interactionType</code> is set to <code>planar</code> and a series' marker plane has received a mouseout event.
         *
         * @event planarEvent:mouseout
         * @preventable false
         * @param {EventFacade} e 
         */
        if(index > -1)
        {
            this.fire("planarEvent:mouseover", {categoryItem:categoryItems, valueItem:valueItems, x:posX, y:posY, items:items, index:index});
        }
        else
        {
            this.fire("planarEvent:mouseout");
        }
    },

    /**
     * @private
     */
    _type: "combo",

    /**
     * @private
     */
    _axesRenderQueue: null,

    /**
     * @private 
     */
    _addToAxesRenderQueue: function(axis)
    {
        if(!this._axesRenderQueue)
        {
            this._axesRenderQueue = [];
        }
        if(Y.Array.indexOf(this._axesRenderQueue, axis) < 0)
        {
            this._axesRenderQueue.push(axis);
        }
    },

    /**
     * @private
     */
    _getDefaultSeriesCollection: function(val)
    {
        var dir = this.get("direction"), 
            sc = val || [], 
            catAxis,
            valAxis,
            tempKeys = [],
            series,
            seriesKeys = this.get("seriesKeys").concat(),
            i,
            index,
            l,
            type = this.get("type"),
            key,
            catKey,
            seriesKey,
            graph,
            categoryKey = this.get("categoryKey"),
            showMarkers = this.get("showMarkers"),
            showAreaFill = this.get("showAreaFill"),
            showLines = this.get("showLines");
        if(dir == "vertical")
        {
            catAxis = "yAxis";
            catKey = "yKey";
            valAxis = "xAxis";
            seriesKey = "xKey";
        }
        else
        {
            catAxis = "xAxis";
            catKey = "xKey";
            valAxis = "yAxis";
            seriesKey = "yKey";
        }
        l = sc.length;
        for(i = 0; i < l; ++i)
        {
            key = this._getBaseAttribute(sc[i], seriesKey);
            if(key)
            {
                index = Y.Array.indexOf(seriesKeys, key);
                if(index > -1)
                {
                    seriesKeys.splice(index, 1);
                }
               tempKeys.push(key);
            }
        }
        if(seriesKeys.length > 0)
        {
            tempKeys = tempKeys.concat(seriesKeys);
        }
        l = tempKeys.length;
        for(i = 0; i < l; ++i)
        {
            series = sc[i] || {type:type};
            if(series instanceof Y.CartesianSeries)
            {
                this._parseSeriesAxes(series);
                continue;
            }
            
            series[catKey] = series[catKey] || categoryKey;
            series[seriesKey] = series[seriesKey] || seriesKeys.shift();
            series[catAxis] = this._getCategoryAxis();
            series[valAxis] = this._getSeriesAxis(series[seriesKey]);
            
            series.type = series.type || type;
            
            if((series.type == "combo" || series.type == "stackedcombo" || series.type == "combospline" || series.type == "stackedcombospline"))
            {
                if(showAreaFill !== null)
                {
                    series.showAreaFill = (series.showAreaFill !== null && series.showAreaFill !== undefined) ? series.showAreaFill : showAreaFill;
                }
                if(showMarkers !== null)
                {
                    series.showMarkers = (series.showMarkers !== null && series.showMarkers !== undefined) ? series.showMarkers : showMarkers;
                }
                if(showLines !== null)
                {
                    series.showLines = (series.showLines !== null && series.showLines !== undefined) ? series.showLines : showLines;
                }
            }
            sc[i] = series;
        }
        if(val)
        {
            graph = this.get("graph");
            graph.set("seriesCollection", sc);
            sc = graph.get("seriesCollection");
        }
        return sc;
    },

    /**
     * @private
     */
    _parseSeriesAxes: function(series)
    {
        var axes = this.get("axes"),
            xAxis = series.get("xAxis"),
            yAxis = series.get("yAxis"),
            YAxis = Y.Axis,
            axis;
        if(xAxis && !(xAxis instanceof YAxis) && Y.Lang.isString(xAxis) && axes.hasOwnProperty(xAxis))
        {
            axis = axes[xAxis];
            if(axis instanceof YAxis)
            {
                series.set("xAxis", axis);
            }
        }
        if(yAxis && !(yAxis instanceof YAxis) && Y.Lang.isString(yAxis) && axes.hasOwnProperty(yAxis))
        {   
            axis = axes[yAxis];
            if(axis instanceof YAxis)
            {
                series.set("yAxis", axis);
            }
        }

    },

    /**
     * @private
     */
    _getCategoryAxis: function()
    {
        var axis,
            axes = this.get("axes"),
            categoryAxisName = this.get("categoryAxisName") || this.get("categoryKey");
        axis = axes[categoryAxisName];
        return axis;
    },

    /**
     * @private
     */
    _getSeriesAxis:function(key, axisName)
    {
        var axes = this.get("axes"),
            i,
            keys,
            axis;
        if(axes)
        {
            if(axisName && axes.hasOwnProperty(axisName))
            {
                axis = axes[axisName];
            }
            else
            {
                for(i in axes)
                {
                    if(axes.hasOwnProperty(i))
                    {
                        keys = axes[i].get("keys");
                        if(keys && keys.hasOwnProperty(key))
                        {
                            axis = axes[i];
                            break;
                        }
                    }
                }
            }
        }
        return axis;
    },

    /**
     * @private
     * Gets an attribute from an object, using a getter for Base objects and a property for object
     * literals. Used for determining attributes from series/axis references which can be an actual class instance
     * or a hash of properties that will be used to create a class instance.
     */
    _getBaseAttribute: function(item, key)
    {
        if(item instanceof Y.Base)
        {
            return item.get(key);
        }
        if(item.hasOwnProperty(key))
        {
            return item[key];
        }
        return null;
    },

    /**
     * @private
     * Sets an attribute on an object, using a setter of Base objects and a property for object
     * literals. Used for setting attributes on a Base class, either directly or to be stored in an object literal
     * for use at instantiation.
     */
    _setBaseAttribute: function(item, key, value)
    {
        if(item instanceof Y.Base)
        {
            item.set(key, value);
        }
        else
        {
            item[key] = value;
        }
    },

    /**
     * @private
     * Creates Axis and Axis data classes based on hashes of properties.
     */
    _parseAxes: function(val)
    {
        var hash = this._getDefaultAxes(val),
            axes = {},
            axesAttrs = {
                edgeOffset: "edgeOffset", 
                position: "position",
                overlapGraph:"overlapGraph",
                labelFunction:"labelFunction",
                labelFunctionScope:"labelFunctionScope",
                labelFormat:"labelFormat",
                maximum:"maximum",
                minimum:"minimum", 
                roundingMethod:"roundingMethod",
                alwaysShowZero:"alwaysShowZero"
            },
            dp = this.get("dataProvider"),
            ai,
            i, 
            pos, 
            axis,
            dh, 
            axisClass, 
            config,
            axesCollection;
        for(i in hash)
        {
            if(hash.hasOwnProperty(i))
            {
                dh = hash[i];
                if(dh instanceof Y.Axis)
                {
                    axis = dh;
                }
                else
                {
                    axisClass = this._getAxisClass(dh.type);
                    config = {};
                    config.dataProvider = dh.dataProvider || dp;
                    config.keys = dh.keys;
                    
                    if(dh.hasOwnProperty("roundingUnit"))
                    {
                        config.roundingUnit = dh.roundingUnit;
                    }
                    pos = dh.position;
                    if(dh.styles)
                    {
                        config.styles = dh.styles;
                    }
                    config.position = dh.position;
                    for(ai in axesAttrs)
                    {
                        if(axesAttrs.hasOwnProperty(ai) && dh.hasOwnProperty(ai))
                        {
                            config[ai] = dh[ai];
                        }
                    }
                    axis = new axisClass(config);
                }

                if(axis)
                {
                    axesCollection = this.get(pos + "AxesCollection");
                    if(axesCollection && Y.Array.indexOf(axesCollection, axis) > 0)
                    {
                        axis.set("overlapGraph", false);
                    }
                    axis.after("axisRendered", Y.bind(this._axisRendered, this));
                    axes[i] = axis;
                }
            }
        }
        return axes;
    },
    
    /**
     * @private
     */
    _addAxes: function()
    {
        var axes = this.get("axes"),
            i, 
            axis, 
            pos,
            w = this.get("width"),
            h = this.get("height"),
            node = Y.Node.one(this._parentNode);
        if(!this._axesCollection)
        {   
            this._axesCollection = [];
        }
        for(i in axes)
        {
            if(axes.hasOwnProperty(i))
            {
                axis = axes[i];
                if(axis instanceof Y.Axis)
                {
                    if(!w)
                    {
                        this.set("width", node.get("offsetWidth"));
                        w = this.get("width");
                    }
                    if(!h)
                    {
                        this.set("height", node.get("offsetHeight"));
                        h = this.get("height");
                    }
                    axis.set("width", w);
                    axis.set("height", h);
                    this._addToAxesRenderQueue(axis);
                    pos = axis.get("position");
                    if(!this.get(pos + "AxesCollection"))
                    {
                        this.set(pos + "AxesCollection", [axis]);
                    }
                    else
                    {
                        this.get(pos + "AxesCollection").push(axis);
                    }
                    this._axesCollection.push(axis);
                    if(axis.get("keys").hasOwnProperty(this.get("categoryKey")))
                    {
                        this.set("categoryAxis", axis);
                    }
                    axis.render(this.get("contentBox"));
                }
            }
        }
    },

    /**
     * @private
     */
    _addSeries: function()
    {
        var graph = this.get("graph"),
            sc = this.get("seriesCollection");
        graph.render(this.get("contentBox"));

    },

    /**
     * @private
     * @description Adds gridlines to the chart.
     */
    _addGridlines: function()
    {
        var graph = this.get("graph"),
            hgl = this.get("horizontalGridlines"),
            vgl = this.get("verticalGridlines"),
            direction = this.get("direction"),
            leftAxesCollection = this.get("leftAxesCollection"),
            rightAxesCollection = this.get("rightAxesCollection"),
            bottomAxesCollection = this.get("bottomAxesCollection"),
            topAxesCollection = this.get("topAxesCollection"),
            seriesAxesCollection,
            catAxis = this.get("categoryAxis"),
            hAxis,
            vAxis;
        if(this._axesCollection)
        {
            seriesAxesCollection = this._axesCollection.concat();
            seriesAxesCollection.splice(Y.Array.indexOf(seriesAxesCollection, catAxis), 1);
        }
        if(hgl)
        {
            if(leftAxesCollection && leftAxesCollection[0])
            {
                hAxis = leftAxesCollection[0];
            }
            else if(rightAxesCollection && rightAxesCollection[0])
            {
                hAxis = rightAxesCollection[0];
            }
            else 
            {
                hAxis = direction == "horizontal" ? catAxis : seriesAxesCollection[0];
            }
            if(!this._getBaseAttribute(hgl, "axis") && hAxis)
            {
                this._setBaseAttribute(hgl, "axis", hAxis);
            }
            if(this._getBaseAttribute(hgl, "axis"))
            {
                graph.set("horizontalGridlines", hgl);
            }
        }
        if(vgl)
        {
            if(bottomAxesCollection && bottomAxesCollection[0])
            {
                vAxis = bottomAxesCollection[0];
            }
            else if (topAxesCollection && topAxesCollection[0])
            {
                vAxis = topAxesCollection[0];
            }
            else 
            {
                vAxis = direction == "vertical" ? catAxis : seriesAxesCollection[0];
            }
            if(!this._getBaseAttribute(vgl, "axis") && vAxis)
            {
                this._setBaseAttribute(vgl, "axis", vAxis);
            }
            if(this._getBaseAttribute(vgl, "axis"))
            {
                graph.set("verticalGridlines", vgl);
            }
        }
    },

    /**
     * @private
     */
    _getDefaultAxes: function(axes)
    {
        var catKey = this.get("categoryKey"),
            axis,
            attr,
            keys,
            newAxes = {},
            claimedKeys = [],
            categoryAxisName = this.get("categoryAxisName") || this.get("categoryKey"),
            valueAxisName = this.get("valueAxisName"),
            seriesKeys = this.get("seriesKeys") || [], 
            i, 
            l,
            ii,
            ll,
            cIndex,
            dv,
            dp = this.get("dataProvider"),
            direction = this.get("direction"),
            seriesPosition,
            categoryPosition,
            valueAxes = [],
            seriesAxis = this.get("stacked") ? "stacked" : "numeric";
        dv = dp[0];
        if(direction == "vertical")
        {
            seriesPosition = "bottom";
            categoryPosition = "left";
        }
        else
        {
            seriesPosition = "left";
            categoryPosition = "bottom";
        }
        if(axes)
        {
            for(i in axes)
            {
                if(axes.hasOwnProperty(i))
                {
                    axis = axes[i];
                    keys = this._getBaseAttribute(axis, "keys");
                    attr = this._getBaseAttribute(axis, "type");
                    if(attr == "time" || attr == "category")
                    {
                        categoryAxisName = i;
                        this.set("categoryAxisName", i);
                        if(Y.Lang.isArray(keys) && keys.length > 0)
                        {
                            catKey = keys[0];
                            this.set("categoryKey", catKey);
                        }
                        newAxes[i] = axis;
                    }
                    else if(i == categoryAxisName)
                    {
                        newAxes[i] = axis;
                    }
                    else 
                    {
                        newAxes[i] = axis;
                        if(i != valueAxisName && keys && Y.Lang.isArray(keys))
                        {
                            ll = keys.length;
                            for(ii = 0; ii < ll; ++ii)
                            {
                                claimedKeys.push(keys[ii]);
                            }
                            valueAxes.push(newAxes[i]);
                        }
                        if(!(this._getBaseAttribute(newAxes[i], "type")))
                        {
                            this._setBaseAttribute(newAxes[i], "type", seriesAxis);
                        }
                        if(!(this._getBaseAttribute(newAxes[i], "position")))
                        {
                            this._setBaseAttribute(newAxes[i], "position", this._getDefaultAxisPosition(newAxes[i], valueAxes, seriesPosition));
                        }
                    }
                }
            }
        }
        if(seriesKeys.length < 1)
        {
            for(i in dv)
            {
                if(dv.hasOwnProperty(i) && i != catKey && Y.Array.indexOf(claimedKeys, i) == -1)
                {
                    seriesKeys.push(i);
                }
            }
        }
        cIndex = Y.Array.indexOf(seriesKeys, catKey);
        if(cIndex > -1)
        {
            seriesKeys.splice(cIndex, 1);
        }
        l = claimedKeys.length;
        for(i = 0; i < l; ++i)
        {
            cIndex = Y.Array.indexOf(seriesKeys, claimedKeys[i]); 
            if(cIndex > -1)
            {
                seriesKeys.splice(cIndex, 1);
            }
        }
        if(!newAxes.hasOwnProperty(categoryAxisName))
        {
            newAxes[categoryAxisName] = {};
        }
        if(!(this._getBaseAttribute(newAxes[categoryAxisName], "keys")))
        {
            this._setBaseAttribute(newAxes[categoryAxisName], "keys", [catKey]);
        }
        
        if(!(this._getBaseAttribute(newAxes[categoryAxisName], "position")))
        {
            this._setBaseAttribute(newAxes[categoryAxisName], "position", categoryPosition);
        }
         
        if(!(this._getBaseAttribute(newAxes[categoryAxisName], "type")))
        {
            this._setBaseAttribute(newAxes[categoryAxisName], "type", this.get("categoryType"));
        }
        if(!newAxes.hasOwnProperty(valueAxisName) && seriesKeys && seriesKeys.length > 0)
        {
            newAxes[valueAxisName] = {keys:seriesKeys};
            valueAxes.push(newAxes[valueAxisName]);
        }
        if(claimedKeys.length > 0)
        {
            if(seriesKeys.length > 0)
            {
                seriesKeys = claimedKeys.concat(seriesKeys);
            }
            else
            {
                seriesKeys = claimedKeys;
            }
        }
        if(newAxes.hasOwnProperty(valueAxisName))
        {
            if(!(this._getBaseAttribute(newAxes[valueAxisName], "position")))
            {
                this._setBaseAttribute(newAxes[valueAxisName], "position", this._getDefaultAxisPosition(newAxes[valueAxisName], valueAxes, seriesPosition));
            }
            if(!(this._getBaseAttribute(newAxes[valueAxisName], "type")))
            {
                this._setBaseAttribute(newAxes[valueAxisName], "type", seriesAxis);
            }
            if(!(this._getBaseAttribute(newAxes[valueAxisName], "keys")))
            {
                this._setBaseAttribute(newAxes[valueAxisName], "keys", seriesKeys);
            }
        } 
        this.set("seriesKeys", seriesKeys);
        return newAxes;
    },

    /**
     * @private
     * @description Determines the position of an axis when one is not specified.
     */
    _getDefaultAxisPosition: function(axis, valueAxes, position)
    {
        var direction = this.get("direction"),
            i = Y.Array.indexOf(valueAxes, axis);
        
        if(valueAxes[i - 1] && valueAxes[i - 1].position)
        {
            if(direction == "horizontal")
            {
                if(valueAxes[i - 1].position == "left")
                {
                    position = "right";
                }
                else if(valueAxes[i - 1].position == "right")
                {
                    position = "left";
                }
            }
            else
            {
                if (valueAxes[i -1].position == "bottom")
                {
                    position = "top";
                }       
                else
                {
                    position = "bottom";
                }
            }
        }
        return position;
    },

   
    /**
     * Returns an object literal containing a categoryItem and a valueItem for a given series index.
     *
     * @method getSeriesItem
     * @param {CartesianSeries} series Reference to a series.
     * @param {Number} index Index of the specified item within a series.
     * @return Object
     */
    getSeriesItems: function(series, index)
    {
        var xAxis = series.get("xAxis"),
            yAxis = series.get("yAxis"),
            xKey = series.get("xKey"),
            yKey = series.get("yKey"),
            categoryItem,
            valueItem;
        if(this.get("direction") == "vertical")
        {
            categoryItem = {
                axis:yAxis,
                key:yKey,
                value:yAxis.getKeyValueAt(yKey, index)
            };
            valueItem = {
                axis:xAxis,
                key:xKey,
                value: xAxis.getKeyValueAt(xKey, index)
            };
        }
        else
        {
            valueItem = {
                axis:yAxis,
                key:yKey,
                value:yAxis.getKeyValueAt(yKey, index)
            };
            categoryItem = {
                axis:xAxis,
                key:xKey,
                value: xAxis.getKeyValueAt(xKey, index)
            };
        }
        categoryItem.displayName = series.get("categoryDisplayName");
        valueItem.displayName = series.get("valueDisplayName");
        categoryItem.value = categoryItem.axis.getKeyValueAt(categoryItem.key, index);
        valueItem.value = valueItem.axis.getKeyValueAt(valueItem.key, index);
        return {category:categoryItem, value:valueItem};
    },

    /**
     * @private
     * Listender for axisRendered event.
     */
    _axisRendered: function(e)
    {
        this._axesRenderQueue = this._axesRenderQueue.splice(1 + Y.Array.indexOf(this._axesRenderQueue, e.currentTarget), 1);
        if(this._axesRenderQueue.length < 1)
        {
            this._redraw();
        }
    },

    /**
     * @private
     */
    _sizeChanged: function(e)
    {
        if(this._axesCollection)
        {
            var ac = this._axesCollection,
                i = 0,
                l = ac.length;
            for(; i < l; ++i)
            {
                this._addToAxesRenderQueue(ac[i]);
            }
            this._redraw();
        }
    },

    /**
     * @private
     */
    _redraw: function()
    {
        if(this._drawing)
        {
            this._callLater = true;
            return;
        }
        this._drawing = true;
        this._callLater = false;
        var w = this.get("width"),
            h = this.get("height"),
            lw = 0,
            rw = 0,
            th = 0,
            bh = 0,
            lc = this.get("leftAxesCollection"),
            rc = this.get("rightAxesCollection"),
            tc = this.get("topAxesCollection"),
            bc = this.get("bottomAxesCollection"),
            i = 0,
            l,
            axis,
            pos,
            pts = [],
            graphOverflow = "visible",
            graph = this.get("graph"); 
        if(lc)
        {
            l = lc.length;
            for(i = l - 1; i > -1; --i)
            {
                pts[Y.Array.indexOf(this._axesCollection, lc[i])] = {x:lw + "px"};
                lw += lc[i].get("width");
            }
        }
        if(rc)
        {
            l = rc.length;
            i = 0;
            for(i = l - 1; i > -1; --i)
            {
                rw += rc[i].get("width");
                pts[Y.Array.indexOf(this._axesCollection, rc[i])] = {x:(w - rw) + "px"};
            }
        }
        if(tc)
        {
            l = tc.length;
            for(i = l - 1; i > -1; --i)
            {
                pts[Y.Array.indexOf(this._axesCollection, tc[i])] = {y:th + "px"};
                th += tc[i].get("height");
            }
        }
        if(bc)
        {
            l = bc.length;
            for(i = l - 1; i > -1; --i)
            {
                bh += bc[i].get("height");
                pts[Y.Array.indexOf(this._axesCollection, bc[i])] = {y:(h - bh) + "px"};
            }
        }
        l = this._axesCollection.length;
        i = 0;
        
        for(; i < l; ++i)
        {
            axis = this._axesCollection[i];
            pos = axis.get("position");
            if(pos == "left" || pos === "right")
            {
                axis.get("boundingBox").setStyle("top", th + "px");
                axis.get("boundingBox").setStyle("left", pts[i].x);
                if(axis.get("height") !== h - (bh + th))
                {
                    axis.set("height", h - (bh + th));
                }
            }
            else if(pos == "bottom" || pos == "top")
            {
                if(axis.get("width") !== w - (lw + rw))
                {
                    axis.set("width", w - (lw + rw));
                }
                axis.get("boundingBox").setStyle("left", lw + "px");
                axis.get("boundingBox").setStyle("top", pts[i].y);
            }
            if(axis.get("setMax") || axis.get("setMin"))
            {
                graphOverflow = "hidden";
            }
        }
        
        this._drawing = false;
        if(this._callLater)
        {
            this._redraw();
            return;
        }
        if(graph)
        {
            graph.get("boundingBox").setStyle("left", lw + "px");
            graph.get("boundingBox").setStyle("top", th + "px");
            graph.set("width", w - (lw + rw));
            graph.set("height", h - (th + bh));
            graph.get("boundingBox").setStyle("overflow", graphOverflow);
        }

        if(this._overlay)
        {
            this._overlay.setStyle("left", lw + "px");
            this._overlay.setStyle("top", th + "px");
            this._overlay.setStyle("width", (w - (lw + rw)) + "px");
            this._overlay.setStyle("height", (h - (th + bh)) + "px");
        }
    }
}, {
    ATTRS: {
        /**
         * @private
         * Style object for the axes.
         *
         * @attribute axesStyles
         * @type Object
         */
        axesStyles: {
            getter: function()
            {
                var axes = this.get("axes"),
                    i,
                    styles = this._axesStyles;
                if(axes)
                {
                    for(i in axes)
                    {
                        if(axes.hasOwnProperty(i) && axes[i] instanceof Y.Axis)
                        {
                            if(!styles)
                            {
                                styles = {};
                            }
                            styles[i] = axes[i].get("styles");
                        }
                    }
                }
                return styles;
            },
            
            setter: function(val)
            {
                var axes = this.get("axes"),
                    i;
                for(i in val)
                {
                    if(val.hasOwnProperty(i) && axes.hasOwnProperty(i))
                    {
                        this._setBaseAttribute(axes[i], "styles", val[i]);
                    }
                }
            }
        },

        /**
         * @private
         * Style object for the series
         *
         * @attribute seriesStyles
         * @type Object
         */
        seriesStyles: {
            getter: function()
            {
                var styles = this._seriesStyles,
                    graph = this.get("graph"),
                    dict,
                    i;
                if(graph)
                {
                    dict = graph.get("seriesDictionary");
                    if(dict)
                    {
                        styles = {};
                        for(i in dict)
                        {
                            if(dict.hasOwnProperty(i))
                            {
                                styles[i] = dict[i].get("styles");
                            }
                        }
                    }
                }
                return styles;
            },
            
            setter: function(val)
            {
                var i,
                    l,
                    s;
    
                if(Y.Lang.isArray(val))
                {
                    s = this.get("seriesCollection");
                    i = 0;
                    l = val.length;

                    for(; i < l; ++i)
                    {
                        this._setBaseAttribute(s[i], "styles", val[i]);
                    }
                }
                else
                {
                    for(i in val)
                    {
                        if(val.hasOwnProperty(i))
                        {
                            s = this.getSeries(i);
                            this._setBaseAttribute(s, "styles", val[i]);
                        }
                    }
                }
            }
        },

        /**
         * @private
         * Styles for the graph.
         *
         * @attribute graphStyles
         * @type Object
         */
        graphStyles: {
            getter: function()
            {
                var graph = this.get("graph");
                if(graph)
                {
                    return(graph.get("styles"));
                }
                return this._graphStyles;
            },

            setter: function(val)
            {
                var graph = this.get("graph");
                this._setBaseAttribute(graph, "styles", val);
            }

        },

        /**
         * Style properties for the chart. Contains a key indexed hash of the following:
         *  <dl>
         *      <dt>series</dt><dd>A key indexed hash containing references to the <code>styles</code> attribute for each series in the chart.
         *      Specific style attributes vary depending on the series:
         *      <ul>
         *          <li><a href="AreaSeries.html#config_styles">AreaSeries</a></li>
         *          <li><a href="BarSeries.html#config_styles">BarSeries</a></li>
         *          <li><a href="ColumnSeries.html#config_styles">ColumnSeries</a></li>
         *          <li><a href="ComboSeries.html#config_styles">ComboSeries</a></li>
         *          <li><a href="LineSeries.html#config_styles">LineSeries</a></li>
         *          <li><a href="MarkerSeries.html#config_styles">MarkerSeries</a></li>
         *          <li><a href="SplineSeries.html#config_styles">SplineSeries</a></li>
         *      </ul>
         *      </dd>
         *      <dt>axes</dt><dd>A key indexed hash containing references to the <code>styles</code> attribute for each axes in the chart. Specific
         *      style attributes can be found in the <a href="Axis.html#config_styles">Axis</a> class.</dd>
         *      <dt>graph</dt><dd>A reference to the <code>styles</code> attribute in the chart. Specific style attributes can be found in the
         *      <a href="Graph.html#config_styles">Graph</a> class.</dd>
         *  </dl>
         *
         * @attribute styles
         * @type Object
         */
        styles: {
            getter: function()
            {
                var styles = { 
                    axes: this.get("axesStyles"),
                    series: this.get("seriesStyles"),
                    graph: this.get("graphStyles")
                };
                return styles;
            },
            setter: function(val)
            {
                if(val.hasOwnProperty("axes"))
                {
                    if(this.get("axesStyles"))
                    {
                        this.set("axesStyles", val.axes);
                    }
                    else
                    {
                        this._axesStyles = val.axes;
                    }
                }
                if(val.hasOwnProperty("series"))
                {
                    if(this.get("seriesStyles"))
                    {
                        this.set("seriesStyles", val.series);
                    }
                    else
                    {
                        this._seriesStyles = val.series;
                    }
                }
                if(val.hasOwnProperty("graph"))
                {
                    this.set("graphStyles", val.graph);
                }
            }
        },

        /**
         * Axes to appear in the chart. This can be a key indexed hash of axis instances or object literals
         * used to construct the appropriate axes.
         *
         * @attribute axes
         * @type Object
         */
        axes: {
            valueFn: "_parseAxes",

            setter: function(val)
            {
                return this._parseAxes(val);
            }
        },

        /**
         * Collection of series to appear on the chart. This can be an array of Series instances or object literals
         * used to construct the appropriate series.
         *
         * @attribute seriesCollection
         * @type Array
         */
        seriesCollection: {
            valueFn: "_getDefaultSeriesCollection",
            
            setter: function(val)
            {
                return this._getDefaultSeriesCollection(val);
            }
        },

        /**
         * Reference to the left-aligned axes for the chart.
         *
         * @attribute leftAxesCollection
         * @type Array
         * @private
         */
        leftAxesCollection: {},

        /**
         * Reference to the bottom-aligned axes for the chart.
         *
         * @attribute bottomAxesCollection
         * @type Array
         * @private
         */
        bottomAxesCollection: {},

        /**
         * Reference to the right-aligned axes for the chart.
         *
         * @attribute rightAxesCollection
         * @type Array
         * @private
         */
        rightAxesCollection: {},

        /**
         * Reference to the top-aligned axes for the chart.
         *
         * @attribute topAxesCollection
         * @type Array
         * @private
         */
        topAxesCollection: {},
        
        /**
         * Indicates whether or not the chart is stacked.
         *
         * @attribute stacked
         * @type Boolean
         */
        stacked: {
            value: false
        },

        /**
         * Direction of chart's category axis when there is no series collection specified. Charts can
         * be horizontal or vertical. When the chart type is column, the chart is horizontal.
         * When the chart type is bar, the chart is vertical. 
         *
         * @attribute direction
         * @type String
         */
        direction: {
            getter: function()
            {
                var type = this.get("type");
                if(type == "bar")
                {   
                    return "vertical";
                }
                else if(type == "column")
                {
                    return "horizontal";
                }
                return this._direction;
            },

            setter: function(val)
            {
                this._direction = val;
                return this._direction;
            }
        },

        /**
         * Indicates whether or not an area is filled in a combo chart.
         * 
         * @attribute showAreaFill
         * @type Boolean
         */
        showAreaFill: {},

        /**
         * Indicates whether to display markers in a combo chart.
         *
         * @attribute showMarkers
         * @type Boolean
         */
        showMarkers:{},

        /**
         * Indicates whether to display lines in a combo chart.
         *
         * @attribute showLines
         * @type Boolean
         */
        showLines:{},

        /**
         * Indicates the key value used to identify a category axis in the <code>axes</code> hash. If
         * not specified, the categoryKey attribute value will be used.
         * 
         * @attribute categoryAxisName
         * @type String
         */
        categoryAxisName: {
        },

        /**
         * Indicates the key value used to identify a the series axis when an axis not generated.
         *
         * @attribute valueAxisName
         * @type String
         */
        valueAxisName: {
            value: "values"
        },

        /**
         * Reference to the horizontalGridlines for the chart.
         *
         * @attribute horizontalGridlines
         * @type Gridlines
         */
        horizontalGridlines: {
            getter: function()
            {
                var graph = this.get("graph");
                if(graph)
                {
                    return graph.get("horizontalGridlines");
                }
                return this._horizontalGridlines;
            },
            setter: function(val)
            {
                var graph = this.get("graph");
                if(val && !Y.Lang.isObject(val))
                {
                    val = {};
                }
                if(graph)
                {
                    graph.set("horizontalGridlines", val);
                }
                else
                {
                    this._horizontalGridlines = val;
                }
            }
        },

        /**
         * Reference to the verticalGridlines for the chart.
         *
         * @attribute verticalGridlines
         * @type Gridlines
         */
        verticalGridlines: {
            getter: function()
            {
                var graph = this.get("graph");
                if(graph)
                {
                    return graph.get("verticalGridlines");
                }
                return this._verticalGridlines;
            },
            setter: function(val)
            {
                var graph = this.get("graph");
                if(val && !Y.Lang.isObject(val))
                {
                    val = {};
                }
                if(graph)
                {
                    graph.set("verticalGridlines", val);
                }
                else
                {
                    this._verticalGridlines = val;
                }
            }
        },
        
        /**
         * Type of chart when there is no series collection specified.
         *
         * @attribute type
         * @type String 
         */
        type: {
            getter: function()
            {
                if(this.get("stacked"))
                {
                    return "stacked" + this._type;
                }
                return this._type;
            },

            setter: function(val)
            {
                if(this._type == "bar")
                {
                    if(val != "bar")
                    {
                        this.set("direction", "horizontal");
                    }
                }
                else
                {
                    if(val == "bar")
                    {
                        this.set("direction", "vertical");
                    }
                }
                this._type = val;
                return this._type;
            }
        },
        
        /**
         * Reference to the category axis used by the chart.
         *
         * @attribute categoryAxis
         * @type Axis
         */
        categoryAxis:{}
    }
});
