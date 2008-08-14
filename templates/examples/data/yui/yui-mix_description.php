<h2 class="first">Using <code>mix</code></h2>

<h3>Instantiate YUI</h3>
<textarea name="code" class="JScript">
<!-- include yui -->
<script type="text/javascript" src="<?php echo $buildDirectory ?>yui/yui.js"></script>
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>,
// This method is in the core of the library, so we don't have to use() any
// additional modules to access it.  However, this example requires 'node'.

function(Y) {
</textarea>

<h3>Adding functionality to individual objects</h3>
<p>Static classes, such as <code>DOM</code>, are implemented as object literals
with keys corresponding to public class methods.  As such, static classes
aren't candidates for instantiation or prototype extention.  To add
functionality to static classes, you need to work with the class's object
literal.</p>

<p>In this example, <code>mix</code> is used to add a set of behaviors to a static class.</p>

<p>We'll create a namespace <code>example.addons</code> to hold common packages
of static methods and members.  In this namespace, we'll create a set of
logging functions.</p> 
<textarea name="code" class="JScript" cols="60" rows="1">Y.namespace('example.addons');

Y.example.addons.Logging = function () {
    var logger = null;
    
    return {
        initLogger : function (logNode) {
            if (!logger) {
                logger = Y.get(logNode);
            }
        },

        log : function (message) {
            if (logger) {
                logger.set('innerHTML', logger.get('innerHTML') + '<p>' + message + '</p>');
            }
        }
    }
}();

</textarea>

<p>Now a targeted class that would benefit from these methods can add them
using <code>mix</code> while keeping its source focused and
unique.</p> 
<textarea name="code" class="JScript" cols="60" rows="1">Y.example.PageController = function () {
    var app_const = 12345;

    return {
        getConst : function () { return app_const },
        logConst : function () {
            this.initLogger('#demo_logger');
            this.log('PageController class constant = ' +
                      this.getConst() +
                      '.  Logged courtesy of augmentation');
        }
    };
}();

Y.mix(
    Y.example.PageController,
    Y.example.addons.Logging);

Y.on('click', Y.example.PageController.logConst, 
              '#demo_btn', Y.example.PageController);

</textarea>

<h3>Much like <code>augment</code></h3>
<p><code>mix</code> works in similar fashion to <code>augment</code>.  In fact, <code>augment</code> uses <code>mix</code> under the hood.  However, rather than adding functionality to class definitions (i.e. function prototypes), <code>mix</code> can work with any object, including object literals and class instances.</p>

<p>See <code>augment</code> and <code>extend</code> for other techniques to help manage your code structure.</p>
