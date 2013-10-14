YUI.add('series-combo-stacked-tests', function(Y) {
    var DOC = Y.config.doc,
        MockStackedComboSeries = Y.Base.create("mockStackedComboSeries", Y.Base, [], {
            _linesDrawn: false,
            
            _fillDrawn: false,

            _markersDrawn: false,

            _showAreaFill: false,

            _showLines: false,

            _showMarkers: false,

            _coordinatesStacked: false,

            _stackCoordinates: function() {
                this._coordinatesStacked = true;
            },

            _getStackedClosingPoints: function() {
                return [true];
            },

            get: function(val) {
                return this["_" + val];
            },

            drawLines: function() {
                this._linesDrawn = true;
            },

            drawFill: function(val) {
                this._fillDrawn = val;
            },

            drawPlots: function() {
                this._markersDrawn = true;
            }
        }),
        suite = new Y.Test.Suite("Charts: StackedComboSeries");
    Y.StackedComboSeriesTest = function() {
        Y.StackedComboSeriesTest.superclass.constructor.apply(this, arguments);
    };
    Y.extend(Y.StackedComboSeriesTest, Y.ChartTestTemplate, {
        setUp: function() {
            this.series = new Y.StackedComboSeries();
        },

        tearDown: function() {
            this.series.destroy();
            Y.Event.purgeElement(DOC, false);
        },
       
        "test: drawSeries()" : function() {
            var series = this.series,
                mockStackedComboSeries = new MockStackedComboSeries();
            series.drawSeries.apply(mockStackedComboSeries);
            Y.Assert.isFalse(mockStackedComboSeries._linesDrawn, "The drawLines method should not have been called.");     
            Y.Assert.isFalse(mockStackedComboSeries._fillDrawn, "The drawFill method should not have been called.");     
            Y.Assert.isFalse(mockStackedComboSeries._markersDrawn, "The drawMarkers method should not have been called.");     
            mockStackedComboSeries._showLines = true;
            mockStackedComboSeries._showAreaFill = true;
            mockStackedComboSeries._showMarkers = true;
            series.drawSeries.apply(mockStackedComboSeries);
            Y.Assert.isTrue(mockStackedComboSeries._linesDrawn, "The drawLines method should have been called.");     
            Y.Assert.isTrue(mockStackedComboSeries._fillDrawn, "The drawFill method should have been called.");     
            Y.Assert.isTrue(mockStackedComboSeries._markersDrawn, "The drawMarkers method should have been called.");     
        },
    
        "test: setAreaData()" : function()
        {
            var series = this.series,
                mockStackedComboSeries = new MockStackedComboSeries(),
                storedSetAreaDataMethod = Y.StackedComboSeries.superclass.setAreaData;
            Y.StackedComboSeries.superclass.setAreaData = function() {
                //do nothing
            };
            series.setAreaData.apply(mockStackedComboSeries);
            Y.Assert.isTrue(mockStackedComboSeries._coordinatesStacked, "The _stackCoordinates method should have been called.");
            Y.StackedComboSeries.superclass.setAreaData = storedSetAreaDataMethod;
        }
    });
    
    suite.add(new Y.StackedComboSeriesTest({
        name: "StackedComboSeries Tests"
    }));


    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['series-combo-stacked', 'chart-test-template']});
