YUI.add('series-marker-stacked-tests', function(Y) {
    var MockStackedMarkerSeries = Y.Base.create("mockStackedMarkerSeries", Y.Base, [], {
            _coordinatesStacked: false,

            _stackCoordinates: function() {
                this._coordinatesStacked = true;
            }
        }),
        suite = new Y.Test.Suite("Charts: StackedMarkerSeries");
    Y.StackedMarkerSeriesTest = function() {
        Y.StackedMarkerSeriesTest.superclass.constructor.apply(this, arguments);
    };
    Y.extend(Y.StackedMarkerSeriesTest, Y.ChartTestTemplate, {
        setUp: function() {
            this.series = new Y.StackedMarkerSeries();
        },

        tearDown: function() {
            this.series = null;
        },
       
        "test: setAreaData()" : function()
        {
            var series = this.series,
                mockStackedMarkerSeries = new MockStackedMarkerSeries(),
                storedSetAreaDataMethod = Y.StackedMarkerSeries.superclass.setAreaData;
            Y.StackedMarkerSeries.superclass.setAreaData = function() {
                //do nothing
            };
            series.setAreaData.apply(mockStackedMarkerSeries);
            Y.Assert.isTrue(mockStackedMarkerSeries._coordinatesStacked, "The _stackCoordinates method should have been called.");
            Y.StackedMarkerSeries.superclass.setAreaData = storedSetAreaDataMethod;
        }
    });
    
    suite.add(new Y.StackedMarkerSeriesTest({
        name: "StackedMarkerSeries Tests"
    }));


    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['series-marker-stacked', 'chart-test-template']});
