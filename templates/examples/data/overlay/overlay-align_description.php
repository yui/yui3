<h3>Extended XY Overlay Positioning - Align, Center Support</h3>

<h4>Setting Up The YUI Instance</h4>

<p>As with the <a href="overlay-xy.html">"Basic XY Positioning"</a> example, to create an instance of an Overlay on you page, the only module you need to request is the <code>overlay</code> module. The <code>overlay</code> module will pull in the <code>widget</code>, <code>widget-stack</code>, <code>widget-position</code>, <code>widget-position-ext</code> and <code>widget-stdmod</code> dependencies it has.</p>

<textarea name="code" class="JScript" rows="1" cols="60">
YUI({...}).use("overlay", function(Y) {
    // We'll write example code here, where we have a Y.Overlay class available.
});
</textarea>

<p>Note, using the <code>overlay</code> module, will also pull down the default CSS required for overlay, on top of which we only need to add our required look/feel CSS for the example.</p>

<h4>Instantiating The Overlay</h4>

<p>For this example, we'll instantiate an Overlay, as we did for the <a href="overlay-xy.html">"Basic XY Positioning"</a> example, however we'll set the content for the Overlay sections using the <code>headerContent</code> and <code>bodyContent</code> attributes (and not create a footer section):</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    /* Create Overlay from script, this time. With no footer */
    var overlay = new Y.Overlay({
        width:"10em",
        height:"10em",
        headerContent: "Aligned Overlay",
        bodyContent: "Click the 'Align Next' button to try a new alignment",
        zIndex:2
    });

    /* Render it as a child of the #overlay-align element */
    overlay.render("#overlay-align");
</textarea>

<p>Since the Overlay is created from script, and doesn't currently exist in the document, we pass the <code>overlay.render("#overlay-align")</code> method a selector reference to the node under which we want the Overlay to be rendered in the DOM. If we leave out this argument to render (or if the selector reference doesn't bring back a node), the Overlay will be rendered to the current document's body element.</p>

<h4>Aligning the overlay</h4>

<p>The <a href="../../api/WidgetPositionExt.html"><code>WidgetPositionExt</code></a> extension used to create the overlay class add <code>align</code> and <code>centered</code> attributes to the Overlay, which can be used to align or center the Overlay relative to another element on the page (or the viewport).</p>

<p>The <code>align</code> attribute accepts as a value an object literal with the following properties:</p>

<dl>
    <dt>node</dt>
    <dd>
      The node to which the Widget is to be aligned. If set to null, or not provided, the Overlay is aligned to the viewport
    </dd>
    <dt>points</dt>
    <dd>
      <p>
      A two element array, defining the two points on the Overlay and node which are to be aligned. The first element is the point on the Overlay, and the second element is the point on the node (or viewport).
      Supported alignment points are defined as static properties on <code>WidgetPositionExt</code>.
      </p>
      <p>
      e.g. <code>[WidgetPositionExt.TR, WidgetPositionExt.TL]</code> aligns the Top-Right corner of the Overlay with the
      Top-Left corner of the node/viewport, and <code>[WidgetPositionExt.CC, WidgetPositionExt.TC]</code> aligns the Center of the 
      Overlay with the Top-Center edge of the node/viewport.
      </p>
    </dd>
</dl>

<p>The <code>centered</code> property can either by set to <code>true</code> to center the Overlay in the viewport, or set to a selector string or node reference to center the Overlay in a particular node.</p>

<p>The example loops around a list of 6 alignment configurations, as the "Align Next" button is clicked:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    /* Center in #overlay-align (example box) */
    overlay.set("align", {node:"#overlay-align", points:[WidgetPositionExt.CC, WidgetPositionExt.CC]});
    
    /* Align top-left corner of overlay, with top-right corner of #align1 */
    overlay.set("align", {node:"#align1", points:[WidgetPositionExt.TL, WidgetPositionExt.TR]});
    
    /* Center overlay in #align2 */
    overlay.set("centered", "#align2");
    
    /* Align right-center edge of overlay with right-center edge of viewport */
    overlay.set("align", {points:[WidgetPositionExt.RC, WidgetPositionExt.RC]});
    
    /* Center overlay in viewport */
    overlay.set("centered", true);
    
    /* Align top-center edge of overlay with bottom-center edge of #align3 */
    overlay.set("align", {node:"#align3", points:[WidgetPositionExt.TC, WidgetPositionExt.BC]});
</textarea>

<p><strong>NOTE:</strong> PR3 will add support to <code>WidgetPositionExt</code>, to re-align the Overlay in response to trigger events (e.g. window resize, scroll etc.) and support for constrained positioning.</p>

<h4>CSS: Overlay Look/Feel</h4>

<p>As mentioned in the <a href="overlay-xy.html">"Basic XY Positioning"</a> example, the overlay.css Sam Skin file (build/overlay/assets/skins/sam/overlay.css) provides the default functional CSS for the overlay. Namely the CSS rules to hide the overlay, and position it absolutely. However there's no default out-of-the-box look/feel applied to the Overlay widget.</p>

<p>The example provides it's own look and feel for the Overlay, by defining rules for the content box, header and body sections:</p>

<textarea name="code" class="CSS" rows="1" cols="60">
.yui-overlay-content {
    padding:2px;
    border:1px solid #000;
    background-color:#aaa;
    font-size:93%;
}

.yui-overlay-content .yui-widget-hd {
    font-weight:bold;
    text-align:center;
    padding:2px;
    border:2px solid #aa0000;
    background-color:#fff;
}

.yui-overlay-content .yui-widget-bd {
    text-align:left;
    padding:2px;
    border:2px solid #0000aa;
    background-color:#fff;
}
</textarea>
