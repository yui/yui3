
YUI({
	base: '../../build/',
	filter: 'debug',
	logInclude: {
//		'imageloader': true,
		'profiling': true
	}
}).use('imageloader', 'profiler', 'console', function(Y) {

		new Y.Console({ width: 500, height: 800, newestOnTop: false }).render();

		Y.Profiler.registerConstructor('Y.Base');
		Y.Profiler.registerConstructor('Y.ImgLoadGroup');
		Y.Profiler.registerConstructor('Y.ImgLoadImgObj');
		Y.Profiler.registerFunction('Y.DOM.viewportRegion');
		Y.Profiler.registerFunction('Y.detach');

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

		var downGroup = new Y.ImgLoadGroup({ name: 'conditional', foldDistance: 50 });
		downGroup.registerImage({ domId: 'waydown', bgUrl: 'http://us.i1.yimg.com/us.yimg.com/i/ar/sp/fifa/rooney77x42.jpg' });
		downGroup.registerImage({ domId: 'waydown2', bgUrl: 'http://us.i1.yimg.com/us.yimg.com/i/ar/sp/fifa/rooney77x42.jpg' });
		downGroup.registerImage({ domId: 'waydown3', bgUrl: 'http://us.i1.yimg.com/us.yimg.com/i/ar/sp/fifa/rooney77x42.jpg' });
		downGroup.set('className', 'waydownCF');  // 4th image

		var loadingClassGroup = new Y.ImgLoadGroup({ name: 'initial loading image', className: 'yui-imgloadwithload' });
		loadingClassGroup.addTrigger('#classloadingtest', 'mouseover');


		var setupMethods = [
			'addTrigger',
			'addCustomTrigger',
			'registerImage',
			'_setFoldTriggers'
		];

		Y.log('--- IMAGELOADER SETUP METHODS ---', 'info', 'profiling');
		var report = Y.Profiler.getFunctionReport('Y.ImgLoadGroup');
		Y.log('CONSTRUCTOR::  calls: ' + report.calls + ' | avg: ' + report.avg, 'info', 'profiling');
		for (var i=0, len = setupMethods.length; i < len; i++) {
			report = Y.Profiler.getFunctionReport('Y.ImgLoadGroup.prototype.' + setupMethods[i]);
			Y.log(setupMethods[i].toUpperCase() + '::  calls: ' + report.calls + ' | avg: ' + report.avg, 'info', 'profiling');
		}

		var profilerWrapup = function() {
			Y.on('domready', this.init, this);
			this.yInstance = Y;

		};

		profilerWrapup.prototype.init = function() {
			this.clickHandle = Y.on('click', this.showReports, '#profilerstop', this);
		};

		profilerWrapup.prototype.showReports = function() {
			var detachReport = this.yInstance.Profiler.getFunctionReport('Y.detach');
			this.yInstance.Profiler.unregisterFunction('Y.detach');
			Y.detach(this.clickHandle);
			Y.one('#profilerstop').removeClass('stopBtnActive');

			var executionMethods = [
				'_onloadTasks',
				'fetch',
				'_clearTriggers',
				'_foldCheck',
				'_fetchByClass'
			];
	
			var report;
			Y.log('--- IMAGELOADER EXECUTION METHODS ---', 'info', 'profiling');

			for (var i=0, len = executionMethods.length; i < len; i++) {
				report = this.yInstance.Profiler.getFunctionReport('Y.ImgLoadGroup.prototype.' + executionMethods[i]);
				this.yInstance.log(executionMethods[i].toUpperCase() + '::  calls: ' + report.calls + ' | avg: ' + report.avg, 'info', 'profiling');
			}

			// and fetch method of ImgLoadImgObj objects
			report = this.yInstance.Profiler.getFunctionReport('Y.ImgLoadImgObj.prototype.fetch');
			this.yInstance.log('Y.IMGLOADIMGOBJ  FETCH::  calls: ' + report.calls + ' | avg: ' + report.avg, 'info', 'profiling');

			report = this.yInstance.Profiler.getFunctionReport('Y.DOM.viewportRegion');
			this.yInstance.log('Y.DOM.VIEWPORTREGION::  calls: ' + report.calls + ' | avg: ' + report.avg, 'info', 'profiling');

			this.yInstance.log('Y.DETACH::  calls: ' + detachReport.calls + ' | avg: ' + detachReport.avg, 'info', 'profiling');
			var detachSum = detachReport.calls * detachReport.avg;

			var clearTriggersReport = this.yInstance.Profiler.getFunctionReport('Y.ImgLoadGroup.prototype._clearTriggers');
			var clearTriggersSum = clearTriggersReport.calls * clearTriggersReport.avg;
			this.yInstance.log('_clearTriggers w/o Y.detach: ' + (clearTriggersSum - detachSum), 'info', 'profiling');

			var foldCheckReport = this.yInstance.Profiler.getFunctionReport('Y.ImgLoadGroup.prototype._foldCheck');
			var foldCheckSum = foldCheckReport.calls * foldCheckReport.avg;
			this.yInstance.log('_foldCheck sum: ' + foldCheckSum, 'info', 'profiling');

		};

		var profile = new profilerWrapup();

});

