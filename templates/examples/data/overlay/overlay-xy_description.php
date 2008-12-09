<h3>Basic XY Overlay Positioning</h3>

<h4>Setting Up The YUI Instance</h4>

<p>To create an instance of an Overlay on you page, the only module you need to request is the <code>overlay</code> module. The <code>overlay</code> module will pull in the <code>widget</code>, <code>widget-stack</code>, <code>widget-position</code>, <code>widget-position-ext</code> and <code>widget-stdmod</code> dependencies it has.</p>

<textarea name="code" class="JScript" rows="1" cols="60">
YUI({...}).use("overlay", function(Y) {
    // We'll write example code here, where we have a Y.Overlay class available.
});
</textarea>

<p>Note, using the <code>overlay</code> module, will also pull down the default CSS required for overlay, on top of which we only need to add our required look/feel CSS for the example.</p>

<h4>Creating The Overlay From Markup</h4>

<p>For this example, we'll create the overlay instance from markup which already exists on the page, and is shown below:</p>

<textarea name="code" class="HTML" rows="1" cols="60">
    &lt;div id="overlay"&gt;
        &lt;div class="yui-widget-hd"&gt;Overlay Header&lt;/div&gt;
        &lt;div class="yui-widget-bd"&gt;Overlay Body&lt;/div&gt;
        &lt;div class="yui-widget-ft"&gt;Overlay Footer&lt;/div&gt;
    &lt;/div&gt;
</textarea>

<p>The container DIV with id="overlay" is specified as the contentBox for the Overlay instance, and during instantiation, the overlay will look for DIV's marked with the <code>yui-widget-hd, yui-widget-bd, yui-widget-ft</code> classes to setup the Overlay's header body and footer content attributes.</p>

<h4>Instantiating The Overlay</h4>

<p>To create an overlay instance, we use the overlay constructor <code>Y.Overlay</code>, and pass it the <code>contentBox</code> node reference for the existing markup on the page. We also set a height/width for the overlay, specify the initial visible state (false), and the initial position for the Overlay (which otherwise defaults to 0,0):</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    // Create an overlay from markup, using an existing contentBox.
    var overlay = new Y.Overlay({
        contentBox:"#overlay",
        width:"10em",
        height:"10em",
        xy: [xy[0], xy[1] + 35],
        visible:false
    });
    overlay.render();
</textarea>

<p>After creating the overlay instance, we invoke <code>overlay.render()</code> to update the DOM to reflect the current state of the overlay. Before render is called, the state of the Overlay should not be reflected in the DOM (for example, we can change the height, without it being reflected in the DOM. When we finally render, the current height value will be applied to the DOM). We could also pass an optional node reference to the render method, to have the overlay rendered under a different parent node, from where the content box currently lies.</p>

<h4>Moving the Overlay</h4>

<p>Overlays have support for basic page based XY positioning. This example provides a couple of input controls which can be used to move the overlay to a specific XY page co-ordinate. Later examples will show how Overlay's extended positioning support to align/center the Overlay relative to other elements on the page.</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    var xInput = Y.Node.get("#x");
    var yInput = Y.Node.get("#y");

    Y.on("click", function(e) {

        var x = parseInt(xInput.get("value"));
        var y = parseInt(yInput.get("value"));

        overlay.move(x,y);
    }, "#move");
</textarea>

<p>Overlay can be moved by invoking the <code>move</code> method, with either seperate x and y arguments (<code>move(100,200)</code>), or as an array (<code>move([100,200])</code>). The <code>x, y and xy</code> attributes can also be used to move the overlay, and are equivalent to the move method (<code>overlay.set("x", 200);overlay.set("xy", [100,200])</code>)</p>

<p>A select dropdown is added to the example page, along with additional content, to demonstrate the Overlay's ability to provide stacking and shimming support (to block select dropdown bleed through in IE6).</p>

<h4>CSS: Overlay Look/Feel</h4>

<p>The overlay.css Sam Skin file (build/overlay/assets/skins/sam/overlay.css) provides the default functional CSS for the overlay. Namely the CSS rules to hide the overlay, and position it absolutely. However there's no default out-of-the-box look/feel applied to the Overlay widget.</p>

<p>The example provides it's own look and feel for the Overlay, by defining rules for the content box, header, body and footer sections:</p>

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

<p><strong>NOTE:</strong> As discussed on the Widget landing page, all widgets are enclosed in 2 containing elements - the boundingBox is the outer(most) element, and the contentBox is the inner element into which the widget's content is added. It is advised to apply any look/feel CSS for the widget to the content box and it's children. This leaves the bounding box without padding/borders, allowing for consistent positioning/sizing across box models, plus provides the ability to apply a skin class to the boundingBox.</p>
