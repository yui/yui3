YUI.add('button-group-test', function (Y) {

var Assert      = Y.Assert,
    ArrayAssert = Y.ArrayAssert,
    suite;
    
// -- Suite --------------------------------------------------------------------
suite = new Y.Test.Suite('ButtonGroup');

// -- Methods ----------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Methods',

    setUp : function () {
        var button, buttons = [], i;
        
        // Create a few buttons
        for(i=0; i < 5; i+=1) {
            button = new Y.Button({
                srcNode: Y.Node.create('<button>' + i + '</button>')
            });
            button.getNode().set('value', i);
            buttons.push(button);
        }

        this.ButtonGroup = new Y.ButtonGroup({
            buttons: buttons,
            type: 'checkbox'
        });
    },
    
    tearDown: function () {
        Y.one('#container').empty();
    },

    'ButtonGroup.getButtons() should return an array of Y.Buttons instances': function () {
        var ButtonGroup = this.ButtonGroup;
        var buttons = ButtonGroup.getButtons();
        
        Assert.isInstanceOf(Y.Button, buttons[0]);
    },
    
    'ButtonGroup.getSelectedButtons() should return accurate counts of selected buttons': function () {
        var ButtonGroup = this.ButtonGroup;
        var buttons = ButtonGroup.getButtons();
        
        // Ensure no buttons are selected
        Assert.areSame(0, ButtonGroup.getSelectedButtons().length);
        
        // Select specific buttons, and make sure the selected array jives
        buttons[1].select();
        Assert.areSame(1, ButtonGroup.getSelectedButtons().length);
                
        buttons[2].select();
        Assert.areSame(2, ButtonGroup.getSelectedButtons().length);
        
        buttons[3].select();
        Assert.areSame(3, ButtonGroup.getSelectedButtons().length);
        
        // Unselect
        buttons[2].unselect();
        Assert.areSame(2, ButtonGroup.getSelectedButtons().length);
    },
    
    'ButtonGroup.getSelectedValues() should return values of selected buttons': function () {
        var ButtonGroup = this.ButtonGroup;
        var buttons = ButtonGroup.getButtons();
        
        // Ensure no buttons are selected
        Assert.areSame(0, ButtonGroup.getSelectedButtons().length);
        
        // Select some buttons and ensure the array of values matches
        buttons[1].select();
        ArrayAssert.itemsAreEqual([1], ButtonGroup.getSelectedValues());
        
        buttons[3].select();
        ArrayAssert.itemsAreEqual([1, 3], ButtonGroup.getSelectedValues());
        
        buttons[4].select();
        ArrayAssert.itemsAreEqual([1, 3, 4], ButtonGroup.getSelectedValues());
        
        // Unselect
        buttons[3].unselect();
        ArrayAssert.itemsAreEqual([1, 4], ButtonGroup.getSelectedValues());
    },
    
    'ButtonGroup.addButton() should add an additional Y.Button instance to the array of buttons': function () {
        var ButtonGroup = this.ButtonGroup;
        
        // Create a new button
        var newButton = new Y.Button({
            srcNode: Y.Node.create('<button>6</button>')
        });
        
        Assert.areSame(5, ButtonGroup.getButtons().length);
        
        // Add the button, and assert the new length
        ButtonGroup.addButton(newButton);
        Assert.areSame(6, ButtonGroup.getButtons().length);
    }
    
}));

// -- Methods ----------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'Methods',

    setUp : function () {
        var button, buttons = [], i;
        
        // Create a few buttons
        for(i=0; i < 5; i+=1) {
            button = new Y.Button({
                srcNode: Y.Node.create('<button>' + i + '</button>')
            });
            button.getNode().set('value', i);
            buttons.push(button);
        }

        this.ButtonGroup = new Y.ButtonGroup({
            buttons: buttons,
            type: 'radio'
        });
    },
    
    tearDown: function () {
        Y.one('#container').empty();
    },
    
    'ButtonGroup type radio should only have 0 or 1 buttons selected': function () {
        var ButtonGroup = this.ButtonGroup;
        var buttons = ButtonGroup.getButtons();

        Assert.areSame(0, ButtonGroup.getSelectedButtons().length);
        
        buttons[1].getNode().simulate('click');
        Assert.areSame(1, ButtonGroup.getSelectedButtons().length);
        
        buttons[2].getNode().simulate('click');
        buttons[3].getNode().simulate('click');
        Assert.areSame(1, ButtonGroup.getSelectedButtons().length);
    }
    
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['button-group', 'test', 'node-event-simulate']
});
