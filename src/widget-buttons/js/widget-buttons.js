var YArray  = Y.Array,
    YLang   = Y.Lang,
    YObject = Y.Object,

    getClassName = Y.ClassNameManager.getClassName,
    isArray      = YLang.isArray,
    isNumber     = YLang.isNumber,
    isString     = YLang.isString;

// TODOs:
//
// * Call into `Y.Node.button()`, make sure to blacklist config first.
// * Implement HTML_PARSER.
// * Move `BUTTONS.close` and related CSS to Panel.
// * Styling to add spacing between buttons?
//

function WidgetButtons() {}

WidgetButtons.ATTRS = {
    buttons: {
        value : {},
        setter: '_setButtons'
    }
};

WidgetButtons.CLASS_NAMES = {
    button : getClassName('button'),
    buttons: getClassName('widget', 'buttons')
};

// TODO: Implement parsing existing buttons from DOM.
WidgetButtons.HTML_PARSER = {};

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
        if (!this._stdModNode) {
            Y.error('WidgetStdMod must be added to the Widget before WidgetButtons.');
        }

        Y.after(this._bindUIButtons, this, 'bindUI');
        Y.after(this._syncUIButtons, this, 'syncUI');

        this._createButtons(this.get('buttons'));
    },

    destructor: function () {
        this._destroyButtons();

        delete this._buttons;
        delete this._buttonsMap;
        delete this._buttonsNames;
        delete this._defaultButton;
    },

    // -- Public Methods -------------------------------------------------------

    addButton: function (config, section, index) {
        var buttonsConfig = this.get('buttons');

        config = this._mergeButtonConfig(config);
        section || (section = config.section || this.DEFAULT_BUTTONS_SECTION);

        buttonsConfig[section] || (buttonsConfig[section] = []);
        isNumber(index) || (index = buttonsConfig[section].length);

        buttonsConfig[section].splice(index, 0, config);

        this.set('buttons', buttonsConfig, {
            config : config,
            section: section,
            index  : index,
            src    : 'add'
        });
    },

    getButton: function (name, section) {
        if (isNumber(name)) {
            // TODO: Reconsider having a default `section`.
            section || (section = this.DEFAULT_BUTTONS_SECTION);
            return this._buttons[section] && this._buttons[section][name];
        }

        return this._buttonsMap[name];
    },

    // -- Protected Methods ----------------------------------------------------

    _bindUIButtons: function () {
        this.after('buttonsChange', Y.bind('_afterButtonsChange', this));
        this.after('visibleChange', Y.bind('_afterVisibleChangeButtons', this));
    },

    _createButton: function (config, section, index) {
        var buttons    = this._buttons,
            classNames = YArray(config.classNames),
            context    = config.context || this,
            events     = config.events || 'click',
            label      = config.label || config.value,
            name       = this._getButtonName(config),
            button;

        button = new Y.Button(Y.merge(config, {label: label})).getNode();
        YArray.each(classNames, button.addClass, button);
        button.on(events, config.action, context);

        (buttons[section] || (buttons[section] = [])).splice(index, 0, button);
        name && (this._buttonsMap[name] = button);
        config.isDefault && (this._defaultButton = button);

        return button;
    },

    _createButtons: function (buttonsConfig) {
        this._buttons      = {};
        this._buttonsMap   = {};
        this._buttonsNames = {};

        YObject.each(buttonsConfig, function (buttons, section) {
            var i, len;

            for (i = 0, len = buttons.length; i < len; i += 1) {
                this._createButton(buttons[i], section, i);
            }
        }, this);

        return this._buttons;
    },

    _destroyButtons: function () {
        var buttonsClassName = WidgetButtons.CLASS_NAMES.buttons;
        this.get('contentBox').all('.' + buttonsClassName).empty();
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

    _getButtonName: function (config) {
        var names = this._buttonsNames,
            name  = config && (config.name || config.type);

        if (!name) {
            return null;
        }

        if (isNumber(names[name])) {
            name += (names[name] += 1);
        } else {
            names[name] = 0;
        }

        return name;
    },

    _mergeButtonConfig: function (config) {
        config = isString(config) ? {name: config} : Y.merge(config);

        var name      = config.name || config.type,
            defConfig = this.BUTTONS && this.BUTTONS[name];

        if (defConfig) {
            Y.mix(config, defConfig, false, null, 0, true);
        }

        return config;
    },

    _syncUIButtons: function () {
        // TODO: First check if buttons were parsed via HTML_PARSER.
        this._uiSetButtons(this._buttons);
    },

    _setButtons: function (config) {
        var defSection    = this.DEFAULT_BUTTONS_SECTION,
            buttonsConfig = {};

        function processButtons(buttons, currentSection) {
            var i, len, button, section;

            if (!isArray(buttons) || !buttons.length) { return; }

            for (i = 0, len = buttons.length; i < len; i += 1) {
                button  = this._mergeButtonConfig(buttons[i]);
                section = currentSection || button.section || defSection;

                buttonsConfig[section] || (buttonsConfig[section] = []);
                buttonsConfig[section].push(button);
            }
        }

        if (isArray(config)) {
            processButtons.call(this, config);
        } else {
            YObject.each(config, processButtons, this);
        }

        return buttonsConfig;
    },

    _uiInsertButton: function (button, section, index) {
        var buttonsClassName = WidgetButtons.CLASS_NAMES.button,
            buttonContainer  = this._getButtonContainer(section),
            sectionButtons   = buttonContainer.all('.' + buttonsClassName);

        buttonContainer.insertBefore(button, sectionButtons.item(index));

        if (this.get('visible') && button === this._defaultButton) {
            button.focus();
        }
    },

    _uiSetButtons: function (buttons) {
        YObject.each(buttons, function (sectionButtons, section) {
            var buttonContainer = this._getButtonContainer(section),
                defaultButton   = this._defaultButton,
                fragment        = Y.one(Y.config.doc.createDocumentFragment()),
                i, len;

            for (i = 0, len = sectionButtons.length; i < len; i += 1) {
                fragment.appendChild(sectionButtons[i]);
            }

            buttonContainer.appendChild(fragment);

            if (this.get('visible') && defaultButton) {
                defaultButton.focus();
            }
        }, this);
    },

    // -- Protected Event Handlers ---------------------------------------------

    _afterButtonsChange: function (e) {
        var button;

        if (e.src === 'add') {
            button = this._createButton(e.config, e.section, e.index);
            this._uiInsertButton(button, e.section, e.index);
        } else {
            this._destroyButtons();
            this._createButtons(e.newVal);
            this._uiSetButtons(this._buttons);
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
