YUI.add('widget-stdmod-test', function (Y) {

var Assert      = Y.Assert,
    ArrayAssert = Y.ArrayAssert,

    suite;

// -- Suite --------------------------------------------------------------------
suite      = new Y.Test.Suite('WidgetStdMod');
TestWidget = Y.Base.create('testWidget', Y.Widget, [Y.WidgetStdMod]);

// -- Lifecycle ----------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Lifecycle',

    tearDown: function () {
        this.widget && this.widget.destroy();
        delete this.widget;
        Y.one('#test').empty();
    },

    'WidgetStdMod should add a `fillHeight` attribute': function () {
        this.widget = new TestWidget();
        this.widget.render('#test');

        Assert.areSame('body', this.widget.get('fillHeight'), '`fillHeight` is not "body".');
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['widget-stdmod', 'test']
});
