package com.yahoo.util
{
	import flash.display.Stage;
	import flash.display.DisplayObject;
	import flash.external.ExternalInterface;
	import flash.utils.getDefinitionByName;
	import com.adobe.serialization.json.JSON;
	import flash.events.Event;
	import flash.events.IEventDispatcher;

	public class YUIBridge extends Object
	{
		/**
		 * Constructor
		 */
		public function YUIBridge(stage:Stage)
		{
			this._stage = stage;
			this.initializeBridge();
		}
		
		/**
		 * @private
		 */
		private var _classHash:Object = {};

		/**
		 * @private
		 */
		private var _stage:Stage;

		/**
		 * @private 
		 * Storage for flashvars
		 */
		private var _flashvars:Object;
		
		/**
		 * Reference to the loaderInfo parameters of the application
		 */
		public function get flashvars():Object
		{
			return this._flashvars;
		}
		
		/**
		 * @private
		 */
		private var _jsHandler:String;
		
		/**
		 * @private
		 */
		private var _swfID:String;

		/**
		 * @private
		 */
        private var _appname:String;

		/**
		 * @private
		 */
		private var _yId:String;
		
		/**
		 * @private
		 */
		private var _instances:Object = {};

		/**
		 * Performs a function on an object.
		 * @param instanceId Reference to the object in which the method will be called
		 * @param method Reference to the function that will be called
		 * @param params Arguments to passed to the function
		 */
		public function applyMethod(instanceId:String, method:String, params:Array = null):*
		{
            var func:Function,
                chainArray:Array,
                chain:Object,
                i:int,
                len:int;
            if(params) params = this.parseArgs(params);
            if(method.indexOf(".") > -1)
            {
                chainArray = method.split(".");
                chain = this._instances[instanceId];
                len = chainArray.length;
                for(i = 0; i < len; ++i)
                {
                    chain = chain[chainArray[i]];
                }
                func = chain as Function;
            }
            else
            {
                if(!this._instances[instanceId][method])
                {
                    return;
                }
                func = this._instances[instanceId][method] as Function;
            }
            if(params)
            {
                return func.apply(this._instances[instanceId], params);
            }
            return func.apply(this._instances[instanceId]);
		}

		/**
		 * Creates an instance of a specified class.
		 */
		public function createInstance(instanceId:String, className:String, constructorArguments:Array = null) : void 
		{
            var cA:Array = constructorArguments ? constructorArguments : [];
			var classReferenceObject:Object = this.getClass(className);
			var instance:Object;

			cA = this.parseArgs(cA);
		
			if(classReferenceObject is Class)
			{
				var classReference:Class = classReferenceObject as Class;
				switch (cA.length) 
				{
					default: instance = new classReference(); break;
					case 1: instance = new classReference(cA[0]); break;
					case 2: instance = new classReference(cA[0], cA[1]); break;
					case 3: instance = new classReference(cA[0], cA[1], cA[2]); break;
					case 4: instance = new classReference(cA[0], cA[1], cA[2], cA[3]); break;
					case 5: instance = new classReference(cA[0], cA[1], cA[2], cA[3], cA[4]); break;
					case 6: instance = new classReference(cA[0], cA[1], cA[2], cA[3], cA[4], cA[5]); break;
					case 7: instance = new classReference(cA[0], cA[1], cA[2], cA[3], cA[4], cA[5], cA[6]); break;
					case 8: instance = new classReference(cA[0], cA[1], cA[2], cA[3], cA[4], cA[5], cA[6], cA[7]); break;
					case 9: instance = new classReference(cA[0], cA[1], cA[2], cA[3], cA[4], cA[5], cA[6], cA[7], cA[8]); break;
					case 10: instance = new classReference(cA[0], cA[1], cA[2], cA[3], cA[4], cA[5], cA[6], cA[7], cA[8], cA[9]); break;
					case 11: instance = new classReference(cA[0], cA[1], cA[2], cA[3], cA[4], cA[5], cA[6], cA[7], cA[8], cA[9], cA[10]); break;
					case 12: instance = new classReference(cA[0], cA[1], cA[2], cA[3], cA[4], cA[5], cA[6], cA[7], cA[8], cA[9], cA[10], cA[11]); break;
					case 13: instance = new classReference(cA[0], cA[1], cA[2], cA[3], cA[4], cA[5], cA[6], cA[7], cA[8], cA[9], cA[10], cA[11], cA[12]); break;
				}
			}
			else
			{
				var classFunction:Function = classReferenceObject as Function;
				instance = classFunction.apply(this, cA);
			}
			
			_instances[instanceId] = instance;
		}

		/**
		 * Returns a class instance based on a key value
		 */
		public function getInstance(instanceId:String) : * 
		{
			if (_instances.hasOwnProperty(instanceId)) 
			{
				return _instances[instanceId];
			}
			else 
			{
				return null;
			}
		}
	
		/**
		 * Adds an object to the hash of instances
		 */
		public function setInstance(instanceId:String, value:*):void
		{
			this._instances[instanceId] = value;
		}

		/**
		 * Exposes a method to the host DOM
		 */
		public function exposeMethod(instanceId:String, methodName:String, exposedName:String = "") : void 
		{
			exposedName == "" ? exposedName = methodName : exposedName = exposedName;
			
			if (_instances[instanceId] && ExternalInterface.available) 
			{
				ExternalInterface.addCallback(exposedName, _instances[instanceId][methodName]);
			}
		}
		
		/**
		 * Returns the value of a class property
		 * 
		 * @param instanceId key used to look up the value of a class instance
		 * @param propertyName the name of the property whose value is protected
		 */
		public function getProperty (instanceId:String, propertyName:String) : Object 
		{
			if (_instances[instanceId] && _instances[instanceId].hasOwnProperty(propertyName)) 
			{
				return _instances[instanceId][propertyName];
			}
			else 
			{
				return null;
			}
		}
		
		/**
		 * Sets the value for a property on a class instance
		 *
		 * @param instanceId key used to look up the class instance whose property is to be changed
		 * @param propertyName name of the property to be changed
		 * @propertyValue value to be set
		 */
		public function setProperty (instanceId:String, propertyName:String, propertyValue:Object) : void 
		{
			if (_instances.hasOwnProperty(instanceId) && _instances[instanceId].hasOwnProperty(propertyName)) 
			{
				_instances[instanceId][propertyName] = propertyValue;
			}
		}

		/**
		 * Exposes methods to the host DOM
		 */
		public function addCallbacks (callbacks:Object) : void 
		{
			if (ExternalInterface.available) 
			{
				for (var callback:String in callbacks) 
				{
					ExternalInterface.addCallback(callback, callbacks[callback]);
				}
				sendEvent({type:"swfReady"});
			}
		}

		/**
		 * Dispatches events to the host DOM
		 */
		public function sendEvent (evt:Object, id:String = null) : void 
		{
			if(!id)
			{
				id = this._appname || this._swfID;
			}
			if (ExternalInterface.available) 
			{
                ExternalInterface.call("YUI.applyTo", _yId, _jsHandler, [id, evt]);
			}
		}

		/**
		 * Allows for js class to subscribe to an as class' event
		 */
		public function subscribe(type:String, instanceId:String):void
		{
			var dispatcher:IEventDispatcher = this._instances[instanceId] as IEventDispatcher,
				callback:Function = this.eventHandlerFactory.call(this, instanceId);
			dispatcher.addEventListener(type, callback);
		}

		/**
		 * Adds a js function reference as a listener to an event dispatcher.
		 */
		public function eventHandlerFactory(instanceId:String):Function
		{
			var scope:Object = this,
				handler:Function = function(event:Event):void
			{
				var evt:Object = {};
				evt.type = event.type;
				scope.sendEvent(evt, instanceId);
			}
			return handler;
		}
		
		/**
		 * Adds classes to the class hash
		 */
		public function addClasses(value:Object):void
		{
			for(var i:String in value) 
			{
				this._classHash[i] = value[i];
			}
		}

		/**
		 * Parses string for class instances.
		 * @param value Reference key from <code>_instances</code> hash.
		 * @return *
		 */
		public function parseInstances(value:String):*
		{
			if(value.substr(0, 1) == "$")
			{
				return this.getInstance(value.substr(1));
			}
			return value;
		}
		
		/**
		 * Parses array items for class instance references.
		 */
		public function parseCollections(value:Array):Array
		{
			var i:int,
				len:int = value.length,
				key:String,
				keyvalue:Object,
				obj:Object,
				collection:Array = [],
				hash:Object;
			for(i = 0; i < len; ++i)
			{
				obj = value[i];
				if(obj is Array)
				{
					collection.push(this.parseCollections(obj as Array));
				}
				else if(obj is String)
				{
					collection.push(this.parseInstances(obj as String));
				}
				else
				{
					hash = {};
					for(key in obj)
					{
						if(obj.hasOwnProperty(key))
						{
							keyvalue = obj[key];
							if(keyvalue is String)
							{
								hash[key] = this.parseInstances(keyvalue as String);
							}
							else
							{
								hash[key] = keyvalue;
							}
						}
					}
					collection.push(hash);
				}
			}
			return collection;
		}

		/**
		 * Parses object literals for instance references.
		 */
		public function parseHash(value:Object):Object
		{
			var key:String,
				keyvalue:Object;
			for(key in value)
			{
				if(value.hasOwnProperty(key))
				{
					keyvalue = value[key];
					if(keyvalue is String)
					{
						value[key] = this.parseInstances(keyvalue as String);
					}
					else if(keyvalue is Array)
					{
						value[key] = this.parseCollections(keyvalue as Array);
					}
					else
					{
						value[key] = this.parseHash(keyvalue);
					}
				}
			}
			return value;
		}

		/**
		 * @private (protected)
		 */
		protected function initializeBridge():void
		{
			if(this._stage.loaderInfo.parameters) this._flashvars = this._stage.loaderInfo.parameters;

			if (this._flashvars.hasOwnProperty("yId") && this._flashvars.hasOwnProperty("YUIBridgeCallback") && ExternalInterface.available) 
			{
				_jsHandler = this._flashvars["YUIBridgeCallback"];
				_swfID = this._flashvars["YUISwfId"];
				_yId = this._flashvars["yId"];
                _appname = this._flashvars["appname"];
			}
			
			ExternalInterface.addCallback("createInstance", createInstance);
			ExternalInterface.addCallback("applyMethod", applyMethod);
			ExternalInterface.addCallback("exposeMethod", exposeMethod);
			ExternalInterface.addCallback("getProperty", getProperty);
			ExternalInterface.addCallback("setProperty", setProperty);
			ExternalInterface.addCallback("subscribe", subscribe);
		}

		/**
		 * @private
		 */
		private function parseArgs(args:Array):Array
		{
			var first:String,
				i:int,
				len:int = args.length,
				arg:String;
			for (i = 0; i < len; ++i) 
			{
				if (args[i] is String)
				{
					arg = args[i] as String;
					first = arg.substr(0, 1);
					if(first == "$") 
					{
						args[i] = getInstance(arg.substr(1));
					}
					else if(first == "[" || first == "{")
					{
						args[i] = JSON.decode(arg); 
					}
				}
			}
			return args;
		}

		/**
		 * @private
		 */
		private function getClass(value:String):Object
		{
			if(this._classHash.hasOwnProperty(value)) 
			{
				return this._classHash[value];
			}
			return getDefinitionByName(value);
		}
	}
}
