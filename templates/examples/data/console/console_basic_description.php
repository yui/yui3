<h3>Markup not required</h3>
<p>The primary purpose of the Console is to aid in debugging your application.  As such, it doesn't make much sense to require your page to include markup for something that is not bound for production.</p>

<p><em>However</em>, Console is built on the Widget framework, so for this example, we'll illustrate three ways to place a Console instance on the page:</p>
<ol>
    <li>Providing a <code>boundingBox</code> node reference.</li>
    <li>Providing both <code>boundingBox</code> and <code>contentBox</code> references.</li>
    <li>Using the default rendering behavior.</li>
</ol>

<p>For the first two cases, we need to set up some markup.  We'll throw in some placeholder content for the third.</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<h4>Basic Console</h4>
<div id="basic"></div>

<h4>New messages added to bottom</h4>
<div id="add_to_bottom"><div></div></div>

<h4>Custom strings</h4>
<p><em>Rendered in default location (top right)</em></p>
</textarea>

<p>Then instantiate the Console instances.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
// Create a YUI instance and request the console module and its dependencies
YUI(<?php echo($yuiConfig); ?>).use(<?php echo($requiredModules); ?>, function (Y) {

// Create and render the three Console instances
var basic, newOnBottom, customStrings;

basic = new Y.Console({
    boundingBox: '#basic'
}).render(); // note the inline render()

newOnBottom = new Y.Console({
    boundingBox: '#add_to_bottom',
    contentBox:  '#add_to_bottom > div',
    newestOnTop: false,
    visible: false  // hidden at instantiation
}).render();

customStrings = new Y.Console({
    strings: {
        title : 'Console with custom strings!',
        pause : 'Wait',
        clear : 'Flush'
    },
    visible: false  // hidden at instantiation
}).render();

});
</textarea>

<h3>Log some messages</h3>
<p>In your code, inserting calls to <code>Y.log(..)</code> will cause the content of those log messages to be broadcast to every Console instance present in the YUI instance.  We'll illustrate this by creating some buttons to log various types of messages.</p>

<textarea name="code" class="HTML" cols="60" rows="1">
// Create a YUI instance and request the console module and its dependencies
YUI(<?php echo($yuiConfig); ?>).use(<?php echo($requiredModules); ?>, function (Y) {

// To eliminate duplicate reporting in native console in supporting browsers
Y.config.useConsole = false;

// Create and render the three Console instances
var basic, newOnBottom, customStrings;

...

Y.get('#info').on('click', function () {
    Y.log(Y.get('#info_text').get('value'), 'info');
});
Y.get('#warn').on('click', function () {
    Y.log(Y.get('#warn_text').get('value'), 'warn');
});
Y.get('#error').on('click', function () {
    Y.log(Y.get('#error_text').get('value'), 'error');
});

});
</textarea>

<h3>A touch of CSS</h3>
<p>For this example, it was more appropriate for the Consoles to be nested in the content for coherency.  The default positioning for the first two Consoles was overridded for this reason.  The CSS is included in the <a href="#full_code_listing">Full Code Listing</a> below.</p>


<h3 id="full_code_listing">Full Code Listing</h3>

<h4>Markup</h4>

<textarea name="code" class="HTML" cols="60" rows="1">
<div id="demo">
    <h4>Basic Console</h4>
    <div id="basic"></div>
    <p>
        <button type="button" id="toggle_basic">hide console</button>
    </p>

    <h4>New messages added to bottom</h4>
    <div id="add_to_bottom"><div></div></div>
    <p>
        <button type="button" id="toggle_atb">show console</button>
    </p>

    <h4>Custom strings</h4>
    <p><em>Rendered in default location (top right)</em></p>
    <p>
        <button type="button" id="toggle_cstrings">show console</button>
    </p>

    <h4>Log some messages</h4>
    <p>
        <input type="text" id="info_text" value="I'm an info message!">
        <button type="button" id="info">log info message</button>
    </p>
    <p>
        <input type="text" id="warn_text" value="I'm a warning!">
        <button type="button" id="warn">log warning</button>
    </p>
    <p>
        <input type="text" id="error_text" value="I'm an error!">
        <button type="button" id="error">log error</button>
    </p>
</div>
</textarea>

<h4>JavaScript</h4>

<textarea name="code" class="JScript" cols="60" rows="1">
// Create a YUI instance and request the console module and its dependencies
YUI(<?php echo($yuiConfig); ?>).use(<?php echo($requiredModules); ?>, function (Y) {

// To eliminate duplicate reporting in native console in supporting browsers
Y.config.useConsole = false;

// Create and render the three Console instances
var basic, newOnBottom, customStrings;

basic = new Y.Console({
    boundingBox: '#basic'
}).render();

newOnBottom = new Y.Console({
    boundingBox: '#add_to_bottom',
    contentBox:  '#add_to_bottom > div',
    newestOnTop: false,
    visible: false
}).render();

customStrings = new Y.Console({
    strings: {
        title : 'Console with custom strings!',
        pause : 'Wait',
        clear : 'Flush'
    },
    visible: false
}).render();

// Set up the button listeners
function toggle(e,cnsl) {
    if (cnsl.get('visible')) {
        cnsl.hide();
        this.set('innerHTML','show console');
    } else {
        cnsl.show();
        this.set('innerHTML','hide console');
    }
}

Y.get('#toggle_basic').on('click',    toggle, null, basic);
Y.get('#toggle_atb').on('click',      toggle, null, newOnBottom);
Y.get('#toggle_cstrings').on('click', toggle, null, customStrings);

Y.get('#info').on('click', function () {
    Y.log(Y.get('#info_text').get('value'), 'info');
});
Y.get('#warn').on('click', function () {
    Y.log(Y.get('#warn_text').get('value'), 'warn');
});
Y.get('#error').on('click', function () {
    Y.log(Y.get('#error_text').get('value'), 'error');
});

});
</textarea>

<h4>CSS</h4>

<textarea name="code" class="CSS" cols="60" rows="1">
/* Override default positioning for two of the example Consoles */
#basic, #add_to_bottom { position: static; }

/* Reapply some style settings that were overridden by the page chrome */
#demo .yui-console .yui-console-title {
    text-transform: none;
    color: #000;
}
</textarea>
