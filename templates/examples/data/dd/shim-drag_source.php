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
<p>Try dragging the proxy element over the iframe below, in most browsers this will not happen. Now click the <code>Shim off</code> button and drag again. Now you can drag over the iframe.</p>
<p>You can see the shim by clicking the <code>Debug Off</code> button.</p>
<p><button id="shim" value="off">Shim Off</button> <button id="debugShim" value="off" disabled>Debug Off</button></p>
<div id="demo">Drag Me</div>
<iframe id="ifrm" src="<?php echo $assetsDirectory; ?>blank.htm"></iframe>

<script>

var Y = YUI().use('dd-ddm', 'dd-drag', 'dd-proxy', function(Y) {
    //Toggling the buttons
    Y.Node.get('#shim').on('click', function(e) {
        var value = e.target.get('value');
        if (value == 'off' || value == 'Shim Off') {
            dd.set('useShim', true);
            e.target.set('value', 'on');
            e.target.set('innerHTML', 'Shim On');
            Y.Node.get('#debugShim').set('disabled', false);
        } else {
            dd.set('useShim', false);
            e.target.set('value', 'off');
            e.target.set('innerHTML', 'Shim Off');
            Y.Node.get('#debugShim').set('disabled', true);
        }
    });
    
    Y.Node.get('#debugShim').on('click', function(e) {
        var value = e.target.get('value');
        if (value == 'off' || value == 'Debug Off') {
            Y.DD.DDM._debugShim = true;
            e.target.set('value', 'on');
            e.target.set('innerHTML', 'Debug On');
        } else {
            Y.DD.DDM._debugShim = false;
            e.target.set('value', 'off');
            e.target.set('innerHTML', 'Debug Off');
        }
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
