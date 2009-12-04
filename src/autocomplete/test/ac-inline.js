Y.add("ac-inline", function (Y) {

function ACInline () {
    ACInline.superclass.constructor.apply(this, arguments);
};
var ACPlugin = Y.namespace("Plugin").ACPlugin;
ACPlugin.Inline = ACInline;
Y.extend(ACInline, ACPlugin, {
    initializer : function () {
        ACPlugin.prototype.initializer.apply(this, arguments);
        // "open" means to fill in the first item.
        // "next" means to go to the next item
        // "previous" means to go to the previous item.
        // "close" means to remove whatever has been typed into the selected one.
        self.
    }
});




}, '@VERSION@', {requires:["ac-plugin"]});