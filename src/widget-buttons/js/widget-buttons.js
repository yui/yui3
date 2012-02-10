var YArray  = Y.Array,
    YLang   = Y.Lang,
    YObject = Y.Object,

    getClassName = Y.ClassNameManager.getClassName,
    isArray      = YLang.isArray,
    isNumber     = YLang.isNumber,
    isString     = YLang.isString;

// TODOs:
//
// * Call into `Y.Node.button()`:
//   * Make sure to blacklist config first.
//   * Pass along `name` from config.
//   * Set `name` and `default` as Node data.
// * Move `BUTTONS.close` and related CSS to Panel.
// * Styling to add spacing between buttons?
//

function WidgetButtons() {
    if (!this._stdModNode) {
        Y.error('WidgetStdMod must be added to the Widget before WidgetButtons.');
    }
}

WidgetButtons.ATTRS = {
    buttons: {
        value            : {},
        setter           : '_setButtons',
        cloneDefaultValue: 'shallow'
    }
};

WidgetButtons.CLASS_NAMES = {
    button : getClassName('button'),
    buttons: getClassName('widget', 'buttons')
};

// TODO: Implement parsing existing buttons from DOM.
WidgetButtons.HTML_PARSER = {
    buttons: function () {
        return this._parseButtons();
    }
};

