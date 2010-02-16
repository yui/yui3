function ClickableRail() {
    this._initClickableRail();
}

Y.ClickableRail = Y.mix( ClickableRail, {

    // Prototype methods added to host class
    prototype: {

        _initClickableRail: function () {
            this._evtGuid = this._evtGuid || ( Y.guid() + '|' );

            this.publish( 'railMouseDown', { 
                defaultFn: this._defRailMouseDownFn
            } );

            this.after( 'render', this._bindClickableRail );
            this.on( 'destroy', this._unbindClickableRail );
        },

        _bindClickableRail: function () {
            this._dd.addHandle( this.rail );

            this.rail.on( this._evtGuid + 'mousedown',
                this._onRailMouseDown, this );
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
            // to someday support multi-thumb sliders
            var thumb = this._resolveThumb( e ),
                xy;
                
            if ( thumb ) {

                if ( !thumb.startXY ) {
                    thumb._setStartPosition( thumb.getXY() );
                }

                xy = this._getThumbDestination( e, thumb.get( 'dragNode' ) );

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

        _getThumbDestination: function ( e, node ) {
            var offsetWidth  = node.get( 'offsetWidth' ),
                offsetHeight = node.get( 'offsetHeight' );

            // center
            return [
                ( e.pageX - Math.round( ( offsetWidth  / 2 ) ) ),
                ( e.pageY - Math.round( ( offsetHeight / 2 ) ) )
            ];
        }

    },

    // Static properties added onto host class
    ATTRS: {
        clickableRail: {
            value: true,
            validator: Y.Lang.isBoolean
        }
    }

}, true );
