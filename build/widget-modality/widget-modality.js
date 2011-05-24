YUI.add('widget-modality', function(Y) {

var WIDGET         = 'widget',
    HOST            = 'host',
    RENDER_UI       = 'renderUI',
    BIND_UI         = 'bindUI',
    SYNC_UI         = 'syncUI',
    RENDERED        = 'rendered',
    BOUNDING_BOX    = 'boundingBox',
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
            modal   : getCN(WIDGET, MODAL),
            mask    : getCN(WIDGET, MASK)
        };

    WidgetModal = Y.Base.create(WIDGET_MODAL, Y.Plugin.Base, [], {

        // *** Instance Members *** //

        _maskNode   : null,
        _uiHandles  : null,

        // *** Lifecycle Methods *** //

        initializer : function (config) {

            this.afterHostMethod(RENDER_UI, this.renderUI);
            this.afterHostMethod(BIND_UI, this.bindUI);
            this.afterHostMethod(SYNC_UI, this.syncUI);

            if (this.get(HOST).get(RENDERED)) {
                this.renderUI();
                this.bindUI();
                this.syncUI();
            }

            this.get(HOST).on('visibleChange', this._increaseZIndex);
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
                bbParent = bb.get('parentNode') || Y.one('body');

                //Y.one('body').setStyle('background', 'rgba(0,0,0,0.5)');

            // this._maskNode = Y.Node.create('<div></div>');
            // this._maskNode.addClass(MODAL_CLASSES.mask);
            // this._maskNode.setStyles({
            //     position    : supportsPosFixed ? 'fixed' : 'absolute',
            //     width       : '100%',
            //     height      : '100%',
            //     top         : '0',
            //     left        : '0',
            //     display     : 'none'
            // });

            // bbParent.insert(this._maskNode, bbParent.get('firstChild'));
            // bb.addClass(MODAL_CLASSES.modal);

            var area = Y.one(this.get('node'));
            // this._maskNode = Y.Node.create('<div></div>');
            // this._maskNode.addClass(MODAL_CLASSES.mask);
            // this._maskNode.setStyles({
            //     position    : supportsPosFixed ? 'fixed' : 'absolute',
            //     width       : area.get('offsetWidth'),
            //     height      : area.get('offsetHeight'),
            //     top         : area.get('top'),
            //     left        : area.get('left'),
            //     display     : 'none'
            // });

            //bbParent.insert(this._maskNode, bbParent.get('firstChild'));
            area.addClass(MODAL_CLASSES.mask);
            bb.setStyle('zIndex', area.get('zIndex')+1);

            // this.get(HOST).on('visibleChange', function(e) {
            //     Y.one('#important').setStyle('background', 'rgba(255,255,255,1)');
            // });
            

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



        _allowFocus: function() {
          var a = ['#special'];
          
          for (var i = 0; i < a.length; i++){
            console.log(Y.one(a[i]));
            Y.one(a[i]).setStyle('zIndex', 5000);
          }  
        },

        _focus : function (e) {

            if (e) { console.log(e.currentTarget.getDOMNode().activeElement); }
            var host = this.get(HOST),
                bb = host.get(BOUNDING_BOX),
                oldTI = bb.get('tabIndex');

            bb.set('tabIndex', oldTI >= 0 ? oldTI : 0);

            host.focus();
            bb.set('tabIndex', oldTI);
        },

        _blur : function () {

            this.get(HOST).blur();
        },

        _getMaskNode : function () {

            return this._maskNode;
        },

        _uiSetHostVisible : function (visible) {

            if (visible) {
                Y.later(1, this, '_attachUIHandles');
                //this._maskNode.setStyle('display', 'block');
                this._focus();
            } else {
                this._detachUIHandles();
                //this._maskNode.setStyle('display', 'none');
                this._blur();
            }
        },

        _uiSetHostZIndex : function (zIndex) {

            //this._maskNode.setStyle(Z_INDEX, zIndex || 0);
        },

        _attachUIHandles : function (modal) {

            if (this._uiHandles) { return; }

            var host = this.get(HOST),
                bb = host.get(BOUNDING_BOX);

            this._uiHandles = [
                bb.on('clickoutside', Y.bind(this._focus, this)),
                bb.on('focusoutside', Y.bind(this._focus, this)),
                bb.on('selectoutside', Y.bind(this._focus, this))
            ];

            if ( ! supportsPosFixed) {
                this._uiHandles.push(Y.one('win').on('scroll', Y.bind(function(e){
                    var maskNode = this._maskNode;
                    //maskNode.setStyle('top', maskNode.get('docScrollY'));
                }, this)));
            }
        },

        _detachUIHandles : function () {

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

        CLASSES : MODAL_CLASSES

    });
    Y.namespace("Plugin").Modal = WidgetModal;

}());


}, '@VERSION@' ,{requires:['widget','plugin','gallery-outside-events']});
