<h3>Creating an Animation Plugin For Overlay</h3>

<h4>Setting Up The YUI Instance</h4>

<p>For this example, we'll pull in the <code>overlay</code> module, along with the <code>anim</code> and <code>plugin</code> modules. <code>anim</code> provides the animation utility, and <code>plugin</code> will provide
the <code>Plugin</code> base class, which we'll extend to create our <code>AnimPlugin</code> for <code>Overlay</code>. The code to set up our sandbox instance is shown below:</p>
 
<textarea name="code" class="JScript" rows="1" cols="60">
YUI({...}).use("overlay", "anim", "plugin", function(Y) {
    // We'll write our code here, after pulling in the default Overlay widget, the Animation utility and the Plugin base class
});
</textarea>

<p>Note, using the <code>overlay</code> module, will also pull down the default CSS required for overlay, on top of which we only need to add our required look/feel CSS for the example.</p>

<h4>AnimPlugin Class Structure</h4>

<p>The <code>AnimPlugin</code> class will extend the <code>Plugin</code> base class. Since <code>Plugin</code> derives from <code>Base</code>, we follow the same pattern we use for widgets and other utilities which extend Base to setup our new class.</p>

<p>Namely:</p>
    <ul>
        <li>Setting up the constructor to invoke the superclass constructor</li>
        <li>Setting up a <code>NAME</code> property, to identify the class</li>
        <li>Setting up the default attributes, using the <code>ATTRS</code> property</li>
        <li>Providing prototype implementations for anything we want executed during initialization and destruction using the <code>initializer</code> and <code>destructor</code> lifecycle methods</li>
    </ul>
    
