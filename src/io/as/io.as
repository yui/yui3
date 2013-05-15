package
{
    import flash.display.Sprite;
    import flash.events.Event;
    import flash.events.IOErrorEvent;
	import flash.events.SecurityErrorEvent;
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
        private var vars:Object = root.loaderInfo.parameters;

        public function io() {
            var jsCheck:RegExp = /[^A-Za-z0-9._:-]/; 
            if(jsCheck.test(vars.yid)) {
                vars.yid = '';
            }
            if(jsCheck.test(vars.uid)) {
                vars.uid = '';
            }
            ExternalInterface.addCallback("send", send);
            ExternalInterface.addCallback("abort", abort);
            ExternalInterface.addCallback("isInProgress", isInProgress);
            ExternalInterface.call('YUI.applyTo', vars.yid, 'io.xdrReady', [vars.yid, vars.uid]);
        }

        public function send(uri:String, cfg:Object):void {
            var loader:URLLoader = new URLLoader(),
                request:URLRequest = new URLRequest(uri),
				o:Object = { id: cfg.id, uid: cfg.uid },
                timer:Timer,
                k:String,
                p:String;

            for (p in cfg) {
                switch (p) {
                    case "method":
                        if(cfg.method === 'POST') {
                            request.method = URLRequestMethod.POST;
                        }
                        break;
                    case "data":
                        if (cfg.method === 'POST') {
                            request.data = cfg.data;
                        }
                        else {
                            for (k in cfg.data) {
                                request.data = new URLVariables(k + "=" + cfg.data[k]);
                            }
                        }
                        break;
                    case "headers":
                        setRequestHeaders(request, cfg.headers);
                        break;
                    case "timeout":
                        timer = new Timer(cfg.timeout, 1);
                        break;
                }
            }

            loaderMap[cfg.id] = { c:loader, readyState: 0, t:timer };
			defineListeners(o, timer);
            addListeners(loader, timer);
            loader.load(request);
            start(o, timer);
        }

        private function defineListeners(o:Object, timer:Timer):void {
            httpComplete = function(e:Event):void { success(e, o, timer); };
            httpError = function(e:Event):void { failure(e, o, timer); };
            if (timer) {
                httpTimeout = function(e:TimerEvent):void { timeout(e, o.id); };
            }
        }

        private function addListeners(loader:IEventDispatcher, timer:IEventDispatcher):void  {
            loader.addEventListener(Event.COMPLETE, httpComplete);
            loader.addEventListener(IOErrorEvent.IO_ERROR, httpError);
            loader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, httpError);
            if (timer) {
                timer.addEventListener(TimerEvent.TIMER_COMPLETE, httpTimeout);
            }
        }

        private function removeListeners(id:uint):void {
            loaderMap[id].c.removeEventListener(Event.COMPLETE, httpComplete);
            loaderMap[id].c.removeEventListener(IOErrorEvent.IO_ERROR, httpError);
			loaderMap[id].c.removeEventListener(SecurityErrorEvent.SECURITY_ERROR, httpError);
            if (loaderMap[id].t) {
                loaderMap[id].t.removeEventListener(TimerEvent.TIMER_COMPLETE, httpTimeout);
            }
        }

        private function start(o:Object, timer:Timer):void {
            if (timer) {
                timer.start();
            }
            loaderMap[o.id].readyState = 2;
            dispatch(['start', o, null]);
        }

        private function success(e:Event, o:Object, timer:Timer):void {
            o.c = { responseText: encodeURI(e.target.data) };
            loaderMap[o.id].readyState = 4;
            if (timer && timer.running) {
                timer.stop();
            }

            dispatch(['success', o]);
            destroy(o.id);
        }

        private function failure(e:Event, o:Object, timer:Timer):void {
            loaderMap[o.id].readyState = 4;
            if (timer && timer.running) {
                timer.stop();
            }

            if (e is IOErrorEvent) {
                o.c = { status: 0, statusText: e.type };
            }
			else if (e is SecurityErrorEvent) {
				o.c = { status: 0, statusText: 'Security Violation.' };
			}

            dispatch([e is TimerEvent ? 'timeout' : 'failure', o]);
            destroy(o.id);
        }

        public function abort(id:uint):void {
            loaderMap[id].c.close();
            if (loaderMap[id].t && loaderMap[id].t.running) {
                loaderMap[id].t.stop();
            }

            dispatch(['abort', { id: id }]);
            destroy(id);
        }

        public function isInProgress(id:uint):Boolean {
            if (loaderMap[id]) {
                return loaderMap[id].readyState !== 4;
            }
            else {
                return false;
            }
        }

        private function timeout(e:TimerEvent, id:uint):void {
            loaderMap[id].c.close();
            dispatch(['timeout', { id: id }]);
            destroy(id);
        }

        private function destroy(id:uint):void {
            removeListeners(id);
            delete loaderMap[id];
        }

        private function dispatch(a:Object):void {
            ExternalInterface.call('YUI.applyTo', vars.yid, 'io.xdrResponse', a);
        }

        private function setRequestHeaders(request:URLRequest, headers:Object):void {
            var header:URLRequestHeader,
                prop:String;

            for (prop in headers) {
                header = new URLRequestHeader(prop, headers[prop]);
                request.requestHeaders.push(header);
            }
        }
    }
}
