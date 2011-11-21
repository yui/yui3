YUI.add('button-group', function(Y) {


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
        },
        
        /* The type of buttons this group should generate. push/toggle */
        buttonType: {
            valueFn: function(){
                if (config.type === 'checkbox' || config.type === 'radio') {
                    return 'toggle';
                }
                else {
                    return 'push';
                }
            }
        },
        
        /* A NodeList pointing to all the button elements */
        srcNodes  : {
            setter: function(value) {
                if (Y.Lang.isString(value)) {
                    return Y.all(config.srcNodes);
                }
                else {
                    return value;
                }
            }   
        },
        
    }, config);
    
    var srcNodes = this.get('srcNodes');
    
    srcNodes.each(function(node){
        var button = new Y.Button({
            type: this.get('buttonType'),
            srcNode: node
        });
        
        this.addButton(button);
        
        button.before('selectedChange', this._beforeButtonSelectedChange, this);
        button.after('selectedChange', this._afterButtonSelectedChange, this);
    }, this);
}

ButtonGroup.prototype.addButton = function(/* Button */ button){
    //console.log('Adding button');
    var buttons = this.get('buttons');
    buttons.push(button);
    this.set('buttons', buttons);
}

ButtonGroup.prototype._beforeButtonSelectedChange = function(e) {
    //console.log('Before selection change');
    var button = e.target;
    if (this.get('type') === 'radio') {
        this._removeButtonFromSelectionExcept(button);
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
    // do something with selections['rejects']?
}

ButtonGroup.prototype._removeButtonFromSelectionExcept = function(/* Button */ buttonToKeep) {
    var selection = this.get('selection');
    Y.Array.each(selection, function(button){
        if (button.get('srcNode')._yuid !== buttonToKeep.get('srcNode')._yuid) {
            button.set('selected', false);
        }
    }, this);                
}

Y.augment(ButtonGroup, Y.Attribute);

Y.ButtonGroup     = ButtonGroup;


}, '@VERSION@' ,{requires:['button-base']});
