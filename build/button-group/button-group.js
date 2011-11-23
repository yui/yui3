YUI.add('button-group', function(Y) {

/*global Y */

var ButtonGroup = function (config) {
    
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
};

ButtonGroup.prototype.addButton = function(/* Button */ button){
    var buttons;
    
    buttons = this.get('buttons');
    
    if (this.get('type') === 'radio') {
        button.set('type', 'toggle');
    }
    
    button.before('selectedChange', this._beforeButtonSelectedChange, this);
    button.after('selectedChange', this._afterButtonSelectedChange, this);
    buttons.push(button);
    
    this.set('buttons', buttons);
};

ButtonGroup.prototype._beforeButtonSelectedChange = function(e) {
    var button, selection;
    
    button = e.target;
    
    if (this.get('type') === 'radio') {
        selection = this.get('selection');
        if (selection.length) {
            if (button.get('srcNode')._yuid === selection[0].get('srcNode')._yuid) {
                e.preventDefault();
            }
            else {
                this._removeButtonFromSelectionExcept(button);   
            }
        }
    }
};

ButtonGroup.prototype._afterButtonSelectedChange = function() {
    this._syncSelection();
};

ButtonGroup.prototype._syncSelection = function() {
    var buttons, selections;
    
    buttons = this.get('buttons');
    
    // Split apart the selected from the non-selected buttons
    selections = Y.Array.partition(buttons, function(/* Button */ button){
        return button.get('selected');
    });
    
    this.set('selection', selections.matches);
    // TODO: do something with selections['rejects']?
};

ButtonGroup.prototype._removeButtonFromSelectionExcept = function(/* Button */ buttonToKeep) {
    var selection = this.get('selection');
    Y.Array.each(selection, function(button){
        if (button.get('srcNode')._yuid !== buttonToKeep.get('srcNode')._yuid) {
            button.set('selected', false, {propagate:false});
        }
    }, this);                
};

Y.augment(ButtonGroup, Y.Attribute);

Y.ButtonGroup = ButtonGroup;


}, '@VERSION@' ,{requires:['button-base']});
