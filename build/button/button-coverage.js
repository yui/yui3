if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/button/button.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/button/button.js",
    code: []
};
_yuitest_coverage["build/button/button.js"].code=["YUI.add('button', function (Y, NAME) {","","/**","* A Button Widget","*","* @module button","* @since 3.5.0","*/","","var CLASS_NAMES = Y.ButtonCore.CLASS_NAMES,","    ARIA_STATES = Y.ButtonCore.ARIA_STATES,","    ARIA_ROLES  = Y.ButtonCore.ARIA_ROLES;","","/**","* Creates a Button","*","* @class Button","* @extends Widget","* @param config {Object} Configuration object","* @constructor","*/","function Button(config) {","    Button.superclass.constructor.apply(this, arguments);","}","","/* Button extends Widget */","Y.extend(Button, Y.Widget,  {","","    BOUNDING_TEMPLATE: Y.ButtonCore.prototype.TEMPLATE,","","    CONTENT_TEMPLATE: null,","","    /**","    * @method initializer","    * @description Internal init() handler.","    * @param config {Object} Config object.","    * @private","    */","    initializer: function(config) {","        var button = this;","        button._host = button.get('boundingBox');","","        if (config.disabled) {","            button.set('disabled', config.disabled);","        }","    },","","    /**","     * bindUI implementation","     *","     * @description Hooks up events for the widget","     * @method bindUI","     */","    bindUI: function() {","        var button = this;","        button.after('labelChange', button._afterLabelChange);","        button.after('disabledChange', button._afterDisabledChange);","    },","","    /**","     * @method syncUI","     * @description Updates button attributes","     */","    syncUI: function() {","        var button = this;","        Y.ButtonCore.prototype._uiSetLabel.call(button, button.get('label'));","        Y.ButtonCore.prototype._uiSetDisabled.call(button, button.get('disabled'));","    },","","    /**","    * @method _afterLabelChange","    * @private","    */","    _afterLabelChange: function(e) {","        Y.ButtonCore.prototype._uiSetLabel.call(this, e.newVal);","    },","","    /**","    * @method _afterDisabledChange","    * @private","    */","    _afterDisabledChange: function(e) {","        // Unable to use `this._uiSetDisabled` because that points ","        // to `Y.Widget.prototype._uiSetDisabled`. ","        // This works for now.","        // @TODO Investigate appropriate solution.","        Y.ButtonCore.prototype._uiSetDisabled.call(this, e.newVal);","    }","","}, {","    // Y.Button static properties","","    /**","     * The identity of the widget.","     *","     * @property NAME","     * @type String","     * @default 'button'","     * @readOnly","     * @protected","     * @static","     */","    NAME: 'button',","","    /**","    * Static property used to define the default attribute configuration of","    * the Widget.","    *","    * @property ATTRS","    * @type {Object}","    * @protected","    * @static","    */","    ATTRS: {","        label: {","            value: Y.ButtonCore.ATTRS.label.value","        },","","        disabled: {","            value: false","        }","    },","","    /**","    * @property HTML_PARSER","    * @type {Object}","    * @protected","    * @static","    */","    HTML_PARSER: {","        label: function(node) {","            this._host = node; // TODO: remove","            return this._getLabel();","        },","","        disabled: function(node) {","            return node.getDOMNode().disabled;","        }","    },","","    /**","     * List of class names used in the ButtonGroup's DOM","     *","     * @property CLASS_NAMES","     * @type Object","     * @static","     */","    CLASS_NAMES: CLASS_NAMES","});","","Y.mix(Button.prototype, Y.ButtonCore.prototype);","","/**","* Creates a ToggleButton","*","* @class ToggleButton","* @extends Button","* @param config {Object} Configuration object","* @constructor","*/","function ToggleButton(config) {","    Button.superclass.constructor.apply(this, arguments);","}","","// TODO: move to ButtonCore subclass to enable toggle plugin, widget, etc.","/* ToggleButton extends Button */","Y.extend(ToggleButton, Button,  {","    ","    trigger: 'click',","    selectedAttrName: '',","    ","    initializer: function (config) {","        var button = this,","            type = button.get('type'),","            selectedAttrName = (type === \"checkbox\" ? 'checked' : 'pressed'),","            selectedState = config[selectedAttrName] || false;","        ","        // Create the checked/pressed attribute","        button.addAttr(selectedAttrName, {","            value: selectedState","        });","        ","        button.selectedAttrName = selectedAttrName;","    },","    ","    destructor: function () {","        delete this.selectedAttrName;","    },","    ","    /**","     * @method bindUI","     * @description Hooks up events for the widget","     */","    bindUI: function() {","         var button = this,","             cb = button.get('contentBox');","        ","        ToggleButton.superclass.bindUI.call(button);","        ","        cb.on(button.trigger, button.toggle, button);","        button.after(button.selectedAttrName + 'Change', button._afterSelectedChange);","    },","","    /**","     * @method syncUI","     * @description Syncs the UI for the widget","     */","    syncUI: function() {","        var button = this,","            cb = button.get('contentBox'),","            type = button.get('type'),","            ROLES = ToggleButton.ARIA_ROLES,","            role = (type === 'checkbox' ? ROLES.CHECKBOX : ROLES.TOGGLE),","            selectedAttrName = button.selectedAttrName;","","        ToggleButton.superclass.syncUI.call(button);","        ","        cb.set('role', role);","        button._uiSetSelected(button.get(selectedAttrName));","    },","    ","    _afterSelectedChange: function(e){","        this._uiSetSelected(e.newVal);","    },","    ","    /**","    * @method _uiSetSelected","    * @private","    */","    _uiSetSelected: function(value) {","        var button = this,","            cb = button.get('contentBox'),","            STATES = ToggleButton.ARIA_STATES,","            type = button.get('type'),","            ariaState = (type === 'checkbox' ? STATES.CHECKED : STATES.PRESSED);","        ","        cb.toggleClass(Button.CLASS_NAMES.SELECTED, value);","        cb.set(ariaState, value);","    },","    ","    /**","    * @method toggle","    * @description Toggles the selected/pressed/checked state of a ToggleButton","    * @public","    */","    toggle: function() {","        var button = this;","        button._set(button.selectedAttrName, !button.get(button.selectedAttrName));","    }","","}, {","    ","    /**","    * The identity of the widget.","    *","    * @property NAME","    * @type {String}","    * @default 'buttongroup'","    * @readOnly","    * @protected","    * @static","    */","    NAME: 'toggleButton',","    ","    /**","    * Static property used to define the default attribute configuration of","    * the Widget.","    *","    * @property ATTRS","    * @type {Object}","    * @protected","    * @static","    */","    ATTRS: {","        type: {","            value: 'toggle',","            writeOnce: 'initOnly'","        }","    },","    ","    /**","    * @property HTML_PARSER","    * @type {Object}","    * @protected","    * @static","    */","    HTML_PARSER: {","        checked: function(node) {","            return node.hasClass(CLASS_NAMES.SELECTED);","        },","        pressed: function(node) {","            return node.hasClass(CLASS_NAMES.SELECTED);","        }","    },","    ","    /**","    * @property ARIA_STATES","    * @type {Object}","    * @protected","    * @static","    */","    ARIA_STATES: ARIA_STATES,","","    /**","    * @property ARIA_ROLES","    * @type {Object}","    * @protected","    * @static","    */","    ARIA_ROLES: ARIA_ROLES,","","    /**","     * Array of static constants used to identify the classnames applied to DOM nodes","     *","     * @property CLASS_NAMES","     * @type Object","     * @static","     */","    CLASS_NAMES: CLASS_NAMES","    ","});","","// Export","Y.Button = Button;","Y.ToggleButton = ToggleButton;","","","}, '@VERSION@', {\"requires\": [\"button-core\", \"cssbutton\", \"widget\"]});"];
_yuitest_coverage["build/button/button.js"].lines = {"1":0,"10":0,"22":0,"23":0,"27":0,"40":0,"41":0,"43":0,"44":0,"55":0,"56":0,"57":0,"65":0,"66":0,"67":0,"75":0,"87":0,"132":0,"133":0,"137":0,"151":0,"161":0,"162":0,"167":0,"173":0,"179":0,"183":0,"187":0,"195":0,"198":0,"200":0,"201":0,"209":0,"216":0,"218":0,"219":0,"223":0,"231":0,"237":0,"238":0,"247":0,"248":0,"289":0,"292":0,"324":0,"325":0};
_yuitest_coverage["build/button/button.js"].functions = {"Button:22":0,"initializer:39":0,"bindUI:54":0,"syncUI:64":0,"_afterLabelChange:74":0,"_afterDisabledChange:82":0,"label:131":0,"disabled:136":0,"ToggleButton:161":0,"initializer:172":0,"destructor:186":0,"bindUI:194":0,"syncUI:208":0,"_afterSelectedChange:222":0,"_uiSetSelected:230":0,"toggle:246":0,"checked:288":0,"pressed:291":0,"(anonymous 1):1":0};
_yuitest_coverage["build/button/button.js"].coveredLines = 46;
_yuitest_coverage["build/button/button.js"].coveredFunctions = 19;
_yuitest_coverline("build/button/button.js", 1);
YUI.add('button', function (Y, NAME) {

/**
* A Button Widget
*
* @module button
* @since 3.5.0
*/

_yuitest_coverfunc("build/button/button.js", "(anonymous 1)", 1);
_yuitest_coverline("build/button/button.js", 10);
var CLASS_NAMES = Y.ButtonCore.CLASS_NAMES,
    ARIA_STATES = Y.ButtonCore.ARIA_STATES,
    ARIA_ROLES  = Y.ButtonCore.ARIA_ROLES;

/**
* Creates a Button
*
* @class Button
* @extends Widget
* @param config {Object} Configuration object
* @constructor
*/
_yuitest_coverline("build/button/button.js", 22);
function Button(config) {
    _yuitest_coverfunc("build/button/button.js", "Button", 22);
_yuitest_coverline("build/button/button.js", 23);
Button.superclass.constructor.apply(this, arguments);
}

/* Button extends Widget */
_yuitest_coverline("build/button/button.js", 27);
Y.extend(Button, Y.Widget,  {

    BOUNDING_TEMPLATE: Y.ButtonCore.prototype.TEMPLATE,

    CONTENT_TEMPLATE: null,

    /**
    * @method initializer
    * @description Internal init() handler.
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config) {
        _yuitest_coverfunc("build/button/button.js", "initializer", 39);
_yuitest_coverline("build/button/button.js", 40);
var button = this;
        _yuitest_coverline("build/button/button.js", 41);
button._host = button.get('boundingBox');

        _yuitest_coverline("build/button/button.js", 43);
if (config.disabled) {
            _yuitest_coverline("build/button/button.js", 44);
button.set('disabled', config.disabled);
        }
    },

    /**
     * bindUI implementation
     *
     * @description Hooks up events for the widget
     * @method bindUI
     */
    bindUI: function() {
        _yuitest_coverfunc("build/button/button.js", "bindUI", 54);
_yuitest_coverline("build/button/button.js", 55);
var button = this;
        _yuitest_coverline("build/button/button.js", 56);
button.after('labelChange', button._afterLabelChange);
        _yuitest_coverline("build/button/button.js", 57);
button.after('disabledChange', button._afterDisabledChange);
    },

    /**
     * @method syncUI
     * @description Updates button attributes
     */
    syncUI: function() {
        _yuitest_coverfunc("build/button/button.js", "syncUI", 64);
_yuitest_coverline("build/button/button.js", 65);
var button = this;
        _yuitest_coverline("build/button/button.js", 66);
Y.ButtonCore.prototype._uiSetLabel.call(button, button.get('label'));
        _yuitest_coverline("build/button/button.js", 67);
Y.ButtonCore.prototype._uiSetDisabled.call(button, button.get('disabled'));
    },

    /**
    * @method _afterLabelChange
    * @private
    */
    _afterLabelChange: function(e) {
        _yuitest_coverfunc("build/button/button.js", "_afterLabelChange", 74);
_yuitest_coverline("build/button/button.js", 75);
Y.ButtonCore.prototype._uiSetLabel.call(this, e.newVal);
    },

    /**
    * @method _afterDisabledChange
    * @private
    */
    _afterDisabledChange: function(e) {
        // Unable to use `this._uiSetDisabled` because that points 
        // to `Y.Widget.prototype._uiSetDisabled`. 
        // This works for now.
        // @TODO Investigate appropriate solution.
        _yuitest_coverfunc("build/button/button.js", "_afterDisabledChange", 82);
_yuitest_coverline("build/button/button.js", 87);
Y.ButtonCore.prototype._uiSetDisabled.call(this, e.newVal);
    }

}, {
    // Y.Button static properties

    /**
     * The identity of the widget.
     *
     * @property NAME
     * @type String
     * @default 'button'
     * @readOnly
     * @protected
     * @static
     */
    NAME: 'button',

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
        label: {
            value: Y.ButtonCore.ATTRS.label.value
        },

        disabled: {
            value: false
        }
    },

    /**
    * @property HTML_PARSER
    * @type {Object}
    * @protected
    * @static
    */
    HTML_PARSER: {
        label: function(node) {
            _yuitest_coverfunc("build/button/button.js", "label", 131);
_yuitest_coverline("build/button/button.js", 132);
this._host = node; // TODO: remove
            _yuitest_coverline("build/button/button.js", 133);
return this._getLabel();
        },

        disabled: function(node) {
            _yuitest_coverfunc("build/button/button.js", "disabled", 136);
_yuitest_coverline("build/button/button.js", 137);
return node.getDOMNode().disabled;
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

_yuitest_coverline("build/button/button.js", 151);
Y.mix(Button.prototype, Y.ButtonCore.prototype);

/**
* Creates a ToggleButton
*
* @class ToggleButton
* @extends Button
* @param config {Object} Configuration object
* @constructor
*/
_yuitest_coverline("build/button/button.js", 161);
function ToggleButton(config) {
    _yuitest_coverfunc("build/button/button.js", "ToggleButton", 161);
_yuitest_coverline("build/button/button.js", 162);
Button.superclass.constructor.apply(this, arguments);
}

// TODO: move to ButtonCore subclass to enable toggle plugin, widget, etc.
/* ToggleButton extends Button */
_yuitest_coverline("build/button/button.js", 167);
Y.extend(ToggleButton, Button,  {
    
    trigger: 'click',
    selectedAttrName: '',
    
    initializer: function (config) {
        _yuitest_coverfunc("build/button/button.js", "initializer", 172);
_yuitest_coverline("build/button/button.js", 173);
var button = this,
            type = button.get('type'),
            selectedAttrName = (type === "checkbox" ? 'checked' : 'pressed'),
            selectedState = config[selectedAttrName] || false;
        
        // Create the checked/pressed attribute
        _yuitest_coverline("build/button/button.js", 179);
button.addAttr(selectedAttrName, {
            value: selectedState
        });
        
        _yuitest_coverline("build/button/button.js", 183);
button.selectedAttrName = selectedAttrName;
    },
    
    destructor: function () {
        _yuitest_coverfunc("build/button/button.js", "destructor", 186);
_yuitest_coverline("build/button/button.js", 187);
delete this.selectedAttrName;
    },
    
    /**
     * @method bindUI
     * @description Hooks up events for the widget
     */
    bindUI: function() {
         _yuitest_coverfunc("build/button/button.js", "bindUI", 194);
_yuitest_coverline("build/button/button.js", 195);
var button = this,
             cb = button.get('contentBox');
        
        _yuitest_coverline("build/button/button.js", 198);
ToggleButton.superclass.bindUI.call(button);
        
        _yuitest_coverline("build/button/button.js", 200);
cb.on(button.trigger, button.toggle, button);
        _yuitest_coverline("build/button/button.js", 201);
button.after(button.selectedAttrName + 'Change', button._afterSelectedChange);
    },

    /**
     * @method syncUI
     * @description Syncs the UI for the widget
     */
    syncUI: function() {
        _yuitest_coverfunc("build/button/button.js", "syncUI", 208);
_yuitest_coverline("build/button/button.js", 209);
var button = this,
            cb = button.get('contentBox'),
            type = button.get('type'),
            ROLES = ToggleButton.ARIA_ROLES,
            role = (type === 'checkbox' ? ROLES.CHECKBOX : ROLES.TOGGLE),
            selectedAttrName = button.selectedAttrName;

        _yuitest_coverline("build/button/button.js", 216);
ToggleButton.superclass.syncUI.call(button);
        
        _yuitest_coverline("build/button/button.js", 218);
cb.set('role', role);
        _yuitest_coverline("build/button/button.js", 219);
button._uiSetSelected(button.get(selectedAttrName));
    },
    
    _afterSelectedChange: function(e){
        _yuitest_coverfunc("build/button/button.js", "_afterSelectedChange", 222);
_yuitest_coverline("build/button/button.js", 223);
this._uiSetSelected(e.newVal);
    },
    
    /**
    * @method _uiSetSelected
    * @private
    */
    _uiSetSelected: function(value) {
        _yuitest_coverfunc("build/button/button.js", "_uiSetSelected", 230);
_yuitest_coverline("build/button/button.js", 231);
var button = this,
            cb = button.get('contentBox'),
            STATES = ToggleButton.ARIA_STATES,
            type = button.get('type'),
            ariaState = (type === 'checkbox' ? STATES.CHECKED : STATES.PRESSED);
        
        _yuitest_coverline("build/button/button.js", 237);
cb.toggleClass(Button.CLASS_NAMES.SELECTED, value);
        _yuitest_coverline("build/button/button.js", 238);
cb.set(ariaState, value);
    },
    
    /**
    * @method toggle
    * @description Toggles the selected/pressed/checked state of a ToggleButton
    * @public
    */
    toggle: function() {
        _yuitest_coverfunc("build/button/button.js", "toggle", 246);
_yuitest_coverline("build/button/button.js", 247);
var button = this;
        _yuitest_coverline("build/button/button.js", 248);
button._set(button.selectedAttrName, !button.get(button.selectedAttrName));
    }

}, {
    
    /**
    * The identity of the widget.
    *
    * @property NAME
    * @type {String}
    * @default 'buttongroup'
    * @readOnly
    * @protected
    * @static
    */
    NAME: 'toggleButton',
    
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
            value: 'toggle',
            writeOnce: 'initOnly'
        }
    },
    
    /**
    * @property HTML_PARSER
    * @type {Object}
    * @protected
    * @static
    */
    HTML_PARSER: {
        checked: function(node) {
            _yuitest_coverfunc("build/button/button.js", "checked", 288);
_yuitest_coverline("build/button/button.js", 289);
return node.hasClass(CLASS_NAMES.SELECTED);
        },
        pressed: function(node) {
            _yuitest_coverfunc("build/button/button.js", "pressed", 291);
_yuitest_coverline("build/button/button.js", 292);
return node.hasClass(CLASS_NAMES.SELECTED);
        }
    },
    
    /**
    * @property ARIA_STATES
    * @type {Object}
    * @protected
    * @static
    */
    ARIA_STATES: ARIA_STATES,

    /**
    * @property ARIA_ROLES
    * @type {Object}
    * @protected
    * @static
    */
    ARIA_ROLES: ARIA_ROLES,

    /**
     * Array of static constants used to identify the classnames applied to DOM nodes
     *
     * @property CLASS_NAMES
     * @type Object
     * @static
     */
    CLASS_NAMES: CLASS_NAMES
    
});

// Export
_yuitest_coverline("build/button/button.js", 324);
Y.Button = Button;
_yuitest_coverline("build/button/button.js", 325);
Y.ToggleButton = ToggleButton;


}, '@VERSION@', {"requires": ["button-core", "cssbutton", "widget"]});
