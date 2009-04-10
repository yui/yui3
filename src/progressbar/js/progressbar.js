/*
People working in large organizations need this sort of statement to be able to include it in their applications, so here it goes:

Copyright (c) 2008, Daniel Barreiro (a.k.a. Satyam). All rights reserved.
satyam at satyam dot com dot ar  (yes, it ends with ar)
It is the intention of the author to make this component freely available for use along the YAHOO User Interface Library
so it is licensed with a BSD License: http://developer.yahoo.net/yui/license.txt
developped along version: 3.0.0PR2 of YUI
*/

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
	ANIM		= 'anim',

	CONTENT_BOX = 'contentBox',
	MASK_EL		= 'maskEl',
	BAR_EL		= 'barEl',

	getCN		= Y.ClassNameManager.getClassName,

	IMAGE		= 'image',
	C_MASK		= getCN(PB,MASK),
	C_BAR       = getCN(PB,BAR),
	C_TL        = getCN(PB,TL),
	C_TR        = getCN(PB,TR),
	C_BL        = getCN(PB,BL),
	C_BR        = getCN(PB,BR),
	C_ANIM      = getCN(PB,ANIM),
	
	BAR_MARKUP = '<div class="' + C_BAR + '"></div>',
	MASK_MARKUP = '<table class="' + 
		C_MASK + '"><tr><td class="' + C_TL + '"></td><td class="' + 
		C_TR + '"></td></tr><tr><td class="' + C_BL + '"></td><td class="' + 
		C_BR + '"></td></tr></table>',
	
	L = Y.Lang,
	isArray   = L.isArray,
	isBoolean = L.isBoolean,
	isString  = L.isString,
	isNumber  = L.isNumber,
	isNull	  = L.isNull;

var ProgressBar = function() {
	Y.log('creating new instance');

	ProgressBar.superclass.constructor.apply(this, arguments);
};

