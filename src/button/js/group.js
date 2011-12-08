var ButtonGroup = function (config) {
    
    this.buttons = new Y.ArrayList();
    
    var ATTRS = {
        selection : {
            value : [],
            getter: function(){
                var selected = [];
                this.buttons.each(function(button){
                    if (button.get('selected')) {
                        selected.push(button);
                    }
                });
                
                return selected;
            }
        },
        type: {
            value: 'radio',
            validator: function(val) {
                return Y.Array.indexOf(['radio', 'checkbox'], val);
            }
        }
    };

    this.addAttrs(ATTRS, config);
    
    if (config.srcNodes){
        if (Y.Lang.isString(config.srcNodes)){
            config.srcNodes = Y.all(config.srcNodes);
        }
        
        config.buttons = new Y.Buttons(config);
        delete config.srcNodes;
    }
    
    if (config.buttons) {
        Y.Array.each(config.buttons, function(button){
            this.addButton(button);
        }, this);
    }
};

ButtonGroup.prototype.getButtons = function() {
    return this.buttons._items;
};

ButtonGroup.prototype.getSelectedButtons = function() {

    var selected = [], buttons;
    buttons = this.buttons;

    buttons.each(function(button){
        if (button.get('selected')){
            selected.push(button);
        }
    });

    return selected;
};

ButtonGroup.prototype.getSelectedValues = function() {
    var selected, values = [];
    selected = this.getSelectedButtons();
    Y.Array.each(selected, function(button){
        values.push(button.getDOMNode().get('value'));
    });
    
    return values;
};

ButtonGroup.prototype.addButton = function(button){
    button.set('type', 'toggle');
    
    if (this.get('type') === 'radio') {
        button.before('selectedChange', this._beforeButtonSelectedChange, this);
    }
    
    //button.on('selectedChange', this._onButtonSelectedChange, this);
    button.after('selectedChange', this._afterButtonSelectedChange, this);
    
    this.buttons.add(button);
};

// This is only fired if the group type is a radio
ButtonGroup.prototype._beforeButtonSelectedChange = function(e) {
    if (e.target.get('selected')) {
        e.preventDefault();
        return false;
    }
    else {
        /* Nothing? */
    }
};

ButtonGroup.prototype._onButtonSelectedChange = function(e) {

};

ButtonGroup.prototype._afterButtonSelectedChange = function(e) {
    var fireChange, buttons;
    
    fireChange = false;
    buttons = this.buttons;
    
    if (this.get('type') === 'radio') {
        buttons.each(function(button){
            if (buttons.indexOf(e.target) !== buttons.indexOf(button)) {
                fireChange = true;
                button.set('selected', false, {propagate:false});
            }
            else {
                /* Nothing */
            }
        });
    }
    else if (this.get('type') === 'checkbox') {
        fireChange = true;
    }
    
    if (fireChange) {
        this.fire('selectionChange');
    }
};

Y.augment(ButtonGroup, Y.Attribute);

Y.ButtonGroup = ButtonGroup;