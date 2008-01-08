(function() {
    var WidgetAttribute = function(name, config) {
        WidgetAttribute.superclass.constructor.apply(this, arguments);
        if (this.postRender) {
            this.owner.on('render', this.handleRender, this, true);
        }
    };

    var proto = {
        postRender: false,

        handleRender: function() {
            this.setValue(this._value);
            delete this._value;
        },

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


