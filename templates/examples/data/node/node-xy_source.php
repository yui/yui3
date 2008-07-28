<span id="demo"></span>

<script type="text/javascript">
YUI().use('*', function(Y) {
    var onClick = function(e) {
        Y.get('#demo').setXY([e.pageX, e.pageY]);
    };

    Y.get('document').on('click', onClick);
});
</script>
