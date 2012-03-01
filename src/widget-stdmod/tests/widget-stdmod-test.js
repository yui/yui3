YUI.add('widget-stdmod-test', function (Y) {

var Assert      = Y.Assert,
    ArrayAssert = Y.ArrayAssert,

    suite, TestWidget;

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

// -- Methods ------------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Methods',

    tearDown: function () {
        this.widget && this.widget.destroy();
        delete this.widget;
        Y.one('#test').empty();
    },

    'getStdModNode() should return the section node if there is content': function () {
        this.widget = new TestWidget({render: '#test'});

        Assert.isNull(this.widget.getStdModNode('header'), 'Header node was not null.');

        this.widget.set('headerContent', 'foo');

        Assert.isNotNull(this.widget.getStdModNode('header'), 'Header node was null.');
    },

    'getStdModNode() should create the section node when `forceCreate` is truthy': function () {
        this.widget = new TestWidget({render: '#test'});

        Assert.isNull(this.widget.getStdModNode('header'), 'Header node was not null.');
        Assert.isNotNull(this.widget.getStdModNode('header', true), 'Header node was null.');
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['widget-stdmod', 'test']
});