<p>Additionally, since this is a Plugin, we provide a <code>NS</code> property for the class, which defines the property which will refer to the AnimPlugin instance on the host class (e.g. <code>overlay.fx</code> will be an instance of <code>AnimPlugin</code></p>.

<p>This basic structure is shown below:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    /* Animation Plugin Constructor */
    function AnimPlugin(config) {
        AnimPlugin.superclass.constructor.apply(this, arguments);
    }

    /* 
     * The namespace for the plugin. This will be the property on the widget, which will 
     * reference the plugin instance, when it's plugged in
     */
    AnimPlugin.NS = "fx";

    /*
     * The NAME of the AnimPlugin class. Used to prefix events generated
     * by the plugin class.
     */
    AnimPlugin.NAME = "animPlugin";

    /*
     * The default set of attributes for the AnimPlugin class.
     */
    AnimPlugin.ATTRS = {

        /*
         * Default duration. Used by the default animation implementations
         */
        duration : {
            value: 0.2
        },

        /*
         * Default animation instance used for showing the widget (opacity fade-in)
         */
        animVisible : {
            valueFn : function() {
                ...
            }
        },

        /*
         * Default animation instance used for hiding the widget (opacity fade-out)
         */
        animHidden : {
            valueFn : function() {
                ...
            }
        }
    }

    /*
     * Extend the base plugin class
     */
    Y.extend(AnimPlugin, Y.Plugin, {

        // Lifecycle methods
        initializer : function(config) { ... },
        destructor : function() { ... },

        // Other plugin specific methods
        _uiAnimSetVisible : function(val) { ... },
        _uiSetVisible : function(val) { ... },
        ...
    });
</textarea>

<h4>Attributes: animVisible, animHidden</h4>

<p>The <code>animVisible</code> and <code>animHidden</code> attributes use Attribute's <code>valueFn</code> support to setup instance based default values for the attributes.</p>

<p>animHidden is pretty straight forward, and simply returns the Animation instance, bound to the boundingBox of the Overlay to provide a fade-out animation:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    animHidden : {
        valueFn : function() {
            return new Y.Anim({
                node: this._owner.get("boundingBox"),
                to: { opacity: 0 },
                duration: this.get("duration")
            });
        }
    }
</textarea>

<p>animVisible is a little more interesting:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    animVisible : {
        valueFn : function() {

            var owner = this._owner,
                boundingBox = owner.get("boundingBox");

            var anim = new Y.Anim({
                node: boundingBox,
                to: { opacity: 1 },
                duration: this.get("duration")
            });

            // Set initial opacity, to avoid initial flicker
            if (!owner.get("visible")) {
                boundingBox.setStyle("opacity", 0);
            }

            // Clean up, on destroy. Where supported, remove
            // opacity set using style. Else make 100% opaque
            anim.on("destroy", function() {
                if (Y.UA.ie) {
                    this.get("node").setStyle("opacity", 1);
                } else {
                    this.get("node").setStyle("opacity", "");
                }
            });

            return anim;
        }
</textarea>

<p>It essentially does the same thing as <code>animHidden</code> - sets up an Animation instance, providing an opacity based fade-in animation. However it also sets up a listener which will attempt to cleanup the opacity state of the Overlay, when the plugin is unplugged from the Overlay.</p>

<h4>Lifecycle Methods: initializer, destructor</h4>

<p>In the initializer, we setup listeners on the animation instances (using <code>_bindAnimVisible, _bindAnimHidden</code>), which invoke the original visibility handling to make the Overlay visible before starting the "animVisible" animation and hide it after the "animHidden" animation is complete.</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    initializer : function(config) {
        this._bindAnimVisible();
        this._bindAnimHidden();

        this.on("animVisibleChange", this._bindAnimVisible);
        this.on("animHiddenChange", this._bindAnimHidden);

        // Override default _uiSetVisible method, with custom animated method
        this.before("_uiSetVisible", this._uiAnimSetVisible);
    }

    ...

    _bindAnimVisible : function() {
        var animVisible = this.get("animVisible");

        animVisible.on("start", Y.bind(function() {
            // Setup original visibility handling (for show) before starting to animate
            this._uiSetVisible(true);
        }, this));
    },

    _bindAnimHidden : function() {
        var animHidden = this.get("animHidden");

        animHidden.after("end", Y.bind(function() {
            // Setup original visibility handling (for hide) after completing animation
            this._uiSetVisible(false);
        }, this));
    }
</textarea>

<p>
However the key part of the <code>initializer</code> method is the call to <code>this.before("_uiSetVisible", this._uiAnimSetVisible)</code> <em>(line 9)</em>. Plugin's <code>before</code> and <code>after</code> methods, will let you setup both before/after event listeners, as well as inject code to be executed before or after a given method on the object which hosts the plugin (in this case the Overlay) is invoked.
For the animation plugin, we want to change how the Overlay updates it's UI in response to changes to the <code>visible</code> attribute. Instead of simply flipping visibility (through the application of the <code>yui-overlay-hidden</code> class), we want to fade the Overlay in/out. Therefore we inject (using YUI's aop infrastructure) our custom animation method, <code>_uiSetAnimVisible</code>, before the Overlay's <code>_uiSetVisible</code> is invoked.
</p>

<p>Using Plugin's before/after methods to setup any event listeners and method injection code on the host object (Overlay), ensures that the custom behavior is removed when the plugin is unplugged from the host, restoring it's original behavior.</p>

<p>The destructor simply calls destroy on the animation instances used, and lets them perform their own cleanup (as defined in the discussion on attributes):</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    destructor : function() {
        this.get("animVisible").destroy();
        this.get("animHidden").destroy();
    },
</textarea>

<h4>The Custom Animated Visibility Method</h4>

<p>The <code>_uiAnimSetVisible</code> method is the method we use to over-ride the default visiblity handling for the Overlay. Instead of simply adding or removing the <code>yui-overlay-hidden</code> class, it starts the appropriate animation depending on whether or not visible is being set to true or false:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    _uiAnimSetVisible : function(val) {
        if (this._owner.get("rendered")) {
            if (val) {
                this.get("animHidden").stop();
                this.get("animVisible").run();
            } else {
                this.get("animVisible").stop();
                this.get("animHidden").run();
            }
            return new Y.Do.Halt();
        }
    }
</textarea>

<p>Since this method is injected before default method which handles visibility changes for Overlay (<code>_uiSetVisibility</code>), we invoke <code>Y.Do.Halt()</code> to prevent the original method from being invoked, since we'd like to invoke it in response to the animation starting or completing. <code>Y.Do</code> is YUI's aop infrastructure and is used under the hood by Plugins <code>before</code> and <code>after</code> methods when injecting code</p>.

<h4>The Original Visibility Method</h4>

<p>The original visiblity handling for Overlay is replicated in the AnimPlugins <code>_uiSetVisible</code> method and is invoked before starting the animVisible animation and after completing the animHidden animation as described above.</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    _uiSetVisible : function(val) {
        var owner = this._owner;
        if (!val) {
            owner.get("boundingBox").addClass(owner.getClassName("hidden"));
        } else {
            owner.get("boundingBox").removeClass(owner.getClassName("hidden"));
        }
    }
</textarea>

<p><strong>NOTE:</strong> We're evaluating whether or not <code>Y.Do</code> may provide access to the original method for a future release, which would make this replicated code unneccessary.</p>

<h4>Using/Applying The AnimPlugin Class</h4>

<p>All <a href="../../api/Widget.html">Widgets</a> are <a href="../../api/PluginHost.html">PluginHosts</a>. They provide <code>plug</code> and <code>unplug</code> methods to allow users to add/remove plugins to/from existing instances. They also allow the user to specify the set of plugins to be applied to a new instance, along with their configurations, as part of the constructor arguments:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    var overlay = new Y.Overlay({
        contentBox: "#overlay",
        width:"10em",
        height:"10em",
        visible:false,
        shim:false,
        align: {
            node: "#show", 
            points: ["tl", "bl"]
        },
        plugins : [{fn:AnimPlugin, cfg:{duration:2}}]
    });
    overlay.render();
</textarea>

<p>We use the constructor support, to setup the <code>AnimPlugin</code> for the instance with a custom value for it's <code>duration</code> attribute as shown on line 11 above.</p>

<p><strong>NOTE:</strong> In the interests of keeping the example as simple as possible, we turn off shimming for the overlay. If we needed to enable shimming, In IE6, we'd need to remove the alpha opacity filter set on the shim while animating, to have IE animate the contents of the Overlay correctly.</p>

<p>The example also uses the <code>plug/unplug</code> methods, to add/remove the custom animation behavior after the instance is created:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    // Listener for the "Unplug AnimPlugin" button, removes the AnimPlugin from the overlay instance
    Y.on("click", function() {
        overlay.unplug("fx");
    }, "#unplug");

    // Listener for the "Plug AnimPlugin" button, removes the AnimPlugin from the overlay instance, 
    // and re-adds it with a new, shorter duration value.
    Y.on("click", function() {
        overlay.unplug("fx");
        overlay.plug({fn:AnimPlugin, cfg:{duration:0.5}});
    }, "#plug");
</textarea>