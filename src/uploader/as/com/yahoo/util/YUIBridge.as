package com.yahoo.util
 {
		import flash.display.Stage;
		import flash.external.ExternalInterface;
		import flash.utils.getDefinitionByName;
	    import flash.system.Security;
		
		public class YUIBridge extends Object
		{
			public var flashvars:Object;
			private var _jsHandler:String;
			private var _swfID:String;
			private var _yId:String;
			
			private var _stage:Stage;
			
			private var _instances:Object = {};
	
			public function YUIBridge(stage:Stage)
			{
                _stage = stage;
				flashvars = _stage.loaderInfo.parameters;
				
				if (flashvars["yId"] && flashvars["YUIBridgeCallback"] && flashvars["YUISwfId"] && ExternalInterface.available) {
					_jsHandler = flashvars["YUIBridgeCallback"];
					_swfID = flashvars["YUISwfId"];
					_yId = flashvars["yId"];
				}
			    
                if(flashvars.hasOwnProperty("allowedDomain"))
                {
                    Security.allowDomain(flashvars.allowedDomain);
                }
                
				ExternalInterface.addCallback("createInstance", createInstance);
				ExternalInterface.addCallback("exposeMethod", exposeMethod);
				ExternalInterface.addCallback("getProperty", getProperty);
				ExternalInterface.addCallback("setProperty", setProperty);
				
			}

			public function createInstance(instanceId:String, className:String, constructorArguments:Array = null) : void {
				
				constructorArguments == null ? constructorArguments = [] : constructorArguments = constructorArguments;
				
				var cA:Array = constructorArguments;
				var classReference:Class = getDefinitionByName(className) as Class;
				
				var instance:Object;

				switch (cA.length) {
				default: instance = new classReference();
				case 1: instance = new classReference(cA[0]);
				case 2: instance = new classReference(cA[0], cA[1]);
				case 3: instance = new classReference(cA[0], cA[1], cA[2]);
				case 4: instance = new classReference(cA[0], cA[1], cA[2], cA[3]);
				case 5: instance = new classReference(cA[0], cA[1], cA[2], cA[3], cA[4]);
				case 6: instance = new classReference(cA[0], cA[1], cA[2], cA[3], cA[4], cA[5]);
				case 7: instance = new classReference(cA[0], cA[1], cA[2], cA[3], cA[4], cA[5], cA[6]);
				case 8: instance = new classReference(cA[0], cA[1], cA[2], cA[3], cA[4], cA[5], cA[6], cA[7]);
				case 9: instance = new classReference(cA[0], cA[1], cA[2], cA[3], cA[4], cA[5], cA[6], cA[7], cA[8]);
				case 10: instance = new classReference(cA[0], cA[1], cA[2], cA[3], cA[4], cA[5], cA[6], cA[7], cA[8], cA[9]);
				case 11: instance = new classReference(cA[0], cA[1], cA[2], cA[3], cA[4], cA[5], cA[6], cA[7], cA[8], cA[9], cA[10]);
				case 12: instance = new classReference(cA[0], cA[1], cA[2], cA[3], cA[4], cA[5], cA[6], cA[7], cA[8], cA[9], cA[10], cA[11]);
				case 13: instance = new classReference(cA[0], cA[1], cA[2], cA[3], cA[4], cA[5], cA[6], cA[7], cA[8], cA[9], cA[10], cA[11], cA[12]);
				}

				_instances[instanceId] = instance;	
			}
			
			public function exposeMethod(instanceId:String, methodName:String, exposedName:String = "") : void {
				exposedName == "" ? exposedName = methodName : exposedName = exposedName;
				
				if (_instances[instanceId] && ExternalInterface.available) {
					ExternalInterface.addCallback(exposedName, _instances[instanceId][methodName]);
				}
			}
			
			public function getProperty (instanceId:String, propertyName:String) : Object {
				if (_instances[instanceId] && _instances[instanceId].hasOwnProperty(propertyName)) {
					return _instances[instanceId][propertyName];
				}
				else {
					return null;
				}
			}
			
			public function setProperty (instanceId:String, propertyName:String, propertyValue:Object) : void {
				if (_instances[instanceId] && _instances[instanceId].hasOwnProperty(propertyName)) {
					_instances[instanceId][propertyName] = propertyValue;
				}
			}

			public function addCallbacks (callbacks:Object) : void {
				this.log("Running addCallbacks. Is ExternalInterface available?");
					if (ExternalInterface.available) {
						for (var callback:String in callbacks) {
							trace("Added callback for " + callback + ", function " + callbacks[callback]);
		 					ExternalInterface.addCallback(callback, callbacks[callback]);
		 				}
		 				sendEvent({type:"swfReady"});
		 			}
				}

			public function sendEvent (evt:Object) : void {
					if (ExternalInterface.available) {				
						ExternalInterface.call("YUI.applyTo", _yId, _jsHandler, [_swfID, evt]);
					}

			}
			
			public function log (message : String) : void {
				if (ExternalInterface.available) {
					ExternalInterface.call("console.log", message);
				}
			}		
		}
	}
