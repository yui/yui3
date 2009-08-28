/**
 * Create a sliding value range input visualized as a draggable thumb on a
 * background element.
 * 
 * @module progressbar
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
	COMPLETE = 'complete',

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

var ProgressBar = function() {
	Y.log('creating new instance');

	ProgressBar.superclass.constructor.apply(this, arguments);
};

Y.mix(ProgressBar,{
	NAME:'progressbar',
	ATTRS : {
		barEl: {
			writeOnce: true
		},

		maskEl: {
			writeOnce: true
		},

		direction: {
			value:DIRECTION_LTR,
			lazyAdd:false,
			setter: function (value) {
				return this._setDirectionAtt(value);
			},
			
			validator: function (value) {
				return this._validateDirectionAtt(value);
			}
		},

		maxValue: {
			value: 100,
			validator: function (value) {
				return this._validateMaxValueAtt(value);
			}
		},
		
		minValue: {
			value: 0,
			validator: function (value) {
				return this._validateMinValueAtt(value);
			}
		},

		ariaTextTemplate: {
			value:'{value}'
		},
		
		value: {
			value: 0,
			validator: function (value) {
				return this._validateValueAtt(value);
			}
		},
		
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
	_rendered: false,

	initializer: function  (config) {
	
		Y.log('initializer');

		this.publish(START);
		// If animation is loaded, this one will trigger for each frame of the animation providing partial values
		this.publish(PROGRESS);
		// This will fire at the end of the animation or immediately upon changing values if animation is not loaded
		this.publish(COMPLETE);
	},
	
	renderer : function() {
		Y.log('renderer');
		ProgressBar.superclass.renderer.apply(this, arguments);
	},

	renderUI: function () {
		Y.log('renderUI');
		
		if (this._rendered) { return; }
		this._rendered = true;
		
		var cb   = this.get(CONTENT_BOX),
			bb   = this.get(BOUNDING_BOX);
		cb.addClass(getCN(PB,this.get(DIRECTION)));
		this.set(BAR_EL, cb.appendChild(Y.Node.create(BAR_MARKUP)));
		this.set(MASK_EL, cb.appendChild(Y.Node.create(MASK_MARKUP)));
		this._barSizeFunction = this._barSizeFunctions[0][this.get(DIRECTION)];
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
	
	bindUI: function () {
		this.after('valueChange', this._afterValueChange);
		this.after('minValueChange', this._afterMinValueChange);
		this.after('maxValueChange', this._afterMaxValueChange);
		this.on('animChange', this._onAnimChange);
	},
	syncUI: function() {
		Y.log('syncUI');
		this._fixEdges();
		this._recalculateConstants();
		this._valueChange(this.get(VALUE));
	},
	_afterMinValueChange: function(ev) {
		var minValue = ev.newVal;
		if (this.get(VALUE) < minValue) {this.set(VALUE, minValue);}
		this.get(BOUNDING_BOX).setAttribute('aria-valuemin', minValue);
		this.syncUI();
	},
	_afterMaxValueChange: function(ev) {
		var maxValue = ev.newVal;
		if (this.get(VALUE) > maxValue) { this.set(VALUE, maxValue); }
		this.get(BOUNDING_BOX).setAttribute('aria-valuemax', maxValue);
		this.syncUI();
	},

		
	_afterValueChange: function (ev) {
		this._valueChange(ev.newVal);
	},
	_valueChange: function (value) {
		Y.log('set value: ' + value);
		this._setAriaText(value);
		var pixelValue = Math.floor((value - this.get(MIN_VALUE)) * this._barFactor),
			anim = this.get(ANIM);
		if (anim) {
			anim.stop();
		}
		this.fire(START,{newVal:this._previousValue});
		this._barSizeFunction(value, pixelValue, this.get(BAR_EL), anim);
	},
	destructor: function() {
		Y.log('destroy','info','ProgressBar');
		this.set(ANIM,false);
		this.unsubscribeAll();
		var el = this.get(BOUNDING_BOX),
			parent = el.get('parentNode');
		if (parent) { parent.removeChild(el); }

	},
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
	 * stretches the lower and/or right quadrants to make the difference.
	 * @method _fixEdges
	 * @return void
	 * @private
	 */
	_fixEdges:function() {
		if (!this._rendered || Y.UA.ie || Y.UA.gecko ) { return; }
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
	_afterWidthChange: function() { 
		ProgressBar.superclass._afterWidthChange.apply(this,arguments);
		this.syncUI();
	},
	_afterHeightChange: function() {
		ProgressBar.superclass._afterHeightChange.apply(this,arguments);
		this.syncUI();
	},
	_setDirectionAtt:function(value) {
		this._barSizeFunction = this._barSizeFunctions[this.get(ANIM)?1:0][value];
		return value;
	},
	_validateDirectionAtt:function(value) {
		if (this._rendered) { return false; }
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
	_validateMaxValueAtt:L.isNumber,
	_validateMinValueAtt:L.isNumber,
	_validateValueAtt:function(value) {
		return L.isNumber(value) && value >= this.get(MIN_VALUE) && value <= this.get(MAX_VALUE);
	},
	/** 
	 * Called in response to a change in the <a href="#config_anim">anim</a> attribute.
	 * It creates and sets up or destroys the instance of the animation utility that will move the bar
	 * @method _animSetter
	 * @return  void
	 * @private
	 */		
	 
	_setAnimAtt:function (value) {
		if (value && !(value instanceof Y.Anim)) {
			return new Y.Anim();
		}
	},
	_onAnimChange: function(ev) {
		this._animChange(ev.newVal);
	},
	_animChange: function(anim) {
		if (anim) {
			Y.log('Turning animation on','info','ProgressBar');
			anim.set('node', this.get(BAR_EL));
			anim.after('tween', Y.bind(this._animOnTween,this));
			anim.after('end', Y.bind(this._animComplete,this));

		} else {
			Y.log('Turning animation off','info','ProgressBar');
			anim = this.get(ANIM);
			if (anim) {
				anim.detachAll();
			}
			anim = null;
		}
		this._barSizeFunction = this._barSizeFunctions[anim?1:0][this.get(DIRECTION)];
		return anim;
	},
	_animComplete: function() {
		Y.log('Animation completed','info','ProgressBar');
		var value = this.get(VALUE);
		this._previousValue = value;
		this.fire(PROGRESS, {newVal:value});
		this.fire(COMPLETE, {newVal:value});
		this.get(BAR_EL).removeClass(C_ANIM);
	},
	_animOnTween:function (ev) {
		var anim = ev.target,
			value = Math.floor(this._tweenFactor * anim.get('elapsedTime') + this._previousValue);
		// The following fills the logger window too fast
		// Y.log('Animation onTween at: ' + value,'info','ProgressBar');
		this.fire(PROGRESS,{newVal:value});
	},

	/** 
	 * Utility method to set the ARIA value attributes
	 * @method _setAriaText
	 * @return  void
	 * @private
	 */
	 _setAriaText: function(value) {
		// When animated, this fills the logger window too fast
		//Y.log('Show template','info','ProgressBar');

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
 * Collection of functions used by to calculate the size of the bar.
 * One of this will be used depending on direction and whether animation is active.
 * @property _barSizeFunctions
 * @type {collection of functions}
 * @private
 */
var b = [{},{}];
ProgressBar.prototype._barSizeFunctions = b;

b[0][DIRECTION_LTR] = function(value, pixelValue, barEl, anim) {
	barEl.setStyle(WIDTH,  pixelValue + PX);
	this.fire(PROGRESS,{newVal:value});
	this.fire(COMPLETE,{newVal:value});
};
b[0][DIRECTION_RTL] = function(value, pixelValue, barEl, anim) {
	barEl.setStyle(WIDTH,  pixelValue + PX);
	barEl.setStyle('left',(this._barSpace - pixelValue) + PX);
	this.fire(PROGRESS,{newVal:value});
	this.fire(COMPLETE,{newVal:value});
};
b[0][DIRECTION_TTB] = function(value, pixelValue, barEl, anim) {
	barEl.setStyle(HEIGHT,  pixelValue + PX);
	this.fire(PROGRESS,{newVal:value});
	this.fire(COMPLETE,{newVal:value});
};
b[0][DIRECTION_BTT] = function(value, pixelValue, barEl, anim) {
	barEl.setStyle(HEIGHT,  pixelValue + PX);
	barEl.setStyle('top',  (this._barSpace - pixelValue) + PX);
	this.fire(PROGRESS,{newVal:value});
	this.fire(COMPLETE,{newVal:value});
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

