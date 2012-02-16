YUI.add('widget-modality-test', function (Y) {

var Assert      = Y.Assert,
    ArrayAssert = Y.ArrayAssert,

    suite;

// -- Suite --------------------------------------------------------------------
suite      = new Y.Test.Suite('WidgetModality');
TestWidget = Y.Base.create('testWidget', Y.Widget, [Y.WidgetModality]);

// -- Lifecycle ----------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Lifecycle',

    tearDown: function () {
        this.widget && this.widget.destroy();
        delete this.widget;
        Y.one('#test').empty();
    },

    'WidgetModality should add a `modal` attribute': function () {
        this.widget = new TestWidget();
        this.widget.render('#test');

        Assert.isBoolean(this.widget.get('modal'), '`modal` is not a Boolean.');
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['widget-modality', 'test']
});
