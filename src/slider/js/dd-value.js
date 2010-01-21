// Constants for compression or performance
var HOST      = 'host',
    DRAG_NODE = 'dragNode',

    MIN       = 'min',
    MAX       = 'max',
    VALUE     = 'value',

    round = Math.round;

/**
 * DD plugin to associate a value with the current draggable element's position.
 *
 * @module dd
 * @submodule dd-value
 */

function DDValue() {
    DDValue.superclass.constructor.apply( this, arguments );
}

Y.Plugin.DDValue = Y.extend( DDValue, Y.Plugin.Base, {

    // DDValue prototype

    /**
     * Map to property names based on <code>valueFromAxis</code> for use in
     * calculation and accessing event info.
     *
     * @property _key
     * @type { Object }
     * @protected
     */
    _key: null,

    /**
     * Cached X or Y offset for the constraining element to avoid extraneous
     * <code>getXY()</code> calls during run time calculation.
     *
     * @property _offsetXY
     * @type { Number }
     * @protected
     */
    _offsetXY: null,


    /**
     * Factor used to translate value -&gt; position -&gt; value.
     *
     * @property _factor
     * @type { Number }
     * @protected
     */
    _factor: 1,

    /**
     * Attach event listeners to keep the UI in sync with the min/max/value
     * attributes and DD position, then call syncUI() to sync initial state.
     *
     * @method initializer
     * @protected
     */
    initializer: function () {
        this._key = DDValue._AXIS_KEYS[ this.get( 'valueFromAxis' ) ];

        this.doAfter( 'align', this._afterDDAlign, this );

        this.after( {
            minChange:   this._afterMinChange,
            maxChange:   this._afterMaxChange,
            valueChange: this._afterValueChange
        } );

        this.syncUI();
    },

    /**
     * Cache constraining element offsets and dims for faster value translation
     * and map current DD position to value.
     *
     * @method syncUI
     */
    syncUI: function () {
        this._cacheOffset();

        this._calculateFactor();

        this._uiSetDragPosition( this.get( VALUE ) );
    },

    /**
     * Captures the current top left of the DD's constraining node or region to avoid excessive DOM lookups at run time.
     *
     * @method _cacheOffset
     * @protected
     */
    _cacheOffset: function () {
        var region = this.get( HOST ).con.getRegion();
        this._offsetXY = region[ this._key.offsetEdge ];
    },

    /**
     * Calculates and caches (range between max and min) / (constraining node
     * or region width or height) for fast runtime calculation of position
     * -&gt; value.
     *
     * @method _calculateFactor
     * @protected
     */
    _calculateFactor: function () {
        var region = this.get( HOST ).con.getRegion( true );

        // e.g. ( max - min ) / ( constrain.right - constrain.left )
        this._factor =
            ( this.get( MAX ) - this.get( MIN ) ) /
            ( region[ this._key.farEdge ] - region[ this._key.offsetEdge ] );
    },

    /**
     * Dispatch the new position of the DD into the value setting operations.
     *
     * @method _afterDDAlign
     * @param e { EventFacade } The drag:align event
     * @protected
     */
    _afterDDAlign: function ( e ) {
        var xy      = e[ this._key.eventPageAxis ] -
                      this.get( HOST ).deltaXY[ this._key.xyIndex ] -
                      this._offsetXY,
            prevVal = this.get( VALUE ),
            newVal;

        newVal = this._offsetToValue( xy );

        // Can't just do this.set( VALUE, this._offsetToValue( xy ) )
        if (prevVal !== newVal) {
            this.set( VALUE, newVal, { ddEvent: e } );
        }
    },

    /**
     * <p>Converts a pixel position into a value.  Calculates current
     * position minus xy offsets of the constraining element multiplied by the
     * ratio of <code>(max - min) / (constraining dim)</code>.</p>
     *
     * <p>Override this if you want to use a different value mapping
     * algorithm.</p>
     *
     * @method _offsetToValue
     * @param { Number } X or Y pixel position
     * @return { mixed } Value corresponding to the provided pixel position
     * @protected
     */
    _offsetToValue: function ( xy ) {
        var max   = this.get( MAX ),
            min   = this.get( MIN ),
            value = round( xy * this._factor ) + min, // force int values
            tmp;

        // Account for reverse value range (max < min)
        tmp = max > min ? max : min;
        min = max > min ? min : max;
        max = tmp;

        return value > max ? max :
               value < min ? min :
               value;
    },

    /**
     * Converts a value into a positional pixel value for use in positioning
     * the DD element according to the reverse of the
     * <code>_offsetToValue( xy )</code> operation.
     *
     * @method _valueToOffset
     * @param val { Number } The value to map to pixel X or Y position
     * @return { Array } <code>[ <em>X</em>px, <em>Y</em>px ] positional values
     * @protected
     */
    _valueToOffset: function ( value ) {
        value -= this.get( MIN );

        return round( value / this._factor ) + this._offsetXY;
    },

    /**
     * Update value according to new min value.
     *
     * @method _afterMinChange
     * @param e { EventFacade } The <code>min</code> attribute change event.
     * @protected
     */
    _afterMinChange: function ( e ) {
        this.syncUI();
    },

    /**
     * Update value according to new max value.
     *
     * @method _afterMaxChange
     * @param e { EventFacade } The <code>max</code> attribute change event.
     * @protected
     */
    _afterMaxChange: function ( e ) {
        this.syncUI();
    },

    /**
     * Propagate change to the DD unless the change is coming from a DD event.
     *
     * @method _afterValueChange
     * @param e { EventFacade } The <code>value</code> attribute change event.
     * @protected
     */
    _afterValueChange: function ( e ) {
        if ( !e.ddEvent ) {
            this._uiSetDragPosition( e.newVal );
        }
    },

    /**
     * Positions the Drag element in accordance with the translated value.
     *
     * @method _uiSetDragPosition
     * @protected
     */
    _uiSetDragPosition: function ( value ) {
        var host = this.get( HOST ),
            xy;

        // Drag element hasn't been setup yet
        if ( !host.deltaXY ) {
            host.actXY = host.get( DRAG_NODE ).getXY();
            host._setStartPosition( host.actXY );
        }

        xy = host.actXY.slice();
        xy[ this._key.xyIndex ] = this._valueToOffset( value );

        host._alignNode( xy );
    },

    /**
     * Validates new values assigned to <code>min</code> attribute.  Numbers
     * are acceptable.  Override this to enforce different rules.
     *
     * @method _validateNewMin
     * @param value { mixed } Value assigned to <code>min</code> attribute.
     * @return { Boolean } True for numbers.  False otherwise.
     * @protected
     */
    _validateNewMin: function ( value ) {
        return Y.Lang.isNumber( value );
    },

    /**
     * Validates new values assigned to <code>max</code> attribute.  Numbers
     * are acceptable.  Override this to enforce different rules.
     *
     * @method _validateNewMax
     * @param value { mixed } Value assigned to <code>max</code> attribute.
     * @return { Boolean } True for numbers.  False otherwise.
     * @protected
     */
    _validateNewMax: function ( value ) {
        return Y.Lang.isNumber( value );
    },

    /**
     * Validates new values assigned to <code>value</code> attribute.  Numbers
     * between the configured <code>min</code> and <code>max</code> are
     * acceptable.
     *
     * @method _validateNewValue
     * @param value { mixed } Value assigned to <code>value</code> attribute.
     * @return { Boolean } True if value is a number between the configured
     *                     <code>min</code> and <code>max</code>.
     * @protected
     */
    _validateNewValue: function ( value ) {
        var min = this.get( MIN ),
            max = this.get( MAX ),
            tmp;

        // Account for reverse value range (min > max)
        tmp = max > min ? max : min;
        min = max > min ? min : max;
        max = tmp;

        return value >= min && value <= max;
    },

    /** 
     * Validates new values assigned to <code>valueFromAxis</code> attribute.
     * Acceptable values are "x" and "y".
     *
     * @method _validateNewValueFromAxis
     * @param value { String } proposed value
     * @return { Boolean } True if value is "x" or "y"
     * @protected
     */
    _validateNewValueFromAxis: function ( value ) {
        return value === 'x' || value === 'y';
    },

    /**
     * Discover the appropriate axis to associate the value to based on the
     * the assignment of <code>stickX</code> or <code>stickY</code> attributes
     * in the DDConstrained plugin.  If neither are set, defaults to "x".
     *
     * @method _initValueFromAxis
     * @return { String } "x" or "y"
     * @protected
     */
    _initValueFromAxis: function () {
        return this.get( HOST ).con.get( 'stickY' ) ? "y" : "x";
    },

    /**
     * Calculate the value from the current Drag element's position.  This is
     * used to initialize the value attribute if it isn't set at construction.
     *
     * @method _initValueFromPosition
     * @return { mixed } Value as calculated from the node's current position
     * @protected
     */
    _initValueFromPosition: function () {
        // This is used as the valueFn for the value attribute, and so it can't
        // use the _key shortcuts or the cached values from _cacheOffset or
        // _calculateFactor.
        var host   = this.get( HOST ),
            axis   = this.get( 'valueFromAxis' ),
            range  = this.get( MAX ) - this.get( MIN ),

            region = host.con.getRegion( true ),
            xy     = host.get( DRAG_NODE ).getXY(),

            factor, position;

        if ( axis === 'x' ) {
            factor   = range / ( region.right  - region.left );
            position = xy[ 0 ] - region.left;
        } else {
            factor   = range / ( region.bottom  - region.top );
            position = xy[ 1 ] - region.top;
        }

        return position * factor;
    }

}, {

    // DDValue static properties

    /**
     * Name of the plugin
     *
     * @property DDValue.NAME
     * @type {String}
     * @readonly
     * @static
     * @default "ddValue"
     * @protected
     */
    NAME: 'ddValue',

    /**
     *
     * Namespace for the plugin
     * @type {String}
     * @default "val"
     * @static
     * @protected
     */
    NS: 'val',

    /**
     * Object property names used for respective X and Y axis accessors (e.g.
     * &quot;width&quot; vs. &quot;height&quot; for referencing the
     * constraining element's appropriate dimension.)
     *
     * @property DDValue._AXIS_KEYS
     * @type Object
     * @protected
     * @static
     */
    _AXIS_KEYS : {
        x : {
            offsetEdge    : 'left',
            farEdge       : 'right',
            eventPageAxis : 'pageX',
            xyIndex       : 0
        },
        y : {
            offsetEdge    : 'top',
            farEdge       : 'bottom',
            eventPageAxis : 'pageY',
            xyIndex       : 1
        }
    },

    /**
     * Plugin attributes.
     *
     * @property ATTRS
     * @type {Object}
     * @static
     * @protected
     */
    ATTRS: {
        valueFromAxis: {
            valueFn  : '_initValueFromAxis',
            writeOnce: true,
            validator: '_validateNewValueFromAxis'
        },

        min: {
            value    : 0,
            validator: '_validateNewMin'
        },

        max: {
            value    : 100,
            validator: '_validateNewMax'
        },

        value: {
            valueFn  : '_initValueFromPosition',
            validator: '_validateNewValue'
        }

    }
});
