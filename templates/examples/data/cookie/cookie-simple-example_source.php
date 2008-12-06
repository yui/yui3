
<script type="text/javascript">
YUI(<?php echo($yuiConfig); ?>).use(<?php echo($requiredModules); ?>,function (Y) {


    var currentValue = Y.Cookie.get("example");
    alert("Cookie's current value is '" + currentValue + "'");

    var newValue = "yui" + Math.round(Math.random() * Math.PI * 1000);
    alert("Setting cookie's value to '" + newValue + "'");
    Y.Cookie.set("example", newValue);

});
</script>