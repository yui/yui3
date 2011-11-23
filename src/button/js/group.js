
var ButtonGroup = function(config) {
    
    this.addAttrs({
        
        /* The array of buttons contained in this group */
        buttons   : {
            value : []
        },
        
        /* An array of buttons that have 'selected' = true state */
        selection : { 
            value : [] 
        },
        
        /* The type of ButtonGroup. push/radio/checkbox */
        type      : { 
            value : 'push'
        }
        
    }, config);
    
    var buttons = this.get('buttons');
    Y.Array.each(buttons, function(button){
        this.addButton(button);
    }, this);
}

ButtonGroup.prototype.addButton = function(/* Button */ button){
    //console.log('Adding button');
    var buttons = this.get('buttons');
    if (this.get('type') === 'radio') {
        button.set('type', 'toggle');
    }
    button.before('selectedChange', this._beforeButtonSelectedChange, this);
    button.after('selectedChange', this._afterButtonSelectedChange, this);
    buttons.push(button);
    this.set('buttons', buttons);
}

ButtonGroup.prototype._beforeButtonSelectedChange = function(e) {
    //console.log('Before selection change');
    
    var button = e.target;
    
    if (this.get('type') === 'radio') {
        var selection = this.get('selection');
        if (selection.length) {
            if (button.get('srcNode')._yuid === selection[0].get('srcNode')._yuid) {
                e.preventDefault();
            }
            else {
                this._removeButtonFromSelectionExcept(button);   
            }
        }
    }
}

ButtonGroup.prototype._afterButtonSelectedChange = function(e) {
    this._syncSelection();
}

ButtonGroup.prototype._syncSelection = function() {
    var buttons = this.get('buttons');
    
    // Split apart the selected from the non-selected buttons
    var selections = Y.Array.partition(buttons, function(/* Button */ button){
        return button.get('selected');
    });
    this.set('selection', selections['matches']);
    // TODO: do something with selections['rejects']?
}

ButtonGroup.prototype._removeButtonFromSelectionExcept = function(/* Button */ buttonToKeep) {
    var selection = this.get('selection');
    Y.Array.each(selection, function(button){
        if (button.get('srcNode')._yuid !== buttonToKeep.get('srcNode')._yuid) {
            button.set('selected', false, {propogate:false});
        }
    }, this);                
}

Y.augment(ButtonGroup, Y.Attribute);

Y.ButtonGroup = ButtonGroup;