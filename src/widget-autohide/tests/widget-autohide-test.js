YUI.add('widget-autohide-test', function (Y) {

var Assert      = Y.Assert,
    ArrayAssert = Y.ArrayAssert,

    suite;

// -- Suite --------------------------------------------------------------------
suite      = new Y.Test.Suite('WidgetAutohide');
TestWidget = Y.Base.create('testWidget', Y.Widget, [Y.WidgetAutohide]);

// -- Lifecycle ----------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Lifecycle',

    tearDown: function () {
        this.widget && this.widget.destroy();
        delete this.widget;
        Y.one('#test').empty();
    },

    'WidgetAutohide should add a `hideOn` attribute': function () {
        this.widget = new TestWidget();
        this.widget.render('#test');

        Assert.isArray(this.widget.get('hideOn'), '`hideOn` is not an Array.');
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['widget-autohide', 'test']
});
