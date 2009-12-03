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
