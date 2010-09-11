/*global YUI*/
/*jslint browser: true, onevar: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */

YUI.add('autocomplete-list', function (Y) {

/**
 * Basic AutoComplete dropdown list widget.
 *
 * @module autocomplete
 * @submodule autocomplete-list
 * @class AutoCompleteList
 * @extends Widget
 * @uses AutoCompleteBase
 * @constructor
 * @param {Object} config Configuration object.
 */

var Node   = Y.Node,
    YArray = Y.Array,

    getClassName = Y.ClassNameManager.getClassName,

    EMPTY_STRING = '',
    INPUT        = 'input',
    INPUT_NODE   = 'inputNode',
    NAME         = 'autocomplete',
    TRAY         = 'tray',
    TRAY_NODE    = 'trayNode';

Y.AutoCompleteList = Y.Base.create(NAME, Y.Widget, [Y.AutoCompleteBase], {
    // -- Lifecycle Prototype Methods ------------------------------------------
    initializer: function () {
        this._events = [];
    },

    destructor: function () {
        this._unbindInput(this.get(INPUT_NODE));

        while (this._events.length) {
            this._events.pop().detach();
        }
    },

    bindUI: function () {
        this._bindInput(this.get(INPUT_NODE));

        this._events.concat([
            this.after('clear', this._afterClear, this),
            this.after('results', this._afterResults, this)
        ]);
    },

    renderUI: function () {
        this._contentBox = this.get('contentBox');

        this._renderInput();
        this._renderTray();
    },

    syncUI: function () {
    },

    // -- Public Prototype Methods ---------------------------------------------
    clearTray: function () {
        this._trayNode.setContent(EMPTY_STRING);
    },

    // -- Protected Prototype Methods ------------------------------------------

    _renderInput: function () {
        var input = this._inputNode = this.get(INPUT_NODE);

        if (!input) {
            this.set(INPUT_NODE, input = this._inputNode = Node.create('<input type="text">'));
            this._contentBox.appendChild(input);
        }

        input.addClass(this.getClassName(INPUT));

        // See http://www.w3.org/WAI/PF/aria/roles#combobox
        input.setAttrs({
            'aria-autocomplete': 'list',
            role: 'combobox'
        });
    },

    // TODO: tray should probably be a separate child widget.
    _renderTray: function () {
        var tray = this._trayNode = this.get(TRAY_NODE);

        if (!tray) {
            this.set(TRAY_NODE, tray = this._trayNode = Node.create('<ul/>'));
            this._contentBox.appendChild(tray);
        }

        tray.addClass(this.getClassName(TRAY));

        // See http://www.w3.org/WAI/PF/aria/roles#combobox
        tray.set('role', 'listbox');
    },

    // -- Protected Event Handlers ---------------------------------------------

    _addResult: function (result) {
        var resultNode = Node.create('<li role="option">' + result + '</li>');
        resultNode.addClass(this.getClassName('result'));

        this._trayNode.append(resultNode);
    },

    _afterClear: function () {
        this.clearTray();
    },

    _afterResults: function (e) {
        this.clearTray();
        YArray.each(e.results, this._addResult, this);
    }
}, {
    ATTRS: {
        trayNode: {
            setter: Y.one
        }
    },

    HTML_PARSER: {
        // Finds the first input element with class "yui3-autocomplete-input",
        // and falls back to the first input element period if one with that
        // class name isn't found.
        inputNode: 'input.' + getClassName(NAME, INPUT) + ',input',

        trayNode: getClassName(NAME, TRAY)
    }
});

}, '@VERSION@', {
    requires: ['autocomplete-base', 'base-build', 'widget']
});
