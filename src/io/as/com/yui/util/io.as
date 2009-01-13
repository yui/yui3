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

	import flash.external.ExternalInterface;
	import flash.utils.Timer;


	public class io extends Sprite
	{
		private var httpComplete:Function;
		private var httpError:Function;
		private var httpTimeout:Function;
		private var yId:String;

		public function io() {
			yId = root.loaderInfo.parameters.yid;
			var a:Array = [yId];

			ExternalInterface.addCallback("send", send);
			ExternalInterface.call('YUI.applyTo', yId, 'io.xdrReady', a);
		}

		public function send(uri:String, cfg:Object, id:Number):void {
			var loader:URLLoader = new URLLoader();
			var request:URLRequest = new URLRequest(uri);
			var timer:Timer;
			var args:Object;

			for (var prop:String in cfg) {
				switch (prop) {
					case "method":
						if(cfg.method === 'POST') {
							request.method = URLRequestMethod.POST;
						}
						break;
					case "data":
						if (cfg.data is String) {
							request.data = cfg.data;
						}
						else if (cfg.data is Object) {
							serializeData(request, cfg.data);
						}
						break;
					case "headers":
						setRequestHeaders(request, cfg.headers);
						cfg.headers = null;
						break;
					case "timeout":
						timer = new Timer(cfg.timeout, 1);
						timer.addEventListener(TimerEvent.TIMER_COMPLETE, httpTimeout);
						timer.start();
						break;
				}
			}

			args = {
				id:id,
				c:cfg
			}

			defineListeners(args, loader, timer);
			addListeners(loader);
			ioStart(args);
			loader.load(request);
		}

		private function defineListeners(args:Object, loader:URLLoader, timer:Timer):void {
			httpComplete = function(e:Event):void { ioComplete(e, args, timer); };
			httpError = function(e:IOErrorEvent):void { ioError(e, args, timer); };
			if (timer) {
				httpTimeout = function(e:TimerEvent):void { ioTimeout(e, args, loader); };
			}
		}

		private function addListeners(loader:IEventDispatcher):void  {
			loader.addEventListener(Event.COMPLETE, httpComplete);
			loader.addEventListener(IOErrorEvent.IO_ERROR, httpError);
		}

		private function removeListeners(e:Event, timer:Timer):void  {
				var loader:URLLoader = e.target as URLLoader;
				loader.removeEventListener(Event.COMPLETE, httpComplete);
				loader.removeEventListener(IOErrorEvent.IO_ERROR, httpError);
				if (timer) {
					timer.removeEventListener(TimerEvent.TIMER_COMPLETE, httpTimeout);
				}
		}

		private function ioStart(args:Object):void {
			var a:Array = [args.id, args.c];
			ExternalInterface.call('YUI.applyTo', yId, 'io.start', a);
		}

		private function ioComplete(e:Event, args:Object, timer:Timer):void {
			var data:String = encodeURI(e.target.data);
			var o:Object = {
				id: args.id,
				c: { responseText: data }
			}
			var a:Array = [o, args.c];

			if (timer && timer.running) {
				timer.stop();
			}

			ExternalInterface.call('YUI.applyTo', yId, 'io.success', a);
			removeListeners(e, timer);
		}

		private function ioError(e:IOErrorEvent, args:Object, timer:Timer):void {
			var data:String = encodeURI(e.target.data)
			var o:Object = {
				id: args.id,
				c: { responseText: data }
			}
			var a:Array = [o, args.c];

			if (timer && timer.running) {
				timer.stop();
			}

			ExternalInterface.call('YUI.applyTo', yId, 'io.failure', a);
			removeListeners(e, timer);
		}

		private function ioTimeout(e:Event, args:Object, loader:URLLoader):void {
			var timer:Timer = Timer(e.target);
			var a:Array = [args.id, args.c];

			loader.close();
			ExternalInterface.call('YUI.applyTo', yId, 'io.abort', a);
			removeListeners(e, timer);
		}

		private function setRequestHeaders(request:URLRequest, headers:Object):void {
			var header:URLRequestHeader;
			for (var prop:String in headers) {
				header = new URLRequestHeader(prop, headers[prop]);
				request.requestHeaders.push(header);
			}
		}

		private function serializeData(request:URLRequest, data:Object):void {
			request.data = new URLVariables();
			for (var prop:String in data) {
				request.data[prop] = data[prop];
			}
		}
	}
}