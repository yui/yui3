YUI.add('button-group', function(Y) {


var ButtonGroup = function (config) {
    
    var ATTRS = {
        /* The array of buttons contained in this group */
        buttons   : {
            setter: function(buttons) {
                
                var ButtonList = new Y.ArrayList(buttons);
                var type = this.get('type');
                
                ButtonList.each(function(button){
                    if (type === 'radio' || type === 'checkbox') {
                        button.set('type', 'toggle');
                    }
                    button.before('selectedChange', this._beforeButtonSelectedChange, this);
                    //button.on('selectedChange', this._onButtonSelectedChange, this);
                    button.after('selectedChange', this._afterButtonSelectedChange, this);
                }, this);
                
                return ButtonList;
            }
        },
        selection : {
            value : [],
            getter: function(){
                var buttons = this.get('buttons');
                var selected = [];
                buttons.each(function(button){
                    if (button.get('selected')) {
                        selected.push(button);
                    }
                });
                
                return selected;
            }
        },
        type: { 
            value: 'push',
            validator: function(val) {
                return Y.Array.indexOf(['push', 'radio', 'checkbox'], val);
            }
        },

    };

    this.addAttrs(ATTRS, config);
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
        var isSelected = button.get('selected');
        if (isSelected) {
            e.preventDefault();
            return false;
        }
        else {
            /* Nothing */
        }
    }
};

ButtonGroup.prototype._onButtonSelectedChange = function(e) {

};

ButtonGroup.prototype._afterButtonSelectedChange = function(e) {
    var button, buttons, target;
    target = e.target;
    
    if (this.get('type') === 'radio') {
        buttons = this.get('buttons');
        buttons.each(function(button){
            if (buttons.indexOf(target) != buttons.indexOf(button)) {
                button.set('selected', false, {propagate:false});
            }
            else {
                /* Nothing */
            }
        });
    }
};

Y.augment(ButtonGroup, Y.Attribute);

Y.ButtonGroup = ButtonGroup;


}, '@VERSION@' ,{requires:['button-base']});
