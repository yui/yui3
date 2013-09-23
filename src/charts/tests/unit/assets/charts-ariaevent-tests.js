YUI.add('charts-ariaevent-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: AriaEvents"),
        parentDiv = Y.DOM.create('<div style="position:absolute;top:500px;left:0px;width:500px;height:400px" id="testdiv"></div>'),
        DOC = Y.config.doc;
        ASSERT = Y.Assert,
        ObjectAssert = Y.ObjectAssert,
        UP = 38,
        DOWN = 40,
        LEFT = 37,
        RIGHT = 39;
    DOC.body.appendChild(parentDiv);
        
        
    //-------------------------------------------------------------------------
    // Chart AriaEvent Test Case
    //-------------------------------------------------------------------------
    function ChartAriaEventTestCase(cfg, type)
    {
        ChartAriaEventTestCase.superclass.constructor.call(this);
        this.attrCfg = cfg;
        this.result = null;
        this.name = type + " Chart AriaEvent KeyDown Tests";
    }

    Y.extend(ChartAriaEventTestCase, Y.Test.Case, {
        //---------------------------------------------------------------------
        // Setup and teardown of test harnesses
        //---------------------------------------------------------------------
        
        /*
         * Sets up several event handlers used to test UserAction mouse events.
         */
        setUp : function() 
        {
            this.chart = new Y.Chart(this.attrCfg);
            this.contentBox = this.chart.get("contentBox");
            this.result = null;
            this.handler = Y.on("keydown", Y.bind(this.handleEvent, this), this.contentBox);
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
       
        _seriesIndex: -1, 

        _itemIndex: -1,

        compareLiveRegionMessages: function(target, key, liveRegion)
        {
            target.simulate("keydown", {
                keyCode: key
            });
            return [liveRegion.get("innerHTML").toString(), this.getLiveRegionMessage(this.result).toString()];
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
    Y.ChartAriaEventTestCase = ChartAriaEventTestCase; 

    function CartesianChartAriaEventTestCase()
    {
        CartesianChartAriaEventTestCase.superclass.constructor.apply(this, arguments);
    }
    
    Y.extend(CartesianChartAriaEventTestCase, ChartAriaEventTestCase, {
        testDefault: function()
        {
            var cb = this.chart.get("contentBox"),
                dataProvider = this.chart.get("dataProvider"),
                liveRegion = this.chart._liveRegion,
                i = 0,
                len = 5,
                target = Y.one(cb),
                values;
            Y.one(cb).simulate("keydown", {
                keyCode: DOWN    
            }); 
            Y.Assert.isTrue(liveRegion.get("innerHTML") == this.getLiveRegionMessage(this.result));
            for(; i < len; ++i)
            {
                values = this.compareLiveRegionMessages(target, RIGHT, liveRegion);
                Y.Assert.isTrue(values[0] == values[1]);
            }
            Y.one(cb).simulate("keydown", {
                keyCode: DOWN    
            }); 
            Y.Assert.isTrue(liveRegion.get("innerHTML") == this.getLiveRegionMessage(this.result));
            for(i = 0; i < len; ++i)
            {
                values = this.compareLiveRegionMessages(target, RIGHT, liveRegion);
                Y.Assert.isTrue(values[0] == values[1]);
            }
            Y.one(cb).simulate("keydown", {
                keyCode: DOWN    
            }); 
            Y.Assert.isTrue(liveRegion.get("innerHTML") == this.getLiveRegionMessage(this.result));
            for(i = 0; i < len; ++i)
            {
                values = this.compareLiveRegionMessages(target, RIGHT, liveRegion);
                Y.Assert.isTrue(values[0] == values[1]);
            }
        },

        getLiveRegionMessage: function(e) {
            var key = parseFloat(e.keyCode),
                msg = "",
                series,
                items,
                categoryItem,
                valueItem,
                seriesIndex = this._seriesIndex,
                itemIndex = this._itemIndex,
                seriesCollection = this.chart.get("seriesCollection"),
                len = seriesCollection.length,
                dataLength;
            if(key % 2 === 0)
            {
                if(len > 1)
                {
                    if(key === 38)
                    {
                        seriesIndex = seriesIndex < 1 ? len - 1 : seriesIndex - 1;
                    }
                    else if(key === 40)
                    {
                        seriesIndex = seriesIndex >= len - 1 ? 0 : seriesIndex + 1;
                    }
                    this._itemIndex = -1;
                }
                else
                {
                    seriesIndex = 0;
                }
                this._seriesIndex = seriesIndex;
                series = this.chart.getSeries(parseInt(seriesIndex, 10));
                msg = series.get("valueDisplayName") + " series.";
            }
            else
            {
                if(seriesIndex > -1)
                {
                    msg = "";
                    series = this.chart.getSeries(parseInt(seriesIndex, 10));
                }
                else
                {
                    seriesIndex = 0;
                    this._seriesIndex = seriesIndex;
                    series = this.chart.getSeries(parseInt(seriesIndex, 10));
                    msg = series.get("valueDisplayName") + " series.";
                }
                dataLength = series._dataLength ? series._dataLength : 0;
                if(key === 37)
                {
                    itemIndex = itemIndex > 0 ? itemIndex - 1 : dataLength - 1;
                    itemIndex = itemIndex > 0 ? itemIndex - 1 : dataLength - 1;
                }
                else if(key === 39)
                {
                    itemIndex = itemIndex >= dataLength - 1 ? 0 : itemIndex + 1;
                }
                this._itemIndex = itemIndex;
                items = this.chart.getSeriesItems(series, itemIndex);
                categoryItem = items.category;
                valueItem = items.value;
                if(categoryItem && valueItem && categoryItem.value && valueItem.value)
                {
                    msg += categoryItem.displayName + ": " + categoryItem.axis.formatLabel.apply(this, [categoryItem.value, categoryItem.axis.get("labelFormat")]) + ", ";
                    msg += valueItem.displayName + ": " + valueItem.axis.formatLabel.apply(this, [valueItem.value, valueItem.axis.get("labelFormat")]) + ", "; 
                }
                else
                {
                    msg += "No data available.";
                }
                msg += (itemIndex + 1) + " of " + dataLength + ". ";
            }
            return msg;
        }
    });
    Y.CartesianChartAriaEventTestCase = CartesianChartAriaEventTestCase;

    function PieChartAriaEventTestCase()
    {
        PieChartAriaEventTestCase.superclass.constructor.apply(this, arguments);
    }
    
    Y.extend(PieChartAriaEventTestCase, ChartAriaEventTestCase, {
        testDefault: function()
        {
            var cb = this.chart.get("contentBox"),
                dataProvider = this.chart.get("dataProvider"),
                liveRegion = this.chart._liveRegion,
                i = 0,
                len = 5,
                target = Y.one(cb),
                values;
            for(; i < len; ++i)
            {
                values = this.compareLiveRegionMessages(target, RIGHT, liveRegion);
                Y.Assert.isTrue(values[0] == values[1]);
            }
            for(i = len; i > -1; --i)
            {
                values = this.compareLiveRegionMessages(target, LEFT, liveRegion);
                Y.Assert.isTrue(values[0] == values[1]);
            }
        },

        getLiveRegionMessage: function(e) {
            var key = parseFloat(e.keyCode),
                msg = "",
                categoryItem,
                items,
                series,
                valueItem,
                seriesIndex = 0,
                itemIndex = this._itemIndex,
                seriesCollection = this.chart.get("seriesCollection"),
                len,
                total,
                pct,
                markers;
            series = this.chart.getSeries(parseInt(seriesIndex, 10));
            markers = series.get("markers");
            len = markers && markers.length ? markers.length : 0;
            if(key === 37)
            {
                itemIndex = itemIndex > 0 ? itemIndex - 1 : len - 1;
            }
            else if(key === 39)
            {
                itemIndex = itemIndex >= len - 1 ? 0 : itemIndex + 1;
            }
            this._itemIndex = itemIndex;
            items = this.chart.getSeriesItems(series, itemIndex);
            categoryItem = items.category;
            valueItem = items.value;
            total = series.getTotalValues();
            pct = Math.round((valueItem.value / total) * 10000)/100;
            if(categoryItem && valueItem)
            {
                msg += categoryItem.displayName + ": " + categoryItem.axis.formatLabel.apply(this, [categoryItem.value, categoryItem.axis.get("labelFormat")]) + ", ";
                msg += valueItem.displayName + ": " + valueItem.axis.formatLabel.apply(this, [valueItem.value, valueItem.axis.get("labelFormat")]) + ", "; 
                msg += "Percent of total " + valueItem.displayName + ": " + pct + "%,"; 
            }
            else
            {
                msg += "No data available,";
            }
            msg += (itemIndex + 1) + " of " + len + ". ";
            return msg;
        }
    });
    Y.PieChartAriaEventTestCase = PieChartAriaEventTestCase;

    var DataProvider = [
        {category:"5/1/2010", values:2000, expenses:3700, revenue:2200}, 
        {category:"5/2/2010", values:50, expenses:9100, revenue:100}, 
        {category:"5/3/2010", values:400, expenses:1100, revenue:1500}, 
        {category:"5/4/2010", values:200, expenses:1900, revenue:2800}, 
        {category:"5/5/2010", values:5000, expenses:5000, revenue:2650}
    ],
    PieDataProvider = [
        {category:"5/1/2010", revenue:2200}, 
        {category:"5/2/2010", revenue:100}, 
        {category:"5/3/2010", revenue:1500}, 
        {category:"5/4/2010", revenue:2800}, 
        {category:"5/5/2010", revenue:2650}
    ],
    columnTests = new Y.CartesianChartAriaEventTestCase({
        type: "column",
        render: "#testdiv",
        dataProvider: DataProvider
    }, "Column"),
    barTests = new Y.CartesianChartAriaEventTestCase({
        type: "bar",
        render: "#testdiv",
        dataProvider: DataProvider
    }, "Bar"),
    stackedColumnTests = new Y.CartesianChartAriaEventTestCase({
        type: "column",
        stacked: true,
        render: "#testdiv",
        dataProvider: DataProvider
    }, "StackedColumn"),
    stackedBarTests = new Y.CartesianChartAriaEventTestCase({
        type: "bar",
        stacked: true,
        render: "#testdiv",
        dataProvider: DataProvider
    }, "StackedBar"),
    comboTests = new Y.CartesianChartAriaEventTestCase({
        type: "combo",
        render: "#testdiv",
        dataProvider: DataProvider
    }, "Combo"),
    stackedComboTests = new Y.CartesianChartAriaEventTestCase({
        type: "combo",
        stacked: true,
        render: "#testdiv",
        dataProvider: DataProvider
    }, "StackedCombo"),
    areaTests = new Y.CartesianChartAriaEventTestCase({
        type: "area",
        render: "#testdiv",
        dataProvider: DataProvider
    }, "Area"),
    stackedAreaTests = new Y.CartesianChartAriaEventTestCase({
        type: "area",
        stacked: true,
        render: "#testdiv",
        dataProvider: DataProvider
    }, "StackedArea"),
    splineTests = new Y.CartesianChartAriaEventTestCase({
        type: "spline",
        render: "#testdiv",
        dataProvider: DataProvider
    }, "Spline"),
    stackedSplineTests = new Y.CartesianChartAriaEventTestCase({
        type: "spline",
        stacked: true,
        render: "#testdiv",
        dataProvider: DataProvider
    }, "StackedSpline"),
    comboSplineTests = new Y.CartesianChartAriaEventTestCase({
        type: "combospline",
        render: "#testdiv",
        dataProvider: DataProvider
    }, "ComboSpline"),
    stackedComboSplineTests = new Y.CartesianChartAriaEventTestCase({
        type: "combospline",
        stacked: true,
        render: "#testdiv",
        dataProvider: DataProvider
    }, "StackedComboSpline"),
    lineTests = new Y.CartesianChartAriaEventTestCase({
        type: "line",
        render: "#testdiv",
        dataProvider: DataProvider
    }, "Line"),
    stackedLineTests = new Y.CartesianChartAriaEventTestCase({
        type: "line",
        stacked: true,
        render: "#testdiv",
        dataProvider: DataProvider
    }, "StackedLine"),
    markerTests = new Y.CartesianChartAriaEventTestCase({
        type: "markerseries",
        render: "#testdiv",
        dataProvider: DataProvider
    }, "Marker"),
    stackedMarkerTests = new Y.CartesianChartAriaEventTestCase({
        type: "markerseries",
        stacked: true,
        render: "#testdiv",
        dataProvider: DataProvider
    }, "StackedMarker"),
    pieTests = new Y.PieChartAriaEventTestCase({
        type: "pie",
        render: "#testdiv",
        dataProvider: PieDataProvider
    }, "Pie");
    
    suite.add(columnTests);
    suite.add(barTests);
    suite.add(stackedColumnTests);
    suite.add(stackedBarTests);
    suite.add(comboTests);
    suite.add(stackedComboTests);
    suite.add(areaTests);
    suite.add(stackedAreaTests);
    suite.add(splineTests);
    suite.add(stackedSplineTests);
    suite.add(comboSplineTests);
    suite.add(stackedComboSplineTests);
    suite.add(lineTests);
    suite.add(stackedLineTests);
    suite.add(markerTests);
    suite.add(stackedMarkerTests);
    suite.add(pieTests);
    
    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['node-event-simulate', 'event-focus','charts', 'test']});
