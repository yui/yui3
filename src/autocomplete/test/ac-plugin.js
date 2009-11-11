YUI.add('ac-plugin', function(Y) {

var paused = "paused";

function ACPlugin () {
    ACPlugin.superclass.constructor.apply(this, arguments);
};
Y.namespace("Plugin").ACPlugin = ACPlugin;
Y.augment(ACPlugin, Y.EventTarget);
ACPlugin.NAME = "ACPlugin";
ACPlugin.NS = "ac";

function attachHandles (self, host) {
    return [
        Y.on("valueChange", self.open, host, self),
        Y.on("key", self.next, host, "down:13,10,40", self),
        Y.on("key", self.previous, host, "down:38", self),
        Y.on("key", self.close, host, "down:27", self)
    ];
};
function manageBrowserAC (host) {
    // turn off the browser's autocomplete, but take note of it to turn
    // it back on later.
    var domnode = Y.Node.getDOMNode(host),
        autocomplete = "autocomplete",
        bac = domnode.getAttribute(autocomplete);
    
    // turn the autocomplete back on so back button works, but only
    // if the user hasn't disabled it in the first place.
    if ((bac && bac !== "off") || bac === null || bac === undefined) {
        // define the function with var, and at this point, so that it
        // won't be pushed to top of scope and capture the domnode unnecessarily.
        var browserACFixer = function () {
            if (domnode) domnode.setAttribute(autocomplete, "on");
            domnode = null;
        };
        // hook onto both.  Concession to browser craziness.
        Y.on("beforeunload", browserACFixer, window);
        Y.on("unload", browserACFixer, window);
    }
    
    // turn off the browser's autocomplete feature, since that'll interfere.
    domnode.setAttribute(autocomplete, "off");
};

// support events.
Y.augment(ACPlugin, Y.EventTarget);

function handleQueryResponse (e) {
    // console.log("firing load");
    this.fire("ac:load", {
        results : (e && e.response && e.response.results) ? e.response.results : e
    });
};

var eventDefaultBehavior = {
    query : function (e) {
        // console.log("query default");
        var self = this,
            ds = self.get("dataSource"),
            query = e.value,
            handler = Y.bind(handleQueryResponse, self);
        
        // if we have a datasource, then make the request.
        if (ds) ds.sendRequest(self.get("queryTemplate")(query), {
            success : handler,
            failure : handler
        });
    },
    next : function (e) { this.open() }
};

Y.extend(ACPlugin, Y.Plugin.Base, {
    initializer : function () {
        var self = this,
            host = self.get("host");
        self.handles = attachHandles(self, host);
        
        // publish events:
        // keep it simple
        // "query" for when value changes.
        // "load" for when data returns.
        // "show" for when it's time to show something
        // "hide" for when it's time to hide
        var defaults = eventDefaultBehavior;
        Y.Array.each([
            "query",
            "load",
            "show",
            "hide",
            "next",
            "previous"
        ], function (ev) { self.publish("ac:"+ev, {
            broadcast : 1,
            bubbles : 1,
            context : self,
            preventable : true,
            defaultFn : defaults[ev] || null,
            prefix : "ac"
        }) }, self);
        
        // manage the browser's autocomplete, since that'll interefere,
        // but we need to make sure that we don't prevent pre-filling 
        // when the user navs back to the page, unless the developer has
        // specifically disabled that feature in the markup.
        manageBrowserAC(host);
    },
    destructor : function () {
        Y.Array.each(this.handles, function (h) { h.detach() });
    },
    open : function (force) {
        var self = this;
        if (!force && self[paused]) return;
        var value = self.get("queryValue");
        if (value.length > self.get("minQueryLength")) {
            self.fire("ac:query", { value : value });
        } else {
            self.fire("ac:hide");
        }
    },
    next : function () {
        self.fire("ac:next");
    },
    previous : function () {
        self.fire("ac:previous");
    },
    close : function (force) {
        if (!force && this[paused]) return;
        this.fire("ac:hide");
    },
    
    // expose play/pause functionality so that the display can avoid making requests while a user
    // interaction event is occurring
    pause : function () { this[paused] = true },
    play : function () { this[paused] = false }
});

ACPlugin.ATTRS = {
    queryValue : {
        // override these in the other AC modules as necessary.
        // for instance, the delimited getter could get the cursor location,
        // split on the delimiter, and then return the selected one.
        // the inline-replacing setter could set-and-select the rest of the word.
        getter : function () {
            return this.get("host").get("value");
        },
        setter : function (q) {
            this.get("host").set("value", q);
            return q;
        }
    },
    
    // data source object
    dataSource : {
        validator : function (ds) {
            // quack.
            return ds && Y.Lang.isFunction(ds.sendRequest);
        }
    },
    
    // minimum number of chars before we'll query
    minQueryLength : { value : 3 },
    
    // convert a value into a request for the DS
    // Can be either a string containg "{query}" somewhere,
    // or a function that takes and returns a string.
    queryTemplate : {
        value : encodeURIComponent,
        setter : function (q) {
            return (
                Y.Lang.isFunction(q) ? q
                : function (query) {
                    return query
                        .replace(
                            /(^|[^\\])((\\{2})*)\{query\}/,
                            '$1$2'+encodeURIComponent(query)
                        ).replace(
                            /(^|[^\\])((\\{2})*)\\(\{query\})/,
                            '$1$2$4'
                        );
                }
            );
        }
    }
    
};


}, '@VERSION@' ,{requires:['node', 'plugin', 'value-change', 'event-key', 'event-custom']});
