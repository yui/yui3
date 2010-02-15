/**
 * Create a sliding value range input visualized as a draggable thumb on a
 * background element.
 * 
 * @module slider
 */

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
function SliderBase() {
    SliderBase.superclass.constructor.apply( this, arguments );
}

Y.SliderBase = Y.extend(SliderBase, Y.Widget, {

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
        this.axis = this.get( 'axis' );

        this._key = {
            dim    : ( this.axis === 'y' ) ? 'height' : 'width',
            minEdge: ( this.axis === 'y' ) ? 'top'    : 'left',
            maxEdge: ( this.axis === 'y' ) ? 'bottom' : 'right'
        };

        /**
         * Signals that the thumb has moved.  Payload includes the DD.Drag
         * instance's <code>drag:drag</code>.
         *
         * @event thumbMove
         * @param event {Event.Facade} An Event Facade object with the
         *                  following properties added:
         *  <dl>
         *      <dt>ddEvent</dt>
         *          <dd><code>drag:drag</code> event from the managed DD.Drag
         *          instance</dd>
         *  </dl>
         */
        this.publish( 'thumbMove', {
            defaultFn: this._defThumbMoveFn,
            queue    : true
        } );
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

        this._uiSetRailLength();

        this.thumb = this._renderThumb();

        this.rail.appendChild( this.thumb );
        // @TODO: insert( contentBox, 'replace' ) or setContent?
        contentBox.appendChild( this.rail );

        // <span class="yui3-slider-x">
        contentBox.addClass( this.getClassName( this.axis ) );
    },

    _renderRail: function () {
        var minCapClass = this.getClassName( 'rail', 'cap', this._key.minEdge ),
            maxCapClass = this.getClassName( 'rail', 'cap', this._key.maxEdge );

        return Y.Node.create(
            Y.substitute( this.RAIL_TEMPLATE, {
                railClass      : this.getClassName( 'rail' ),
                railMinCapClass: minCapClass,
                railMaxCapClass: maxCapClass
            } ) );
    },

    _uiSetRailLength: function () {
        this.rail.setStyle( this._key.dim, this.get( 'length' ) );
    },

    _renderThumb: function () {
        this._initThumbUrl();

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

        this._bindValueLogic();

        this.after( 'disabledChange', this._afterDisabledChange );
        this.after( 'lengthChange',   this._afterLengthChange );
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
                'drag:align': Y.bind( this._afterAlign,   this ),
                'drag:end'  : Y.bind( this._afterDragEnd, this )
            }
        } );

        // Constrain the thumb to the rail
        this._dd.plug( Y.Plugin.DDConstrained, config );
    },

    _bindValueLogic: function () {},

    _onDragStart: function ( e ) {
        /**
         * Signals the beginning of a thumb drag operation.  Payload includes
         * the DD.Drag instance's drag:start event.
         *
         * @event slideStart
         * @param event {Event.Facade} An Event Facade object with the
         *                  following properties added:
         *  <dl>
         *      <dt>ddEvent</dt>
         *          <dd><code>drag:start</code> event from the managed DD.Drag
         *          instance</dd>
         *  </dl>
         */
        this.fire( 'slideStart', { ddEvent: e } );
    },

    _afterAlign: function ( e ) {
        this.fire( 'thumbMove', { ddEvent: e } );
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
         *  </dl>
         */
        this.fire( 'slideEnd', { ddEvent: e } );
    },

    _afterDisabledChange: function ( e ) {
        this._dd.set( 'lock', true );
    },

    _afterLengthChange: function ( e ) {
        this._uiSetRailLength();
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
        this._syncThumbPosition();

        // Forces a reflow of the bounding box to address IE8 inline-block
        // container not expanding correctly. bug 2527905
        //this.get('boundingBox').toggleClass('');
    },

    _syncThumbPosition: function () { },

    /**
     * Validates the axis is &quot;x&quot; or &quot;y&quot; (case insensitive).
     * Converts to lower case for storage.
     *
     * @method _setAxis
     * @param v {String} proposed value for the axis attribute
     * @return {String} lowercased first character of the input string
     * @protected
     */
    _setAxis : function (v) {
        v = ( v + '' ).toLowerCase();

        return ( v === 'x' || v === 'y' ) ? v : Y.Attribute.INVALID_VALUE;
    },

    _setLength: function ( v ) {
        v = ( v + '' ).toLowerCase();

        var length = parseFloat( v, 10 ),
            units  = v.replace( /[\d\.\-]/g, '' ) || this.DEF_UNIT;

        return length > 0 ? ( length + units ) : Y.Attribute.INVALID_VALUE;
    },

    _initThumbUrl: function () {
        var url     = this.get( 'thumbUrl' ),
            skin    = this.getSkinName() || 'sam',
            skinDir = Y.config.base + 'slider/assets/skins/' + skin;

        if ( !url ) {
            // <img src="/path/to/build/slider/assets/skins/sam/thumb-x.png">
            url = skinDir + '/thumb-' + this.axis + '.png';
            this.set( 'thumbUrl', url );
        }
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
                        '</span>'

}, {

    // Y.Slider static properties

    /**
     * The identity of the widget.
     *
     * @property Slider.NAME
     * @type String
     * @default 'sliderBase'
     * @readOnly
     * @protected
     * @static
     */
    NAME : 'sliderBase',

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
            setter    : '_setAxis',
            lazyAdd   : false
        },

        /**
         * The length of the rail (minus end caps as shifted by CSS).  This corresponds to the movable range of the thumb.
         *
         * @attribute length
         * @type { String|Number } e.g. "200px", "6em", or 200 (defaults to px)
         * @default 150px
         */
        length: {
            value: '150px',
            setter: '_setLength'
        },

        /**
         * Path to the thumb image.  This will be used as both the thumb and
         * shadow as a sprite.  Defaults at render() to thumb-x.png or
         * thumb-y.png in the skin directory of the current skin.
         *
         * @attribute thumbUrl
         * @type { String }
         * @default thumb-x.png or thumb-y.png in the sam skin directory of the
         * current build path for Slider
         */
        thumbUrl: {
            value: null,
            validator: Y.Lang.isString
        }
    }
});
