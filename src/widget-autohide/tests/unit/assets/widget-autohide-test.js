YUI.add('widget-autohide-test', function (Y) {

var Assert      = Y.Assert,
    ArrayAssert = Y.ArrayAssert,

    suite, TestWidget;

// -- Suite --------------------------------------------------------------------
suite      = new Y.Test.Suite('Widget: Autohide');
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
    },

    'WidgetAutohide should hide when a click occurs outside its `boundingBox`': function () {
        this.widget = new TestWidget({
            visible: true,
            render : '#test'
        });

        this.widget.set('hideOn', [{eventName: 'clickoutside'}]);

        Assert.isArray(this.widget.get('hideOn'), '`hideOn` is not an Array.');
        Assert.areSame(1, this.widget.get('hideOn').length, '`hideOn` does not contain 1 item.');
        Assert.isTrue(this.widget.get('visible'), 'widget is not visible.');

        // The simulated click apparently needs to happen after the widget has
        // been rendered to the DOM.
        this.wait(function () {
            Y.one('#test').simulate('click');
            Assert.isFalse(this.widget.get('visible'), 'widget did not hide.');
        }, 0);
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['widget-autohide', 'test', 'node-event-simulate']
});
