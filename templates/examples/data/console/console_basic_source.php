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
<script type="text/javascript">
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
</script>
