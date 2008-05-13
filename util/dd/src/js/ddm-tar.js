YUI.add('dd-ddm-tar', function(Y) {
    var E = Y.Event;
    Y.mix(Y.DD.DDM, {
        tars: [],
        hash: {
            x: {},
            y: {}
        },
        regTarget: function(t) {
            this.tars[this.tars.length] = t;
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
        }
    });
    


}, '3.0.0', {requires: ['dd-ddm']});
