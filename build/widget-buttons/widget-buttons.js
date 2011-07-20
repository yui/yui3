YUI.add('widget-buttons', function(Y) {

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


var BOUNDING_BOX        = "boundingBox",
    VISIBLE             = "visible",
    CLICK               = "click",
    RENDER_UI           = "renderUI",
    BIND_UI             = "bindUI",
    SYNC_UI             = "syncUI",
    BTN                 = "button",
    BTN_CONTENT         = "button-content",
    BTN_WRAPPER         = "button-wrapper",
    BUTTON_CHANGE       = "buttonsChange",
    getCN               = Y.ClassNameManager.getClassName,
    CREATE              = Y.Node.create;

function WidgetButtons(config) {

    Y.after(this._renderUIButtons, this, RENDER_UI);
    Y.after(this._bindUIButtons, this, BIND_UI);
    Y.after(this._syncUIButtons, this, SYNC_UI);

}

WidgetButtons.ATTRS = {
    buttons: {

        //available options are: value, href, defaultFn
        value: [
            {
                value: 'Close',
                defaultFn: function(e) {
                    //alert("I pressed close");
                    this.hide();
                },
                section: Y.WidgetStdMod.HEADER
            }
        ],
        validator: Y.Lang.isArray
    }

};
WidgetButtons.BUTTON_CLASS_NAMES = {
    button: getCN(BTN),
    Content: getCN(BTN_CONTENT),
    wrapper: Y.Widget.getClassName(BTN_WRAPPER)
};

WidgetButtons.TEMPLATES = {
    defaultTemplate: "<a href={href} class='"+WidgetButtons.BUTTON_CLASS_NAMES.button+"'><span class='"+WidgetButtons.BUTTON_CLASS_NAMES.Content+"'>{value}</a>",
    wrapper: "<span class='"+WidgetButtons.BUTTON_CLASS_NAMES.wrapper+"'></span>"
};

WidgetButtons.prototype = {
    // *** Instance Members *** //

        _hdBtnNode : null,
        _ftBtnNode : null,
        _buttonsArray : [],
        _uiHandlesButtons : [],

        _renderUIButtons : function () {
            
            this._removeButtonNode(true,true);
            this._hdBtnNode = CREATE(WidgetButtons.TEMPLATES.wrapper);
            this._ftBtnNode = CREATE(WidgetButtons.TEMPLATES.wrapper);
            this._createButtons();


            
        },

        _bindUIButtons : function () {

            var self = this;

            Y.each(this._buttonsArray, function(o) {
               self._attachEventsToButton(o); 
            });

            this.after(BUTTON_CHANGE, this._afterButtonsChange);
        },

        _syncUIButtons : function () {

            if (this._hdBtnNode.hasChildNodes()) {
                this.setStdModContent(Y.WidgetStdMod.HEADER, this._hdBtnNode, Y.WidgetStdMod.AFTER);
            }
            if (this._ftBtnNode.hasChildNodes()) {
                this.setStdModContent(Y.WidgetStdMod.FOOTER, this._ftBtnNode, Y.WidgetStdMod.AFTER);
            }

        },

        addButton: function (button) {
            var btns = this.get('buttons');
            btns.push(button);
            this.set('buttons', btns);
        },


        _createButtons : function () {
            var btns = this.get('buttons'),
            template = '',
            html = '',
            node,
            self = this;


            Y.each(btns, function(o) {
                template = Y.Lang.sub(WidgetButtons.TEMPLATES.defaultTemplate, {
                    href: o.href || '#',
                    value: o.value
                });

                //create Y.Node instance of button
                node = CREATE(template);
                //push the node onto an array of all the buttons
                self._buttonsArray.push({node: node, cb: o.defaultFn});

                //append it to the wrapper node
                if (o.section === Y.WidgetStdMod.HEADER) {
                    self._hdBtnNode.appendChild(node);
                }
                else if (o.section === Y.WidgetStdMod.FOOTER) {
                    self._ftBtnNode.appendChild(node);
                }
                else {
                }
                
            });

            return true;
        },

        //object with properties node, cb
        _attachEventsToButton : function (o) {
            this._uiHandlesButtons.push(o.node.on(CLICK, o.cb, this));
        },

        _afterButtonsChange : function (e) {
            this._detachEventsFromButtons();
            this._renderUIButtons();
            this._bindUIButtons();
            this._syncUIButtons();
        },

        _removeButtonNode : function(fromHd, fromFt) {

            if (fromHd && this._hdBtnNode) {
                
                if (this._hdBtnNode.hasChildNodes() && this._hdBtnNode.inDoc()) {
                    this._hdBtnNode.remove();
                }
            }

            if (fromFt && this._ftBtnNode) {
                
                if (this._ftBtnNode.hasChildNodes() && this._ftBtnNode.inDoc()) {
                    this._ftBtnNode.remove();
                }
            }

        },

        _detachEventsFromButtons : function () {
            Y.each(this._uiHandlesButtons, function(h){
                h.detach();
            });

            this._uiHandlesButtons = [];
        }
}


Y.WidgetButtons = WidgetButtons;


}, '@VERSION@' ,{requires:['base-build', 'widget']});
