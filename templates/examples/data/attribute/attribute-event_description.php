<h3>Listening For Attribute Change Events</h3>

<p>In this example, we'll show how you can listen for attribute change events, and interact with the event payload.</p>

<h4>Setting Up A Custom Class With Attribute</h4>

<p>First, we setup the same custom class we created for the basic example with 3 attributes <code>foo, bar and foobar</code>, using the code below:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
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
</script>
</textarea>

<h4>Setting Up Event Listeners</h4>

<p>Once we have an instance of the custom class, we can use the <code>on</code> and <code>after</code> methods provided by Attribute, to listen for changes in the value of each of the attributes:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
    var o1 = new MyClass();

    ...

    o1.after("fooChange", function(e) {
        print("after fooChange", "header");
        printEvt(e);
    });

    o1.after("barChange", function(e) {
        print("after barChange", "header");
        printEvt(e);
    });

    o1.on("foobarChange", function(e) {

        // Calling preventDefault, in an "on" listener
        // will prevent the attribute change from occuring
        // and prevent the after listeners from being called
        print("on foobarChange (prevented)", "header");
        e.preventDefault();
    });

    o1.after("foobarChange", function(e) {
        // This will never get called, because we're
        // calling preventDefault in the "on" listener
        print("after foobarChange", "header");
        printEvt(e);
    });
</script>
</textarea>

<p>As seen in the above code, the event type for attribute change events, is <code>attribute name + "Change"</code>, and this event type is used for both the <code>on</code> and <code>after</code> subscription methods. Whenever an attribute's value is changed through Attribute's <code>set</code> method, "on" and "after" subscribers are notified.</p>

<h5>On vs. After</h5>

<p><strong>on :</strong> Subscribers to the "on" moment, will be notified <em>before</em> any actual state change has occured. This provides the opportunity to prevent the state change from occuring, using the <code>preventDefault</code> method of the event facade object passed to the subscriber. This means that if you use <code>get</code> to retrieve the value of the attribute in an "on" subscriber, you will recieve the current, unchanged value. However the event facade does provide access to the value which the attribute is being set to, through it's <code>newVal</code> property.</p>

<p><strong>after :</strong> Subscribers to the "after" moment, will be notified <em>after</em> the attribute's state has been updated. This provides the opportunity to update state across your application, in response to a change in the attribute's state.</p>

<p>Based on the definition above, <code>after</code> listeners are not invoked if state change is prevented, for example, by one of the <code>on</code> listeners calling <code>preventDefault</code> on the event object, as is done in the <code>on</code> listener for <code>foobar</code>:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
<script type="text/javascript">
    o1.on("foobarChange", function(e) {

        // Calling preventDefault, in an "on" listener
        // will prevent the attribute change from occuring
        // and prevent the after listeners from being called

        print("on foobarChange (prevented)", "header");
    });
</script>
</textarea>

<h5>Event Facade</h5>

<p>The event facade passed to attribute change event subscribers, has the following interesting properties/methods</p>

<dl>
    <dt>newVal</dt>
    <dd>The value which the attribute will be set to (in the case of "on" subscribers), or has been set to (in the case of "after" subscribers</dd>
    <dt>prevVal</dt>
    <dd>The value which the attribute is currently set to (in the case of "on" subscribers), or was previously set to (in the case of "after" subscribers</dd>
    <dt>attrName</dt>
    <dd>The name of the attribute which is being set</dd>
    <dt>subAttrName</dt>
    <dd>Attribute also allows you to set nested properties of attributes which have values which are objects through the 
    <code>set</code> method (e.g. <code>o1.set("x.y.z")</code>). This property will contain the path to the property which was changed.</dd>
    <dt>preventDefault()<dt>
    <dd>This method can be called in an "on" subscriber to prevent the attribute's value from being updated (the default behavior). Calling this method in an "after" listener has no impact, since the default behavior has already been invoked.</dd>
    <dt>stopImmediatePropagation()</dt>
    <dd>This method can be called in "on" or "after" subscribers, and will prevent the rest of the subscriber stack from
    being invoked, but will not prevent the attribute's value from being updated.</dd>
</dl>
