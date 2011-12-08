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
        var buttons = [];
        
        // Create a few buttons
        for(var i=0; i < 5; i++) {
            button = new Y.ButtonGenerator( {label: i} );
            button.getDOMNode().set('value', i);
            buttons.push(button);
        }

        this.ButtonGroup = new Y.ButtonGroup({
            buttons: buttons,
            type: 'checkbox'
        });
    },
    
    tearDown: function () {
        Y.one('#test').empty();
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
        buttons[1].set('selected', true);
        Assert.areSame(1, ButtonGroup.getSelectedButtons().length);
                
        buttons[2].set('selected', true);
        Assert.areSame(2, ButtonGroup.getSelectedButtons().length);
        
        buttons[3].set('selected', true);
        Assert.areSame(3, ButtonGroup.getSelectedButtons().length);
        
        // Deselect
        buttons[2].set('selected', false);
        Assert.areSame(2, ButtonGroup.getSelectedButtons().length);
    },
    
    'ButtonGroup.getSelectedValues() should return values of selected buttons': function () {
        var ButtonGroup = this.ButtonGroup;
        var buttons = ButtonGroup.getButtons();
        
        // Ensure no buttons are selected
        Assert.areSame(0, ButtonGroup.getSelectedButtons().length);
        
        // Select some buttons and ensure the array of values matches
        buttons[1].set('selected', true);
        ArrayAssert.itemsAreEqual([1], ButtonGroup.getSelectedValues());
        
        buttons[3].set('selected', true);
        ArrayAssert.itemsAreEqual([1, 3], ButtonGroup.getSelectedValues());
        
        buttons[4].set('selected', true);
        ArrayAssert.itemsAreEqual([1, 3, 4], ButtonGroup.getSelectedValues());
        
        // Deselect
        buttons[3].set('selected', false);
        ArrayAssert.itemsAreEqual([1, 4], ButtonGroup.getSelectedValues());
    },
    
    'ButtonGroup.addButton() should add an additional Y.Button instance to the array of buttons': function () {
        var ButtonGroup = this.ButtonGroup;
        var buttons = ButtonGroup.getButtons();
        
        // Create a new button
        var newButton = new Y.ButtonGenerator({label: 6});
        
        // Ensure no buttons are selected
        Assert.areSame(5, ButtonGroup.getButtons().length);
        
        // Add the button, and assert the new length
        ButtonGroup.addButton(newButton);
        Assert.areSame(6, ButtonGroup.getButtons().length);
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['button-group', 'test', 'node-event-simulate']
});
