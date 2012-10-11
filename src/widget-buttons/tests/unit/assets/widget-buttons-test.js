YUI.add('widget-buttons-test', function (Y) {

var Assert       = Y.Assert,
    ArrayAssert  = Y.ArrayAssert,
    ObjectAssert = Y.ObjectAssert,

    yeti = window && window.$yetify,

    TestWidget, suite;

// -- Suite --------------------------------------------------------------------
TestWidget = Y.Base.create('testWidget', Y.Widget, [Y.WidgetStdMod, Y.WidgetButtons]);
suite      = new Y.Test.Suite('Widget: Buttons');

// -- Lifecycle ----------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Lifecycle',

    _should: {
        error: {
            'Initialization should fail if `WidgetStdMod` has not been added': true,
            'Initialization should fail if `WidgetStdMod` has been added after `WidgetButtons`': true
        },

        ignore: {
            '`buttons` should be parsed from a `srcNode` and use the `name` attribute of the node': !!Y.UA.winjs
        }
    },

    tearDown: function () {
        if (this.widget) {
            this.widget.destroy();
        }

        Y.one('#test').empty();
    },

    'Initialization should fail if `WidgetStdMod` has not been added': function () {
        var FailWidget = Y.Base.create('failWidget', Y.Widget, [Y.WidgetButtons]);
        this.widget = new FailWidget();
    },

    'Initialization should fail if `WidgetStdMod` has been added after `WidgetButtons`': function () {
        var FailWidget = Y.Base.create('failWidget', Y.Widget, [Y.WidgetButtons, Y.WidgetStdMod]);
        this.widget = new FailWidget();
    },

    '`buttons` should default to an empty Object': function () {
        this.widget = new TestWidget();

        Assert.isObject(this.widget.get('buttons'), '`buttons` is not an Object.');
        ObjectAssert.ownsNoKeys(this.widget.get('buttons'), '`buttons` was not an empty Object.');
    },

    '`buttons` should be accessible within a subclass initializer': function () {
        var called = 0,
            SubclassWidget;

        SubclassWidget = Y.Base.create('subclassWidget', Y.Widget, [Y.WidgetStdMod, Y.WidgetButtons], {
            initializer: function () {
                var headerButtons = this.get('buttons.header');

                ArrayAssert.isNotEmpty(headerButtons, '`headerButtons` was empty.');
                Assert.isInstanceOf(Y.Node, headerButtons[0], 'Button was not an `instanceOf` `Y.Node`.');

                called += 1;
            }
        });

        this.widget = new SubclassWidget({
            buttons: [
                {
                    label  : 'Foo',
                    section: 'header'
                }
            ]
        });

        Assert.areSame(1, called);
    },

    '`buttons` should be parsed from a `srcNode`': function () {
        var markup = '' +
            '<div>' +
                '<div class="yui3-widget-hd">' +
                    '<span class="yui3-widget-buttons">' +
                        '<button class="yui3-button" data-name="foo">Foo</button>' +
                        '<a class="yui3-button" href="#" data-name="a">Anchor</a>' +
                        '<input class="yui3-button" type="button" data-name="input">Input</a>' +
                    '</span>' +
                '</div>' +
            '</div>';

        Y.one('#test').append(markup);

        var fooButton   = Y.one('#test button[data-name=foo]'),
            aButton     = Y.one('#test a[data-name=a]'),
            inputButton = Y.one('#test input[data-name=input]');

        this.widget = new TestWidget({
            srcNode: '#test div'
        });

        Assert.areSame(fooButton, this.widget.getButton('foo'), '"foo" button in markup was not used.');
        Assert.areSame(aButton, this.widget.getButton('a'), '"a" button in markup was not used.');
        Assert.areSame(inputButton, this.widget.getButton('input'), '"input" button in markup was not used.');
    },

    // Excluded from WinJS because that runtime doesn't like the use of `name`
    // attributes on DOM nodes :-/
    '`buttons` should be parsed from a `srcNode` and use the `name` attribute of the node': function () {
        var markup = '' +
            '<div>' +
                '<div class="yui3-widget-hd">' +
                    '<span class="yui3-widget-buttons">' +
                        '<button class="yui3-button" name="foo">Foo</button>' +
                    '</span>' +
                '</div>' +
            '</div>';

        Y.one('#test').append(markup);

        var fooButton = Y.one('#test button[name=foo]');

        this.widget = new TestWidget({
            srcNode: '#test div'
        });

        Assert.areSame(fooButton, this.widget.getButton('foo'), 'Button in markup was not used.');
    },

    '`buttons` parsed from a `srcNode` should inherit any defaults': function () {
        var PanelWidget = Y.Base.create('panelWidget', Y.Widget, [Y.WidgetStdMod, Y.WidgetButtons], {
            BUTTONS: {
                foo: {
                    label : 'Bar',
                    action: 'onFoo'
                }
            }
        });

        var markup = '' +
            '<div>' +
                '<div class="yui3-widget-hd">' +
                    '<span class="yui3-widget-buttons">' +
                        '<button class="yui3-button" data-name="foo">Foo</button>' +
                    '</span>' +
                '</div>' +
            '</div>';

        Y.one('#test').append(markup);

        var fooButton = Y.one('#test button[data-name=foo]'),
            called    = 0;

        this.widget = new PanelWidget({
            srcNode: '#test div'
        });

        this.widget.onFoo = function (e) {
            called += 1;
        };

        Assert.areSame(fooButton, this.widget.getButton('foo'), 'Button in markup was not used.');
        Assert.areSame('Foo', fooButton.get('text'), 'Foo button had its text changed.');

        fooButton.simulate('click');

        Assert.areSame(1, called, 'onFoo default action was not called.');
    },

    '`buttons` parsed from a `srcNode` should be overridden by user-provided `buttons`': function () {
        var markup = '' +
            '<div>' +
                '<div class="yui3-widget-hd">' +
                    '<span class="yui3-widget-buttons">' +
                        '<button class="yui3-button" data-name="foo">Foo</button>' +
                    '</span>' +
                '</div>' +
            '</div>';

        Y.one('#test').append(markup);

        var fooButton = Y.one('#test button[data-name=foo]');

        this.widget = new TestWidget({
            srcNode: '#test div',
            render : true,
            buttons: [
                {name: 'bar', section: 'header'}
            ]
        });

        Assert.isFalse(Y.one('#test').contains(fooButton), 'Foo button was not removed.');
        Assert.areSame(Y.one('#test button'), this.widget.getButton('bar'), 'Bar button is rendered.');
        Assert.areSame(1, this.widget.get('buttons.header').length, 'Header contained more than 1 button.');
    },

    '`defaultButton` should default to `null`': function () {
        this.widget = new TestWidget();

        Assert.isNull(this.widget.get('defaultButton'), '`defaultButton` is not `null`.');
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
        if (this.widget) {
            this.widget.destroy();
        }

        Y.one('#test').empty();
    },

    '`buttons` should be able to be specified as an Array of Objects': function () {
        this.widget = new TestWidget({
            buttons: [
                {label: 'foo', section: 'header'},
                {label: 'bar', section: 'footer'}
            ]
        });

        ArrayAssert.isNotEmpty(this.widget.get('buttons.header'), '`buttons.header` was empty.');
        ArrayAssert.isNotEmpty(this.widget.get('buttons.footer'), '`buttons.footer` was empty.');
    },

    '`buttons` should be able to be specified as an Object of Arrays of Objects': function () {
        this.widget = new TestWidget({
            buttons: {
                header: [{label: 'foo'}],
                footer: [{label: 'bar'}]
            }
        });

        ArrayAssert.isNotEmpty(this.widget.get('buttons.header'), '`buttons.header` was empty.');
        ArrayAssert.isNotEmpty(this.widget.get('buttons.footer'), '`buttons.footer` was empty.');
    },

    '`buttons` specified as an Object of section-Arrays should override a button specific section': function () {
        this.widget = new TestWidget({
            buttons: {
                header: [
                    {label: 'foo'},
                    {label: 'bar', section: 'footer'}
                ]
            }
        });

        Assert.areSame(2, this.widget.get('buttons.header').length, '`buttons.header` did not have 2 buttons.');
        Assert.isUndefined(this.widget.get('buttons.footer'), '`buttons.footer` was not `undefined`.');
    },

    '`buttons` specified without a section should default to the footer': function () {
        this.widget = new TestWidget({
            buttons: [
                {label: 'foo'},
                {label: 'bar'}
            ]
        });

        Assert.areSame(2, this.widget.get('buttons.footer').length, '`buttons.footer` did not have 2 buttons.');
    },

    '`buttons` should be able to be specified as an Array of Y.Nodes': function () {
        this.widget = new TestWidget({
            buttons: [
                Y.Node.create('<button>foo</button>'),
                Y.Node.create('<button>bar</button>')
            ]
        });

        var buttons = this.widget.get('buttons.footer');

        Assert.areSame(2, buttons.length, '`buttons.footer` did not have 2 buttons.');
        Assert.areSame('foo', buttons[0].get('text'), 'First button did not have the test "foo".');
        Assert.areSame('bar', buttons[1].get('text'), 'Second button did not have the test "bar".');
    },

    '`buttons` should be able to be specified as an Object of Arrays of Y.Nodes': function () {
        this.widget = new TestWidget({
            buttons: {
                header: [Y.Node.create('<button>foo</button>')],
                footer: [Y.Node.create('<button>bar</button>')]
            }
        });

        ArrayAssert.isNotEmpty(this.widget.get('buttons.header'), '`buttons.header` was empty.');
        ArrayAssert.isNotEmpty(this.widget.get('buttons.footer'), '`buttons.footer` was empty.');
    },

    '`buttons` should be able to be specified as an Array of Y.Nodes from another YUI instance': function () {
        var buttons,
            footerButtons,
            test = this,

            resumeTest = function() {
                test.widget = new TestWidget({
                    buttons: buttons
                });

                footerButtons = test.widget.get('buttons.footer');

                Assert.areSame(2, footerButtons.length, '`buttons.footer` did not have 2 buttons.');
                Assert.areSame('foo', footerButtons[0].get('text'), 'First button did not have the test "foo".');
                Assert.areSame('bar', footerButtons[1].get('text'), 'Second button did not have the test "bar".');

                Assert.areNotSame(buttons[0], footerButtons[0]);
                Assert.isTrue(!!footerButtons[0].hasPlugin('button'), 'Node does not have button plugin.');
                Assert.isFalse(!!buttons[0].hasPlugin('button'), 'Node from other sandbox has the button plugin.');
            };

        // use(*) was causing intermittent problems in FF 11 here.

        YUI().use('node', function (Y1) {
            buttons = [
                Y1.Node.create('<button>foo</button>'),
                Y1.Node.create('<button>bar</button>')
            ];

            resumeTest();
        });
    },

    '`buttons` should be able to be specified as a mixture of all possibile configurations': function () {
        var PanelWidget = Y.Base.create('panelWidget', Y.Widget, [Y.WidgetStdMod, Y.WidgetButtons], {
            BUTTONS: {
                foo: {
                    label  : 'Foo',
                    section: Y.WidgetStdMod.HEADER
                }
            }
        });

        this.widget = new PanelWidget({
            buttons: [
                {name: 'foo'},
                {name: 'bar', section: 'body', label: 'Bar'},
                Y.Node.create('<button data-name="baz">Baz</button>')
            ]
        });

        var foo     = this.widget.getButton('foo'),
            bar     = this.widget.getButton('bar'),
            baz     = this.widget.getButton('baz'),
            buttons = this.widget.get('buttons');

        Assert.areSame(foo, buttons.header[0], '`foo` was not the first header button.');
        Assert.areSame(bar, buttons.body[0], '`bar` was not the first body button.');
        Assert.areSame(baz, buttons.footer[0], '`baz` was no the first footer button.');
    },

    '`buttons` should gracefully handle an object with non-array properties': function () {
        this.widget = new TestWidget({
            buttons: {
                header: [{label: 'Foo'}],
                footer: {label: 'Bar'}
            },

            render: '#test'
        });

        Assert.areSame(1, this.widget.get('buttons.header').length, 'Did not have 1 header button.');
        Assert.isUndefined(this.widget.get('buttons.footer'), 'Footer buttons was not `undefined`.');
        Assert.areSame(1, Y.all('#test button').size(), 'Widget should only have 1 button.');
    },

    '`buttons` should be settable to a new value': function () {
        this.widget = new TestWidget({
            buttons: [{name: 'foo', label: 'Foo'}],
            render : '#test'
        });

        Assert.areSame(1, this.widget.get('buttons.footer').length, 'Did not have 1 footer button.');
        Assert.areSame(1, Y.all('#test button').size(), 'More than one button in the Widget.');

        this.widget.set('buttons', [{name: 'foo', label: 'Bar'}]);

        Assert.areSame(1, this.widget.get('buttons.footer').length, 'Did not have 1 footer button.');
        Assert.areSame(1, Y.all('#test button').size(), 'More than one button in the Widget.');
        Assert.areSame('Bar', this.widget.getButton('foo').get('text'), '`foo` button did not have the label "Bar".');
    },

    '`buttons` should be settable to the same value': function () {
        this.widget = new TestWidget({
            buttons: [{name: 'foo', label: 'Foo'}],
            render : '#test'
        });

        Assert.areSame(1, this.widget.get('buttons.footer').length, 'Did not have 1 footer button.');
        Assert.areSame(1, Y.all('#test button').size(), 'More than one button in the Widget.');

        this.widget.set('buttons', this.widget.get('buttons'));

        Assert.areSame(1, this.widget.get('buttons.footer').length, 'Did not have 1 footer button.');
        Assert.areSame(1, Y.all('#test button').size(), 'More than one button in the Widget.');
        Assert.areSame('Foo', this.widget.getButton('foo').get('text'), 'Foo button was not rendered.');
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
    },

    'User-provided `buttons` should override defaults': function () {
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

    'A button configured with a `name` should be accessible by that `name`': function () {
        this.widget = new TestWidget({
            buttons: [{name: 'foo'}]
        });

        Assert.isNotUndefined(this.widget.getButton('foo'), '`foo` button was undefined.');
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

    'A button with an `action` String should be called': function () {
        var called = 0;

        this.widget = new TestWidget({
            buttons: [{name: 'foo', action: 'doSomething'}]
        });

        this.widget.doSomething = function (e) {
            called += 1;
        };

        this.widget.getButton('foo').simulate('click');

        Assert.areSame(1, called, '`action` was not called.');
    },

    'A button configured with a `isDefault` should be the `defaultButton`': function () {
        this.widget = new TestWidget({
            buttons: [{name: 'foo', isDefault: true}]
        });

        Assert.areSame(this.widget.getButton('foo'), this.widget.get('defaultButton'), '`foo` is not the `defaultButton`.');
    },

    'Last button in should win when multiple `buttons` are `isDefault`': function () {
        this.widget = new TestWidget({
            buttons: [
                {name: 'foo', isDefault: true},
                {name: 'bar', isDefault: true}
            ]
        });

        Assert.areSame(2, this.widget.get('buttons.footer').length, 'Widget did not have 2 footer buttons.');
        Assert.areSame(this.widget.getButton('bar'), this.widget.get('defaultButton'), '`bar` is not the `defaultButton`.');
    },

    '`isDefault` should only be considered when it is `true` or "true" (any case)': function () {
        this.widget = new TestWidget({
            buttons: [
                {name: 'foo', isDefault: true},
                {name: 'bar', isDefault: 'true'},
                {name: 'bar', isDefault: 'True'},
                {name: 'zee', isDefault: 'TRUE'},

                // The follow should evaluate to _not_ being the default;
                {isDefault: false, label: 'false'},
                {isDefault: 'false', label: '"false"'},
                {isDefault: 0, label: '0'},
                {isDefault: '', label: '""'},
                {isDefault: 'yes', label: 'yes'}
            ]
        });

        Assert.areSame(9, this.widget.get('buttons.footer').length, 'Widget did not have 9 footer buttons.');
        Assert.areSame(this.widget.getButton('zee'), this.widget.get('defaultButton'), '`zee` is not the `defaultButton`.');
    },

    'A button should be created using the configured `template`': function () {
        this.widget = new TestWidget({
            buttons: [
                {name: 'a', template: '<a href="#">Anchor</a>'},
                {name: 'input', template: '<input type="button" value="Input" />'}
            ]
        });

        Assert.areSame(2, this.widget.get('buttons.footer').length, 'Widget did not have 2 footer buttons.');
        Assert.areSame('A', this.widget.getButton('a').get('tagName'), 'Button is not an <a>');
        Assert.areSame('INPUT', this.widget.getButton('input').get('tagName'), 'Button is not an <input>');
    },

    '`defaultButton` should be read-only': function () {
        var called = 0;

        this.widget = new TestWidget({
            buttons: [
                {name: 'foo', isDefault: true},
                {name: 'bar'}
            ]
        });

        this.widget.after('defaultButtonChange', function (e) {
            called += 1;
        });

        Assert.areSame(this.widget.getButton('foo'), this.widget.get('defaultButton'), '`foo` is not the `defaultButton`.');

        this.widget.set('defaultButton', this.widget.getButton('bar'));

        Assert.areSame(this.widget.getButton('foo'), this.widget.get('defaultButton'), '`foo` is not the `defaultButton`.');
        Assert.areSame(0, called, '`defaultButtonChange` was called.');
    },

    '`defaultButton` should be updated when a new button that `isDefault` is added': function () {
        var called = 0;

        this.widget = new TestWidget({
            buttons: [
                {
                    name     : 'foo',
                    isDefault: true
                }
            ]
        });

        Assert.areSame(this.widget.getButton('foo'), this.widget.get('defaultButton'), '`foo` is not the `defaultButton`.');

        this.widget.after('defaultButtonChange', function (e) {
            called += 1;
        });

        this.widget.addButton({
            name     : 'bar',
            isDefault: true
        });

        Assert.areSame(this.widget.getButton('bar'), this.widget.get('defaultButton'), '`bar` is not the `defaultButton`.');
        Assert.areSame(1, called, '`defaultButtonChange` was not called.');
    },

    '`defaultButton` should be updated when a new button that `isDefault` is added and receive visual styling': function () {
        var called = 0;

        this.widget = new TestWidget({
            render: '#test',

            after: {
                defaultButtonChange: function (e) {
                    called += 1;
                }
            }
        });

        Assert.areSame(null, this.widget.get('defaultButton'), '`defaultButton` was not null.');

        this.widget.addButton({
            name     : 'foo',
            isDefault: true
        });

        Assert.areSame(this.widget.getButton('foo'), this.widget.get('defaultButton'), '`foo` is not the `defaultButton`.');
        Assert.isTrue(this.widget.get('defaultButton').hasClass(Y.WidgetButtons.CLASS_NAMES.primary), '`defaultButton` does not have primary CSS class.');
        Assert.areSame(1, called, '`defaultButtonChange` was not called.');
    },

    '`defaultButton` should be updated when a button that is the default is removed': function () {
        var called = 0;

        this.widget = new TestWidget({
            buttons: [
                {
                    name     : 'foo',
                    isDefault: true
                }
            ]
        });

        this.widget.after('defaultButtonChange', function (e) {
            called += 1;
        });

        Assert.areSame(this.widget.getButton('foo'), this.widget.get('defaultButton'), '`foo` is not the `defaultButton`.');

        this.widget.removeButton('foo');

        Assert.areSame(null, this.widget.get('defaultButton'), '`defaultButton` was not null.');
        Assert.areSame(1, called, '`defaultButtonChange` was not called.');
    }
}));

// -- Methods ------------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Methods',

    tearDown: function () {
        if (this.widget) {
            this.widget.destroy();
        }

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

    '`addButton()` should default the new button to the end of the footer': function () {
        this.widget = new TestWidget({
            buttons: {
                footer: [{label: 'Foo'}]
            }
        });

        Assert.areSame(1, this.widget.get('buttons.footer').length, 'Footer did not have only 1 button.');

        this.widget.addButton({label: 'Bar'});

        Assert.areSame(2, this.widget.get('buttons.footer').length, 'Footer did not have only 2 buttons.');
        Assert.areSame('Bar', this.widget.get('buttons.footer')[1].get('text'), 'Last footer button was not "Bar".');
    },

    '`addButton()` without an `index` should default the new button to the end of the section': function () {
        this.widget = new TestWidget({
            buttons: {
                header: [{label: 'Foo'}]
            }
        });

        Assert.areSame(1, this.widget.get('buttons.header').length, 'Header did not have only 1 button.');

        this.widget.addButton({label: 'Bar'}, 'header');

        Assert.areSame(2, this.widget.get('buttons.header').length, 'Header did not have only 2 buttons.');
        Assert.areSame('Bar', this.widget.get('buttons.header')[1].get('text'), 'Last header button was not "Bar".');
    },

    '`addButton()` with an `index` should insert the new button at the correct location': function () {
        this.widget = new TestWidget({
            buttons: {
                header: [{label: 'Foo'}]
            }
        });

        Assert.areSame(1, this.widget.get('buttons.header').length, 'Header did not have only 1 button.');

        this.widget.addButton({label: 'Bar'}, 'header', 0);

        Assert.areSame(2, this.widget.get('buttons.header').length, 'Header did not have only 2 buttons.');
        Assert.areSame('Bar', this.widget.get('buttons.header')[0].get('text'), 'Last header button was not "Bar".');
    },

    '`addButton()` with an `index` that is too large should insert the new button at the end of the section': function () {
        var called = 0;

        this.widget = new TestWidget({
            buttons: {
                header: [{label: 'Foo'}]
            }
        });

        this.widget.after('buttonsChange', function (e) {
            called += 1;
            Assert.areSame(1, e.index, '`index` was not 1.');
        });

        Assert.areSame(1, this.widget.get('buttons.header').length, 'Header did not have only 1 button.');

        this.widget.addButton({label: 'Bar'}, 'header', 5);

        Assert.areSame(called, 1, 'after `buttonsChange` handler was not called.');
        Assert.areSame(2, this.widget.get('buttons.header').length, 'Header did not have only 2 buttons.');
        Assert.areSame('Bar', this.widget.get('buttons.header')[1].get('text'), 'Last header button was not "Bar".');
    },

    '`addButton()` with a negative `index` should insert the new button that many items from the end of the section': function () {
        var called = 0;

        this.widget = new TestWidget({
            buttons: {
                header: [
                    {label: 'Foo'},
                    {label: 'Eric'}
                ]
            }
        });

        this.widget.after('buttonsChange', function (e) {
            called += 1;
            Assert.areSame(0, e.index, '`index` was not 0.');
        });

        Assert.areSame(2, this.widget.get('buttons.header').length, 'Header did not have only 2 buttons.');

        this.widget.addButton({label: 'Bar'}, 'header', -2);

        Assert.areSame(called, 1, 'after `buttonsChange` handler was not called.');
        Assert.areSame(3, this.widget.get('buttons.header').length, 'Header did not have only 3 buttons.');
        Assert.areSame('Bar', this.widget.get('buttons.header')[0].get('text'), 'First header button was not "Bar".');
    },

    '`addButton()` should accept a node as the button to add': function () {
        this.widget = new TestWidget();

        this.widget.addButton(Y.Node.create('<button data-name="foo">Foo</button>'));

        Assert.areSame(1, this.widget.get('buttons.footer').length, 'Footer did not have the added button.');
        Assert.areSame('Foo', this.widget.get('buttons.footer')[0].get('text'), 'Footer button was not "Foo".');
    },

    '`getButton() should return `undefined` when no arguments are passed': function () {
        this.widget = new TestWidget({});

        Assert.isUndefined(this.widget.getButton(), '`undefined` was not returned.');
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
        Assert.areSame(button, this.widget.getButton('foo'), '`foo` button was not retrievable by name.');
    },

    '`getButton()` should return a button by name for a section': function () {
        this.widget = new TestWidget({
            buttons: {
                header: [{name: 'foo', value: 'Foo1'}],
                footer: [{name: 'foo', value: 'Foo2'}]
            }
        });

        // Last `foo` wins.
        Assert.areSame('Foo2', this.widget.getButton('foo').get('label'), 'Foo2 was not the main `foo` button.');

        Assert.areSame('Foo2', this.widget.getButton('foo', 'footer').get('label'), 'Foo2 was not the `foo` footer button.');
        Assert.areSame('Foo1', this.widget.getButton('foo', 'header').get('label'), 'Foo1 was not the `foo` header button.');
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

        Assert.areSame(fooButton, this.widget.getButton(0, 'header'), '`fooButton` was not the first header button.');
        Assert.areSame(barButton, this.widget.getButton(0, 'footer'), '`barButton` was not the first footer button.');
        Assert.areSame(barButton, this.widget.getButton(0), '`getButton()` does not default to the footer section.');
    },

    '`removeButton()` should remove a button from the colleciton and the DOM': function () {
        this.widget = new TestWidget({
            buttons: [{name: 'foo', label: 'Foo'}],
            render : '#test'
        });

        ArrayAssert.isNotEmpty(this.widget.get('buttons.footer'), 'Footer buttons was empty.');
        Assert.areSame(1, this.widget.get('contentBox').all('.yui3-button').size(), 'Widget did not have 1 rendered button.');

        this.widget.removeButton('foo');

        Assert.isUndefined(this.widget.get('buttons.footer'), 'Footer buttons was not `undefined`.');
        Assert.areSame(0, this.widget.get('contentBox').all('.yui3-button').size(), 'Widget had a rendered button.');
    },

    '`removeButton()` should remove a button by name for a section': function () {
        this.widget = new TestWidget({
            buttons: {
                header: [
                    {name: 'foo', value: 'Foo1'}
                ],

                footer: [
                    {name: 'foo', value: 'Foo2'},
                    {name: 'foo', value: 'Foo3'}
                ]
            }
        });

        this.widget.removeButton('foo', 'header');
        Assert.isUndefined(this.widget.get('buttons.header'), 'Header buttons were not empty.');

        // Dup call on purpose.
        this.widget.removeButton('foo', 'header');
        Assert.isUndefined(this.widget.get('buttons.header'), 'Header buttons were not empty.');

        this.widget.removeButton('foo');
        Assert.areSame(1, this.widget.get('buttons.footer').length, 'Footer does not have 1 button.');
    },

    '`removeButton()` should remove a button by `index` and default to the footer section': function () {
        this.widget = new TestWidget({
            buttons: {
                footer: [
                    {name: 'foo', label: 'Foo'},
                    {name: 'foo', label: 'Bar'}
                ]
            }
        });

        Assert.areSame(2, this.widget.get('buttons.footer').length, 'Footer did not have only 2 button.');

        this.widget.removeButton(0);

        Assert.areSame(1, this.widget.get('buttons.footer').length, 'Footer did not have only 1 buttons.');
        Assert.areSame('Bar', this.widget.get('buttons.footer')[0].get('text'), 'The only footer button was not "Bar".');
    },

    '`removeButton()` should remove a button by `index` and `section`': function () {
        this.widget = new TestWidget({
            buttons: {
                header: [
                    {label: 'Foo'},
                    {label: 'Bar'}
                ]
            }
        });

        Assert.areSame(2, this.widget.get('buttons.header').length, 'Header did not have only 2 button.');

        this.widget.removeButton(0, 'header');

        Assert.areSame(1, this.widget.get('buttons.header').length, 'Header did not have only 1 buttons.');
        Assert.areSame('Bar', this.widget.get('buttons.header')[0].get('text'), 'The only header button was not "Bar".');
    },

    '`removeButton() should always return `this`': function () {
        this.widget = new TestWidget({
            buttons: {
                header: [
                    {label: 'Foo'},
                    {label: 'Bar'}
                ]
            }
        });

        Assert.areSame(2, this.widget.get('buttons.header').length, 'Header did not have only 2 button.');

        Assert.areSame(this.widget, this.widget.removeButton(0, 'header'), '`this` was not returned.');

        Assert.areSame(1, this.widget.get('buttons.header').length, 'Header did not have only 1 buttons.');
        Assert.areSame('Bar', this.widget.get('buttons.header')[0].get('text'), 'The only header button was not "Bar".');

        Assert.areSame(this.widget, this.widget.removeButton(), '`this` was not returned when called with no args.');
    }
}));

