YUI.add('widget-position-test', function (Y) {

var Assert      = Y.Assert,
    ArrayAssert = Y.ArrayAssert,

    suite;

// -- Suite --------------------------------------------------------------------
suite      = new Y.Test.Suite('WidgetPosition');
TestWidget = Y.Base.create('testWidget', Y.Widget, [Y.WidgetPosition]);

// -- Lifecycle ----------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Lifecycle',

    tearDown: function () {
        this.widget && this.widget.destroy();
        delete this.widget;
        Y.one('#test').empty();
    },

    'WidgetPosition should add an `xy` attribute': function () {
        this.widget = new TestWidget();
        this.widget.render('#test');

        Assert.isArray(this.widget.get('xy'), '`xy` is not an Array.');
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['widget-position', 'test']
});
