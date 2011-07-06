YUI.add('slider-ticks', function(Y) {

Y.Plugin.SliderTicks = Y.Base.create('ticks', Y.Plugin.Base, [], {
    CONTAINER_TEMPLATE:
        '<table class="{tableClass}">' + 
            '<thead><tr></tr></thead>' +
        '</table>',

    TICK_TEMPLATE:
        '<th class="{tickClass}">' +
            '<label>{value}</label>' +
        '</th>',

    initializer: function () {
        if (this.get('host').get('rendered')) {
            this.renderUI();
            this.bindUI();
            this.syncUI();
        } else {
            this.afterHostMethod('renderUI', this.renderUI);
            this.afterHostMethod('bindUI', this.bindUI);
        }
        this.afterHostMethod('syncUI', this.syncUI);
    },

    renderUI: function () {
        this._renderTickContainer();
    },

    _renderTickContainer: function () {
        var host = this.get('host'),
            rail = host.get('contentBox').one('.' +
                    host.getClassName('rail'));

        this._container = Y.Node.create(Y.Lang.sub(
            this.CONTAINER_TEMPLATE, {
                tableClass: host.getClassName('tick','container')
            }));

        rail.insert(this._container, 'before');
    },

    bindUI: function () {
        this.afterHostEvent('lengthChange',this._afterHostLengthChange);
        this.afterHostEvent('minChange', this._afterHostAttrChange);
        this.afterHostEvent('maxChange', this._afterHostAttrChange);

        this.after('valuesChange', this._afterValuesChange);

        if (this.get('stickyValues')) {
            this._setThumbTicks(true);
        }
    },

    syncUI: function () {
        var length = this.get('host').get('length'),
            values = this.get('values');

        this._renderTicks();
        this._setContainerWidth(length, values);
    },

    _renderTicks: function () {
        var host   = this.get('host'),
            values = this.get('values'),
            min    = host.get('min'),
            max    = host.get('max'),
            inc    = (max - min) / (values - 1),
            tmpl   = '',
            i;
            
        for (i = 0; i < values; ++i) {
            tmpl += Y.Lang.sub(this.TICK_TEMPLATE, {
                tickClass: host.getClassName('tick'),
                value: Math.min(Math.round(min + (i * inc)), max)
            });
        }

        this._container.setContent(tmpl);
    },

    _afterHostLengthChange: function (e) {
        this._setContainerWidth(e.newVal, this.get('values'));
    },

    _afterHostAttrChange: function (e) {
        this.syncUI();
    },

    _afterValuesChange: function (e) {
        var length = this.get('host').get('length');

        this._setContainerWidth(length, e.newVal);
    },

    _setContainerWidth: function (length, values) {
        length = parseInt(length, 10);

        // values * floor((length - thumb width) / (values - 1))
        var thumbWidth = this.get('host').thumb.get('offsetWidth') -
                         this.get('thumbDelta'),
            width = values * Math.floor(
                (length - thumbWidth) / (values - 1));

        this._container.setStyles({
            width: width + 'px',
            marginLeft: (thumbWidth / 2) + 'px'
        });
    },

    _setThumbTicks: function (on) {
        //var dd = this.get('host')._dd;
        // TODO: use AOP on the dd method to align to ticks?
        if (on) {
        } else {
        }
    },

    destructor: function () {
        this._container.remove().destroy(true);
        
        if (this.get('stickyValues')) {
            this._setThumbTicks(false);
        }
    }

}, {
    NS: 'ticks',

    ATTRS: {
        values: {
            value: 5,
            validator: Y.Lang.isNumber
        },

        stickyValues: {
            value: false,
            validator: Y.Lang.isBoolean,
            writeOnce: true
        },

        thumbDelta: {
            value: 2,
            validator: Y.Lang.isNumber
        }
    }
});


}, '@VERSION@' ,{requires:['range-slider', 'base-build', 'plugin']});
