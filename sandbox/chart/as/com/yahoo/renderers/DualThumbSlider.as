package com.yahoo.renderers
{
    import com.yahoo.renderers.layout.Container;
    import com.yahoo.renderers.layout.HLayout;
    
    public class DualThumbSlider extends Renderer
    {
	//--------------------------------------
	//  Constructor
	//--------------------------------------		
        /**
         * Constructor
         */
        public function DualThumbSlider()
        {
            super();
        }
        
	//--------------------------------------
	//  Properties
	//--------------------------------------		
        /**
         * @private 
         * Storage for leftHandle
         */
        private _leftHandle:Button;

        /**
         * Left handle of slider
         */
        public function get leftHandle():Button
        {
            return this._leftHandle;
        }

        /**
         * @private (setter)
         */
        public function set leftHandle(value:Button):void
        {
            this._leftHandle = value;
        }

        /**
         * @private 
         * Storage for rightHandle
         */
        private _rightHandle:Button;

        /**
         * Left handle of slider
         */
        public function get rightHandle():Button
        {
            return this._rightHandle;
        }

        /**
         * @private (setter)
         */
        public function set rightHandle(value:Button):void
        {
            this._rightHandle = value;
        }

        /**
         * @private
         * Storage for viewport
         */
        private var _viewport:Button;

        /**
         * The viewport of the slider used to highlight the selected area of the parent element.
         */
        public function get viewport():Button
        {
            return this._viewport;
        }

        /**
         * @private (setter)
         */
        public function set viewport(value:Button):void
        {
            this._viewport = value;
        }

        /**
         * @private
         */
        private var _leftHandleStyles:Object = {
            position:"static",
            heightMetric:"pct",
            widthMetric:"actual",
            horizontalAlign:"left",
            height:100,
            width:5
        };

        /**
         * @private
         */
        private var _rightHandleStyles:Object = {
            position:"static",
            heightMetric:"pct",
            widthMetric:"actual",
            horizontalAlign:"right",
            height:100,
            width:5
        };

        /**
         * @private
         */
        private var _viewportStyles:Object = {
            off:{
                fillAlpha:0.3,
                type:"fill", 
                fillColor:0x000000
            },
            over:{
                fillAlpha:0.3,
                type:"fill", 
                fillColor:0x000000
            },
            down:{
                fillAlpha:0.3,
                type:"fill", 
                fillColor:0x000000
            }
        };

	//--------------------------------------
	//  Public Methods
	//--------------------------------------	


	//--------------------------------------
	//  Protected Methods
	//--------------------------------------		
        /**
         * @private (override)
         */
        override protected function initializeRenderer():void
        {
            this._viewport = new Button();
            this._viewport.setStyles(this._viewportStyles);
            this._viewport.addEventListener(MouseEvent.MOUSE_DOWN, this.viewportMouseDownHandler);
            this._viewport.addEventListener(MouseEvent.MOUSE_UP, this.viewportMouseUpHandler);
            this.addChild(this._viewport);
            this._leftHandle = new Button();
            this._leftHandle.setStyles(this._leftHandleStyles);
            this._leftHandle.addEventListener(MouseEvent.MOUSE_DOWN, this.leftHandleMouseDownHandler);
            this._leftHandle.addEventListener(MouseEvent.MOUSE_UP, this.leftHandleMouseUpHandler);
            this.addChild(this._leftHandle);
            this._rightHandle = new Button();
            this._rightHandle.setStyles(this._rightHandleStyles);
            this._rightHandle.addEventListener(MouseEvent.MOUSE_DOWN, this.rightHandleMouseDownHandler);
            this._rightHandle.addEventListener(MouseEvent.MOUSE_UP, this.rightHandleMouseUpHandler);
            this.addChild(this._rightHandle);
            this.setFlag("componentChange");
        }

        /**
         * @private (override)
         */
        override protected function render():void
        {
            if(!this.checkFlag("componentChange"))
            {
                return;
            }

            this.updateLeftHandle();
            this.updateViewport();
            this.updateRightHandle();
        }

	//--------------------------------------
	//  Private Methods
	//--------------------------------------	
        /**
         * @private
         * Positions the <code>leftHandle</code> based on updated size and position properties.
         */
        private function updateLeftHandle():void
        {
            var leftHandle:Button = this._leftHandle,
                padding:Object = this.getStyles("padding"),
                styles:Object = this.getStyles("leftHandle"),
                position:String = styles.position,
                widthMetric:String = styles.getWidthMetric,
                heightMetric:String = styles.getHeightMetric,
                verticalAlign:String = styles.verticalAlign,
                horizontalAlign:String = styles.horizontalAlign,
                w:Number = styles.width,
                h:Number = styles.height,
                topPadding:Number = padding.top || 0,
                leftPadding:Number = padding.left || 0,
                margin:Object = styles.margin,
                topMargin:Number = margin.top || 0,
                leftMargin:Number = margin.left || 0;
                    
            if(widthMetric === "pct")
            {
                w = Math.round(this.width * w)/100;
            }
            if(heightMetric === "pct")
            {
                h = Math.round(this.height * h)/100;
            }
            leftHandle.width = w; 
            leftHandle.height = h;
            if(position == "static")
            {
                leftHandle.x = leftMargin + leftPadding;
                leftHandle.y = topMargin + topPadding;
            }
            else if(position === "relative")
            {
                if(verticalAlign === "top")
                {
                    leftHandle.y = topMargin + topPadding;
                }
                else if(verticalAlign === "bottom")
                {
                    leftHandle.y = this.height - (leftHandle.height + bottomMargin + bottomPadding);
                }
                else if(verticalAlign === "middle")
                {
                    leftHandle.y = (this.height - leftHandle.height) * 0.5;    
                }

                if(horizontalAlign === "left")
                {
                    leftHandle.x = leftMargin + leftPadding;
                }
                else if(horizontalAlign === "right")
                {
                    leftHandle.x = this.width - (leftHandle.width + rightMargin + rightPadding);
                }
            }


        }

        /**
         * @private
         * Positions the <code>viewport</code> based on updated size and position properties.
         */
        private function updateViewport():void
        {
            var viewport:Button = this._viewport,
                styles:Object = this.getStyles(),
                leftHandleStyles:Object = styles.leftHandle,
                rightHandleStyles:Object = styles.rightHandle,
                padding:Object = styles.padding,
                left:Number = padding.left || 0,
                right:Number = padding.right || 0,
                w:Number = this.width,
                h:Number = this.height;
            if(leftHandleStyles.position === "static")
            {
                left += this._leftHandle.width; 
            }
            if(rightHandleStyles.position === "static")
            {
                right += this._rightHandle.width;
            }
            viewport.width = w - (left + right);
            viewport.height = h;
            viewport.x = left;
        }

        /**
         * @private
         * Positions the <code>rightHandle</code> based on updated size and position properties.
         */
        private function updateRightHandle():void
        {
            var rightHandle:Button = this._rightHandle,
                padding:Object = this.getStyles("padding"),
                styles:Object = this.getStyles("rightHandle"),
                position:String = styles.position,
                widthMetric:String = styles.getWidthMetric,
                heightMetric:String = styles.getHeightMetric,
                verticalAlign:String = styles.verticalAlign,
                horizontalAlign:String = styles.horizontalAlign,
                w:Number = styles.width,
                h:Number = styles.height,
                topPadding:Number = padding.top || 0,
                leftPadding:Number = padding.left || 0,
                margin:Object = styles.margin,
                topMargin:Number = margin.top || 0,
                leftMargin:Number = margin.left || 0;
                    
            if(widthMetric === "pct")
            {
                w = Math.round(this.width * w)/100;
            }
            if(heightMetric === "pct")
            {
                h = Math.round(this.height * h)/100;
            }
            rightHandle.width = w; 
            rightHandle.height = h;
            if(position == "static")
            {
                rightHandle.x = leftMargin + leftPadding;
                rightHandle.y = topMargin + topPadding;
            }
            else if(position === "relative")
            {
                if(verticalAlign === "top")
                {
                    rightHandle.y = topMargin + topPadding;
                }
                else if(verticalAlign === "bottom")
                {
                    rightHandle.y = this.height - (rightHandle.height + bottomMargin + bottomPadding);
                }
                else if(verticalAlign === "middle")
                {
                    rightHandle.y = (this.height - rightHandle.height) * 0.5;    
                }

                if(horizontalAlign === "left")
                {
                    rightHandle.x = leftMargin + leftPadding;
                }
                else if(horizontalAlign === "right")
                {
                    rightHandle.x = this.width - (rightHandle.width + rightMargin + rightPadding);
                }
            }
        }
	//--------------------------------------
	//  Event Handlers
	//--------------------------------------	
        /**
         * @private
         */
        private function viewportMouseDownHandler(event:MouseEvent):void
        {
        }

        /**
         * @private
         */
        private function viewportMouseUpHandler(event:MouseEvent):void
        {
        }

        /**
         * @private
         */
        private function viewportMouseMoveHandler(event:MouseEvent):void
        {
        }

        /**
         * @private
         */
        private function leftHandleMouseDownHandler(event:MouseEvent):void
        {
        }

        /**
         * @private
         */
        private function leftHandleMouseUpHandler(event:MouseEvent):void
        {
        }

        /**
         * @private
         */
        private function leftHandleMouseMoveHandler(event:MouseEvent):void
        {
        }

        /**
         * @private
         */
        private function rightHandleMouseDownHandler(event:MouseEvent):void
        {
        }

        /**
         * @private
         */
        private function rightHandleMouseDownHandler(event:MouseEvent):void
        {
        }

        /**
         * @private
         */
        private function viewportMouseDownHandler(event:MouseEvent):void
        {
        }

    }
}
