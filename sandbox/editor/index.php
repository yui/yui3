<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>YUI: Editor</title>
    <style type="text/css" media="screen">
        p, h2 {
            margin: 1em;
        }
        #test, #test2 {
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
            left: 600px;
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
	</style>
</head>
<body class="yui-skin-sam">


<div id="test"></div>
<div id="test2"></div>

<div id="arrow"></div>

<div id="stub">
<?php
$count = ($_GET['count']) ? $_GET['count'] : 2;

foreach (range(0, $count) as $num) {
$str .= <<<END
<strong>Action</strong><br>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse posuere pellentesque interdum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Integer blandit metus sit amet sapien ultrices ut varius sapien euismod. Praesent aliquet, magna in egestas ultricies, nulla lorem tincidunt ipsum, ut commodo metus dui vitae tortor. Cras id dolor purus. Fusce dignissim laoreet quam vehicula sodales. Vivamus mauris tellus, lacinia non fermentum id, semper a arcu. Vivamus in orci vitae leo laoreet ultricies dapibus ut massa. Cras lacinia ornare molestie. Nunc sodales nisi mauris. Vestibulum pellentesque, velit ut pharetra eleifend, mauris dolor blandit velit, ac pharetra ipsum ligula sed lorem. Integer vitae est urna, quis dignissim erat. In volutpat tortor ut lectus pharetra facilisis ultricies nibh lacinia. Mauris vel dui vitae urna adipiscing pretium. Nunc non nibh vitae quam porttitor gravida ac id sem. Aenean tempor mattis libero a sollicitudin.</p>
<p>Quisque vel quam sapien. Aliquam quis ante libero. In lectus ipsum, eleifend ut fringilla sit amet, vehicula ac nisi. Suspendisse diam justo, bibendum eu pellentesque ac, lobortis quis tellus. Quisque eget justo ipsum, nec varius justo. Curabitur arcu nibh, mollis sed mollis suscipit, pulvinar a nibh. Praesent bibendum, arcu quis hendrerit dignissim, lectus felis mattis lectus, in bibendum nunc ligula et libero. Phasellus dictum leo eget lorem ornare cursus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris sit amet augue enim, eget facilisis purus. Donec tincidunt fringilla consectetur. Phasellus id mauris eros, eget facilisis arcu. Morbi sagittis mattis sollicitudin. Pellentesque nulla urna, pretium at facilisis a, volutpat et turpis. Maecenas fringilla ligula ut arcu malesuada in pellentesque velit dignissim. Mauris interdum sem ac purus tincidunt id auctor sem aliquet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
<p>Phasellus malesuada consequat nunc, in pharetra sapien lobortis in. Maecenas in arcu vestibulum risus tristique tincidunt. In sit amet lectus non est mollis dictum. Nam elit lacus, cursus ut ultrices mattis, adipiscing vitae velit. Sed vitae neque at lacus congue luctus. Nam nisi urna, dignissim non rhoncus eu, rutrum non libero. Aliquam erat volutpat. Suspendisse eget nunc sapien. Aliquam pharetra, augue sed gravida auctor, nisl magna aliquet quam, vitae consequat magna libero nec quam. Morbi ultrices diam id purus elementum accumsan. Suspendisse nec dolor augue, ac interdum nunc. Etiam tempus dignissim tellus.</p>
<p>Ut sem dui, pulvinar nec posuere a, lobortis a ipsum. Cras ut tellus in odio vehicula sagittis. Proin egestas lorem nunc, eu consectetur justo. Sed luctus eros sem, vitae feugiat leo. Sed magna ipsum, laoreet in sagittis a, suscipit et enim. Etiam tristique sem vel nulla imperdiet porttitor. Donec felis massa, condimentum non pellentesque ut, dapibus pulvinar ipsum. Pellentesque massa tellus, accumsan eget sollicitudin vitae, molestie sed dui. Duis pellentesque lacus et augue condimentum a placerat odio blandit. Integer egestas, nulla id bibendum tristique, dolor nisi elementum purus, ut interdum velit quam ac velit. Cras ligula ligula, varius vel posuere eu, adipiscing vitae augue.</p>
<p>Sed erat odio, scelerisque vel suscipit ac, semper eu risus. Proin vel adipiscing elit. In suscipit nunc sed libero scelerisque fermentum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce aliquam commodo nunc, ultricies pharetra urna commodo quis. Phasellus neque ante, egestas ac mollis ac, posuere sed augue. Maecenas lacus sapien, scelerisque ac tempus eget, pulvinar sit amet erat. Nam leo arcu, venenatis id mollis et, imperdiet sit amet turpis. Mauris in est purus. Donec porttitor nisl et lectus ornare feugiat. Aenean mattis condimentum urna, in mollis arcu congue et. Integer ultrices consectetur dignissim.</p>
END;
}
echo($str);
?>
</div>
<script type="text/javascript" src="../../build/yui/yui-debug.js?bust=<?php echo(mktime()); ?>"></script>

<script type="text/javascript" src="js/iframe.js?bust=<?php echo(mktime()); ?>"></script>

<script type="text/javascript">
var yConfig = {
    debug: false,
    //base: '../../build/',
    filter: 'DEBUG',
    allowRollup: false,
    logExclude: {
        'YUI': true,
        Event: true,
        Base: true,
        Attribute: true,
        augment: true
    },
    throwFail: true
};

//YUI(yConfig).use('node', 'selector-css3', 'base', 'iframe', 'substitute', 'anim', 'dd', function(Y) {
YUI(yConfig).use('node', 'selector-css3', 'base', 'iframe', 'substitute', function(Y) {
    console.log(Y, Y.id);


    var iframe = new Y.IFrame({
        container: '#test',
        use: ['node','selector-css3', 'dd']
    }).render();

    iframe.after('ready', function() {
        
        console.info('After ready iframe #1');
        var Y = this.getInstance();
        Y.one('doc').set('designMode', 'On');
        Y.one('strong').set('innerHTML', 'Drag Me');
        if (Y.DD) {
            var dd = new Y.DD.Drag({ node: 'strong' });
        }
    });

    iframe.on('click', function(e) {
        console.log(e);
        Y.one('#arrow').setStyle('display', 'block').setXY([e.frameX - 8, e.frameY - 20]);
    });
    
    iframe.on('contextmenu', function(e) {
        console.log(e.type, e);
        e.halt();
    });
    
    var iframe2 = new Y.IFrame({
        container: '#test2',
        use: ['node','selector-css3', 'anim']
    }).render();

    iframe2.after('ready', function() {
        console.info('After ready iframe #2');
        var Y = this.getInstance();
        Y.one('doc').set('designMode', 'On');
        Y.one('strong').set('innerHTML', 'Click Me').on('click', function() {
            new Y.Anim({
                node: 'strong',
                to: {
                    opacity: 0
                }
            }).run();
        });
    });
    iframe2.on('click', function(e) {
        console.log(e);
        Y.one('#arrow').setStyle('display', 'block').setXY([e.frameX - 8, e.frameY - 20]);
    });
    
    
    //console.log(iframe.get('id'));
    //console.log(iframe2.get('id'));
});
</script>
</body>
</html>
