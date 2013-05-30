/*jshint onevar:false*/
var substitute = Y.Lang.sub,
    Plugins = Y.Plugins || {},
    arrMap = Y.Array.map,
    POP = Y.Base.create('celleditor-overlay', Y.Overlay, [],
/*jshint onevar:true*/
    {
        /**
        Defines the HTML content "template" for BUTTON elements that are added to the Overlay
        via the [buttons](#attr_buttons) attribute.

        @property btnTemplate
        @type String
        @default See Code
        */
        btnTemplate:    '<button class="yui3-button {classButton}">{label}</button>',
        host: null,
        offsetX: null,
        offsetY: null,
        initializer: function (config) {
            var host = (this.host = config.host),
                title = host.get('title');


            if(Plugins.Drag) {
                this.plug(Plugins.Drag);
            }
            if (title) {
                this.set('headerContent', title);
            }
            this._createOverlayButtons(host.get('buttons'));
        },
        /**
        Adds to the footer of the overlay the buttons entered
        as the [buttons](#attr_buttons) config property of `editorConfig`
        column definition.
        Sets the click listener on them.

        @method _createOverlayButtons
        @private
        */
        _createOverlayButtons: function (btnCfg) {
            Y.log('BaseCellPopupEditor._createOverlayButtons','info','celleditor-popup');

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
                this.host._subscr.push(footer.delegate('click', this._afterButtonClick, 'button.yui3-button', this));
            }
        },
        /**
        Listener for clicks on the buttons defined in the [buttons](#attr_buttons) attribute.

        @method _afterButtonClick
        @param ev {EventFacade} Event facade for the click event
        @private
        */

        _afterButtonClick: function (ev) {
            Y.log('BaseCellPopupEditor._afterButtonClick','info','celleditor-popup');

            var btnCfg = null,
                action,
                cellInfo,
                host = this.host;

            if (ev.target.ancestor().get('children').some(function(button, index) {
                if (button === ev.target) {
                    btnCfg = host.get('buttons')[index];
                    return true;
                }
            })) {
                if (btnCfg.save) {
                    host.saveEditor();
                    return;
                }
                if (btnCfg.cancel) {
                    host.cancelEditor();
                    return;
                }
                action = btnCfg.action;
                cellInfo = Y.merge(host._cellInfo, {value: host._getValue()});
                switch (Lang.type(action)) {
                    case 'string':
                        if (host[action]) {
                            host[action].call(host, btnCfg, cellInfo);
                        } else {
                            host.fire(action, btnCfg, cellInfo);
                        }
                        break;
                    case 'function':
                        action.call(host, btnCfg, cellInfo);
                        break;
                }
            }
        },
        setXY: function (xy) {
            var offsetX = this.offsetX,
                bbxy, bdxy;
            if (offsetX === null) {
                bbxy = this.get('boundingBox').getXY();
                bdxy = this.getStdModNode('body').getXY();
                offsetX = this.offsetX = bbxy[0] - bdxy[0];
                this.offsetY = bbxy[1] - bdxy[1];
            }
            this.set('xy', [xy[0] + offsetX, xy[1] + this.offsetY]);
        }
    },
    {
        ATTRS: {
            zIndex: {
                value: 99
            },
            visible: {
                value: false
            }
        }

    }

);

Y.DataTable.CellEditorPopupPlugin = POP;