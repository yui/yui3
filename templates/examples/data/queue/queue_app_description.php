<h3>The Markup</h3>
<p>The markup will start with just a place holder element for our application.</p>
<textarea class="HTML" name="code" rows="1" cols="60">
<div id="demo">
    <p>The module will be inserted here.  <em>Click the button below</em>.</p>
</div>

<button id="init">Initialize Application</button>
</textarea>

<p>And will end with the following markup (indented for readability):</p>
<textarea class="HTML" name="code" rows="1" cols="60">
<div id="demo">
    <div class="yui-module">
        <div class="yui-hd">
            <h4>Queue Demo</h4>
        </div>
        <div class="yui-bd">
            <div class="yui-nav">
                <ul>
                    <li><a href="#">Nav Lorem</a></li>
                    <li><a href="#">Nav Ipsum</a></li>
                    <li><a href="#">Nav Dolor</a></li>
                    <li><a href="#">Nav Sit</a></li>
                </ul>
            </div>
            <div class="yui-content">
                <p>[ App content here ]</p>
            </div>
        </div>
        <div class="yui-ft">
            <p class="yui-status">(status message here)</p>
        </div>
    </div>
</div>

<button id="init">Re-initialize Application</button>
</textarea>

<h3>The CSS</h3>
<p>Some CSS is added to make it look like an application.</p>
<textarea class="CSS" name="code" rows="1" cols="60">
#init {
    margin-top: 1em;
}

#demo .yui-module {
    position: relative;
    width: 28em;
}
#demo .yui-module .yui-hd,
#demo .yui-module .yui-bd,
#demo .yui-module .yui-ft {
    margin: 0;
    padding: 1ex 1em;
}
#demo .yui-module .yui-hd {
    background: #406ED9;
}
#demo .yui-module .yui-hd h4 {
    color: #fff;
    margin: 0;
}
#demo .yui-module .yui-bd {
    background: #ABCEFF;
    border-left: 1px solid #7A97BB;
    border-right: 1px solid #7A97BB;
    height: 5em;
    padding-top: 4.5em;
    position: relative;
    overflow: hidden;
    text-align: center;
}
#demo .yui-module .yui-ft {
    background: #fff;
    border: 1px solid #7A97BB;
    border-top-color: #ccc;
    padding-right: 25px;
}
#demo .yui-module .yui-status {
    margin: 0;
    padding: 0 25px 0 0;
    height: 1.3em;
}
#demo .yui-module .yui-nav {
    background: #fff;
    border-bottom: 1px solid #ccc;
    left: 0;
    padding: .5em;
    position: absolute;
    width: 27em;
}
#demo .yui-module .yui-nav ul,
#demo .yui-module .yui-nav li {
    display: inline;
    list-style: none;
    margin: 0;
    padding: 0;
}
#demo .yui-module .yui-nav a {
    color: #ffa928;
    padding: 0 1.1em;
}
#demo .yui-module .working {
    background: #fff url(http://l.yimg.com/us.yimg.com/i/nt/ic/ut/bsc/busyarr_1.gif) no-repeat 26em 50%;
}
</textarea>

<h3>Example application structure</h3>
<p>For this example, we'll create a simple application that we'll contain under the <code>MyApp</code> namespace.  The basic structure of the namespace will be as follows:</p>

<textarea class="JScript" name="code" rows="1" cols="60">
YUI(<?php echo($yuiConfig); ?>).use(<?php echo($requiredModules); ?>,function (Y) {

var MyApp = {
    // the name of the application
    NAME : "Queue Demo",

    // rendering Queue
    q : new Y.Queue(),

    // cache of frequently used nodes in the DOM structure
    nodes : {
        root    : null,
        status  : null,
        nav     : null,
        content : null,
        foot    : null
    },

    /*** Public API methods ***/
    // draws the UI in the specified container
    render : function (container) { ... },

    // removes the UI
    destroy : function () { ... },

    // update the status bar at the bottom of the app
    setStatus : function (message,working) { ... },


    /*** private methods ***/
    // adds the basic app skeleton to the page
    _renderFramework : function () { ... },

    // populates the navigation section
    _renderNav : function () { ... },

    // populates the content section
    _renderContent : function () { ... }
};

});
</textarea>

<p>The <code>MyApp.render</code> function will add the rendering methods to the <code>MyApp.q</code> Queue and set it in motion.  Each of the methods will be executed in turn, yielding back to the browser between steps.  So as each piece of the UI is assembled, the browser is then given the opportunity to draw it.</p>

<textarea class="JScript" name="code" rows="1" cols="60">
    ...
    render : function (container) {
        // If the application is currently rendered somewhere, destroy it first
        // by clearing the Queue and adding the destroy method to run before
        // the default rendering operations.
        if (MyApp.nodes.root) {
            MyApp.q.stop();

            MyApp.q.add(
                MyApp.destroy
            );
        }

        // Add the rendering operations to the ops.render Queue and call run()
        MyApp.q.add(
            // pass the container param to the callback using Y.bind
            Y.bind(MyApp._renderFramework, MyApp, container),
            MyApp._renderNav,
            MyApp._renderContent).run();
    },
    ...
