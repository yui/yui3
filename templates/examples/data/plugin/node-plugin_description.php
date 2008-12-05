<h3>Setting up the HTML</h3>
<p>First we need some HTML to work with.  We need a link and a button to toggle the disabled state.</p>
<textarea name="code" class="HTML">
<div id="demo">
    <a href="http://developer.yahoo.com/yui/3/">YUI 3 Home</a>
</div>

<button id="yui-example-toggle">enable</button>
</textarea>

<h3>Setting Up the Plugin Class</h3>
<p>In this example we will write a plugin that disables links.  A disabled link will not follow its <code>href</code>, and has styling applied via a className.</p>
<h4>The Plugin Constructor</h4>
<p>As with building any class, we will begin with a constructor function. From the constructor we call the <code>init</code> method, which will be added later via the plugin's prototype.</p>
<textarea name="code" class="JScript">
var LinkDisabler = function(config) {
    this.init(config);
};

</textarea>
<h4>Static Members</h4>
<p>We then need to add the required static members (<code>NAME</code> and <code>NS</code>).  <code>NAME</code> is the long name of the component, and <code>NS</code> is the namespace that it will use when added to the node. We are going to use a className to manage the state of the link, so let's go ahead and add a static member for that as well.
<textarea name="code" class="JScript">
LinkDisabler.NAME = 'linkdisabler';
LinkDisabler.NS = 'ld';

LinkDisabler.CLASSNAME = 'yui-example-disabled';
</textarea>

<h4>Plugin Prototype</h4>
<p>Finally, we round out the plugin by adding some prototype methods.  The functionality required for this plugin is pretty simple; all we need are methods to enable/disable, and a way to handle clicks on the node itself</p>.
<textarea name="code" class="JScript">
// Example plugin that disables links
LinkDisabler.prototype = {
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
</textarea>
<h3>Adding the Plugin to a Node</h3>
<p>To use the plugin, we need a Node instance bound to an anchor element.  We can then call Node's <code>plug</code> method to create an instance of the plugin and bind it to the node.</p>
<textarea name="code" class="JScript">
// get node and add plugin
var node = Y.get('#demo a');
node.plug(LinkDisabler);

</textarea>

<h3>Toggling Disabled State</h3>
<p>In order to effectively demonstrate the plugin, we will use the button to toggle the disabled state.</p>
<textarea name="code" class="JScript">
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
</textarea>

<h3>Full Script Source</h3>
<textarea name="code" class="JScript">
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
</textarea>
