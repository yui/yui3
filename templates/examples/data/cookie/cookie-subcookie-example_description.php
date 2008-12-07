<h2 class="first">Subcookie Example</h2>
<p>The first three lines attempt to read the values stored in subcookies of the &quot;example&quot; cookie:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var name = Y.Cookie.getSub("example", "name");
var today = Y.Cookie.getSub("example", "today", function(value){
    return new Date(value);
});
var count = Y.Cookie.getSub("example", "count", Number);
</textarea>
<p>The &quot;name&quot; subcookie stores a string so it is retrieved without specifying a third argument. The &quot;today&quot;
subcookie stores a date string, which should be converted to a <code>Date</code> object upon retrieval; the third argument
of <code>getSub()</code> is specified as a custom function that will convert the returned value into a <code>Date</code> object.
The &quot;count&quot; subcookie contains a number and is converted to an actual JavaScript number by passing in the native
<code>Number</code> function. If any of these subcookies don't exist, <code>getSub()</code> returns <code>null</code> (this should
be the case the first time you run the example). The retrieved values are output in the logger.</p>
<p>After that, new values are assigned to the various subcookies:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
Y.Cookie.setSub("example", "name", "Yahoo!");
Y.Cookie.setSub("example", "today", (new Date()).toString());
Y.Cookie.setSub("example", "count", Math.round(Math.random() * 30));
</textarea>
<p>The &quot;name&quot; subcookie is set to &quot;Yahoo!&quot;, the &quot;today&quot; subcookie is set to the value
of a new <code>Date</code> object, outputting its string representation, and the &quot;count&quot; subcookie is filled
with a random number. The next time you run the example, the subcookies should have these values.</p>