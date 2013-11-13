// script trying to store a global variable called `foo`
(function (global) {
    global.foo = 1;
}(this));

// signing the vendor script with a YUI module name
// and optionally, adding the value of `foo` to the namespace
YUI.add('vendor-script-signed', function (Y) {
    Y.foo = Y.config.global.foo;
}, '', {});
