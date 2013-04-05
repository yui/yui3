YUI.add('axis-stacked-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: StackedAxis"),
        axisTest = new Y.Test.Case({
        setUp: function() {
            this.axis = new Y.StackedAxisBase();
        },

        tearDown: function() {
            this.axis = null;
        },

        "test: get('type')" : function() {
            Y.Assert.isInstanceOf(Y.StackedAxisBase, this.axis, "The axis should be and instanceof StackedAxisBase.");
            Y.Assert.areEqual("stacked", this.axis.get("type"), "The axis type attribute should be stacked.");
        }
    });
    suite.add(axisTest);
    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['axis-stacked']});
