YUI.add('button-group', function(Y) {

/**
* A Widget to create groups of buttons
*
* @module button-group
* @since 3.5.0
*/

var BOUNDING_BOX    = "boundingBox",
    CONTENT_BOX     = "contentBox",
    SELECTOR        = "button, input[type=button]",
    CLICK_EVENT     = "click",
    CLASS_NAMES     = Y.ButtonCore.CLASS_NAMES;

/**
* Creates a ButtonGroup
*
* @class ButtonGroup
* @extends Widget
* @param config {Object} Configuration object
* @constructor
*/
function ButtonGroup() {
    ButtonGroup.superclass.constructor.apply(this, arguments);
}

/* ButtonGroup extends Widget */
Y.ButtonGroup = Y.extend(ButtonGroup, Y.Widget, {
    
    /**
    * @method initializer
    * @description Internal init() handler.
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(){
        // TODO: Nothing? Then remove
    },
    
    /**
     * renderUI implementation
     *
     * Creates a visual representation of the widget based on existing parameters. 
     * @method renderUI
     */  
    renderUI: function() {
        var buttonNodes = this.getButtons();
        
        buttonNodes.each(function(node){
            new Y.Plugin.Button.createNode(node);
        });
    },
    
    /**
     * bindUI implementation
     *
     * Hooks up events for the widget
     * @method bindUI
     */
    bindUI: function() {
        var group = this,
            cb = group.get(CONTENT_BOX);
            
        cb.delegate(CLICK_EVENT, group._handleClick, SELECTOR, group);
    },
    
    /**
    * @method getButtons
    * @description Returns all Y.Buttons instances assigned to this group
    * @public
    */
    getButtons: function() {
        var cb = this.get(CONTENT_BOX);
        
        return cb.all(SELECTOR);
    },
    
    /**
    * @method getSelectedButtons
    * @description Returns all Y.Buttons instances that are selected
    * @public
    */
    getSelectedButtons: function() {
        var group = this,
            selected = [],
            buttons = group.getButtons(),
            selectedClass = ButtonGroup.CLASS_NAMES.SELECTED;
        
        buttons.each(function(node){
            if (node.hasClass(selectedClass)){
                selected.push(node);                   
            }
        });
        
        return selected;
    },
    
    /**
    * @method getSelectedValues
    * @description Returns the values of all Y.Button instances that are selected
    * @public
    */
    getSelectedValues: function() {
        var group = this,
            value,
            values = [],
            selected = group.getSelectedButtons(),
            selectedClass = ButtonGroup.CLASS_NAMES.SELECTED;
            
        Y.Array.each(selected, function(node){
            if (node.hasClass(selectedClass)){
                value = node.getContent();
                values.push(value);
            }
        });
        
        return values;
    },
    
    /**
    * @method _handleClick
    * @description A delegated click handler for when any button is clicked in the content box
    * @private
    */
    _handleClick: function(e){
        var buttons,
            clickedNode = e.target,
            group = this,
            type = group.get('type'),
            selectedClass = ButtonGroup.CLASS_NAMES.SELECTED,
            isSelected = clickedNode.hasClass(selectedClass);
            
        // TODO: Anything for 'push' groups?
    
        if (type === 'checkbox') {
            clickedNode.toggleClass(selectedClass, !isSelected);
            group.fire('selectionChange');  // Payload? Attribute?
        }
        else if (type === 'radio') {
            if (!isSelected) {
                buttons = group.getButtons(); // Todo: getSelectedButtons()? Need it to return an arraylist then.
                buttons.removeClass(selectedClass);
                clickedNode.addClass(selectedClass);
                group.fire('selectionChange');  // Payload? Attribute?
            }
        }
    }
    
}, {
    // Y.ButtonGroup static properties

    /**
     * The identity of the widget.
     *
     * @property NAME
     * @type String
     * @default 'buttongroup'
     * @readOnly
     * @protected
     * @static
     */
    NAME: 'buttongroup',
    
    /** 
    * Static property used to define the default attribute configuration of
    * the Widget.
    *
    * @property ATTRS
    * @type {Object}
    * @protected
    * @static
    */
    ATTRS: {
        type: {
            writeOnce: 'initOnly',
            value: 'radio'
        }
    },

    /**
     * List of class names used in the ButtonGroup's DOM
     *
     * @property CLASS_NAMES
     * @type Object
     * @static
     */
    CLASS_NAMES: CLASS_NAMES
});


}, '@VERSION@' ,{requires:['button-core','widget']});
