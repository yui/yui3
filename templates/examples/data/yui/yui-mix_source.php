<input type="button" name="demo_btn" id="demo_btn" value="click"/>
<div id="demo_logger"></div>
<script type="text/javascript">
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>,
// This method is in the core of the library, so we don't have to use() any
// additional modules to access it.  However, this example requires 'node'.

function(Y) {

    Y.namespace('example.addons');

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

    Y.example.PageController = function () {
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
});
</script>
