<h3>Basic XY Overlay Positioning</h3>

<p>TODO: Creating the Sandbox (default CSS also pulled in)</p>

<textarea name="code" class="JScript" rows="1" cols="60">
YUI({...}).use("overlay", function(Y) {
    
});
</textarea>

<p>TODO: Creating From Markup</p>

<textarea name="code" class="HTML" rows="1" cols="60">
    &lt;div id="overlay"&gt;
        &lt;div class="yui-widget-hd"&gt;Overlay Header&lt;/div&gt;
        &lt;div class="yui-widget-bd"&gt;Overlay Body&lt;/div&gt;
        &lt;div class="yui-widget-ft"&gt;Overlay Footer&lt;/div&gt;
    &lt;/div&gt;
</textarea>

<p>TODO: Instantiating the overlay</p>

<textarea name="code" class="JScript" rows="1" cols="60">
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
</textarea>

<p>TODO: Moving the overlay</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    var xInput = Y.Node.get("#x");
    var yInput = Y.Node.get("#y");

    Y.on("click", function(e) {
        var x = parseInt(xInput.get("value"));
        var y = parseInt(yInput.get("value"));
        overlay.move(x,y);
    }, "#move");
</textarea>

<p>TODO: Overlay Look/Feel</p>

<textarea name="code" class="CSS" rows="1" cols="60">
/* Overlay Look/Feel */
.yui-overlay-content {
    padding:3px;
    border:1px solid #000;
    background-color:#aaa;
}

.yui-overlay-content .yui-widget-hd {
    padding:5px;
    border:2px solid #aa0000;
    background-color:#fff;
}

.yui-overlay-content .yui-widget-bd {
    padding:5px;
    border:2px solid #0000aa;
    background-color:#fff;
}

.yui-overlay-content .yui-widget-ft {
    padding:5px;
    border:2px solid #00aa00;
    background-color:#fff;
}
</textarea>