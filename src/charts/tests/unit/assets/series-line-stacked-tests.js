YUI.add('series-line-stacked-tests', function(Y) {
    var MockStackedLineSeries = Y.Base.create("mockStackedLineSeries", Y.Base, [], {
            _coordinatesStacked: false,

            _stackCoordinates: function() {
                this._coordinatesStacked = true;
            }
        }),
        suite = new Y.Test.Suite("Charts: StackedLineSeries");
    Y.StackedLineSeriesTest = function() {
        Y.StackedLineSeriesTest.superclass.constructor.apply(this, arguments);
    };
    Y.extend(Y.StackedLineSeriesTest, Y.ChartTestTemplate, {
        setUp: function() {
            this.series = new Y.StackedLineSeries();
        },

        tearDown: function() {
            this.series = null;
        },
       
        "test: setAreaData()" : function()
        {
            var series = this.series,
                mockStackedLineSeries = new MockStackedLineSeries(),
                storedSetAreaDataMethod = Y.StackedLineSeries.superclass.setAreaData;
            Y.StackedLineSeries.superclass.setAreaData = function() {
                //do nothing
            };
            series.setAreaData.apply(mockStackedLineSeries);
            Y.Assert.isTrue(mockStackedLineSeries._coordinatesStacked, "The _stackCoordinates method should have been called.");
            Y.StackedLineSeries.superclass.setAreaData = storedSetAreaDataMethod;
        }
    });
    
    suite.add(new Y.StackedLineSeriesTest({
        name: "StackedLineSeries Tests"
    }));


    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['series-line-stacked', 'chart-test-template']});
