<style>
    .drag {
        height: 50px;
        width: 50px;
        border: 1px solid black;
        background-color: #004C6D;
        color: white;
        cursor: move;
        float: left;
        margin: 4px;
        z-index: 2;
    }
    #play {
        border: 1px solid black;
        height: 300px;
        position: relative;
    }
    #drop {
        position: absolute;
        bottom: 5px;
        right: 5px;
        border: 1px solid black;
        background-color: #8DD5E7;
        height: 75px;
        width: 65%;
        z-index: 1;
    }
    #drop p {
        margin: 1em;
    }
    #drop p strong {
        font-weight: bold;
    }
    #drop.yui-dd-drop-over {
        background-color: #FFA928;
    }
</style>

<div id="play">
    <div id="drag1" class="drag">Drag #1</div>
    <div id="drag2" class="drag">Drag #2</div>
    <div id="drag3" class="drag">Drag #3</div>
    <div id="drag4" class="drag">Drag #4</div>
    <div id="drag5" class="drag">Drag #5</div>
    <div id="drop"></div>
</div>

<script>

YUI(<?php echo $yuiConfig ?>).use('dd-drop', 'dd-constrain', function(Y) {
    var data = {
        'drag1': { color: 'white', size: 'x-small', price: '$5.00' },
        'drag2': { color: 'blue', size: 'small', price: '$6.00' },
        'drag3': { color: 'green', size: 'medium', price: '$7.00' },
        'drag4': { color: 'red', size: 'large', price: '$10.00' },
        'drag5': { color: 'purple', size: 'x-large', price: '$15.00' }
    };
    var drags = Y.Node.all('#play div.drag');
    drags.each(function(v, k) {
        var thisData = {};
        Y.mix(thisData, data[v.get('id')]);
        var dd = new Y.DD.Drag({
            node: v,
            constrain2node: '#play',
            dragMode: 'intersect',
            data: thisData
        });
        dd.on('drag:dropmiss', function() {
            this.get('node').setStyles({
                top: '',
                left: ''
            });
        });
    });

    var drop = new Y.DD.Drop({
        node: '#drop'
    });
    drop.on('drop:hit', function(e) {
        var drag = e.drag;
        drag.get('node').setStyles({
            top: '',
            left: ''
        });
        var data = drag.get('data');
        var out = ['id: ' + drag.get('node').get('id')];
        Y.each(data, function(v, k) {
            out[out.length] = k + ': ' + v;
        });
        var str = '<p><strong>Dropped</strong>: ' + out.join(', ') + '</p>';
        this.get('node').set('innerHTML', str);
    });
});
</script>
