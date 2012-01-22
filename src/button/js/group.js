/**
* TODO
*
* @module ButtonGroup
* @main ButtonGroup
* @since 3.5.0
*/

/**
* Creates a ButtonGroup
*
* @class ButtonGroup
* @extends Base
* @param config {Object} Configuration object
* @constructor
*/
function ButtonGroup(config) {
    ButtonGroup.superclass.constructor.apply(this, arguments);
}



// -- Private Methods ----------------------------------------------------------

// -- /Private Methods ----------------------------------------------------------

/* Button extends the Base class */
Y.extend(ButtonGroup, Y.Base, {
    
    /**
    * @method initializer
    * @description Internal init() handler.
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config){
        
        this.buttons = new Y.ArrayList();

        if (config.srcNodes){
            if (Y.Lang.isString(config.srcNodes)){
                config.srcNodes = Y.all(config.srcNodes);
            }
            config.buttons = [];
            config.srcNodes.each(function(node){
                config.srcNode = node;
                config.buttons.push(new Y.Button(config));
            });

            delete config.srcNodes;
        }
        
        if (config.buttons) {
            Y.Array.each(config.buttons, function(button){
                this.addButton(button);
            }, this);
        }
        
    },
    
    /*Public Methods*/
    
    getButtons: function() {
        return this.buttons._items;
    },
    
    getSelectedButtons: function() {

        var selected = [], buttons;
        buttons = this.buttons;

        buttons.each(function(button){
            if (button.get('selected')){
                selected.push(button);
            }
        });

        return selected;
    },
    
    getSelectedValues: function() {
        var selected, values = [];
        selected = this.getSelectedButtons();
        Y.Array.each(selected, function(button){
            values.push(button.getNode().get('value'));
        });

        return values;
    },
    
    addButton: function(button){
        var type = this.get('type');
        
        if (type === 'checkbox') {
            button.set('type', 'checkbox');
        }
        else if (type === 'radio') {
            button.on('click', this._onButtonClick, this);
        }
        
        this.buttons.add(button);
    },
    
    
    
    /*Protected Methods*/
    

    // This is only fired if the group type is radio
    _onButtonClick: function(e) {

        var clickedButton = e.target;
        
        if (!clickedButton.get('selected')) {
            var selectedButtons = this.getSelectedButtons();
            Y.Array.each(selectedButtons, function(button){
                button.unselect();
            });
            clickedButton.select();
            this.fire('selectionChange');
        }
        else {
            console.log('already');
        }
    }
    
    
}, {
    /** 
    * Array of attributes
    *
    * @property ATTRS
    * @type {Array}
    * @private
    * @static
    */
    ATTRS: {
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
    }
});

// -- Static Properties ----------------------------------------------------------

/**
* Name of this component.
*
* @property NAME
* @type String
* @static
*/
ButtonGroup.NAME = "buttongroup";

/** 
* Array of static constants used to identify the classnames applied to the Button DOM objects
*
* @property CLASS_NAMES
* @type {Array}
* @static
*/
ButtonGroup.CLASS_NAMES = {
}


// -- Protected Methods ----------------------------------------------------------
// -- /Protected Methods ----------------------------------------------------------


// Export Button
Y.ButtonGroup = ButtonGroup;
