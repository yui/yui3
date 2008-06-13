YUI.add('dd-ddm', function(Y) {
    /**
     * 3.x DragDrop Manager - Shim support
     * @module dd-ddm
     * @class DDM
     * @namespace DD
     * @extends Base
     * @constructor
     */
     //TODO Add Event Bubbling??

    Y.mix(Y.DD.DDM, {
        /**
        * @private
        * @property pg
        * @description The shim placed over the screen to track the mousemove event.
        * @type {Node}
        */
        pg: null,
        /**
        * @private
        * @property _debugShim
        * @description Set this to true to set the shims opacity to .5 for debugging it, default: false.
        * @type {Boolean}
        */
        _debugShim: false,
        _activateTargets: function() {},
        _deactivateTargets: function() {},
        startDrag: function() {
            if (this.activeDrag.get('useShim')) {
                this.pg_activate();
                this._activateTargets();
            }
        },
        endDrag: function() {
            this.pg_deactivate();
            this._deactivateTargets();
        },
        /**
        * @private
        * @method pg_deactivate
        * @description Deactivates the shim
        */
        pg_deactivate: function() {
            this.pg.setStyle('display', 'none');
        },
        /**
        * @private
        * @method pg_activate
        * @description Activates the shim
        */
        pg_activate: function() {
            this.pg_size();
            this.pg.setStyles({
                top: 0,
                left: 0,
                display: 'block',
                opacity: ((this._debugShim) ? '.5' : '0'),
                filter: 'alpha(opacity=' + ((this._debugShim) ? '50' : '0') + ')'
            });
        },
        /**
        * @private
        * @method pg_size
        * @description Sizes the shim on: activatation, window:scroll, window:resize
        */
        pg_size: function() {
            if (this.activeDrag) {
                var b = Y.Node.get('body'),
                h = b.get('docHeight'),
                w = b.get('docWidth');
                this.pg.setStyles({
                    height: h + 'px',
                    width: w + 'px'
                });
            }
        },
        /**
        * @private
        * @method _createPG
        * @description Creates the shim and adds it's listeners to it.
        */
        _createPG: function() {
            var pg = Y.Node.create(['div']),
            bd = Y.Node.get('body');
            pg.setStyles({
                top: '0',
                left: '0',
                position: 'absolute',
                zIndex: '9999',
                opacity: '0',
                backgroundColor: 'red',
                display: 'none',
                height: '5px',
                width: '5px'
            });
            if (bd.get('firstChild')) {
                bd.insertBefore(pg, bd.get('firstChild'));
            } else {
                bd.appendChild(pg);
            }
            this.pg = pg;
            this.pg.on('mouseup', this.end, this, true);
            this.pg.on('mousemove', this.move, this, true);
            //TODO
            Y.Event.addListener(window, 'resize', this.pg_size, this, true);
            Y.Event.addListener(window, 'scroll', this.pg_size, this, true);
        }   
    }, true);

    Y.DD.DDM._createPG();    

}, '3.0.0', {requires: ['dd-ddm-base']});
