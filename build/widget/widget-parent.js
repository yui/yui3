YUI.add('widget-parent', function(Y) {

/**
 * Extension enabling a Widget to be a parent of another Widget.
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
     * @attribute defaultChildType
     * @type String
     *
     * @description String representing the default type of the children 
     * managed by this Widget.  Can also supply default type as a constructor
     * reference.
     */
    defaultChildType: {
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
     * are selected, will return null.
     */
    selection: {
        readOnly: true,
        setter: "_setSelection"
    },
    
    
    /**
     * @attribute children
     * @type Array
     * @readOnly  
     *
     * @description Returns an array of all of the children that are 
     * direct descendants.
     */
    children: {
        value: [],
        readOnly: true,
        getter: function (children) {
            return children.concat();
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

        if (event.target == this) {

            var selection = event.newVal,
                selectedVal = 0;    //  Not selected


            if (selection) {

                selectedVal = 1;    //  Assume fully selected, confirm otherwise

                if (Lang.isArray(selection) && 
                    (selection.length < this.get("children").length)) {

                    selectedVal = 2;    //  Partially selected

                }
                
            }

            this.set("selected", selectedVal, { src: this });
        
        }
        
    },


    /**
     * Attribute change listener for the <code>selected</code> 
     * attribute, responsible for syncing the selected state of all children to 
     * match that of their parent Widget.
     * 
     *
     * @method _afterParentSelectedChange
     * @protected
     * @param {EventFacade} event The event facade for the attribute change.
     */
    _afterParentSelectedChange: function (event) {

        var value = event.newVal,
            children = this.get("children");

        if (this == event.target && event.src != this && children.length > 0 && 
            (value === 0 || value === 1)) {

            Y.each(children, function (child) {

                //  Specify the source of this change as the parent so that 
                //  value of the parent's "selection" attribute isn't 
                //  recalculated

                child.set("selected", value, { src: this });

            }, this);
            
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
    _setSelection: function (child) {

        var selection = null,
            children = this.get("children"),
            root = this.get("root") || this;

        if (root.get("multiple") && children.length > 0) {

            selection = [];
            
            Y.each(children, function (v) {
            
               if (v.get("selected") > 0) {
                   selection.push(v);
               }
            
            });

        }
        else {

            if (child.get("selected") > 0) {
                selection = child;
            }

        }
        
        return selection;
            
    },


    /**
     * Attribute change listener for the <code>selected</code> 
     * attribute of child Widgets, responsible for setting the value of the 
     * parent's <code>selection</code> attribute.
     *
     * @method _updateSelection
     * @protected
     * @param {EventFacade} event The event facade for the attribute change.
     */
    _updateSelection: function (event) {

        var child = event.target,
            selection = this.get("selection"),
            root = this.get("root") || this;

        if (event.src != this) {

            if (!root.get("multiple") && selection && event.newVal > 0) {

                //  Set src equal to the current context to prevent
                //  unnecessary re-calculation of the selection.

                selection.set("selected", 0, { src: this });

            }
            
            this._set("selection", child);

        }

    },


    /**
     * Attribute change listener for the <code>focused</code> 
     * attribute of child Widgets, responsible for setting the value of the 
     * parent's <code>activeItem</code> attribute.
     *
     * @method _updateActiveItem
     * @protected
     * @param {EventFacade} event The event facade for the attribute change.
     */
    _updateActiveItem: function (event) {

        var val = null;
        
        if (event.newVal === true) {
            val = event.target;
        }

        this._set("activeItem", val);

    },


    /**
     * Creates an instance of a child Widget using the specified configuration.
     * By default Widget instances will be created of the type specified 
     * by the <code>defaultChildType</code> attribute.  Types can be explicitly
     * defined via the <code>type</code> property of the configuration object
     * literal.
     *
     * @method _createChild
     * @protected
     * @param config {Object} Object literal representing the configuration 
     * used to create an instance of a Widget.
     */
    _createChild: function (config) {

        var type = config.type || this.get("defaultChildType"),
            child,
            FnConstructor;
            
        if (type) {

            if (Lang.isString(type)) {
                FnConstructor = Y[type];
            }
            else if (Lang.isFunction(type)) {
                FnConstructor = type;
            }

        }

        if (FnConstructor) {
            child = new FnConstructor(config);
        }
        else {
            Y.error("Could not create a child instance using the supplied type.");
        }

        return child;
        
    },


    /**
     * Default childAdded handler
     *
     * @method _defChildAdded
     * @protected
     * @param event {EventFacade} The Event object
     * @param child {Widget} The Widget instance, or configuration 
     * object for the Widget to be added as a child.
     * @param index {Number} Number representing the position at 
     * which the child will be inserted.
     */
    _defChildAdded: function (event) {

        var child = event.child,
            index = event.index,
            aChildren = this.get("children");
        

        if (child.get("parent")) {
            child.remove();
        }


        if (Lang.isNumber(index)) {
            aChildren.splice(index, 0, child);
        }
        else {
            aChildren.push(child);
        }


        this._set("children", aChildren);
        child._set("parent", this);
        child.addTarget(this);


        if (child.get("selected")) {
            this._set("selection", child);
        }


        child.after("selectedChange", Y.bind(this._updateSelection, this));
        child.after("focusedChange", Y.bind(this._updateActiveItem, this));
        
    },


    /**
     * Default childRemoved handler
     *
     * @method _defChildRemoved
     * @protected
     * @param event {EventFacade} The Event object
     * @param child {Widget} The Widget instance to be removed.
     * @param index {Number} Number representing the index of the Widget to 
     * be removed.
     */    
    _defChildRemoved: function (event) {

        var child = event.child,
            index = event.index,
            children = this.get("children");

        if (child.get("focused")) {
            child.set("focused", false);
        }

        if (child.get("selected")) {
            child.set("selected", 0);
        }

        children.splice(index, 1);
        this._set("children", children);

        child.removeTarget(this);
        child._set("parent", null);
        
    },


	/**
	* @method add
    * @param child {Widget|Object} The Widget instance, or configuration 
    * object for the Widget to be added as a child.
    * @param index {Number} (Optional.)  Number representing the position at 
    * which the child should be inserted.
	* @description Adds a Widget as a child.  If the specified Widget already
	* has a parent it will be removed from its current parent before
	* being added as a child.
	* @return {Widget} Widget instance that was successfully added.
	*/
    add: function (child, index) {   

        var aChildren,
            oChild,
            returnVal;


        if (Lang.isArray(child)) {

            aChildren = [];

            Y.each(child, function (v) {

                oChild = this.add(v);

                if (oChild) {
                    aChildren.push(oChild);
                }
                
            }, this);
            

            if (aChildren.length > 0) {
                returnVal = aChildren;
            }

        }
        else {

            if (child instanceof Y.Widget) {
                oChild = child;
            }
            else {
                oChild = this._createChild(child);
            }

            if (oChild && this.fire("childAdded", { child: oChild, index: index })) {
                returnVal = oChild;
            }

        }

        return returnVal;

    },


	/**
	* @method remove
    * @param index {Number} (Optional.)  Number representing the index of the 
    * child to be removed.
	* @description Removes the Widget from its parent.  Optionally, can remove
	* a child by specifying its index.
	* @return {Widget} Widget instance that was successfully removed.
	*/
    remove: function (index) {

        var child = this.get("children")[index],
            returnVal;

        if (child && this.fire("childRemoved", { child: child, index: index })) {
            returnVal = child;
        }
        
        return returnVal;

    },


	/**
	* @method removeAll
	* @description Removes all of the children from the Widget.
	* @return {Array} Array of Widgets that were successfully removed.
	*/
    removeAll: function () {

        var aRemoved = [],
            returnVal,
            child;

        Y.each(this.get("children"), function (v, k) {

            child = this.remove(k);

            if (child) {
                aRemoved.push(child);
            }

        });

        if (aRemoved.length > 0) {
            returnVal = aRemoved;
        }

        return returnVal;

    },


	/**
	* @method item
	* @description Retrieves the child Widget at the specified index.
	* @return {Widget} Widget instance.
	*/
    item: function (index) {
        return this.get("children")[index];
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
        
        Y.each(this.get("children"), function (child) {
            child.render(content);
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
        * @event childAdded
        * @preventable _defChildAdded
        * @param {EventFacade} e The Event Facade
        */
        this.publish("childAdded", { defaultFn: this._defChildAdded });

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
        * @event childRemoved
        * @preventable _defChildRemoved
        * @param {EventFacade} e The Event Facade
        */
        this.publish("childRemoved", { defaultFn: this._defChildRemoved });


        if (config && config.children) {
            this.add(config.children);
        }

        Y.after(this._renderUIParent, this, "renderUI");

        this.after("selectionChange", this._afterSelectionChange);
        this.after("selectedChange", this._afterParentSelectedChange);
        
    }

};

Y.WidgetParent = Parent;


}, '@VERSION@' ,{requires:['widget']});
