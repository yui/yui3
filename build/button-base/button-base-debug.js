YUI.add('button-base', function(Y) {

var Button = function(config){
    
    
    /* For reference
        http://www.w3.org/TR/wai-aria/states_and_properties
    */
    
    this.addAttrs({
        name: {
            setter: function(val) {
                this.get('srcNode').setAttribute('name', val);
            }
        },
        id: {
            setter: function(val) {
                this.get('srcNode').setAttribute('id', val);
            }
        },
        type: { 
            value: 'push',
            validator: function(val) {
                return Y.Array.indexOf(['push', 'toggle'], val)
            },
            setter: function(val) {
                if (val === "toggle") {
                    this.get('srcNode').on('click', function(e){
                        // Reverse
                        this.set('selected', !this.get('selected'));
                    }, this);
                }
            }
        },
        disabled: {
            value: 'false',
            validator: function(val) {
                return Y.Lang.isBoolean(val);
            },
            setter: function(val) {
                if (val === true) {
                    var node = this.get('srcNode');
                    node.setAttribute('disabled', 'true');
                    node.addClass('yui3-button-disabled');
                }
                else {
                    var node = this.get('srcNode');
                    node.removeAttribute('disabled');
                    node.removeClass('yui3-button-disabled');
                }
            }
        },
        tabIndex: {
            value: '0',
            validator: function(val) {
                return Y.Lang.isNumber(val);
            },
            setter: function(val) {
                var node = this.get('srcNode');
                node.setAttribute('tabIndex', val);
            }
        },
        srcNode: {
            setter: function(val) {
                if (Y.Lang.isString(val)) {
                    return Y.one(val);
                }
                else {
                    return val;
                }
            }   
        },
        selected: {
            value: false,
            setter: function(value) {
                if (value !== this.get('selected')) {
                    if (value) {
                        var node = this.get('srcNode');
                        node.set('aria-selected', 'true');
                        node.addClass('yui3-button-selected');
                    }
                    else {
                        var node = this.get('srcNode');
                        node.set('aria-selected', 'false');
                        node.removeClass('yui3-button-selected');
                    }
                }
                else {
                    // Setting to same value, don't do anything (right?)
                }
                
                return value;
            },
            validator: function(val) {
                return Y.Lang.isBoolean(val);
            }
        }
    }, config);
    
    var node = this.get('srcNode');
    
    if (!node.hasClass('yui3-button')) {
        node.addClass('yui3-button');
    }
    
    if (!node.getAttribute('role')) {
        node.set('role', 'button');
    }
    
    node.on('mousedown', function(e){
        e.target.setAttribute('aria-pressed', 'true');
    });
    
    node.on('mouseup', function(e){
        e.target.setAttribute('aria-pressed', 'false');
    });
    
    node.on('focus', function(e){
        e.target.addClass('yui3-button-focus');
    });
    
    node.on('blur', function(e){
        e.target.removeClass('yui3-button-focus');
    });
    
    node.on('disabledChange', function(value){
        e.target.setAttribute('yui3-button-disabled', value);
    });
    
    this.on('selectedChange', function(e){
        if (e.propogate === false) {
            e.stopImmediatePropagation();
        }
    });
}

/* A few methods to handle color contrast, not sure if these will make it in the final build or not */
Button.prototype.changeColor = function(color) {
    var fontColor = Button._getContrastYIQ(Button._colorToHex(color));
    this.get('srcNode').setStyle('backgroundColor', color);
    this.get('srcNode').setStyle('color', fontColor);
}

Button._colorToHex = function(color) {
    if (color.substr(0, 1) === '#') {
        return color;
    }
    var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);

    var red = parseInt(digits[2]);
    var green = parseInt(digits[3]);
    var blue = parseInt(digits[4]);

    var rgb = blue | (green << 8) | (red << 16);
    return digits[1] + '#' + rgb.toString(16);
};


Button._getContrastYIQ = function(hexcolor){
	var r = parseInt(hexcolor.substr(1,2),16);
	var g = parseInt(hexcolor.substr(3,2),16);
	var b = parseInt(hexcolor.substr(5,2),16);
	var yiq = ((r*299)+(g*587)+(b*114))/1000;
	return (yiq >= 128) ? 'black' : 'white';
}

var ButtonGenerator = function(config) {
    var node = Y.Node.create('<button>' + config.label + '</button>');
    var button = new Y.Button({
        srcNode: node,
        type: config.type,
        name: config.name
    });
    return button;
}

var Buttons = function(config){
    var buttons = [];
    config.srcNodes.each(function(node){
        var button = new Y.Button({
            type: config.type,
            srcNode: node
        });
        buttons.push(button);
    });
    
    return buttons;
}

Y.augment(Button, Y.Attribute);

Y.Button          = Button;
Y.Buttons         = Buttons;
Y.ButtonGenerator = ButtonGenerator;


}, '@VERSION@' ,{requires:['yui-base', 'attribute', 'node', 'array-extras']});
