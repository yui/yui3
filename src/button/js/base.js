var Button = function(config){
    
    this.addAttrs({
        type: { 
            value: 'push',
            validator: function(val) {
                return Y.Array.indexOf(['push', 'toggle'], val)
            },
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
    
    this.decorate();
    
    if (this.get('type') === 'toggle') {
        this.get('srcNode').on('click', function(e){
            if (this.get('selected')) {
                this.set('selected', false);
            }
            else {
                this.set('selected', true);
            }
        }, this)
    }
}

Button.prototype.decorate = function(){
    var node = this.get('srcNode');
    
    if (!node.hasClass('yui3-button')) {
        node.addClass('yui3-button');
    }
    
    node.setAttribute('aria-pressed', 'false');
    node.setAttribute('aria-selected', 'false');
    
    if (!node.getAttribute('tabindex')) {
        this.set('tabIndex', 0);
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
    
    node.on('disabledChange', function(value){
        e.target.setAttribute('yui3-button-disabled', value);
    });
}

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
    var node = Y.Node.create('<button>' + config.label + '</button>').appendTo(Y.one(config.parent));
    var button = new Y.Button({
        srcNode: node,
        type: config.type
    });
    button.decorate();
    return button;
}


Y.augment(Button, Y.Attribute);

Y.Button          = Button;
Y.ButtonGenerator = ButtonGenerator;