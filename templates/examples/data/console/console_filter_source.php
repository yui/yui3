<div id="demo">
    <div id="console"></div>

    <div class="filter-controls">
        <h4>Disregard source</h4>
        <p>
            <code>Y.config.logExclude.</code>
            <label for="filter_a"><input type="checkbox" name="src_filter" value="sourceA" id="filter_a"> <code>sourceA = true</code></label>
            <label for="filter_b"><input type="checkbox" name="src_filter" value="sourceB" id="filter_b"> <code>sourceB = true</code></label>
            <label for="filter_c"><input type="checkbox" name="src_filter" value="sourceC" id="filter_c" checked="checked"> <code>sourceC = true</code></label>
        </p>
    </div>

    <div class="filter-controls">
        <h4>Log level</h4>
        <p>
            <code>Y.Console.</code>
            <label for="lvl_info">
                <input type="radio" name="log_level" id="lvl_info" value="info" checked="checked">
                <code>LOG_LEVEL_INFO</code>
            </label>
            <label for="lvl_warn">
                <input type="radio" name="log_level" id="lvl_warn" value="warn">
                <code>LOG_LEVEL_WARN</code>
            </label>
            <label for="lvl_error">
                <input type="radio" name="log_level" id="lvl_error" value="error">
                <code>LOG_LEVEL_ERROR</code>
            </label>
        </p>
    </div>

    <div class="form">
        <h4>Log a message</h4>
        <div>
            <input type="text" id="msg" value="This is a log message!">
            <button type="button" id="log">log message</button>

            <p>
                Source:
                <label for="msg_src_a">
                    <input type="radio" name="msg_src" id="msg_src_a" value="sourceA" checked="checked">
                    A
                </label>
                <label for="msg_src_b">
                    <input type="radio" name="msg_src" id="msg_src_b" value="sourceB">
                    B
                </label>
                <label for="msg_src_c">
                    <input type="radio" name="msg_src" id="msg_src_c" value="sourceC">
                    C
                </label>

                <span>Category:</span>
                <label for="msg_info">
                    <input type="radio" name="msg_cat" id="msg_info" value="info" checked="checked">
                    info
                </label>
                <label for="msg_warn">
                    <input type="radio" name="msg_cat" id="msg_warn" value="warn">
                    warn
                </label>
                <label for="msg_error">
                    <input type="radio" name="msg_cat" id="msg_error" value="error">
                    error
                </label>
            </p>
        </div>

        <h4>Code preview</h4>
        <pre id="preview">// YUI instance configuration
var Y = YUI({
    logExclude : {
        sourceC : true
    },
    logLevel : 'info'
});

// Log statement
Y.log(&quot;This is a log message!&quot;, &quot;info&quot;, &quot;sourceA&quot;);</pre>
    </div>
</div>
<script type="text/javascript">
// Create a YUI instance and request the console module and its dependencies
YUI(<?php echo($yuiConfig); ?>).use(<?php echo($requiredModules); ?>, function (Y) {

// To eliminate duplicate reporting in native console in supporting browsers
Y.config.useConsole = false;

// Add the default filtering of sourceC messages
Y.config.logExclude = {
    sourceC : true
};


var logLevels = {
        lvl_info  : Y.Console.LOG_LEVEL_INFO,
        lvl_warn  : Y.Console.LOG_LEVEL_WARN,
        lvl_error : Y.Console.LOG_LEVEL_ERROR
    },
    yconsole;

// Create and render the Console
yconsole = new Y.Console({ boundingBox: '#console' }).render();


// Set up event listeners
Y.all('#demo input[name=src_filter]').on('click', function () {
    if (this.get('checked')) {
        Y.config.logExclude[this.get('value')] = true;
    } else {
        delete Y.config.logExclude[this.get('value')];
    }
    updatePreview();
});

Y.all('#demo input[name=log_level]').on('click', function () {
    if (this.get('checked')) {
        yconsole.set('logLevel', logLevels[this.get('id')]);
        updatePreview();
    }
});

Y.get('#msg').                     on('keyup', updatePreview);
Y.all('#demo input[name=msg_src]').on('click', updatePreview);
Y.all('#demo input[name=msg_cat]').on('click', updatePreview);

Y.get('#log').on('click', function (e) {
    var msg = Y.get('#msg').get('value'),
        cat = Y.get('#demo input[name=msg_cat]:checked').get('value'),
        src = Y.get('#demo input[name=msg_src]:checked').get('value');

    Y.log(msg,cat,src);
});

// Support function
function updatePreview() {
    var filters   = Y.all('#demo input[name=src_filter]:checked'),
        logLevel  = Y.get('#demo input[name=log_level]:checked').get('value'),
        msg       = Y.get('#msg').get('value'),
        msgSource = Y.get('#demo input[name=msg_src]:checked').get('value'),
        msgCat    = Y.get('#demo input[name=msg_cat]:checked').get('value'),
        preview = "// YUI instance configuration\nvar Y = YUI({\n";

    if (filters) {
        preview += "    logExclude : {\n        " +
                   filters.get('value').join(" : true,\n        ") +
                   " : true\n    },\n";
    }

    preview += "    logLevel : &quot;"+logLevel+"&quot;\n});\n\n"+
               "// Log statement\nY.log(&quot;"+msg+"&quot;, "+
               "&quot;"+msgCat+"&quot;, &quot;"+msgSource+"&quot;);";

    preview = preview.replace(/\n/g,"<br>").
                      replace(/ /g,'&nbsp;').
                      replace(/"/g, '\\"');

    Y.get('#preview').set('innerHTML',preview);
}

});
</script>
