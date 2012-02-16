YUI.add('widget-position-constrain-test', function (Y) {

var Assert      = Y.Assert,
    ArrayAssert = Y.ArrayAssert,

    suite;

// -- Suite --------------------------------------------------------------------
suite      = new Y.Test.Suite('WidgetPositionConstrain');
TestWidget = Y.Base.create('testWidget', Y.Widget, [Y.WidgetPosition, Y.WidgetPositionConstrain]);

// -- Lifecycle ----------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Lifecycle',

    tearDown: function () {
        this.widget && this.widget.destroy();
        delete this.widget;
        Y.one('#test').empty();
    },

    'WidgetPositionConstrain should add a `constrain` attribute': function () {
        this.widget = new TestWidget({constrain: '#test'});
        this.widget.render('#test');

        Assert.areSame(Y.one('#test'), this.widget.get('constrain'), '`constrain` is not "#test" node.');
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['widget-position-constrain', 'test']
});
