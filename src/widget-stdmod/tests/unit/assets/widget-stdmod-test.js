YUI.add('widget-stdmod-test', function (Y) {

var Assert      = Y.Assert,
    ArrayAssert = Y.ArrayAssert,

    suite, TestWidget;

// -- Suite --------------------------------------------------------------------
suite      = new Y.Test.Suite('Widget: StdMod');
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

    'setStdModContent() should update the body section of the standard module': function () {
        this.widget = new TestWidget({
            headerContent: 'foo',
            render       : '#test'
        });

        this.widget.setStdModContent('header', 'bar');
        this.widget.setStdModContent('header', 'baz', 'before');
        this.widget.setStdModContent('header', 'qux', 'after');

        Assert.areSame('bar', this.widget.get('headerContent').item(1).get('text'), 'section content was not replaced');
        Assert.areSame('baz', this.widget.get('headerContent').item(0).get('text'), 'section content was not inserted before');
        Assert.areSame('qux', this.widget.get('headerContent').item(2).get('text'), 'section content was not inserted after');
    },

    'setStdModContent() should also accept Node objects as input': function () {
        this.widget = new TestWidget({
            headerContent: 'foo',
            render       : '#test'
        });

        this.widget.setStdModContent('header', Y.Node.create('<div class="yui3-widget-hd">bar</div>'));
        this.widget.setStdModContent('header', Y.Node.create('<div class="yui3-widget-hd">baz</div>'), 'before');
        this.widget.setStdModContent('header', Y.Node.create('<div class="yui3-widget-hd">qux</div>'), 'after');

        Assert.areSame('bar', this.widget.get('headerContent').item(1).get('text'), 'section content was not replaced');
        Assert.areSame('baz', this.widget.get('headerContent').item(0).get('text'), 'section content was not inserted before');
        Assert.areSame('qux', this.widget.get('headerContent').item(2).get('text'), 'section content was not inserted after');
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
    },

    'fillHeight() should fill up the widget correctly with multiple nodes': function () {
        var bb, header, body;
        
        this.widget = new TestWidget({
            headerContent: 'foo',
            bodyContent  : 'bar',
            height       : 200,
            render       : '#test'
        });

        bb     = this.widget.get('boundingBox');
        header = this.widget.getStdModNode('header');
        body   = this.widget.getStdModNode('body');

        header.setStyle('height', '50px');
        body.setStyle('height', '50px');

        Assert.areSame('200px', bb.getStyle('height'), 'widget is not 200px in height before fill.');
        Assert.areSame('50px', header.getStyle('height'), 'header is not 50px in height before fill.');
        Assert.areSame('50px', body.getStyle('height'), 'body is not 50px in height before fill.');

        this.widget.fillHeight(body);

        Assert.areSame('200px', bb.getStyle('height'), 'widget is not 200px in height after fill.');
        Assert.areSame('50px', header.getStyle('height'), 'header is not 50px in height after fill.');
        Assert.areSame('150px', body.getStyle('height'), 'body is not 150px in height after fill.');
    },

    'HTML_PARSER rules should return the proper inner HTML contents from markup': function () {
        var src, headerMarkup, footerMarkup, bodyMarkup;
        
        headerMarkup = Y.Node.create('<div class="yui3-widget-hd">foo</div>');
        bodyMarkup   = Y.Node.create('<div class="yui3-widget-bd">bar</div>');
        footerMarkup = Y.Node.create('<div class="yui3-widget-ft">baz</div>');

        src = Y.Node.one('#test');
        src.append(headerMarkup);
        src.append(bodyMarkup);
        src.append(footerMarkup);
        
        this.widget = new TestWidget({
            srcNode: '#test'  
        });
    
        Assert.areEqual('foo', this.widget.get('headerContent'), 'header not picked up from markup');
        Assert.areEqual('bar', this.widget.get('bodyContent'), 'body not picked up from markup');
        Assert.areEqual('baz', this.widget.get('footerContent'), 'footer not picked up from markup');
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['widget-stdmod', 'test']
});
