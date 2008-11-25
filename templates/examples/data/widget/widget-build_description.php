<h3>Creating Custom Widget Flavors, using the WidgetPosition, WidgetStack, WidgetPositionExt and WidgetStdMod extensions</h3>

<h4>Widget 1 - Widget with only WidgetStdMod (and no positioning or stacking support)</h4>

<p>TODO: Using Build</p>

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

<p>TODO: Testing it Out</p>

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

    // This shoud fail, since the StandardModule widget is not positionable
    Y.on("click", function(e) {
        try {
            stdmod.move([0,0]);
        } catch (e) {
            alert("move() is " + typeof stdmod.move + ", stdmod.hasImpl(Y.WidgetPosition) : " + stdmod.hasImpl(Y.WidgetPosition));
        }
    }, "#tryMove");
</textarea>

<p>TODO: CSS Considerations</p>

<textarea name="code" class="CSS" rows="1" cols="60">

/* Visibility - How to handle visibility for this new widget */
.yui-standardmodule-hidden {
    display:none;
}

/* Bounding Box - default styling for this widget */
.yui-standardmodule {
    ...
}

/* Content Box - default styling for this widget */
.yui-standardmodule-content {
    ...
}

/* header, body, footer sections - default styling for this widget */
.yui-standardmodule-content .yui-widget-hd, 
.yui-standardmodule-content .yui-widget-bd, 
.yui-standardmodule-content .yui-widget-ft {
    ...
}
</textarea>

<h4>Widget 2 - Widget with only WidgetPosition and WidgetStack support (no standard module or advanced positioning support)</h4>

<p>TODO: Using Build (note that base Widget class, or StandardModule class is unchanged)</p>

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

<p>TODO: Testing it Out</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    // This should work, since Positionable has basic XY Positioning support
    Y.on("click", function(e) {
        var x = parseInt(xInput.get("value"));
        var y = parseInt(yInput.get("value"));

        positionable.move(x,y);

    }, "#move");

    // This should fail, since Positionable does not have Standard Module sections
    Y.on("click", function(e) {
        try {
            positionable.setStdModContent("header", "new content");
        } catch (e) {
            alert("setStdModContent() is " + typeof positionable.setStdModContent + ", positionable.hasImpl(Y.WidgetStdMod) : " + positionable.hasImpl(Y.WidgetStdMod));
        }
    }, "#tryContent");
</textarea>

<p>TODO: CSS Considerations</p>

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

<h4>Widget 3 - Widget with WidgetPosition, WidgetStack and WidgetPositionExt support (but still no standard module)</h4>

<p>TODO: Using Build (note that base Widget class, or StandardModule class is unchanged)</p>

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

<p>TODO: Testing it Out (using queue to run through 6 alignment steps)</p>

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

<p>TODO: CSS Considerations (as with Widget 2 - the positioned widget</p>

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