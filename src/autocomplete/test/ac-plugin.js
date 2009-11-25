YUI.add('ac-plugin', function(Y) {

function ACPlugin () { ACPlugin.superclass.constructor.apply(this, arguments) };

Y.extend(
    (Y.Plugin.ACPlugin = Y.augment(ACPlugin, Y.EventTarget)),
    Y.Plugin.Base,
    { // prototype
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
        open : function () { this.fire("ac:show") },
        next : function (e) { e.preventDefault(); this.fire("ac:next") },
        previous : function (e) { e.preventDefault(); this.fire("ac:previous") },
        close : function () { this.fire("ac:hide") }
    },
    { // statics
        NAME : "ACPlugin",
        NS : "ac",
        ATTRS : {
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
                    // keep track of what it has been explicitly set to, so that we don't
                    // try to make a query repeatedly when the user hasn't done anything.
                    return (this._cachedValue = q);
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
            minQueryLength : {
                value : 3,
                validator : Y.Lang.isNumber
            },

            // convert a value into a request for the DS
            // Can be either a string containg "{query}" somewhere,
            // or a function that takes and returns a string.
            queryTemplate : {
                value : encodeURIComponent,
                setter : function (q) {
                    return (
                        Y.Lang.isFunction(q) ? q
                        : function (query) {
                            // exchange {query} with the query,
                            // but turn \{query} into {query}, if for some reason that
                            // string needs to appear in the URL.
                            return q
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

        } // end attrs
    } // end statics
);

// helpers below

function attachHandles (self, host) {
    return [
        // query on valueChange
        Y.on("valueChange", valueChangeHandler, host, self),
        // next/open on down
        Y.on("key", self.next, host, "down:40", self),
        // previous on up
        Y.on("key", self.previous, host, "down:38", self),
        // close on escape
        Y.on("key", self.close, host, "down:27", self)
    ];
};

function valueChangeHandler (e) {
    var value = e.value;
    if (!value) return this.close();
    if (value === this._cachedValue || value.length < this.get("minQueryLength")) return;
    this._cachedValue = value;
    this.fire( "ac:query", { value : e.value });
};

function browserACFixer (domnode) { return function () {
    if (domnode) domnode.setAttribute(autocomplete, "on");
    domnode = null;
}};

function manageBrowserAC (host) {
    // turn off the browser's autocomplete, but take note of it to turn
    // it back on later.
    var domnode = Y.Node.getDOMNode(host),
        autocomplete = "autocomplete",
        bac = domnode.getAttribute(autocomplete);

    // turn the autocomplete back on so back button works, but only
    // if the user hasn't disabled it in the first place.
    if ((bac && bac !== "off") || bac === null || bac === undefined) {
        var bacf = browserACFixer(domnode);
        // hook onto both.  Concession to browser craziness.
        Y.on("beforeunload", bacf, window);
        Y.on("unload", bacf, window);
    }

    // turn off the browser's autocomplete feature, since that'll interfere.
    domnode.setAttribute(autocomplete, "off");
};

function handleQueryResponse (e) {
    var res = (e && e.response && e.response.results) ? e.response.results : e;
    
    // if there is a result, and it's not an empty array
    if (res && !(res && ("length" in res) && res.length === 0)) this.fire("ac:load", {
        results : res,
        query : this.get("queryValue")
    });
};

var eventDefaultBehavior = {
    query : function (e) {
        var self = this,
            ds = self.get("dataSource"),
            query = e.value,
            handler = Y.bind(handleQueryResponse, self);
        var request = {
            request : self.get("queryTemplate")(query),
            callback : {
                success : handler,
                failure : handler
            }
        };
        // if we have a datasource, then make the request.
        if (ds) ds.sendRequest(request);
    }
};


}, '@VERSION@', {
    optional:["event-custom"],
    requires:['node', 'plugin', 'value-change', 'event-key']
});
