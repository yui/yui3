<h3>ReadOnly And WriteOnce</h3>

<p>Attribute supports the ability to configure attributes to be <code>readOnly</code> or <code>writeOnce</code>. <code>readOnly</code> attributes cannot be set by the end user, either through initial values passed to the constructor, or by invoking the <code>set</code> method. <code>writeOnce</code> attributes on the other hand, can be set by the user, but only once, either during initialization or through a call to <code>set</code>. Once a value is established for a <code>writeOnce</code> attribute, it cannot be reset to another value by the user.</p>

<h3>Configuring ReadOnly And WriteOnce Attributes</h3>

<p>This example sets up a custom class, <code>MyClass</code>, with two attributes, <code>foo</code> and <code>bar</code>. <code>foo</code> is configured to be a <code>readOnly</code> attribute, and <code>bar</code> is configured to be a <code>writeOnce</code> attribute:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    // Setup a custom class with attribute support
    function MyClass(cfg) {
        this._initAtts(MyClass.ATTRIBUTES, cfg);
    }

    // Setup attribute configuration
    MyClass.ATTRIBUTES = {
        "foo" : {
            value: "Default Foo",
            readOnly: true
        },

        "bar" : {
            value: "Default Bar",
            writeOnce: true
        }
    };
</textarea>

<h3>Attempting To Set Values</h3>

<p>We first attempt to set values for both attributes in the constructor (used to intialize the attributes) and see that only <code>bar</code>, the <code>writeOnce</code> attribute, gets set to the user provided value:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    var o1 = new MyClass({
        foo: "User Foo",
        bar: "User Bar"
    });

    print("Initial Set", "header");
    print("foo value (readOnly):", "subheader");
    print(o1.get("foo"));

    print("bar value (writeOnce):", "subheader");
    print(o1.get("bar"));
</textarea>

<p>We then attempt to set values for both attributes again, using <code>set</code>, and see that niether of the values are modified:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    print("Try Setting Again", "header");
    o1.set("foo", "User Reset Foo");
    o1.set("bar", "User Reset Bar");

    print("Final foo value (readOnly)", "subheader");
    print(o1.get("foo"));

    print("Final bar value (writeOnce)", "subheader");
    print(o1.get("bar"));
</textarea>

<h3>Setting The State Of ReadOnly Values Internally</h3>

<p>Although the user cannot update the value of <code>readOnly</code> attributes, it maybe neccessary for the host object to update it's value internally. The example shows how this can be done, using the private <code>_conf</code> state property on the host:</p>

<textarea name="code" class="JScript" rows="1" cols="60">
    MyClass.prototype.doSomething = function() {
        // ... Do something which requires
        // MyClass to change the value
        // of foo ...

        // Host code can reset value of
        // readOnly attributes interally,
        // by working with the private state
        // property

        this._conf.remove("foo");
        this.set("foo", "New Default Foo");
    };
</textarea>
