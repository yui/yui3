YUI.add('pie-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: Pie"),
        newDataValues = [
                {day:"Monday", taxes:200}, 
                {day:"Tuesday", taxes:5000}, 
                {day:"Wednesday", taxes:400}, 
                {day:"Thursday", taxes:1200}, 
                {day:"Friday", taxes:2000},
                {day:"Saturday", taxes:1500},
                {day:"Sunday", taxes:1800}
        ],
        PieCenterTest,		
        parentDiv = Y.DOM.create('<div style="position:absolute;top:500px;left:0px;width:500px;height:400px" id="testdiv"></div>'),
        DOC = Y.config.doc;
    DOC.body.appendChild(parentDiv);
    
    //test to ensure that pie charts are drawn from center
    //pie charts need to have the same width/height
    PieCenterTest = new Y.Test.Case({
        name: "PieChartCenterTest",
        setUp: function() {
            var myDataValues = [ 
                {day:"Monday", taxes:2000}, 
                {day:"Tuesday", taxes:50}, 
                {day:"Wednesday", taxes:4000}, 
                {day:"Thursday", taxes:200}, 
                {day:"Friday", taxes:2000}
            ];
            var mychart = new Y.Chart({type: "pie", categoryKey: "day", width:400, height:400, dataProvider:myDataValues});
            mychart.render("#testdiv");
            this.chart = mychart;
        },

        tearDown: function() {
            this.chart.destroy(true);
            Y.Event.purgeElement(DOC, false);
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
        },

        testUpdateDataProvider: function()
        {
            var chart = this.chart,
                graphic = chart.get("graph").get("graphic"),
                shapes;
            chart.set("dataProvider", newDataValues); 
            shapes = graphic.get("shapes");
            Y.Assert.areEqual(7, Y.Object.size(shapes), "There should be seven pie slices.");
        }
    });

    suite.add(PieCenterTest);

    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['charts', 'test']});
