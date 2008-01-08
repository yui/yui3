(function() {
    var WidgetAttribute = function() {
        WidgetAttribute.superclass.constructor.apply(this, arguments);
    };

    var proto = {
        postRender: false,

        setValue: function(val) {
            if (this.postRender && !this.owner._rendered) {
                this._value = val; // store to set on render
            } else {
                WidgetAttribute.superclass.setValue.apply(this, arguments);
            }
        },
        _value: undefined
    };

    YAHOO.lang.extend(WidgetAttribute, YAHOO.util.Attribute, proto);
    YAHOO.widget.WidgetAttribute = WidgetAttribute;
})();


