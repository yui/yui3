<ul id="demo">
    <li>click me if you don't mind...</li>
    <li>click me if you don't mind...</li>
    <li>click me if you don't mind...</li>
    <li>click me if you don't mind...</li>
</ul>

<script type="text/javascript">
YUI().use('*', function(Y) {
    var nodes = Y.all('#demo li');

    var onClick = function(e) {
        var target = e.target,
            html = 'Dont forget to click me...';

        if (target.test('#demo li')) {
            target.addClass('yui-pass');
            target.set('innerHTML', 'thanks for the click!');
        }
        nodes.filter(':not(.yui-pass)').set('innerHTML', html);
    };

    Y.get('#demo').on('click', onClick);
});
</script>
