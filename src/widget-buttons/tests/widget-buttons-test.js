YUI.add('widget-buttons-test', function (Y) {

var Assert       = Y.Assert,
    ArrayAssert  = Y.ArrayAssert,
    ObjectAssert = Y.ObjectAssert,

    TestWidget, suite;

// -- Suite --------------------------------------------------------------------
TestWidget = Y.Base.create('testWidget', Y.Widget, [Y.WidgetStdMod, Y.WidgetButtons]);
suite      = new Y.Test.Suite('Widget Buttons');

// -- Lifecycle ----------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Lifecycle',

    _should: {
        error: {
            '`WidgetButtons` should fail to initialize if `WidgetStdMod` has not been added': true
        }
    },

    tearDown: function () {
        this.widget && this.widget.destroy();
        Y.one('#test').empty();
    },

    '`WidgetButtons` should fail to initialize if `WidgetStdMod` has not been added': function () {
        var FailWidget = Y.Base.create('failWidget', Y.Widget, [Y.WidgetButtons]);
        this.widget = new FailWidget();
    },

    '`destory()` should remove all buttons': function () {
        var contentBox;

        this.widget = new TestWidget({
            buttons: [{label: 'foo'}]
        });

        contentBox = this.widget.get('contentBox');

        this.widget.render('#test');
        Assert.isFalse(contentBox.all('.yui3-button').isEmpty(), 'Widget did not have buttons.');

        this.widget.destroy();
        Assert.isTrue(contentBox.all('.yui3-button').isEmpty(), 'Widget still had buttons.');
    }
}));

// -- Attributes and Properties ------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Attributes and Properties',

    tearDown: function () {
        this.widget && this.widget.destroy();
        Y.one('#test').empty();
    },

    '`buttons` should be added on initialization': function () {
        this.widget = new TestWidget({
            buttons: [
                {value: 'Foo'}
            ]
        });

        Assert.areSame('Foo', this.widget.get('buttons.footer')[0].get('text'), 'Custom button was not added to `buttons`.');
    },

    '`buttons` should override defaults': function () {
        var PanelWidget = Y.Base.create('panelWidget', Y.Widget, [Y.WidgetStdMod, Y.WidgetButtons], {
            BUTTONS: {
                close: {
                    action: function () {
                        this.hide();
                    },

                    label  : 'Close',
                    section: Y.WidgetStdMod.HEADER
                }
            }
        });

        var clicked = 0,
            widget1 = new PanelWidget({buttons: []}),
            widget2 = new PanelWidget({
                render : '#test',
                buttons: [
                    {
                        type  : 'close',
                        action: function () {
                            clicked += 1;
                        }
                    }
                ]
            });

        ObjectAssert.ownsNoKeys(widget1.get('buttons'), '`widget1` has buttons.');
        Assert.areSame('Close', widget2.get('buttons.header')[0].get('text'), '`widget2` does not have a "close" button in header.');

        widget2.get('contentBox').one('.yui3-button').simulate('click');
        Assert.areSame(1, clicked);

        widget1.destroy();
        widget2.destroy();
    },

    'Last button in should win when multiple `buttons` have the same `name`': function () {
        var buttons;

        this.widget = new TestWidget({
            render : '#test',
            buttons: [
                {name: 'foo', label: 'Foo'},
                {name: 'foo', label: 'Bar'}
            ]
        });

        buttons = this.widget.get('contentBox').all('.yui3-button');
        Assert.areSame(2, buttons.size(), 'Widget did not have 2 buttons.');

        Assert.areSame(buttons.item(1), this.widget.getButton('foo'), 'First button is not `foo`.');
        Assert.areSame('Bar', this.widget.getButton('foo').get('text'), '`foo` button does not have text "Foo".');
    },

    'Default `BUTTONS` should be usable by only providing their string name': function () {
        var PanelWidget = Y.Base.create('panelWidget', Y.Widget, [Y.WidgetStdMod, Y.WidgetButtons], {
            BUTTONS: {
                close: {
                    action: function () {
                        this.hide();
                    },

                    label  : 'Close',
                    section: Y.WidgetStdMod.HEADER
                },

                foo: {
                    label  : 'Foo',
                    section: Y.WidgetStdMod.HEADER
                }
            }
        });

        this.widget = new PanelWidget({
            render : '#test',
            buttons: {
                header: ['close'],
                footer: ['foo']
            }
        });

        ArrayAssert.isNotEmpty(this.widget.get('buttons.header'), 'Header buttons array was empty.');
        Assert.isNotNull(this.widget.getStdModNode('header').one('.yui3-button'), 'No button rendered in header.');

        ArrayAssert.isNotEmpty(this.widget.get('buttons.footer'), 'Footer buttons array was empty.');
        Assert.isNotNull(this.widget.getStdModNode('footer').one('.yui3-button'), 'No button rendered in footerButton.');
    }
}));

