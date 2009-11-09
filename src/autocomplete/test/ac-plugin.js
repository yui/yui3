YUI.add('ac-plugin', function(Y) {

function ACPlugin () {
    ACPlugin.superclass.constructor.apply(this, arguments);
};
Y.namespace("Plugin").ACPlugin = ACPlugin;
Y.augment(ACPlugin, Y.EventTarget);
ACPlugin.NAME = "ACPlugin";
ACPlugin.NS = "ac";

Y.extend(ACPlugin, Y.Plugin.Base, {
    initializer : function () {
        
    },
    destructor : function () {
        
    }
});

ACPlugin.ATTRS = {
    
};



}, '@VERSION@' ,{requires:['node-base', 'plugin', 'value-change', 'event-key']});
/*
when setting the value, do you leave the existing bit there, and the new piece selected?
or steal focus?
support for injecting selected suffix between the cursor and delimiter would be 
*/