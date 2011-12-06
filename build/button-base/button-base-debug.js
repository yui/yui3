YUI.add('button-base', function(Y) {

/*global Y */

var Button = function(config){
    
    /* For reference
        http://www.w3.org/TR/wai-aria/states_and_properties
        
        Y.Button
            public methods:
                - onClick
                - getDOMNode
        
            private methods:
                - _colorToHex (static)
                - _getContrastYIQ (static)
                
            attributes:
                - type
                - disabled
                - selected
                - backgroundColor

            events:
                - typeChange
                - selectedChange
                - backgroundColorChange
                - disabledChange
    */
    
    this._srcNode = Y.one(config.srcNode);
    var node = this._srcNode;
    
    node.addClass('yui3-button');
    node.setAttribute('role', 'button');
    
    var ATTRS = {
        label: {
            setter: function(val) {
                var node = this.getDOMNode();
                node.set(node.test('input') ? 'value' : 'text', val)
            }
        },
        type: { 
            value: 'push',
            validator: function(val) {
                return Y.Array.indexOf(['push', 'toggle'], val);
            },
            setter: function(val) {
                if (val === "toggle") {
                    var node = this.getDOMNode();
                    node.on('click', function(){
                        var button = this;
                        button.set('selected', !this.get('selected'));
                    }, this);
                }
            }
        },
        disabled: {
            value: false,
            validator: function(val) {
                return Y.Lang.isBoolean(val);
            },
            setter: function(val) {
                var node = this.getDOMNode();
                if (val === true) {
                    node.setAttribute('disabled', 'true');
                    node.addClass('yui3-button-disabled');
                }
                else {
                    node.removeAttribute('disabled');
                    node.removeClass('yui3-button-disabled');
                }
            }
        },
        selected: {
            value: false,
            setter: function(value) {
                var node = this.getDOMNode();
                //if (value !== this.get('selected')) {
                    if (value) {
                        node.set('aria-selected', 'true');
                        node.addClass('yui3-button-selected');
                    }
                    else {
                        node.set('aria-selected', 'false');
                        node.removeClass('yui3-button-selected');
                    }
               //}
                /*
                else {
                    // Setting to same value, don't do anything (right? return false?)
                }
                */
            },
            validator: function(val) {
                return Y.Lang.isBoolean(val);
            }
        },
        backgroundColor: {
            setter: function(color){
                var fontColor = Button._getContrastYIQ(Button._colorToHex(color));
                var node = this.getDOMNode();
                node.setStyle('backgroundColor', color);
                node.setStyle('color', fontColor);                
            }
        }
    };
    
    this.addAttrs(ATTRS, config);
    
    // TODO: Does mousedown/up even work on touch devices?
    node.on({
        mousedown: function(e){
            e.target.setAttribute('aria-pressed', 'true');
        },
        mouseup: function(e){
            e.target.setAttribute('aria-pressed', 'false');
        },
        focus: function(e){
            e.target.addClass('yui3-button-focused');
        },
        blur: function(e){
            e.target.removeClass('yui3-button-focused');
        }
    });
    
    node.on('click', function(e){
        if(this.onClickfn) {
            this.onClickfn(e);
        }
    }, this);
    
    this.on('selectedChange', function(e){
        if (e.propagate === false) {
            e.stopImmediatePropagation();
        }
    }, this);
    
    if (config.onClick) {
        this.onClickfn = config.onClick;
    }
};

Button.prototype.onClick = function(fn) {
    this.onClickfn = fn;
};

Button.prototype.getDOMNode = function() {
    return this._srcNode;
};


Button._colorToHex = function(color) {
    var digits, red, green, blue, rgb;
    
    if (color.substr(0, 1) === '#') {
        return color;
    }
    digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);

    red = parseInt(digits[2], 10);
    green = parseInt(digits[3], 10);
    blue = parseInt(digits[4], 10);

    rgb = blue | (green << 8) | (red << 16);
    return digits[1] + '#' + rgb.toString(16);
};


Button._getContrastYIQ = function(hexcolor){
    var r, g, b, yiq;
    
	r = parseInt(hexcolor.substr(1,2),16);
	g = parseInt(hexcolor.substr(3,2),16);
	b = parseInt(hexcolor.substr(5,2),16);
	yiq = ((r*299)+(g*587)+(b*114))/1000;
	return (yiq >= 128) ? 'black' : 'white';
};

var ButtonGenerator = function(config) {
    var button;
    
    config.srcNode = Y.Node.create('<button>' + config.label + '</button>');
    button = new Y.Button(config);
    return button;
};

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
};

Y.augment(Button, Y.Attribute);

Y.Button          = Button;
Y.Buttons         = Buttons;
Y.ButtonGenerator = ButtonGenerator;


}, '@VERSION@' ,{requires:['yui-base', 'attribute', 'node', 'array-extras']});
