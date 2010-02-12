function ClickableRail() {
    this._initClickableRail();
}

Y.mix( ClickableRail, {

    // Static properties added onto Slider
    ATTRS: {
        clickableRail: {
            value: true,
            validator: Y.Lang.isBoolean
        }
    },

    // Prototype methods added to Slider
    prototype: {

        _initClickableRail: function () {
            this.publish( 'railMouseDown', { 
                defaultFn: this._defRailMouseDownFn
            } );

            this.after( 'render', this._bindClickableRail );
            this.on( 'destroy', this._unbindClickableRail );
        },

        _bindClickableRail: function () {
            this.rail.on( this._evtGuid + 'mousedown',
                this._onRailMouseDown );
        },

        _unbindClickableRail: function () {
            if ( this.get( 'rendered' ) ) {
                var contentBox = this.get( 'contentBox' ),
                    rail = contentBox.one( '.' + this.getClassName( 'rail' ) );

                rail.detach( this.evtGuid + '*' );
            }
        },

        _onRailMouseDown: function ( e ) {
            if ( this.get( 'clickableRail' ) && !this.get( 'disabled' ) ) {
                this.fire( 'railMouseDown', { ev: e } );
            }
        },

        _defRailMouseDownFn: function ( e ) {
            e = e.ev;

            // Logic that determines which thumb should be used is abstracted
            var thumb = this._resolveThumb( e ),
                xy;
                
            if ( thumb ) {

                if ( !thumb.startXY ) {
                    thumb._setStartPosition( thumb.getXY() );
                }

                xy = this._getThumbDestination( e, thumb );

                thumb._alignNode( xy );

                // Delegate to DD's natural behavior
                thumb._handleMouseDownEvent( e );
            }
        },

        _resolveThumb: function ( e ) {
            var primaryOnly = this._dd.get( 'primaryButtonOnly' ),
                validClick  = !primaryOnly || e.button <= 1;

            return ( validClick ) ? this._dd : null;
        },

        _getThumbDestination: function ( e, thumb ) {
            var dragNode     = thumb.get( 'dragNode' ),
                offsetWidth  = dragNode.get( 'offsetWidth' ),
                offsetHeight = dragNode.get( 'offsetHeight' );

            // center
            return [
                ( e.pageX - Math.round( ( offsetWidth  / 2 ) ) ),
                ( e.pageY - Math.round( ( offsetHeight / 2 ) ) )
            ];
        }

    }

} );

// Replace the current Slider class with a build of Slider + ClickableRail
Y.Slider = Y.Base.build( Y.Slider, [ ClickableRail ] );
