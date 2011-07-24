/**
 * Provides modality support for Widgets, though an extension
 *
 * @module widget-modality
 */

var WIDGET         = 'widget',
    RENDER_UI       = 'renderUI',
    BIND_UI         = 'bindUI',
    SYNC_UI         = 'syncUI',
    BOUNDING_BOX    = 'boundingBox',
    CONTENT_BOX     = 'contentBox',
    VISIBLE         = 'visible',
    Z_INDEX         = 'zIndex',

    CHANGE          = 'Change',

    isBoolean       = Y.Lang.isBoolean,
    getCN           = Y.ClassNameManager.getClassName,

    supportsPosFixed = (function(){

        /*! IS_POSITION_FIXED_SUPPORTED - Juriy Zaytsev (kangax) - http://yura.thinkweb2.com/cft/ */

        var isSupported = null,
            el, root;

        if (document.createElement) {
            el = document.createElement('div');
            if (el && el.style) {
                el.style.position = 'fixed';
                el.style.top = '10px';
                root = document.body;
                if (root && root.appendChild && root.removeChild) {
                    root.appendChild(el);
                    isSupported = (el.offsetTop === 10);
                    root.removeChild(el);
                }
            }
        }

        return isSupported;
    }());

    /**
     * Widget extension, which can be used to add modality support to the base Widget class, 
     * through the <a href="Base.html#method_build">Base.build</a> method.
     *
     * @class WidgetModality
     * @param {Object} config User configuration object
     */
    function WidgetModal(config) {
        this._initModality();

    }

    var MODAL           = 'modal',
        MASK            = 'mask',
        MODAL_CLASSES   = {
            modal   : getCN(WIDGET, MODAL),
            mask    : getCN(WIDGET, MASK)
        };

    /**
    * Static property used to define the default attribute 
    * configuration introduced by WidgetModality.
    *
    * @property WidgetModality.ATTRS
    * @static
    * @type Object
    */
    WidgetModal.ATTRS = {
            /**
             * @attribute maskNode
             * @type Y.Node
             *
             * @description Returns a Y.Node instance of the node being used as the mask.
             */
            maskNode : {
                getter      : '_getMaskNode',
                readOnly    : true
            },


            /**
             * @attribute modal
             * @type boolean
             *
             * @description Whether the widget should be modal or not.
             */
            modal: {
                value:true,
                validator: isBoolean
            }

    };


    WidgetModal.CLASSES = MODAL_CLASSES;


    /**
     * Returns the mask if it exists on the page - otherwise creates a mask. There's only
     * one mask on a page at a given time.
     * <p>
     * This method in invoked internally by the getter of the maskNode ATTR.
     * </p>
     * @method _GET_MASK
     * @static
     */
    WidgetModal._GET_MASK = function() {

        var mask = Y.one(".yui3-widget-mask") || null;

        if (mask) {
            return mask;
        }
        else {
            
            mask = Y.Node.create('<div></div>');
            mask.addClass(MODAL_CLASSES.mask);
            mask.setStyles({
                position    : supportsPosFixed ? 'fixed' : 'absolute',
                width       : '100%',
                height      : '100%',
                top         : '0',
                left        : '0',
                display     : 'block'
            });

            return mask;
        }

    };
        
    /**
     * A stack of Y.Widget objects representing the current hierarchy of modal widgets presently displayed on the screen
     * @property STACK
     */
    WidgetModal.STACK = [];    


    WidgetModal.prototype = {

        // *** Instance Members *** //

        _maskNode   : WidgetModal._GET_MASK(),
        _uiHandles  : null,

        /**
         * Synchronizes the UI and hooks up methods to the widget's lifecycle.
         * <p>
         * This method in invoked upon initialization of the widget.
         * </p>
         * @method _initModality
         * @protected
         */
        _initModality : function() {
          
          if (this.get('modal')) {
              Y.after(this._renderUIModal, this, RENDER_UI);
              Y.after(this._syncUIModal, this, SYNC_UI);
              Y.after(this._bindUIModal, this, BIND_UI);
          }

          if (this.get('rendered')) {
              this._renderUIModal;
              this._syncUIModal;
              this._bindUIModal;
          }
            
        },



        /**
         * Adds modal class to the bounding box of the widget
         * <p>
         * This method in invoked after renderUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _renderUIModal
         * @protected
         */
        _renderUIModal : function () {
            
            var bb = this.get(BOUNDING_BOX);
                //cb = this.get(CONTENT_BOX);

            //this makes the content box content appear over the mask
            // cb.setStyles({
            //     position: ""
            // });

            //this._repositionMask(this);
            bb.addClass(MODAL_CLASSES.modal);

        },


        /**
         * Hooks up methods to be executed when the widget's visibility or z-index changes
         * <p>
         * This method in invoked after bindUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _bindUIModal
         * @protected
         */
        _bindUIModal : function () {

            this.after(VISIBLE+CHANGE, this._afterHostVisibleChange);
            this.after(Z_INDEX+CHANGE, this._afterHostZIndexChange);
        },

        /**
         * Syncs the mask with the widget's current state, namely the visibility and z-index of the widget
         * <p>
         * This method in invoked after syncUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * </p>
         * @method _syncUIModal
         * @protected
         */
        _syncUIModal : function () {

            //var host = this.get(HOST);

            this._uiSetHostVisible(this.get(VISIBLE));
            this._uiSetHostZIndex(this.get(Z_INDEX));

        },

        /**
         * Provides mouse and tab focus to the widget's bounding box.
         *
         * @method _focus
         */
        _focus : function (e) {

            var bb = this.get(BOUNDING_BOX),
            oldTI = bb.get('tabIndex');

            bb.set('tabIndex', oldTI >= 0 ? oldTI : 0);
            this.focus();
        },
        /**
         * Blurs the widget.
         *
         * @method _blur
         */
        _blur : function () {

            this.blur();
        },

        /**
         * Returns the Y.Node instance of the maskNode
         *
         * @method _getMaskNode
         * @return {Y.Node} The Y.Node instance of the mask, as returned from WidgetModal._GET_MASK
         */
        _getMaskNode : function () {

            return WidgetModal._GET_MASK();
        },

        /**
         * Performs events attaching/detaching, stack shifting and mask repositioning based on the visibility of the widget
         *
         * @method _uiSetHostVisible
         * @param {boolean} Whether the widget is visible or not
         */
        _uiSetHostVisible : function (visible) {
            var stack = WidgetModal.STACK,
                topModal,
                maskNode = this.get('maskNode'),
                isModal = this.get('modal');
            
            if (visible) {
            
                Y.Array.each(stack, function(modal){
                    modal._detachUIHandles();
                    modal._blur();
                });
                
                // push on top of stack
                stack.unshift(this);
                
                //this._attachUIHandles();
                this._repositionMask(this);
                this._uiSetHostZIndex(this.get(Z_INDEX));
                WidgetModal._GET_MASK().show();
                
                if (isModal) {
                    //this._attachUIHandles();
                    Y.later(1, this, '_attachUIHandles');
                    this._focus();
                }
                
                
            } else {
            
                stack.splice(Y.Array.indexOf(stack, this), 1);
                this._detachUIHandles();
                this._blur();
                
                if (stack.length) {
                    topModal = stack[0];                    
                    this._repositionMask(topModal);
                    //topModal._attachUIHandles();
                    topModal._uiSetHostZIndex(topModal.get(Z_INDEX));

                    if (topModal.get('modal')) {
                        //topModal._attachUIHandles();
                        Y.later(1, topModal, '_attachUIHandles');
                        topModal._focus();
                    }
                    
                } else {

                    if (maskNode.getStyle('display') === 'block') {
                        maskNode.hide();
                    }
                    
                }
                
            }
        },

        /**
         * Sets the z-index of the mask node.
         *
         * @method _uiSetHostZIndex
         * @param {Number} Z-Index of the widget
         */
        _uiSetHostZIndex : function (zIndex) {

            if (this.get('modal')) {
                this.get('maskNode').setStyle(Z_INDEX, zIndex || 0);
            }
            
        },

        /**
         * Attaches UI Listeners for "clickoutside" and "focusoutside" on the widget. When these events occur, and the widget is modal, focus is shifted back onto the widget.
         *
         * @method _attachUIHandles
         */
        _attachUIHandles : function () {

            if (this._uiHandles) { return; }

            var bb = this.get(BOUNDING_BOX),
            maskNode = this.get('maskNode');

            this._uiHandles = [
                bb.on('clickoutside', Y.bind(this._focus, this)),
                bb.on('focusoutside', Y.bind(this._focus, this))
            ];

            if ( ! supportsPosFixed) {
                this._uiHandles.push(Y.one('win').on('scroll', Y.bind(function(e){
                    maskNode.setStyle('top', maskNode.get('docScrollY'));
                }, this)));
            }
        },

        /**
         * Detaches all UI Listeners that were set in _attachUIHandles from the widget. 
         *
         * @method _detachUIHandles
         */
        _detachUIHandles : function () {
            Y.each(this._uiHandles, function(h){
                h.detach();
            });
            this._uiHandles = null;
        },

        /**
         * Default function that is called when visibility is changed on the widget. 
         *
         * @method _afterHostVisibleChange
         * @param {EventFacade} e The event facade of the change
         */
        _afterHostVisibleChange : function (e) {

            this._uiSetHostVisible(e.newVal);
        },

        /**
         * Default function that is called when z-index is changed on the widget. 
         *
         * @method _afterHostZIndexChange
         * @param {EventFacade} e The event facade of the change
         */
        _afterHostZIndexChange : function (e) {

            this._uiSetHostZIndex(e.newVal);
        },

        /**
         * Returns a boolean representing whether the current widget is in a "nested modality" state.
         * This is done by checking the number of widgets currently on the stack.
         *
         * @method isNested
         * @public
         */
        isNested: function() {
            var length = WidgetModal.STACK.length,
            retval = (length > 1) ? true : false;
            return retval;
        },

        /**
         * Repositions the mask in the DOM for nested modality cases.
         *
         * @method _repositionMask
         * @param {Y.Widget} nextElem The Y.Widget instance that will be visible in the stack once the current widget is closed.
         */
        _repositionMask: function(nextElem) {

            var currentModal = this.get('modal'),
            nextModal = nextElem.get('modal'),
            maskNode = this.get('maskNode'),
            bb;


            //if this is modal and host is not modal
            if (currentModal && !nextModal) {
                //leave the mask where it is, since the host is not modal.
                maskNode.remove();
            }

            //if the main widget is not modal but the host is modal, or both of them are modal
            else if ((!currentModal && nextModal) || (currentModal && nextModal)) {

                //then remove the mask off DOM, reposition it, and reinsert it into the DOM
                maskNode.remove();
                bb = nextElem.get(BOUNDING_BOX),
                bbParent = bb.get('parentNode') || Y.one('body');
                bbParent.insert(maskNode, bbParent.get('firstChild'));
            }
            
        }
    };

    Y.WidgetModality = WidgetModal;

