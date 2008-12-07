<h2 class="first">Simple Cookie Example</h2>
<p>This example begins by getting the value of a cookie named &quot;example&quot;. If this is the first time you've run
the example, the value should be <code>null</code>:
<textarea name="code" class="JScript" cols="60" rows="1">
var currentValue = Y.Cookie.get("example");
</textarea>
<p>This value is output in an alert. Next, the cooke is set to a random value:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
var newValue = "yui" + Math.round(Math.random() * Math.PI);
Y.Cookie.set("example", newValue);
</textarea>  
<p>When you reload the page, the value of the cookie should be the one that was just set.</p>
<p>Note: this example uses session cookies, so the value will be lost if you close the browser.</p>
