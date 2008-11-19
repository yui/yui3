<button type="button" id="show">Show Overlay</button>
<button type="button" id="hide">Hide Overlay</button>

<script type="text/javascript">
YUI(<?php echo getYUIConfig('filter:"raw"') ?>).use(<?php echo $requiredModules ?>, function(Y) {

    var StdMod = Y.WidgetStdMod;

    function StdModIOPlugin(config) {
        StdModIOPlugin.superclass.constructor.apply(this, arguments);
    }

    StdModIOPlugin.NS = "io";
    StdModIOPlugin.NAME = "stdModIOPlugin";

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
            value: '<img class="yui-loading" width="32px" height="32px" src="<?php echo $assetsDirectory ?>img/ajax-loader.gif">'
        }
    };

    Y.extend(StdModIOPlugin, Y.Plugin, {

        initializer: function() {
            Y.io.transport({
                id:'flash',
                yid: Y.id,
                src:'<?php echo $buildDirectory ?>io/IO.swf?stamp=' + (new Date()).getTime()
            });
        },

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
    });

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

    function generateHeaderMarkup() {
        var optTemplate = '<option value="{id}">{title}</option>',
            html = ['<select id="feedSelector" class="yui-feed-selector"><option value="-1" class="yui-prompt">Select a Feed...</option>'];

        Y.Object.each(pipes.feeds, function(v, k, o) {
            html.push(Y.substitute(optTemplate, {id:k, title:v.title}));
        });
        html.push('</select>');

        return html.join("");
    }

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
