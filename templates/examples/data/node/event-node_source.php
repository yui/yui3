<ul id="demo">
    <li>lorem</li>
    <li>ispum</li>
</ul>

<script type="text/javascript">
YUI().use('*', function(Y) {
    var onClick = function(e) {
        e.currentTarget.set('innerHTML', e.type);
    };

    Y.all('#demo li').on('click', onClick);
});
</script>