// -- Rendering ----------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Rendering',

    _should: {
        ignore: {
            'Default button should be focused on `visibleChange`': yeti
        }
    },

    tearDown: function () {
        if (this.widget) {
            this.widget.destroy();
        }

        Y.one('#test').empty();
    },

    '`buttons` should render their `value` as text': function () {
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

    '`buttons` should render their `label` as text': function () {
        var button;

        this.widget = new TestWidget({
            render : '#test',
            buttons: [
                {
                    label  : 'Foo',
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
        footerButton = this.widget.getStdModNode('footer').one('.yui3-button');

        Assert.areSame('Foo', headerButton.get('text'), '`headerButton` text is not "Foo".');
        Assert.areSame('Bar', footerButton.get('text'), '`footerButton` text is not "Bar".');
    },

    '`buttons` should move to the correct position': function () {
        var markup = '' +
            '<div>' +
                '<div class="yui3-widget-hd">' +
                    '<span class="yui3-widget-buttons">' +
                        '<button class="yui3-button" data-name="foo">Foo</button>' +
                        '<button class="yui3-button" data-name="bar">Bar</button>' +
                    '</span>' +
                '</div>' +
            '</div>';

        Y.one('#test').append(markup);

        var headerButtons = Y.one('#test .yui3-widget-hd .yui3-widget-buttons'),
            fooButton     = Y.one('#test button[data-name=foo]'),
            barButton     = Y.one('#test button[data-name=bar]');

        Assert.areSame(fooButton, headerButtons.get('firstChild'), '`foo` button is not the first header button.');

        this.widget = new TestWidget({
            srcNode: '#test div',
            render : true,
            buttons: {
                header: [
                    barButton,
                    {name: 'baz', label: 'Baz'},
                    fooButton
                ]
            }
        });

        Assert.isTrue(Y.one('#test').contains(fooButton), 'Foo button was removed.');
        Assert.isTrue(Y.one('#test').contains(barButton), 'Bar button was removed.');
        Assert.areNotSame(fooButton, headerButtons.get('firstChild'), '`foo` button is the first header button.');
        Assert.areSame(barButton, headerButtons.get('firstChild'), '`bar` button is the first header button.');
    },

    'Default button should be focused on `visibleChange`': function () {
        var visibleCalled = 0,
            focusCalled   = 0;

        this.widget = new TestWidget({
            visible: false,
            render : '#test',
            buttons: [
                {
                    name     : 'foo',
                    label    : 'Foo',
                    isDefault: true
                }
            ]
        });

        this.widget.after('visibleChange', function (e) {
            visibleCalled += 1;
        });

        this.widget.getButton('foo').on('focus', function (e) {
            focusCalled += 1;
        });

        this.widget.set('visible', true);

        Assert.areSame(1, visibleCalled, '`visibleChange` was not called only 1 time.');
        Assert.areSame(1, focusCalled, '`focus` was not called only 1 time.');
    },

    'Updating section content should not remove a button': function () {
        this.widget = new TestWidget({
            render : '#test',
            buttons: [{label: 'Foo'}]
        });

        Assert.areSame(1, this.widget.get('contentBox').all('.yui3-widget-ft .yui3-button').size(), 'Footer does not contain 1 button.');

        this.widget.set('footerContent', '<p>Bar</p>');

        Assert.areSame('Bar', this.widget.get('contentBox').one('.yui3-widget-ft p').get('text'), 'New footer content was not added.');
        Assert.areSame(1, this.widget.get('contentBox').all('.yui3-widget-ft .yui3-button').size(), 'Footer does not contain 1 button.');
        Assert.areSame('Foo', this.widget.getButton(0).get('label'), 'Button did not have the label "Foo".');
    }
}));

// -- Events -------------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Events',

    tearDown: function () {
        if (this.widget) {
            this.widget.destroy();
        }

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
        Assert.isNull(this.widget.get('contentBox').one('.yui3-widget-ft .yui3-button'), 'Footer button was not removed.');

        Assert.areSame(1, this.widget.get('buttons.header').length, 'Widget header did not have a button.');
    },

    '`buttonsChange` should fire when calling `addButton()`': function () {
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

            Assert.areSame('add', e.src, '`buttonsChange src was not "add".');
            Assert.isNotUndefined(e.button, '`buttonsChange` button was not defined.');
            Assert.isNotUndefined(e.section, '`buttonsChange` section was not defined.');
            Assert.isNotUndefined(e.index, '`buttonsChange` index was not defined.');
        });

        button = this.widget.getStdModNode('footer').one('.yui3-button');

        this.widget.addButton({
            value  : 'Bar',
            section: 'header'
        });

        Assert.areSame(1, called, '`buttonsChange` did not fire.');
        Assert.areSame(button, this.widget.getStdModNode('footer').one('.yui3-button'), 'Footer button was re-created.');
        Assert.areSame(1, this.widget.get('buttons.header').length, 'Widget header did not have a button.');
    },

    '`buttonsChange` should fire when calling `removeButton()`': function () {
        var called = 0,
            button;

        this.widget = new TestWidget({
            buttons: {
                footer: [{name: 'foo', value: 'Foo'}]
            },

            footerContent: '<p>bla</p>',
            render       : '#test'
        });

        this.widget.after('buttonsChange', function (e) {
            called += 1;

            Assert.areSame('remove', e.src, '`buttonsChange src was not "remove".');
            Assert.isNotUndefined(e.button, '`buttonsChange` button was not defined.');
            Assert.isNotUndefined(e.section, '`buttonsChange` section was not defined.');
            Assert.isNotUndefined(e.index, '`buttonsChange` index was not defined.');
        });

        button = this.widget.getStdModNode('footer').one('.yui3-button');

        this.widget.removeButton(this.widget.getButton('foo'));

        Assert.areSame(1, called, '`buttonsChange` did not fire.');
        Assert.isUndefined(this.widget.get('buttons.header'), 'Button was not removed from `buttons`.');
        Assert.isFalse(this.widget.get('contentBox').contains(button), 'Footer button was not removed.');
    },

    '`buttonsChange` should be preventable': function () {
        var onCalled    = 0,
            afterCalled = 0,
            buttons;

        this.widget = new TestWidget({
            render : '#test',
            buttons: [{label: 'Foo'}],

            on: {
                buttonsChange: function (e) {
                    onCalled += 1;
                    e.preventDefault();
                }
            },

            after: {
                buttonsChange: function (e) {
                    afterCalled += 1;
                }
            }
        });

        buttons = this.widget.get('buttons');

        ArrayAssert.isNotEmpty(buttons.footer, 'Footer buttons was empty.');
        Assert.areSame('Foo', this.widget.get('contentBox').one('.yui3-button').get('text'), 'Foo button was not rendered.');

        this.widget.set('buttons', []);

        ArrayAssert.isNotEmpty(this.widget.get('buttons.footer'), 'Footer buttons was empty.');
        Assert.areSame(buttons.footer[0], this.widget.get('buttons.footer')[0], '`buttons` changed.');
        Assert.areSame('Foo', this.widget.get('contentBox').one('.yui3-button').get('text'), 'Foo button was removed.');

        Assert.areSame(1, onCalled);
        Assert.areSame(0, afterCalled);
    },

    'Preventing `buttonsChange` should cause `addButton()` to not have side-effects': function () {
        var onCalled    = 0,
            afterCalled = 0,
            buttons;

        this.widget = new TestWidget({
            render : '#test',
            buttons: [{label: 'Foo'}],

            on: {
                buttonsChange: function (e) {
                    onCalled += 1;
                    e.preventDefault();
                }
            },

            after: {
                buttonsChange: function (e) {
                    afterCalled += 1;
                }
            }
        });

        buttons = this.widget.get('buttons');

        ArrayAssert.isNotEmpty(buttons.footer, 'Footer buttons was empty.');
        Assert.areSame('Foo', this.widget.get('contentBox').one('.yui3-button').get('text'), 'Foo button was not rendered.');

        this.widget.addButton({label: 'Bar'}, 'footer', 0);

        Assert.areSame(1, this.widget.get('buttons.footer').length, 'Footer buttons does not only have 1 button.');
        Assert.areSame(buttons.footer[0], this.widget.get('buttons.footer')[0], '`buttons` changed.');
        Assert.areSame('Foo', this.widget.get('contentBox').one('.yui3-button').get('text'), 'Foo button was removed.');

        Assert.areSame(1, onCalled);
        Assert.areSame(0, afterCalled);
    },

    'Preventing `buttonsChange` should cause `removeButton()` to not have side-effects': function () {
        var onCalled    = 0,
            afterCalled = 0,
            buttons;

        this.widget = new TestWidget({
            render : '#test',
            buttons: [
                {label: 'Foo'},
                {label: 'Bar'}
            ],

            on: {
                buttonsChange: function (e) {
                    onCalled += 1;
                    e.preventDefault();
                }
            },

            after: {
                buttonsChange: function (e) {
                    afterCalled += 1;
                }
            }
        });

        buttons = this.widget.get('buttons');

        ArrayAssert.isNotEmpty(buttons.footer, 'Footer buttons was empty.');
        Assert.areSame('Foo', this.widget.get('contentBox').one('.yui3-button').get('text'), 'Foo button was not rendered.');

        this.widget.removeButton(0);

        Assert.areSame(2, this.widget.get('buttons.footer').length, 'Footer buttons does not only have 2 buttons.');
        Assert.areSame(buttons.footer[0], this.widget.get('buttons.footer')[0], '`buttons` changed.');
        Assert.areSame('Foo', this.widget.get('contentBox').one('.yui3-button').get('text'), 'Foo button was removed.');

        Assert.areSame(1, onCalled);
        Assert.areSame(0, afterCalled);
    },

    '`contentUpdate` should fire when the buttons change in the DOM': function () {
        var called = 0;

        this.widget = new TestWidget({
            render : '#test',
            buttons: [{label: 'Foo'}]
        });

        this.widget.on('contentUpdate', function (e) {
            called += 1;
        });

        Assert.areSame(1, this.widget.get('contentBox').all('.yui3-button').size(), 'The widget did not have 1 button.');
        Assert.areSame('Foo', this.widget.get('contentBox').all('.yui3-button').item(0).get('label'), 'The button was not labeled: "Foo".');

        this.widget.set('buttons', [{label: 'Bar'}]);

        Assert.areSame(1, this.widget.get('contentBox').all('.yui3-button').size(), 'The widget did not have 1 button.');
        Assert.areSame('Bar', this.widget.get('contentBox').all('.yui3-button').item(0).get('label'), 'The button was not labeled: "Bar".');
        Assert.areSame(1, called, '`contentUpdate` was not fired.');
    },

    '`contentUpdate` should fire when a button is added': function () {
        var called = 0;

        this.widget = new TestWidget({
            render : '#test',
            buttons: [{label: 'Foo'}]
        });

        this.widget.on('contentUpdate', function (e) {
            called += 1;
        });

        Assert.areSame(1, this.widget.get('contentBox').all('.yui3-button').size(), 'The widget did not have 1 button.');

        this.widget.addButton({label: 'Bar'});

        Assert.areSame(2, this.widget.get('contentBox').all('.yui3-button').size(), 'The widget did not have 2 buttons.');
        Assert.areSame(1, called, '`contentUpdate` was not fired.');
    },

    '`contentUpdate` should fire when a button is removed': function () {
        var called = 0;

        this.widget = new TestWidget({
            render : '#test',
            buttons: [{label: 'Foo'}]
        });

        this.widget.on('contentUpdate', function (e) {
            called += 1;
        });

        Assert.areSame(1, this.widget.get('contentBox').all('.yui3-button').size(), 'The widget did not have 1 button.');

        this.widget.removeButton(0, 'footer');

        Assert.areSame(0, this.widget.get('contentBox').all('.yui3-button').size(), 'The widget has buttons.');
        Assert.areSame(1, called, '`contentUpdate` was not fired.');
    },

    '`contentUpdate` should not fire when the buttons in the DOM do not actually change': function () {
        var called = 0;

        this.widget = new TestWidget({
            render : '#test',
            buttons: [{label: 'Foo'}]
        });

        this.widget.on('contentUpdate', function (e) {
            called += 1;
        });

        Assert.areSame(1, this.widget.get('contentBox').all('.yui3-button').size(), 'The widget did not have 1 button.');

        this.widget.set('buttons', this.widget.get('buttons'));

        Assert.areSame(1, this.widget.get('contentBox').all('.yui3-button').size(), 'The widget did not have 1 button.');
        Assert.areSame(0, called, '`contentUpdate` was fired.');
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
     // We require node here, because we use() it again inside a test, and need that use to be synchronous which it will be if node is already on the page
     // Requiring it explicitly here, means that regardless of what the other modules require, the test will still be stable.
    requires: ['node', 'widget-buttons', 'test', 'node-event-simulate']
});
