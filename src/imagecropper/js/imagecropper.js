/**
@description <p>Creates an Image Cropper control.</p>
@requires widget,dd-drag,dd-constrain,resize-base,resize-constrain
@module imagecropper
*/

var Lang = Y.Lang,
    isNumber = Lang.isNumber,
    YArray = Y.Array,
    getClassName = Y.ClassNameManager.getClassName,
    IMAGE_CROPPER = 'imagecropper',
    RESIZE = 'resize',
    
    _classNames = {
        cropMask: getClassName(IMAGE_CROPPER, 'mask'),
        resizeKnob: getClassName(IMAGE_CROPPER, RESIZE, 'knob'),
        resizeMask: getClassName(IMAGE_CROPPER, RESIZE, 'mask')
    };

/**
@constructor
@class ImageCropper
@description <p>Creates an Image Cropper control.</p>
@extends Widget
@param {Object} config Object literal containing configuration parameters.
*/
function ImageCropper() {
    ImageCropper.superclass.constructor.apply(this, arguments);
}
Y.extend(ImageCropper, Y.Widget, {
    
    /**
    Template that will contain the ImageCropper's mask.
    
    @property ImageCropper.CROP_MASK_TEMPLATE
    @type {HTML}
    @default &lt;div class="[...-mask]">&lt;/div>
    */
    CROP_MASK_TEMPLATE: '<div class="' + _classNames.cropMask + '"></div>',
    /**
    Template that will contain the ImageCropper's resize node.
    
    @property ImageCropper.RESIZE_KNOB_TEMPLATE
    @type {HTML}
    @default &lt;div class="[...-resize-knob]" tabindex="0">&lt;/div>
    */
    RESIZE_KNOB_TEMPLATE: '<div class="' + _classNames.resizeKnob + '" tabindex="0"></div>',
    /**
    Template that will contain the ImageCropper's resize mask.
    
    @property ImageCropper.RESIZE_MASK_TEMPLATE
    @type {HTML}
    @default &lt;div class="[...-resize-mask]">&lt;/div>
    */
    RESIZE_MASK_TEMPLATE: '<div class="' + _classNames.resizeMask + '"></div>',
    
    CONTENT_TEMPLATE: '<img/>',
    
    /**
    An object containing the classnames used for all nodes in ImageCropper.
    Note that changing this object doesn't change the classnames in the
    default templates or in HTML_PARSER.

    @property CLASS_NAMES
    @type {Object}
    */
    CLASS_NAMES: _classNames,
    

    /**
    @method _defCropMaskValueFn
    @protected
    */
    _defCropMaskValueFn: function () {
        return Y.Node.create(this.CROP_MASK_TEMPLATE);
    },

    /**
    @method _defResizeKnobValueFn
    @protected
    */
    _defResizeKnobValueFn: function () {
        return Y.Node.create(this.RESIZE_KNOB_TEMPLATE);
    },

    /**
    @method _defResizeMaskValueFn
    @protected
    */
    _defResizeMaskValueFn: function () {
        return Y.Node.create(this.RESIZE_MASK_TEMPLATE);
    },

    /**
    @method _defResizeMaskValueFn
    @protected
    */
    _defInitWidthSetter: function (value) {
        var minHeight = this.get('minHeight');
        return value < minHeight ? minHeight : value;
    },

    /**
    @method _defInitHeightSetter
    @protected
    */
    _defInitHeightSetter: function (value) {
        var minWidth = this.get('minWidth');
        return value < minWidth ? minWidth : value;
    },

    /**
    @method _defStatusGetter
    @protected
    */
    _defStatusGetter: function () {
        var resizing = this.resize ? this.resize.get('resizing') : false,
            dragging = this.drag ? this.drag.get('dragging') : false;
        return resizing || dragging;
    },
    
    /**
    @method _renderCropMask
    @param {Node} boundingBox
    @protected
    */
    _renderCropMask: function (boundingBox) {
        var node = this.get('cropMask').addClass(this.CLASS_NAMES.cropMask);
        if (!node.inDoc()) {
            boundingBox.append(node);
        }
    },

    /**
    @method _renderResizeKnob
    @param {Node} boundingBox
    @protected
    */
    _renderResizeKnob: function (boundingBox) {
        var node = this.get('resizeKnob').addClass(this.CLASS_NAMES.resizeKnob);
        if (!node.inDoc()) {
            boundingBox.append(node);
        }
        node.setStyle('backgroundImage', 'url(' + this.get('source') + ')');
    },

    /**
    @method _renderResizeKnob
    @protected
    */
    _renderResizeMask: function () {
        var node = this.get('resizeMask').addClass(this.CLASS_NAMES.resizeMask);
        if (!node.inDoc()) {
            this.get('resizeKnob').append(node);
        }
    },

    /**
    Handles the `sourceChange` event.
    Sets the corresponding source to the image being cropped.

    @method _handleSrcChange
    @param {EventFacade} e
    @private
    */
    _handleSrcChange: function (e) {
        this.get('contentBox').set('src', e.newVal);
        this.get('resizeKnob').setStyle('backgroundImage', 'url(' + e.newVal + ')');
    },
    
    /**
    @method _syncResizeKnob
    @private
    */
    _syncResizeKnob: function () {
        var initialXY = this.get('initialXY');
        
        this.get('resizeKnob').setStyles({
            left: initialXY[0],
            top: initialXY[1],
            width: this.get('initWidth'),
            height: this.get('initHeight')
        });
    },
    
    /**
    @method _syncResizeMask
    @private
    */
    _syncResizeMask: function () {
        var resizeKnob = this.get('resizeKnob');
        resizeKnob.setStyle('backgroundPosition',
            (-resizeKnob.get('offsetLeft')) + 'px ' + 
            (-resizeKnob.get('offsetTop')) + 'px'
        );
    },
    
    /**
    @method _syncResizeAttr
    @private
    */
    _syncResizeAttr: function (e) {
        var resizeKnob = this.get('resizeKnob');
        if (resizeKnob.resize) {
            resizeKnob.resize.con.set(e.attrName, e.newVal);
        }
    },
    
    _icEventProxy: function (target, ns, eventType) {
        var sourceEvent = ns + ':' + eventType,
            resizeKnob = this.get('resizeKnob');
            
        target.on(sourceEvent, function (e) {
            
            var o = {
                width: resizeKnob.get('offsetWidth'),
                height: resizeKnob.get('offsetHeight'),
                left: resizeKnob.get('offsetLeft'),
                top: resizeKnob.get('offsetTop')
            };
            o[ns + 'Event'] = e;
            
            /**
           @event resize:start
           @description Relay of the Resize utility event.
           @param {EventFacade} event An Event Facade object with the following specific property added:
           <dl>
           <dt>resizeEvent</dt><dd>The Event Facade object provided by the Resize utility.</dd>
           </dl>
           @type {CustomEvent}
           */
            /**
           @event resize:resize
           @description Relay of the Resize utility event.
           @param {EventFacade} event An Event Facade object with the following specific property added:
           <dl>
           <dt>resizeEvent</dt><dd>The Event Facade object provided by the Resize utility.</dd>
           </dl>
           @type {CustomEvent}
           */
            /**
           @event resize:end
           @description Relay of the Resize utility event.
           @param {EventFacade} event An Event Facade object with the following specific property added:
           <dl>
           <dt>resizeEvent</dt><dd>The Event Facade object provided by the Resize utility.</dd>
           </dl>
           @type {CustomEvent}
           */
            /**
           @event drag:start
           @description Relay of the Drag utility event.
           @param {EventFacade} event An Event Facade object with the following specific property added:
           <dl>
           <dt>drag</dt><dd>The Event Facade object provided by the Drag utility.</dd>
           </dl>
           @type {CustomEvent}
           */
            /**
           @event drag:resize
           @description Relay of the Drag utility event.
           @param {EventFacade} event An Event Facade object with the following specific property added:
           <dl>
           <dt>drag</dt><dd>The Event Facade object provided by the Drag utility.</dd>
           </dl>
           @type {CustomEvent}
           */
            /**
           @event drag:end
           @description Relay of the Drag utility event.
           @param {EventFacade} event An Event Facade object with the following specific property added:
           <dl>
           <dt>drag</dt><dd>The Event Facade object provided by the Drag utility.</dd>
           </dl>
           @type {CustomEvent}
           */
            this.fire(sourceEvent, o);
            
            o.sourceEvent = sourceEvent;
            
            /**
           @event crop:start
           @description Fires at the start of a crop operation. Unifies drag:start and and resize:start.
           @param {EventFacade} event An Event Facade object with the following specific property added:
           <dl>
           <dt>left</dt><dd>The current X position of the crop area relative to the base image.</dd>
           <dt>top</dt><dd>The current Y position of the crop area relative to the base image.</dd>
           <dt>width</dt><dd>The new width of the crop area.</dd>
           <dt>height</dt><dd>The new height of the crop area.</dd>
           </dl>
           @type {CustomEvent}
           */
            /**
           @event crop:crop
           @description Fires every time the crop area changes. Unifies drag:drag and resize:resize.
           @param {EventFacade} event An Event Facade object with the following specific property added:
           <dl>
           <dt>left</dt><dd>The current X position of the crop area relative to the base image.</dd>
           <dt>top</dt><dd>The current Y position of the crop area relative to the base image.</dd>
           <dt>width</dt><dd>The new width of the crop area.</dd>
           <dt>height</dt><dd>The new height of the crop area.</dd>
           </dl>
           @type {CustomEvent}
           */
            /**
           @event crop:end
           @description Fires at the end of a crop operation. Unifies drag:end and resize:end.
           @param {EventFacade} event An Event Facade object with the following specific property added:
           <dl>
           <dt>left</dt><dd>The current X position of the crop area relative to the base image.</dd>
           <dt>top</dt><dd>The current Y position of the crop area relative to the base image.</dd>
           <dt>width</dt><dd>The new width of the crop area.</dd>
           <dt>height</dt><dd>The new height of the crop area.</dd>
           </dl>
           @type {CustomEvent}
           */
            this.fire('crop:' + (eventType == ns ? 'crop' : eventType), o);
            
        }, this);
    },
    
    _bindResize: function (resizeKnob, contentBox) {
        var resize = this.resize = new Y.Resize({
            node: resizeKnob
        });
        resize.on('resize:resize', this._syncResizeMask, this);
        resize.plug(Y.Plugin.ResizeConstrained, {
            constrain: contentBox,
            minHeight: this.get('minHeight'),
            minWidth: this.get('minWidth'),
            preserveRatio: this.get('preserveRatio')
        });
        YArray.each(Y.ImageCropper.RESIZE_EVENTS, Y.bind(this._icEventProxy, this, resize, 'resize'));
    },
    
    _bindDrag: function (resizeKnob, contentBox) {
        var drag = this.drag = new Y.DD.Drag({
            node: resizeKnob,
            handles: [this.get('resizeMask')]
        });
        drag.after('drag:drag', this._syncResizeMask, this);
        drag.plug(Y.Plugin.DDConstrained, {
            constrain2node: contentBox
        });
        YArray.each(Y.ImageCropper.DRAG_EVENTS, Y.bind(this._icEventProxy, this, drag, 'drag'));
    },
    
    initializer: function () {
        this.set('initialXY', this.get('initialXY') || [10, 10]);
        this.set('initWidth', this.get('initWidth'));
        this.set('initHeight', this.get('initHeight'));

        this.after('sourceChange', this._handleSrcChange);
        
        YArray.each(Y.ImageCropper.RESIZE_ATTRS, function (attr) {
            this.after(attr + 'Change', this._syncResizeAttr);
        }, this);
    },
    
    renderUI: function () {
        var boundingBox = this.get('boundingBox');
        
        this._renderCropMask(boundingBox);
        this._renderResizeKnob(boundingBox);
        this._renderResizeMask();
    },
    
    bindUI: function () {
        var contentBox = this.get('contentBox'),
            resizeKnob = this.get('resizeKnob');
            
        this._bindResize(resizeKnob, contentBox);
        this._bindDrag(resizeKnob, contentBox);
    },
    
    syncUI: function () {
        this.get('contentBox').set('src', this.get('source'));
        
        this._syncResizeKnob();
        this._syncResizeMask();
    },
    
    /**
    Returns the coordinates needed to crop the image
    
    @method getCropCoords
    @return {Object} The top, left, height, width and image url of the image being cropped
    */
    getCropCoords: function () {
        var resizeKnob = this.get('resizeKnob'),
            result, xy;
        
        if (resizeKnob.inDoc()) {
            result = {
                left: resizeKnob.get('offsetLeft'),
                top: resizeKnob.get('offsetTop'),
                width: resizeKnob.get('offsetWidth'),
                height: resizeKnob.get('offsetHeight')
            };
        } else {
            xy = this.get('initialXY');
            result = {
                left: xy[0],
                top: xy[1],
                width: this.get('initWidth'),
                height: this.get('initHeight')
            };
        }
        result.image = this.get('source');
        
        return result;
    },
    
    /**
    Resets the crop element back to it's original position
    
    @method reset
    @chainable
    */
    reset: function () {
        var initialXY = this.get('initialXY');
        this.get('resizeKnob').setStyles({
            left: initialXY[0],
            top: initialXY[1],
            width: this.get('initWidth'),
            height: this.get('initHeight')
        });
        this._syncResizeMask();
        return this;
    },
    
    destructor: function () {
        if (this.resize) {
            this.resize.destroy();
        }
        if (this.drag) {
            this.drag.destroy();
        }
        
        this.drag = null;
        this.resize = null;
    }
    
}, {

    /**
    The identity of the widget.

    @property ImageCropper.NAME
    @type String
    @default 'imagecropper'
    @readOnly
    @protected
    @static
    */
    NAME: IMAGE_CROPPER,
    
    /**
    Array of events to relay from the Resize utility to the ImageCropper 
    
    @property ImageCropper.RESIZE_EVENTS
    @type {Array}
    @private
    @static
    */
    RESIZE_EVENTS: ['start', 'resize', 'end'],
    /**
    Array of attributes to relay from the ImageCropper to the Resize utility 

    @property ImageCropper.RESIZE_ATTRS
    @type {Array}
    @private
    @static
    */
    RESIZE_ATTRS: ['minWidth', 'minHeight', 'preserveRatio'],
    /**
    Array of events to relay from the Drag utility to the ImageCropper 

    @property ImageCropper.DRAG_EVENTS
    @type {Array}
    @private
    @static
    */
    DRAG_EVENTS: ['start', 'drag', 'end'],
    
    HTML_PARSER: {
        
        source: function (srcNode) {
            return srcNode.get('src');
        },
        
        cropMask: '.' + _classNames.cropMask,
        resizeKnob: '.' + _classNames.resizeKnob,
        resizeMask: '.' + _classNames.resizeMask
        
    },
    
    /**
    Static property used to define the default attribute configuration of
    the Widget.

    @property ImageCropper.ATTRS
    @type {Object}
    @protected
    @static
    */
    ATTRS: {
        
        /**
        The source attribute of the image we are cropping

        @attribute source
        @type {String}
        */
        source: { value: '' },
        
        /**
        The resize mask used to highlight the crop area

        @attribute resizeMask
        @type {Node}
        */
        resizeMask: {
            setter: Y.one,
            valueFn: '_defResizeMaskValueFn'
        },
        
        /**
        The resized element

        @attribute resizeKnob
        @type {Node|Selector}
        */
        resizeKnob: {
            setter: Y.one,
            valueFn: '_defResizeKnobValueFn'
        },
        
        /**
        Element used to shadow the part of the image we're not cropping

        @attribute cropMask
        @type {Node|Selector}
        */
        cropMask: {
            setter: Y.one,
            valueFn: '_defCropMaskValueFn'
        },
        
        /**
        Array of the XY position that we need to set the crop element to when we build it

        @attribute initialXY
        @type {Array}
        @default [10, 10]
        */
        initialXY: {
            validator: Lang.isArray
        },
        
        /**
        Show the Resize and Drag utilities status

        @attribute status
        @type {Boolean}
        @readOnly
        */
        status: {
            readOnly: true,
            getter: '_defStatusGetter'
        },
        
        /**
        MinHeight of the crop area

        @attribute minHeight
        @type {Number}
        @default 50
        */
        minHeight: {
            value: 50,
            validator: isNumber
        },
        
        /**
        MinWidth of the crop area

        @attribute minWidth
        @type {Number}
        @default 50
        */
        minWidth: {
            value: 50,
            validator: isNumber
        },
        
        /**
        Set the preserveRatio config option of the Resize Utlility

        @attribute preserveRatio
        @type {Boolean}
        @default false
        */
        preserveRatio: {
            value: false,
            validator: Lang.isBoolean
        },
        
        /**
        Set the initlal height of the crop area, defaults to minHeight
        
        @attribute initHeight
        @type {Number}
        */
        initHeight: {
            value: 0,
            validator: isNumber,
            setter: '_defInitHeightSetter'
        },
        
        /**
        Set the initlal width of the crop area, defaults to minWidth
        
        @attribute initWidth
        @type {Number}
        */
        initWidth: {
            value: 0,
            validator: isNumber,
            setter: '_defInitWidthSetter'
        }
        
    }
    
});

Y.ImageCropper = ImageCropper;