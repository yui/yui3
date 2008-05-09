YUI.add('dd-ddm', function(Y) {
    var E = Y.Event;
    /**
     * Basic template for utilities that consume Nodes 
     * @class Sample
     */
    var DDM = function() {
    };

    DDM.NAME = 'DragDropMgr';

    DDM.ATTRS = {
        clickPixelThresh: {
            value: 3,
            set: function(p) {
                this.clickPixelThresh = p;
            }
        },
        clickTimeThresh: {
            value: 1000,
            set: function(p) {
                this.clickTimeThresh = p;
            }
        }

    };
    Y.mix(DDM, {
        clickPixelThresh: 3,
        clickTimeThresh: 1000,
        pg: null,
        tars: [],
        drags: [],
        hash: {
            x: {},
            y: {}
        },
        intersect: false,
        activeDrag: false,
        _wrapDrag: function(d) {
            d.on('drag:start', function() {
                Y.DD.DDM.fire('ddm:drag', { target: this });
            }, d, true);
            d.on('drag:end', function() {
                Y.DD.DDM.fire('ddm:end', { target: this });
            }, d, true);
            d.on('drag:drag', function() {
                Y.DD.DDM.fire('ddm:drag', { target: this });
            }, d, true);
        },
        _wrapTarget: function(t) {
            t.on('drop:enter', function() {
                Y.DD.DDM.fire('ddm:enter', { target: this });
                Y.DD.DDM.activeDrag.fire('drop:enter', { target: this });
            }, t, true);
            t.on('drop:over', function() {
                Y.DD.DDM.fire('ddm:over', { target: this });
                Y.DD.DDM.activeDrag.fire('drop:over', { target: this });
            }, t, true);
            t.on('drop:exit', function() {
                if (Y.DD.DDM.activeDrag) {
                    Y.DD.DDM.fire('ddm:exit', { target: this });
                    Y.DD.DDM.activeDrag.fire('drop:exit', { target: this });
                }
            }, t, true);
        },
        regDrag: function(d) {
            this.drags[this.drags.length] = d;
            //this._wrapDrag(d);
            if (!this.pg) {
                this._createPG();
            }
        },
        regTarget: function(t) {
            this.tars[this.tars.length] = t;
            this._wrapTarget(t);
        },
        rnd: function(n) {
            return (Math.round(n / 100) * 100);
        },
        syncTarget: function(tar, xy) {
            var rx = this.rnd(xy[0]),
                ry = this.rnd(xy[1]);
            if (!Y.lang.isArray(this.hash.x[rx])) {
                this.hash.x[rx] = [];
            }
            if (!Y.lang.isArray(this.hash.y[ry])) {
                this.hash.y[ry] = [];
            }
            this.hash.x[rx][this.hash.x[rx].length] = tar;
            this.hash.y[ry][this.hash.y[ry].length] = tar;
        },
        lookup: function(x, y) {
            //console.log('Lookup: ', arguments);
            var oX = this.rnd(x),
                oY = this.rnd(y);
                //console.log(oX, oY);
                if (this.hash.x[oX]) {
                }
                if (this.hash.y[oY]) {
                    for (var i in this.hash.y[oY]) {
                        //console.log(this.hash.y[oY][i].region);
                    }
                }
        },
        start: function(x, y, w, h) {
            this.pg_activate();
            this.startDrag();
            for (var i = 0; i < this.tars.length; i++) {
                this.tars[i].activateShim.apply(this.tars[i], arguments);
            }
            //this.lookup(this.activeDrag.currentX, this.activeDrag.currentY);
        },
        end: function() {
            this.endDrag();
            this.activeDrag.end.call(this.activeDrag);
            this.activeDrag = null;
            this.pg_deactivate();
        },
        startDrag: function() {
            //this.pg.on('mousemove', Y.bind(this.activeDrag.move, this.activeDrag, true));
        },
        endDrag: function() {
            //this.pg.removeEventListener('mousemove', Y.bind(this.activeDrag.move, this.activeDrag, true));
        },
        move: function() {
            if (this.activeDrag) {
                this.activeDrag.move.apply(this.activeDrag, arguments);
                for (var i = 0; i < this.tars.length; i++) {
                    if (this.tars[i].overTarget) {
                        this.tars[i].move.apply(this.tars[i], arguments);
                    }
                }
            }
        },
        pg_deactivate: function() {
            this.pg.setStyle('display', 'none');
        },
        pg_activate: function() {
            this.pg.setStyles({
                top: 0,
                left: 0,
                display: 'block'
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
                opacity: '.5',
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
            Y.Node.get('document').on('mousemove', this.move, this, true);
            //TODO
            Y.Event.addListener(window, 'resize', this.pg_size, this, true);
            Y.Event.addListener(window, 'scroll', this.pg_size, this, true);
        }   
    });

    Y.mix(DDM, Y.Event.Target.prototype);
    Y.mix(DDM, Y.Base.prototype);

    Y.namespace('DD');
    Y.DD.DDM = DDM;

}, '3.0.0', {requires: ['node', 'nodeextras', 'base']});
