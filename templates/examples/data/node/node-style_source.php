<div id="demo">
    <p>Click me to change my color and show some style information.</p>
</div>


<script type="text/javascript">
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules; ?>, function(Y) {
    var onClick = function(e) {
        var node = e.currentTarget;
        if (!node.query('dl')) { // only create the DL once
            node.setStyle('color', 'green');
            var styleColor = node.getStyle('color');
            var computedColor = node.getComputedStyle('color');

            node.appendChild(Y.Node.create('<dl>' +
                '<dt>style.color</dt><dd>' + styleColor + '</dd>' + 
                '<dt>computedStyle.color</dt><dd>' + computedColor + '</dd>' +
            '</dl>'));
        }
    };

    Y.get('#demo').on('click', onClick);
});
</script>
