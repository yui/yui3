<h3>Setting up filters in the YUI configuration</h3>
<p>The configuration object passed to the YUI constructor supports a few settings that can help manage Console output while debugging.  These configuration options are <code>logExclude</code>, <code>logInclude</code>, and <code>logLevel</code>.</p>

<p>This example will use <code>logExclude</code> and <code>logLevel</code>.</p>

<p>An example configuration might look like this:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
YUI({
    logExclude : {
        event : true,     // Don't broadcast log messages from the event module
        attribute : true, // or the attribute module
        widget : true     // or the widget module
    },
    logLevel : 'error',   // Show only errors in the Console
    useConsole : false    // Don't use the browser's native console
}).use('console', function (Y) {

/* Console instances will default to logLevel = Y.Console.LOG_LEVEL_ERROR */

});
</textarea>

<p><code>logExclude</code> and <code>logInclude</code> prevent the logging subsystem from broadcasting filtered log messages.  <code>logLevel</code>, on the other hand is used by Console instances to filter messages received from the subsystem.</p>

<p>Updating <code>Y.config.logExclude</code> or <code>Y.config.logInclude</code> at runtime will immediately change the subsystem filtering.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
YUI({
    logExclude : {
        event : true
    }
}).use('console', function (Y) {

/* In here, Y.config refers to the config object passed to the constructor */

// Stop broadcasting log messages from the attribute module
Y.config.logExclude.attribute = true;

// Start broadcasting log messages from the event module again
delete Y.config.logExclude.event;

});
</textarea>

<p>When a Console is instantiated, barring explicit <code>logLevel</code> attribute configuration, the <code>logLevel</code> will be adopted from the YUI instance's configured <code>logLevel</code>, or <code>Y.Console.LOG_LEVEL_INFO</code> as a fallback.  Unlike <code>logExclude</code>, changing the value in the YUI configuration will only affect instantiated Consoles from that point on.  Additionally, you can manually override the <code>logLevel</code> a Console instance will display by updating its <code>logLevel</code> attribute.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
YUI({ logLevel : 'warn' }).use('console', function (Y) {

var yconsole_1 = new Y.Console(); // logLevel == Y.Console.LOG_LEVEL_WARN

var yconsole_2 = new Y.Console({
    logLevel : Y.Console.LOG_LEVEL_INFO // override at construction
});

// This will not affect yconsole_1 or yconsole_2
Y.config.logLevel = 'error';

var yconsole_3 = new Y.Console(); // logLevel == Y.Console.LOG_LEVEL_ERROR

yconsole_1.set('logLevel', Y.Console.LOG_LEVEL_INFO); // update this instance

});
</textarea>

<p>The interactive portion of this example illustrates the effect of various filter settings against logged messages.  In real application, it is most likely that the logging configuration won't be changed at runtime but set once in the YUI configuration at construction.</p>

<p>The most relevant portion of the <a href="#full_code_listing">code for the demo above</a> is the updating of the YUI config and Console attribute.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
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
</textarea>


<h3 id="full_code_listing">Full Code Listing</h3>

<h4>Markup</h4>

<textarea name="code" class="HTML" cols="60" rows="1">
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
</textarea>

<h4>JavaScript</h4>

<textarea name="code" class="JScript" cols="60" rows="1">
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
</textarea>

<h4>CSS</h4>

<textarea name="code" class="CSS" cols="60" rows="1">
#console {
    position: static;
    float: left;
}
#console .yui-console-content {
    font-size: 11px;
}

#demo .yui-console .yui-console-title {
    text-transform: none;
    color: #000;
    margin: 0;
}

.filter-controls p label {
    display: block;
    margin: .25em 0;
}
#demo input {
    vertical-align: middle;
}

.form {
    clear: left;
    padding: 1em 0;
}

.form span {
    padding-left: 3em;
}

#msg {
    width: 50%;
}

.filter-controls {
    width: 175px;
    margin-left: 1em;
    float: left;
}

#preview {
    background: #eee;
    border: 1px solid #999;
    margin: 1em 0;
    overflow: auto;
    padding: 1em;
    width: 480px;
}
</textarea>
