<h3>Creating an Animation Plugin For Overlay</h3>

<p>TODO: Setting up the Sandbox</p>

<textarea name="code" class="JScript" rows="1" cols="60">
YUI({...}).use("overlay", "anim", "plugin", function(Y) {
    // We'll write our code here, after pulling in the default Overlay width, the Animation utility and the Plugin base class
});
</textarea>

<p>TODO: Basic Class Structure</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    // Animation Plugin Class
    function AnimPlugin(config) {
        AnimPlugin.superclass.constructor.apply(this, arguments);
    }

    // Define the namespace the plugin will occupy on the host
    AnimPlugin.NS = "fx";
    AnimPlugin.NAME = "OverlayAnimPlugin";

    // Define the default set of attributes for the plugin
    AnimPlugin.ATTRS = {
        duration : {
            value: 0.2
        },

        animVisible : {
            valueFn : function() {
                return new Y.Anim({ 
                    node: this._owner.get("boundingBox"),
                    ...
                });
            }
        },

        animHidden : {
            valueFn : function() {
                return new Y.Anim({
                    node: this._owner.get("boundingBox"),
                    ... 
                });
            }
        }
    }

    // Define the methods for the Plugin, using initializer
    // to setup the initial state.
    Y.extend(AnimPlugin, Y.Plugin, {
        initializer : function(config) { ... },

        _uiAnimSetVisible : function(val) { ... },

        _uiSetVisible : function(val) { ... }
    });
</textarea>

<p>TODO: Initializer Description</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    initializer : function(config) {

        var animHidden = this.get("animHidden");
        var animVisible = this.get("animVisible");

        animVisible.on("start", Y.bind(function() {
            this._uiSetVisible(true);
        }, this));

        animHidden.after("end", Y.bind(function() {
            this._uiSetVisible(false);
        }, this));

        this.before("_uiSetVisible", this._uiAnimSetVisible);
    }
</textarea>

<p>TODO: Custom Animated Visibility Handler Description</p>

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

<p>TODO: Original Visibility Handler Description</p>

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