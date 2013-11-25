YUI.add('series-spline-stacked-tests', function(Y) {
    var DOC = Y.config.doc,
        MockStackedSplineSeries = Y.Base.create("mockStackedSplineSeries", Y.Base, [], {
            _coordinatesStacked: false,

            _stackCoordinates: function() {
                this._coordinatesStacked = true;
            }
        }),
        suite = new Y.Test.Suite("Charts: StackedSplineSeries");
    Y.StackedSplineSeriesTest = function() {
        Y.StackedSplineSeriesTest.superclass.constructor.apply(this, arguments);
    };
    Y.extend(Y.StackedSplineSeriesTest, Y.ChartTestTemplate, {
        setUp: function() {
            this.series = new Y.StackedSplineSeries();
        },

        tearDown: function() {
            this.series.destroy();
            Y.Event.purgeElement(DOC, false);
        },
       
        "test: setAreaData()" : function()
        {
            var series = this.series,
                mockStackedSplineSeries = new MockStackedSplineSeries(),
                storedSetAreaDataMethod = Y.StackedSplineSeries.superclass.setAreaData;
            Y.StackedSplineSeries.superclass.setAreaData = function() {
                //do nothing
            };
            series.setAreaData.apply(mockStackedSplineSeries);
            Y.Assert.isTrue(mockStackedSplineSeries._coordinatesStacked, "The _stackCoordinates method should have been called.");
            Y.StackedSplineSeries.superclass.setAreaData = storedSetAreaDataMethod;
        }
    });
    
    suite.add(new Y.StackedSplineSeriesTest({
        name: "StackedSplineSeries Tests"
    }));


    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['series-spline-stacked', 'chart-test-template']});
