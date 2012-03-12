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

    'WidgetStdMod should add `headerContent`, `bodyContent`, `footerContent`, and `fillHeight` attributes': function () {
        this.widget = new TestWidget({
            headerContent: 'foo',
            bodyContent  : 'bar',
            footerContent: 'baz',
            render       : '#test'
        });

        Assert.areSame('foo', this.widget.get('headerContent').item(0).get('text'), '`headerContent` is not "foo".');
        Assert.areSame('bar', this.widget.get('bodyContent').item(0).get('text'), '`bodyContent` is not "bar".');
        Assert.areSame('baz', this.widget.get('footerContent').item(0).get('text'), '`footerContent` is not "baz".');
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
    },

    'fillHeight() should fill the a widget height using the provided node': function () {
        var bb, header;

        this.widget = new TestWidget({
            headerContent: 'foo',
            height       : 200,
            render       : '#test'
        });

        bb     = this.widget.get('boundingBox');
        header = this.widget.getStdModNode('header');

        Assert.areSame('200px', bb.getStyle('height'), 'widget is not 200px in height.');
        Assert.areNotSame('200px', header.getStyle('height'), 'header is 200px in height.');

        this.widget.fillHeight(header);

        Assert.areSame('200px', bb.getStyle('height'), 'widget is not 200px in height.');
        Assert.areSame('200px', header.getStyle('height'), 'header is not 200px in height.');
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['widget-stdmod', 'test']
});
