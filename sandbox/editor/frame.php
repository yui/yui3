<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>YUI: Editor</title>
    <style type="text/css" media="screen">
        p, h2 {
            margin: 1em;
        }
        #test, #test2, #test3 {
            height: 300px;
            width: 300px;
            border: 3px solid red;
            margin: 1em;
            position: absolute;
            top: 100px;
            left: 100px;
        }
        #test2 {
            top: 200px;
            left: 550px;
        }
        #test3 {
            left: 950px;
        }
        #stub {
            display: none;
        }
        #arrow {
            position: absolute;
            display: none;
            height: 16px;
            width: 16px;
            background-image: url(arrow.png);
        }
        #out {
            position: absolute;
            top: 5px;
            right: 5px;
            width: 200px;
            border: 1px solid black;
            font-size: 10px;
        }

        #out p {
            margin: 0;
        }
	</style>
</head>
<body class="yui-skin-sam">

<div id="out"></div>

<div id="test">Click me to render the Frame</div>
<div id="test2"></div>
<div id="test3"></div>

<div id="arrow"></div>

<div id="stub">
<?php
$count = ($_GET['count']) ? $_GET['count'] : 2;

foreach (range(0, $count) as $num) {
$str .= <<<END
<strong>Action</strong><br>
<a href="http://yuilibrary.com/">Click Me</a><br>
<ul>
    <li>Testing</li>
    <li dir="ltr">Testing</li>
    <li>Testing</li>
</ul>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse posuere pellentesque interdum.</p>
<p>Quisque vel quam sapien. Aliquam quis ante libero. In lectus ipsum, eleifend ut fringilla sit amet, vehicula ac nisi.</p>
<p>Phasellus malesuada consequat nunc, in pharetra sapien lobortis in. Maecenas in arcu vestibulum risus tristique tincidunt.</p>
<p>Ut sem dui, pulvinar nec posuere a, lobortis a ipsum. Cras ut tellus in odio vehicula sagittis.</p>
<p>Sed erat odio, scelerisque vel suscipit ac, semper eu risus. Proin vel adipiscing elit.</p>
END;
}
echo($str);
?>
</div>
<script type="text/javascript" src="../../build/yui/yui-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/frame.js?bust=<?php echo(mktime()); ?>"></script>

<script type="text/javascript">
var yConfig = {
    debug: true,
    //base: '../../build/',
    filter: 'DEBUG',
    allowRollup: false,
    logExclude: {
        'yui': true,
        'event': true,
        base: true,
        attribute: true,
        augment: true,
        get: true,
        loader: true,
        Selector: true
    },
    throwFail: true
};

//YUI(yConfig).use('node', 'selector-css3', 'base', 'iframe', 'substitute', 'anim', 'dd', function(Y) {
YUI(yConfig).use('node', 'selector-css3', 'base', 'frame', 'substitute', function(Y) {
    //console.log(Y, Y.id);

    var out = function(str) {
        Y.one('#out').prepend('<p>' + str + '</p>');
    };

    iframe = new Y.Frame({
        designMode: true,
        content: Y.one('#stub').get('innerHTML'),
        use: ['node','selector-css3', 'dd-drag', 'dd-ddm']
    });

    iframe.after('ready', function() {
        this.set('content', 'My <strong>new</strong> HTML');
        
        //console.info('After ready iframe #1');
        var Y = this.getInstance();
        Y.log(Y.DOM.IE, 'warn', 'DOM-IE');
        //Y.one('doc').set('designMode', 'On');
        Y.one('strong').set('innerHTML', 'Drag Me');

        out('frame1: ' + Y.all('p'));
        out('frame1: ' + Y.all('strong'));

        if (Y.DD) {
            //Y.one('strong').setStyle('position', 'relative').setXY([50, 50]);
            var dd = new Y.DD.Drag({ node: 'strong' });
        }

        this.delegate('click', function(e) {
            Y.all('p').setStyle('border', 'none');
            e.currentTarget.setStyle('border', '1px solid red');
            //console.log('iframe1 delegate', arguments);
        }, 'p');


    });

    //iframe.on('contentready', console.log);

    iframe.on('click', function(e) {
        //console.log(e.type, e);
        Y.one('#arrow').setStyle('display', 'block').setXY([e.frameX - 8, e.frameY - 20]);
        e.halt();
    });
    
    iframe.on('contextmenu', function(e) {
        //console.log(e.type, e);
        e.preventDefault();
        //e.halt();
    });
    
    Y.on('click', function(e) {
        //console.log('test one: ', e.target);
        e.target.set('innerHTML', '');
        iframe.render(e.target);
    }, '#test');
    
    var iframe2 = new Y.Frame({
        container: '#test2',
        dir: 'rtl',
        basehref: 'http://foo.com/assets/',
        content: Y.one('#stub').get('innerHTML'),
        use: ['node','selector-css3', 'anim']
    }).render();

    iframe2.after('ready', function() {
        //console.info('After ready iframe #2');
        var Y = this.getInstance();
        out('frame2: ' + Y.all('p'));
        out('frame2: ' + Y.all('strong'));
        //Y.one('doc').set('designMode', 'On');
        Y.one('strong').set('innerHTML', 'Click Me for Animation').on('click', function() {
            new Y.Anim({
                node: 'strong',
                to: {
                    opacity: 0
                }
            }).run();
        });
    });
    iframe2.on('click', function(e) {
        //console.log(e);
        Y.one('#arrow').setStyle('display', 'block').setXY([e.frameX - 8, e.frameY - 20]);
    });
    

    Y.on('click', function(e) {
        //console.log('test one: ', e.target);
        e.target.set('innerHTML', '');
        iframe3.render(e.target);
    }, '#test3');

    var iframe3 = new Y.Frame({
        container: '#test3',
        //src: 'local.htm',
        content: Y.one('#stub').get('innerHTML'),
        use: ['node','selector-css3', 'anim']
    }).render();

    iframe3.after('ready', function() {
        //console.info('After ready iframe #2');
        var Y = this.getInstance();
        out('frame3: ' + Y.all('p'));
        out('frame3: ' + Y.all('strong'));
        //Y.one('doc').set('designMode', 'On');
        Y.one('strong').set('innerHTML', 'Click Me for Animation').on('click', function() {
            new Y.Anim({
                node: 'strong',
                to: {
                    opacity: 0
                }
            }).run();
        });
    });
    iframe3.on('click', function(e) {
        //console.log(e);
        Y.one('#arrow').setStyle('display', 'block').setXY([e.frameX - 8, e.frameY - 20]);
    });
    
    
    //console.log(iframe.get('id'));
    //console.log(iframe2.get('id'));
});
</script>
</body>
</html>
