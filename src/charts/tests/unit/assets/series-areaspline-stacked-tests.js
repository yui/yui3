YUI.add('series-areaspline-stacked-tests', function(Y) {
    var MockStackedAreaSplineSeries = Y.Base.create("mockStackedAreaSplineSeries", Y.StackedAreaSplineSeries, [], {
            _areaSplineDrawn: false,
            
            _coordinatesStacked: false,

            _stackCoordinates: function() {
                this._coordinatesStacked = true;
            },

            drawStackedAreaSpline: function() {
                this._areaSplineDrawn = true;
            }
        }),
        suite = new Y.Test.Suite("Charts: StackedAreaSplineSeries");
    Y.StackedAreaSplineSeriesTest = function() {
        Y.StackedAreaSplineSeriesTest.superclass.constructor.apply(this, arguments);
    };
    Y.extend(Y.StackedAreaSplineSeriesTest, Y.ChartTestTemplate, {
        setUp: function() {
            this.series = new Y.StackedAreaSplineSeries();
        },

        tearDown: function() {
            this.series = null;
        },
       
        "test: drawSeries()" : function() {
            var series = this.series,
                mockStackedAreaSplineSeries = new MockStackedAreaSplineSeries();
            series.drawSeries.apply(mockStackedAreaSplineSeries);
            Y.Assert.isTrue(mockStackedAreaSplineSeries._coordinatesStacked, "The _stackCoordinates method should have been called.");     
            Y.Assert.isTrue(mockStackedAreaSplineSeries._areaSplineDrawn, "The drawStackedAreaSpline method should have been called.");     
        }
    });
    
    suite.add(new Y.StackedAreaSplineSeriesTest({
        name: "StackedAreaSplineSeries Tests"
    }));


    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['series-areaspline-stacked', 'chart-test-template']});
