/**
Loads different versions of YUI in sandboxed iframes and makes them available
for use in the parent frame by exposing them as properties on a `Y.Multi`
instance.

The included `sandbox.html` file must be present at a URL with the same origin
as the current page, or the universe will explode. 

This is primarily intended to be used for testing. You probably shouldn't use it
for anything real.

@example
Load YUI 3.2.0 and make it available as `multi.YUI_320`. Load YUI 3.3.0 and
make it available as `multi.YUI_330`.

    var multi = new Y.Multi({
        sandbox: 'path/to/sandbox.html',
        seeds: {
            YUI_320: 'http://yui.yahooapis.com/3.2.0/build/yui/yui-min.js',
            YUI_330: 'http://yui.yahooapis.com/3.3.0/build/yui/yui-min.js'
        }
    });

    multi.on('ready', function () {
        multi.YUI_320().use(function (Y) {
            Y.log("OMG I'm using YUI 3.2.0!");
        });

        multi.YUI_330().use(function (Y) {
            Y.log("OMG I'm using YUI 3.3.0!");
        });
    });

@example
Load YUI 3.2.0 and 3.3.0, and instantiate both of them before firing the `ready`
event. The YUI instances, complete with `use()`ed modules attached, will be made
available on the `multi` instance.

    var multi = new Y.Multi({
        sandbox: 'path/to/sandbox.html',
        seeds: {
            Y_320: {
                url: 'http://yui.yahooapis.com/3.2.0/build/yui/yui-min.js',
                use: ['node']
            },

            Y_330: {
                url: 'http://yui.yahooapis.com/3.3.0/build/yui/yui-min.js',
                use: ['node']
            }
        }
    });

    multi.on('ready', function () {
        multi.Y_320.log("OMG I'm using YUI 3.2.0!");
        multi.Y_330.log("OMG I'm using YUI 3.3.0!");
    });

@module multi
@class Multi
@param {Object} config Config object.
  @param {Object} config.seeds Mapping of seed names to either URLs or config
    objects.
  @param {String} [config.sandbox='sandbox.html'] URL of the MultiYUI
    `sandbox.html` file. Must be served from the same origin as the current
    page, or the universe will explode.
@constructor
**/

YUI.add('multi', function (Y) {

var doc = Y.config.doc;

function Multi(config) {
    this._config = Y.merge({
        sandbox: 'sandbox.html',
        seeds  : {}
    }, config);

    this._iframes     = [];
    this._seedCount   = Y.Object.size(this._config.seeds);
    this._seedsLoaded = 0;

    /**
    Fired when all requested seed files have been loaded (and instantiated, if
    instantiation was requested). Subscribe to this event in order to be
    notified when you can start using the requested YUI versions.

    @event ready
    @fireOnce
    **/
    this.publish('ready', {fireOnce: true});

    Y.Object.each(this._config.seeds, this._createFrame, this);
}

Multi.prototype = {
    _createFrame: function (seed, name) {
        var iframe = doc.createElement('iframe'),
            self   = this,
            url    = seed.url || seed,
            use    = seed.use;

        this._iframes.push(iframe);

        iframe.src = this._config.sandbox;
        iframe.style.display = 'none';

        iframe.onload = function () {
            // Load the YUI seed URL into the iframe.
            iframe.contentWindow.LazyLoad.js(url, function () {
                // If a "use" array was passed, create a YUI instance before
                // indicating completion. Otherwise, just attach the YUI global.
                if (use) {
                    self[name] = iframe.contentWindow.YUI().use(use, function () {
                        self._seedLoaded();
                    });
                } else {
                    self[name] = iframe.contentWindow.YUI;
                    self._seedLoaded();
                }
            });
        };

        doc.body.insertBefore(iframe, doc.body.firstChild);
    },

    _seedLoaded: function () {
        this._seedsLoaded += 1;

        if (this._seedsLoaded === this._seedCount) {
            this.fire('ready');
        }
    }
};

Y.augment(Multi, Y.EventTarget);

Y.Multi = Multi;

}, '3.3.0', {requires: ['event-custom']});
