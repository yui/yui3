
    function Button(config) {
        Button.superclass.constructor.apply(this, arguments);
    }
    
    Button.NAME = "button";
    
    function makeClassName(str) {
        if (str) {
            return Y.ClassNameManager.getClassName(Button.NAME, str);
        }
        else {
            return Y.ClassNameManager.getClassName(Button.NAME); 
        }
    }
    
    Y.extend(Button, Y.Base, {
        
        /**
        * @method initializer
        * @description Internal init() handler.
        * @param config {Object} Config object.
        * @private
        */
        initializer: function(config){
            this.renderUI();
            this.bindUI();
        },
        
        /**
        * @method renderUI
        * @description Renders any UI elements for Y.Button instances
        * @private
        */
        renderUI: function() {
            var node = this.getNode();
            
            node.addClass(Button.CLASS_NAMES.button);
            node.setAttribute('role', 'button');
        },
        
        /**
        *
        */        
        bindUI: function() {
            var button = this;
            var node = button.getNode();
            
            node.on('click', this._onClick, button);
            node.on('mousedown', this._onMouseDown, button);
            node.on('mouseup', this._onMouseUp, button);
            node.on('focus', this._onFocus, button);
            node.on('blur', this._onBlur, button);
            
            button.on('selectedChange', function(e){
                if (e.propagate === false) {
                    e.stopImmediatePropagation();
                }
            });            
        },

        /**
        *
        */
        getNode: function() {
            return this.get('srcNode');
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
        unselect: function() {
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
        _labelSetter: function (value) {
            var node = this.getNode();
            node.set(node.test('input') ? 'value' : 'text', value)
        },

        /**
        *
        */
        _disabledSetter: function (value) {
            this.getNode().set('disabled', value)
                .toggleClass(Button.CLASS_NAMES.disabled, value);
        },
        
        /**
        *
        */
        _selectedSetter: function(value) {
            this.getNode().set('aria-selected', value)
                .toggleClass(Button.CLASS_NAMES.selected, value);
        },

        /**
        *
        */
        _typeSetter: function(value) {
            var button = this;
            if (value === "toggle") {
                var node = button.getNode();
                button._clickHandler = node.on('click', function(){
                    button.set('selected', !button.get('selected'));
                }, button);
            }
            else {
                if (button._clickHandler) {
                    button._clickHandler.detach();
                    button._clickHandler = false;
                }
            }
        }
        
    }, {
        ATTRS: {
            srcNode: {
                setter: Y.one,
                lazyAdd: false,
                valueFn: function () {
                    return Y.Node.create('<button></button>');
                }
            },
            label: {
                lazyAdd: false,
                setter: '_labelSetter'
            },
            type: {
                value: 'push',
                lazyAdd: false,
                setter: '_typeSetter'
            },
            disabled: {
                value: false,
                lazyAdd: false,
                setter: '_disabledSetter'
            },
            selected: {
                value: false,
                lazyAdd: false,
                setter: '_selectedSetter'
            }
        },

        CLASS_NAMES: {
            button  : makeClassName(),
            selected: makeClassName('selected'),
            focused : makeClassName('focused'),
            disabled: makeClassName('disabled')
        }
    });
    
    Button.prototype._onClick = function(e){
        this.fire('click', e);
    };
    
    Button.prototype._onBlur = function(e){
        e.target.removeClass(Button.CLASS_NAMES.focused);
    };
    
    Button.prototype._onFocus = function(e){
        e.target.addClass(Button.CLASS_NAMES.focused);
    };
    
    Button.prototype._onMouseUp = function(e){
        e.target.setAttribute('aria-pressed', 'false');
    };
    
    Button.prototype._onMouseDown = function(e){
        e.target.setAttribute('aria-pressed', 'true');
    };
    
    Y.Button = Button;