/**
 * Binds an AutoComplete instance to a Node instance.
 *
 * @module autocomplete
 * @class Plugin.AutoComplete
 * @extends AutoComplete
 * @submodule autocomplete-plugin
 */

function AutoCompletePlugin(config) {
    config = Y.mix({}, config, true); // fast shallow clone
    config.inputNode = config.host;
    AutoCompletePlugin.superclass.constructor.apply(this, arguments);
}

Y.namespace('Plugin').AutoComplete = Y.extend(AutoCompletePlugin, Y.AutoComplete, {}, {
    NAME: 'autocompletePlugin',
    NS  : 'ac'
});
