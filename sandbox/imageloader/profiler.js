
YUI({
	base: '../../build/',
	filter: 'debug',
	logInclude: {
//		'imageloader': true,
		'profiling': true
	}
}).use('imageloader', 'profiler', function(Y) {

		Y.Profiler.registerConstructor('Y.ImgLoadGroup');
		Y.Profiler.registerConstructor('Y.ImgLoadImgObj');

		var il = new Y.ImgLoadGroup({ timeLimit: 8, name: 'topmain' });
		il.registerImage({ domId: 'topmain', bgUrl: 'http://us.i1.yimg.com/us.yimg.com/i/travel/tg/lp/42/240x240_42f4203a640ac50146b0fcd6e892a34f.jpg' });
		il.addTrigger('#everything', 'mouseover');

		var firstGroup = new Y.ImgLoadGroup({ name: 'fifa', timeLimit: 44 });
		firstGroup.registerImage({ domId: 'hoverme', bgUrl: 'http://us.i1.yimg.com/us.yimg.com/i/fifa/gen/vip/es/h_wlcm.gif' });
		firstGroup.registerImage({ domId: 'hoverme2', bgUrl: 'http://us.i1.yimg.com/us.yimg.com/i/fifa/gen/vip/de/h_wlcm.gif' });
		firstGroup.addTrigger('#hoverme2', 'click').addTrigger('#hoverme', 'mouseover');

		var classGroup = new Y.ImgLoadGroup({ name: 'classgroup', className: 'yui-imgload' });
		classGroup.addTrigger('#classtest1', 'mouseover');

		var customeventGroup = new Y.ImgLoadGroup({ name: 'customevent' });
		customeventGroup.registerImage({ domId: 'customevent', bgUrl: 'http://us.i1.yimg.com/us.yimg.com/i/ca/mus/pol/album_bss.jpg' });
		customeventGroup.addCustomTrigger('mycustomevent:imgloadevent');
		Y.on('dblclick', function() { Y.fire('mycustomevent:imgloadevent'); }, '#customevent');
		
		var myCustomEvent = new Y.Event.Target();
		var customevent2Group = new Y.ImgLoadGroup({ name: 'customevent2' });
		customevent2Group.registerImage({ domId: 'customevent2', bgUrl: 'http://us.i1.yimg.com/us.yimg.com/i/ca/mus/pol/album_bss.jpg' });
		customevent2Group.addCustomTrigger('mycustomevent:imgloadevent2', myCustomEvent);
		Y.on('dblclick', function() { myCustomEvent.fire('mycustomevent:imgloadevent2'); }, '#customevent2');

		var squareGroup = new Y.ImgLoadGroup({ name: 'scroll' });
		squareGroup.addTrigger(window, 'scroll');
		squareGroup.registerImage({ domId: 'squareImg', srcUrl: 'http://us.i1.yimg.com/us.yimg.com/i/b5/ast/hsign/aqu.gif', setVisible: true });

		var pngGroup = new Y.ImgLoadGroup({ name: 'pngGroup', timeLimit: 5 });
		pngGroup.registerImage({ domId: 'pngimg', bgUrl: 'http://us.i1.yimg.com/us.yimg.com/i/us/nws/weather/gr/47s.png', isPng: true, sizingMethod: 'scale' });

		var downGroup = new Y.ImgLoadGroup({ name: 'conditional', foldDistance: 50, /* timeLimit: 6 */ });  // <-- time limit tests removal of timout when all scroll images are fetched
		downGroup.registerImage({ domId: 'waydown', bgUrl: 'http://us.i1.yimg.com/us.yimg.com/i/ar/sp/fifa/rooney77x42.jpg' });
		downGroup.registerImage({ domId: 'waydown2', bgUrl: 'http://us.i1.yimg.com/us.yimg.com/i/ar/sp/fifa/rooney77x42.jpg' });
		downGroup.registerImage({ domId: 'waydown3', bgUrl: 'http://us.i1.yimg.com/us.yimg.com/i/ar/sp/fifa/rooney77x42.jpg' });
		downGroup.set('className', 'waydownCF');  // 4th image

		var loadingClassGroup = new Y.ImgLoadGroup({ name: 'initial loading image', className: 'yui-imgloadwithload' });
		loadingClassGroup.addTrigger('#classloadingtest', 'mouseover');

		/*
		var report = Y.Profiler.getFullReport();
		console.log(report);
		*/
		var setupMethods = [
			'addTrigger',
			'addCustomTrigger',
			'registerImage',
			'_setFoldTriggers'
		];


		var report = Y.Profiler.getFunctionReport('Y.ImgLoadGroup');
		Y.log('constructor', 'info', 'profiling');
		Y.log(report);
		for (var i=0, len = setupMethods.length; i < len; i++) {
			report = Y.Profiler.getFunctionReport('Y.ImgLoadGroup.prototype.' + setupMethods[i]);
			Y.log(setupMethods[i], 'info', 'profiling');
			Y.log(report);
		}

		var profilerWrapup = function() {
			Y.on('domready', this.init, this);
			this.yInstance = Y;

		};

		profilerWrapup.prototype.init = function() {
			this.clickHandle = Y.on('click', this.showReports, '#profilerstop', this);
		};

		profilerWrapup.prototype.showReports = function() {
			Y.detach(this.clickHandle);
			Y.get('#profilerstop').removeClass('stopBtnActive');

			var executionMethods = [
				'_onloadTasks',
				'fetch',
				'_clearTriggers',
				'_foldCheck',
				'_fetchByClass'
			];
	
			var report;

			for (var i=0, len = executionMethods.length; i < len; i++) {
				report = this.yInstance.Profiler.getFunctionReport('Y.ImgLoadGroup.prototype.' + executionMethods[i]);
				this.yInstance.log(executionMethods[i], 'info', 'profiling');
				this.yInstance.log(report);
			}

			// and fetch method of ImgLoadImgObj objects
			report = this.yInstance.Profiler.getFunctionReport('Y.ImgLoadImgObj.prototype.fetch');
			this.yInstance.log('Y.ImgLoadImgObj  fetch', 'info', 'profiling');
			this.yInstance.log(report);

		};

		var profile = new profilerWrapup();

});

