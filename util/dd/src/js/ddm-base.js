YUI.add('dd-ddm-base', function(Y) {
    var E = Y.Event;
    /**
     * Basic template for utilities that consume Nodes 
     * @class Sample
     */
    var DDMBase = function() {
        
    };

    DDMBase.NAME = 'DragDropMgr';

    DDMBase.ATTRS = {
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
    Y.mix(DDMBase, {
        clickPixelThresh: 3,
        clickTimeThresh: 1000,
        drags: [],
        tars: [],
        intersect: false,
        activeDrag: false,
        regDrag: function(d) {
            this.drags[this.drags.length] = d;
        },
        unregDrag: function(d) {
            var tmp = [];
            Y.each(this.drags, function(n, i) {
                if (n !== d) {
                    tmp[tmp.length] = n;
                }
            });
            this.drags = tmp;
        },
        init: function() {
            Y.Node.get('document').on('mousemove', this.move, this, true);
        },
        start: function(x, y, w, h) {
            this.startDrag.apply(this, arguments);
        },
        end: function() {
            this.endDrag();
            this.activeDrag.end.call(this.activeDrag);
            this.activeDrag = null;
        },
        move: function() {
            if (this.activeDrag) {
                this.activeDrag.move.apply(this.activeDrag, arguments);
                /*
                for (var i = 0; i < this.tars.length; i++) {
                    if (this.tars[i].overTarget) {
                        this.tars[i].move.apply(this.tars[i], arguments);
                    }
                }
                */
            }
        }
    });

    Y.mix(DDMBase, Y.Event.Target.prototype);
    Y.mix(DDMBase, Y.Base.prototype);

    Y.namespace('DD');
    Y.DD.DDM = DDMBase;
    Y.DD.DDM.init();

}, '3.0.0', {requires: ['node', 'nodeextras', 'base']});
