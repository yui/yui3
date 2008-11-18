<div id="overlay">
    <div class="yui-widget-hd">Overlay Header</div>
    <div class="yui-widget-bd">Overlay Body</div>
    <div class="yui-widget-ft">Overlay Footer</div>
</div>

<button type="button" id="show">Show</button>
<button type="button" id="hide">Hide</button>
<button type="button" id="unplug">Unplug</button>

<script type="text/javascript">
YUI(<?php echo getYUIConfig("filter:'raw'") ?>).use(<?php echo $requiredModules ?>, function(Y) {

    function AnimPlugin(config) {
        AnimPlugin.superclass.constructor.apply(this, arguments);
    }

    AnimPlugin.NS = "fx";
    AnimPlugin.NAME = "OverlayAnimPlugin";
    
    AnimPlugin.ATTRS = {
        duration : {
            value: 0.2
        },

        animVisible : {
            valueFn : function() {
                return new Y.Anim({
                    node: this._owner.get("boundingBox"),
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                    duration: this.get("duration")
                });
            }
        },

        animHidden : {
            valueFn : function() {
                return new Y.Anim({
                    node: this._owner.get("boundingBox"),
                    from: { opacity: 1 },
                    to: { opacity: 0 },
                    duration: this.get("duration")
                });
            }
        }
    }

    Y.extend(AnimPlugin, Y.Plugin, {

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
        },

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
        },

        _uiSetVisible : function(val) {
            var owner = this._owner;
            if (!val) {
                owner.get("boundingBox").addClass(owner.getClassName("hidden"));
            } else {
                owner.get("boundingBox").removeClass(owner.getClassName("hidden"));
            }
        }
    });

    var overlay = new Y.Overlay({
        contentBox: "#overlay",
        width:"10em",
        height:"10em",
        visible:false,
        align: {
            node: "#show", 
            points: ["tl", "bl"]
        },
        plugins : [{fn:AnimPlugin, cfg:{duration:1.5}}]
    });
    overlay.render();

    Y.on("click", function() {
        overlay.show();
    }, "#show");

    Y.on("click", function() {
        overlay.hide();
    }, "#hide");

    Y.on("click", function() {
        overlay.unplug("fx");
    }, "#unplug");

});
</script>
