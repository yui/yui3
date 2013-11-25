YUI.add('charts-ariapie-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: AriaPie"),
        pieDataValues = [
            {category:"5/1/2010", revenue:2200}, 
            {category:"5/2/2010", revenue:100}, 
            {category:"5/3/2010", revenue:1500}, 
            {category:"5/4/2010", revenue:2800}, 
            {category:"5/5/2010", revenue:2650}
        ],
        defaultPieAriaDescription = "Use the left and right keys to navigate through items.",
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
            this.chart.destroy(true);
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
    
    var pieTests = new Y.AriaTests({
        dataProvider: pieDataValues,
        render: "#testdiv",
        type: "pie",
        width: width,
        height: height
    }, {
        type: "Pie",
        defaultAriaDescription: defaultPieAriaDescription
    });

    suite.add(pieTests);

    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['charts', 'test']});
