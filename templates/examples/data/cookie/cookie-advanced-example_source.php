<p>Click the buttons to interact with the cookie:</p>
<input type="button" value="Get Value" id="yui-cookie-btn1" />
<input type="button" value="Set Random Value" id="yui-cookie-btn2" />
<input type="button" value="Remove Value" id="yui-cookie-btn3" />
<script type="text/javascript">
YUI(<?php echo($yuiConfig); ?>).use(<?php echo($requiredModules); ?>,function (Y) {

    Y.Node.get("#yui-cookie-btn1").on("click", function(){
        var value = Y.Cookie.get("example");
        alert(value);
        Y.log("Cookie 'example' has a value of '" + value + "'");
    });

    Y.Node.get("#yui-cookie-btn2").on("click", function(){
        var newValue = "yui" + Math.round(Math.random() * Math.PI * 1000);
        Y.Cookie.set("example", newValue);
        Y.log("Set cookie 'example' to '" + newValue + "'");
    });

    Y.Node.get("#yui-cookie-btn3").on("click", function(){
        Y.Cookie.remove("example");
        Y.log("Removed cookie 'example'.");
    });


});
</script>