YUI.add('series-bar-stacked-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: StackedBarSeries"),
        seriesTest = new Y.Test.Case({
        setUp: function() {
            this.series = new Y.StackedBarSeries();
        },

        tearDown: function() {
            this.series = null;
        },

        "test: get('type')" : function() {
            Y.Assert.isInstanceOf(Y.StackedBarSeries, this.series, "The series should be and instanceof StackedBarSeries.");
            Y.Assert.areEqual("stackedBar", this.series.get("type"), "The series type attribute should be stackedBar.");
        }
    });
    suite.add(seriesTest);
    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['series-bar-stacked']});
