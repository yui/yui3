YUI.add('widget-modality', function(Y) {

var WIDGET         = 'widget',
    HOST            = 'host',
    RENDER_UI       = 'renderUI',
    BIND_UI         = 'bindUI',
    SYNC_UI         = 'syncUI',
    RENDERED        = 'rendered',
    BOUNDING_BOX    = 'boundingBox',
    CONTENT_BOX     = 'contentBox',
    VISIBLE         = 'visible',
    Z_INDEX         = 'zIndex',
    ALIGN           = 'align',

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
    }()),

    WidgetModal;

(function(){

    var WIDGET_MODAL   = 'widgetModal',
        MODAL           = 'modal',
        MASK            = 'mask',
        MODAL_CLASSES   = {
            modal   : getCN(WIDGET, MODAL)
        },
        MODAL_ID        = {
            mask    : getCN(WIDGET, MASK)
        };

    WidgetModal = Y.Base.create(WIDGET_MODAL, Y.Plugin.Base, [], {

        // *** Instance Members *** //
        _maskNode   : null,
        _uiHandles  : null,

        // *** Lifecycle Methods *** //

        initializer : function (config) {
            var self = this;
            this.afterHostMethod(RENDER_UI, this.renderUI);
            this.afterHostMethod(BIND_UI, this.bindUI);
            this.afterHostMethod(SYNC_UI, this.syncUI);

            if (this.get(HOST).get(RENDERED)) {
                this.renderUI();
                this.bindUI();
                this.syncUI();
            }

            this._maskNode = WidgetModal._GET_MASK();
        },

        destructor : function () {

            if (this._maskNode) {
                this._maskNode.remove(true);
            }

            this._detachUIHandles();
            this.get(HOST).get(BOUNDING_BOX).removeClass(MODAL_CLASSES.modal);
        },

        renderUI : function () {
            
            var bb = this.get(HOST).get(BOUNDING_BOX),
                cb = this.get(HOST).get(CONTENT_BOX);

            //this makes the content box content appear over the mask
            cb.setStyles({
                position: "relative"
            });

            this._repositionMask(this.get(HOST));
            bb.addClass(MODAL_CLASSES.modal);

        },

        bindUI : function () {

            this.afterHostEvent(VISIBLE+CHANGE, this._afterHostVisibleChange);
            this.afterHostEvent(Z_INDEX+CHANGE, this._afterHostZIndexChange);
        },

        syncUI : function () {

            var host = this.get(HOST);

            this._uiSetHostVisible(host.get(VISIBLE));
            this._uiSetHostZIndex(host.get(Z_INDEX));

        },

        // *** Private Methods *** //

        _focus : function (e) {

            
            var host = this.get(HOST),
                bb = host.get(BOUNDING_BOX),
                oldTI = bb.get('tabIndex');

            bb.set('tabIndex', oldTI >= 0 ? oldTI : 0);
            host.focus();
            //Y.later(0, host, 'focus');

            //this._detachUIHandles();
            //host.focus();
            //bb.set('tabIndex', oldTI);
        },

        _blur : function () {

            this.get(HOST).blur();
        },

        _getMaskNode : function () {

            return WidgetModal._GET_MASK();
        },

        _uiSetHostVisible : function (visible) {

            var self = this,
            id = this.get(HOST).get('id'),
            len = WidgetModal.STACK.length;


            //whatever is at the top of the stack receives focus, everything else is blurred.
            //in this case, the element is visible, so it goes to the top of stack and gets focus
            if (visible) {

                //blur everything in the stack
                for (var i = 0; i < len; i++) {
                    WidgetModal.STACK[i].modal._detachUIHandles();
                    WidgetModal.STACK[i].modal._blur();
                }

                //push the current instance to top of stack
                WidgetModal.STACK.push({
                    host: self.get('host'), 
                    modal: self,
                    id: id
                });

                console.log(WidgetModal.STACK);

                //attach ui handles to the current element, show mask, and focus
                this._attachUIHandles();

                this._repositionMask(this.get(HOST));
                this._uiSetHostZIndex(this.get(HOST).get(Z_INDEX));
                this._maskNode.setStyle('display', 'block');
                this._focus();

            } 
            
            //if it just lost visibility (was hidden)
            else {

                //pop the hidden element off the stack.
                for (var j = 0; j < WidgetModal.STACK.length; j++) {
                    if (WidgetModal.STACK[j].id === id) {

                        //pop the hidden element off the stack.
                        var o = WidgetModal.STACK.pop();

                        console.log(WidgetModal.STACK);

                        //detach UI handles and blur it.
                        o.modal._detachUIHandles();
                        o.modal._blur();

                    }
                }


                //if nothing else is in the stack, then hide the mask
                if (WidgetModal.STACK.length === 0) {
                    this._maskNode.setStyle('display', 'none');
                }


                //if something else is on the stack, it means it's still visible (behind the element that was just hidden)
                //in this case, go to the next thing on the stack, and reposition the mask behind it
                else  {

                    var host = WidgetModal.STACK[WidgetModal.STACK.length - 1].host;
                    this._repositionMask(host);
                    host.modal.bindUI();
                    host.modal._attachUIHandles();
                    //host.modal.syncUI();
                    host.modal._uiSetHostZIndex(host.get(Z_INDEX));
                    host.modal._focus();
                }
            }
        },

        _uiSetHostZIndex : function (zIndex) {

            this._maskNode.setStyle(Z_INDEX, zIndex || 0);
        },

        _attachUIHandles : function (modal) {

            if (this._uiHandles) { return; }

            var host = this.get(HOST),
                bb = host.get(BOUNDING_BOX);

            this._uiHandles = [
                bb.on('clickoutside', Y.bind(this._focus, this)),
                bb.on('focusoutside', Y.bind(this._focus, this)),
            ];

            if ( ! supportsPosFixed) {
                this._uiHandles.push(Y.one('win').on('scroll', Y.bind(function(e){
                    var maskNode = this._maskNode;
                    maskNode.setStyle('top', maskNode.get('docScrollY'));
                }, this)));
            }
        },

        _detachUIHandles : function () {
            console.log(this);
            Y.each(this._uiHandles, function(h){
                h.detach();
            });
            this._uiHandles = null;
        },

        _afterHostVisibleChange : function (e) {

            this._uiSetHostVisible(e.newVal);
        },

        _afterHostZIndexChange : function (e) {

            this._uiSetHostZIndex(e.newVal);
        },

        _isNested: function() {
            var m = WidgetModal._GET_MASK();
            return m.get(VISIBLE);
        },

        //w is the host behind which mask should be repositioned
        _repositionMask: function(host) {
            //get rid of the mask and reposition it behind the last element in the stack
            this._maskNode.remove();
            var bb = host.get(BOUNDING_BOX),
            bbParent = bb.get('parentNode') || Y.one('body');
            bbParent.insert(this._maskNode, bbParent.get('firstChild'));
        }

    }, {

        // *** Static *** //

        NS      : MODAL,

        ATTRS   : {

            maskNode : {
                getter      : '_getMaskNode',
                readOnly    : true
            },

            node: {
                value: undefined
            }

        },

        CLASSES : MODAL_CLASSES,

        //Returns the mask if it exists on the page - otherwise creates a mask. There's only
        //one mask on a page at a given time.

        _GET_MASK: function() {

            var mask = Y.one("#yui3-widget-mask") || null;

            if (mask) {
                return mask;
            }
            else {
                
                mask = Y.Node.create('<div></div>');
                mask.set('id', MODAL_ID.mask);
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

        },
        
        //associative array of objects
        STACK: []    

    });
    Y.namespace("Plugin").Modal = WidgetModal;

}());


}, '@VERSION@' ,{requires:['widget','plugin','gallery-outside-events']});
