<div id="demo">
    <a href="http://developer.yahoo.com/yui/3/">YUI 3 Home</a>
</div>

<button id="yui-example-toggle">enable</button>
<script type="text/javascript">
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules; ?>, function(Y) {

    // Example plugin that disables links
    var LinkDisabler = function(config) {
        this.init(config);
    };

    LinkDisabler.NAME = 'linkdisabler';
    LinkDisabler.NS = 'ld';

    LinkDisabler.CLASSNAME = 'yui-example-disabled';

    LinkDisabler.prototype = {
        init: function(config) {
            this.owner = config.owner;

            var disabled = config.disabled || true; // "disable" is configurable

            if (disabled) {
                this.disable();
            }

            this.owner.on('click', this.onClick, this);
        },

        disable: function() {
            this.owner.addClass(LinkDisabler.CLASSNAME);
        },

        enable: function() {
            this.owner.removeClass(LinkDisabler.CLASSNAME);
        },

        onClick: function(e) {
            if (this.owner.hasClass(LinkDisabler.CLASSNAME)) {
                e.preventDefault();         
            }
        }
    };

    // get node and add plugin
    var node = Y.get('#demo a');
    node.plug(LinkDisabler);

    // button toggling code
    var onButtonClick = function(e) {
        var text = 'disable';
        if (e.target.get('innerHTML') === 'enable') {
           node.ld.enable(); 
        } else {
           node.ld.disable(); 
           text = 'enable';
        }

        e.target.set('innerHTML', text);
    };

    Y.on('click', onButtonClick, '#yui-example-toggle');
});

</script>
