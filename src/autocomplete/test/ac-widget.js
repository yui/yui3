// just a default display widget for the autocomplete component
// this is the one you expect when you say "autocomplete"
YUI.add('ac-widget', function(Y) {

function regexpEscape (text) {
    return (""+text).replace(/([\/\.\*\+\?\|\(\)\[\]\{\}\\])/g, '\\$1');
}

function insertAfter (node, ref) {
    var p = ref.get("parentNode");
    p.insertBefore(node, ref);
    p.insertBefore(ref, node);
};

function bind (widget, ac) {
    if (!widget._handles) widget._handles = {};
    else unbind(widget);
    widget._bound = true;
    var h = widget._handles,
        cb = widget.get("contentBox"),
        ac = widget.get("ac");
    h.click = cb.delegate("click", widget.click, "li", widget);
    h.docclick = Y.on("click", widget.hide, document);
    h.acload = ac.on("ac:load", function (e) {
        widget
            .set("query", e.query)
            .set("data", e.results)
            .syncUI()
            .show();
    });
    h.onchange = ac.on("ac:query", function (e) {
        widget.set("query", e.value).syncUI();
    });
    h.acnext = ac.on("ac:next", widget.next, widget);
    h.acprevious = ac.on("ac:previous", widget.previous, widget);
    h.achide = ac.on("ac:hide", widget.hide, widget);
};
function unbind (widget) {
    for (var i in widget._handles) {
        widget._handles[i].detach();
        delete(widget._handles[i]);
    }
    widget._bound = false;
};

function ACWidget () { ACWidget.superclass.constructor.apply(this, arguments) };

Y.ACWidget = Y.extend(
    ACWidget,
    Y.Widget,
    { // prototype
        initializer : function () {
            this.after("queryChanged", this.syncUI, this);
            this.after("dataChanged", this.syncUI, this);
            this.hide();
        },
        renderUI : function () {
            var ac = this.get("ac");
            if (!ac) throw new Error(
                "Attempting to render ACWidget before it has been attached "+
                "to an ACPlugin of some sort."
            );
            var input = ac.get("host");
            insertAfter(this.get("boundingBox"), input);
            return this.setSize();
        },
        setSize : function () {            
            return this.set("width", this.get("ac").get("host").getComputedStyle("width"));
        },
        bindUI : function () {
            bind(this, this.get("ac"));
            return this;
        },
        syncUI : function () {
            var data = this.get("data"),
                query = this.get("query");
            if (!data) return this;
            this._selectedIndex = -1;
            this._originalValue = "";
            this.get("contentBox").set("innerHTML", this.getListMarkup(data));
            return this;
        },
        getListMarkup : function (data) {
            var listTemplate = this.get("listTpl"),
                markup = [],
                self = this;
            Y.Array.each(data, function (item) {
                markup.push(self.getItemMarkup(item));
            });
            return listTemplate.replace(/\{list\}/g, markup.join(""));
        },
        getItemMarkup : function (item) {
            return this.get("itemTpl")
                .replace(/\{term\}/g, item)
                .replace(/\{hilite\}/g, this.getHiliteMarkup(item));
        },
        getHiliteMarkup : function (item) {
            var queryTerms = this.get("query").split(/\s+/)
                out = item,
                self = this;
            Y.Array.each(queryTerms, function (term) {
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
            if (!this.get("visible")) {
                if (this.get("data")) this.show();
                return this;
            }
            return this.selectNext();
        },
        selectNext : function () {
            var si = this.get("selectedIndex");
            return this.set("selectedIndex", si + 1);
        },
        selectPrevious : function () {
            var si = this.get("selectedIndex");
            return this.set("selectedIndex", si - 1);
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
            var ac = this.get("ac"),
                val = e.currentTarget.get("text");
            ac.set("queryValue", val);
            this._selectedIndex = -1;
            this._currentValue = val;
            ac.get("host").focus();
            this.hide();
        }
    },
    { // statics
        NAME : "ACWidget",
        ATTRS : {
            ac : {
                setter : function (ac) {
                    if (!this._bound) return; // it'll get bound when it renders
                    bind(this, ac);
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
            hiliteTpl : { value : "<em>{term}</em>" },
            selectedIndex : {
                value : -1,
                validator : function (si) {
                    var d = this.get("data");
                    return d && Y.Lang.isNumber(si);
                },
                getter : function () { return this._selectedIndex },
                setter : function (si) {
                    var current = this.get("selectedIndex"),
                        d = this.get("data"),
                        l = d && d.length,
                        ac = this.get("ac"),
                        selClass = this.getClassName("selected");
                    if (isNaN(current)) current = -1;
                    if (!d || !l) return;
                    
                    // first normalize them both to a number between
                    // (-1)..(d.length - 1) where -1 means "what the user typed"
                    while (si < -1) si += l + 1;
                    si = (si + 1) % (l + 1) - 1;
                    current = (current + 1) % (l + 1) - 1;
                                        
                    // actually set it, the rest is just monkey business.
                    this._selectedIndex = si;
                    
                    // hang onto this, we'll need it later.
                    if (current === -1) {
                        this._originalValue = ac.get("queryValue");
                    }
                    
                    // nothing changing!
                    if (current === si) return;
                    
                    // undo the current one, but only if it's not -1
                    var curItem = this.get("contentBox").one("."+selClass);
                    if (curItem) curItem.removeClass(selClass);
                    
                    // handle the new thing
                    if (si === -1) {
                        // back to the start
                        ac.set("queryValue", this._originalValue);
                    } else {
                        var newItem = this.item(si);
                        if (newItem) {
                            newItem.addClass(selClass);
                        }
                        ac.set("queryValue", d[si]);
                    }
                    return si;
                }
            } // selectedIndex    
        } // ATTRS
    } // statics
);

}, '@VERSION', {
    requires : ['widget']
});
