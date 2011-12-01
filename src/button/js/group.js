/*global Y */

var ButtonGroup = function (config) {
    
    this.addAttrs({
        
        /* The array of buttons contained in this group */
        buttons   : {
            value:[],
            setter: function(buttons) {
                var type = this.get('type');
                
                Y.Array.each(buttons, function(button){
                    if (type === 'radio' || type === 'checkbox') {
                        button.set('type', 'toggle');
                    }
                    button.before('selectedChange', this._beforeButtonSelectedChange, this);
                    button.after('selectedChange', this._afterButtonSelectedChange, this);
                }, this);
            }
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
};
/* Rethink this

ButtonGroup.prototype.addButton = function(button){
    var buttons, type;
    buttons = this.get('buttons');
    
    buttons.push(button);
    
    this.set('buttons', buttons);
};
*/

ButtonGroup.prototype._beforeButtonSelectedChange = function(e) {
    var button, selection;
    
    button = e.target;
    
    if (this.get('type') === 'radio') {
        selection = this.get('selection');
        if (selection.length) {
            if (button.getDOMNode()._yuid === selection[0].getDOMNode()._yuid) {
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
        if (button.getDOMNode()._yuid !== buttonToKeep.getDOMNode()._yuid) {
            button.set('selected', false, {propagate:false});
        }
    }, this);                
};

Y.augment(ButtonGroup, Y.Attribute);

Y.ButtonGroup = ButtonGroup;