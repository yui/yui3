<h3>Creating Custom Widget Classes</h3>

<p>The <code>Base</code> class provides a <code>build</code> method which can be used to create custom versions of classes which derive from <code>Base</code> by adding extension classes to them.</p>

<p>Widget ships with four such extensions for PR2: <code>WidgetPosition</code>, <code>WidgetStack</code>, <code>WidgetPositionExt</code> and <code>WidgetStdMod</code>.
These extensions are used to build the basic <code>Overlay</code> widget, but can also be used individually, to create custom versions of the base <code>Widget</code> class.</p>

<h3>Widget with WidgetStdMod support</h3>

<p>Adding the <code>WidgetStdMod</code> extension to Widget, creates a statically positioned Widget, with support for standard module format sections - header, body and footer, which maybe useful in portal type use cases, where the positioning/stacking capabilities which come bundled with Overlay are not required.</p>

<p>To create a custom class, we use <a href="../../api/Base.html#method_build"><code>Base.build</code></a>, which is described in detail on the landing page for <a href="http://developer.yahoo.com/yui/3/base/#buildcreate">Base</a>.</p>

<p>We pass in <code>Widget</code> as the main class we want to add extensions to, and <code>WidgetStdMod</code> as the extension we'd like added to the main class:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    var StandardModule = Y.Base.build(Y.Widget, [Y.WidgetStdMod]);
    StandardModule.NAME = "standardModule";

    // Render from Markup
    var stdmod = new StandardModule({
        contentBox: "#widget1",
        width:"12em",
        height:"12em"
    });
    stdmod.render();
</textarea>

<p><code>Base.build</code> will:</p>
<ol>
    <li>Create a new class which extends <code>Widget</code></li>
    <li>Aggregate known <code>Base</code> and <code>Widget</code> fields, such as <code>ATTRS</code> and <code>HTML_PARSER</code> from <code>WidgetStdMod</code> on the new class</li>
    <li>Augment prototype methods from <code>WidgetStdMod</code> onto the new class prototype</li>
</ol>

<p>The only other step we need to take is to give the newly created class a <code>NAME</code> just like any other extended Widget class.</p>

<p>Note that the <code>Widget</code> class is unchanged, allowing you to now create instances of the base <code>Widget</code> class, without any standard module support, as well as instances of the StandardModule widget, which has standard module support.</p>

<h4>Testing It Out</h4>

<p>The example attempts to set content on an instance of the newly created <code>StandardModule</code> class, using the <code>setStdModContent</code> method which is added by the extension (which would otherwise not exist on the Widget instance).</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    var contentInput = Y.Node.get("#content");
    var sectionInput = Y.Node.get("#section");

    // This should work, since the StandardModule widget has settable 
    // header/body/footer sections
    Y.on("click", function(e) {

        var content = contentInput.get("value");
        var section = sectionInput.get("value");

        stdmod.setStdModContent(section, content);

    }, "#setContent");
</textarea>

<p>To verify that no unrequested features are added, we also attempt to move the instance using the <code>move</code> method, which is not part of the base Widget class, and would be added by the <code>WidgetPosition</code> extension. This verifies that the other examples we have, which do create new classes which use <code>WidgetPosition</code>, have not modified the base Widget class.</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    // This shoud fail, since the StandardModule widget is not positionable
    Y.on("click", function(e) {
        try {
            stdmod.move([0,0]);
        } catch (e) {
            alert("move() is " + typeof stdmod.move + ", stdmod.hasImpl(Y.WidgetPosition) : " + stdmod.hasImpl(Y.WidgetPosition));
        }
    }, "#tryMove");
</textarea>

<p>Note that <code>Base.build</code> adds a <code>hasImpl</code> method to the built class, which allows you to query whether or not it has a particular extension applied.</p>

<h4>CSS Considerations</h4>

<p>We need to define the CSS which goes with this new <code>StandardModule</code> class we have created. The only rule really required out of the box is the rule which handles visibility (<code>yui-standardmodule-hidden</code>). The "standardmodule" used in the class name comes from the <code>NAME</code> property we set up for the new class, and is used to prefix all state related classes added to the widgets bounding box.
Since the <code>StandardModule</code> class is not positionable, we use <code>display:none</code> to define the <code>hidden</code> state.</p>

<textarea name="code" class="CSS" rows="1" cols="60">

/* Visibility - How to handle visibility for this new widget */
.yui-standardmodule-hidden {
    display:none;
}
</textarea>

<p>The other "yui-standardmodule" rules are only used to create the required look/feel for this particular example, and do not impact the StandardModule widget's functionality.</p>

<h3>Widget with WidgetPosition and WidgetStack support</h3>

