<h3>Using the shim</h3>
<p>Here is the code for this example.</p>
<textarea name="code" class="JScript">
YUI().use('dd-ddm', 'dd-drag', 'dd-proxy, function(Y) {

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
</textarea>
