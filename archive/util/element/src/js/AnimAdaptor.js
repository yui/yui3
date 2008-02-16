/*
    Open Questions:
        - should this also add Animated behavior?
*/

(function() {
    var AnimAdaptor = function(element) {
        this.constructor.superclass.constructor.call(this, {element: element});
    };

    AnimAdaptor.CONFIG = {
        'element': {
            set: function(node) {
                if (!node.get) {
                    return YAHOO.util.Element.get(node); 
                }
            },
            validator: function(node) {
                return node && (node.tagName || node.get); // HTMLElement or yui.Element    
            } 
        }
    };

    var proto = {
        showMethod : 'fadeIn',
        hideMethod : 'fadeOut',

        initializer : function(element) {
            this.__.element = this.get('element');
            this.__.anim = this.__.anim || new YAHOO.util.Animated({ node: this.__.element._.node });
            this.__.element.on('beforeVisibleChange', this.onBeforeVisibleChange, this, true);
        },

        onBeforeVisibleChange : function(e) {
            if (e.newValue === e.prevValue) {
                return; // already showing
            }

            if (e.newValue === true) {
                this.show();
            } else {
                this.hide();
            }
            return false; // prevent default set
        },

        show : function() {
            this.__.element.set('visible', true, true); // silent show it first to fade in
            var me = this;
            this.__.anim[this.showMethod]({
                onComplete: function() {
                    me.setVisible(true);
                }
            });
        },

        hide : function() {
            var me = this;
            this.__.anim[this.hideMethod]({
                onComplete: function() {
                    me.setVisible(false);
                }
            });
        },

        setVisible: function(val) {
            this.__.element.unsubscribe('beforeVisibleChange', this.onBeforeVisibleChange); // so we can set it without our handler intercepting
            this.__.element.set('visible', val); 
            this.__.element.subscribe('beforeVisibleChange', this.onBeforeVisibleChange, this, true); // put it back TODO: better way?
        }
    };


    YAHOO.lang.extend(AnimAdaptor, YAHOO.util.Object, proto);
    YAHOO.util.AnimAdaptor = AnimAdaptor;
})();
