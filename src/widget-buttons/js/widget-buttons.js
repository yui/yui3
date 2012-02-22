/**
Provides header/body/footer button support for Widgets that use the
`WidgetStdMod` extension.

@module widget-buttons
@since 3.4.0
**/

var YArray  = Y.Array,
    YLang   = Y.Lang,
    YObject = Y.Object,

    ButtonPlugin = Y.Plugin.Button,

    getClassName = Y.ClassNameManager.getClassName,
    isArray      = YLang.isArray,
    isNumber     = YLang.isNumber,
    isString     = YLang.isString;

// TODOs:
//
// * Styling to add spacing between buttons?
// * Clean up other TODOs :)
//

/**
Provides header/body/footer button support for Widgets that use the
`WidgetStdMod` extension.

Widget extension that makes it easy to declaratively configure a widget's
buttons. This adds a `buttons` attribute along with button- accessor and mutator
methods.

TODO: Add note about HTML_PARSER feature.

@class WidgetButtons
@extensionfor Widget
@since 3.4.0
**/
function WidgetButtons() {
    // Require `Y.WidgetStdMod`.
    if (!this._stdModNode) {
        Y.error('WidgetStdMod must be added to the Widget before WidgetButtons.');
    }
}

WidgetButtons.ATTRS = {
    /**
    Collection containing this widget's buttons.

    The collection is an Object which contains an Array of `Y.Node`s for every
    `WidgetStdMod` section (header, body, footer) which has one or more buttons.

    This attribute is very flexible in the values it will accept. `buttons` can
    be specified as a single Array, or an Object of Arrays keyed to a particular
    section.

    All specified values will be normalized to this structure:

        {
            header: [...],
            footer: [...]
        }

    A button can be specified as a `Y.Node`, config Object, or String name for a
    predefined button on the `BUTTONS` prototype property. When a config Object
    is provided, it will be merged with any defaults provided by a button with
    the same `name` defined on the `BUTTONS` property. See `addButton()` for the
    detailed list of configuration properties.

    @example
        {
            // Uses predefined "close" button by String name.
            header: ['close'],

            footer: [
                {
                    name  : 'cancel',
                    label : 'Cancel',
                    action: function (e) {
                        this.hide();
                    }
                },

                {
                    name  : 'okay',
                    label : 'Okay',
                    events: {
                        click: function (e) {
                            this.hide();
                        }
                    }
                }
            ]
        }

    @attribute buttons
    @type Object
    @default {}
    **/
    buttons: {
        getter: '_getButtons',
        setter: '_setButtons',
        value : {}
    }
};

/**
CSS class-names used by `WidgetButtons`.

@property CLASS_NAMES
@type Object
@static
**/
// TODO: Should this be `BUTTONS_CLASS_NAMES`?
WidgetButtons.CLASS_NAMES = {
    button : getClassName('button'),
    buttons: getClassName('widget', 'buttons')
};

WidgetButtons.HTML_PARSER = {
    buttons: function (srcNode) {
        return this._parseButtons(srcNode);
    }
};

/**
The list of button configuration properties which are specific to
`WidgetButtons` and should not be passed to `Y.Plugin.Button.createNode()`.

@property NON_BUTTON_NODE_CFG
@type Array
@static
**/
WidgetButtons.NON_BUTTON_NODE_CFG = [
    'action', 'classNames', 'context','events', 'isDefault', 'section'
];

