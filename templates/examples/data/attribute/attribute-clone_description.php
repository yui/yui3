<h3>Clone Options</h3>

<p>Attribute supports the following clone values (available as static constants on the Attribute class), which can be used to configure how attribute values are handled through <code>get</code>:</p>

<dl>
    <dt>Attribute.CLONE.DEEP</dt>
    <dd>Will result in a deep cloned value being returned (using Y.clone). 
        This can be expensive for complex objects.</dd>
    <dt>Attribute.CLONE.SHALLOW</dt>
    <dd>Will result in a shallow cloned value being returned (using Y.merge).</dd>
    <dt>Attribute.CLONE.IMMUTABLE</dt>
    <dd>Will result in a deep cloned value being returned
        when using the get method. Additionally users will
        not be able to set sub values of the attribute
        using the complex attribute notation (obj.set("x.y.z, 5)).
        However the value of the attribute can be changed, making
        it different from readOnly attribute.</dd>
    <dt>Attribute.CLONE.NONE</dt>
    <dd> The value will not be cloned, resulting in a reference
    to the stored value being passed back, if the value is an object.
    This is the default behavior.</dd>
</dl>

<h3>Setting Up The Attributes</h3>

<p>In this example, we setup a custom class <code>MyClass</code> with four attributes <code>A, B, C, D</code>.</p>

<p>All the attributes will be have similarly nested object literal values. A is defined to be deep cloned (<code>Attribute.CLONE.DEEP</code>), B is defined to be shallow cloned (<code>Attribute.CLONE.SHALLOW</code>), C is defined to be immutable (<code>Attribute.CLONE.IMMUTABLE</code>) and D is not cloned (<code>Attribute.CLONE.NONE</code>):</p>

<textarea name="code" class="JScript" cols="60" rows="1">
    MyClass.ATTRIBUTES = {
        "A" : {
            value : {
                a1 : "a1",
                a2 : "a2",
                a3 : {
                    a3a : "a3a",
                    a3b : "a3b"
                }
            },
            clone : Y.Attribute.CLONE.DEEP
        },

        "B" : {
            value : {
                b1 : "b1",
                b2 : "b2",
                b3 : {
                    b3a : "b3a",
                    b3b : "b3b"
                }
            },
            clone : Y.Attribute.CLONE.SHALLOW
        },

        "C" : {
            value : {
                ...
            }
            clone : Y.Attribute.CLONE.IMMUTABLE
        },

        "D" : {
            value : {
                ...
            },
            clone : Y.Attribute.CLONE.NONE
        }
    }
</textarea> 

<h3>Modifying The Return Value</h3>

<p>The code attempts to retrieve each attribute value using the <code>get</code> method, and modify properties on the returned value. Top level properties as well nested properties are modified, to hightlight the difference between the clone methods (e.g. modifying nested properties on a SHALLOW clone will modify the stored value, whereas DEEP will prevent the user from modifying stored properties at any level): </p>

<textarea name="code" class="JScript" cols="60" rows="1">
    ...
    var o1 = new MyClass();

    /** Deep Cloned **/
    var aVal = o1.get("A");

    aVal.a1 = "a1-Mod";
    aVal.a3.a3b = "a3b-Mod";

    print("Value After Modifying Reference:", "subheader");
    print(Y.dump(o1.get("A")));

    /** Shallow Cloned **/
    var bVal = o1.get("B");

    bVal.b1 = "b1-Mod";
    bVal.b3.b3b = "b3b-Mod";

    print("Value After Modifying Reference:", "subheader");
    print(Y.dump(o1.get("B")));

    ...
</textarea>

<h3>Modifying Sub-Attribute Values</h3>

<p>Attribute's <code>set</code> method can be used to set individual properties within the stored attribute value, by using a "dot" notation syntax. e.g.:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
    o1.set("A.a3.a3a", "a3a-Mod");
</textarea>

<p>Will set the <code>a3.a3a</code> property of the <code>A</code> attribute (if the a3 property already exists)</p>

<p>The example code attempts to set sub-attribute values for each of the four attributes using the syntax above, to highlight how <code>Attribute.CLONE.IMMUTABLE</code> differs from the others in preventing sub-attribute values from being set</p>

<textarea name="code" class="JScript" cols="60" rows="1">
    o1.set("C.c3.c3a", "c3a-Mod");

    print("Value After Setting Sub-Attribute:", "subheader");
    print(Y.dump(o1.get("C")));
</textarea>
