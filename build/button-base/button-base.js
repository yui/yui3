YUI.add('button-base', function(Y) {


    function Button(config) {
        Button.superclass.constructor.apply(this, arguments);
    }
    
    Button.NAME = "button";
    
    Y.extend(Button, Y.Base, {
        
        /**
        * @method initializer
        * @description Internal init() handler.
        * @param config {Object} Config object.
        * @private
        */
        initializer: function(config){
            this._srcNode = Y.one(config.srcNode);
            this._typeSetter(config.type);
            this._disabledSetter(config.disabled);
            this._selectedSetter(config.selected);
            this.renderUI();
            this.bindUI();
        },
        
        /**
        * @method destructor
        * @description 
        * @param config {Object} Config object.
        * @private
        */
        destructor: function () {
            
        },

        /**
        *
        */        
        renderUI: function() {
            var node = this._srcNode;
            
            node.addClass(Button.CLASS_NAMES.button);
            node.setAttribute('role', 'button');
        },
        
        /**
        *
        */        
        bindUI: function() {
            
            var node = this._srcNode;
                
            // TODO: Does mousedown/up even work on touch devices?
            node.on({
                mousedown: function(e){
                    e.target.setAttribute('aria-pressed', 'true');
                },
                mouseup: function(e){
                    e.target.setAttribute('aria-pressed', 'false');
                },
                focus: function(e){
                    e.target.addClass(Button.CLASS_NAMES.focused);
                },
                blur: function(e){
                    e.target.removeClass(Button.CLASS_NAMES.focused);
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
        },
        
        /**
        *
        */
        onClick: function(fn) {
            this.onClickfn = fn;
        },

        /**
        *
        */
        getNode: function() {
            return this._srcNode;
        },

        /**
        *
        */
        select: function() {
            this.set('selected', true);
        },

        /**
        *
        */
        deselect: function() {
            this.set('selected', false);
        },

        /**
        *
        */
        enable: function() {
            this.set('disabled', false);
        },

        /**
        *
        */
        disable: function() {
            this.set('disabled', true);
        },

        /**
        *
        */
        setBackgroundColor: function(color) {
            this.set('backgroundColor', color);
        },

        /**
        *
        */
        _labelSetter: function (value) {
            var node = this.getNode();
            node.set(node.test('input') ? 'value' : 'text', value)
        },

        /**
        *
        */
        _disabledSetter: function (value) {
            var node = this.getNode();
            if (value === true) {
                node.setAttribute('disabled', 'true');
                node.addClass(Button.CLASS_NAMES.disabled);
            }
            else {
                node.removeAttribute('disabled');
                node.removeClass(Button.CLASS_NAMES.disabled);
            }
        },

        /**
        *
        */
        _selectedSetter: function(value) {
            var node = this.getNode();
            if (value) {
                node.set('aria-selected', 'true');
                node.addClass(Button.CLASS_NAMES.selected);
            }
            else {
                node.set('aria-selected', 'false');
                node.removeClass(Button.CLASS_NAMES.selected);
            }
        },

        /**
        *
        */
        _typeSetter: function(value) {
            if (value === "toggle") {
                var node = this.getNode();
                this._clickHandler = node.on('click', function(){
                    this.set('selected', !this.get('selected'));
                }, this);
            }
            else {
                if (this._clickHandler) {
                    this._clickHandler.detach();
                    this._clickHandler = false;
                }
            }
        },
        
        /**
        *
        */
        _backgroundColorSetter: function(color){
            var fontColor, node;
            fontColor = getContrastYIQ(colorToHex(color));
            node = this.getNode();
            node.setStyle('backgroundColor', color);
            node.setStyle('color', fontColor);
        }
    }, {        
        ATTRS: {
            label: {
                setter: '_labelSetter'
            },
            type: {
                value: 'push',
                setter: '_typeSetter'
            },
            disabled: {
                value: false,
                setter: '_disabledSetter'
            },
            selected: {
                value: false,
                setter: '_selectedSetter'
            },
            backgroundColor: {
                setter: '_backgroundColorSetter'
            }
        },

        CLASS_NAMES: {
            button  : makeClassName(),
            selected: makeClassName('selected'),
            focused : makeClassName('focused'),
            disabled: makeClassName('disabled')
        }
    });
    
    function colorToHex(color) {
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
    
    function getContrastYIQ (hexcolor){
        var r, g, b, yiq;

    	r = parseInt(hexcolor.substr(1,2),16);
    	g = parseInt(hexcolor.substr(3,2),16);
    	b = parseInt(hexcolor.substr(5,2),16);
    	yiq = ((r*299)+(g*587)+(b*114))/1000;
    	return (yiq >= 128) ? 'black' : 'white';
    };
    
    function makeClassName(str) {
        if (str) {
            return Y.ClassNameManager.getClassName(Button.NAME, str);
        }
        else {
            return Y.ClassNameManager.getClassName(Button.NAME); 
        }
    }
    
    Y.Button = Button;


}, '@VERSION@' ,{requires:['yui-base', 'attribute', 'node', 'array-extras']});
