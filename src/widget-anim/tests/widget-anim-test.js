YUI.add('widget-anim-test', function (Y) {

var Assert      = Y.Assert,
    ArrayAssert = Y.ArrayAssert,

    suite;

// -- Suite --------------------------------------------------------------------
suite = new Y.Test.Suite('Plugin.WidgetAnim');

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
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['widget-anim', 'test']
});
