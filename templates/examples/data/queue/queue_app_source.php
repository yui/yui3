<div id="demo">
    <p>The module will be inserted here.  <em>Click the button below</em>.</p>
</div>

<button id="init">Initialize Application</button>

<script type="text/javascript">
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
</script>
