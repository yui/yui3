YUI.add('button-core-test', function (Y) {

    var Assert      = Y.Assert,
        ArrayAssert = Y.ArrayAssert,
        suite;
    
    suite = new Y.Test.Suite('Buttons');

    suite.add(new Y.Test.Case({
        name: 'button plugin factory',

        setUp : function () {
            Y.one("#container").setContent('<button id="testButton">Hello</button>');
            this.button = new Y.ButtonCore({
                host: Y.one("#testButton")
            });
        },
    
        tearDown: function () {
            Y.one('#container').empty(true);
            delete this.button;
        },

        'Disabling a button should set the `disable` attribute to `true`': function () {
            var button = this.button;
            var node = button.getNode();
        
            Assert.isFalse(button.get('disabled'));
            Assert.isFalse(node.hasClass('yui3-button-disabled'));
            
            button.set('disabled', true);
            Assert.isTrue(button.get('disabled'));
            Assert.isTrue(node.hasClass('yui3-button-disabled'));
        },

        'Enabling a button should set the `disabled` attribute to `false`': function () {
            var button = this.button;
            var node = button.getNode();
            
            button.disable();
            Assert.isTrue(button.get('disabled'));
            Assert.isTrue(node.hasClass('yui3-button-disabled'));
        
            button.enable();
            Assert.isFalse(button.get('disabled'));
            Assert.isFalse(node.hasClass('yui3-button-disabled'));
        },

        'Changing the label should change the `label` attribute of a button': function () {
            var button = this.button;
            var defaultText = Y.ButtonCore.ATTRS.label.value;
            var newText = 'foobar';
        
            button.set('label', newText);
            Assert.areEqual(newText, button.get('label'));
        },
    
        'Changing the label should change the `innerHTML` value of a button node': function () {
            var button = this.button;
            var node = button.getNode();
            var defaultText = Y.ButtonCore.ATTRS.label.value;
            var newText = 'foobar';
        
            button.set('label', newText);
            Assert.areEqual(newText, node.get('innerHTML'));
        },
    
        'Changing the `disabled` attribute should fire a `disabledChange` event': function () {
            var button = this.button;
            var eventsTriggered = 0;
        
            Y.augment(button, Y.Attribute);
        
            button.on('disabledChange', function(){
                eventsTriggered+=1;
            });
        
            Assert.areEqual(0, eventsTriggered);
            button.set('disabled', true);
            Assert.areEqual(1, eventsTriggered);
            button.set('disabled', true);
            Assert.areEqual(2, eventsTriggered);
        },
    
        'Changing the `label` attribute should fire a `labelChange` event': function () {
            var button = this.button;
            var eventsTriggered = 0;
        
            Y.augment(button, Y.Attribute);
        
            button.on('labelChange', function(){
                eventsTriggered+=1;
            });
        
            Assert.areEqual(0, eventsTriggered);
            button.set('label', 'something');
            Assert.areEqual(1, eventsTriggered);
            button.set('label', 'somethingElse');
            Assert.areEqual(2, eventsTriggered);
        },
    
        'Creating an unattached button should create a Y.ButtonCore instance': function () {
            var button = new Y.ButtonCore({label:'foo'});
            Assert.areEqual(button.get('label'), 'foo');
            Assert.isInstanceOf(Y.ButtonCore, button);
        }
    
    }));

    Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['button-core', 'test']
});
