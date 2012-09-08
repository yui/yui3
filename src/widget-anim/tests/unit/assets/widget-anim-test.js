YUI.add('widget-anim-test', function (Y) {

var Assert      = Y.Assert,
    ArrayAssert = Y.ArrayAssert,

    suite;

// -- Suite --------------------------------------------------------------------
suite = new Y.Test.Suite('Widget: Anim');

// -- Lifecycle ----------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Lifecycle',

    tearDown: function () {
        this.widget && this.widget.destroy();
        delete this.widget;
        Y.one('#test').empty();
    },

    'A widget should be pluggable with Y.Plugin.WidgetAnim': function () {
        this.widget = new Y.Widget();
        this.widget.plug(Y.Plugin.WidgetAnim);
        this.widget.render('#test');

        Assert.isObject(this.widget.hasPlugin('anim'), 'Widget does not have the "anim" plugin.');
        Assert.isInstanceOf(Y.Plugin.WidgetAnim, this.widget.anim, 'Widget does not contain a Y.Plugin.WidgetAnim instance.');
    },

    'A widget should animate on `visibleChange` when plugged with Y.Plugin.WidgetAnim': function () {
        var vcCalled   = 0,
            animCalled = 0;

        this.widget = new Y.Widget({
            visible: false,
            render : '#test',
            plugins: [Y.Plugin.WidgetAnim]
        });

        Assert.isObject(this.widget.hasPlugin('anim'), 'widget does not have the "anim" plugin.');

        this.widget.after('visibleChange', function () {
            vcCalled += 1;
        });

        this.widget.anim.get('animShow').on('end', function () {
            animCalled += 1;
        });

        Assert.isFalse(this.widget.get('visible'), 'widget is not hidden.');
        this.widget.show();

        this.wait(function () {
            Assert.isTrue(this.widget.get('visible'), 'widget is not visible.');
            Assert.areSame(1, vcCalled, '`visibleChange` was not fired.');
            Assert.areSame(1, animCalled, 'Anim `end` was not fired.');
        }, (this.widget.anim.get('duration') * 1000) * 2);
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['widget-anim', 'test']
});
