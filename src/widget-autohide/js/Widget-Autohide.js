var WIDGET_AUTOHIDE    = 'widgetAutohide',
    AUTOHIDE            = 'autohide',
    CLICK_OUTSIDE     = 'clickoutside',
    FOCUS_OUTSIDE     = 'focusoutside',
    DOCUMENT            = 'doc',
    KEY                 = 'key',
    PRESS_ESCAPE         = 'esc',
    BIND_UI             = 'bindUI',
    SYNC_UI             = "syncUI",
    RENDERED            = "rendered",
    BOUNDING_BOX        = "boundingBox",
    VISIBLE             = "visible",
    HOST                = "host",
    CHANGE              = 'Change',

    getCN               = Y.ClassNameManager.getClassName;


WidgetAutohide = Y.Base.create(WIDGET_AUTOHIDE, Y.Plugin.Base, [], {

    // *** Instance Members *** //

    _uiHandles : null,

    // *** Lifecycle Methods *** //

    initializer : function (config) {

        this.afterHostMethod(BIND_UI, this.bindUI);
        this.afterHostMethod(SYNC_UI, this.syncUI);

        if (this.get(HOST).get(RENDERED)) {
            this.bindUI();
            this.syncUI();
        }
    },

    destructor : function () {

        this._detachUIHandles();
    },

    bindUI : function () {

        this.afterHostEvent(VISIBLE+CHANGE, this._afterHostVisibleChange);
    },

    syncUI : function () {

        this._uiSetHostVisible(this.get(HOST).get(VISIBLE));
    },

    // *** Private Methods *** //

    _uiSetHostVisible : function (visible) {

        if (visible) {
            //this._attachUIHandles();
            Y.later(1, this, '_attachUIHandles');
        } else {
            this._detachUIHandles();
        }
    },

    _attachUIHandles : function () {

        if (this._uiHandles) { return; }

        var host = this.get(HOST),
            bb = host.get(BOUNDING_BOX),
            hide = Y.bind(host.hide, host),
            uiHandles = [],
            self = this,
            hideOn = this.get('hideOn'),
            i = 0,
            o = {node: undefined, ev: undefined, keyCode: undefined};

            //push all events on which the widget should be hidden
            for (; i < hideOn.length; i++) {
                
                o.node = hideOn[i].node;
                o.ev = hideOn[i].eventName;
                o.keyCode = hideOn[i].keyCode;

                //no keycode or node defined
                if (!o.node && !o.keyCode && o.ev) {
                    uiHandles.push(bb.on(o.ev, hide));
                }

                //node defined, no keycode (not a keypress)
                else if (o.node && !o.keyCode && o.ev) {
                    uiHandles.push(o.node.on(o.ev, hide));
                }

                //node defined, keycode defined, event defined (its a key press)
                else if (o.node && o.keyCode && o.ev) {
                    uiHandles.push(o.node.on(o.ev, hide, o.keyCode));
                }
                
                else {
                    Y.Log('The event with name "'+o.ev+'" could not be attached.');
                }
                
            }

        this._uiHandles = uiHandles;
    },

    _detachUIHandles : function () {

        Y.each(this._uiHandles, function(h){
            h.detach();
        });
        this._uiHandles = null;
    },

    _afterHostVisibleChange : function (e) {

        this._uiSetHostVisible(e.newVal);
    }

}, {

    // *** Static *** //

    NS : AUTOHIDE,

    ATTRS : {

        hideOn: {
            value: [
                {
                    eventName: CLICK_OUTSIDE
                },
                {
                    eventName: FOCUS_OUTSIDE
                },

                {
                    node: Y.one(DOCUMENT),
                    eventName: KEY,
                    keyCode: PRESS_ESCAPE
                }
            ],
            validator: Y.Lang.isArray
        }
    }

});

Y.namespace("Plugin").Autohide = WidgetAutohide;