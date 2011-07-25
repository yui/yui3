/**
 * "widget-autohide" is a widget-level plugin that allows widgets to be hidden
 * when certain events occur.
 *
 * By default, the widget will be hidden when the following events occur
 * <ul>
 *   <li>something is clicked outside the widget's bounding box</li>
 *   <li>something is focussed outside the widget's bounding box</li>
 *   <li>the escape key is pressed</li>
 * </ul>
 *
 * Events can be added or removed from this list through the "hideOn" attribute.
 * The following code demonstrates how to do this. Suppose I want to close the widget when
 * another node is resized.
 * <code>widget.plug(Y.Plugin.Autohide, {hideOn: [{node: resize, eventName: 'resize:end'}]});</code>.
 * The hideOn attribute must be an array of objects. For more details on this attribute, refer to the API docs for it.
 *
 * This module was originally part of the overlay-extras package by Eric Ferraiuolo but was promoted and abstracted
 * into the core library.
 *
 * @module widget-autohide
 * @author eferraiuolo, tilomitra
 * @since 3.4.0
 */


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
    CHANGE              = 'Change',

    getCN               = Y.ClassNameManager.getClassName;

function WidgetAutohide(config) {
    this._initAutohide();

}

WidgetAutohide.ATTRS = {
    hideOn: {
        value: [
            // {
            //     eventName: CLICK_OUTSIDE
            // },
            // {
            //     eventName: FOCUS_OUTSIDE
            // },

            {
                node: Y.one(DOCUMENT),
                eventName: KEY,
                keyCode: PRESS_ESCAPE
            }
        ],
        validator: Y.Lang.isArray
    }
};

WidgetAutohide.prototype = {
    // *** Instance Members *** //

        _uiHandlesAutohide : null,

        // *** Lifecycle Methods *** //

        _initAutohide : function (config) {
            Y.after(this._bindUIAutohide, this, BIND_UI);
            Y.after(this._syncUIAutohide, this, SYNC_UI);


            if (this.get(RENDERED)) {
                this._bindUIAutohide();
                this._syncUIAutohide();
            }
        },

        destructor : function () {

            this._detachUIHandlesAutohide();
        },

        _bindUIAutohide : function () {

            this.after(VISIBLE+CHANGE, this._afterHostVisibleChangeAutohide);
        },

        _syncUIAutohide : function () {

            this._uiSetHostVisibleAutohide(this.get(VISIBLE));
        },

        // *** Private Methods *** //

        _uiSetHostVisibleAutohide : function (visible) {

            if (visible) {
                this._attachUIHandlesAutohide();
                //Y.later(1, this, '_attachUIHandlesAutohide');
            } else {
                this._detachUIHandlesAutohide();
            }
        },

        _attachUIHandlesAutohide : function () {

            if (this._uiHandlesAutohide) { return; }

            var bb = this.get(BOUNDING_BOX),
                hide = Y.bind(this.hide,this),
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

            this._uiHandlesAutohide = uiHandles;
        },

        _detachUIHandlesAutohide : function () {

            Y.each(this._uiHandlesAutohide, function(h){
                h.detach();
            });
            this._uiHandlesAutohide = null;
        },

        _afterHostVisibleChangeAutohide : function (e) {

            this._uiSetHostVisibleAutohide(e.newVal);
        }
}


Y.WidgetAutohide = WidgetAutohide;