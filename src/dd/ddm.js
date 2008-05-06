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
        regDrag: function(t) {
            this.drags[this.drags.length] = t;
            if (!this.pg) {
                this.createPG();
            }
        },
        reg: function(t) {
            this.tars[this.tars.length] = t;
        },
        rnd: function(n) {
            return (Math.round(n / 100) * 100);
        },
        syncTarget: function(tar, x, y) {
            var rx = this.rnd(x),
                ry = this.rnd(y);
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
        createPG: function() {
            var pg = Y.Node.create(['div', { id: 'ddm_play' }]),
            bd = Y.Node.get('body');
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
