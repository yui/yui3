YUI.add('charts-ariaspline-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: AriaSpline"),
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
        height = 300;

    function AriaTests(cfg, testConfig)
    {
        AriaTests.superclass.constructor.apply(this);
        this.attrConfig = cfg;
        this.name = testConfig.type + " Aria Tests";
        this.defaultAriaDescription = testConfig.defaultAriaDescription;;
    }
    Y.extend(AriaTests, Y.Test.Case, {
        defaultAriaLabel: "Chart Application",

        changedAriaLabel: "This is a new ariaLabel value.",

        setUp: function() {
            Y.one("body").append('<div id="testbed"></div>');
            Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="mychart"></div>');
            var mychart = new Y.Chart(this.attrConfig);
            this.chart = mychart;
        },
        
        tearDown: function() {
            this.chart.destroy();
            Y.one("#testbed").destroy(true);
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
    
    var splineTests = new Y.AriaTests({
        dataProvider: myDataValues,
        render: "#mychart",
        type: "spline",
        width: width,
        height: height
    }, {
        type: "Spline",
        defaultAriaDescription: defaultAriaDescription
    }),
    stackedSplineTests = new Y.AriaTests({
        dataProvider: myDataValues,
        render: "#mychart",
        type: "spline",
        stacked: true,
        width: width,
        height: height
    }, {
        type: "StackedSpline",
        defaultAriaDescription: defaultAriaDescription
    }),
    comboSplineTests = new Y.AriaTests({
        dataProvider: myDataValues,
        render: "#mychart",
        type: "combospline",
        width: width,
        height: height
    }, {
        type: "ComboSpline",
        defaultAriaDescription: defaultAriaDescription
    }),
    stackedComboSplineTests = new Y.AriaTests({
        dataProvider: myDataValues,
        render: "#mychart",
        type: "combospline",
        stacked: true,
        width: width,
        height: height
    }, {
        type: "StackedComboSpline",
        defaultAriaDescription: defaultAriaDescription
    });

    suite.add(splineTests);
    suite.add(stackedSplineTests);
    suite.add(comboSplineTests);
    suite.add(stackedComboSplineTests);
    
    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['charts', 'test']});
