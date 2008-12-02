<h3>Creating an IO Plugin For Overlay</h3>

<h4>Setting Up The YUI Instance</h4>

<p>For this example, we'll pull in <code>overlay</code>; the <code>io</code>, <code>json</code> and <code>substitute</code> utilities and the <code>plugin</code> module. <code>io</code> provides the XHR support we need for the IO plugin, and <code>json</code> and <code>substitute</code> provide the support we need to parse/transform JSON responses into HTML. The <code>Plugin</code> base class is the class we'll extend to create our io plugin class for <code>Overlay</code>. 
The code to set up our sandbox instance is shown below:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
YUI({...}).use("overlay", "substitute", "io", "json", "plugin", function(Y) {
    // We'll write our code here, after pulling in the default Overlay widget, the IO utility, the Plugin base class along with substitute and json
}
</textarea>

<p>Note, using the <code>overlay</code> module, will also pull down the default CSS required for overlay, on top of which we only need to add our required look/feel CSS for the example.</p>

<h4>StdModIOPlugin Class Structure</h4>

<p>The <code>StdModIOPlugin</code> class will extend the <code>Plugin</code> base class. Since <code>Plugin</code> derives from <code>Base</code>, we follow the same pattern we use for widgets and other utilities which extend Base to setup our new class.</p>

<p>Namely:</p>

<ul>
    <li>Setting up the constructor to invoke the superclass constructor</li>
    <li>Setting up a <code>NAME</code> property, to identify the class</li>
    <li>Setting up the default attributes, using the <code>ATTRS</code> property</li>
    <li>Providing prototype implementations for anything we want executed during initialization and destruction using the <code>initializer</code> and <code>destructor</code> lifecycle methods</li>
</ul>

<p>Additionally, since this is a Plugin, we provide a <code>NS</code> property for the class, which defines the property which will refer to the <code>StdModIOPlugin</code> instance on the host class (e.g. <code>overlay.io</code> will be an instance of <code>StdModIOPlugin</code>)</p>.

<textarea name="code" class="JScript" rows="1" cols="60">
    /* Standard Module IO Plugin Constructor */
    function StdModIOPlugin(config) {
        StdModIOPlugin.superclass.constructor.apply(this, arguments);
    }

    /* 
     * The namespace for the plugin. This will be the property on the widget, which will 
     * reference the plugin instance, when it's plugged in
     */
    StdModIOPlugin.NS = "io";

    /*
     * The NAME of the StdModIOPlugin class. Used to prefix events generated
     * by the plugin class.
     */
    StdModIOPlugin.NAME = "stdModIOPlugin";

    /*
     * The default set of attributes for the StdModIOPlugin class.
     */
    StdModIOPlugin.ATTRS = {
        uri : {...},
        cfg : {...},
        formatter : {...},
        section: {...},
        loading: {...}
    };

    /* Extend the base plugin class */
    Y.extend(StdModIOPlugin, Y.Plugin, {

        // Lifecycle methods.
        initializer: function() {...},

        // IO Plugin specific methods
        refresh : function() {...},

        // Default IO transaction handlers
        _defSuccessHandler : function(id, o) {...},
        _defFailureHandler : function(id, o) {...},
        _defStartHandler : function(id, o) {...},
        _defCompleteHandler : function(id, o) {...},
        _defFormatter : function(val) {...}
    });
</textarea>

<h4>Plugin Attributes</h4>

<p>The <code>StdModIOPlugin</code> is a fairly simple plugin class. It provides incremental functionality, and does not modify the behavior of any methods on the host Overlay instance (as the more complex <a href="overlay-anim-plugin.html">AnimPlugin</a> example does), and doesn't need to monitor any events on the host.</p>

<p>It sets up the following attributes, which are used to control how the io plugin's <code>refresh</code> method operates, when invoked:</p>

<dl>
    <dt>uri</dt>
    <dd>The uri to use for the io request</dd>
    <dt>cfg</dt>
    <dd>The io configuration object, to pass to io when intiating a transaction</dd>
    <dt>formatter</dt>
    <dd>The formatter to use to formatting response data. The default implementation simply passes back the response data passed in, unchanged.</dd>
    <dt>section</dt>
    <dd>The Standard Module section to which the io plugin instance is bound. Response data will be used to populate this section, after passing through the configured formatter.</dd>
    <dt>loading</dt>
    <dd>The default content to display while an io transaction is in progress</dd>
</dl>

<p>In terms of code, the attributes for the plugin are set up using the standard <code>ATTRS</code> property:</p>

<textarea name="code" class="JScript" rows="1" cols="60">

    StdModIOPlugin.ATTRS = {

        /*
         * The uri to use for the io request
         */
        uri : {
            value:null
        },

        /*
         * The io configuration object, to pass to io when intiating a transaction
         */
        cfg : {
            value:null
        },

        /*
         * The default formatter to use when formatting response data. The default
         * implementation simply passes back the response data passed in. 
         */
        formatter : {
            valueFn: function() {
                return this._defFormatter;
            }
        },

        /*
         * The Standard Module section to which the io plugin instance is bound.
         * Response data will be used to populate this section, after passing through
         * the configured formatter.
         */
        section: {
            value:StdMod.BODY,
            validator: function(val) {
                return (!val || val == StdMod.BODY || val == StdMod.HEADER || val == StdMod.FOOTER);
            }
        },

        /*
         * The default loading indicator to use, when an io transaction is in progress.
         */
        loading: {
            value: '<img class="yui-loading" width="32px" height="32px" src="<?php echo $assetsDirectory ?>img/ajax-loader.gif">'
        }
    };
</textarea>

<p>Note that the <code>formatter</code> attribute uses <code>valueFn</code> to define an instance based default value - pointing to the <code>_defFormatter</code> method on the <code>StdModIOPlugin</code> instance.</p>

<h4>Lifecycle Methods: initializer, destructor</h4>

<p>For the purposes of this example, the initializer for the plugin activates the flash based <a href="../../io/#xdr">XDR</a> transport so that the plugin is able to dispatch both in-domain and cross-domain requests (the transport used for any particular uri, is controlled through the plugin's <code>cfg</code> attribute.</p>

<p>The destructor terminates any existing transaction, if active when the plugin is destroyed (unplugged).</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    initializer: function() {
        Y.io.transport({
            id:'flash',
            yid: Y.id,
            src:'<?php echo $buildDirectory ?>io/IO.swf?stamp=' + (new Date()).getTime()
        });
    }

    /*
     * Destruction code. Terminates the activeIO transaction if it exists
     */
    destructor : function() {
        if (this._activeIO) {
            Y.io.abort(this._activeIO);
            this._activeIO = null;
        }
    },
</textarea>

<h4>The refresh Method</h4>

<p>The <code>refresh</code> method is the main public method which the plugin provides. It's responsible for dispatching the IO request, using the current state of the attributes used to configure the IO plugin. Users will end up invoking the method from the plugin instance attached to the Overlay (<code>overlay.io.refresh()</code>)</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    refresh : function() {
        section = this.get("section");

        if (section && !this._activeIO) {
            var uri = this.get("uri");

            if (uri) {

                cfg = this.get("cfg") || {};
                cfg.on = cfg.on || {};

                cfg.on.start = cfg.on.start || Y.bind(this._defStartHandler, this);
                cfg.on.complete = cfg.on.complete || Y.bind(this._defCompleteHandler, this);

                cfg.on.success = cfg.on.success || Y.bind(this._defSuccessHandler, this);
                cfg.on.failure = cfg.on.failure || Y.bind(this._defFailureHandler, this);

                cfg.method = cfg.method || "GET";

                Y.io(uri, cfg);
            }
        }
    }
</textarea>

<p>The <code>refresh</code> method, as implemented for the scope of this example, sets up the io configuration object for the transaction it is about to dispatch, filling in the default handlers for io's <code>start, complete, success, failure</code> if the user does not provide custom implementations.</p>

<h4>The Default IO Event Handlers</h4>

<p>The default success listener, pulls the responseData from the response object, and uses it to update the content in the currently set Overlay <code>section</code> (header, body, footer). The response data is passed through the <code>formatter</code> configured for the plugin, converting it to the desired output format:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    _defSuccessHandler : function(id, o) {
        var response = o.responseXML || o.responseText;
        var section = this.get("section");
        var formatter = this.get("formatter");

        // Invoke Overlay method to set content in the currently configured section
        this._owner.setStdModContent(section, formatter(response));
    }
</textarea>

<p>The default failure listener, displays an error message in the currently configured <code>section</code>, when io communication fails:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    _defFailureHandler : function(id, o) {
        this._owner.setStdModContent(this.get("section"), "Failed to retrieve content");
    }
</textarea>

<p>The default start event listener renders the <code>loading</code> content, which remains in place while the transaction is in process, and also stores a reference to the "inprogress" io transaction:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    _defStartHandler : function(id, o) {
        this._activeIO = o;
        this._owner.setStdModContent(this.get("section"), this.get("loading"));
    },
</textarea>

<p>The default complete event listener clears out the "inprogress" io transaction object:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    _defCompleteHandler : function(id, o) {
        this._activeIO = null;
    }
</textarea>

<h4>Using the Plugin</h4>

<p>All <a href="../../api/Widget.html">Widgets</a> are <a href="../../api/PluginHost.html">PluginHosts</a>. They provide <a href="../../api/PluginHost.html#method_plug"><code>plug</code></a> and <a href="../../api/PluginHost.html#method_unplug"><code>unplug</code></a> methods to allow users to add/remove plugins to/from existing instances. They also allow the user to specify the set of plugins to be applied to a new instance, along with their configurations, as part of the constructor arguments.</p>

<p>In this example, we'll create a new instance of an Overlay:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    /* Create a new Overlay instance, with content generated from script */
    var overlay = new Y.Overlay({
        width:"40em",
        visible:false,
        align: {
            node:"#show",
            points: [Y.WidgetPositionExt.TL, Y.WidgetPositionExt.BL]
        },
        zIndex:10,
        headerContent: generateHeaderMarkup(),
        bodyContent: "Feed data will be displayed here"
    });
</textarea>

<p>And then use the <code>plug</code> method to add the <code>StdModIOPlugin</code>, providing it with a configuration to use when sending out io transactions (The <a href="overlay-anim-plugin.html">Anim Plugin</a> example shows how you could do the same thing during construction):</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    /*
     * Add the Standard Module IO Plugin, and configure it to use flash, and a formatter specific
     * to the pipes response we're expecting from the uri request we'll send out.
     */
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
</textarea>

<p>For this example, the io plugin is configured to use the <code>flash</code>, cross-domain transport, to send out requests to the pipes API for the feed the user selects from the dropdown.</p>

<h4>Getting Feed Data Through Pipes</h4>

<p>We setup an object (<code>pipes</code>) to hold the feed URIs, which can be looked up and passed to the plugin to dispatch requests for new data:</p>

<textarea name="code" class="JScript" rows="1" cols="60">

/* The Pipes feed URIs to be used to dispatch io transactions */

var pipes = {
    baseUri : 'http:/'+'/pipes.yahooapis.com/pipes/pipe.run?_id=6b7b2c6a32f5a12e7259c36967052387&_render=json&url=http:/'+'/',
    feeds : {
        ynews : {
            title: 'Yahoo! US News',
            uri: 'rss.news.yahoo.com/rss/us'
        },
        yui : {
            title: 'YUI Blog',
            uri: 'feeds.yuiblog.com/YahooUserInterfaceBlog'
        },
        slashdot : {
            title: 'Slashdot',
            uri: 'rss.slashdot.org/Slashdot/slashdot'
        },
        ...
    },

    ...
</textarea>

<p>The data structure also holds the default formatter (<code>pipes.formatter</code>) required to convert the JSON responses from the above URIs, to HTML. The JSON utility is first used to parse the json response string, and the resulting object is iterated around, using Y.each, and substribute is used to generate the list markup:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    ...

    // The default formatter, responsible for converting the JSON responses recieved,
    // into HTML. JSON is used for the parsing step, and substitute for some basic 
    // templating functionality

    formatter : function (val) {
        var formatted = "Error parsing feed data";
        try {
            var json = Y.JSON.parse(val);
            if (json && json.count) {
                var html = ['<ul class="yui-feed-data">'];
                var linkTemplate = '<li><a href="{link}" target="_blank">{title}</a></li>';

                // Loop around all the items returned, and feed them into the template above,
                // using substitute.
                Y.each(json.value.items, function(v, i) {
                    if (i < 10) {
                        html.push(Y.substitute(linkTemplate, v));
                    }
                });
                html.push("</ul>");
                formatted = html.join("");
            } else {
                formatted = "No Data Available";
            }
        } catch(e) {
            formatted = "Error parsing feed data";
        }
        return formatted;
    }
</textarea>

<p>The <code>change</code> handler for the select dropdown, binds everything together, taking the currently selected feed, constructing the URI for the feed, setting it on the plugin, and sending out the request:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    /* Handle select change */
    Y.on("change", function(e) {
        var val = this.get("value");
        if (val != -1) {
            // Set the new URI value on the io plugin
            overlay.io.set("uri", pipes.baseUri + pipes.feeds[val].uri);

            // Send out a request to refresh the current section's contents
            overlay.io.refresh();
        }
    }, "#feedSelector");
</textarea>