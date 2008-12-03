<h3>Basic Overlay Stackability (zIndex and shim support)</h3>

<h4>Setting Up The YUI Instance</h4>

<p>As with the <a href="overlay-xy.html">"Basic XY Positioning"</a> example, to create an instance of an Overlay on your page, the only module you need to request is the <code>overlay</code> module. The <code>overlay</code> module will pull in the <code>widget</code>, <code>widget-stack</code>, <code>widget-position</code>, <code>widget-position-ext</code> and <code>widget-stdmod</code> dependencies it has.</p>

<textarea name="code" class="JScript" rows="1" cols="60">
YUI({...}).use("overlay", function(Y) {
    // We'll write example code here, where we have a Y.Overlay class available.
});
</textarea>

<p>Note, using the <code>overlay</code> module, will also pull down the default CSS required for overlay, on top of which we only need to add our required look/feel CSS for the example.</p>

<h4>Instantiating The Overlay</h4>

<p>For this example, we'll instantiate Overlays, as we did for the <a href="overlay-align.html">"Extended XY Positioning"</a> example from script. However we'll create 6 overlay intances and give them increasing zIndex and xy attribute values:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    function getOverlayXY(xy, i) {
        return [xy[0] + i * 60, xy[1] + i * 40];
    }

    for (var i = 0; i < n; ++i) {

        ovrXY = getOverlayXY(xy, i);
        ovrZIndex = i+1;

        // Setup n Overlays, with increasing zIndex values and xy positions
        overlay = new Y.Overlay({
            zIndex:ovrZIndex,
            xy:ovrXY,

            width:"8em",
            height:"8em",
            headerContent: 'Overlay <span class="yui-ovr-number">' + i + '</span>',
            bodyContent: "zIndex = " + ovrZIndex
        });

        overlay.render("#overlay-stack");

        ...

    }
</textarea>

<p>We store the overlay instances in an <code>overlays</code> array, which we'll later use to sort the overlays by their zIndex values. We also setup a listener for the <code>zIndex</code> attribute change event, which will update the body section of the Overlay to display it's new zIndex value.</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    overlays.push(overlay);

    // Update body whenever zIndex changes
    overlay.after("zIndexChange", function(e) {
        this.set("bodyContent", "zIndex = " + e.newVal);
    });
</textarea>

<h4>Handling MouseDown Using Widget.getByNode</h4>

<p>The <code>Widget</code> class has a static <code>getByNode</code> method which can be used to retrieve Widget instances based on a node reference. The method will return the closest Widget which contains the given node.</p>

<p>
We'll use this method in a click listener bound to the container of the example ("#overlay-stack"). Target nodes of click events bubbled up to this example container, will be passed to the <code>Widget.getByNode</code> method, to see if an overlay was clicked on.
</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    function onStackMouseDown(e) {
        var widget = Y.Widget.getByNode(e.target);

        // If user clicked on an Overlay, bring it to the top of the stack
        if (widget && widget instanceof Y.Overlay) {
            bringToTop(widget);
        }
    }

    Y.on("mousedown", onStackMouseDown, "#overlay-stack");
</textarea>

<p>If it is, we invoke the simple bringToTop method, which will set the zIndex of the clicked Overlay to the highest current Overlay zIndex value.</p>

<h4>The <code>bringToTop</code> Implementation</h4>

<p>We use a basic comparator function to sort the array of Overlays we have. The comparator makes sure the array element we're dealing with <a href="../widget/widget-build.html">has a <code>WidgetStack</code> implementation</a> (which Overlays do) and if so, sorts them in descending <code>zIndex</code> attribute value order:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    // zIndex comparator
    function byZIndexDesc(a, b) {
        if (!a || !b || !a.hasImpl(Y.WidgetStack) || !b.hasImpl(Y.WidgetStack)) {
            return 0;
        } else {
            var aZ = a.get("zIndex");
            var bZ = b.get("zIndex");

            if (aZ > bZ) {
                return -1;
            } else if (aZ < bZ) {
                return 1;
            } else {
                return 0;
            }
        }
    }
</textarea>

<p>Once sorted, for the purposes of the example, we simply switch the <code>zIndex</code> of the "highest" Overlay, with the Overlay which was clicked on, giving the selected Overlay the highest zIndex value:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    function bringToTop(overlay) {

        // Sort overlays by their numerical zIndex values
        overlays.sort(byZIndexDesc);

        // Get the highest one
        var highest = overlays[0];

        // If the overlay is not the highest one, switch zIndices
        if (highest !== overlay) {
            var highestZ = highest.get("zIndex");
            var overlayZ = overlay.get("zIndex");

            overlay.set("zIndex", highestZ);
            highest.set("zIndex", overlayZ);
        }
    }
</textarea>

<h4>CSS: Overlay Look/Feel</h4>

<p>As mentioned in the <a href="overlay-xy.html">"Basic XY Positioning"</a> example, the overlay.css Sam Skin file (build/overlay/assets/skins/sam/overlay.css) provides the default functional CSS for the overlay. Namely the CSS rules to hide the overlay, and position it absolutely. However there's no default out-of-the-box look/feel applied to the Overlay widget.</p>

<p>The example provides it's own look and feel for the Overlay, by defining rules for the content box, header and body sections:</p>

<textarea name="code" class="CSS" rows="1" cols="60">
/* Overlay Look/Feel */
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

.yui-overlay-content .yui-widget-hd .yui-ovr-number {
    color:#aa0000;
}
</textarea>