YUI.add('widget-buttons-test', function (Y) {

var Assert      = Y.Assert,
    ArrayAssert = Y.ArrayAssert,

    TestWidget, suite;

// -- Suite --------------------------------------------------------------------
TestWidget = Y.Base.create('TestWidget', Y.Widget, [Y.WidgetStdMod, Y.WidgetButtons]);
suite      = new Y.Test.Suite('Widget Buttons');

// -- Lifecycle ----------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Lifecycle',

    tearDown: function () {
        this.widget && this.widget.destroy();
        Y.one('#test').empty();
    },

    'destory() should unbind the button handlers': function () {
        var widget = new TestWidget({render: '#test'});

        widget.destroy();
        ArrayAssert.isEmpty(widget._uiHandlesButtons);
    }
}));

// -- Attributes and Properties ------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Attributes and Properties',

    tearDown: function () {
        this.widget && this.widget.destroy();
        Y.one('#test').empty();
    },

    '`buttons` should contain a close button by default': function () {
        this.widget = new TestWidget({render: '#test'});

        Assert.areSame('close', this.widget.get('buttons')[0].type);
    },

    'custom `buttons` should be added on initialization': function () {
        this.widget = new TestWidget({
            buttons: [
                {
                    value  : 'Foo'
                }
            ]
        });

        Assert.areSame('Foo', this.widget.get('buttons')[0].value);
    },

    'custom `buttons` should override defaults': function () {
        var clicked = 0,
            widget1 = new TestWidget({buttons: []}),
            widget2 = new TestWidget({
                render : '#test',
                buttons: [
                    {
                        type  : 'close',
                        value : 'Foo',
                        action: function () {
                            clicked += 1;
                        }
                    }
                ]
            });

        ArrayAssert.isEmpty(widget1.get('buttons'));

        Assert.areSame('close', widget2.get('buttons')[0].type);
        widget2.get('boundingBox').one('.yui3-button').simulate('click');
        Assert.areSame(1, clicked);

        widget1.destroy();
        widget2.destroy();
    }
}));

// -- Methods ------------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Methods',

    tearDown: function () {
        this.widget && this.widget.destroy();
        Y.one('#test').empty();
    },

    'addButton() should add and render a new button': function () {
        var called = 0,
            newButton;

        this.widget = new TestWidget({render: '#test'});

        Assert.areSame(1, this.widget.get('buttons').length);
        Assert.areSame(1, this.widget.getStdModNode('header').all('.yui3-button').size());

        this.widget.addButton({
            value  : 'Foo',
            section: 'header',
            action : function () {
                called += 1;
            }
        });

        Assert.areSame(2, this.widget.get('buttons').length);
        Assert.areSame(2, this.widget.getStdModNode('header').all('.yui3-button').size());

        newButton = this.widget.getStdModNode('header').all('.yui3-button').item(1);
        newButton.simulate('click');
        Assert.areSame('Foo', newButton.get('text'));
        Assert.areSame(1, called);

        this.widget.addButton({
            value  : 'Bar',
            section: 'footer',
            action : function () {
                called += 1;
            }
        });

        Assert.areSame(3, this.widget.get('buttons').length);
        Assert.areSame(1, this.widget.getStdModNode('footer').all('.yui3-button').size());

        newButton = this.widget.getStdModNode('footer').one('.yui3-button');
        newButton.simulate('click');
        Assert.areSame('Bar', newButton.get('text'));
        Assert.areSame(2, called);
    }
}));

// -- Rendering ----------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Rendering',

    tearDown: function () {
        this.widget && this.widget.destroy();
        Y.one('#test').empty();
    },

    'default close button should be rendered in the .yui3-widget-hd': function () {
        this.widget = new TestWidget({render: '#test'});

        Assert.isNotNull(this.widget.getStdModNode('header').one('.yui3-button'));
    },

    'custom `buttons` should render their `value` as text': function () {
        var button;

        this.widget = new TestWidget({
            render : '#test',
            buttons: [
                {
                    value  : 'Foo',
                    section: 'header'
                }
            ]
        });

        button = this.widget.get('boundingBox').one('.yui3-button');

        Assert.areSame('Foo', button.get('text'));
    },

    '`buttons` should render in the correction section': function () {
        var headerButton, footerButton;

        this.widget = new TestWidget({
            render : '#test',
            buttons: [
                {
                    value  : 'Foo',
                    section: 'header'
                },
                {
                    value  : 'Bar',
                    section: 'footer'
                }
            ]
        });

        headerButton = this.widget.getStdModNode('header').one('.yui3-button');
        footerBotton = this.widget.getStdModNode('footer').one('.yui3-button');

        Assert.areSame('Foo', headerButton.get('text'));
        Assert.areSame('Bar', footerBotton.get('text'));
    }
}));

// -- Rendering ----------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Rendering',

    tearDown: function () {
        this.widget && this.widget.destroy();
        Y.one('#test').empty();
    },

    '`buttonsChange` should fire when calling addButton()': function () {
        var called = 0;

        this.widget = new TestWidget({render: '#test'});
        this.widget.after('buttonsChange', function (e) {
            called += 1;
        });

        this.widget.addButton({
            value  : 'Foo',
            section: 'header'
        });

        Assert.areSame(2, this.widget.get('buttons').length);
        Assert.areSame(1, called);
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['widget-buttons', 'test', 'node-event-simulate']
});
