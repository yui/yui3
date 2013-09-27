// This file gets chained after others that already have var declarations
/*jshint onevar:false*/
var substitute = Y.Lang.sub,
    Plugins = Y.Plugins || {},
    arrMap = Y.Array.map;
/*jshint onevar:true*/
/**
Frame that surrounds editors when they are of the `popup` variety.
It can host any of the cell editors by just setting the `popup` attribute true.
It can also provide standard save and cancel buttons plus custom ones.

@class DataTable.CellEditorOverlay
@extends Overlay
 */
Y.DataTable.CellEditorOverlay = Y.Base.create('celleditor-overlay', Y.Overlay, [],
    {
        /**
        Defines the template for BUTTON elements that are added to the Overlay
        via the [buttons](#attr_buttons) attribute.

        @property btnTemplate
        @type String
        @default See Code
        */
       // the `yui3-button` className is there to benefit from the CSSButton module.
        btnTemplate:    '<button class="yui3-button {classButton}">{label}</button>',

        /**
        Reference to the cell editor that this overlay is hosting.

        @property _guest
        @type Datatable.BaseCellEditor
        @default null
        @private
         */
        _guest: null,

        /**
        Offset from the left edge of the element to be positioned to the left
        edge of this overlay.

        @property _offsetX
        @type Number
        @default 0
        @private
         */
        _offsetX: null,

        /**
        Offset from the top edge of the element to be positioned to the top
        edge of this overlay.

        @property _offsetY
        @type Number
        @default 0
        @private
         */
        _offsetY: null,

        /**
        Lifecycle method.  Setys the title and buttons and makes the overlay draggable
        if the drag and drop plugin is available.

        @method initializer
        @param config {Object} Initial configuration options resulting from
            the merge of the OverlayConfig attributes in the column definitions.
        @protected
         */
        initializer: function (config) {
            Y.log('CellEditorOverlay.initializer','info','CellEditorOverlay');

            var guest = (this._guest = config.guest),
                title = guest.get('title');


            if(Plugins.Drag) {
                this.plug(Plugins.Drag);
            }
            if (title) {
                this.set('headerContent', title);
            }
            this._createOverlayButtons(guest.get('buttons'));
        },

        /**
        Adds to the footer of the overlay the buttons entered
        as the [buttons](#attr_buttons) config property of `editorConfig`
        column definition.
        Sets the click listener on them.

        @method _createOverlayButtons
        @param btnCfg {Array}  Array of button definition objects
        @private
        */
        _createOverlayButtons: function (btnCfg) {
            Y.log('CellEditorOverlay._createOverlayButtons','info','CellEditorOverlay');

            var strings = Y.DataTable.BaseCellEditor.localizedStrings,
                footer,
                buttons;
            if (btnCfg) {
                buttons = arrMap(btnCfg, function (btn) {

                    return substitute(this.btnTemplate,{
                        classButton: (btn.className || '')  + (btn.save ? ' yui3-button-primary' : ''),
                        label:       btn.label ||
                                    (btn.save ? strings.save :
                                    (btn.cancel ? strings.cancel : 'unknown label'))
                    });

                }, this);
                this.set('footerContent', buttons.join('\n'));
                footer = this.getStdModNode('footer', true);
                this._guest._subscr.push(footer.delegate('click', this._afterButtonClick, 'button.yui3-button', this));
            }
        },

        /**
        Listener for clicks on the buttons defined in the [buttons](#attr_buttons) attribute.

        @method _afterButtonClick
        @param ev {EventFacade} Event facade for the click event
        @private
        */
        _afterButtonClick: function (ev) {
            Y.log('CellEditorOverlay._afterButtonClick','info','CellEditorOverlay');

            var btnCfg = null,
                action,
                cellInfo,
                guest = this._guest;

            if (ev.target.ancestor().get('children').some(function(button, index) {
                if (button === ev.target) {
                    btnCfg = guest.get('buttons')[index];
                    return true;
                }
            })) {
                if (btnCfg.save) {
                    guest.saveEditor();
                    return;
                }
                if (btnCfg.cancel) {
                    guest.cancelEditor();
                    return;
                }
                action = btnCfg.action;
                cellInfo = Y.merge(guest._cellInfo, {value: guest._getValue()});
                switch (Lang.type(action)) {
                    case 'string':
                        if (guest[action]) {
                            guest[action].call(guest, btnCfg, cellInfo);
                        } else {
                            guest.fire(action, btnCfg, cellInfo);
                        }
                        break;
                    case 'function':
                        action.call(guest, btnCfg, cellInfo);
                        break;
                }
            }
        },

        /**
        Moves the overlay to the given xy position so that the
        [_guest](#property__guest) element ends on top of the cell being
        edited.

        It has been defined with this name to make it behave as the node used
        with inline editors.  That is why it is private but has no leading
        underscore.

        @method setXY
        @param xy {Array} Array of X and Y position for the guest element.
         */
        setXY: function (xy) {
            Y.log('CellEditorOverlay.setXY','info','CellEditorOverlay');

            var offsetX = this._offsetX,
                bbxy, contentxy, guest = this._guest;
            if (offsetX === null) {
                bbxy = this.get('boundingBox').getXY();
                contentxy = guest._xyReference.getXY();
                offsetX = this._offsetX = bbxy[0] - contentxy[0];
                this._offsetY = bbxy[1] - contentxy[1];
            }
            this.set('xy', [xy[0] + offsetX, xy[1] + this._offsetY]);
        }
    },
    {
        ATTRS: {
            /**
            Overrides the value of Overlay's `zIndex` attribute

            @attribute zIndex
            @type Integer
            @default 99
             */
            zIndex: {
                value: 99
            },

            /**
            Overrides the value of Overlay's `visible` attribute.

            @attribute visible
            @type Boolean
            @default false
             */
            visible: {
                value: false
            }
        }

    }

);
