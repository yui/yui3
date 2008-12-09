<h3>Overlay's Standard Module Support</h3>

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

<h4>Instantiating The Overlay</h4>

<p>To create an overlay instance, we use the overlay constructor <code>Y.Overlay</code>, and pass it the <code>contentBox</code> node reference for the existing markup on the page:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    var overlay = new Y.Overlay({
        contentBox:"#overlay",
        width:"20em",
        align: {
            node:"#overlay-stdmod > .filler",
            points:["tl", "tl"]
        }
    });
    overlay.render();
</textarea>

<p>We also set it's width and align it to the filler paragraph in the example box ("#overlay-stdmod > .filler"). We don't pass any node references to the <code>render</code> method, so the Overlay is rendered in the location of the contentBox provided.</p>

<h4>Setting Content</h4>

<p>
The example provides a set of input fields, allowing the user to set content in either of the 3 standard module sections which Overlay supports using Overlay's <code>setStdModContent</code> method. 
The content can either be inserted before, appended after, or replace existing content in the specified section.</p>

<p>
Additionally the new content can be converted to a node instance before being added to the specified section. Although it has no impact on the example, if the new content is added as a string, innerHTML is used to insert before or append after the existing section content, removing any event listeners which may have been attached to elements inside the section. The ability to convert the content to a node instance is provided in the example to illustrate Overlay's ability to handle both content formats.
</p>

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
        // setStdModContent method as string (innerHTML will be used to set the new content).
        
        // If it's not checked, we create a node reference from the string,
        // and pass the new content into the setStdModContent as a node reference.

        if (! asString.get("checked") ) {
            newContent = Y.Node.create(newContent);
        }

        overlay.setStdModContent(section.get("value"), newContent, where.get("value"));

    }, "#setContent");
</textarea>

<h4>CSS: Overlay Look/Feel</h4>

<p>As with the other basic overlay examples, the overlay.css Sam Skin file (build/overlay/assets/skins/sam/overlay.css) provides the default functional CSS for the overlay. Namely the CSS rules to hide the overlay, and position it absolutely. However there's no default out-of-the-box look/feel applied to the Overlay widget.</p>

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