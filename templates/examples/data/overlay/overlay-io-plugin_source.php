<button type="button" id="show">Show Overlay</button>
<button type="button" id="hide">Hide Overlay</button>

<script type="text/javascript">
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>, function(Y) {

    var StdMod = Y.WidgetStdMod;

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

    /* Extend the base plugin class */
    Y.extend(StdModIOPlugin, Y.Plugin, {

        /*
         * Initialization code. Called when the 
         * plugin is instantiated (whenever it's 
         * plugged into the host)
         */
        initializer: function(config) {
            Y.io.transport({
                id:'flash',
                yid: Y.id,
                src:'<?php echo $buildDirectory ?>io/io.swf?stamp=' + (new Date()).getTime()
            });
        },

        /*
         * Destruction code. Terminates the activeIO transaction if it exists
         */
        destructor : function() {
            if (this._activeIO) {
                Y.io.abort(this._activeIO);
                this._activeIO = null;
            }
        },

        /*
         * IO Plugin specific method, use to initiate a new io request using the current
         * io configuration settings.
         */
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
        },

        /*
         * The default io transaction success handler
         */
        _defSuccessHandler : function(id, o) {
            var response = o.responseXML || o.responseText;
            var section = this.get("section");
            var formatter = this.get("formatter");

            this._owner.setStdModContent(section, formatter(response));
        },

        /*
         * The default io transaction failure handler
         */
        _defFailureHandler : function(id, o) {
            this._owner.setStdModContent(this.get("section"), "Failed to retrieve content");
        },

        /*
         * The default io transaction start handler
         */
        _defStartHandler : function(id, o) {
            this._activeIO = o;
            this._owner.setStdModContent(this.get("section"), this.get("loading"));
        },

        /*
         * The default io transaction complete handler
         */
        _defCompleteHandler : function(id, o) {
            this._activeIO = null;
        },

        /*
         * The default response formatter
         */
        _defFormatter : function(val) {
            return val
        }
    });

    /* The Pipes feed URIs to be used to dispatch io transactions */
    var pipes = {

        // uri data
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
            ajaxian: {
                title: 'Ajaxian',
                uri: 'feeds.feedburner.com/ajaxian'
            },
            daringfireball: {
                title: 'Daring Fireball',
                uri: 'daringfireball.net/index.xml'
            },
            wiredtech: {
                title: 'Wire: Tech Biz',
                uri: 'www.wired.com/rss/techbiz.xml'
            },
            techcrunch: {
                title: 'TechCrunch',
                uri: 'feedproxy.google.com/Techcrunch'
            }
        },

        // The default formatter, responsible for converting the JSON responses recieved,
        // into HTML, using JSON for the parsing step, and substitute for some basic templating functionality
        formatter : function (val) {
            var formatted = "Error parsing feed data";
            try {
                var json = Y.JSON.parse(val);
                if (json && json.count) {
                    var html = ['<ul class="yui-feed-data">'];
                    var linkTemplate = '<li><a href="{link}" target="_blank">{title}</a></li>';
    
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
    };

    /* Helper function, to generate the select dropdown markup from the pipes feed data */
    function generateHeaderMarkup() {
        var optTemplate = '<option value="{id}">{title}</option>',
            html = ['<select id="feedSelector" class="yui-feed-selector"><option value="-1" class="yui-prompt">Select a Feed...</option>'];

        Y.Object.each(pipes.feeds, function(v, k, o) {
            html.push(Y.substitute(optTemplate, {id:k, title:v.title}));
        });
        html.push('</select>');

        return html.join("");
    }

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
    overlay.render();

    Y.on("change", function(e) {
        var val = this.get("value");
        if (val != -1) {
            overlay.io.set("uri", pipes.baseUri + pipes.feeds[val].uri);
            overlay.io.refresh();
        }
    }, "#feedSelector");

    Y.on("click", function(e) {
        overlay.show();
    }, "#show");

    Y.on("click", function(e) {
        overlay.hide();
    }, "#hide");

});
</script>
