YUI.add('button-test', function (Y) {

var Assert      = Y.Assert,
    ArrayAssert = Y.ArrayAssert,
    suite;

// -- Suite --------------------------------------------------------------------
suite = new Y.Test.Suite('button');


// -- Widget ----------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Basic',

    setUp : function () {
        Y.one("#container").setContent('<button id="testButton" data-foo="foobar" class="test-class">Hello</button><button id="testToggleButton">Hello</button><button id="testCheckButton">Hello</button>');
        this.button = new Y.Button({
            srcNode: '#testButton'
        }).render();
        this.toggleButton = new Y.ToggleButton({
            srcNode: '#testToggleButton'
        }).render();
        this.checkButton = new Y.ToggleButton({
            srcNode: '#testCheckButton',
            type: 'checkbox'
        }).render();
    },
    
    tearDown: function () {
        this.button.destroy();
        this.toggleButton.destroy();
        this.checkButton.destroy();
        delete this.button;
        delete this.toggleButton;
        delete this.checkButton;
    },

    'Rendering should preserve Node attributes': function () {
        var button = this.button,
            node = button.getNode();

        Assert.areEqual('foobar', node.getData('foo'));
        Assert.isTrue(node.hasClass('test-class'));
    },

    'Rendering a button should add the `yui3-button` class': function () {
        var button = this.button,
            node = button.getNode();

        Assert.isTrue(node.hasClass('yui3-button'));
    },

    'Should render as a single-box widget': function () {
        var button = this.button,
            bb = button.get("boundingBox"),
            cb = button.get("contentBox");

        Assert.isTrue(bb.compareTo(cb));
    },

    'Changing the label atrribute should trigger labelChange and labelHTMLChange': function () {
        var button = this.button,
            labelEventsTriggered = 0,
            labelHTMLEventsTriggered = 0;
        
        button.on('labelChange', function(){
            labelEventsTriggered+=1;
        });

        button.on('labelHTMLChange', function(){
            labelHTMLEventsTriggered+=1;
        });
        
        Assert.areEqual(0, labelEventsTriggered);
        Assert.areEqual(0, labelHTMLEventsTriggered);
        
        button.set('label', 'foobar');
        Assert.areEqual(1, labelEventsTriggered);
        Assert.areEqual(1, labelHTMLEventsTriggered);
    },
    
    'ToggleButton should have `toggle` role': function () {
        var button = this.button,
            toggleButton = this.toggleButton,
            role = toggleButton.get('contentBox').get('role');
        
        Assert.areEqual('toggle', role);
    },
    
    'Selecting a toggleButton should add class `yui3-button-selected`': function () {
        var button = this.toggleButton,
            cb = button.get('contentBox');
        
        Assert.isFalse(cb.hasClass('yui3-button-selected'));
        
        cb.simulate('click');
        Assert.isTrue(cb.hasClass('yui3-button-selected'));

        // Simulate the button click
        cb.simulate('click');
        Assert.isFalse(cb.hasClass('yui3-button-selected'));

        cb.simulate('click');
        Assert.isTrue(cb.hasClass('yui3-button-selected'));
        
        cb.simulate('click');
        Assert.isFalse(cb.hasClass('yui3-button-selected'));
    },
    
    'Select toggling a button should fire pressedChange': function () {
        var toggleButton = this.toggleButton,
            cb = toggleButton.get('contentBox'),
            eventsTriggered = 0;
        
        toggleButton.on('pressedChange', function(){
            eventsTriggered+=1;
        });
        
        Assert.areEqual(0, eventsTriggered);
        
        cb.simulate('click');
        Assert.areEqual(1, eventsTriggered);
        
        cb.simulate('click');
        Assert.areEqual(2, eventsTriggered);
    },
    
    'disable() should set the disabled attribute to true': function () {
        var button = this.button;
        
        Assert.isFalse(button.get('disabled'));

        button.disable();
        Assert.isTrue(button.get('disabled'));
        Assert.isTrue(button.get('boundingBox').get('disabled'));
    },
    
    'enable() should set the disabled attribute to false': function () {
        var button = this.button;
        
        Assert.isFalse(button.get('disabled'));

        button.disable();
        Assert.isTrue(button.get('disabled'));
        
        button.enable();
        Assert.isFalse(button.get('disabled'));
    },
    
    'Setting `pressed` should toggle the `pressed` attribute': function () {
        var button = this.toggleButton;
        
        Assert.isFalse(button.get('pressed'));

        button.set('pressed', true);
        Assert.isTrue(button.get('pressed'));
        
        button.set('pressed', false);
        Assert.isFalse(button.get('pressed'));
    },
    
    'Setting `checked` should toggle the `checked` attribute': function () {
        var button = this.checkButton;
        
        Assert.isFalse(button.get('checked'));

        button.set('checked', true);
        Assert.isTrue(button.get('checked'));
        
        button.set('checked', false);
        Assert.isFalse(button.get('checked'));
    },
    
    'Toggle buttons should have proper ARIA data': function () {
        var button = this.toggleButton,
            cb = button.get('contentBox');
        
        Assert.areSame('toggle', cb.get('role'));
        Assert.areSame('false', cb.get('aria-pressed'));
        
        cb.simulate('click');
        //button.set('pressed', true);
        Assert.areSame('true', cb.get('aria-pressed'));
    },
    
    'Checkbox buttons should have proper ARIA data': function () {
        var button = this.checkButton,
            cb = button.get('contentBox');
        
        Assert.areSame('checkbox', cb.get('role'));
        Assert.areSame('false', cb.get('aria-checked'));
        
        cb.simulate('click');
        
        Assert.areSame('true', cb.get('aria-checked'));
    },
    
    'hide() and show() should behave correctly': function () {
        var button = this.button,
            cb = button.get('contentBox'),
            origStyle = cb.getStyle('display');
        
        button.hide();

        Assert.isTrue(cb.hasClass('yui3-button-hidden'));
        Assert.areSame('none', cb.getComputedStyle('display'));

        button.show();

        Assert.isFalse(cb.hasClass('yui3-button-hidden'));
        Assert.areSame(origStyle, cb.getStyle('display'));
    },

    'Rendering should preserve nested HTML': function() {

        var Test = this,
            content = '<div>foo</div><div>bar</div>',
            button,
            expected,
            actual;

        Y.one("#container").setContent('<button>' + content + '</button>');

        button = new Y.Button({
            srcNode: Y.one("#container button"),
            render: true
        });

        expected = button.getNode().getHTML(),
        actual = button.get('labelHTML');

        Assert.areSame(expected, actual);
    }
}));

