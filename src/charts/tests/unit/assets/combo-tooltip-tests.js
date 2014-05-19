YUI.add('combo-tooltip-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: ComboTooltip"),
        ASSERT = Y.Assert,
        ObjectAssert = Y.ObjectAssert,
        parentDiv = Y.DOM.create('<div style="position:absolute;top:500px;left:0px;width:500px;height:400px" id="testdiv"></div>'),
        DOC = Y.config.doc;
    DOC.body.appendChild(parentDiv);
            
            
    //-------------------------------------------------------------------------
    // Chart Event Test Template
    //-------------------------------------------------------------------------
    function ChartEventTestTemplate(cfg, globalCfg)
    {
        var i;
        ChartEventTestTemplate.superclass.constructor.call(this);
        cfg.categoryKey = "date";
        this.attrCfg = cfg;
        this.result = null;
        for(i in globalCfg)
        {
            if(globalCfg.hasOwnProperty(i))
            {
                this[i] = globalCfg[i];
            }
        }
        this.name = "Event '" + this.eventType + "' Tests";
    }

    Y.extend(ChartEventTestTemplate, Y.Test.Case, {
        //---------------------------------------------------------------------
        // Setup and teardown of test harnesses
        //---------------------------------------------------------------------
        
        /*
         * Sets up several event handlers used to test UserAction mouse events.
         */
        setUp : function() 
        {
            //create the chart 
            this.chart = new Y.Chart(this.attrCfg);

            this.contentBox = this.chart.get("contentBox");
        
            //reset the result
            this.result = null;
            
            //assign event handler                
            this.handler = Y.delegate(this.eventType, Y.bind(this.handleEvent, this), this.contentBox, this.eventNode);
        },
        
        /*
         * Removes event handlers that were used during the test.
         */
        tearDown : function() 
        {
            Y.detach(this.handler);
            this.chart.destroy(true);
            Y.Event.purgeElement(DOC, false);
        },
        
        //---------------------------------------------------------------------
        // Event handler
        //---------------------------------------------------------------------
        
        /*
         * Uses to trap and assign the event object for interrogation.
         * @param {Event} event The event object created from the event.
         */
        handleEvent : function(event) 
        {
            this.result = event;
        }
    });

    function ChartMarkerEventTestTemplate()
    {
        ChartMarkerEventTestTemplate.superclass.constructor.apply(this, arguments);
        this.eventNode = "." + Y.ClassNameManager.getClassName("seriesmarker");
    }

    Y.extend(ChartMarkerEventTestTemplate, ChartEventTestTemplate, {
        getMarkerData: function(e)
        {
            var type = e.type,
                cb = this.chart.get("contentBox"),
                markerNode = e.currentTarget,
                strArr = markerNode.getAttribute("id").split("_"),
                index = strArr.pop(),
                seriesIndex = strArr.pop(),
                series = this.chart.getSeries(parseInt(seriesIndex, 10)),
                items = this.chart.getSeriesItems(series, index),
                pageX = e.pageX,
                pageY = e.pageY,
                x = pageX - cb.getX(),
                y = pageY - cb.getY();
            return { 
                type: "markerEvent:" + type, 
                originEvent: e,
                pageX:pageX, 
                pageY:pageY, 
                categoryItem:items.category, 
                valueItem:items.value, 
                node:markerNode, 
                x:x, 
                y:y, 
                series:series, 
                index:index, 
                seriesIndex:seriesIndex
            };
        },

        seriesKeys: ["miscellaneous", "expenses", "revenue"],

        testTooltipProps: function()
        {
            var ttprops = this.tooltip,
                charttt = this.chart.get("tooltip"),
                node = charttt.node,
                showEvent = ttprops.showEvent,
                hideEvent = ttprops.hideEvent,
                show = ttprops.show,
                setTextFunction = ttprops.setTextFunction,
                markerEventHandler = ttprops.markerEventHandler,
                planarEventHandler = ttprops.planarEventHandler,
                markerLabelFunction = ttprops.markerLabelFunction,
                planarLabelFunction = ttprops.planarLabelFunction,
                styles = ttprops.styles,
                style,
                nodeStyle,
                colorStyles = {
                    backgroundColor: true,
                    color: true,
                    borderColor: true
                },
                toHex = Y.Color.toHex,
                i;

            if(showEvent)
            {
                Y.Assert.areEqual(showEvent, charttt.showEvent, "The showEvent should be " + showEvent + ".");
            }
            if(hideEvent)
            {
                Y.Assert.areEqual(hideEvent, charttt.hideEvent, "The hideEvent should be " + hideEvent + ".");
            }
            if(show)
            {
                Y.Assert.areEqual(show, charttt.show, "The show property should be " + show + ".");
            }
            if(markerEventHandler)
            {
                Y.Assert.areEqual(markerEventHandler, charttt.markerEventHandler, "The markerEventHandler should be " + markerEventHandler + ".");
            }
            if(planarEventHandler)
            {
                Y.Assert.areEqual(planarEventHandler, charttt.planarEventHandler, "The planarEventHandler should be " + planarEventHandler + ".");
            }
            if(markerLabelFunction)
            {
                Y.Assert.areEqual(markerLabelFunction, charttt.markerLabelFunction, "The markerLabelFunction should be " + markerLabelFunction + ".");
            }
            if(planarLabelFunction)
            {
                Y.Assert.areEqual(planarLabelFunction, charttt.planarLabelFunction, "The planarLabelFunction should be " + planarLabelFunction + ".");
            }
            if(styles)
            {
                for(i in styles)
                {
                    if(styles.hasOwnProperty(i))
                    {
                        style = colorStyles.hasOwnProperty(i) ? toHex(styles[i]) : styles[i];
                    }

                    style = styles[i];
                    nodeStyle = node.getStyle(i);
                    if(colorStyles.hasOwnProperty(i))
                    {
                        style = toHex(style);
                        nodeStyle = toHex(nodeStyle);
                    }
                    Y.Assert.areEqual(style, nodeStyle, "The " + i + " style should be " + style + ".");
                }
            }
        },

        //Simulate a mousemove event to test to ensure that the correct series data is associated with
        //the correct markers.
        testEvent: function()
        {
            var currentSeries,
                keys = {},
                key,
                i = 0,
                len = this.seriesKeys.length,
                categoryKey,
                seriesKey,
                categoryDisplayName,
                seriesDisplayName,
                categoryValue,
                seriesValue,
                marker,
                markers,
                markerData,
                //determine category and series axes by direction of chart
                direction = this.chart.get("direction"),
                categoryAxis = direction == "horizontal" ? "x" : "y",
                seriesAxis = direction == "horizontal" ? "y" : "x",
                markerXY,
                markerWidth,
                markerHeight,
                getNumber = Y.TimeAxis.prototype._getNumber;
            for(; i < len; ++i)
            {
                keys[this.seriesKeys[i]] = i;
            }
            
            for(key in keys)
            {
                if(keys.hasOwnProperty(key))
                {
                    currentSeries = this.chart.getSeries(key);
                    if(currentSeries)
                    {
                        i = 0;
                        markers = currentSeries.get("markers");
                        if(markers)
                        {
                            len = markers.length || 0;
                            categoryKey = currentSeries.get(categoryAxis + "Key");
                            seriesKey = currentSeries.get(seriesAxis + "Key");
                            categoryDisplayName = currentSeries.get(categoryAxis + "DisplayName");
                            seriesDisplayName = currentSeries.get(seriesAxis + "DisplayName");
                            for(; i < len; ++i)
                            {
                                marker = markers[i];
                                if(marker)
                                {
                                    markerWidth = marker.get("width");
                                    markerHeight = marker.get("height");
                                    markerXY = marker.getXY();
                                    Y.Assert.isNumber(marker.get("width"));
                                    Y.Assert.isNumber(marker.get("height"));
                                    Y.Event.simulate(marker.get("node"), this.eventType, {
                                        clientX: markerXY[0] + markerWidth/2,
                                        clientY: markerXY[1] + markerHeight/2
                                    }); 
                                    markerData = this.getMarkerData(this.result);                
                                    categoryValue = this.chart.get("dataProvider")[markerData.index][categoryKey];
                                    if(this.chart.get("categoryType") == "time")
                                    {
                                        categoryValue = getNumber(categoryValue);
                                    }
                                    seriesValue = parseFloat(this.chart.get("dataProvider")[markerData.index][seriesKey]);
                                    Y.assert(markerData.categoryItem.displayName == categoryDisplayName);
                                    Y.assert(markerData.valueItem.displayName == seriesDisplayName);
                                    Y.assert(markerData.series == currentSeries);
                                    Y.assert(markerData.categoryItem.key == categoryKey);
                                    Y.assert(markerData.valueItem.key == seriesKey);
                                    Y.assert(markerData.categoryItem.value == categoryValue);
                                    Y.assert(markerData.valueItem.value == seriesValue);
                                    Y.assert(markerData.pageX === markerData.originEvent.pageX);
                                    Y.assert(markerData.pageY === markerData.originEvent.pageY);
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    Y.ChartMarkerEventTestTemplate = ChartMarkerEventTestTemplate;
    
    var dataValues = [
        {date:"5/1/2010", miscellaneous:2000, expenses:3700, revenue:2200}, 
        {date:"5/2/2010", miscellaneous:50, expenses:9100, revenue:100}, 
        {date:"5/3/2010", miscellaneous:400, expenses:1100, revenue:1500}, 
        {date:"5/4/2010", miscellaneous:200, expenses:1900, revenue:2800}, 
        {date:"5/5/2010", miscellaneous:5000, expenses:5000, revenue:2650}
    ],
    styledTooltip = {
        styles: { 
            backgroundColor: "#333",
            color: "#eee",
            borderColor: "#fff",
            textAlign: "center"
        },
        markerLabelFunction: function(categoryItem, valueItem, itemIndex, series, seriesIndex)
        {
            var msg = document.createElement("div"),
                underlinedTextBlock = document.createElement("span"),
                boldTextBlock = document.createElement("div");
            underlinedTextBlock.style.textDecoration = "underline";
            boldTextBlock.style.marginTop = "5px";
            boldTextBlock.style.fontWeight = "bold";
            underlinedTextBlock.appendChild(document.createTextNode(valueItem.displayName + " for " + 
                                            categoryItem.axis.get("labelFunction").apply(this, [categoryItem.value, categoryItem.axis.get("labelFormat")])));
            boldTextBlock.appendChild(document.createTextNode(valueItem.axis.get("labelFunction").apply(this, [valueItem.value, {prefix:"$", decimalPlaces:2}])));   
            msg.appendChild(underlinedTextBlock);
            msg.appendChild(document.createElement("br"));
            msg.appendChild(boldTextBlock); 
            return msg; 
        }
    },

    getTooltipTest = function(chartType, categoryAxisType, tooltip, direction, stacked)
    {
        var cfg = {
            type: chartType,
            dataProvider: dataValues,
            render: "#testdiv",
            horizontalGridlines: true,
            verticalGridlines: true,
            seriesCollection: [
                {
                    xKey: "category",
                    yKey: "miscellaneous",
                    xDisplayName: "Date",
                    yDisplayName: "Miscellaneous"
                },
                {
                    xKey: "category",
                    yKey: "expenses",
                    xDisplayName: "Date",
                    yDisplayName: "Expenses"
                },
                {
                    xKey: "category",
                    yKey: "revenue",
                    xDisplayName: "Date",
                    yDisplayName: "Revenue"
                }
            ],
            tooltip: tooltip
        },
        globalCfg = {
           eventType: tooltip.showEvent || "mouseover",
           tooltip: tooltip
        };
        if(direction)
        {
            cfg.direction = direction;
        }
        if(stacked)
        {
            cfg.stacked = stacked;
        }
        if(categoryAxisType)
        {
            cfg.categoryType = categoryAxisType;
        }
        return new ChartMarkerEventTestTemplate(cfg, globalCfg);
    };
    
    suite.add(getTooltipTest("combo", null, {
        showEvent: "mousedown"
    }, null, false));
    suite.add(getTooltipTest("combo", null, styledTooltip, null, false));

    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['charts', 'color-base', 'test']});
