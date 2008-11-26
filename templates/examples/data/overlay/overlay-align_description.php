<h3>Basic XY Overlay Positioning</h3>

<p>TODO: Creating the Sandbox</p>

<textarea name="code" class="JScript" rows="1" cols="60">
YUI({...}).use("overlay", function(Y) {
    
});
</textarea>

<p>TODO: Instantiating the overlay</p>

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

<p>TODO: Aligning the overlay</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    /* Center in #overlay-align */
    overlay.set("align", {node:"#overlay-align", points:["cc", "cc"]});

    /* Align top-left corner of overlay, with top-right corner of #align1 */
    overlay.set("align", {node:"#align1", points:["tl", "tr"]});

    /* Center overlay in #align2 */
    overlay.set("centered", "#align2");

    /* Align right-center edge of overlay with right-center edge of viewport */
    overlay.set("align", {points:["rc", "rc"]});

    /* Center overlay in viewport */
    overlay.set("centered", true);

    /* Align top-center edge of overlay with bottom-center edge of #align3 */
    overlay.set("align", {node:"#align3", points:["tc", "bc"]});
</textarea>

<p>TODO: Overlay Look/Feel</p>

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