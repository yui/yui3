<h3>Listening For Attribute Change Events</h3>

<p>In this example, we'll look at how you can setup listeners for attribute change events, and use the event payload which the listeners receive.</p>

<h4>Setting Up A Custom Class With Attribute</h4>

<p>We start by setting up the same custom class we created for the <a href="attribute-basic.html">basic example</a> with 3 attributes <code>foo</code>, <code>bar</code> and <code>foobar</code>, using the code below:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
YUI().use("attribute", function(Y) {

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
});
</textarea>

<h4>Registering Event Listeners</h4>

<p>Once we have an instance of the custom class, we can use the <code>on</code> and <code>after</code> methods provided by Attribute, to listen for changes in the value of each of the attributes:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
    var o1 = new MyClass();

    ...

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
        // and prevent the after listeners from being called
        print("on foobarChange (prevented)", "header");
        event.preventDefault();
    });

    o1.after("foobarChange", function(event) {
        // This will never get called, because we're
        // calling preventDefault in the "on" listener
        print("after foobarChange", "header");
        printEvt(event);
    });
</textarea>

<p>As seen in the above code, the event type for attribute change events is created by concatenating the attribute name with <code>"Change"</code> (e.g. <code>"fooChange"</code>), and this event type is used for both the <code>on</code> and <code>after</code> subscription methods. Whenever an attribute's value is changed through Attribute's <code>set</code> method, both "on" and "after" subscribers are notified.</p>

<h4>On vs. After</h4>

<p><strong>on :</strong> Subscribers to the "on" moment, will be notified <em>before</em> any actual state change has occured. This provides the opportunity to prevent the state change from occuring, using the <code>preventDefault</code> method of the event facade object passed to the subscriber. If you use <code>get</code> to retrieve the value of the attribute in an "on" subscriber, you will recieve the current, unchanged value. However the event facade provides access to the value which the attribute is being set to, through it's <code>newVal</code> property.</p>

<p><strong>after :</strong> Subscribers to the "after" moment, will be notified <em>after</em> the attribute's state has been updated. This provides the opportunity to update state in other parts of your application, in response to a change in the attribute's state.</p>

<p>Based on the definition above, <code>after</code> listeners are not invoked if state change is prevented, for example, due to one of the <code>on</code> listeners calling <code>preventDefault</code> on the event object, as is done in the <code>on</code> listener for the <code>foobar</code> attribute:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
    o1.on("foobarChange", function(event) {

        // Calling preventDefault, in an "on" listener
        // will prevent the attribute change from occuring
        // and prevent the after listeners from being called

        print("on foobarChange (prevented)", "header");
        event.preventDefault();
    });
</textarea>

<h4>Event Facade</h4>

<p>The event object (an instance of <a href="../api/Event.Facade.html">Event.Facade</a>) passed to attribute change event subscribers, has the following interesting properties and methods related to attribute manangement:</p>

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
