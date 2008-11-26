<div class="overlay-example" id="overlay-stdmod">
    <div id="overlay">
        <div class="yui-widget-hd">Overlay Header</div>
        <div class="yui-widget-bd">Overlay Body</div>
        <div class="yui-widget-ft">Overlay Footer</div>
    </div>

    <div class="fields">
        <p>
            <label for="content">New content:</label>
            <textarea name="content" id="content"></textarea>
        </p>
        <p>
            <label for="section">Section to add content to:</label>
            <select name="section" id="section">
                <option value="header">Header</option>
                <option value="body">Body</option>
                <option value="footer">Footer</option>
            </select>
        </p>
        <p>
            <label for="where">Replace, insert before or append after existing content:</label>
            <select name="where" id="where">
                <option value="replace">Replace</option>
                <option value="before">Before</option>
                <option value="after">After</option>
            </select>
        </p>
        <p>
            <label>Set new content as a string: <input type="checkbox" name="asString" id="asString" checked="true"></label>
        </p>
        <button type="button" id="setContent">Set Content</button>
    </div>
    <div class="filler">
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed tellus pede, aliquet vitae, faucibus quis, lobortis non, metus. Pellentesque at metus ac mi condimentum egestas. In vel neque a massa porttitor ultrices. Nunc lorem. Vivamus ullamcorper fringilla tortor. Etiam at nunc pellentesque lectus cursus pretium. Integer velit. In quis nunc eget leo rhoncus scelerisque. In in ante ac ante pharetra vestibulum. Praesent sit amet metus. Nam egestas ipsum. Nulla facilisi. Quisque rhoncus, eros sed convallis faucibus, erat felis pretium nisi, non bibendum magna mauris non metus. Integer mauris eros, volutpat non, pretium vitae, rutrum at, tellus. 
    </div>
</div>

<script type="text/javascript">
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>, function(Y) {

    var overlay = new Y.Overlay({
        contentBox:"#overlay",
        width:"20em",
        align: {
            node:"#overlay-stdmod > .filler",
            points:["tl", "tl"]
        }
    });
    overlay.render("#overlay-stdmod");

    var content = Y.Node.get("#content");
    var where = Y.Node.get("#where");
    var section = Y.Node.get("#section");
    var asString = Y.Node.get("#asString");

    Y.on("click", function() {
        var newContent = content.get("value");
        if (! asString.get("checked") ) {
            // Set new content using Node references
            newContent = Y.Node.create(newContent);
        }
        overlay.setStdModContent(section.get("value"), newContent, where.get("value"));
    }, "#setContent");
});
</script>
