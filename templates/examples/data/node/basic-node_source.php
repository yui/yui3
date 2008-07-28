<div id="demo">
    <p>Whose child am I?</p>
</div>

<script type="text/javascript">
YUI().use('*', function(Y) {
    var node = Y.get('#demo p');

    onClick = function(e) {
        var node = e.currentTarget;
        var html = 'I am a child of ' + node.get('parentNode').get('id') + '.';
        node.set('innerHTML', html);
    };

    node.on('click', onClick);
});

</script>
