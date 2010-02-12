/**
 * Create a sliding value range input visualized as a draggable thumb on a
 * background element.
 * 
 * @module slider
 */

var VALUE = 'value';

/**
 * Create a slider to represent an integer value between a given minimum and
 * maximum.  Sliders may be aligned vertically or horizontally, based on the
 * <code>axis</code> configuration.
 *
 * @class Slider
 * @extends Widget
 * @param config {Object} Configuration object
 * @constructor
 */
function Slider() {
    Slider.superclass.constructor.apply(this,arguments);
}

Y.Slider = Y.extend(Slider, Y.Widget, {

    // Y.Slider prototype

    /**
     * Construction logic executed durint Slider instantiation. Subscribes to
     * after events for min, max, and railSize.  Publishes custom events
     * including slideStart and slideEnd.
     *
     * @method initializer
     * @protected
     */
    initializer : function () {
        //this.on( 'render', this._onRender );
    },

    /**
     * Create the DOM structure for the Slider.
     *
     * @method renderUI
     * @protected
     */
    renderUI : function () {
        var contentBox = this.get( 'contentBox' );

        this.rail = this._renderRail();

        this._uiSetRailSize();

        this.thumb = this._renderThumb();

        this.rail.appendChild( this.thumb );
        // @TODO: insert( contentBox, 'replace' ) or setContent?
        contentBox.appendChild( this.rail );

        // <span class="yui3-slider-x">
        contentBox.addClass( this.getClassName( this.axis ) );
    },

    _renderRail: function () {
        var minCapClass = this.getClassName( 'rail', 'cap', this._minEdge ),
            maxCapClass = this.getClassName( 'rail', 'cap', this._maxEdge );

        return Y.Node.create(
            Y.substitute( this.RAIL_TEMPLATE, {
                railClass      : this.getClassName( 'rail' ),
                railMinCapClass: minCapClass,
                railMaxCapClass: maxCapClass
            } ) );
    },

    _uiSetRailSize: function () {
        this.rail.setStyle( this._dim, this._dim );
    },

    _renderThumb: function () {
        var imageUrl = this.get( 'thumbUrl' );

        return Y.Node.create(
            Y.substitute( this.THUMB_TEMPLATE, {
                thumbClass      : this.getClassName( 'thumb' ),
                thumbShadowClass: this.getClassName( 'thumb', 'shadow' ),
                thumbImageClass : this.getClassName( 'thumb', 'image' ),
                thumbShadowUrl  : imageUrl,
                thumbImageUrl   : imageUrl
            } ) );
    },

    /**
     * Creates the Y.DD.Drag instance used to handle the thumb movement and
     * binds Slider interaction to the configured value model.
     *
     * @method bindUI
     * @protected
     */
    bindUI : function () {
        this._bindThumbDD();

        this._bindValuePlugin();

        this.after( 'disabledChange', this._afterDisabledChange );
        this.after( this._dim + 'Change', this._afterLengthChange );
    },

    _bindThumbDD: function () {
        var config = { constrain: this.rail };
        
        // { constrain: rail, stickX: true }
        config[ 'stick' + this.axis.toUpperCase() ] = true;

        this._dd = new Y.DD.Drag( {
            node   : this.thumb,
            bubble : false,
            on     : {
                'drag:start': Y.bind( this._onDragStart, this )
            },
            after  : {
                'drag:drag' : Y.bind( this._afterDrag,    this ),
                'drag:end'  : Y.bind( this._afterDragEnd, this )
            }
        } );

        // Constrain the thumb to the rail
        this._dd.plug( Y.Plugin.DDConstrained, config );
    },

    _bindValuePlugin: function () {
        var valuePlugin = this.get( 'valuePlugin' ),
            config      = {
                min  : this.min,
                max  : this.max,
                after: {
                    // Subscriptions to bring plugin changes here
                    minChange  : Y.rbind( this._afterPluginMinChange, this ),
                    maxChange  : Y.rbind( this._afterPluginMaxChange, this ),
                    valueChange: Y.rbind( this._afterPluginValueChange, this )
                }
            };

        // Let the valuePlugin default the value unless it's been set via
        // configuration.
        if ( this.value !== null ) {
            config.value = this.value;
        }

        this._dd.plug( valuePlugin, config );

        // Loop back subscriptions to sync slider attr changes into the plugin
        this.after( {
            minChange  : this._afterMinChange,
            maxChange  : this._afterMaxChange,
            valueChange: this._afterValueChange
        } );

    },

    _onDragStart: function ( e ) {
        /**
         * Signals the beginning of a thumb drag operation.  Payload includes
         * the DD.Drag instance's drag:start event and the current value.
         *
         * @event slideStart
         * @param event {Event.Facade} An Event Facade object with the
         *                  following properties added:
         *  <dl>
         *      <dt>ddEvent</dt>
         *          <dd><code>drag:start</code> event from the managed DD.Drag
         *          instance</dd>
         *      <dt>value</dt>
         *          <dd>The <code>value</code> associated to the thumb's
         *          current position</dd>
         *  </dl>
         */
        this.fire( 'slideStart', { ddEvent: e, value: this.value } );
    },

    _afterDrag: function ( e ) {
        /**
         * Signals that the thumb has moved.  Payload includes the DD.Drag
         * instance's <code>drag:drag</code> event and the current value.
         *
         * @event thumbMove
         * @param event {Event.Facade} An Event Facade object with the
         *                  following properties added:
         *  <dl>
         *      <dt>ddEvent</dt>
         *          <dd><code>drag:drag</code> event from the managed DD.Drag
         *          instance</dd>
         *      <dt>value</dt>
         *          <dd>The <code>value</code> associated to the thumb's
         *          current position</dd>
         *  </dl>
         */
        this.fire( 'thumbMove', { ddEvent: e, value: this.value } );
    },

    _afterDragEnd: function ( e ) {
        /**
         * Signals the end of a thumb drag operation.  Payload includes
         * the DD.Drag instance's drag:end event and the current value.
         *
         * @event slideEnd
         * @param event {Event.Facade} An Event Facade object with the
         *                  following properties added:
         *  <dl>
         *      <dt>ddEvent</dt>
         *          <dd><code>drag:end</code> event from the managed DD.Drag
         *          instance</dd>
         *      <dt>value</dt>
         *          <dd>The <code>value</code> associated to the thumb's
         *          current position</dd>
         *  </dl>
         */
        this.fire( 'slideEnd', { ddEvent: e, value: this.value } );
    },

    _afterPluginMinChange: function ( e ) {
        this.set( 'min', e.newVal, { fromPlugin: true } );
    },

    _afterMinChange: function ( e ) {
        if ( !e.fromPlugin && this._dd ) {
            this._dd._val.set( 'min', e.newVal );
        }
    },

    _afterPluginMaxChange: function ( e ) {
        this.set( 'max', e.newVal, { fromPlugin: true } );
    },

    _afterMaxChange: function ( e ) {
        if ( !e.fromPlugin && this._dd ) {
            this._dd._val.set( 'max', e.newVal );
        }
    },

    _afterPluginValueChange: function ( e ) {
        this.set( VALUE, e.newVal, { fromPlugin: true } );
    },

    _afterValueChange: function ( e ) {
        if ( !e.fromPlugin && this._dd ) {
            this._dd._val.set( VALUE, e.newVal );
        }
    },

    _afterDisabledChange: function ( e ) {
        this._dd.set( 'lock', true );
    },

    _afterLengthChange: function ( e ) {
        this._uiSetRailSize();
    },

    /**
     * Synchronizes the DOM state with the attribute settings (most notably
     * railSize and value).  If thumbImage is provided and is still loading,
     * sync is delayed until it is complete, since the image's dimensions are
     * taken into consideration for calculations.
     *
     * @method syncUI
     */
    syncUI : function () {
        this._dd[ this.get( 'valuePlugin' ).NS ].syncDragNode();

        // Forces a reflow of the bounding box to address IE8 inline-block
        // container not expanding correctly. bug 2527905
        //this.get('boundingBox').toggleClass('');
    },

    /**
     * Convenience method for accessing the current value of the Slider.
     * Equivalent to <code>slider.get(&quot;value&quot;)</code>.
     *
     * @method getValue
     * @return {Number} the value
     */
    getValue : function () {
        return this.get( VALUE );
    },

    /**
     * Convenience method for updating the current value of the Slider.
     * Equivalent to <code>slider.set(&quot;value&quot;,val)</code>.
     *
     * @method setValue
     * @param val {Number} the new value
     */
    setValue : function ( val ) {
        this.set( VALUE, val );
    },

    /**
     * Validator applied to new values for the axis attribute. Only
     * &quot;x&quot; and &quot;y&quot; are permitted.
     *
     * @method _validateNewAxis
     * @param v {String} proposed value for the axis attribute
     * @return Boolean
     * @protected
     */
    _validateNewAxis : function (v) {
        return Y.Lang.isString( v ) && 'xXyY'.indexOf( v.charAt( 0 ) ) > -1;
    },

    /**
     * Setter applied to the input when updating the axis attribute.
     *
     * @method _setAxisFn
     * @param v {String} proposed value for the axis attribute
     * @return {String} lowercased first character of the input string
     * @protected
     */
    _setAxisFn : function (v) {
        this.axis = v.charAt(0).toLowerCase();

        var vertical = ( this.axis === 'y' );

        this._dim =     ( vertical ) ? 'height' : 'width';
        this._minEdge = ( vertical ) ? 'top'    : 'left';
        this._maxEdge = ( vertical ) ? 'bottom' : 'right';

        return this.axis;
    },

/*
    _onRender: function ( e ) {
        var destNode = e.parentNode ||
                       this.get( 'boundingBox' ) ||
                       this.get( 'contentBox' ).
            hidden = false;

        destNode = Y.Lang.isString( destNode ) ?  Y.one( destNode ) : destNode;

        if ( destNode ) {
            hidden = !destNode.inDoc() && destNode.ancestor( function ( n ) {
                return ( n.getComputedStyle( 'display' ) === 'none' );
            } );
        }

        // Disallow rendering in a hidden container
        if ( hidden ) {
            e.preventDefault();
        }
    },
*/

    _initThumbUrlFn: function () {
        return Y.config.base + 
                  'slider/assets/skins/sam/thumb-' + this.axis + '.png';
    },

    _getMin: function () {
        return ( this._dd ) ? this._dd._val.get( 'min' ) : this.min;
    },

    _setMin: function ( v, o ) {
        this.min = v;
        return v;
    },

    _getMax: function () {
        return ( this._dd ) ? this._dd._val.get( 'max' ) : this.max;
    },

    _setMax: function ( v, o ) {
        this.max = v;
        return v;
    },

    _getValue: function () {
        return ( this._dd ) ? this._dd._val.get( VALUE ) : this.value;
    },

    _setValue: function ( v, o ) {
        this.value = v;
        return v;
    },

    BOUNDING_TEMPLATE : '<span></span>',

    CONTENT_TEMPLATE  : '<span></span>',

    RAIL_TEMPLATE     : '<span class="{railClass}">' +
                            '<span class="{railMinCapClass}"></span>' +
                            '<span class="{railMaxCapClass}"></span>' +
                        '</span>',

    THUMB_TEMPLATE    : '<span class="{thumbClass}" tabindex="-1">' +
                            '<img src="{thumbShadowUrl}" ' +
                                'alt="Slider thumb shadow" ' +
                                'class="{thumbShadowClass}">' +
                            '<img src="{thumbImageUrl}" ' +
                                'alt="Slider thumb" ' +
                                'class="{thumbImageClass}">' +
                        '</span>',

    min: 0,
    max: 100,
    value: null

}, {

    // Y.Slider static properties

    /**
     * The identity of the widget.
     *
     * @property Slider.NAME
     * @type String
     * @static
     */
    NAME : 'slider',

    /**
     * Static property used to define the default attribute configuration of
     * the Widget.
     *
     * @property Slider.ATTRS
     * @type Object
     * @protected
     * @static
     */
    ATTRS : {

        /**
         * Axis upon which the Slider's thumb moves.  &quot;x&quot; for
         * horizontal, &quot;y&quot; for vertical.
         *
         * @attribute axis
         * @type String
         * @default &quot;x&quot;
         * @writeOnce
         */
        axis : {
            value     : 'x',
            writeOnce : true,
            validator : '_validateNewAxis',
            setter    : '_setAxisFn',
            lazyAdd   : false
        },

        /**
         * Value associated with the left or top most position of the thumb on
         * the rail.  Defers to the valuePlugin logic.
         *
         * @attribute min
         * @type Number
         * @default 0
         */
        min : {
            getter : '_getMinFn',
            setter : '_setMinFn',
            lazyAdd: false
        },

        /**
         * Value associated with the right or bottom most position of the thumb
         * on the rail.  Defers to the valuePlugin logic.
         *
         * @attribute max
         * @type Number
         * @default 100
         */
        max : {
            getter : '_getMaxFn',
            setter : '_setMaxFn',
            lazyAdd: false
        },

        /**
         * The current value of the Slider.  This value is interpretted into a
         * position for the thumb along the Slider's rail.  Defers to the
         * valuePlugin logic.
         *
         * @attribute value
         * @type Number
         * @default 0
         */
        value: {
            getter : '_getValueFn',
            setter : '_setValueFn',
            lazyAdd: false
        },

        /**
         * DD plugin to translate thumb position to a value and vice versa.
         *
         * @attribute valuePlugin
         * @type { Function }
         * @default Y.Plugin.DDValue
         */
        valuePlugin: {
            value: Y.Plugin.DDValue,
            validator: Y.Lang.isFunction
        },

        thumbUrl: {
            valueFn: '_initThumbUrlFn',
            validator: Y.Lang.isString
        }
    }
});
