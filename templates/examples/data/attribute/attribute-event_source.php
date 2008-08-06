<div class="attrs">
    <div class="header">Enter a new value and click the "Change Value" button:</div>
    <div class="body">
        <p>
            <label for="attr">Attribute:</label>
            <select id="attr">
                <option value="foo">foo</option>
                <option value="bar">bar</option>
                <option value="foobar">foobar (change will be prevented)</option>
            </select>
        </p>
        <p><label for="newVal">Value:</label><input type="text" id="newVal" /></p>
    </div>
    <div class="footer">
        <button type="button" id="changeValue">Change Value</button>
    </div>
</div>

<div id="example-out"></div>

<script type="text/javascript">
// Get a new YUI instance 
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>, function(Y) {

    // Shortcut to print (unrelated to example)
    var print = YUI.example.print;

    // Setup a custom class with attribute support
    function MyClass(cfg) {
        this._initAtts(MyClass.ATTRIBUTES, cfg);
    }

    // Setup attribute configuration
    MyClass.ATTRIBUTES = {
        "foo" : {
            value:5
        },
 
        "bar" : {
            value:"Hello World!"
        },

        "foobar" : {
            value:true
        }
    };

    Y.augment(MyClass, Y.Attribute);

    var o1 = new MyClass();

    function printEvt(event) {
        print("event.prevVal : " + event.prevVal);
        print("event.newVal : " + event.newVal);
        print("event.attrName : " + event.attrName);
    }

    o1.after("fooChange", function(event) {
        print("after fooChange", "header");
        printEvt(event);
    });

    o1.after("barChange", function(event) {
        print("after barChange", "header");
        printEvt(event);
    });

    o1.on("foobarChange", function(event) {

        // Calling preventDefault, in an "on" listener
        // will prevent the attribute change from occuring
        // and the after listener being called
        print("on foobarChange (prevented)", "header");
        event.preventDefault();
    });

    o1.after("foobarChange", function(event) {
        // This will never get called, because we're
        // calling preventDefault in the "on" listener
        print("after foobarChange", "header");
        printEvt(event);
    });

    var attrSel = Y.Node.get("#attr");
    var attrOpts = attrSel.get("options");
    var newValTxt = Y.Node.get("#newVal");

    Y.on("click", function() {

        var selIndex = attrSel.get("selectedIndex");
        var attr = attrOpts.item(selIndex).get("value");
        o1.set(attr, newValTxt.get("value"));

    }, "#changeValue");

    function populateCurrentValue() {
        var selIndex = attrSel.get("selectedIndex");
        var attr = attrOpts.item(selIndex).get("value");
        newValTxt.set("value", o1.get(attr));
    }

    populateCurrentValue();

    Y.on("change", populateCurrentValue, "#attr");

});
</script>
