YUI.add('dd-ddm', function(Y) {
    var E = Y.Event;
    /**
     * Basic template for utilities that consume Nodes 
     * @class Sample
     */

    Y.mix(Y.DD.DDM, {
        pg: null,
        _debugShim: false,
        tars: [],
        startDrag: function() {
            this.pg_activate();
            for (var i = 0; i < this.tars.length; i++) {
                this.tars[i].activateShim.apply(this.tars[i], arguments);
            }
            //this.lookup(this.activeDrag.currentX, this.activeDrag.currentY);            
        },
        endDrag: function() {
            this.pg_deactivate();
        },
        pg_deactivate: function() {
            this.pg.setStyle('display', 'none');
        },
        pg_activate: function() {
            this.pg.setStyles({
                top: 0,
                left: 0,
                display: 'block',
                opacity: ((this._debugShim) ? '.5' : '0')
            });
            this.pg_size();
        },
        pg_size: function() {
            if (this.activeDrag) {
                this.pg.setStyles({
                    height: this.pg.get('docHeight') + 'px',
                    width: this.pg.get('docWidth') + 'px'
                });
            }
        },
        _createPG: function() {
            var pg = Y.Node.create(['div']),
            bd = Y.Node.get('body');
            pg.setStyles({
                position: 'absolute',
                zIndex: '9999',
                opacity: '0',
                backgroundColor: 'red',
                display: 'none'
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
