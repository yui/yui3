<style>
    #demo {
        height: 100px;
        width: 100px;
        border: 1px solid black;
        cursor: move;
        float: right;
    }
    #ifrm {
        width: 400px;
        height: 300px;
    }
</style>
<p>Try dragging the proxy element over the iframe below, in most browsers this will not happen. Now check the box and drag again. Now you can drag over the iframe.</p>
<p><input type="checkbox" value="on" id="shim"> <label for="shim">Use the shim</label></p>
<div id="demo">Drag Me</div>
<iframe id="ifrm" src="<?php echo $assetsDirectory; ?>blank.htm"></iframe>

<script>

var Y = new YUI().use('dd-ddm', 'dd-drag', 'dd-proxy');
Y.on('event:ready', function() {
    Y.Node.get('#shim').on('click', function() {
        var checked = this.get('checked');
        dd.set('useShim', checked);
    });
    var dd = new Y.DD.Drag({
        //Selector of the node to make draggable
        node: '#demo',
        proxy: true,
        offsetNode: false,
        resizeFrame: false,
        useShim: false
    });
    dd.on('drag:start', function() {
        this.get('dragNode').setStyles({
            height: '20px',
            width: '100px',
            backgroundColor: 'blue',
            color: '#fff'
        });
        this.get('dragNode').set('innerHTML', 'Custom Proxy');
        this.deltaXY = [this.deltaXY[0] - 20, this.deltaXY[1] - 20];
    });
});
</script>
