YUI.add('ac-plugin', function(Y) {


/**
 * <p>Node plugin that attaches autocomplete-related events and functionality
 * to a form element, most commonly an input element.</p>
 * <p>Usage: <code>myNode.plug(Y.Plugin.ACPlugin, config);</code></p>
 * <p>The optional config object can specify values for any of the public
 * ATTRs below.</p>
 **/


var PRIVATE = {},
    // the zakas gambit. In this case, it does appear to save gzipped bytes.
    HANDLE = "handle";

/**
 * <p>Attach a new valueChange event handler if necessary, possibly removing the old one
 * if the delay value is changing.</p>
 *
 * @private
 * @param who {Object} The plugin object.
 * @param host {Object} The node that we're plugged into.
 * @param id {String} The stamp on the plugin
 * @param delay {Number} The keyDelay value to use with the valueChange event.
 **/
function attachTCHandler (who, host, id, delay) {
    // If we're changing something, remove the pre-existing listener, and create a new one.
    // Note that the problems with valueChange's detach stuff come back to bite me here,
    // so I have to be careful to only ever use handle.detach() and Y.on to attach it,
    // Not Node.on or Node.detach!
    if (
        (HANDLE in PRIVATE[id]) &&
        PRIVATE[id][HANDLE].detach
    ) {
        // if there's already a handle, and the keyDelay is the same,
        // then there's nothing to do.  Just leave it as-is.
        if (delay === who.get("keyDelay")) {
            return;
        }
        // the keyDelay is changing, which means that we need to delete this handler,
        // and assign a new one.
        PRIVATE[id][HANDLE].detach();
    }
    // store a private reference to the event handle.
    PRIVATE[id][HANDLE] = Y.on(
        "valueChange",
        tcHandler,
        Y.one(host),
        who,
        { delay : delay }
    );
};

/**
 * <p>The function that gets called when the valueChange event fires.</p>
 *
 * @private
 **/
function tcHandler () {
    // see if we got enough to make a query.
    var val = this.get("queryValue");
    if ( val.length < this.get("minQueryLength") ) return;
    this.fire("ac:query", val);
};


/**
 * <p>The default behavior for the "ac:query" event. If there is a "ds" object,
 * then it calls ds.sendRequest with the appropriate query.</p>
 *
 * @private
 **/
function handleQuery (e, val) {
    var ds = this.get("dataSource");

    // if we have a datasource, then make the request.
    if (ds) ds.sendRequest(
        // replace "{query}" with the actual query, but not "\{query}", in case you have that in your
        // query template for some strange reason.
        this.get("queryTemplate")
            .replace(/(^|[^\\])\{query\}/, '$1'+encodeURIComponent(query))
            .replace(/\\(\{query\})/, '$1'),
        {
            success : this.handleQueryResponse,
            failure : this.handleQueryResponse
        }
    );
};

/**
 * <p>The function that is called in the event of either success or failure
 * at the hands of the datasource sendRequest function.</p>
 * <p>It assumes that the datasource has either provided an object with an
 * array of results at e.response.results, or that the argument "e" is what
 * the renderer is expecting.</p>
 * <p>Basically, you can send it anything, but if it's something unusual,
 * then your renderer widget ought to know what to do with it.</p>
 * <p>Fires the "ac:load" event.</p>
 *
 * @private
 * @param e {Object} Response object from a DataSource, or something that the renderer
 * widget knows what to do with.
 **/
function handleQueryResponse (e) {
    var data = (e && e.response && e.response.results) ? e.response.results : e;
    this.fire("ac:load", {results : data});
};

/**
 * <p>The default behavior for the ac:load event.  If there is a "widget" member,
 * then call it's render() method, passing in the data object.</p>
 *
 * @private
 * @param e {Object} Response object from the event that was fired.  Should
 * have the result data on the "results" member.
 **/
// @TODO: Delete this?  Just have the widget listen for it.
function showResults (e) {
    var widget = this.get("widget");
    if (widget) widget.render(e.results);
};


/**
 * <p>Make sure that the browser's built-in autocomplete doesn't compete with our
 * widget creating an ugly situation.</p>
 * <p>However, disabling it completely also disables the "auto-fill on return" feature,
 * which is ever so nice.</p>
 * <p>To disable browser autocomplete altogether, just put autocomplete="off" in the markup,
 * or set it to "off" with a setAttribute() call prior to plugging in ACPlugin. (Markup is best,
 * because then it'll also be disabled if javascript is not around.)</p>
 * <p>@TODO Make this configurable. There may be cases where you actually *want* the browser
 * autocomplete to function, for instance if you're using the plugin with some other kind
 * of widget/visualization/etc.</p>
 *
 * @private
 * @param host {Object} The node which into it is plugged.
 **/
function manageBrowserAC (host) {
    // turn off the browser's autocomplete, but take note of it to turn
    // it back on later.
    var domnode = Y.Node.getDOMNode(host),
        bac = domnode.getAttribute("autocomplete");
    
    // turn the autocomplete back on so back button works, but only
    // if the user hasn't disabled it in the first place.
    if ((bac && bac !== "off") || bac === null || bac === undefined) {
        var browserACFixer = function () {
            if (domnode) domnode.setAttribute("autocomplete", "on");
            domnode = null;
        }
        // hook onto both.  Small concession to browser craziness.
        Y.on("beforeunload", browserACFixer, window);
        Y.on("unload", browserACFixer, window);
    }
    
    // turn off the browser's autocomplete feature, since that'll interfere.
    domnode.setAttribute("autocomplete", "off");
};

function ACPlugin () {
    ACPlugin.superclass.constructor.apply(this, arguments);
};

ACPlugin.ATTRS = {
    /**
     * <p>The value that is in the Node, which will be used in queries.</p>
     * <p>In the delimited case, setting/getting the value does not reflect the
     * host's full value, but rather:</p>
     * <ul><li>If focused, then the delimited section under the cursor</li>
     * <li>If not focused, then the contents after the last delimiter</li></ol>
     *
     * @type String
     **/
    queryValue : {
        // @TODO: Support delimiters here.
        // Split, get the cursor position, and return just the one that's active.
        // Same goes for setting.
        getter : function () {
            return this.get("host").get("value");
        },
        setter : function (q) {
            this.get("host").set("value", q);
            return q;
        }
    },
    
    /**
     * <p>The time in ms to wait after a key event before triggering a query.</p>
     * <p>If the value is changed, then set up a new valueChange handler.</p>
     * @type Number
     **/
    keyDelay : {
        value : 50,
        // @TODO add a validator
        // In the initializer, subscribe to the after event, rather than calling
        // attachTCHandler here.
        setter : function (t) {
            t = +t;
            if (isNaN(t)) return this.get("keyDelay");
            attachTCHandler(this, this.get("host"), Y.stamp(this), t);
            return t;
        }
    },
    /**
     * <p>Either a datasource utility, or something else that ducks the sendRequest method.</p>
     * <p>Without this, the default behavior of ac:query is a no-op.</p>
     * @type Object
     **/
    dataSource : { value : null },
    
    /**
     * <p>Set to trigger "delimited" mode.</p>
     * @TODO: Implement this.
     * @type String
     **/
    delimiter : { value : null },
    
    /**
     * <p>The minimum number of characters to require before triggering an ac:query event.</p>
     * @type Number
     **/
    minQueryLength : { value : 3 },
    
    /**
     * <p>A template string that is used to tell the datasource how to find the data we'll need.
     * This is important in cases where your query is not a simple matter of appending the value
     * of the input field to the URL string.  For instance YQL's sqlish syntax puts the query
     * value in the middle of the statement for many queries.</p>
     * <p>The string "{query}" should appear in the string somewhere, and will be replaced with
     * the querystring-encoded value of the node.  (This is not a requirement.  You could of course
     * have an autocomplete plugin that always sends the same query, but that's a bit silly.)</p>
     * @type String
     **/
    queryTemplate : { value : "{query}" },
    
    /**
     * <p>The widget that responds to the render(data) call when results return from the
     * data source.  It could be an ACWidget object, but anything that ducks the render() call
     * will work just fine.</p>
     * @type Object
     **/
    widget : { value : null }
};


Y.extend(ACPlugin, Y.Plugin.Base, {
    initializer : function () {
        var host = this.get("host"),
            id = Y.stamp(this);
        
        // stash the private valueChange handle, so we can remove it later.
        // @FIXME: there are some issues with removing valueChange. That may
        // need to be reworked, but as long as there's no unplugging, it's ok
        // for now.
        if (!(id in PRIVATE)) {
            PRIVATE[id] = {};
        }
        
        // attach the valueChange handler, if it isn't already.
        attachTCHandler(this, host, id, this.get("keyDelay"));
        
        // in addition to the valueChange event, pressing down or enter will force it to trigger a query
        // right away, even if the timeout has not happened yet, or the value hasn't changed.
        // Note that enter usually will submit the form, but if it doesn't, then it'll do this, instead.
        Y.on("key", Y.bind(tcHandler, this), host, "down:13,10,40");
        
        // manage the browser's autocomplete, since that'll interefere,
        // but we need to make sure that we don't prevent pre-filling 
        // when the user navs back to the page, unless the developer has
        // specifically disabled that feature in the markup.
        manageBrowserAC(host);
        
        // @TODO - If the field loses focus, then pause the ac:query event.
        // There should be a handler here that takes care of that.
        
        // publish the events
        this.publish("ac:query", {
            broadcast : 1,
            defaultFn : handleQuery,
            prefix : "ac"
        });
        this.publish("ac:load", {
            broadcast : 1,
            defaultFn : showResults,
            prefix : "ac"
        });
        
        // bind the query response handler to this.
        this.handleQueryResponse = Y.bind(handleQueryResponse, this);
    },
    destroy : function () {
        // remove the valueChange handler.
        var id = Y.stamp(this),
            priv = PRIVATE[id];
        priv[HANDLE].detach();
        delete PRIVATE[id];
    }
});

// support events.
Y.augment(ACPlugin, Y.EventTarget);

ACPlugin.NAME = "ACPlugin";
ACPlugin.NS = "ac";

Y.namespace("Plugin").ACPlugin = ACPlugin;


}, '@VERSION@' ,{requires:['node-base', 'plugin', 'value-change', 'event-key']});


YUI.add('autocomplete', function(Y){}, '@VERSION@' ,{use:['ac-plugin']});

