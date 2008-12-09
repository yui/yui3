<ul id="demo">
    <li>click me if you don't mind...</li>
    <li>click me if you don't mind...</li>
    <li>click me if you don't mind...</li>
    <li>click me if you don't mind...</li>
</ul>

<script type="text/javascript">
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules; ?>, function(Y) {
    var nodes = Y.all('#demo li');

    var onClick = function(e) {
        var target = e.target,
            html = 'Dont forget to click me...',
            filtered;

        if (target.test('#demo li')) {
            target.addClass('yui-pass');
            target.set('innerHTML', 'thanks for the click!');
        }

        filtered = nodes.filter(':not(.yui-pass)');
        if (filtered.set) {
            filtered.set('innerHTML', html);
        }
    };

    Y.get('#demo').on('click', onClick);
});
</script>