// -- Methods ------------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Methods',

    tearDown: function () {
        this.widget && this.widget.destroy();
        Y.one('#test').empty();
    },

    '`addButton()` should add and render a new button': function () {
        var called = 0,
            newButton;

        this.widget = new TestWidget({render: '#test'});

        Assert.isUndefined(this.widget.get('buttons.header'), 'Widget has button config in header.');
        Assert.areSame(0, this.widget.get('contentBox').all('.yui3-button').size(), 'Widget has button in header.');

        this.widget.addButton({
            value  : 'Foo',
            section: 'header',
            action : function () {
                called += 1;
            }
        });

        Assert.areSame(1, this.widget.get('buttons.header').length, 'Widget does not have 1 button config in header.');
        Assert.areSame(1, this.widget.getStdModNode('header').all('.yui3-button').size(), 'Widget does not have 1 button in header.');

        newButton = this.widget.getStdModNode('header').one('.yui3-button');
        newButton.simulate('click');

        Assert.areSame('Foo', newButton.get('text'), '`newButton` text was not "Foo".');
        Assert.areSame(1, called, '`newButton` action was not called.');

        this.widget.addButton({
            value  : 'Bar',
            section: 'footer',
            action : function () {
                called += 1;
            }
        });

        Assert.areSame(1, this.widget.get('buttons').footer.length, 'Widget does not have 1 button config in header.');
        Assert.areSame(1, this.widget.getStdModNode('footer').all('.yui3-button').size(), 'Widget does not have 1 button in footer.');

        newButton = this.widget.getStdModNode('footer').one('.yui3-button');
        newButton.simulate('click');

        Assert.areSame('Bar', newButton.get('text'), '`newButton` text was not "Bar".');
        Assert.areSame(2, called, '`newButton` action was not called.');
    },

    '`getButton()` should return a button by name': function () {
        var button;

        this.widget = new TestWidget({
            render : '#test',
            buttons: [
                {name: 'foo'}
            ]
        });

        button = this.widget.get('contentBox').one('.yui3-button');
        Assert.isNotNull(button, '`button` is `null`.');
        Assert.areSame(button, this.widget.getButton('foo'));
    },

    '`getButton()` should return a button by index and section': function () {
        var fooButton, barButton;

        this.widget = new TestWidget({
            render : '#test',
            buttons: {
                header: [{name: 'foo'}],
                footer: [{name: 'bar'}]
            }
        });

        fooButton = this.widget.getStdModNode('header').one('.yui3-button');
        barButton = this.widget.getStdModNode('footer').one('.yui3-button');

        Assert.isNotNull(fooButton, 'Did not find `fooButton`.');
        Assert.isNotNull(barButton, 'Did not find `barButton`.');

        Assert.areSame(fooButton, this.widget.getButton(0, 'header'));
        Assert.areSame(barButton, this.widget.getButton(0, 'footer'));
        Assert.areSame(barButton, this.widget.getButton(0));
    }
}));

// -- Rendering ----------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Rendering',

    tearDown: function () {
        this.widget && this.widget.destroy();
        Y.one('#test').empty();
    },

    'Custom `buttons` should render their `value` as text': function () {
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

        button = this.widget.get('contentBox').one('.yui3-button');
        Assert.areSame('Foo', button.get('text'), '`button` text is not "Foo".');
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

        Assert.areSame('Foo', headerButton.get('text'), '`headerButton` text is not "Foo".');
        Assert.areSame('Bar', footerBotton.get('text'), '`footerButton` text is not "Bar".');
    }
}));

// -- Events -------------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Events',

    tearDown: function () {
        this.widget && this.widget.destroy();
        Y.one('#test').empty();
    },

    '`buttonsChange` should fire when setting new `buttons`': function () {
        var called = 0,
            buttons, button;

        this.widget = new TestWidget({
            render : '#test',
            buttons: {
                footer: [{value: 'Foo'}]
            }
        });

        this.widget.after('buttonsChange', function (e) {
            called += 1;
        });

        buttons = this.widget.get('buttons');
        button  = this.widget.getStdModNode('footer').one('.yui3-button');

        this.widget.set('buttons', [
            {
                value  : 'Bar',
                section: 'header'
            }
        ]);

        Assert.areSame(1, called, '`buttonsChange` did not fire.');

        Assert.areNotSame(buttons, this.widget.get('buttons'), '`buttons` was not re-created.');
        Assert.isNotNull(this.widget.getStdModNode('footer').one('.yui3-button'), 'Footer button was not removed.');

        Assert.areSame(1, this.widget.get('buttons.header').length, 'Widget header did not have a button.');
    },

    '`buttonsChange` should fire when calling addButton()': function () {
        var called = 0,
            button;

        this.widget = new TestWidget({
            render : '#test',
            buttons: {
                footer: [{value: 'Foo'}]
            }
        });

        this.widget.after('buttonsChange', function (e) {
            called += 1;
        });

        button = this.widget.getStdModNode('footer').one('.yui3-button');

        this.widget.addButton({
            value  : 'Bar',
            section: 'header'
        });

        Assert.areSame(1, called, '`buttonsChange` did not fire.');
        Assert.areSame(button, this.widget.getStdModNode('footer').one('.yui3-button'), 'Footer button was re-created.');
        Assert.areSame(1, this.widget.get('buttons.header').length, 'Widget header did not have a button.');
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['widget-buttons', 'test', 'node-event-simulate']
});
