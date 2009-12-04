YUI.add('ac-plugin', function(Y) {



var autocomplete = "autocomplete",
    YLang = Y.Lang,
    YArrayeach = Y.Array.each,
    eventDefaultBehavior = {
        query : function (e) {
            var self = this,
                ds = self.get("dataSource"),
                query = e.value,
                handler = Y.bind(handleQueryResponse, self);
            // if we have a datasource, then make the request.
            if (ds) ds.sendRequest({
                request : self.get("queryTemplate")(query),
                callback : {
                    success : handler,
                    failure : handler
                }
            });
        }
    };


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
            YArrayeach([
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
            YArrayeach(this.handles, function (h) { h.detach() });
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
                    return ds && YLang.isFunction(ds.sendRequest);
                }
            },

            // minimum number of chars before we'll query
            minQueryLength : {
                value : 3,
                validator : YLang.isNumber
            },

            // convert a value into a request for the DS
            // Can be either a string containg "{query}" somewhere,
            // or a function that takes and returns a string.
            queryTemplate : {
                value : encodeURIComponent,
                setter : function (q) {
                    return (
                        YLang.isFunction(q) ? q
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



}, '@VERSION@' ,{requires:['node', 'plugin', 'value-change', 'event-key'], optional:['event-custom']});
YUI.add('ac-widget', function(Y) {

// just a default display widget for the autocomplete component
// this is the one you expect when you say "autocomplete"

function ACWidget () { ACWidget.superclass.constructor.apply(this, arguments) };

var HANDLES = "_handles",
    selectedIndex = "selectedIndex",
    _selectedIndex = "_selectedIndex",
    _originalValue = "_originalValue",
    YArrayeach = Y.Array.each,
    queryValue = "queryValue";


Y.ACWidget = Y.extend(
    ACWidget,
    Y.Widget,
    { // prototype
        initializer : function () {
            var self = this;
            self.after("queryChanged", self.syncUI, self);
            self.after("dataChanged", self.syncUI, self);
            self.hide();
        },
        renderUI : function () {
            var ac = this.get("ac");
            if (!ac) {
                Y.log("Attach before attempting to render the widget", "error", "ac-widget");
                return;
            }
            var input = ac.get("host");
            insertAfter(this.get("boundingBox"), input);
            return this.setSize();
        },
        setSize : function () {            
            return this.set("width", this.get("ac").get("host").getComputedStyle("width"));
        },
        bindUI : function (ac) {
            var widget = this,
                cb = widget.get("contentBox"), //INHERITED
                ac = ac || widget.get("ac");
            if (widget[HANDLES]) {
                YArrayeach(widget[HANDLES], function (handle) { handle.detach() });
                widget[HANDLES] = 0; // small and falsey
            }
            if (ac) widget[HANDLES] = [
                cb.delegate("click", widget.click, "li", widget),
                Y.on("click", widget.hide, document), //INHERITED
                ac.on("ac:load", function (e) {
                    widget
                        .set("query", e.query)
                        .set("data", e.results)
                        .syncUI()
                        .show();
                }),
                ac.on("ac:query", function (e) {
                    widget.set("query", e.value).syncUI();
                }),
                ac.on("ac:next", widget.next, widget),
                ac.on("ac:previous", widget.previous, widget),
                ac.on("ac:hide", widget.hide, widget) //INHERITED
            ];
            return widget;
        },
        syncUI : function () {
            var self = this,
                data = self.get("data"),
                query = self.get("query");
            if (!data) return self;
            self[_selectedIndex] = -1;
            self[_originalValue] = "";
            self.get("contentBox").set("innerHTML", self.getListMarkup(data)); //INHERITED
            return self;
        },
        getListMarkup : function (data) {
            var self = this,
                listTemplate = self.get("listTpl"),
                markup = [];
            YArrayeach(data, function (item) {
                markup.push(self.getItemMarkup(item));
            });
            return listTemplate.replace(/\{list\}/g, markup.join(""));
        },
        getItemMarkup : function (item) {
            return this.get("itemTpl")
                .replace(/\{term\}/g, item)
                .replace(/\{hilite\}/g, this.getHiliteMarkup(item))
                // .replace(/<([^<>]*)<[^>]*>([^<>]*)>/g, '<$1$2>');
        },
        getHiliteMarkup : function (item) {
            var self = this,
                queryTerms = self.get("query").split(/\s+/)
                out = item;
            YArrayeach(queryTerms, function (term) {
                if (!term) return;
                term = regexpEscape(term);
                out = out.replace(
                    new RegExp(term, "g"),
                    self.get("hiliteTpl").replace(/\{term\}/g, term)
                );
            });
            return out;
        },
        next : function () {
            var self = this;
            if (self.get("visible")) return self.selectNext();
            if (self.get("data")) self.show();
            return self;
        },
        selectNext : function () {
            var si = this.get(selectedIndex);
            return this.set(selectedIndex, si + 1);
        },
        selectPrevious : function () {
            var si = this.get(selectedIndex);
            return this.set(selectedIndex, si - 1);
        },
        previous : function () {
            if (this.get("visible")) this.selectPrevious();
            return this;
        },
        item : function (n) {
            return this.get("contentBox")
                .one(this.get("itemSelector").replace(/\{n\}/g, regexpEscape(n + 1)));
        },
        click : function (e) {
            var self = this,
                ac = self.get("ac"),
                val = e.currentTarget.get("text");
            ac.set(queryValue, val);
            self[_selectedIndex] = -1;
            self._currentValue = val;
            ac.get("host").focus();
            self.hide();
        }
    },
    { // statics
        NAME : "ACWidget",
        ATTRS : {
            ac : {
                setter : function (ac) {
                    if (!this[HANDLES]) return; // it'll get bound when it renders
                    this.bindUI(ac);
                },
                validator : function (ac) {
                    // TODO: Add some testing here.
                    return true
                }
            },
            data : {
                validator : function (d) { return d && d.length > 0 }
            },
            query : { value : "" },
            listTpl : { value : "<ul>{list}</ul>" },
            itemTpl : { value : "<li>{hilite}</li>" },
            itemSelector : { value : "ul li:nth-child({n})" },
            hiliteTpl : { value : "<em>{term}</em>" }
        } // ATTRS
    } // statics
);
// don't define this one inline, so that we can compress the key
ACWidget.ATTRS[selectedIndex] = {
    value : -1,
    validator : function (si) {
        var d = this.get("data");
        return d && Y.Lang.isNumber(si);
    },
    getter : function () { return this[_selectedIndex] },
    setter : function (si) {
        var self = this,
            current = self.get(selectedIndex),
            d = self.get("data"),
            l = d && d.length,
            ac = self.get("ac"),
            selClass = this.getClassName("selected"); //INHERITED
        if (isNaN(current)) current = -1;
        if (!d || !l) return;
        
        // first normalize them both to a number between
        // (-1)..(d.length - 1) where -1 means "what the user typed"
        // this should probably be a function, rather than copy pasta.
        // but for this small a snippet of code, it's fewer bytes to just
        // copy, especially when gzip gets at it.
        while (si < -1) si += l + 1;
        si = (si + 1) % (l + 1) - 1;
        current = (current + 1) % (l + 1) - 1;
                            
        // actually set it, the rest is just monkey business.
        self[_selectedIndex] = si;
        
        // hang onto this, we'll need it later.
        if (current === -1) {
            self[_originalValue] = ac.get(queryValue);
        }
        
        // nothing changing!
        if (current === si) return;
        
        // undo the current one, but only if it's not -1
        var curItem = self.get("contentBox").one("."+selClass);
        if (curItem) curItem.removeClass(selClass);
        
        // handle the new thing
        if (si === -1) {
            // back to the start
            ac.set(queryValue, this[_originalValue]);
        } else {
            var newItem = self.item(si);
            if (newItem) newItem.addClass(selClass);
            ac.set(queryValue, d[si]);
        }
        return si;
    }
}; // selectedIndex

function regexpEscape (text) {
    return (""+text).replace(/([\/\.\*\+\?\|\(\)\[\]\{\}\\])/g, '\\$1');
}

function insertAfter (node, ref) {
    var p = ref.get("parentNode");
    p.insertBefore(node, ref);
    p.insertBefore(ref, node);
};



}, '@VERSION@' ,{requires:['widget','ac-plugin']});


YUI.add('autocomplete', function(Y){}, '@VERSION@' ,{use:['ac-plugin']});