Y.mix(ProgressBar,{
	NAME:'progressbar',
	ATTRS : {
		barEl: {
			//writeOnce: true,
			value : null
		},

		maskEl: {
			//writeOnce: true,
			value : null
		},

		direction: {
			//writeOnce: true,
			value:'lr',
			set: function (value) {
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
		
		width: {
			value: null,
			set: function (value) {
				return this._setWidthAtt(value);
			}
		},
		
		height: {
			value: null,
			set: function (value) {
				return this._setHeightAtt(value);
			}
		},
		
		barColor: {
		},

		backColor: {
		},
		
		border: {
		},
		
		ariaText: {
			value:'|'
		},
		
		value: {
			value: 50,
			validator: function (value) {
				return this._validateValueAtt(value);
			}
		},
		
		anim: {
			//writeOnce:true,
			value: {}
		}
	}
});

Y.extend(ProgressBar, Y.Widget, {
	_previousValue: 50,
	_tweenFactor: 1,
	_barFactor:1,
	_barSpace:0,
	_rendered:false,
	_anim:null,

	initializer: function  (config) {
	
		Y.log('initializer');

		this.publish('startEvent', { emitFacade: false });
		// If animation is loaded, this one will trigger for each frame of the animation providing partial values
		this.publish('changingEvent', { emitFacade: false });
		// This will fire at the end of the animation or immediately upon changing values if animation is not loaded
		this.publish('completeEvent', { emitFacade: false });
		
		
		// I'm listening to AttributeProvider's own attribute change events to adjust the bar according to the new sizes
		this.after('valueChange',this._redraw);
		this.after('minValueChange', this.redraw );
		this.after('maxValueChange', this.redraw );
		this.after('widthChange', this._onWidthChange);
		this.after('heightChange',this._onHeightChange);
		this.after('barColorChange', this._onBarColorChange);
		this.after('backColorChange', this._onBackColorChange);
		this.after('borderChange', this._onBorderChange);
		
		
	},
	
	renderer : function() {
		Y.log('renderer');
		ProgressBar.superclass.renderer.apply(this, arguments);
	},

	renderUI: function () {
		Y.log('renderUI');
		var cb   = this.get(CONTENT_BOX);
		this.set(BAR_EL, cb.appendChild(Y.Node.create(BAR_MARKUP)));
		this.set(MASK_EL, cb.appendChild(Y.Node.create(MASK_MARKUP)));
				
		
		if (isNull(this.get('width'))) {
			this.set('width',cb.getComputedStyle('width'));
		} 				
		if (isNull(this.get('height'))) {
			this.set('height',cb.getComputedStyle('height'));
		}
		this._rendered = true;
		this._onWidthChange();
		this._onHeightChange();
		this._onBarColorChange();
		this._onBackColorChange();
		this._onBorderChange();
		// If there is an instance of Animator available, I fire the events
		var barEl =this.get(BAR_EL);
		if (Y.Anim) {
			barEl.plug(Y.plugin.NodeFX);
			this._anim = barEl.fx;

			this._anim.setAtts(this.get('anim'));
			this._anim.after('tween',function (ev) {
				this.fire('changingEvent', Math.floor(this._tweenFactor  * this._anim.get('elapsedTime') + this._previousValue));
			},this,true);
			
			this._anim.after('end',function(ev) {
				this.fire('completeEvent',this._previousValue = this.get('value'));
				this.get(BAR_EL).removeClass(C_ANIM);
			},this,true);
			//this._anim.run();
		}
	},
	
	/* The user does not interact with this control
	bindUI: function () {
	},
	*/
	syncUI: function() {
		Y.log('syncUI');
		this.get(CONTENT_BOX).setAttribute('tabIndex',1).setAttribute('role','progressbar').setAttribute('aria-valuemin',this.get('minValue')).setAttribute('aria-valuemax',this.get('maxValue')).setAttribute('aria-valuenow',this.get('value')).setAttribute('aria-valuetext',this.get('ariaText').replace('|',this.get('value')));
		this.redraw();
		
	},
	redraw: function () {
		this._recalculateConstants();
		this._redraw();
	},
	
	_redraw: function () {
		var value = this.get('value');
		Y.log('set value: ' + value);
		var pixelValue = (value - this._mn) * this._barFactor;
		this.get(CONTENT_BOX).setAttribute('aria-valuenow',value).setAttribute('aria-valuetext',this.get('ariaText').replace('|',value));
		this.fire('startEvent',this._previousValue);
		var barEl = this.get(BAR_EL);
		if (this._anim) {
			barEl.addClass(C_ANIM);
			this._tweenFactor = (value - this._previousValue) / (this._anim.get('duration') * 1000);
			switch (this.get('direction')) {
				case 'lr':
					this._anim.set('to',{ width: pixelValue }); 
					break;
				case 'rl':
					this._anim.set('to',{ 
							width: pixelValue, 
							left: this._barSpace - pixelValue
						}
					); 
					break;
				case 'tb':
					this._anim.set('to',{
						height: pixelValue
					});
					break;
				case 'bt':
					this._anim.set('to',{
							height: pixelValue,
							top: this._barSpace - pixelValue 
						}
					);
					break;
			}
			this._anim.run();
		} else {
			switch (this.get('direction')) {
				case 'lr':
					barEl.setStyle('width',  pixelValue + 'px');
					break;
				case 'rl':
					barEl.setStyle('width',  pixelValue + 'px');
					barEl.setStyle('left',(this._barSpace - pixelValue) + 'px');
					break;
				case 'tb':
					barEl.setStyle('height',  (pixelValue) + 'px');
					break;
				case 'bt':
					barEl.setStyle('height',  pixelValue + 'px');
					barEl.setStyle('top',  (this._barSpace - pixelValue) + 'px');
					break;
			}

			// If the animation utility has not been loaded then changing the value will always complete immediately.
			this.fire('completeEvent',value);
		}
	},
	destructor: function() {
	},
	_recalculateConstants: function() {
		this._mn = this.get('minValue');
		var barEl = this.get(BAR_EL);
		switch (this.get('direction')) {
			case 'lr':
			case 'rl':
				this._barSpace = parseInt(this.get('width'),10) - parseInt(barEl.getComputedStyle('marginLeft'),10) - parseInt(barEl.getComputedStyle('marginRight'),10); 
				break;
			case 'tb':
			case 'bt':
				this._barSpace = parseInt(this.get('height'),10) - parseInt(barEl.getComputedStyle('marginTop'),10) - parseInt(barEl.getComputedStyle('marginBottom'),10); 
				break;
		}
		this._barFactor = this._barSpace / (this.get('maxValue') - this._mn);
	},
	_onWidthChange: function() { 
		if (!this._rendered) {return;}
		var value = this.get('width');
		this.get(CONTENT_BOX).setStyle('width',value);
		this.get(MASK_EL).setStyle('width', value);
		this.get(BAR_EL).setStyle('width', value);
		this.redraw();
	},
	_onHeightChange: function(ev) {
		if (!this._rendered) {return;}
		var value = this.get('height');
		this.get(CONTENT_BOX).setStyle('height',value);
		this.get(MASK_EL).setStyle('height', value);
		this.get(BAR_EL).setStyle('height', value);
		this.redraw();
	},
	_onBarColorChange: function() {
		if (!this._rendered) {return;}
		this.get(BAR_EL).setStyle('backgroundColor', this.get('barColor'));			
	},
	_onBackColorChange:function(ev) {
		if (!this._rendered) {return;}
		this.get(CONTENT_BOX).setStyle('backgroundColor', this.get('backColor'));
	},
	_onBorderChange:function(ev) {
		if (!this._rendered) {return;}
		this.get(CONTENT_BOX).setStyle('border', this.get('border'));
	},
	_setDirectionAtt:function(value) {
		return Y.Lang.trim(value.toLowerCase());
	},
	_validateDirectionAtt:function(value) {
		switch (value) {
			case 'lr':
			case 'rl':
			case 'tb':
			case 'bt':
				return true;
			default:
				return false;
		}
	},
	_validateMaxValueAtt:isNumber,
	_validateMinValueAtt:isNumber,
	_setWidthAtt:function(value) {
		if (isNumber(value)) {
			value += 'px';
		}
		Y.log('Setting width: ' + value);
		return value;
	},
	_setHeightAtt:function(value) {
		if (isNumber(value)) {
			value += 'px';
		}
		Y.log('Setting height: ' + value);
		return value;

	},
	_validateValueAtt:function(value) {
		return isNumber(value) && value >= this.get('minValue') && value <= this.get('maxValue');
	}
});
	
	
Y.ProgressBar = ProgressBar;

