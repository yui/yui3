YUI.add('series-area-stacked-tests', function(Y) {
    var DOC = Y.config.doc,
        MockStackedAreaSeries = Y.Base.create("mockStackedAreaSeries", Y.Base, [], {
            _getStackedClosingPoints: function() {
                return [true];
            },

            _fillDrawn: false,

            _coordinatesStacked: false,

            drawFill: function(val) {
                this._fillDrawn = val;
            },

            _stackCoordinates: function() {
                this._coordinatesStacked = true;
            }
        }),
        suite = new Y.Test.Suite("Charts: StackedAreaSeries");
    Y.StackedAreaSeriesTest = function() {
        Y.StackedAreaSeriesTest.superclass.constructor.apply(this, arguments);
    };
    Y.extend(Y.StackedAreaSeriesTest, Y.ChartTestTemplate, {
        setUp: function() {
            this.series = new Y.StackedAreaSeries();
        },

        tearDown: function() {
            this.series.destroy();
            Y.Event.purgeElement(DOC, false);
        },
       
        "test: drawSeries()" : function() {
            var series = this.series,
                mockStackedAreaSeries = new MockStackedAreaSeries();
            series.drawSeries.apply(mockStackedAreaSeries);
            Y.Assert.isTrue(mockStackedAreaSeries._fillDrawn, "The drawFill method should have been called.");     
        },
    
        "test: setAreaData()" : function()
        {
            var series = this.series,
                mockStackedAreaSeries = new MockStackedAreaSeries(),
                storedSetAreaDataMethod = Y.StackedAreaSeries.superclass.setAreaData;
            Y.StackedAreaSeries.superclass.setAreaData = function() {
                //do nothing
            };
            series.setAreaData.apply(mockStackedAreaSeries);
            Y.Assert.isTrue(mockStackedAreaSeries._coordinatesStacked, "The _stackCoordinates method should have been called.");
            Y.StackedAreaSeries.superclass.setAreaData = storedSetAreaDataMethod;
        }
    });
    
    suite.add(new Y.StackedAreaSeriesTest({
        name: "StackedAreaSeries Tests"
    }));


    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['series-area-stacked', 'chart-test-template']});