// -- Config tests ----------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Config',

    setUp : function () {

    },
    
    tearDown: function () {
        Y.one("#container").empty(true);
    },
    
    'Passing `pressed=true` in with the config will default the button to a `pressed` state': function() {
        var button;

        Y.one("#container").setContent('<input type="button" value="foo">');
        
        button = new Y.ToggleButton({
            srcNode: Y.one("#container input"),
            pressed: true,
            render: true
        });
        
        Assert.isTrue(button.get('pressed'));
        Assert.isUndefined(button.get('checked'));
        
        button.toggle();

        Assert.isFalse(button.get('pressed'));
        Assert.isUndefined(button.get('checked'));
    },
    
    'Passing `checked=true` in with the config will default the button to a `checked` state': function() {
        var button;
        
        Y.one("#container").setContent('<input type="button" value="foo">');
        
        button = new Y.ToggleButton({
            srcNode: Y.one("#container input"),
            checked: true,
            type: 'checkbox',
            render: true
        });
        
        Assert.isTrue(button.get('checked'));
        Assert.isUndefined(button.get('pressed'));
        
        button.toggle();

        Assert.isFalse(button.get('checked'));
        Assert.isUndefined(button.get('pressed'));
    },
    
    'Passing `disabled=true` in with the config will default the button to a `disabled` state': function() {
        var Test = this,
            button;

        Y.one("#container").setContent('<button></button>');
        
        button = new Y.Button({
            srcNode: Y.one("#container button"),
            disabled: true,
            render: true
        });

        Y.later(500, null, function(){
            Test.resume(function(){
                Assert.isTrue(button.get('disabled'));
                Assert.isTrue(button.get('boundingBox').get('disabled'));  
            });
        });

        Test.wait(2000);
    },
    
    'Passing a label attribute in with the config should default the button text': function() {
        var Test = this,
            label = 'YUI is awesome',
            button;

        Y.one("#container").setContent('<button></button>');
          
        button = new Y.Button({
            srcNode: Y.one("#container button"),
            label: label,
            render: true
        });

        Y.later(500, null, function(){
            Test.resume(function(){
                Assert.areEqual(label, button.get('label')); 
            });
        });

        Test.wait(2000);
    }
}));


// -- HTML Parser tests ----------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Parser',

    setUp : function () {

    },
    
    tearDown: function () {
        Y.one("#container").empty(true);
    },
    
    'The HTML parser for the `labelHTML` attribute should reference the button text': function() {
        
        var Test = this,
            label = 'YUI is awesome',
            button;

        Y.one("#container").setContent('<button>' + label + '</button>');

        button = new Y.Button({
            srcNode: Y.one("#container button"),
            render: true
        });

        Y.later(100, null, function(){
            Test.resume(function(){
                Assert.areEqual(label, button.get('labelHTML'));
            });
        });

        Test.wait(1000);
    },
    
    'Using `disabled=true` in the markup will default the button to a `disabled` state': function() {
        Y.one("#container").setContent('<button disabled></button>');
        
        var Test = this,
            button = new Y.Button({
                srcNode: Y.one("#container button"),
                render: true
            });

        Y.later(100, null, function(){
            Test.resume(function(){
                Assert.isTrue(button.get('disabled'));
                Assert.isTrue(button.get('boundingBox').get('disabled'));  
            });
        });

        Test.wait(1000);
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['button', 'test', 'node-event-simulate']
});
