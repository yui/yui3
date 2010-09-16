/**
 * Binds an AutoCompleteList instance to a Node instance.
 *
 * @module autocomplete
 * @submodule autocomplete-list-plugin
 * @class Plugin.AutoCompleteList
 * @extends AutoCompleteList
 */

var Plugin = Y.namespace('Plugin');

function ACListPlugin(config) {
    config = Y.mix({}, config, true); // fast shallow clone
    config.inputNode = config.host;
    AutoCompletePlugin.superclass.constructor.apply(this, arguments);
}

Y.extend(ACListPlugin, Y.AutoCompleteList, {}, {
    NAME: 'autocompleteListPlugin',
    NS  : 'aclist'
});

Plugin.AutoComplete     = ACListPlugin;
Plugin.AutoCompleteList = ACListPlugin;
