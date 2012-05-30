YUI.add('pie-tests', function(Y) {
    var suite = new Y.Test.Suite("Y.Charts.Pie"),
    
    //test to ensure that pie charts are drawn from center
    //pie charts need to have the same width/height
    PieCenterTest = new Y.Test.Case({
        name: "PieChartCenterTest",
        setUp: function() {
            Y.one("body").append('<div id="testbed"></div>');
            Y.one("#testbed").setContent('<div style="position:absolute;top:0px;left:0px;width:500px;height:400px" id="mychart"></div>');
            var myDataValues = [ 
                {day:"Monday", taxes:2000}, 
                {day:"Tuesday", taxes:50}, 
                {day:"Wednesday", taxes:4000}, 
                {day:"Thursday", taxes:200}, 
                {day:"Friday", taxes:2000}
            ];
            var mychart = new Y.Chart({type: "pie", width:400, height:400, dataProvider:myDataValues});
            mychart.render("#mychart");
            this.chart = mychart;
        },

        tearDown: function() {
            this.chart.destroy();
            Y.one("#testbed").destroy(true);
        },

        testWidthAndHeightEqual: function()
        {
            var graphic = this.chart.get("graph").get("graphic"),
                shapes = graphic.get("shapes"),
                i,
                shape;
            for(i in shapes)
            {
                if(shapes.hasOwnProperty(i))
                {
                    shape = shapes[i];
                    Y.assert(shape.get("width") === shape.get("height"));
                }
            }
        },

        testWidthGreaterThanHeight: function()
        {
            var graphic = this.chart.get("graph").get("graphic"),
                shapes,
                i,
                shape;
            this.chart.set("width", 500);
            shapes = graphic.get("shapes");
            for(i in shapes)
            {
                if(shapes.hasOwnProperty(i))
                {
                    shape = shapes[i];
                    Y.assert(shape.get("width") === shape.get("height"));
                }
            }
        },

        testHeightGreaterThanWidth: function()
        {
            var graphic = this.chart.get("graph").get("graphic"),
                shapes,
                i,
                shape;
            this.chart.set("height", 600);
            shapes = graphic.get("shapes");
            for(i in shapes)
            {
                if(shapes.hasOwnProperty(i))
                {
                    shape = shapes[i];
                    Y.assert(shape.get("width") === shape.get("height"));
                }
            }
        }
    });

    suite.add(PieCenterTest);

    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['charts', 'test']});
