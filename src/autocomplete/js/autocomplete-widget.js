YUI.add('autocomplete-widget', function (Y) {

/**
 * Base widget implementation for AutoComplete.
 *
 * @module autocomplete
 * @submodule autocomplete-widget
 * @class AutoComplete
 * @extends Widget
 * @constructor
 * @param {Object} config Configuration object.
 * @since 3.3.0
 */

var ACBase = Y.AutoCompleteBase,

    INPUT_NODE = 'inputNode',

AutoComplete = Y.Base.create('autocomplete', Y.Widget, [ACBase], {
    initializer: function () {
        this._bindInput(this.get(INPUT_NODE));
    },

    destructor: function () {
        this._unbindInput(this.get(INPUT_NODE));
    }
}, {
    ATTRS: {
    }
});

Y.AutoComplete = AutoComplete;

}, '@VERSION@', {
    requires: ['autocomplete-base', 'base-build', 'widget']
});
