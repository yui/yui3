YUI.add('dd-value', function(Y) {

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

Y.Plugin.DDValue = Y.extend( DDValue, Y.Base, {

    // DDValue prototype

    /**
     * Map to property names based on <code>axis</code> for use in
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
     * attributes and DD position, then call syncDragNode() to sync initial state.
     *
     * @method initializer
     * @protected
     */
    initializer: function () {
        var host = this.get( HOST ),
            // DDConstrained must be plugged in
            con  = host.con || this._defaultConstrain(),
            category;

        // Because attribute setters aren't called on initialization
        this._key = DDValue._AXIS_KEYS[ this.get( 'axis' ) ];

        /**
         * Detach category for internal events to aid in cleanup.
         *
         * @property _evtGuid
         * @type { String }
         * @protected
         */
        this._evtGuid = category = Y.guid() + '|';

        host.after( category + 'drag:align', this._afterAlign, this );

        con.after( category + 'constrainChange', this.syncDragNode, this );
        con.after( category + 'gutterChange',    this.syncDragNode, this );

        this.after( {
            minChange  : this._afterMinChange,
            maxChange  : this._afterMaxChange,
            valueChange: this._afterValueChange
        } );

        this.syncDragNode();
    },

    /**
     * Plugs in Y.Plugin.DDConstrained onto the Drag instance.  Default
     * configuration uses <code>constrain</code> set to the
     * <code>dragNode</code>'s <code>parentNode</code>.
     *
     * @method _defaultConstrain
     * @return { Y.Plugin.DDConstrained } The plugin instance
     * @protected
     */
    _defaultConstrain: function () {
        var host = this.get( HOST );

        host.plug( Y.Plugin.DDConstrain, {
            constrain: host.get( DRAG_NODE ).get( 'parentNode' )
        } );

        return host.con;
    },

    /**
     * Cache constraining element offsets and dims for faster value translation
     * and map current DD position to value.
     *
     * @method syncDragNode
     */
    syncDragNode: function () {
        this._cacheOffset();

        this._calculateFactor();

        this._setPosition( this.get( VALUE ) );
    },

    /**
     * Detach event listeners.
     *
     * @method destructor
     * @protected
     */
    destructor: function () {
        var host = this.get( HOST );

        host.detach( this._evtGuid + '*' );

        if ( host.con ) {
            host.con.detach( this._evtGuid + '*' );
        }

        this.detach();
    },

    /**
     * Captures the current top left of the DD's constraining node or region to
     * avoid excessive DOM lookups at run time.
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
     * @method _afterAlign
     * @param e { EventFacade } The drag:align event
     * @protected
     */
    _afterAlign: function ( e ) {
        var host  = this.get( HOST ),
            value = this._offsetToValue( host.actXY[ this._key.xyIndex ] );

        // Can't just do this.set( VALUE, this._offsetToValue( value ) )
        if ( e.prevVal !== value ) {
            this.set( VALUE, value, { ddEvent: e } );
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
        xy -= this._offsetXY;

        var value = round( xy * this._factor ) + this.get( MIN );

        return this._nearestValue( value );
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
     * Update position according to new min value.  If the new min results in
     * the current value being out of range, the value is set to the closer of
     * min or max.
     *
     * @method _afterMinChange
     * @param e { EventFacade } The <code>min</code> attribute change event.
     * @protected
     */
    _afterMinChange: function ( e ) {
        this._verifyValue();

        this.syncDragNode();
    },

    /**
     * Update position according to new max value.  If the new max results in
     * the current value being out of range, the value is set to the closer of
     * min or max.
     *
     * @method _afterMaxChange
     * @param e { EventFacade } The <code>max</code> attribute change event.
     * @protected
     */
    _afterMaxChange: function ( e ) {
        this._verifyValue();

        this.syncDragNode();
    },

    /**
     * Verifies that the current value is within the min - max range.  If not,
     * value is set to either min or max, depending on which is closer.
     *
     * @method _verifyValue
     * @protected
     */
    _verifyValue: function () {
        var value   = this.get( VALUE ),
            nearest = this._nearestValue( value );

        if ( value !== nearest ) {
            // @TODO Can/should valueChange, minChange, etc be queued events?
            // To make dd.set( 'min', n ); execute after minChange subscribers
            // before on/after valueChange subscribers.
            this.set( VALUE, nearest );
        }
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
            this._setPosition( e.newVal );
        }
    },

    /**
     * Positions the Drag element in accordance with the translated value.
     *
     * @method _setPosition
     * @protected
     */
    _setPosition: function ( value ) {
        var host = this.get( HOST );

        // Drag element hasn't been setup yet
        if ( !host.deltaXY ) {
            host.actXY = host.get( DRAG_NODE ).getXY();
            host._setStartPosition( host.actXY );
        }

        host.actXY[ this._key.xyIndex ] = this._valueToOffset( value );

        host._moveNode();
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
        return ( value === this._nearestValue( value ) );
    },

    /**
     * Returns the nearest valid value to the value input.  If the provided
     * value is outside the min - max range, accounting for min > max
     * scenarios, the nearest of either min or max is returned.  Otherwise, the
     * provided value is returned.
     *
     * @method _nearestValue
     * @param value { mixed } Value to test against current min - max range
     * @return { Number } Current min, max, or value if within range
     * @protected
     */
    _nearestValue: function ( value ) {
        var min = this.get( MIN ),
            max = this.get( MAX ),
            tmp;

        // Account for reverse value range (min > max)
        tmp = ( max > min ) ? max : min;
        min = ( max > min ) ? min : max;
        max = tmp;

        return ( value < min ) ?
                min :
                ( value > max ) ?
                    max :
                    value;
    },

    /** 
     * Validates new values assigned to <code>axis</code> attribute.
     * Acceptable values are "x" and "y".
     *
     * @method _validateNewAxis
     * @param value { String } proposed value
     * @return { Boolean } True if value is "x" or "y"
     * @protected
     */
    _validateNewAxis: function ( value ) {
        return value === 'x' || value === 'y';
    },

    /**
     * Discover the appropriate axis to associate the value to based on the
     * the assignment of <code>stickX</code> or <code>stickY</code> attributes
     * in the DDConstrained plugin.  If neither are set, defaults to "x".
     *
     * @method _initAxis
     * @return { String } "x" or "y"
     * @protected
     */
    _defaultAxis: function () {
        return ( this.get( HOST ).con.get( 'stickY' ) ) ? "y" : "x";
    },

    /**
     * Calculate the value from the current Drag element's position.  This is
     * used to initialize the value attribute if it isn't set at construction.
     *
     * @method _getValueFromPosition
     * @return { mixed } Value as calculated from the node's current position
     * @protected
     */
    _getValueFromPosition: function () {
        this._key = DDValue._AXIS_KEYS[ this.get( 'axis' ) ];

        var xy = this.get( HOST )
                    .get( DRAG_NODE ).getXY()[ this._key.xyIndex ];

        this._cacheOffset();

        this._calculateFactor();

        return this._offsetToValue( xy );
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
            xyIndex       : 0
        },
        y : {
            offsetEdge    : 'top',
            farEdge       : 'bottom',
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
        /**
         * The host Drag instance.
         *
         * @attribute host
         * @type { Object }
         * @writeOnce
         */
        host: {
            writeOnce: true
        },

        /**
         * Which movement axis to monitor for value association.  Allowable
         * values are &quot;x&quot; and &quot;y&quot;.  This will default based
         * on the host Drag instance's configured <code>stickX</code> or
         * <code>stickY</code> (via DDConstrained config), or &quot;x&quot; if
         * neither is defined.
         *
         * @attribute axis
         * @type { String }
         * @writeOnce
         */
        axis: {
            valueFn  : '_defaultAxis',
            writeOnce: true,
            validator: '_validateNewAxis'
        },

        /**
         * The value associated with the farthest top, left position of the
         * Drag element within its constraining element.  Can be greater than
         * the configured <code>max</code> if you want values to increase from
         * right-to-left or bottom-to-top.
         *
         * @attribute min
         * @type { Number }
         * @default 0
         */
        min: {
            value    : 0,
            validator: '_validateNewMin'
        },

        /**
         * The value associated with the farthest bottom, right position of the
         * Drag element within its constraining element.  Can be less than
         * the configured <code>min</code> if you want values to increase from
         * right-to-left or bottom-to-top.
         *
         * @attribute max
         * @type { Number }
         * @default 100
         */
        max: {
            value    : 100,
            validator: '_validateNewMax'
        },

        /**
         * The value associated with the Drag element's current position along
         * the axis configured in <code>axis</code>.  Defaults to the
         * value inferred from the Drag element's current position.  Specifying
         * value in the constructor will move the Drag node to the position
         * that corresponds to the supplied value.
         *
         * @attribute value
         * @type { Number }
         * @default (inferred from current Drag position)
         */
        value: {
            valueFn  : '_getValueFromPosition',
            validator: '_validateNewValue'
        }
    }
});


}, '@VERSION@' ,{requires:['dd-constrain']});
