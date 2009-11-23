// just a default display widget for the autocomplete component
// this is the one you expect when you say "autocomplete"
YUI.add('ac-widget', function(Y) {

function ACWidget () { ACWidget.superclass.constructor.apply(this, arguments) };

Y.ACWidget = Y.extend(
    ACWidget,
    Widget,
    { // prototype
        
    },
    { // statics
        NAME : "ACWidget",
        HTML_PARSER : {
            
        },
        ATTRS : {
            
        }
    }
);

}, '@VERSION', {
    requires : ['widget']
});