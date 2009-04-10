package com.yui.util
{
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.TimerEvent;
	import flash.events.IEventDispatcher;
	import flash.net.URLRequest;
	import flash.net.URLRequestMethod;
	import flash.net.URLRequestHeader;
	import flash.net.URLLoader;
	import flash.net.URLVariables;
	import flash.utils.Timer;
	import flash.external.ExternalInterface;

	public class io extends Sprite
	{
		private var httpComplete:Function;
		private var httpError:Function;
		private var httpTimeout:Function;
		private var loaderMap:Object = {};
		private var yId:String;

		public function io() {
			yId = root.loaderInfo.parameters.yid;
			var a:Array = [yId];

			ExternalInterface.addCallback("send", send);
			ExternalInterface.addCallback("abort", ioAbort);
			ExternalInterface.addCallback("readyState", readyState);
			ExternalInterface.call('YUI.applyTo', yId, 'io.xdrReady', a);
		};

		public function send(uri:String, cfg:Object, id:uint):void {
			var loader:URLLoader = new URLLoader(),
				request:URLRequest = new URLRequest(uri),
				d:Object = { id:id, cfg:cfg },
				timer:Timer,
				prop:String;

			for (prop in cfg) {
				switch (prop) {
					case "method":
						if(cfg.method === 'POST') {
							request.method = URLRequestMethod.POST;
						}
						break;
					case "data":
						serializeData(request, cfg.data);
						break;
					case "headers":
						setRequestHeaders(request, cfg.headers);
						cfg.headers = null;
						break;
					case "timeout":
						timer = new Timer(cfg.timeout, 1);
						break;
				}
			}

			loaderMap[id] = { c:loader, readyState: 0, t:timer };
			defineListeners(d, timer);
			addListeners(loader, timer);
			loader.load(request);
			ioStart(d);

			if (timer) {
				timer.start();
			}
		};

		private function defineListeners(d:Object, timer:Timer):void {
			httpComplete = function(e:Event):void { ioSuccess(e, d, timer); };
			httpError = function(e:IOErrorEvent):void { ioFailure(e, d, timer); };

			if (timer) {
				httpTimeout = function(e:TimerEvent):void { ioTimeout(e, d); };
			}
		};

		private function addListeners(loader:IEventDispatcher, timer:IEventDispatcher):void  {
			loader.addEventListener(Event.COMPLETE, httpComplete);
			loader.addEventListener(IOErrorEvent.IO_ERROR, httpError);

			if (timer) {
				timer.addEventListener(TimerEvent.TIMER_COMPLETE, httpTimeout);
			}
		};

		private function removeListeners(id:uint):void  {
			loaderMap[id].c.removeEventListener(Event.COMPLETE, httpComplete);
			loaderMap[id].c.removeEventListener(IOErrorEvent.IO_ERROR, httpError);

			if (loaderMap[id].t) {
				loaderMap[id].t.removeEventListener(TimerEvent.TIMER_COMPLETE, httpTimeout);
			}
		};

		private function ioStart(d:Object):void {
			var a:Array = [d.id, d.cfg];

			loaderMap[d.id].readyState = 2;
			ExternalInterface.call('YUI.applyTo', yId, 'io.start', a);
		};

		private function ioSuccess(e:Event, d:Object, timer:Timer):void {
			var data:String = encodeURI(e.target.data),
				response:Object = { id: d.id, c: { responseText: data } },
				a:Array = [response, d.cfg];

			loaderMap[d.id].readyState = 4;

			if (timer && timer.running) {
				timer.stop();
			}

			ExternalInterface.call('YUI.applyTo', yId, 'io.success', a);
			destroy(d.id);
		};

		private function ioFailure(e:Event, d:Object, timer:Timer):void {
			var data:String,
				response:Object = { id: d.id, c: {} },
				a:Array = [response, d.cfg];

			if (e is IOErrorEvent) {
				response.c.responseText = encodeURI(e.target.data);
			}
			else if (e is TimerEvent) {
				response.status = 'timeout';
			}

			loaderMap[d.id].readyState = 4;

			if (timer && timer.running) {
				timer.stop();
			}

			ExternalInterface.call('YUI.applyTo', yId, 'io.failure', a);
			destroy(d.id);
		};

		private function ioTimeout(e:TimerEvent, d:Object):void {
			loaderMap[d.id].c.close();
			ioFailure(e, d, null);
		};

		public function ioAbort(id:uint, c:Object):void {
			var response:Object = { id: id, c: { statusText: 'abort' } },
				a:Array = [response, c];

			loaderMap[id].c.close();

			if (loaderMap[id].t && loaderMap[id].t.running) {
				loaderMap[id].t;
			}

			ExternalInterface.call('YUI.applyTo', yId, 'io.failure', a);
			destroy(id);
		};

		public function readyState(id:uint):Boolean {
			return loaderMap[id].readyState !== 4;
		};

		private function setRequestHeaders(request:URLRequest, headers:Object):void {
			var header:URLRequestHeader,
				prop:String;

			for (prop in headers) {
				header = new URLRequestHeader(prop, headers[prop]);
				request.requestHeaders.push(header);
 			}
		};

		private function serializeData(request:URLRequest, d:Object):void {
			var prop:String;
			request.data = new URLVariables();

			for (prop in d) {
				request.data[prop] = d[prop];
			}
		};

		private function destroy(id:uint):void {
			removeListeners(id);
			delete loaderMap[id];
		};
	}
}