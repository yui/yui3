YUI.add('button-group', function(Y) {

/**
* Allows Y.Button instances to be grouped together
*
* @module buttongroup
* @main ButtonGroup
* @since 3.5.0
*/

var BOUNDING_BOX = "boundingBox",
    CONTENT_BOX = "contentBox",
    BUTTON_CLASS = "yui3-button",  // TODO: Pull from ButtonCore
    BUTTON_SELECTED_CLASS = BUTTON_CLASS + "-selected",
    SELECTOR = "button, input[type=button]",
    CLICK_EVENT = "click";
    
/**
* Creates a ButtonGroup
*
* @class ButtonGroup
* @extends Base
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
        this._cb = this.get(CONTENT_BOX);
    },
    
    renderUI: function() {
        
        var ButtonFactory = Y.Plugin.Button.createNode;
        var buttonNodes = this.getButtons();
        buttonNodes.each(function(node){
            new ButtonFactory(node);
        });
    },
    
    bindUI: function() {
        this._cb.delegate(CLICK_EVENT, this.handleClick, SELECTOR, this);
    },
    
    handleClick: function(e){
        var bg = this;
        var node = e.target;
        var type = bg.get('type');
        
        if (type === 'push') {
            // TODO: Nothing?  Then why have a push group.
        }
        else if (type === 'checkbox') {
            var isSelected = node.hasClass(BUTTON_SELECTED_CLASS);
            node.toggleClass(BUTTON_SELECTED_CLASS, !isSelected);
            bg.fire('selectionChange');
        }
        else if (type === 'radio') {
            bg.getButtons().removeClass(BUTTON_SELECTED_CLASS);
            node.addClass(BUTTON_SELECTED_CLASS);
            bg.fire('selectionChange');
        }
        
        e.stopPropagation(); // Todo: Maybe?
    },
    
    /**
    * @method getButtons
    * @description Returns all Y.Buttons instances assigned to this group
    * @public
    */
    getButtons: function() {
        return this.get(CONTENT_BOX).all(SELECTOR);
    },
    
    /**
    * @method getSelectedButtons
    * @description Returns all Y.Buttons instances that are selected
    * @public
    */
    getSelectedButtons: function() {
        var buttons = this.getButtons();
        var selected = [];
        
        buttons.each(function(node){
            if (node.hasClass(BUTTON_SELECTED_CLASS)){
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
        var selected = this.getSelectedButtons();
        var values = [];
        
        Y.Array.each(selected, function(node){
            if (node.hasClass(BUTTON_SELECTED_CLASS)){
                values.push(node.getContent());                   
            }
        });
        
        return values;
    }
    
}, {
    // Y.ScrollView static properties

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
    }
});


}, '@VERSION@' ,{requires:['button-core','widget']});
