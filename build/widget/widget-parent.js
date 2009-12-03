YUI.add('widget-parent', function(Y) {

//  TO DO
//  -   Ask Adam about "queuable" configuration for events
//  -   Confirm implementation of the "items" Attribute.  Goals were/are:
//      1.  Provide convience of being able to set once via the constructor only
//      2.  Disallow setting via "set"
//      3.  Provide get access through standard "get()"
//  -   Talk to Adam about being able to listen for "selectedChange" and 
//      and "focusedChange" at the parent level
//  -   Future performance optimization, if add() is passed a config, 
//      defer the instance creation until the instance is needed 


/**
 * Provides an extension enabling a Widget to be a parent of another Widget.
 *
 * @module widget-parent
 */

var Lang = Y.Lang;

/**
 * Widget extension providing functionality enabling a Widget to be a 
 * parent of another Widget.
 *
 * @class WidgetParent
 * @param {Object} config User configuration object.
 */
function Parent() {
}

Parent.ATTRS = {

    /**
     * @attribute defaultItemType
     * @type String
     *
     * @description String representing the default type of the children 
     * managed by this Widget.
     */
    defaultItemType: {
        validator: Lang.isString        
    },


    /**
     * @attribute activeItem
     * @type Widget
     * @readOnly
     *
     * @description Returns the Widget's currently focused descendant Widget.
     */
    activeItem: {    
        readOnly: true
    },


    /**
     * @attribute multiple
     * @type Boolean
     * @default false
     * @writeOnce 
     *
     * @description Boolean indicating if multiple children can be selected at 
     * once.
     */
    multiple: {
        value: false,
        validator: Lang.isBoolean,
        writeOnce: true        
    },


    /**
     * @attribute selection
     * @type {Array|Widget}
     * @readOnly  
     *
     * @description Returns the currently selected child Widget.  If the 
     * <code>mulitple</code> attribte is set to <code>true</code> will 
     * return an array of the currently selected children.  If no children 
     * are selection, will return null.
     */
    selection: {
        readOnly: true,
        setter: function (val) {
            return this._setSelection(val);
        }
    },
    
    
    /**
     * @attribute items
     * @type Array
     * @readOnly  
     *
     * @description Returns an array of all of the children that are 
     * direct descendants.
     */
    items: {
       readOnly: true,
       valueFn: function () {
           return [];
       }
    }

};

Parent.prototype = {

    /**
     * Attribute change listener for the <code>selection</code> 
     * attribute, responsible for setting the value of the 
     * parent's <code>selected</code> attribute.
     *
     * @method _afterSelectionChange
     * @protected
     * @param {EventFacade} event The event facade for the attribute change.
     */
    _afterSelectionChange: function (event) {
        
        var prevSelection = event.prevVal,
            selection = event.newVal;

        if (selection) {

            if (Lang.isArray(selection)) {

                if (selection.length === this.get("items").length) {
                    this.set("selected", 1, { src: this });
                }
                else {
                    this.set("selected", 2, { src: this });
                }

            }
            else {

                if (prevSelection) {
                    //  Set src equal to the current context to prevent
                    //  unnecessary re-calculation of the selection.
                    prevSelection.set("selected", 0, { src: this });
                }

            }
            
        }
        
    },


    /**
     * Attribute change listener for the <code>selected</code> 
     * attribute.
     *
     * @method _afterParentSelectedChange
     * @protected
     * @param {EventFacade} event The event facade for the attribute change.
     */
    _afterParentSelectedChange: function (event) {

        var value = event.newVal,
            items = this.get("items");

        if (event.src != this && this == event.target && items.length > 0 && 
            (value === 0 || value === 1)) {

            Y.each(items, function (item) {
                item.set("selected", value);
            });
            
        }
        
    },


    /**
     * Default setter for <code>selection</code> attribute changes.
     *
     * @method _setSelection
     * @protected
     * @param {Array|Widget} zIndex
     * @return {Widget} 
     */
    _setSelection: function (item) {

        var selection = null,
            items = this.get("items");

        if (this.get("root").get("multiple") && items.length > 0) {

            selection = [];
            
            Y.each(items, function (v) {
            
               if (v.get("selected") > 0) {
                   selection.push(v);
               }
            
            });

        }
        else {

            if (item.get("selected") > 0) {
                selection = item;
            }

        }
        
        return selection;
            
    },


    /**
     * Attribute change listener for the <code>selected</code> 
     * attribute of child Widgets, responsible for setting the value of the 
     * parent's <code>selection</code> attribute.
     *
     * @method _afterItemSelectedChange
     * @protected
     * @param {EventFacade} event The event facade for the attribute change.
     */
    _afterItemSelectedChange: function (event) {

        if (event.src != this) {
            this._set("selection", event.target);
        }

    },


    /**
     * Attribute change listener for the <code>focused</code> 
     * attribute of child Widgets, responsible for setting the value of the 
     * parent's <code>activeItem</code> attribute.
     *
     * @method _afterSelectedChange
     * @protected
     * @param {EventFacade} event The event facade for the attribute change.
     */
    _afterItemFocusedChange: function (event) {

        var val = null;
        
        if (event.newVal === true) {
            val = event.target;
        }

        this._set("activeItem", val);

    },


    /**
     * Creates an instance of a child Widget using the specified configuration.
     * By default Widget instances will be created of the type specified 
     * by the <code>defaultItemType</code> attribute.  Types can be explicitly
     * defined via the <code>type</code> property of the configuration object
     * literal.
     *
     * @method _createItem
     * @protected
     * @param config {Object} Object literal representing the configuration 
     * used to create an instance of a Widget.
     */
    _createItem: function (config) {

        var item,
            sType,
            fnConstructor;
            
        if (config.type) {
            sType = config.type;
            delete config[sType];
        }
        else {
            sType = this.get("defaultItemType");
        }

        fnConstructor = Y[sType];

        if (fnConstructor) {
            item = new fnConstructor(config);
        }

        return item;
        
    },


    /**
     * Default itemAdded handler
     *
     * @method _defItemAdded
     * @protected
     * @param event {EventFacade} The Event object
     * @param item {Widget} The Widget instance, or configuration 
     * object for the Widget to be added as a child.
     * @param index {Number} Number representing the position at 
     * which the child will be inserted.
     */
    _defItemAdded: function (event) {

        var item = event.item,
            index = event.index,
            aItems = this.get("items");
        

        if (item.get("parent")) {
            item.remove();
        }


        if (Lang.isNumber(index)) {
            aItems.splice(index, 0, item);
        }
        else {
            aItems.push(item);
        }


        this._set("items", aItems);
        item._set("parent", this);
        item.addTarget(this);


        if (item.get("selected")) {
            this._set("selection", item);
        }

        item.after("selectedChange", Y.bind(this._afterItemSelectedChange, this));
        item.after("focusedChange", Y.bind(this._afterItemFocusedChange, this));
        
    },


    /**
     * Default itemRemoved handler
     *
     * @method _defItemRemoved
     * @protected
     * @param event {EventFacade} The Event object
     * @param item {Widget} The Widget instance to be removed.
     * @param index {Number} Number representing the index of the Widget to 
     * be removed.
     */    
    _defItemRemoved: function (event) {

        var item = event.item,
            index = event.index,
            items = this.get("items");

        if (item.get("focused")) {
            item.set("focused", false);
        }

        if (item.get("selected")) {
            item.set("selected", 0);
        }

        items.splice(index, 1);
        this._set("items", items);

        item.removeTarget(this);
        item._set("parent", null);
        
    },


	/**
	* @method add
    * @param item {Widget|Object} The Widget instance, or configuration 
    * object for the Widget to be added as a child.
    * @param index {Number} (Optional.)  Number representing the position at 
    * which the child should be inserted.
	* @description Adds a Widget as a child.  If the specified Widget already
	* has a parent it will be removed from its current parent before
	* being added as a child.
	* @return {Widget} Widget instance that was successfully added, otherwise
	* null.
	*/
    add: function (item, index) {   

        var aItems,
            oItem,
            returnVal,
            success = false;


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

            if (item instanceof Y.Widget) {
                oItem = item;
            }
            else {
                oItem = this._createItem(item);
            }

            success = this.fire("itemAdded", { item: oItem, index: index });

            returnVal = success ? oItem : null;

        }

        return returnVal;

    },


	/**
	* @method remove
    * @param index {Number} (Optional.)  Number representing the index of the 
    * child to be removed.
	* @description Removes the Widget from its parent.  Optionally, can remove
	* a child by specifying its index.
	* @return {Widget} Widget instance that was successfully removed, otherwise
	* null.
	*/
    remove: function (index) {

        var items = this.get("items"),
            item,
            success = false;

        if (Lang.isNumber(index)) {

            item = items[index];

            if (item) {
                success = this.fire("itemRemoved", { item: item, index: index });
            }

        }
        
        return success ? item : null;

    },


	/**
	* @method removeAll
	* @description Removes all of the children from the Widget.
	* @return {Array} Array of Widgets that were successfully removed.
	*/
    removeAll: function () {

        var items = this.get("items"),
            aRemoved = [],
            item;

        Y.each(items, function (v, k) {

            item = this.remove(k);

            if (item) {
                aRemoved.push();                
            }

        });

        return (aRemoved.length > 0 ? aRemoved : null);

    },


	/**
	* @method item
	* @description Retrieves the child Widget at the specified index.
	* @return {Widget} Widget instance.
	*/
    item: function (index) {
        
        var items = this.get("items");
        
        return items ? items[index] : null;
        
    },
    

    /**
     * Renders all child Widgets for the parent.
     * <p>
     * This method in invoked after renderUI is invoked for the Widget class
     * using YUI's aop infrastructure.
     * </p>
     * @method _renderUIParent
     * @protected
     */
    _renderUIParent: function () {
              
        var content = this.get("contentBox");
        
        Y.each(this.get("items"), function (item) {
            item.render(content);
        });
        
    },

    
    initializer: function (config) {

        /**
        * Fires when a Widget is add as a child.
        * <p>
        * Subscribers to the "on" moment of this event, will be notified 
        * before a child is added.
        * </p>
        * <p>
        * Subscribers to the "after" moment of this event, will be notified
        * after a child is added.
        * </p>
        *
        * @event widget:itemAdded
        * @preventable _defItemAdded
        * @param {EventFacade} e The Event Facade
        */
        this.publish("itemAdded", { defaultFn: this._defItemAdded });

        /**
        * Fires when a child Widget is removed.
        * <p>
        * Subscribers to the "on" moment of this event, will be notified 
        * before a child is removed.
        * </p>
        * <p>
        * Subscribers to the "after" moment of this event, will be notified
        * after a child is removed.
        * </p>
        *
        * @event widget:itemRemoved
        * @preventable _defItemAdded
        * @param {EventFacade} e The Event Facade
        */
        this.publish("itemRemoved", { defaultFn: this._defItemRemoved });

        if (config && config.items) {
            this.add(config.items);
        }

        Y.after(this._renderUIParent, this, "renderUI");

        this.after("selectionChange", this._afterSelectionChange);
        this.after("selectedChange", this._afterParentSelectedChange);
        
    }

};

Y.WidgetParent = Parent;


}, '@VERSION@' ,{requires:['widget']});
