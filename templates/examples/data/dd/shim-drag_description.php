<h3>Using the shim</h3>
<p>Here is the code for this example.</p>
<textarea name="code" class="JScript">
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
</textarea>
