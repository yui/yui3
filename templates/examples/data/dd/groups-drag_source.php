<style>
.slot {
    border: 2px solid #808080;
    background-color: #CDCDCD;
    color: #666666;
    text-align: center;
    position: relative;
    float: left;
    margin: 4px;
    width: 60px;
    height: 60px;
    z-index: 0;
}
.player {
    border: 2px solid #808080;
    color: #ffffff;
    text-align: center;
    position: relative;
    float: left;
    margin: 4px;
    width: 60px;
    height: 60px;
    top: 150px;
    z-index: 1;
    cursor: move;
}
#pt1 {
    clear: both;
}
.bottom {
    top: 50px;
}

#pt1, #pt2 {
    background-color: #71241A;
}
#pb1, #pb2 {
    background-color: #004C6D;
}

#pboth1, #pboth2 {
    background-color: #FFA928;
}

#workarea {
    position: relative;
    height: 300px;
    width: 500px;
}
#workarea .yui-dd-drop-active-valid {
    border: 2px solid green;
}
#workarea .yui-dd-drop-over {
    background-color: green;
}
#workarea .yui-dd-drop-active-invalid {
    border: 2px solid red;
}
</style>

<div id="workarea">

    <div class="slot" id="t1">1</div>
    <div class="slot bottom" id="b1">3</div>
    <div class="slot bottom" id="b2">4</div>
    <div class="slot bottom" id="b3">5</div>
    <div class="slot bottom" id="b4">6</div>
    <div class="slot" id="t2">2</div>


    <div class="player" id="pt1">1</div>
    <div class="player" id="pt2">2</div>
    <div class="player" id="pb1">3</div>
    <div class="player" id="pb2">4</div>
    <div class="player" id="pboth1">5</div>
    <div class="player" id="pboth2">6</div>

</div>

<script>
YUI().use('dd-drop', 'dd-proxy', 'dd-constrain', function(Y) {
    
    var slots = Y.Node.get('#workarea').queryAll('.slot');
    Y.each(slots, function(v, k, items) {
        var id = v.get('id'), groups = ['two'];
        switch (id) {
            case 't1':
            case 't2':
                groups = ['one'];
                break;
        }
        var drop = new Y.DD.Drop({
            node: items.item(k),
            groups: groups
        });
    });

    var players = Y.Node.get('#workarea').queryAll('.player');
    Y.each(players, function(v, k, items) {
        var id = v.get('id'), groups = ['one', 'two'];
        switch (id) {
            case 'pt1':
            case 'pt2':
                groups = ['one'];
                break;
            case 'pb1':
            case 'pb2':
                groups = ['two'];
                break;
        }
        var drag = new Y.DD.Drag({
            node: items.item(k),
            proxy: true,
            groups: groups,
            dragMode: 'intersect',
            moveOnEnd: false,
            constrain2node: '#workarea'
        });
        drag.on('drag:start', function() {
            var p = this.get('dragNode'),
                n = this.get('node');
                n.setStyle('opacity', .25);
                if (!this._playerStart) {
                    this._playerStart = this.nodeXY;
                }
            p.set('innerHTML', n.get('innerHTML'));
            p.setStyles({
                backgroundColor: n.getStyle('backgroundColor'),
                color: n.getStyle('color'),
                opacity: .65
            });
        });
        drag.on('drag:end', function() {
            var n = this.get('node');
            n.setStyle('opacity', '1');
        });
        drag.on('drag:drophit', function(e) {
            var xy = e.drop.get('node').getXY();
            this.get('node').setXY(xy);
        });
        drag.on('drag:dropmiss', function(e) {
            if (this._playerStart) {
                this.get('node').setXY(this._playerStart);
                this._playerStart = null;
            }
        });
    });


});
</script>