</textarea>

<p>If there are any process intensive operations in the rendering steps, the UI generated in all <em>previous</em> steps will have been drawn by the browser before the heavy lifting begins.  This way, the user will be shown a part of the UI and can begin to develop an understanding of its structure and operation while the rest of it is being constructed.</p>

<h3>A note on artificial delays and animation</h3>
<p>In this example, rather than include code that would spike your CPU, delays were simulated by inserting Queue callbacks with a timeout and a function that does nothing.  There is a distinct difference between a delay caused by code execution and a delay caused by <code>setTimeout</code>.  In the former case, the browser is busy and likely won't respond to user events (such as clicks) until the executing code has completed.  In the latter, any number of JavaScript event threads may execute to completion in the intervening time.</p>

<p>The rendering methods include animations courtesy of <code>Y.Anim</code>.  Anim is similar to Queue in that it also works by scheduling a callback (the application of the easing calculation) for repeated execution, yielding to the browser between each update.  However, Anim's schedule lives entirely outside the Queue's schedule.  Stopping or pausing a Queue will not stop or pause a <code>Y.Anim</code> instance that is <code>run()</code> from a Queue callback.  Similarly, if a callback starts an animation, Queue <em>will not</em> wait for the animation to complete before executing the next queued callback.</p>

<h3>Full Script Source</h3>
<p>The complete code for this example includes the artificial delays added to <code>MyApp.q</code> in the <code>render</code> method.</p>

<textarea class="JScript" name="code" rows="1" cols="60">
YUI(<?php echo($yuiConfig); ?>).use(<?php echo($requiredModules); ?>,function (Y) {

var MyApp = {
    NAME : 'Queue Demo',

    q : new Y.Queue(),

    nodes : {
        root    : null,
        status  : null,
        nav     : null,
        content : null,
        foot    : null
    },

    render : function (container) {
        if (MyApp.nodes.root) {
            MyApp.q.stop();

            MyApp.q.add(
                MyApp.destroy
            );
        }

        // artificial delays have been inserted to simulate _renderNav or
        // _renderContent being process intensive and taking a while to complete
        MyApp.q.add(
            // pass the container param to the callback using Y.bind
            Y.bind(MyApp._renderFramework, MyApp, container),
            {fn: function () {}, timeout: 700}, // artificial delay
            MyApp._renderNav,
            {fn: function () {}, timeout: 700}, // artificial delay
            MyApp._renderContent).run();
    },

    destroy : function () {
        var root = MyApp.nodes.root;

        if (root) {
            Y.Event.purgeElement(root,true);
            root.set('innerHTML','');
        }
    },

    setStatus : function (message,working) {
        MyApp.nodes.status.set('innerHTML',message);

        MyApp.nodes.foot[working?'addClass':'removeClass']('working');
    },

    _renderFramework : function (container) {
        var root = MyApp.nodes.root = Y.get(container);

        root.set('innerHTML',
        '<div class="yui-module">'+
            '<div class="yui-hd">'+
                '<h4>'+MyApp.NAME+'</h4>'+
            '</div>'+
            '<div class="yui-bd">'+
                '<div class="yui-nav"></div>'+
                '<div class="yui-content"></div>'+
            '</div>'+
            '<div class="yui-ft">'+
                '<p class="yui-status"></p>'+
            '</div>'+
        '</div>');

        MyApp.nodes.status  = root.query('p.yui-status');
        MyApp.nodes.nav     = root.query('.yui-nav');
        MyApp.nodes.content = root.query('.yui-content');
        MyApp.nodes.foot    = root.query('.yui-ft');

        MyApp.nodes.nav.setStyle('top','-30px');
        MyApp.nodes.content.setStyle('opacity',0);

        MyApp.setStatus('Loading...',true);
    },

    _renderNav : function () {
        var nav = MyApp.nodes.nav;
        nav.appendChild(Y.Node.create(
            '<ul>'+
                '<li><a href="#">Nav Lorem</a></li>'+
                '<li><a href="#">Nav Ipsum</a></li>'+
                '<li><a href="#">Nav Dolor</a></li>'+
                '<li><a href="#">Nav Sit</a></li>'+
            '</ul>'));

        new Y.Anim({
            node : nav,
            to :   { top : 0 },
            duration : .3
        }).run();
    },

    _renderContent : function () {
        var content = MyApp.nodes.content;

        content.appendChild(Y.Node.create(
            '<p>[ App content here ]</p>'));

        new Y.Anim({
            node : content,
            to :   { opacity : 1 },
            duration : .8
        }).run();

        MyApp.setStatus('App initialized',false);
    }
};

Y.get('#init').on('click',function (e) {
    e.preventDefault();
    this.set('innerHTML','Re-initialize Application');

    MyApp.render('#demo');
});

// expose the example structure
YUI.example = { MyApp : MyApp };

});
</textarea>