<p>As with <code>StandardModule</code>, we use <code>Base.build</code> to create the new <code>Positionable</code> widget class. This time we add <code>WidgetPosition</code> and <code>WidgetStack</code> support to the base <code>Widget</code> class to create a basic XY positionable widget, with shimming and z-index support.</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    var Positionable = Y.Base.build(Y.Widget, [Y.WidgetPosition, Y.WidgetStack]);
    Positionable.NAME = "positionable";

    // Render from markup
    var positionable = new Positionable({
        contentBox: "#widget2",
        width:"10em",
        height:"10em",
        zIndex:1
    });
    positionable.render("#widget2-example");

    var xy = Y.Node.get("#widget2-example > p").getXY();
    positionable.move(xy[0] + 5, xy[1] + 5);
</textarea>

<p>We <strong>don't</strong> add <code>WidgetPositionExt</code> or <code>WidgetStdMod</code> support, so the widget doesn't have extended positioning support (align, center) or standard module support. Hence we position it manually using the <code>move</code> method which the <code>WidgetPosition</code> extension provides.</p>

<h4>Testing It Out</h4>

<p>We should now be able to invoke the <code>move</code> method on an instance of the newly created <code>Positionable</code> class:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    // This should work, since Positionable has basic XY Positioning support
    Y.on("click", function(e) {
        var x = parseInt(xInput.get("value"));
        var y = parseInt(yInput.get("value"));

        positionable.move(x,y);

    }, "#move");
</textarea>

<p>And, as with the <code>StandardModule</code> class, we should not be allowed to invoke any methods from an extension which we didn't request:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    // This should fail, since Positionable does not have Standard Module sections
    Y.on("click", function(e) {
        try {
            positionable.setStdModContent("header", "new content");
        } catch (e) {
            alert("setStdModContent() is " + typeof positionable.setStdModContent + ", positionable.hasImpl(Y.WidgetStdMod) : " + positionable.hasImpl(Y.WidgetStdMod));
        }
    }, "#tryContent");
</textarea>

<h4>CSS Considerations</h4>

<p>Since now we have a positionable widget, with z-index support, we set the widget to be absolutely positioned by default, and control it's hidden state using <code>visibility</code> as opposed to <code>display</code></p>

<textarea name="code" class="CSS" rows="1" cols="60">
/* Define absolute positioning as the default for positionable widgets */
.yui-positionable {
    position:absolute;
}

/* 
   In order to be able to position the widget when hidden, we define hidden
   to use visibility, as opposed to display
*/
.yui-positionable-hidden {
    visibility:hidden;
}
</textarea>

<h3>Widget with WidgetPosition, WidgetStack and WidgetPositionExt support</h3>

<p>Lastly, we'll attempt to create a new widget class, which, in addition to basic positioning and stacking support, also has extended positioning support, allowing us to align it with other elements on the page.</p>

<p>Again, we use <code>Base.build</code> to create our new <code>Alignable</code> widget class, by combining <code>WidgetPosition</code>, <code>WidgetStack</code> and <code>WidgetPositionExt</code> with the base widget class:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    var Alignable = Y.Base.build(Y.Widget, [Y.WidgetPosition, Y.WidgetPositionExt, Y.WidgetStack]);
    Alignable.NAME = "alignable";

    var alignable = new Alignable({
        width:"10em",
        height:"10em",
        align : {
            node: "#widget3-example",
            points: ["cc", "cc"]
        },
        zIndex:1
    });
    alignable.get("contentBox").set("innerHTML", '<strong>Alignable Widget</strong><div id="alignment"><p>#widget3-example</p><p>[center, center]</p></div>');
    alignable.render("#widget3-example");
</textarea>

<h4>Testing It Out</h4>

<p>We'll attempt to align an instance of the <code>Alignable</code> class, using some of the additional attributes which <code>WidgetPositionExt</code> adds to the base <code>Widget</code> class: <code>align</code> and <code>centered</code>:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    // Align left-center egde of widget to right-center edge of the node with id "widget3-example"
    alignable.set("align", {node:"#widget3-example", points:["lc", "rc"]});
    
    // Align top-right corner of widget to bottom-right corner of the node with id "widget3-example"
    alignable.set("align", {node:"#widget3-example", points:["tr", "br"]});

    // Center the widget in the node with id "widget3-example"
    alignable.set("centered", "widget3-example");

    // Align the right-center edge of the widget to the right center edge of the viewport (since a node is not provided to 'align')
    alignable.set("align", {points:["rc", "rc"]});

    // Center the widget in the viewport (wince a node is not provided to 'centered')
    alignable.set("centered", true);

    // Return the node to it's original alignment (centered in the node with id "widget3-example")
    // NOTE: centered is a shortcut for align : { points:["cc", "cc"] }
    alignable.set("align", {node:"#widget3-example", points:["cc", "cc"]});
</textarea>

<h4>CSS Considerations</h4>

<p>The <code>Alignable</code> widget class, has the same core CSS rules as the <code>Positionable</code> class, to define how it is positioned and how it is hidden:</p>

<textarea name="code" class="CSS" rows="1" cols="60">
/* Define absolute positioning as the default for alignable widgets */
.yui-alignable {
    position:absolute;
}

/* 
   In order to be able to position the widget when hidden, we define hidden
   to use visibility, as opposed to display
*/
.yui-alignable-hidden {
    visibility:hidden;
}
</textarea>