YUI.add('progressbar', function(Y) {

/**
 *
 * @module progressbar
 * @requires widget
 * @optional animation
 * @title ProgressBar Widget
 */

var PB			= 'progressbar',
	MASK		= 'mask',
	BAR			= 'bar',
	TL 			= 'tl',
	TR			= 'tr',
	BL			= 'bl',
	BR			= 'br',

	BOUNDING_BOX = 	'boundingBox',
	CONTENT_BOX = 'contentBox',
	// Configuration attributes
	WIDTH = 'width',
	HEIGHT = 'height',
	MIN_VALUE = 'minValue',
	MAX_VALUE = 'maxValue',
	VALUE = 'value',
	ANIM = 'anim',
	DIRECTION = 'direction',
	DIRECTION_LTR = 'ltr',
	DIRECTION_RTL = 'rtl',
	DIRECTION_TTB = 'ttb',
	DIRECTION_BTT = 'btt',
	BAR_EL = 'barEl',
	MASK_EL = 'maskEl',
	ARIA_TEXT_TEMPLATE = 'ariaTextTemplate',
	
	// Events
	START = 'start',
	PROGRESS = 'progress',
	END = 'end',

	getCN		= Y.ClassNameManager.getClassName,

	C_MASK		= getCN(PB,MASK),
	C_BAR       = getCN(PB,BAR),
	C_TL        = getCN(PB,TL),
	C_TR        = getCN(PB,TR),
	C_BL        = getCN(PB,BL),
	C_BR        = getCN(PB,BR),
	C_ANIM      = getCN(PB,ANIM),


	
	BAR_MARKUP = '<div class="' + C_BAR + '"></div>',
	MASK_MARKUP = ['<div class="',
		C_MASK,
		'"><div class="',
		C_TL,
		'"></div><div class="',
		C_TR,
		'"></div><div class="',
		C_BL,
		'"></div><div class="',
		C_BR,
		'"></div></div>'
	].join(''),
	
	L = Y.Lang,
	PX = 'px';

/**
 * The ProgressBar widget provides an easy way to draw a bar depicting progress of an operation,
 * a level meter, rating or any such simple linear measure.
 * It allows for highly customized styles including animation, vertical or horizontal and forward or reverse.

 * @class ProgressBar
 * @extends Widget
 * @param oConfigs {object} An object containing any configuration attributes to be set 
 * @constructor
 */     
var ProgressBar = function() {

	ProgressBar.superclass.constructor.apply(this, arguments);
};

Y.mix(ProgressBar,{
    /**
     * The identity of the widget.
     *
     * @property ProgressBar.NAME
     * @type String
     * @static
     */
	NAME:'progressbar',
    /**
     * Static property used to define the default attribute configuration of
     * the Widget.
     *
     * @property ProgressBar.ATTRS
     * @type Object
     * @protected
     * @static
     */
	ATTRS : {

		/**
         * Reference to the moving bar element. Written once on instantiation.
         *
         * @attribute barEl
         * @type Node
         * @default reference to Node
         * @writeOnce
         */
		barEl: {
			writeOnce: true
		},

		/**
         * Reference to the mask element. Written once on instantiation.
         *
         * @attribute maskEl
         * @type Node
         * @default reference to Node
         * @writeOnce
         */
		maskEl: {
			writeOnce: true
		},

		/**
		 * @attribute direction
		 * @description Direction of movement of the bar.  
		 *    It can be any of 'ltr' (left to right), 'rtl' (the reverse) , 'ttb' (top to bottom) or 'btt'.
		 *    Can only be set before rendering, read only after rendering.
		 * @default 'ltr'
		 * @type String (any of "ltr", "rtl", "ttb" or "btt")
		 */			
		direction: {
			value:DIRECTION_LTR,
			lazyAdd:false,
			validator: function (value) {
				return this._validateDirectionAtt(value);
			}
		},

		/**
		 * @attribute maxValue
		 * @description Represents the top value for the bar. 
		 *   The bar will be fully extended when reaching this value.  
		 *   Values higher than this will be ignored. 
		 * @default 100
		 * @type Number
		 */				    
		maxValue: {
			value: 100,
			validator: function (value) {
				return this._validateMaxValueAtt(value);
			}
		},
		
		/**
		 * @attribute minValue
		 * @description Represents the lowest value for the bar. 
		 *   The bar will be totally collapsed when reaching this value.  
		 *    Values lower than this will be ignored. 
		 * @default 0
		 * @type Number
		 */				
		minValue: {
			value: 0,
			validator: function (value) {
				return this._validateMinValueAtt(value);
			}
		},

		/**
		 * @attribute ariaTextTemplate 
		 * @description Text to be voiced by screen readers.
		 *     The text is processed by <a href="YAHOO.lang.html#method_substitute">YAHOO.lang.substitute</a>.  
		 *     It can use the placeholders {value}, {minValue} and {maxValue}
		 * @default "{value}"
		 * @type String
		 */				
		ariaTextTemplate: {
			value:'{value}'
		},
		
		/**
		 * @attribute value
		 * @description The value for the bar.  
		 *     Valid values are in between the minValue and maxValue attributes.
		 * @default 0
		 * @type Number
		 */			
		value: {
			value: 0,
			validator: function (value) {
				return this._validateValueAtt(value);
			}
		},
		
		/**
		 * @attribute anim
		 * @description It accepts either a boolean (recommended) or an instance of <a href="Anim.html">Anim</a>.
		 *   If a boolean, it will enable/disable animation creating its own instance of the animation utility.  
		 *   If given an instance of <a href="Anim.html">Anim</a> it will use that instance.
		 *   The optional <a href="Anim.html">animation</a> utility needs to be loaded.
		 *   When read, it returns the instance of the animation utility in use or null if none.  
		 *   It can be used to set the animation parameters such as easing methods or duration.
		 * @default null
		 * @type {boolean} or {instance of Anim}
		 */						
		anim: {
			value: null,
			lazyAdd:false,
			setter: function(value) {
				return this._setAnimAtt(value);
			}
		}
	}

});

Y.extend(ProgressBar, Y.Widget, {
	_previousValue: 0,
	_tweenFactor: 1,
	_barFactor: 1,
	_barSpace: 0,

    /**
     * Construction logic executed during ProgressBar instantiation. 
	 * Publishes custom events start, progress and end
     *
     * @method initializer
     * @protected
     */
	initializer: function  (config) {
	

        /**
         * Signals the beginning of the movement of the bar.  
         * Payload includes the starting value of the ProgressBar.
         *
         * @event start
         * @param event {Event.Facade} An Event Facade object with the following attribute specific property added:
         *  <dl>
         *      <dt>value</dt>
         *          <dd>the value at the start of the movement</dd>
         *  </dl>
         */
		this.publish(START);
        /**
         * Fires several times during the movement of the bar.  
         * Payload includes the current instantaneous value of the ProgressBar.
		 * It will fire at least once, even with animation disabled, at the end of the movement.
         *
         * @event start
         * @param event {Event.Facade} An Event Facade object with the following attribute specific property added:
         *  <dl>
         *      <dt>value</dt>
         *          <dd>the value at the instant the event is fired</dd>
         *  </dl>
         */
		this.publish(PROGRESS);
        /**
         * Signals the completion of the movement of the bar.  
         * Payload includes the end value of the ProgressBar.
         *
         * @event start
         * @param event {Event.Facade} An Event Facade object with the following attribute specific property added:
         *  <dl>
         *      <dt>value</dt>
         *          <dd>the value at the end of the movement</dd>
         *  </dl>
         */
		this.publish(END);
	},
	
    /**
     * Create the DOM structure for the ProgressBar.
     *
     * @method renderUI
     * @protected
     */
	renderUI: function () {
		
		var cb   = this.get(CONTENT_BOX),
			bb   = this.get(BOUNDING_BOX);
		cb.addClass(getCN(PB,this.get(DIRECTION)));
		this.set(BAR_EL, cb.appendChild(Y.Node.create(BAR_MARKUP)));
		this.set(MASK_EL, cb.appendChild(Y.Node.create(MASK_MARKUP)));
		if (this.get(WIDTH) === "") {
			this.set(WIDTH, bb.getStyle(WIDTH));
		}
		if (this.get(HEIGHT) === "") {
			this.set(HEIGHT, bb.getStyle(HEIGHT));
		}
				
		bb.setAttrs({
			role:'progressbar',
			'aria-valuemin':this.get(MIN_VALUE),
			'aria-valuemax':this.get(MAX_VALUE)
		});
		this._previousValue = this.get(VALUE);
		this._animChange(this.get(ANIM));
		
	},
	
    /**
     * Sets the listeners so the changes in the attribute values
	 * are reflected in the DOM structure.
     *
     * @method bindUI
     * @protected
     */
	bindUI: function () {
		this.after('valueChange', this._afterValueChange);
		this.after('minValueChange', this._afterMinValueChange);
		this.after('maxValueChange', this._afterMaxValueChange);
		this.after('animChange', this._afterAnimChange);
	},
	
    /**
     * Synchronizes the DOM state with the attribute settings, 
     * most notably value, ProgressBar dimensions and range values. 
	 * Recalculates several auxiliary values to speed up later processing.
     *
     * @method syncUI
     */	
	syncUI: function() {
		this._fixEdges();
		this._recalculateConstants();
		this._moveBarEl(this.get(VALUE),true);
	},
	
	/**
	 * Listener for the change in minValue event.
     * If the current value is less than the newly set minValue, 
	 * it adjusts it to keep it in range.
	 * Sets the <code>aria-valuemin</code> attribute 
	 * and adjusts the DOM to the new range.
     *
     * @method _afterMinValueChange
     * @param ev {Event} minValueChange custom event
     * @protected
     */
	_afterMinValueChange: function(ev) {
		var minValue = ev.newVal;
		if (this.get(VALUE) < minValue) {this.set(VALUE, minValue);}
		this.get(BOUNDING_BOX).setAttribute('aria-valuemin', minValue);
		this.syncUI();
	},

	/**
	 * Listener for the change in maxValue event.
     * If the current value is greater than the newly set maxValue, 
	 * it adjusts it to keep it in range.
	 * Sets the <code>aria-valuemax</code> attribute 
	 * and adjusts the DOM to the new range.
     *
     * @method _afterMaxValueChange
     * @param ev {Event} maxValueChange custom event
     * @protected
     */
	_afterMaxValueChange: function(ev) {
		var maxValue = ev.newVal;
		if (this.get(VALUE) > maxValue) { this.set(VALUE, maxValue); }
		this.get(BOUNDING_BOX).setAttribute('aria-valuemax', maxValue);
		this.syncUI();
	},

	/**
	 * Listener for the change in value event.
     * Calls the <a href="#method__moveBarEl">_moveBarEl</a> method.
     *
     * @method _afterValueChange
     * @param ev {Event} valueChange custom event
     * @protected
     */
	_afterValueChange: function (ev) {
		this._moveBarEl(ev.newVal);
	},
	
	/**
	 * Moves the bar element to the size representing the value given.
	 * Sets the ARIA attributes.
	 * Stops any currently active animation and starts anew.  May skip over animation if so requested.
	 * Fires the <a href="#event_start">start</a> event.
	 * Prepares several auxiliary values and branches off to the corresponding 
	 * <a href="#property__barSizeFunctions">_barSizeFunctions</a> depending on direction and whether animation is active.
     *
     * @method _moveBarEl
     * @param value {number} value to be represented by the bar
	 * @param noAnim {boolean} (optional) move without animating
     * @protected
     */
	_moveBarEl: function (value, noAnim) {
		this._setAriaText(value);
		var pixelValue = Math.floor((value - this.get(MIN_VALUE)) * this._barFactor),
			anim = this.get(ANIM);
		if (anim && anim.get('running')) {
			anim.stop();
		}
		this.fire(START,{value:this._previousValue});
		ProgressBar._barSizeFunctions[(!noAnim && anim)?1:0][this.get(DIRECTION)].call(this, value, pixelValue, this.get(BAR_EL), anim);
	},
	
	/**
	 * Cleans all resources taken by the ProgressBar.
	 * Stops any running animation, destroys and cleans the animation object, if any,
	 * unsubscribes from any events and destroys the DOM elements created.
     *
     * @method destructor
     * @protected
     */
	destructor: function() {
		var anim = this.get(ANIM);
		anim.stop();
		anim.destroy();
		this.set(ANIM,false);
		this.unsubscribeAll();
		var el = this.get(BOUNDING_BOX),
			parent = el.get('parentNode');
		if (parent) { parent.removeChild(el); }

	},
	/**
	 * Calculates <a href="#property__barSpace">_barSpace</a> and <a href="#property__barFactor">_barFactor</a> 
	 * to speed up later calculations.
     *
     * @method _recalculateConstants
     * @private
     */
	_recalculateConstants: function() {
		var barEl = this.get(BAR_EL);
		switch (this.get(DIRECTION)) {
			case DIRECTION_LTR:
			case DIRECTION_RTL:
				this._barSpace = parseInt(this.get(WIDTH),10) - 
					(parseInt(barEl.getStyle('marginLeft'),10) || 0) - 
					(parseInt(barEl.getStyle('marginRight'),10) || 0); 
				break;
			case DIRECTION_TTB:
			case DIRECTION_BTT:
				this._barSpace = parseInt(this.get(HEIGHT),10) - 
					(parseInt(barEl.getStyle('marginTop'),10) || 0) - 
					(parseInt(barEl.getStyle('marginBottom'),10) || 0); 
				break;
		}
		this._barFactor = this._barSpace / (this.get(MAX_VALUE) - (this.get(MIN_VALUE) || 0)) || 1;
	},
	/** 
	 * Due to rounding differences, some browsers fail to cover the whole area 
	 * with the mask quadrants when the width or height is odd.  This method
	 * stretches the lower and/or right quadrants to make up for the difference.
	 * @method _fixEdges
	 * @private
	 */
	_fixEdges:function() {
		if (!this.get('rendered') || Y.UA.ie || Y.UA.gecko ) { return; }
		var maskEl = this.get(MASK_EL),
			tlEl = maskEl.one('.' + C_TL)[0],
			trEl = maskEl.one('.' + C_TR)[0],
			blEl = maskEl.one('.' + C_BL)[0],
			brEl = maskEl.one('.' + C_BR)[0],
			newSize = (parseInt(maskEl.getStyle(HEIGHT),10) -
			parseInt(tlEl.getStyle(HEIGHT),10)) + PX;
			
		blEl.setStyle(HEIGHT,newSize);
		brEl.setStyle(HEIGHT,newSize);
		newSize = (parseInt(maskEl.getStyle(WIDTH),10) -
			parseInt(tlEl.getStyle(WIDTH),10)) + PX;
		trEl.setStyle(WIDTH,newSize);
		brEl.setStyle(WIDTH,newSize);
	},

	/**
	 * Overrides Widget's own <a href="Widget.html#method__afterWidthChange">_afterWidthChange</a> method so that it 
	 * calls <a href="#method_syncUI">syncUI</a> after executing Widget's listener.
     *
     * @method _afterWidthChange
     * @param ev {Event} widthChange custom event
     * @protected
     */
	_afterWidthChange: function() { 
		ProgressBar.superclass._afterWidthChange.apply(this,arguments);
		this.syncUI();
	},

	/**
	 * Overrides Widget's own <a href="Widget.html#method__afterHeightChange">_afterHeightChange</a> method so that it 
	 * calls <a href="#method_syncUI">syncUI</a> after executing Widget's listener.
     *
     * @method _afterHeightChange
     * @param ev {Event} heightChange custom event
     * @protected
     */
	_afterHeightChange: function() {
		ProgressBar.superclass._afterHeightChange.apply(this,arguments);
		this.syncUI();
	},

    /**
     * Validator applied to the direction attribute.
	 * Accepts the strings 'ltr', 'rtl', 'ttb' and 'btt' only before the ProgressBar has been rendered.
     * It will reject any changes after that.
     *
     * @method _validateDirectionAtt
     * @param value {String} proposed value for the direction attribute
     * @return Boolean
     * @protected
     */
	 _validateDirectionAtt:function(value) {
		if (this.get('rendered')) { return false; }
		switch (value) {
			case DIRECTION_LTR:
			case DIRECTION_RTL:
			case DIRECTION_TTB:
			case DIRECTION_BTT:
				return true;
			default:
				return false;
		}
	},
	
    /**
     * Validator applied to the minValue attribute.
	 * Accepts numbers.
	 * The implementor should ensure the minValue is always less than or equal to maxValue
     *
     * @method _validateMinValueAtt
     * @param value {Number} proposed value for the minValue attribute
     * @return Boolean
     * @protected
     */
	_validateMinValueAtt:L.isNumber,

    /**
     * Validator applied to the maxValue attribute.
	 * Accepts numbers.
	 * The implementor should ensure the maxValue is always greater than or equal to minValue
     *
     * @method _validateMaxValueAtt
     * @param value {Number} proposed value for the maxValue attribute
     * @return Boolean
     * @protected
     */
	_validateMaxValueAtt:L.isNumber,

    /**
     * Validator applied to the value attribute.
	 * Accepts numbers.
	 * Rejects values out of the range in between minValue and maxValue
     *
     * @method _validateMaxValueAtt
     * @param value {Number} proposed value for the minValue attribute
     * @return Boolean
     * @protected
     */
	_validateValueAtt:function(value) {
		return L.isNumber(value) && value >= this.get(MIN_VALUE) && value <= this.get(MAX_VALUE);
	},
	
	/** 
	 * Called in response to a change in the <a href="#config_anim">anim</a> attribute.
	 * If the value is an instance of Anim it is returned unchanged.
	 * If the value evaluates to true, a new instance of Anim will be returned.
	 * Values that evaluate as false are returned unchanged.
	 * @method _setAnimAtt
	 * @return  {Anim | boolean}
	 * @private
	 */		
	 
	_setAnimAtt:function (value) {
		if (value && !(value instanceof Y.Anim)) {
			return new Y.Anim();
		}
	},

	/**
	 * Listener for the change in anim event.
     * Calls <a href="#method__animChange">_animChange</a>.
     *
     * @method _afterAnimChange
     * @param ev {Event} animChange custom event
     * @protected
     */
	_afterAnimChange: function(ev) {
		this._animChange(ev.newVal);
	},

	/**
	 * Sets up or destroys the Anim instance that animates the bar.
     * If <code>anim</code> evaluates to true, it will be an instance of Anim as set in <a href="#method__setAnimAtt">_setAnimAtt</a>.
	 * It will be associated with the bar element and listeners will be associated to some events.
	 * If <code>anim</code> evaluates to false, the Anim instance will be destroyed
     *
     * @method _animChange
     * @param anim {Anim | false} instance of Anim or value that evaluates to false
     * @protected
     */
	_animChange: function(anim) {
		if (anim) {
			anim.set('node', this.get(BAR_EL));
			anim.after('tween', Y.bind(this._animOnTween,this));
			anim.after('end', Y.bind(this._animComplete,this));

		} else {
			anim = this.get(ANIM);
			if (anim) {
				anim.detachAll();
				anim.destroy();
			}
			anim = null;
		}
	},

	/**
	 * Listener to the <code>end</code> of the Anim instance used by ProgressBar.
	 * Fires the <a href="#event_end">end</a> event after a last <a href="#event_progress">progress</a> event
	 * to ensure there will always be one.
	 * Removes the className assigned while moving.
	 * Stores the last value as initial for next movement.
     *
     * @method _animComplete
     * @protected
     */
	_animComplete: function() {
		var value = this.get(VALUE);
		this._previousValue = value;
		this.get(BAR_EL).removeClass(C_ANIM);
		this.fire(PROGRESS, {value:value});
		this.fire(END, {value:value});
	},

	/**
	 * Listener to the <code>tween</code> of the Anim instance used by ProgressBar.
	 * Fires the <a href="#event_progress">progress</a> event after scaling the elapsedTime to a value.
	 * Due to rounding differences while interpolating values in animation, 
	 * the left and width or top and height cannot be animated at once because they will not add up.
	 * Anim will animate the width or height and the left or top will be set here to add up to the ProgressBar size.
     *
     * @method _animOnTween
	 * @param ev {Event} <a href="#Anim.html#event_tween">tween</a> event
     * @protected
     */
	_animOnTween:function (ev) {
		var anim = ev.target,
			value = Math.floor(this._tweenFactor * anim.get('elapsedTime') + this._previousValue),
			barEl = this.get(BAR_EL);
		switch(this.get(DIRECTION)) {
			case DIRECTION_BTT:
				barEl.setStyle('top',(this._barSpace - parseFloat(barEl.getStyle(HEIGHT))) + PX);
				break;
			case DIRECTION_RTL:
				barEl.setStyle('left',(this._barSpace - parseFloat(barEl.getStyle(WIDTH))) + PX);
				break;
		}
		this.fire(PROGRESS,{value:value});
	},

	/** 
	 * Sets the ARIA value attributes
	 * @method _setAriaText
	 * @return  void
	 * @private
	 */
	 _setAriaText: function(value) {

		this.get(BOUNDING_BOX).setAttrs({
			'aria-valuenow':value,
			'aria-valuetext':Y.Lang.substitute(this.get(ARIA_TEXT_TEMPLATE),{
				value:value,
				minValue:this.get(MIN_VALUE),
				maxValue:this.get(MAX_VALUE)
			})
		});
	}
});
/**
 * Collection of functions used to calculate the size of the bar.
 * One of these will be used depending on direction and whether animation is active.
 * @property _barSizeFunctions
 * @type {collection of functions}
 * @static
 * @protected
 */
var b = [{},{}];
ProgressBar._barSizeFunctions = b;

b[0][DIRECTION_LTR] = function(value, pixelValue, barEl, anim) {
	barEl.setStyle(WIDTH,  pixelValue + PX);
	this.fire(PROGRESS,{value:value});
	this.fire(END,{value:value});
};
b[0][DIRECTION_RTL] = function(value, pixelValue, barEl, anim) {
	barEl.setStyle(WIDTH,  pixelValue + PX);
	barEl.setStyle('left',(this._barSpace - pixelValue) + PX);
	this.fire(PROGRESS,{value:value});
	this.fire(END,{value:value});
};
b[0][DIRECTION_TTB] = function(value, pixelValue, barEl, anim) {
	barEl.setStyle(HEIGHT,  pixelValue + PX);
	this.fire(PROGRESS,{value:value});
	this.fire(END,{value:value});
};
b[0][DIRECTION_BTT] = function(value, pixelValue, barEl, anim) {
	barEl.setStyle(HEIGHT,  pixelValue + PX);
	barEl.setStyle('top',  (this._barSpace - pixelValue) + PX);
	this.fire(PROGRESS,{value:value});
	this.fire(END,{value:value});
};
b[1][DIRECTION_LTR] = function(value, pixelValue, barEl, anim) {
	barEl.addClass(C_ANIM);
	if (value !== this._previousValue) {
		this._tweenFactor = (value - this._previousValue)  / anim.get('duration') / 1000;
	} else {
		this._tweenFactor = 0;
	}
	anim.set('to', {width: pixelValue }); 
	anim.run();
};
b[1][DIRECTION_RTL] =  b[1][DIRECTION_LTR];
b[1][DIRECTION_TTB] =  function(value, pixelValue, barEl, anim) {
	barEl.addClass(C_ANIM);
	if (value !== this._previousValue) {
		this._tweenFactor = (value - this._previousValue) / anim.get('duration') / 1000;
	} else {
		this._tweenFactor = 0;
	}
	anim.set('to', {height: pixelValue});
	anim.run();
};
b[1][DIRECTION_BTT] =  b[1][DIRECTION_TTB];
	
	
Y.ProgressBar = ProgressBar;




}, '@VERSION@' ,{requires:['widget','substitute']});
