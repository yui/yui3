YUI.add('charts-arialine-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: AriaLine"),
        myDataValues = [ 
            {category:"5/1/2010", values:2000, expenses:3700, revenue:2200}, 
            {category:"5/2/2010", values:50, expenses:9100, revenue:100}, 
            {category:"5/3/2010", values:400, expenses:1100, revenue:1500}, 
            {category:"5/4/2010", values:200, expenses:1900, revenue:2800}, 
            {category:"5/5/2010", values:5000, expenses:5000, revenue:2650}
        ],
        pieDataValues = [
            {category:"5/1/2010", revenue:2200}, 
            {category:"5/2/2010", revenue:100}, 
            {category:"5/3/2010", revenue:1500}, 
            {category:"5/4/2010", revenue:2800}, 
            {category:"5/5/2010", revenue:2650}
        ],
        defaultAriaDescription = "Use the up and down keys to navigate between series. Use the left and right keys to navigate through items in a series.",
        defaultPieAriaDescription = "Use the left and right keys to navigate through items.",
        seriesKeys = ["values", "revenue"],
        width = 400,
        height = 300,
        parentDiv = Y.DOM.create('<div style="position:absolute;top:500px;left:0px;width:500px;height:400px" id="testdiv"></div>'),
        DOC = Y.config.doc;
    DOC.body.appendChild(parentDiv);

    function AriaTests(cfg, testConfig)
    {
        AriaTests.superclass.constructor.apply(this);
        this.attrConfig = cfg;
        this.name = testConfig.type + " Aria Tests";
        this.defaultAriaDescription = testConfig.defaultAriaDescription;
    }
    Y.extend(AriaTests, Y.Test.Case, {
        defaultAriaLabel: "Chart Application",

        changedAriaLabel: "This is a new ariaLabel value.",

        setUp: function() {
            var mychart = new Y.Chart(this.attrConfig);
            this.chart = mychart;
        },
        
        tearDown: function() {
            this.chart.destroy();
            Y.Event.purgeElement(DOC, false);
        },
        
        "test:getAriaLabel()": function()
        {
            Y.Assert.isTrue(this.chart.get("ariaLabel") == this.defaultAriaLabel);
        },

        "test:setAriaLabel()": function()
        {
            var chart = this.chart;
            chart.set("ariaLabel", this.changedAriaLabel);
            Y.Assert.isTrue(chart.get("ariaLabel") == this.changedAriaLabel);
        },

        "test:getAriaDescription()": function()
        {
            Y.Assert.isTrue(this.chart.get("ariaDescription") == this.defaultAriaDescription);
        },
        
        "test:setAriaDescription()": function()
        {
            var chart = this.chart;
            chart.set("ariaDescription", this.changedAriaLabel);
            Y.Assert.isTrue(chart.get("ariaDescription") == this.changedAriaLabel);
        }
    });
    Y.AriaTests = AriaTests;
    
    var comboTests = new Y.AriaTests({
        dataProvider: myDataValues,
        render: "#testdiv",
        type: "combo",
        width: width,
        height: height
    }, {
        type: "Combo",
        defaultAriaDescription: defaultAriaDescription
    }),
    stackedComboTests = new Y.AriaTests({
        dataProvider: myDataValues,
        render: "#testdiv",
        type: "combo",
        stacked: true,
        width: width,
        height: height
    }, {
        type: "StackedCombo",
        defaultAriaDescription: defaultAriaDescription
    }),
    areaTests = new Y.AriaTests({
        dataProvider: myDataValues,
        render: "#testdiv",
        type: "area",
        width: width,
        height: height
    }, {
        type: "Area",
        defaultAriaDescription: defaultAriaDescription
    }),
    stackedAreaTests = new Y.AriaTests({
        dataProvider: myDataValues,
        render: "#testdiv",
        type: "area",
        stacked: true,
        width: width,
        height: height
    }, {
        type: "StackedArea",
        defaultAriaDescription: defaultAriaDescription
    }),
    lineTests = new Y.AriaTests({
        dataProvider: myDataValues,
        render: "#testdiv",
        type: "line",
        width: width,
        height: height
    }, {
        type: "Line",
        defaultAriaDescription: defaultAriaDescription
    }),
    stackedLineTests = new Y.AriaTests({
        dataProvider: myDataValues,
        render: "#testdiv",
        type: "line",
        stacked: true,
        width: width,
        height: height
    }, {
        type: "StackedLine",
        defaultAriaDescription: defaultAriaDescription
    }),
    markerTests = new Y.AriaTests({
        dataProvider: myDataValues,
        render: "#testdiv",
        type: "markerseries",
        width: width,
        height: height
    }, {
        type: "Marker",
        defaultAriaDescription: defaultAriaDescription
    }),
    stackedMarkerTests = new Y.AriaTests({
        dataProvider: myDataValues,
        render: "#testdiv",
        type: "markerseries",
        stacked: true,
        width: width,
        height: height
    }, {
        type: "StackedMarker",
        defaultAriaDescription: defaultAriaDescription
    });

    suite.add(comboTests);
    suite.add(stackedComboTests);
    suite.add(areaTests);
    suite.add(stackedAreaTests);
    suite.add(lineTests);
    suite.add(stackedLineTests);
    suite.add(markerTests);
    suite.add(stackedMarkerTests);

    //run the tests
    Y.Test.Runner.setName("Charts: AriaLine");
    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['charts', 'test']});
