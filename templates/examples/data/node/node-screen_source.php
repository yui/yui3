<dl id="demo">
    <dt>Window size</dt>
    <dd class="yui-data-win">Click me to find out</dd>
    <dt>Document size</dt>
    <dd class="yui-data-doc">Click me to find out</dd>
</dl>

<script type="text/javascript">
YUI().use('*', function(Y) {
    var onClick = function(e) {
        var target = e.target,
            h, w;

        if (target.test('dd')) {
            if (target.test('.yui-data-win')) {
                h = target.get('winHeight');
                w = target.get('winWidth');
            } else if (target.test('.yui-data-doc')) {
                h = target.get('docHeight');
                w = target.get('docWidth');

            }
            target.set('innerHTML', 'width: ' + w + ' height: ' + h);
        }
    };

    Y.get('#demo').on('click', onClick);
});
</script>
