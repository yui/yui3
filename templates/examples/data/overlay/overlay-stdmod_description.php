<h3>Overlay's Standard Module Support</h3>

<p>TODO: Creating the Sandbox</p>

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
    var overlay = new Y.Overlay({
        contentBox:"#overlay",
        width:"20em",
        align: {
            node:"#overlay-stdmod > .filler",
            points:["tl", "tl"]
        }
    });
    overlay.render("#overlay-stdmod");
</textarea>

<p>TODO: Setting Content</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    // Hold onto input field references.
    var content = Y.Node.get("#content");
    var where = Y.Node.get("#where");
    var section = Y.Node.get("#section");
    var asString = Y.Node.get("#asString");

    Y.on("click", function() {

        // New content to be added.
        var newContent = content.get("value");

        // If the "Set content as string" checkbox is checked, we pass new content into the 
        // setStdModContent method as as string (innerHTML will be used to set the new content).
        
        // If it's not checked, we create a node reference from the string,
        // and pass the new content into the setStdModContent as a node reference.

        if (! asString.get("checked") ) {
            newContent = Y.Node.create(newContent);
        }

        overlay.setStdModContent(section.get("value"), newContent, where.get("value"));

    }, "#setContent");
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