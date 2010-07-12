/**
 * Upload files to the server with support for file filtering, multiple file uploads
 * and progress tracking.
 * @module uploader
 */
	
var Event = Y.Event;
var Node = Y.Node;
		
		/**
		 * The Uploader widget is a tool for uploading files to the server.
		 * @module uploader
		 * @title Uploader
		 * @requires swf, node, event
		 * @namespace YAHOO.widget
		 */

		/**
		 * Creates the Uploader instance and keeps the initialization data
		 *
		 * @class Uploader
		 * @augments Y.Event.Target
		 * @constructor
		 * @param {String|HTMLElement} id The id of the element, or the element itself that the Uploader
		 * will be placed into. The width and height of the Uploader will be set to the width and height 
		 * of this container element.
		 * @param {Object} p_oAttributes (optional) Configuration parameters for the Uploader.
		 */
				
function uploader (config /*Object*/) {
	
	uploader.superclass.constructor.apply(this, arguments);
	
	var p_oElement = config["p_oElement"];
	var p_oAttributes = config["p_oAttributes"]||{};
	
	this._id = Y.guid("uploader");
	var _id = this._id;
    var oElement = Node.one(p_oElement);


	
	var params = {version: "10.0.45",
	          	useExpressInstall: true,
	          	fixedAttributes: {allowScriptAccess:"always", allowNetworking:"all", scale: "noscale"},
	            flashVars: {}};

	if (p_oAttributes.hasOwnProperty("buttonSkin")) {
		params.flashVars["buttonSkin"] = p_oAttributes["buttonSkin"];
	}
	if (p_oAttributes.hasOwnProperty("transparent") && p_oAttributes["transparent"]) {
		params.fixedAttributes["wmode"] = "transparent";
	}
	
    this.uploaderswf = new Y.SWF(oElement, p_oAttributes.hasOwnProperty("swfURL")?p_oAttributes["swfURL"]:"assets/uploader.swf", params);
	this.uploaderswf.on ("swfReady", Y.bind(this._initializeUploader, this));
	this.uploaderswf.on ("click", Y.bind(this._relayEvent, this));
	this.uploaderswf.on ("fileselect", Y.bind(this._relayEvent, this));
	this.uploaderswf.on ("mousedown", Y.bind(this._relayEvent, this));
	this.uploaderswf.on ("mouseup", Y.bind(this._relayEvent, this));
	this.uploaderswf.on ("mouseleave", Y.bind(this._relayEvent, this));
	this.uploaderswf.on ("mouseenter", Y.bind(this._relayEvent, this));
	this.uploaderswf.on ("uploadcancel", Y.bind(this._relayEvent, this));
	this.uploaderswf.on ("uploadcomplete", Y.bind(this._relayEvent, this));
	this.uploaderswf.on ("uploadcompletedata", Y.bind(this._relayEvent, this));
	this.uploaderswf.on ("uploaderror", Y.bind(this._relayEvent, this));
	this.uploaderswf.on ("uploadprogress", Y.bind(this._relayEvent, this));
	this.uploaderswf.on ("uploadstart", Y.bind(this._relayEvent, this));
	
};


Y.extend(uploader, Y.Base, {
	
	uploaderswf:null,

	removeFile : function (fileID /*String*/) {
		return this.uploaderswf.callSWF("removeFile", [fileID]);
	},
	
	clearFileList : function () {
		return this.uploaderswf.callSWF("clearFileList", []);
	},

	upload : function (fileID /*String*/, url /*String*/, method /*String*/, postVars /*Object*/, postFileVarName /*String*/) {
	    if (Y.Lang.isArray(fileID)) {
			return this.uploaderswf.callSWF("uploadThese", [fileIDs, url, method, postVars, postFileVarName]);
		}
		else if (Y.Lang.isString(fileID)) {
			return this.uploaderswf.callSWF("upload", [fileID, url, method, postVars, postFileVarName]);
			
		}
	},
	
	uploadThese : function (fileIDs /*Array*/, url /*String*/, method /*String*/, postVars /*Object*/, postFileVarName /*String*/) {
		return this.uploaderswf.callSWF("uploadThese", [fileIDs, url, method, postVars, postFileVarName]);
	},
	
	uploadAll : function (url /*String*/, method /*String*/, postVars /*Object*/, postFileVarName /*String*/) {
		return this.uploaderswf.callSWF("uploadAll", [url, method, postVars,postFileVarName]);
	},
	
	cancel : function (fileID /*String*/) {
		return this.uploaderswf.callSWF("cancel", [fileID]);
	},

	setAllowLogging : function (value /*Boolean*/) {
		this.uploaderswf.callSWF("setAllowLogging", [value]);
	},

	setAllowMultipleFiles : function (value /*Boolean*/) {
		this.uploaderswf.callSWF("setAllowMultipleFiles", [value]);
	},

	setSimUploadLimit : function (value /*int*/) {
		this.uploaderswf.callSWF("setSimUploadLimit", [value]);
	},
	
	setFileFilters : function (fileFilters /*Array*/) {
		this.uploaderswf.callSWF("setFileFilters", [fileFilters]);
	},
	
	enable : function () {
		this.uploaderswf.callSWF("enable");
	},
	
	disable : function () {
		this.uploaderswf.callSWF("disable");
	},

	/**
	 * @private
	 * Called when the uploader SWF is initialized
	 * @method _initializeUploader
	 * @param event {Object} The event to be propagated from Flash.
	 */
	_initializeUploader: function (event) {
		    Y.log("Initializing uploader...");
			this.publish("uploaderReady", {fireOnce:true});
	     	this.fire("uploaderReady", {});
	},

	/**
	 * @private
	 * Called when an event is dispatched from Uploader
	 * @method _relayEvent
	 * @param event {Object} The event to be propagated from Flash.
	 */	
	_relayEvent: function (event) {
		    Y.log("Firing event...");
		    Y.log(event.type);
		    this.fire(event.type, event);
	},
	
	toString: function()
	{
		return "Uploader " + this._id;
	}

},
{
	ATTRS: {
		log: {
			value: false,
			setter : "setAllowLogging"
		},
		multiFiles : {
			value: false,
			setter : "setAllowMultipleFiles"
		},
		simLimit : {
			value: 2,
			setter : "setSimUploadLimit"
		},
		fileFilters : {
			value: [],
			setter : "setFileFilters"
		}
	}
}
);
Y.uploader = uploader;