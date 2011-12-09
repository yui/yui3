
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

            node.on({
                click: function(e){
                    button.fire('click', e);
                },
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
                node.setAttribute('disabled', true).addClass(Button.CLASS_NAMES.disabled);
            }
            else {
                node.removeAttribute('disabled').removeClass(Button.CLASS_NAMES.disabled);
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
        },
        
        /**
        *
        */
        _srcNodeSetter: function(value) {
            return Y.one(value);
        }
    }, {
        ATTRS: {
            srcNode: {
                lazyAdd: false,
                setter: '_srcNodeSetter'
            },
            label: {
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
                setter: '_disabledSetter',
                validator: Y.Lang.isBoolean
            },
            selected: {
                value: false,
                lazyAdd: false,
                setter: '_selectedSetter',
                validator: Y.Lang.isBoolean
            }
        },

        CLASS_NAMES: {
            button  : makeClassName(),
            selected: makeClassName('selected'),
            focused : makeClassName('focused'),
            disabled: makeClassName('disabled')
        }
    });
    
    Y.Button = Button;