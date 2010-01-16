YUI.add('widget-child', function(Y) {

/**
 * Extension enabling a Widget to be a child of another Widget.
 *
 * @module widget-child
 */

var Lang = Y.Lang;

/**
 * Widget extension providing functionality enabling a Widget to be a 
 * child of another Widget.
 *
 * @class WidgetChild
 * @param {Object} config User configuration object.
*/
function Child() {

    // Widget method overlap

    Y.after(this._syncUIChild, this, "syncUI");
    Y.after(this._bindUIChild, this, "bindUI");

}

Child.ATTRS = {

    /**
     * @attribute selected
     * @type Number
     * @default 0
     *
     * @description Number indicating if the Widget is selected.  Possible 
     * values are:
     * <dl>
     * <dt>0</dt> <dd>(Default) Not selected</dd>
     * <dt>1</dt> <dd>Fully selected</dd>
     * <dt>2</dt> <dd>Partially selected</dd>
     * </dl>
    */
    selected: {   
        value: 0,
        validator: Lang.isNumber
    },


    /**
     * @attribute index
     * @type Number
     * @readOnly
     *
     * @description Number representing the Widget's ordinal position in its 
     * parent Widget.
     */
    index: {
        readOnly: true,
        getter: function () {
            
            var parent = this.get("parent"),
                children,
                index;
            
            if (parent) {
                
                children = parent.get("children");
                
                for (var i=0, len = children.length; i < len; i++) {
                    if (this == children[i]) {
                        index = i;
                        break;
                    }
                }
                
            }
            
            return index;
            
        }
    },


    /**
     * @attribute parent
     * @type Widget
     * @readOnly
     *
     * @description Retrieves the parent of the Widget in the object hierarchy.
    */
    parent: {
        readOnly: true
    },


    /**
     * @attribute depth
     * @type Number
     * @default -1 
     * @readOnly         
     *
     * @description Number representing the depth of this Widget in the object 
     * hierarchy.
     */
    depth: {
        value: -1,
        readOnly: true,
        getter: function () {
            
            var parent = this.get("parent"),
                depth = -1;
            
            while (parent) {
                depth = (depth + 1);
                parent = parent.get("parent");
            }
            
            return depth;
            
        }
    },

    /**
     * @attribute root
     * @type Widget 
     * @readOnly         
     *
     * @description Returns the root Widget in the object hierarchy.
     */
    root: {
        readOnly: true,
        getter: function () {

            var getParent = function (child) {

                var parent = child.get("parent");

                return (parent ? getParent(parent) : child);
                
            };

            return getParent(this);
            
        }
    }

};

Child.prototype = {

    //  Override of Widget's implementation of _getUIEventNode() to ensure that 
    //  all event listeners are bound to the Widget's topmost DOM element.
    //  This ensures that the firing of each type of Widget UI event (click,
    //  mousedown, etc.) is facilitated by a single, top-level, delegated DOM
    //  event listener.
    _getUIEventNode: function () {
    
        var root = this.get("root"),
            returnVal;
        
        if (root) {
            returnVal = root.get("boundingBox");
        }
    
        return returnVal;
        
    },


	/**
	* @method next
	* @description Returns the Widget's next sibling.
    * @param {Boolean} circular Boolean indicating if the parent's first child 
    * should be returned if the child has no next sibling.	
	* @return {Widget} Widget instance. 
	*/
    next: function (circular) {

        var parent = this.get("parent"),
            sibling;

        if (parent) {
            sibling = parent.item((this.get("index")+1));
        }

        if (circular && !sibling) {
            sibling = parent.item(0);
        }

        return sibling;

    },


	/**
    * @method previous
	* @description Returns the Widget's previous sibling.
    * @param {Boolean} circular Boolean indicating if the parent's last child 
    * should be returned if the child has no previous sibling.
	* @return {Widget} Widget instance. 
	*/
    previous: function (circular) {

        var parent = this.get("parent"),
            index = this.get("index"),
            sibling;
        
        if (parent && index > 0) {
            sibling = parent.item([(index-1)]);
        }

        if (circular && !sibling) {
            sibling = parent.item((parent.get("children").length - 1));
        }

        return sibling; 
        
    },


    //  Override of Y.WidgetParent.remove()
    //  Sugar implementation allowing a child to remove itself from its parent.
    remove: function (index) {

        var parent;

        if (Lang.isNumber(index)) {
            Y.WidgetParent.prototype.remove.apply(this, arguments);
        }
        else {

            parent = this.get("parent");

            if (parent) {
                parent.remove(this.get("index"));
            }
                        
        }
        
    },


	/**
	* @method isRoot
	* @description Determines if the Widget is the root Widget in the 
	* object hierarchy.
	* @return {Boolean} Boolean indicating if Widget is the root Widget in the 
	* object hierarchy.
	*/
    isRoot: function () {
        return (this == this.get("root"));
    },


	/**
	* @method isRoot
	* @description Returns the Widget instance at the specified depth.
	* @return {Widget} Widget instance.
	*/
    ancestor: function (depth) {

        var parent;

        if (this.get("depth") >= depth && depth > 0)  {

            parent = this.get("parent");

            while (parent.get("depth") > depth) {
                parent = parent.get("parent");
            }

        }

        return parent;

    },


    /**
     * Updates the UI to reflect the <code>selected</code> attribute value.
     *
     * @method _uiSetChildSelected
     * @protected
     * @param {number} selected The selected value to be reflected in the UI.
     */    
    _uiSetChildSelected: function (selected) {

        var box = this.get("boundingBox"),
            sClassName = this.getClassName("selected");

        if (selected === 0) {
            box.removeClass(sClassName);
        }
        else {
            box.addClass(sClassName);
        }
        
    },


    /**
     * Default attribute change listener for the <code>selected</code> 
     * attribute, responsible for updating the UI, in response to 
     * attribute changes.
     *
     * @method _afterChildSelectedChange
     * @protected
     * @param {EventFacade} event The event facade for the attribute change.
     */    
    _afterChildSelectedChange: function (event) {
        this._uiSetChildSelected(event.newVal);
    },
    

    /**
     * Synchronizes the UI to match the WidgetChild state. This method in 
     * invoked after syncUI is invoked for the Widget class using YUI's aop 
     * infrastructure.
     *
     * @method _syncUIChild
     * @protected
     */    
    _syncUIChild: function () {
        this._uiSetChildSelected(this.get("selected"));
    },


    /**
     * Binds event listeners responsible for updating the UI state in response 
     * to WidgetChild related state changes.
     * <p>
     * This method is invoked after bindUI is invoked for the Widget class
     * using YUI's aop infrastructure.
     * </p>
     * @method _bindUIChild
     * @protected
     */    
    _bindUIChild: function () {
        this.after("selectedChange", this._afterChildSelectedChange);
    }
    
};

Y.WidgetChild = Child;


}, '@VERSION@' ,{requires:['widget']});
