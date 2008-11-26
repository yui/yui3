<h3>Basic XY Overlay Positioning</h3>

<p>TODO: Creating the Sandbox</p>

<textarea name="code" class="JScript" rows="1" cols="60">
YUI({...}).use("overlay", function(Y) {
    
});
</textarea>

<p>TODO: Instantiating the overlays</p>

<textarea name="code" class="JScript" rows="1" cols="60">

    for (var i = 0; i < n; ++i) {

        ovrXY = getOverlayXY(xy, i);
        ovrZIndex = i+1;

        // Setup n Overlays, with increasing zIndex values
        overlay = new Y.Overlay({
            zIndex:ovrZIndex,
            xy:ovrXY,
            width:"8em",
            height:"8em",
            headerContent: 'Overlay <span class="yui-ovr-number">' + i + '</span>',
            bodyContent: "zIndex = " + ovrZIndex
        });

        overlay.render("#overlay-stack");
        overlays.push(overlay);

        // Update body whenever zIndex changes
        overlay.after("zIndexChange", function(e) {
            this.set("bodyContent", "zIndex = " + e.newVal);
        });
    }
</textarea>

<p>TODO: Handling MouseDown using Y.Widget.getByNode</p>

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


<p>TODO: bringToTop Implementation, hasImpl</p>

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

<p>TODO: Overlay Look/Feel</p>

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