<div class="overlay-example" id="overlay-position">

    <label>X: <input type="text" id="x" value="0" ></label>
    <label>Y: <input type="text" id="y" value="0" ></label>
    <button type="button" id="move">Move</button>
    <button type="button" id="show">Show</button>
    <button type="button" id="hide">Hide</button>

    <div id="overlay">
        <div class="yui-widget-hd">Overlay Header</div>
        <div class="yui-widget-bd">Overlay Body</div>
        <div class="yui-widget-ft">Overlay Footer</div>
    </div>

    <p class="filler">
        <select class="needs-shim">
            <option>Prevent IE6 Bleedthrough</option>
        </select>
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nunc pretium quam eu mi varius pulvinar. Duis orci arcu, ullamcorper sit amet, luctus ut, interdum ac, quam. Pellentesque euismod. Nam tincidunt, purus in ultrices congue, urna neque posuere arcu, aliquam tristique purus sapien id nulla. Etiam rhoncus nulla at leo. Cras scelerisque nisl in nibh. Sed eget odio. Morbi elit elit, porta a, convallis sit amet, rhoncus non, felis. Mauris nulla pede, pretium eleifend, porttitor at, rutrum id, orci. Quisque non urna. Nulla aliquam rhoncus est. 
    </p>
</div>

<script type="text/javascript">
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>, function(Y) {

    var xy = Y.Node.get("#overlay-position").getXY();

    // Create an overlay from markup
    var overlay = new Y.Overlay({
        contentBox:"#overlay",
        width:"10em",
        height:"10em",
        xy: [xy[0], xy[1] + 35],
        visible:false
    });
    overlay.render();

    var xInput = Y.Node.get("#x");
    var yInput = Y.Node.get("#y");

    xInput.set("value", overlay.get("x"));
    yInput.set("value", overlay.get("y"));

    Y.on("click", function(e) {
        var x = parseInt(xInput.get("value"));
        var y = parseInt(yInput.get("value"));
        overlay.move(x,y);
    }, "#move");

    Y.on("click", Y.bind(overlay.show, overlay), "#show");
    Y.on("click", Y.bind(overlay.hide, overlay), "#hide");
});
</script>
