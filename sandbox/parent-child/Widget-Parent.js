//  TO DO
//  -   Complete selection
//  -   _items initialization
//  -   investigate using Attribute as the data store over a private

//  Naming:
//  base-ancestry
//    - Y.Parent
//    - Y.Child
//  widget-ancestory
//    - Y.WidgetParent
//    - Y.WidgetChild


var Lang = Y.Lang;


function Parent(config) {

    Y.each(["itemAdded", "itemRemoved"], function (v) {

        this.publish(v, {
            emitFacade: true,
            bubbles: true,
            preventable: false,
            queuable: false
        });
        
    }, this);


    var items = this._items;
    
    if (!items) {
        this._items = [];
    }

}

Parent.ATTRS = {

    defaultItemType: {
        validator: Lang.isString        
    },

    items: {
        validator: Lang.isArray,
        writeOnce: true,
        setter: function (value) {
            return this.add(value);
        },
        getter: function () {
            return this._items;
        },
        lazyAdd: false
    },

    activeItem: {    
        readOnly: true
    },

    multiple: {
        value: false,
        validator: Lang.isBoolean,
        writeOnce: true        
    },

    selection: {
       readOnly: true
    }

};

Parent.prototype = {

    _items: null,

    _selectedChange: function (event) {

        var selection;

        alert(this + " : " + this.get("parent"));

        if (this.get("root").get("multiple")) {

            Y.log("Using multiple");

            selection = [];

            Y.each(this._items, function (v) {

               if (v.get("selected") > 0) {
                   selection.push(v);
               }

            });


            if (selection.length === this._items.length) {
                //  Different indicator for fully selected?
                this.set("selected", 1);
            }
            else {
                //  partially selected
                this.set("selected", 2);
            }

            Y.log("Parent selected state is: " + this.get("selected"));

        }
        else {

            if (event.newVal > 0) {
                selection = event.target;
            }

        }

        this._set("selection", selection);
            
    },

    _onFocusedChange: function (event) {

        var val = null;
        
        if (event.newVal === true) {
            val = event.target;
        }

        this._set("activeItem", val);

    },

    _createItem: function (item) {

        var sType,
            fn;

        if (!(item instanceof Y.Widget)) {
            
            if (item.type) {
                sType = item.type;
                delete item[sType];
            }
            else {
                sType = this.get("defaultItemType");
            }

            fn = Y[sType];

            if (fn) {
                item = new fn(item);
            }

        }

        return item;
        
    },

    add: function (item, index) {   

        var aItems,
            oItem,
            returnVal;


        if (Lang.isArray(item)) {

            aItems = [];

            Y.each(item, function (v) {

                oItem = this.add(v);

                if (oItem) {
                    aItems.push(oItem);
                }
                
            }, this);
            

            if (aItems.length > 0) {
                returnVal = aItems;
            }

        }
        else {

            oItem = this._createItem(item);

            if (oItem instanceof Y.Widget) {

                aItems = this._items;
                
                if (!aItems) {
                    aItems = [];
                    this._items = aItems;
                }

                if (Lang.isNumber(index)) {
                    aItems.splice(index, 0, oItem);
                }
                else {
                    aItems.push(oItem);
                }

                oItem._set("parent", this);

                oItem.after("selectedChange", Y.bind(this._selectedChange, this));
                oItem.after("focusedChange", Y.bind(this._onFocusedChange, this));

                oItem.addTarget(this);
                this.fire("itemAdded", oItem);
                
                returnVal = oItem;

            }

        }

        return returnVal;

    },

    remove: function (index) {

        var items = this._items,
            item,
            parent;

        if (items) {

            if (Lang.isNumber(index)) {

                item = this._items.splice(index, 1);

                if (item) {

                    item.removeTarget(this);
                    item._set("parent", null);

                    this.fire("itemRemoved", item);

                }

            }
            else {

                parent = this.get("parent");

                if (parent) {
                    parent.remove(this.get("index"));
                }

            }
                        
        }
        
        return item;

    },
    
    removeAll: function () {

        var items = this._items,
            aRemoved = [],
            item;

        if (items) {

            Y.each(items, function (v, k) {

                item = this.remove(k);

                if (item) {
                    aRemoved.push();                
                }

            });            

        }

        return (aRemoved.length > 0 ? aRemoved : null);

    },

    item: function (index) {
        
        var items = this._items;
        
        return items ? items[index] : null;
        
    },
    
    renderUI: function () {
              
        var content = this.get("contentBox"),
            items = this._items;
        
        if (items) {
            for (var i = 0; i < items.length; i++) {            
                items[i].render(content);
            }            
        }
        
    }

};

Y.WidgetParent = Parent;