<h3>Creating an IO Plugin For Overlay</h3>

<p>TODO : Setting Up the Sandbox</p>

<textarea name="code" class="JScript" rows="1" cols="60">
YUI({...}).use("overlay", "substitute", "io", "json", "plugin", function(Y) {
    // We'll write our code here, after pulling in the default Overlay widget, the IO utility, the Plugin base class along with substitute and json
}
</textarea>

<p>TODO: Plugin Class Structure</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    // Plugin Constructor
    function StdModIOPlugin(config) {
        StdModIOPlugin.superclass.constructor.apply(this, arguments);
    }

    // Define the namespace the plugin will occupy on the host
    StdModIOPlugin.NS = "io";
    StdModIOPlugin.NAME = "stdModIOPlugin";

    // Define the default set of attributes for the plugin
    StdModIOPlugin.ATTRS = {
        uri : {
            value:null
        },

        cfg : {
            value:null
        },

        formatter : {
            valueFn: function() {
                return this._defFormatter;
            }
        },

        section: {
            value:StdMod.BODY,
            validator: function(val) {
                return (!val || val == StdMod.BODY || val == StdMod.HEADER || val == StdMod.FOOTER);
            }
        },

        loading: {
            value: '<img class="yui-loading" width="32px" height="32px" src="<?php echo $assetsDirectory?>img/ajax-loader.gif">'
        }
    };

    Y.extend(StdModIOPlugin, Y.Plugin, {

        // Define the methods for the Plugin, using initializer
        // to setup the initial state.

        initializer: function() { ... },
        refresh : function() { ... },

        _defSuccessHandler : function(id, o) { ... },
        _defFailureHandler : function(id, response) { ... },
        _defStartHandler : function(id, o) { ... },
        _defCompleteHandler : function(id, o) { ... },
        _defFormatter : function(val) { ... }
    });
</textarea>

<p>TODO: Initializer Description</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    initializer: function() {
        Y.io.transport({
            id:'flash',
            yid: Y.id,
            src:'<?php echo $buildDirectory ?>io/IO.swf?stamp=' + (new Date()).getTime()
        });
    }
</textarea>

<p>TODO: IO Dispatch/refresh method description</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    refresh : function() {
        section = this.get("section");

        if (section && !this._activeIO) {
            var uri = this.get("uri");

            if (uri) {

                cfg = this.get("cfg") || {};
                cfg.on = cfg.on || {};

                cfg.on.start = Y.bind(this._defStartHandler, this);
                cfg.on.complete = Y.bind(this._defCompleteHandler, this);

                cfg.on.success = cfg.on.success || Y.bind(this._defSuccessHandler, this);
                cfg.on.failure = cfg.on.failure || Y.bind(this._defFailureHandler, this);

                cfg.method = cfg.method || "GET";

                Y.io(uri, cfg);
            }
        }
    }
</textarea>

<p>TODO: Default IO event handlers</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    _defSuccessHandler : function(id, o) {
        var response = o.responseXML || o.responseText;
        var section = this.get("section");
        var formatter = this.get("formatter");

        this._owner.setStdModContent(section, formatter(response));
    },

    _defFailureHandler : function(id, response) {
        this._owner.setStdModContent(this.get("section"), "Failed to retrieve content");
    },

    _defStartHandler : function(id, o) {
        this._activeIO = o;
        this._owner.setStdModContent(this.get("section"), this.get("loading"));
    },

    _defCompleteHandler : function(id, o) {
        this._activeIO = null;
    },

    _defFormatter : function(val) {
        return val
    }
</textarea>


<p>TODO: Using the Plugin</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    var overlay = new Y.Overlay({
        width:"40em",
        visible:false,
        centered: true,
        headerContent: generateHeaderMarkup(),
        bodyContent: "Feed data will be displayed here"
    });

    overlay.plug({
        fn:StdModIOPlugin, 
        cfg:{
            uri : pipes.baseUri + pipes.feeds["ynews"].uri,
            cfg:{
                xdr: {
                    use:'flash'
                }
            },
            formatter: pipes.formatter
        }
    });
    overlay.render();
</textarea>