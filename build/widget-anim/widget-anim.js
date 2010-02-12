YUI.add('widget-anim', function(Y) {

var BOUNDING_BOX = "boundingBox",
    HOST = "host",
    NODE = "node",
    OPACITY = "opacity",
    EMPTY_STR = "",
    VISIBLE = "visible",
    DESTROY = "destroy",
    HIDDEN = "hidden",

    RENDERED = "rendered",
    
    START = "start",
    END = "end",

    DURATION = "duration",
    ANIM_SHOW = "animShow",
    ANIM_HIDE = "animHide",

    _UI_SET_VISIBLE = "_uiSetVisible",
    
    ANIM_SHOW_CHANGE = "animShowChange",
    ANIM_HIDE_CHANGE = "animHideChange";

function WidgetAnim(config) {
    WidgetAnim.superclass.constructor.apply(this, arguments);
}

/**
 * The namespace for the plugin. This will be the property on the widget, which will 
 * reference the plugin instance, when it's plugged in
 */
WidgetAnim.NS = "anim";

/**
 * The NAME of the WidgetAnim class. Used to prefix events generated
 * by the plugin class.
 */
WidgetAnim.NAME = "pluginWidgetAnim";

WidgetAnim.ANIMATIONS = {

    fadeIn : function() {

        var widget = this.get(HOST),
            boundingBox = widget.get(BOUNDING_BOX),
            
            anim = new Y.Anim({
                node: boundingBox,
                to: { opacity: 1 },
                duration: this.get(DURATION)
            });

        // Set initial opacity, to avoid initial flicker
        if (!widget.get(VISIBLE)) {
            boundingBox.setStyle(OPACITY, 0);
        }

        // Clean up, on destroy. Where supported, remove
        // opacity set using style. Else make 100% opaque
        anim.on(DESTROY, function() {
            this.get(NODE).setStyle(OPACITY, (Y.UA.ie) ? 1 : EMPTY_STR);
        });

        return anim;
    },

    fadeOut : function() {
        return new Y.Anim({
            node: this.get(HOST).get(BOUNDING_BOX),
            to: { opacity: 0 },
            duration: this.get(DURATION)
        });
    }
};

/**
 * The default set of attributes for the WidgetAnim class.
 */
WidgetAnim.ATTRS = {

    /**
     * Default duration. Used by the default animation implementations
     */
    duration : {
        value: 0.2
    },

    /**
     * Default animation instance used for showing the widget (opacity fade-in)
     */
    animShow : {
        valueFn: WidgetAnim.ANIMATIONS.fadeIn
    },

    /**
     * Default animation instance used for hiding the widget (opacity fade-out)
     */
    animHide : {
        valueFn: WidgetAnim.ANIMATIONS.fadeOut
    }
};

/**
 * Extend the base plugin class
 */
Y.extend(WidgetAnim, Y.Plugin.Base, {

    /**
     * Initialization code. Called when the 
     * plugin is instantiated (whenever it's 
     * plugged into the host)
     */
    initializer : function(config) {
        this._bindAnimShow();
        this._bindAnimHide();

        this.after(ANIM_SHOW_CHANGE, this._bindAnimShow);
        this.after(ANIM_HIDE_CHANGE, this._bindAnimHide);

        // Override default _uiSetVisible method, with custom animated method
        this.beforeHostMethod(_UI_SET_VISIBLE, this._uiAnimSetVisible);
    },

    /**
     * Destruction code. Invokes destroy in the individual animation instances,
     * and lets them take care of cleaning up any state.
     */
    destructor : function() {
        this.get(ANIM_SHOW).destroy();
        this.get(ANIM_HIDE).destroy();
    },

    /**
     * The custom animation method, added by the plugin.
     *
     * This method replaces the default _uiSetVisible handler
     * Widget provides, by injecting itself before _uiSetVisible,
     * (using Plugins before method) and preventing the default
     * behavior.
     */
    _uiAnimSetVisible : function(val) {
        if (this.get(HOST).get(RENDERED)) {
            if (val) {
                this.get(ANIM_HIDE).stop();
                this.get(ANIM_SHOW).run();
            } else {
                this.get(ANIM_SHOW).stop();
                this.get(ANIM_HIDE).run();
            }
            return new Y.Do.Prevent();
        }
    },

    /**
     * The original Widget _uiSetVisible implementation
     */
    _uiSetVisible : function(val) {
        var host = this.get(HOST),
            hiddenClass = host.getClassName(HIDDEN);

        host.get(BOUNDING_BOX).toggleClass(hiddenClass, !val);
    },

    /**
     * Sets up call to invoke original visibility handling when the animShow animation is started
     */
    _bindAnimShow : function() {
        // Setup original visibility handling (for show) before starting to animate
        this.get(ANIM_SHOW).on(START, 
            Y.bind(function() {
                this._uiSetVisible(true);
            }, this));
    },

    /**
     * Sets up call to invoke original visibility handling when the animHide animation is complete
     */ 
    _bindAnimHide : function() {
        // Setup original visibility handling (for hide) after completing animation
        this.get(ANIM_HIDE).after(END, 
            Y.bind(function() {
                this._uiSetVisible(false);
            }, this));
    }
});

Y.namespace("Plugin").WidgetAnim = WidgetAnim;


}, '@VERSION@' ,{requires:['plugin', 'anim-base']});
