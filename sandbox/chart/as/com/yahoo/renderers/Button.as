package com.yahoo.renderers
{
    import com.yahoo.renderers.layout.Container;
    import com.yahoo.renderers.layout.LayerStack;
    import flash.events.MouseEvent;
    
    /**
     * Defines properties, styles and behavior for buttons.
     */
    public class Button extends Container
    {
        private static var _skins:Object = {
            off:"_off",
            over:"_over",
            down:"_down",
            disabled:"_disabled"
        };

	//--------------------------------------
	//  Constructor
	//--------------------------------------			
        /**
         * Constructor
         */
        public function Button()
        {
            super(new LayerStack());
        }

	//--------------------------------------
	//  Properties
	//--------------------------------------			
        /**
         * @private
         */
        private var _defaultSkins:Object = {
            _off:{
                type:"fill",
                fillColor:0xff0000
            },
            _over:{
                type:"fill",
                fillColor:0x0000ff
            },
            _down:{
                type:"fill",
                fillColor:0x00ffff
            },
            _disabled:{
                type:"fill",
                fillColor:0xdddddd
            }
        };

        /**
         * @private (protected)
         * Skin visible when the mouse is not over the <code>Button</code>
         * instance.
         */
        protected var _off:Renderer;

        /**
         * @private (protected)
         * Skin visible when the mouse is over the <code>Button</code>
         * instance.
         */
        protected var _over:Renderer;
        
        /**
         * @private (protected)
         * Skin visible when the mouse is in the down position over the <code>Button</code>
         * instance.
         */
        protected var _down:Renderer;

        /**
         * @private (protected)
         * Skin visible when the <code>Button</code> is disabled.
         * instance.
         */
        protected var _disabled:Renderer;

        /**
         * @private
         */
        private var _state:String = "_off";
	//--------------------------------------
	//  Public Methods
	//--------------------------------------			
        /**
         * @private (override)
         */
        override public function setStyle(style:String, value:Object):Boolean
        {
            if(_skins.hasOwnProperty(value))
            {
                if(!_skins[style])
                {
                    this._defaultSkins[style] = this.merge(this._defaultSkins[style], value);
                }
                else
                {
                    Renderer(_skins[style]).setStyles(value);
                    this.setFlag(style);
                }
                this.setFlag("skin");
                return true;
            }
            return super.setStyle(style, value);
        }

        /**
         * @private (override)
         */
        override public function getStyle(style:String):Object
        {
            if(_skins.hasOwnProperty(style))
            {
                if(_skins.hasOwnProperty(style) is Renderer)
                {
                    return Renderer(_skins[style]).getStyles();
                }
                return this._defaultSkins[style];
            }
            
            return super.getStyle(style);
        }

		/**
		 * @private (override)
		 */
		override public function setStyles(styles:Object):void
		{
			var styleSet:Boolean,
				value:String;
            if(styles.hasOwnProperty("width")) 
            {
                this.width = styles.width as Number;
			}
            if(styles.hasOwnProperty("height")) 
            {
                this.height = styles.height as Number;
			}
            if(styles.hasOwnProperty("sizeMode")) 
            {
                this.sizeMode = styles.sizeMode as String;
            }
			for(value in styles)
			{
                if(_skins.hasOwnProperty(value))
                {
                    if(this[_skins[value]] is Renderer)
                    {
                        var oldStyles:Object = Renderer(this[_skins[value]]).getStyles();
                        if(styles[value].hasOwnProperty("type"))
                        {
                            if((styles[value].type === "image" && Renderer(this[_skins[value]]) is Skin) || (styles[value].type = "fill" && Renderer(this[_skins[value]]) is ImageSkin))
                            {
                                this.removeItem(Renderer(this[_skins[value]]));
                                var skin:Renderer = styles[value].type == "image" ? new ImageSkin() : new Skin();
                                this.addItem(skin);
                                skin.setStyles(this.merge(oldStyles, styles[value]));
                                this[_skins[value]] = skin;
                                this.setFlag("skin");
                                continue;

                            }
                        }
                        Renderer(this[_skins[value]]).setStyles(this.merge(oldStyles, styles[value]));
                    }
                    else
                    {
                        this._defaultSkins[value] = this.merge(this._defaultSkins[value], styles[value]);
                    }
                }
				else if(styles.hasOwnProperty(value))
				{
					styleSet = this._styles.setStyle(value, styles[value]);
					if(styleSet) this.setFlag(value);
				}
			}
		}

        /**
         * @private (override)
         */
        override public function getStyles():Object
        {
            var styles:Object = {},
                style:String,
                hash:Object = _skins;
                styles = super.getStyles();
            for(style in hash)
            {
                if(hash[style] is Renderer)
                {
                    styles[style] = Renderer(hash[style]).getStyles();
                }
                else
                {
                    styles[style] = this._defaultSkins[style];
                }
            }
            return styles;
        }

	//--------------------------------------
	//  Protected Methods
	//--------------------------------------
        /**
         * @private (override)
         */
        override protected function initializeRenderer():void
        {
            super.initializeRenderer();
            this.setSkins();
            this.setState();
            this.addListeners();
        }

        /**
         * @private (protected)
         */
        protected function setSkins():void
        {
            var key:String,
                role:String,
                skin:Renderer,
                skins:Object = _skins,
                styles:Object;
            for(key in skins)
            {
                if(skins.hasOwnProperty(key))
                {
                    role = skins[key];
                    styles = this._defaultSkins[role];
                    this[role] = styles.type === "fill" ? new Skin() : new ImageSkin();
                    skin = Renderer(this[role]);
                    skin.setStyles(styles);
                    this.addItem(skin);
                }
            }
        }

        /**
         * @private (protected)
         * Shows appropriate skin based on the <code>Button</code> instance's
         * state.
         */
        protected function setState():void
        {
            var key:String,
                skin:Renderer,
                role:String,
                skins:Object = _skins,
                state:String = this._state;
            for(key in skins)
            {
                if(skins.hasOwnProperty(key))
                {
                    role = skins[key];
                    skin = Renderer(this[role]);
                    skin.visible = state === role;
                }
            }
        }

        /**
         * @private (override)
         */
        override protected function render():void
        {
            super.render();
            if(this.checkFlag("skin")) 
            {
                this.setState();
            }
        }

        /**
         * @private
         */
        private function addListeners():void
        {
            this.addEventListener(MouseEvent.ROLL_OVER, this.mouseOverHandler, false, 1);
            this.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDownHandler, false, 1);
            this.addEventListener(MouseEvent.MOUSE_UP, this.mouseOverHandler, false, 1);
            this.addEventListener(MouseEvent.ROLL_OUT, this.mouseOutHandler, false, 1);
        }

        /**
         * @private
         */
        private function merge(old:Object, repl:Object):Object
        {
            var obj:Object = {},
                key:String;
            for(key in old)
            {
                if(old.hasOwnProperty(key))
                {
                    obj[key] = old[key];
                }
            }
            for(key in repl)
            {
                if(repl.hasOwnProperty(key))
                {
                    obj[key] = repl[key];
                }
            }
            return obj;
        }

    //--------------------------------------
	//   Event Handlers
	//--------------------------------------		
        /**
         * @private 
         */
        private function mouseOverHandler(event:MouseEvent):void
        {
            this._state = "_over";
            this.setState();            
        }

        /**
         * @private 
         */
        private function mouseDownHandler(event:MouseEvent):void
        {
            this._state = "_down";
            this.setState();            

        }

        /**
         * @private 
         */
        private function mouseOutHandler(event:MouseEvent):void
        {
            this._state = "_off";
            this.setState();            
        }
    }
}