WidgetButtons.prototype = {
    // -- Public Properties ----------------------------------------------------

    // TODO: Move this to Y.Panel.
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

    BUTTONS_TEMPLATE: '<span />',

    DEFAULT_BUTTONS_SECTION: Y.WidgetStdMod.FOOTER,

    // -- Protected Properties -------------------------------------------------

    // -- Lifecycle Methods ----------------------------------------------------

    initializer: function () {
        Y.after(this._bindUIButtons, this, 'bindUI');
        Y.after(this._syncUIButtons, this, 'syncUI');
    },

    destructor: function () {
        delete this._buttonsMap;
        delete this._buttonsNames;
        delete this._defaultButton;
    },

    // -- Public Methods -------------------------------------------------------

    addButton: function (button, section, index) {
        var buttons = this.get('buttons'),
            sectionButtons;

        if (!Y.instanceOf(button, Y.Node)) {
            button = this._mergeButtonConfig(button);
        }

        section || (section = button.section || this.DEFAULT_BUTTONS_SECTION);
        sectionButtons = buttons[section] || (buttons[section] = []);
        isNumber(index) || (index = sectionButtons.length);

        sectionButtons.splice(index, 0, button);

        this._modifyButtons = true;

        this.set('buttons', buttons, {
            button : button,
            section: section,
            index  : index,
            src    : 'add'
        });

        delete this._modifyButtons;
    },

    getButton: function (name, section) {
        var buttons;

        if (isNumber(name)) {
            buttons = this.get('buttons');
            // TODO: Reconsider having a default `section`.
            section || (section = this.DEFAULT_BUTTONS_SECTION);
            return buttons[section] && buttons[section][name];
        }

        return this._buttonsMap[name];
    },

    getDefaultButton: function () {
        return this._defaultButton;
    },

    // -- Protected Methods ----------------------------------------------------

    _bindUIButtons: function () {
        this.after('buttonsChange', Y.bind('_afterButtonsChange', this));
        this.after('visibleChange', Y.bind('_afterVisibleChangeButtons', this));
    },

    _createButton: function (config) {
        var classNames = YArray(config.classNames),
            context    = config.context || this,
            events     = config.events || 'click',
            label      = config.label || config.value,
            button;

        button = new Y.Button(Y.merge(config, {label: label})).getNode();
        button.setData('name', config.name);
        button.setData('default', config.isDefault);

        YArray.each(classNames, button.addClass, button);
        button.on(events, config.action, context);

        return button;
    },

    _getButtonContainer: function (section) {
        var buttonsClassName = WidgetButtons.CLASS_NAMES.buttons,
            sectionNode      = this.getStdModNode(section),
            container        = sectionNode && sectionNode.one('.' + buttonsClassName);

        if (!container) {
            container = Y.Node.create(this.BUTTONS_TEMPLATE);
            container.addClass(buttonsClassName);
            this.setStdModContent(section, container, 'after');
        }

        return container;
    },

    _getButtonName: function (button) {
        var name;

        if (Y.instanceOf(button, Y.Node)) {
            name = button.getData('name') || button.get('name');
        } else {
            name = button && (button.name || button.type);
        }

        return name;
    },

    _getButtonNodes: function (section) {
        var buttonClassName  = WidgetButtons.CLASS_NAMES.button,
            buttonsClassName = WidgetButtons.CLASS_NAMES.buttons,
            sectionClassName = Y.WidgetStdMod.SECTION_CLASS_NAMES[section],
            contentBox       = this.get('contentBox'),
            sectionNode      = contentBox.one('.' + sectionClassName),
            buttons;

        buttons = sectionNode &&
            sectionNode.all('.' + buttonsClassName + ' .' + buttonClassName);

        return buttons || new Y.NodeList();
    },

    _mergeButtonConfig: function (config) {
        config = isString(config) ? {name: config} : Y.merge(config);

        var name      = this._getButtonName(config),
            defConfig = this.BUTTONS && this.BUTTONS[name];

        if (defConfig) {
            Y.mix(config, defConfig, false, null, 0, true);
        }

        return config;
    },

    _mapButton: function (name, button) {
        if (!name) { return; }

        var names = this._buttonsNames;

        if (isNumber(names[name])) {
            name += (names[name] += 1);
        } else {
            names[name] = 0;
        }

        this._buttonsMap[name] = button;
    },

    _parseButtons: function () {
        var buttonsConfig = {},
            sections      = ['header', 'body', 'footer'],
            i, len, section, buttons, sectionButtons;

        for (i = 0, len = sections.length; i < len; i += 1) {
            section = sections[i];
            buttons = this._getButtonNodes(section);

            if (buttons.isEmpty()) { continue; }

            sectionButtons = [];
            buttons.each(function (button) {
                sectionButtons.push(button);
            });

            buttonsConfig[section] = sectionButtons;
        }

        return buttonsConfig;
    },

    _setButton: function (buttons, button, section, index) {
        var config  = {},
            isDefault, name, sectionButtons;

        if (Y.instanceOf(button, Y.Node)) {
            name      = this._getButtonName(button);
            isDefault = button.getData('default');
        } else {
            config    = this._mergeButtonConfig(button);
            button    = this._createButton(config);
            name      = this._getButtonName(config);
            isDefault = config.isDefault;
        }

        this._mapButton(name, button);
        isDefault && (this._defaultButton = button);

        section || (section = config.section || this.DEFAULT_BUTTONS_SECTION);
        sectionButtons = buttons[section] || (buttons[section] = []);
        isNumber(index) || (index = sectionButtons.length);

        sectionButtons[index] = button;

        return button;
    },

    _setButtons: function (config) {
        if (this._modifyButtons) { return config; }

        var buttons = {};

        this._buttonsMap    = {};
        this._buttonsNames  = {};
        this._defaultButton = null;

        function processButtons(sectionButtons, section) {
            if (!isArray(sectionButtons)) { return; }

            var i, len;

            for (i = 0, len = sectionButtons.length; i < len; i += 1) {
                this._setButton(buttons, sectionButtons[i], section);
            }
        }

        if (isArray(config)) {
            processButtons.call(this, config);
        } else {
            YObject.each(config, processButtons, this);
        }

        return buttons;
    },

    _syncUIButtons: function () {
        // TODO: First check if buttons were parsed via HTML_PARSER.
        this._uiSetButtons(this.get('buttons'));
    },

    _uiInsertButton: function (button, section, index) {
        var buttonsClassName = WidgetButtons.CLASS_NAMES.button,
            buttonContainer  = this._getButtonContainer(section),
            sectionButtons   = buttonContainer.all('.' + buttonsClassName);

        buttonContainer.insertBefore(button, sectionButtons.item(index));
    },

    _uiSetButtons: function (buttons) {
        YObject.each(buttons, function (sectionButtons, section) {
            var buttonContainer = this._getButtonContainer(section),
                buttonNodes     = this._getButtonNodes(section),
                i, len, button, buttonIndex;

            for (i = 0, len = sectionButtons.length; i < len; i += 1) {
                button      = sectionButtons[i];
                buttonIndex = buttonNodes.indexOf(button);

                if (buttonIndex > -1) {
                    buttonNodes.splice(buttonIndex, 1);
                    if (buttonIndex !== i) {
                        buttonContainer.insertBefore(button, i);
                    }
                } else {
                    buttonContainer.appendChild(button);
                }
            }

            buttonNodes.destroy(true);
        }, this);
    },

    // -- Protected Event Handlers ---------------------------------------------

    _afterButtonsChange: function (e) {
        var buttons = e.newVal,
            button;

        if (e.src === 'add') {
            button = this._setButton(buttons, e.button, e.section, e.index);
            this._uiInsertButton(button, e.section, e.index);
        } else {
            this._uiSetButtons(buttons);
        }
    },

    _afterVisibleChangeButtons: function (e) {
        var defaultButton = this._defaultButton;
        if (defaultButton && e.newVal) {
            defaultButton.focus();
        }
    }
};

Y.WidgetButtons = WidgetButtons;