WidgetButtons.prototype = {
    // -- Public Properties ----------------------------------------------------

    /**
    Collection of predefined buttons mapped from name => config.

    See `addButton()` for a list of possible configuration values.

    @property BUTTONS
    @type Object
    @default {}
    @since 3.5.0
    **/
    // TODO: Should this move to Y.Panel, or just CSS styling of it?
    BUTTONS: {
        close: {
            action: function () {
                this.hide();
            },

            classNames: [
                getClassName('button', 'close')
            ],

            label  : 'Close',
            section: Y.WidgetStdMod.HEADER
        }
    },

    /**
    Template which wraps all buttons of a section. This is useful for styling,
    by default it will have the CSS class: "yui3-widget-buttons".

    @property BUTTONS_TEMPLATE
    @type String
    @default "<span />"
    **/
    BUTTONS_TEMPLATE: '<span />',

    /**
    The default section to render buttons in when no section is specified.

    @property DEFAULT_BUTTONS_SECTION
    @type String
    @default Y.WidgetStdMod.FOOTER
    @since 3.5.0
    **/
    DEFAULT_BUTTONS_SECTION: Y.WidgetStdMod.FOOTER,

    // -- Lifecycle Methods ----------------------------------------------------

    initializer: function () {
        Y.after(this._bindUIButtons, this, 'bindUI');
        Y.after(this._syncUIButtons, this, 'syncUI');

        // Creates `name` -> `button` mapping and sets the `_defaultButton`.
        this._mapButtons(this.get('buttons'));
    },

    destructor: function () {
        delete this._buttonsMap;
        delete this._defaultButton;
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Adds a button to this widget.

    @method addButton
    @param {Node|Object|String} button The button to add. This can be a `Y.Node`
        instance, config Object, or String name for a predefined button on the
        `BUTTONS` prototype property. When a config Object is provided, it will
        be merged with any defaults provided by a button with the same `name`
        defined on the `BUTTONS` property. The following are the possible
        configuration properties:
      @param {Function} [button.action] The default handlers that should be
        called when the button is clicked. **Note:** Specifying an `events`
        configuration will most likely override this.
      @param {String|String[]} [button.classNames] Additional CSS class-names
        which would be added to the button node.
      @param {Object} [button.context=this] Context which any `events` or
        `action` should be called with. Defaults to `this`, the widget.
        **Note:** `e.target` will access the button node in the event handlers.
      @param {String|Object} [button.events="click"] Event name, or set of
        events and handlers to bind to the button node. **See:** `Y.Node.on()`,
        this value is passed as the first argument to `on()`.
      @param {Boolean} [button.isDefault=false] Whether the button is the
        default button.
      @param {String} [button.label] The visible text/content displayed in the
        button.
      @param {String} [button.name] A name which can later be used to reference
        this button. If a button is defined on the `BUTTONS` property with this
        same name, its configuration properties will be merged in as defaults.
      @param {String} [button.section] The `WidgetStdMod` section (header, body,
        footer) where the button should be added.
    @param {String} [section="footer"] The `WidgetStdMod` section (header, body,
        footer) where the button should be added. This takes precedence over the
        `button.section` configuration property.
    @param {Number} [index] The index at which the button should be inserted. If
        not specified, the button will be added to the end of the section.
    @chainable
    **/
    addButton: function (button, section, index) {
        var buttons = this.get('buttons'),
            sectionButtons;

        if (!Y.instanceOf(button, Y.Node)) {
            button = this._mergeButtonConfig(button);
            section || (section = button.section);
        }

        // Always passes through `_createButton()` to make sure the Node is
        // decorated as a button-Node.
        button = this._createButton(button);

        section || (section = this.DEFAULT_BUTTONS_SECTION);
        sectionButtons = buttons[section] || (buttons[section] = []);
        isNumber(index) || (index = sectionButtons.length);

        // Insert new button at the correct position.
        sectionButtons.splice(index, 0, button);

        this.set('buttons', buttons, {
            button : button,
            section: section,
            index  : index,
            src    : 'add'
        });

        return this;
    },

    /**
    Retrieves a button.

    @method getButton
    @param {Number|String} name The String-name or index of a button.
    @param {String} [section="footer"] The `WidgetStdMod` section
        (header/body/footer) where the button exists. Only applicable when
        looking for a button by numerical index.
    @return {Node} The button node.
    @since 3.5.0
    **/
    getButton: function (name, section) {
        var buttons;

        // Supports `getButton(1, 'header')` signature.
        if (isNumber(name)) {
            buttons = this.get('buttons');
            section || (section = this.DEFAULT_BUTTONS_SECTION);
            return buttons[section] && buttons[section][name];
        }

        return this._buttonsMap[name];
    },

    /**
    Retrieves the default button.

    @method getDefaultButton
    @return {Node} The default button node.
    @since 3.5.0
    **/
    getDefaultButton: function () {
        return this._defaultButton;
    },

    /**
    Removes a button from this widget.

    @method removeButton
    @param {Node|Number|String} button The button to remove. This can be a
        `Y.Node` instance, index, or String name of a button.
    @param {String} [section="footer"] The `WidgetStdMod` section
        (header/body/footer) where the button exists. Only applicable when
        removing a button by numerical index.
    @chainable
    @since 3.5.0
    **/
    removeButton: function (button, section) {
        var buttons = this.get('buttons'),
            index;

        // Shortcut if `button` is already an index which is needed for slicing.
        if (isNumber(button)) {
            section || (section = this.DEFAULT_BUTTONS_SECTION);
            index  = button;
            button = buttons[section][index];
        } else {
            // Supports `button` being the String name.
            isString(button) && (button = this._buttonsMap[button]);

            // Determines the `section` and `index` at which the button exists.
            YObject.some(buttons, function (sectionButtons, currentSection) {
                index = YArray.indexOf(sectionButtons, button);

                if (index > -1) {
                    section = currentSection;
                    return true;
                }
            });
        }

        // Remove button from `section` Array.
        buttons[section].splice(index, 1);

        this.set('buttons', buttons, {
            button : button,
            section: section,
            index  : index,
            src    : 'remove'
        });

        return this;
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Binds event listeners. AOP'd after `bindUI`.

    @method _bindUIButtons
    @protected
    **/
    _bindUIButtons: function () {
        // Bound with `bind()` to more more extensible.
        this.after('buttonsChange', Y.bind('_afterButtonsChange', this));
        this.after('visibleChange', Y.bind('_afterVisibleChangeButtons', this));
    },

    /**
    Returns a button-Node based on the specified `button` or configuration.

    TODO: Add note about it binding events, and all that jazz.

    @method _createButton
    @param {Node|Object} button Button Node or configuration object.
    @return {Node} The button Node.
    @protected
    **/
    _createButton: function (button) {
        var buttonConfig, config, i, len, nonButtonNodeCfg;

        if (Y.instanceOf(button, Y.Node)) {
            return button.plug(ButtonPlugin);
        }

        // Merge `button` config with defaults and back-compat.
        config = Y.merge({
            context: this,
            events : 'click',
            label  : button.value
        }, button);

        buttonConfig     = Y.merge(config);
        nonButtonNodeCfg = WidgetButtons.NON_BUTTON_NODE_CFG;

        // Remove all non button-Node config props.
        for (i = 0, len = nonButtonNodeCfg.length; i < len; i += 1) {
            delete buttonConfig[nonButtonNodeCfg[i]];
        }

        // Create the buton-Node using the button-Node-only config.
        button = ButtonPlugin.createNode(buttonConfig);

        // Add any CSS classnames to the button Node.
        YArray.each(YArray(config.classNames), button.addClass, button);

        // Supports all types of crazy configs for event subscriptions.
        button.on(config.events, config.action, config.context);

        // Tags the Node with the configured `name` and `isDefault` setting.
        button.setData('name', this._getButtonName(config));
        button.setData('default', this._getButtonDefault(config));

        return button;
    },

    /**
    Returns the buttons container for the specified section, and will create it
    if it does not already exist.

    @method _getButtonContainer
    @param {String} section The `WidgetStdMod` section (header/body/footer).
    @return {Node} The buttons container node for the specified `section`.
    @protected
    @see BUTTONS_TEMPLATE
    **/
    _getButtonContainer: function (section) {
        var buttonsClassName = WidgetButtons.CLASS_NAMES.buttons,
            sectionNode      = this.getStdModNode(section),
            container        = sectionNode && sectionNode.one('.' + buttonsClassName);

        // Create the `container` if it doesn't already exist.
        if (!container) {
            container = Y.Node.create(this.BUTTONS_TEMPLATE);
            container.addClass(buttonsClassName);
            this.setStdModContent(section, container, 'after');
        }

        return container;
    },

    /**
    Returns whether or not the specified `button` is configured to be default
    button.

    TODO: Add note about using `Y.Node.getData()`.

    @method _getButtonDefault
    @param {Node|Object} button The button node or configuration Object.
    @return {Boolean} Whether the button is configured to be the default button.
    @protected
    **/
    _getButtonDefault: function (button) {
        var isDefault = Y.instanceOf(button, Y.Node) ?
                button.getData('default') : button.isDefault;

        if (isString(isDefault)) {
            return isDefault.toLowerCase() === 'true';
        }

        return !!isDefault;
    },

    /**
    Returns the name of the specified `button`.

    TODO: Add note about using `Y.Node.getData()` and `Y.Node.get('name')`.

    @method _getButtonName
    @param {Node|Object} button The button node or configuration Object.
    @return {String} The name of the button.
    @protected
    **/
    _getButtonName: function (button) {
        var name;

        if (Y.instanceOf(button, Y.Node)) {
            name = button.getData('name') || button.get('name');
        } else {
            name = button && (button.name || button.type);
        }

        return name;
    },

    /**
    Getter for the `buttons` attribute. Returns a copy of the `buttons` object
    so the original state cannot be modified by callers of `get('buttons')`.

    This will recreate a copy of the `buttons` object, and each section Array.
    **Note:** The button nodes are *not* copied/cloned.

    @method _getButtons
    @param {Object} buttons The widget's current `buttons` state.
    @return {Object} A copy of the widget's current `buttons` state.
    @protected
    **/
    _getButtons: function (buttons) {
        var buttonsCopy = {};

        // Creates a new copy of the `buttons` object.
        YObject.each(buttons, function (sectionButtons, section) {
            // Creates of copy of the Array of button nodes.
            buttonsCopy[section] = sectionButtons.concat();
        });

        return buttonsCopy;
    },

    /**
    Adds the specified `button` to the buttons map (name => button), and set the
    button as the default if it is configured as the default button.

    **Note:** If two or more buttons are configured with the same `name` and/or
    configured to be the default button, the last one wins.

    @method _mapButton
    @param {Node} button The button node to map.
    @protected
    **/
    _mapButton: function (button) {
        var name      = this._getButtonName(button),
            isDefault = this._getButtonDefault(button);

        this._buttonsMap[name] = button;
        isDefault && (this._defaultButton = button);
    },

    /**
    Adds the specified `buttons` to the buttons map (name => button), and set
    the a button as the default if one is configured as the default button.

    **Note:** This will clear all previous button mappings and null-out any
    previous default button! If two or more buttons are configured with the same
    `name` and/or configured to be the default button, the last one wins.

    @method _mapButtons
    @param {Node[]} buttons The button nodes to map.
    @protected
    **/
    _mapButtons: function (buttons) {
        this._buttonsMap    = {};
        this._defaultButton = null;

        YObject.each(buttons, function (sectionButtons) {
            YArray.each(sectionButtons, this._mapButton, this);
        }, this);
    },

    /**
    Merges the specified `config` with the predefined configuration for a button
    with the same name on the `BUTTONS` property.

    @method _mergeButtonConfig
    @param {Object|String} config Button configuration object, or String name.
    @return {Object} A button configuration object merged with any defaults.
    @protected
    **/
    _mergeButtonConfig: function (config) {
        config = isString(config) ? {name: config} : Y.merge(config);

        var name      = this._getButtonName(config),
            defConfig = this.BUTTONS && this.BUTTONS[name];

        // Merge button `config` with defaults.
        if (defConfig) {
            Y.mix(config, defConfig, false, null, 0, true);
        }

        return config;
    },

    /**
    `HTML_PARSER` implementation for the `buttons` attribute.

    @method _parseButtons
    @param {Node} srcNode This widget's srcNode to search for buttons.
    @return {Object} `buttons` Config object parsed from this widget's DOM.
    @protected
    **/
    _parseButtons: function (srcNode) {
        var buttonsConfig     = null,
            buttonClassName   = WidgetButtons.CLASS_NAMES.button,
            buttonsClassName  = WidgetButtons.CLASS_NAMES.buttons,
            buttonsSelector   = '.' + buttonsClassName + ' .' + buttonClassName,
            sections          = ['header', 'body', 'footer'],
            sectionClassNames = Y.WidgetStdMod.SECTION_CLASS_NAMES,
            i, len, section, sectionNode, buttons, sectionButtons;

        // Hoisted support function out of for-loop.
        function addButtonToSection(button) {
            sectionButtons.push(button);
        }

        for (i = 0, len = sections.length; i < len; i += 1) {
            section     = sections[i];
            sectionNode = srcNode.one('.' + sectionClassNames[section]);
            buttons     = sectionNode && sectionNode.all(buttonsSelector);

            if (!buttons || buttons.isEmpty()) { continue; }

            sectionButtons = [];
            buttons.each(addButtonToSection);

            buttonsConfig || (buttonsConfig = {});
            buttonsConfig[section] = sectionButtons;
        }

        return buttonsConfig;
    },

    /**
    Setter for the `buttons` attribute. This processes the specified `config`
    and returns a new `buttons` Object which is stored as the new state; leaving
    the original, specified `config` unmodified.

    @method _setButtons
    @param {Array|Object} config The `buttons` configuration to process.
    @return {Object} The processed `buttons` Object which represents the new
        state.
    @protected
    **/
    _setButtons: function (config) {
        var defSection = this.DEFAULT_BUTTONS_SECTION,
            buttons    = {};

        function processButtons(buttonConfigs, currentSection) {
            if (!isArray(buttonConfigs)) { return; }

            var i, len, button, section;

            for (i = 0, len = buttonConfigs.length; i < len; i += 1) {
                button  = buttonConfigs[i];
                section = currentSection;

                if (!Y.instanceOf(button, Y.Node)) {
                    button = this._mergeButtonConfig(button);
                    section || (section = button.section);
                }

                // Always passes through `_createButton()` to make sure the Node
                // is decorated as a button-Node.
                button = this._createButton(button);

                // Use provided `section` or fallback to the default section.
                section || (section = defSection);

                // Add button to the Array of buttons for the specified section.
                (buttons[section] || (buttons[section] = [])).push(button);
            }
        }

        // Handle `config` being either an Array or Object of Arrays.
        if (isArray(config)) {
            processButtons.call(this, config);
        } else {
            YObject.each(config, processButtons, this);
        }

        return buttons;
    },

    /**
    Syncs the current `buttons` state to this widget's DOM. AOP'd after
    `syncUI`.

    @method _syncUIButtons
    @protected
    **/
    _syncUIButtons: function () {
        this._uiSetButtons(this.get('buttons'));
        this._uiSetVisibleButtons(this.get('visible'));
    },

    /**
    Inserts the specified `button` node into this widget's DOM at the specified
    `section` and `index`.

    @method _uiInsertButton
    @param {Node} button The button node to insert into this widget's DOM.
    @param {String} section The `WidgetStdMod` section (header/body/footer).
    @param {Number} index Index at which the `button` should be positioned.
    @protected
    **/
    _uiInsertButton: function (button, section, index) {
        var buttonsClassName = WidgetButtons.CLASS_NAMES.button,
            buttonContainer  = this._getButtonContainer(section),
            sectionButtons   = buttonContainer.all('.' + buttonsClassName);

        // Inserts the button node at the correct index.
        buttonContainer.insertBefore(button, sectionButtons.item(index));
    },

    /**
    Removes and destroys a button node from this widget's DOM.

    @method _uiRemoveButton
    @param {Node} button The button to remove and destroy.
    @protected
    **/
    _uiRemoveButton: function (button) {
        button.remove(true);
    },

    /**
    Sets the current `buttons` state to this widget's DOM by rendering the
    specified collection of `buttons`.

    Button nodes which already exist in the DOM will remain intact, or will be
    moved if they should be in a new position. Old button nodes which are no
    longer represented in the specified `buttons` collection will be removed and
    destroyed.

    @method _uiSetButtons
    @param {Object} buttons The current `buttons` state to visually represent.
    @protected
    **/
    _uiSetButtons: function (buttons) {
        var buttonClassName = WidgetButtons.CLASS_NAMES.button;

        YObject.each(buttons, function (sectionButtons, section) {
            var buttonContainer = this._getButtonContainer(section),
                buttonNodes     = buttonContainer.all('.' + buttonClassName),
                i, len, button, buttonIndex;

            for (i = 0, len = sectionButtons.length; i < len; i += 1) {
                button      = sectionButtons[i];
                buttonIndex = buttonNodes ? buttonNodes.indexOf(button) : -1;

                // Buttons already rendered in the Widget should remain there or
                // moved to their new index. New buttons will be added to the
                // current `buttonContainer`.
                if (buttonIndex > -1) {
                    // Remove button from existing buttons NodeList since its in
                    // the DOM already.
                    buttonNodes.splice(buttonIndex, 1);

                    // Check that the button is at the right position, if not,
                    // move it to its new position.
                    if (buttonIndex !== i) {
                        // Using `i + 1` because the button should be at index
                        // `i`; it's inserted before the node which comes after.
                        buttonContainer.insertBefore(button, i + 1);
                    }
                } else {
                    buttonContainer.appendChild(button);
                }
            }

            // Removes and destroys the old button nodes which are no longer
            // part of this Widget's `buttons`.
            buttonNodes.remove(true);
        }, this);
    },

    /**
    Focuses this widget's default button if there is one and this widget is
    visible.

    @method _uiSetVisibleButtons
    @param {Boolean} visible Whether this widget is visible.
    @protected
    **/
    _uiSetVisibleButtons: function (visible) {
        if (!visible) { return; }

        var defaultButton = this.getDefaultButton();
        if (defaultButton) {
            defaultButton.focus();
        }
    },

    /**
    Removes the specified `button` to the buttons map, and nulls-out the default
    button if it is currently the default button.

    @method _unMapButton
    @param {Node} button The button node to remove from the buttons map.
    @protected
    **/
    _unMapButton: function (button) {
        var map  = this._buttonsMap,
            name = this._getButtonName(button);

        // Only delete the map entry if the specified `button` is mapped to it.
        if (map[name] === button) {
            delete map[name];
        }

        // Clear the default button if its the specified `button`.
        this._defaultButton === button && (this._defaultButton = null);
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
    Handles this widget's `buttonsChange` event which fires anytime the
    `buttons` attribute is modified.

    **Note:** This method special cases the `buttons` modifications caused by
    `addButton()` and `removeButton()`, both of which set the `src` property on
    the event facade to `add` and `remove` respectively.

    @method _afterButtonsChange
    @param {EventFacade} e
    @protected
    **/
    _afterButtonsChange: function (e) {
        var button  = e.button,
            buttons = e.newVal,
            src     = e.src;

        // Special cases `addButton()` to only set and insert the new button.
        if (src === 'add') {
            this._mapButton(button);
            this._uiInsertButton(button, e.section, e.index);

            return;
        }

        // Special cases `removeButton()` to only remove the specified button.
        if (src === 'remove') {
            this._unMapButton(button);
            this._uiRemoveButton(button);

            return;
        }

        this._mapButtons(buttons);
        this._uiSetButtons(buttons);
    },

    /**
    Handles this widget's `visibleChange` event by focusing the default button
    if there is one.

    @method _afterVisibleChangeButtons
    @param {EventFacade} e
    @protected
    **/
    _afterVisibleChangeButtons: function (e) {
        this._uiSetVisibleButtons(e.newVal);
    }
};

Y.WidgetButtons = WidgetButtons;
