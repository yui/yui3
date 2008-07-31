<ul id="demo">
    <li>lorem</li>
    <li>ispum</li>
    <li>dolor</li>
    <li>sit</li>
</ul>

<script type="text/javascript">
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules; ?>, function(Y) {
    var nodes = Y.all('#demo li');

    var onClick = function(e) {
        nodes.set('innerHTML', 'thanks from all of us!');
        e.currentTarget.setStyle('backgroundColor', 'green');
    };

    nodes.on('click', onClick);
});
</script>
