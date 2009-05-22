
YUI({
	base: '../../build/',
	filter: 'debug',
	logInclude: {
		'yui': true,
		'loader': true,
		'imageloader': true
	}
	/*
	logExclude: {
		'attribute': true,
		'event': true,
		'Selector': true,
		'DOM': true,
		'get': true,
		'base': true
	}
	*/
}).use('imageloader', function(Y) {

		var il = new Y.ImgLoadGroup({ timeLimit: 8, name: 'topmain' });
		il.registerImage({ domId: 'topmain', bgUrl: 'http://us.i1.yimg.com/us.yimg.com/i/travel/tg/lp/42/240x240_42f4203a640ac50146b0fcd6e892a34f.jpg' });
		il.addTrigger('#everything', 'mouseover');
	
		// two images and two triggers
		var firstGroup = new Y.ImgLoadGroup({ name: 'fifa', timeLimit: 44 });
		firstGroup.registerImage({ domId: 'hoverme', bgUrl: 'http://us.i1.yimg.com/us.yimg.com/i/fifa/gen/vip/es/h_wlcm.gif' });
		firstGroup.registerImage({ domId: 'hoverme2', bgUrl: 'http://us.i1.yimg.com/us.yimg.com/i/fifa/gen/vip/de/h_wlcm.gif' });
		firstGroup.addTrigger('#hoverme2', 'click').addTrigger('#hoverme', 'mouseover');

		// by class name
		var classGroup = new Y.ImgLoadGroup({ name: 'classgroup', className: 'yui-imgload' });
		classGroup.addTrigger('#classtest1', 'mouseover');

		// custom event, on the Y instance
		var customeventGroup = new Y.ImgLoadGroup({ name: 'customevent' });
		customeventGroup.registerImage({ domId: 'customevent', bgUrl: 'http://us.i1.yimg.com/us.yimg.com/i/ca/mus/pol/album_bss.jpg' });
		customeventGroup.addCustomTrigger('mycustomevent:imgloadevent');
		Y.on('dblclick', function() { Y.fire('mycustomevent:imgloadevent'); }, '#customevent');
		
		// custom event, on a local instance
		var myCustomEvent = new Y.Event.Target();
		var customevent2Group = new Y.ImgLoadGroup({ name: 'customevent2' });
		customevent2Group.registerImage({ domId: 'customevent2', bgUrl: 'http://us.i1.yimg.com/us.yimg.com/i/ca/mus/pol/album_bss.jpg' });
		customevent2Group.addCustomTrigger('mycustomevent:imgloadevent2', myCustomEvent);
		Y.on('dblclick', function() { myCustomEvent.fire('mycustomevent:imgloadevent2'); }, '#customevent2');

		// visibility setting
		var squareGroup = new Y.ImgLoadGroup({ name: 'scroll', timeLimit: 8 });
		squareGroup.addTrigger(window, 'scroll');
		squareGroup.registerImage({ domId: 'squareImg', srcUrl: 'http://us.i1.yimg.com/us.yimg.com/i/b5/ast/hsign/aqu.gif', setVisible: true });

		// png, no trigger
		var pngGroup = new Y.ImgLoadGroup({ name: 'pngGroup', timeLimit: 5 });
		pngGroup.registerImage({ domId: 'pngimg', bgUrl: 'http://us.i1.yimg.com/us.yimg.com/i/us/nws/weather/gr/47s.png', isPng: true, sizingMethod: 'scale' });

		// scrolling, mix of registerd images and class-name images
		var downGroup = new Y.ImgLoadGroup({ name: 'conditional', foldDistance: 50 /*, timeLimit: 6 */ });  // <-- time limit tests removal of timout when all scroll images are fetched
		downGroup.registerImage({ domId: 'waydown', bgUrl: 'http://us.i1.yimg.com/us.yimg.com/i/ar/sp/fifa/rooney77x42.jpg' });
		downGroup.registerImage({ domId: 'waydown2', bgUrl: 'http://us.i1.yimg.com/us.yimg.com/i/ar/sp/fifa/rooney77x42.jpg' });
		downGroup.registerImage({ domId: 'waydown3', bgUrl: 'http://us.i1.yimg.com/us.yimg.com/i/ar/sp/fifa/rooney77x42.jpg' });
		downGroup.set('className', 'waydownCF');
		Y.log('class name: ' + downGroup.get('className'), 'info', 'imageloader');

		// loading image until image loads
		var loadingClassGroup = new Y.ImgLoadGroup({ name: 'initial loading image', className: 'yui-imgloadwithload' });
		loadingClassGroup.addTrigger('#classloadingtest', 'mouseover');
});

