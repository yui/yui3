// This file gets chained after others that already have var declarations
/*jshint onevar:false */
//var substitute = Y.Lang.sub,
//    Plugins = Y.Plugins || {},
//    arrMap = Y.Array.map;
/* jshint onevar:true*/

Y.DataTable.RowEditorOverlay = Y.Base.create('roweditor-overlay', Y.Overlay, [],
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
        Reference to the datatable whose editors this overlay is hosting.

        @property _dt
        @type Datatable
        @default null
        @private
         */
        _dt: null,

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
            Y.log('RowEditorOverlay.initializer','info','RowEditorOverlay');
            this._subscr = [];
            var title = config.title;

            this._dt = config.dt;
            if(Plugins.Drag) {
                this.plug(Plugins.Drag);
            }
            if (title) {
                this.set('headerContent', title);
            }
            this._createOverlayButtons(config.buttons);
        },
        destructor: function () {
            arrEach(this._subscr, function (subscr) {
                if (subscr.destroy) {
                    subscr.destroy();
                }
            });
        },
        showEditor: function (config) {
            this.show();
            this._attach(config.tr);
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
            Y.log('RowEditorOverlay._createOverlayButtons','info','RowEditorOverlay');

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
                this._subscr.push(footer.delegate('click', this._afterButtonClick, 'button.yui3-button', this));
            }
        },

        /**
        Listener for clicks on the buttons defined in the [buttons](#attr_buttons) attribute.

        @method _afterButtonClick
        @param ev {EventFacade} Event facade for the click event
        @private
        */
        _afterButtonClick: function (ev) {
            Y.log('RowEditorOverlay._afterButtonClick','info','RowEditorOverlay');

            var btnCfg = null,
                action,
                cellInfo,
                dt = this._dt;

            if (ev.target.ancestor().get('children').some(function(button, index) {
                if (button === ev.target) {
                    btnCfg = this.get('buttons')[index];
                    return true;
                }
            })) {
                if (btnCfg.save) {
                    dt.saveRowEditor();
                    return;
                }
                if (btnCfg.cancel) {
                    dt.cancelRowEditor();
                    return;
                }
                action = btnCfg.action;
                cellInfo = Y.merge(guest._cellInfo, {value: guest._getValue()});
                switch (Lang.type(action)) {
                    case 'string':
                        if (dt[action]) {
                            dt[action].call(dt, btnCfg, cellInfo);
                        } else {
                            dt.fire(action, btnCfg, cellInfo);
                        }
                        break;
                    case 'function':
                        action.call(dt, btnCfg, cellInfo);
                        break;
                }
            }
        },

        /**
        Resizes and moves the body section
        to fit on top of the row being edited.

        The default implementation reads the `region` the row occupies and
        calls [_resize](#method__resize) and [_move](#method__move).

        @method _attach
        @param tr {Node} cell to attach this editor to
        @protected
        */
        _attach: function (tr) {
            Y.log('DataTable.RowEditorOverlay._attach', 'info', 'celleditor-base');
            if (this.get('visible')) {
                var region = tr.get('region');
                this._resize(region.width, region.height);
                this._move(region.left, region.top);
            }
        },

        /**
        Resizes the  body section to fit on top of the row being edited.

        @method _resize
        @param width {Number} width of the cell being edited
        @param height {Number} height of the cell being edited
        @protected
         */
        _resize: function (width, height) {
            Y.log('DataTable.RowEditorOverlay._resize [' + width + ':' + height + ']','info','celleditor-base');

            var node = this.getStdModNode('body',true);
            node.set('offsetWidth', width + 1);
            node.set('offsetHeight', height);
        },

        /**
        Moves the overlay so that the body section fits on top of the row being edited.

        @method _move
        @param left {Number} left edge of the cell being edited.
        @param top {Number} top edge of the cell being edited.
        @protected
         */
        _move: function (left, top) {
            Y.log('DataTable.RowEditorOverlay._move: [' + left + ':' + top + ']', 'info', 'celleditor-base');

            var offsetX = this._offsetX,
                bbxy, contentxy;
            if (offsetX === null) {
                bbxy = this.get('boundingBox').getXY();
                contentxy = this.getStdModNode('body',true).getXY();
                offsetX = this._offsetX = bbxy[0] - contentxy[0];
                this._offsetY = bbxy[1] - contentxy[1];
            }
            this.set('xy', [left + offsetX, top + this._offsetY]);
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
                value: 97
            },

            /**
            Overrides the value of Overlay's `visible` attribute.

            @attribute visible
            @type Boolean
            @default false
             */
            visible: {
                value: false
            },
            buttons: {

            }
        }

    }
);
