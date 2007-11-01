(function() {
    var Y = YAHOO.util;

    var Animated = function() {
        this.constructor.superclass.constructor.apply(this, arguments);
    };

    Animated.CONFIG = {
        'node': {
            set: function(node) {
                var node = YAHOO.util.Dom.get(node);
                return node;
            },
            validator: function(node) {
                return node && node.tagName; // HTMLElement
            } 
        }
    };

    Animated.DEFAULT_DURATION = 1;
    Animated.DEFAULT_EASING = YAHOO.util.Easing.easeOut;

    var proto = {
        initializer : function(config) {
            this._.node = config.node;
            this.__.anim = new Y.Anim(this.get('node'));
        },

        fadeIn: function(config) {
            this.fadeTo(1, config);
        },

        fadeOut: function(config) {
            this.fadeTo(0, config);
        },

        fadeTo: function(opacity, config) {
            config = config || {};
            config.attributes = config.attributes || {};
            config.attributes.opacity = { to: opacity };
            this.play(config);

        },

        play: function(config) {
            var anim = this.__.anim;
            config = config || {};

            if (config.onComplete) {
                var f = function() {
                    anim.onComplete.unsubscribe(f);
                    config.onComplete.call(this);
                };

                anim.onComplete.subscribe(f);
            }

            anim.attributes = config.attributes || {};
            anim.duration = config.duration || Animated.DEFAULT_DURATION;
            anim.method = config.easing || Animated.DEFAULT_EASING;
            anim.animate();
        }

    };
    YAHOO.lang.extend(Animated, YAHOO.util.Object, proto);
    YAHOO.util.Animated = Animated;
})();
