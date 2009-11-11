/*
when setting the value, do you leave the existing bit there, and the new piece selected?
or steal focus?
support for injecting selected suffix between the cursor and delimiter would be 
*/

YUI.add('ac-delimited', function(Y) {
    
function ACDelimited () {
    ACDelimited.superclass.constructor.apply(this, arguments);
};
Y.namespace("Plugin").ACDelimited = ACDelimited;
ACDelimited.NAME = "ACDelimited";
ACDelimited.NS = "delimited";
Y.extend(ACDelimited, Y.Plugin.Base, {
    initializer : function () {
        var host = this.get("host");
        // this is not the valueChange event, but rather a listener
        // on the host's "value" attribute is set via myAC.set("value")
        
        
    },
    destructor : function () {
        
    }
});


    
}, '@VERSION@' ,{requires:['ac-plugin']});