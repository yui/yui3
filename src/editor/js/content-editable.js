    /*jshint maxlen: 500 */
    /**
    * Creates a component to work with an elemment.
    * @class ContentEditable
    * @for ContentEditable
    * @extends Y.Plugin.Base
    * @constructor
    * @module editor
    * @submodule content-editable
    */

    var Lang = Y.Lang,
        YNode = Y.Node,

        EVENT_CONTENT_READY = 'contentready',
        EVENT_READY = 'ready',

        TAG_PARAGRAPH = 'p',

        BLUR = 'blur',
        CONTAINER = 'container',
        CONTENT_EDITABLE = 'contentEditable',
        EMPTY = '',
        FOCUS = 'focus',
        HOST = 'host',
        INNER_HTML = 'innerHTML',
        KEY = 'key',
        PARENT_NODE = 'parentNode',
        PASTE = 'paste',
        TEXT = 'Text',
        USE = 'use',

    ContentEditable = function() {
        ContentEditable.superclass.constructor.apply(this, arguments);
    };

    Y.extend(ContentEditable, Y.Plugin.Base, {

        /**
        * @private
        * @property _rendered
        * @description Internal reference set when render is called.
        * @type Boolean
        */
        _rendered: null,

        /**
        * @private
        * @property _instance
        * @description Internal reference to the YUI instance bound to the element
        * @type YUI
        */
        _instance: null,

        /**
        * @protected
        * @method initializer
        * @description Initializes the ContentEditable instance
        */
        initializer: function() {
            var host = this.get(HOST);

            if (host) {
                host.frame = this;
            }

            this._eventHandles = [];

            this.publish(EVENT_READY, {
                emitFacade: true,
                defaultFn: this._defReadyFn
            });
        },

        /**
        * @protected
        * @method destructor
        * @description Destroys the instance.
        */
        destructor: function() {
            new Y.EventHandle(this._eventHandles).detach();

            this._container.removeAttribute(CONTENT_EDITABLE);
        },

        /**
        * @private
        * @method _onDomEvent
        * @description Generic handler for all DOM events fired by the Editor container. This handler
        * takes the current EventFacade and augments it to fire on the ContentEditable host. It adds two new properties
        * to the EventFacade called frameX and frameY which adds the scroll and xy position of the ContentEditable element
        * to the original pageX and pageY of the event so external nodes can be positioned over the element.
        * In case of ContentEditable element these will be equal to pageX and pageY of the container.
        * @param {Event.Facade} e
        */
        _onDomEvent: function(e) {
            var xy;

            e.frameX = e.frameY = 0;

            if (e.pageX > 0 || e.pageY > 0) {
                if (e.type.substring(0, 3) !== KEY) {
                    xy = this._container.getXY();

                    e.frameX = xy[0];
                    e.frameY = xy[1];
                }
            }

            e.frameTarget = e.target;
            e.frameCurrentTarget = e.currentTarget;
            e.frameEvent = e;

            this.fire('dom:' + e.type, e);
        },

        /**
        * @private
        * @method _DOMPaste
        * @description Simple pass thru handler for the paste event so we can do content cleanup
        * @param {Event.Facade} e
        */
        _DOMPaste: function(e) {
            var inst = this.getInstance(),
                data = EMPTY, win = inst.config.win;

            if (e._event.originalTarget) {
                data = e._event.originalTarget;
            }

            if (e._event.clipboardData) {
                data = e._event.clipboardData.getData(TEXT);
            }

            if (win.clipboardData) {
                data = win.clipboardData.getData(TEXT);

                if (data === EMPTY) { // Could be empty, or failed
                    // Verify failure
                    if (!win.clipboardData.setData(TEXT, data)) {
                        data = null;
                    }
                }
            }

            e.frameTarget = e.target;
            e.frameCurrentTarget = e.currentTarget;
            e.frameEvent = e;

            if (data) {
                e.clipboardData = {
                    data: data,
                    getData: function() {
                        return data;
                    }
                };
            } else {
                Y.log('Failed to collect clipboard data', 'warn', 'contenteditable');

                e.clipboardData = null;
            }

            this.fire('dom:paste', e);
        },

        /**
        * @private
        * @method _defReadyFn
        * @description Binds DOM events and fires the ready event
        */
        _defReadyFn: function() {
            var inst = this.getInstance(),
                container = this.get(CONTAINER);

            Y.each(
                ContentEditable.DOM_EVENTS,
                function(value, key) {
                    var fn = Y.bind(this._onDomEvent, this),
                        kfn = ((Y.UA.ie && ContentEditable.THROTTLE_TIME > 0) ? Y.throttle(fn, ContentEditable.THROTTLE_TIME) : fn);

                    if (!inst.Node.DOM_EVENTS[key]) {
                        inst.Node.DOM_EVENTS[key] = 1;
                    }

                    if (value === 1) {
                        if (key !== FOCUS && key !== BLUR && key !== PASTE) {
                            if (key.substring(0, 3) === KEY) {
                                //Throttle key events in IE
                                this._eventHandles.push(container.on(key, kfn, container));
                            } else {
                                this._eventHandles.push(container.on(key, fn, container));
                            }
                        }
                    }
                },
                this
            );

            inst.Node.DOM_EVENTS.paste = 1;

            this._eventHandles.push(
                container.on(PASTE, Y.bind(this._DOMPaste, this), container),
                container.on(FOCUS, Y.bind(this._onDomEvent, this), container),
                container.on(BLUR, Y.bind(this._onDomEvent, this), container)
            );

            inst.__use = inst.use;

            inst.use = Y.bind(this.use, this);
        },

        /**
        * @private
        * @method _onContentReady
        * @description Called once the content is available in the ContentEditable element and calls the final use call
        * on the internal instance so that the modules are loaded properly.
        */
        _onContentReady: function(event) {
            if (!this._ready) {
                this._ready = true;

                var inst = this.getInstance(),
                    args = Y.clone(this.get(USE));

                this.fire(EVENT_CONTENT_READY);

                Y.log('On content available', 'info', 'contenteditable');

                if (event) {
                    inst.config.doc = YNode.getDOMNode(event.target);
                }

                args.push(Y.bind(function() {
                    Y.log('Callback from final internal use call', 'info', 'contenteditable');

                    if (inst.EditorSelection) {
                        inst.EditorSelection.DEFAULT_BLOCK_TAG = this.get('defaultblock');

                        inst.EditorSelection.ROOT = this.get(CONTAINER);
                    }

                    this.fire(EVENT_READY);
                }, this));

                Y.log('Calling use on internal instance: ' + args, 'info', 'contentEditable');

                inst.use.apply(inst, args);
            }
        },

        /**
        * @private
        * @method _getDefaultBlock
        * @description Retrieves defaultblock value from host attribute
        * @return {String}
        */
        _getDefaultBlock: function() {
            return this._getHostValue('defaultblock');
        },

        /**
        * @private
        * @method _getDir
        * @description Retrieves dir value from host attribute
        * @return {String}
        */
        _getDir: function() {
            return this._getHostValue('dir');
        },

        /**
        * @private
        * @method _getExtraCSS
        * @description Retrieves extracss value from host attribute
        * @return {String}
        */
        _getExtraCSS: function() {
            return this._getHostValue('extracss');
        },

        /**
        * @private
        * @method _getHTML
        * @description Get the content from the container
        * @param {String} html The raw HTML from the container.
        * @return {String}
        */
        _getHTML: function() {
            var html, container;

            if (this._ready) {
                container = this.get(CONTAINER);

                html = container.get(INNER_HTML);
            }

            return html;
        },

        /**
        * @private
        * @method _getHostValue
        * @description Retrieves a value from host attribute
        * @param {attr} The attribute which value should be returned from the host
        * @return {String|Object}
        */
        _getHostValue: function(attr) {
            var host = this.get(HOST);

            if (host) {
                return host.get(attr);
            }
        },

        /**
        * @private
        * @method _setHTML
        * @description Set the content of the container
        * @param {String} html The raw HTML to set to the container.
        * @return {String}
        */
        _setHTML: function(html) {
            if (this._ready) {
                var container = this.get(CONTAINER);

                container.set(INNER_HTML, html);
            } else {
                //This needs to be wrapped in a contentready callback for the !_ready state
                this.once(EVENT_CONTENT_READY, Y.bind(this._setHTML, this, html));
            }

            return html;
        },

        /**
        * @private
        * @method _setLinkedCSS
        * @description Set's the linked CSS on the instance.
        * @param {css} String The linkedcss value
        * @return {String}
        */
        _setLinkedCSS: function(css) {
            if (this._ready) {
                var inst = this.getInstance();

                inst.Get.css(css);
            } else {
                //This needs to be wrapped in a contentready callback for the !_ready state
                this.once(EVENT_CONTENT_READY, Y.bind(this._setLinkedCSS, this, css));
            }

            return css;
        },

        /**
        * @private
        * @method _setDir
        * @description Set's the dir (language direction) attribute on the container.
        * @param {value} String The language direction
        * @return {String}
        */
        _setDir: function(value) {
            var container;

            if (this._ready) {
                container = this.get(CONTAINER);

                container.setAttribute('dir', value);
            } else {
                //This needs to be wrapped in a contentready callback for the !_ready state
                this.once(EVENT_CONTENT_READY, Y.bind(this._setDir, this, value));
            }

            return value;
        },

        /**
        * @private
        * @method _setExtraCSS
        * @description Set's the extra CSS on the instance.
        * @param {css} String The CSS style to be set as extra css
        * @return {String}
        */
        _setExtraCSS: function(css) {
            if (this._ready) {
                if (css) {
                    var inst = this.getInstance(),
                        head = inst.one('head');

                    if (this._extraCSSNode) {
                        this._extraCSSNode.remove();
                    }

                    this._extraCSSNode = YNode.create('<style>' + css + '</style>');

                    head.append(this._extraCSSNode);
                }
            } else {
                //This needs to be wrapped in a contentready callback for the !_ready state
                this.once(EVENT_CONTENT_READY, Y.bind(this._setExtraCSS, this, css));
            }

            return css;
        },

        /**
        * @private
        * @method _setLang
        * @description Set's the language value on the instance.
        * @param {value} String The language to be set
        * @return {String}
        */
        _setLang: function(value) {
            var container;

            if (this._ready) {
                container = this.get(CONTAINER);

                container.setAttribute('lang', value);
            } else {
                //This needs to be wrapped in a contentready callback for the !_ready state
                this.once(EVENT_CONTENT_READY, Y.bind(this._setLang, this, value));
            }

            return value;
        },

        /**
        * @private
        * @method _instanceLoaded
        * @description Called from the first YUI instance that sets up the internal instance.
        * This loads the content into the ContentEditable element and attaches the contentready event.
        * @param {YUI} inst The internal YUI instance bound to the ContentEditable element
        */
        _instanceLoaded: function(inst) {
            this._instance = inst;

            this._onContentReady();

            var doc = this._instance.config.doc;

            if (!Y.UA.ie) {
                try {
                    //Force other browsers into non CSS styling
                    doc.execCommand('styleWithCSS', false, false);
                    doc.execCommand('insertbronreturn', false, false);
                } catch (err) {}
            }
        },

        /**
        * @private
        * @method _handleFocus
        * @description Does some tricks on focus to set the proper cursor position.
        */
        _handleFocus: function() {
            var inst = this.getInstance(),
                anchorNode, b, par, childNodes,
                sel = new inst.EditorSelection();

            if (sel.anchorNode) {
                Y.log('_handleFocus being called..', 'info', 'contenteditable');

                anchorNode = sel.anchorNode;

                if (anchorNode.test(TAG_PARAGRAPH) && anchorNode.get(INNER_HTML) === EMPTY) {
                    anchorNode = anchorNode.get(PARENT_NODE);
                }

                childNodes = anchorNode.get('childNodes');

                if (childNodes.size()) {
                    if (childNodes.item(0).test('br')) {
                        sel.selectNode(anchorNode, true, false);
                    } else if (childNodes.item(0).test(TAG_PARAGRAPH)) {
                        anchorNode = childNodes.item(0).one('br.yui-cursor');
                        if (anchorNode) {
                            anchorNode = anchorNode.get(PARENT_NODE);
                        }
                        if (!anchorNode) {
                            anchorNode = childNodes.item(0).get('firstChild');
                        }
                        if (!anchorNode) {
                            anchorNode = childNodes.item(0);
                        }
                        if (anchorNode) {
                            sel.selectNode(anchorNode, true, false);
                        }
                    } else {
                        b = inst.one('br.yui-cursor');

                        if (b) {
                            par = b.get(PARENT_NODE);
                            if (par) {
                                sel.selectNode(par, true, false);
                            }
                        }
                    }
                }
            }
        },

        /**
        * Validates linkedcss property
        *
        * @method _validateLinkedCSS
        * @private
        */
        _validateLinkedCSS: function(value) {
            return Lang.isString(value) || Lang.isArray(value);
        },

        //BEGIN PUBLIC METHODS
        /**
        * @method use
        * @description This is a scoped version of the normal YUI.use method & is bound to the ContentEditable element
        * At setup, the inst.use method is mapped to this method.
        */
        use: function() {
            Y.log('Calling augmented use after ready', 'info', 'contenteditable');

            var inst = this.getInstance(),
                args = Y.Array(arguments),
                callback = false;

            if (Lang.isFunction(args[args.length - 1])) {
                callback = args.pop();
            }

            if (callback) {
                args.push(function() {
                    Y.log('Internal callback from augmented use', 'info', 'contenteditable');

                    callback.apply(inst, arguments);
                });
            }

            inst.__use.apply(inst, args);
        },

        /**
        * @method delegate
        * @description A delegate method passed to the instance's delegate method
        * @param {String} type The type of event to listen for
        * @param {Function} fn The method to attach
        * @param {String, Node} cont The container to act as a delegate, if no "sel" passed, the container is assumed.
        * @param {String} sel The selector to match in the event (optional)
        * @return {EventHandle} The Event handle returned from Y.delegate
        */
        delegate: function(type, fn, cont, sel) {
            var inst = this.getInstance();

            if (!inst) {
                Y.log('Delegate events can not be attached until after the ready event has fired.', 'error', 'contenteditable');

                return false;
            }

            if (!sel) {
                sel = cont;

                cont = this.get(CONTAINER);
            }

            return inst.delegate(type, fn, cont, sel);
        },

        /**
        * @method getInstance
        * @description Get a reference to the internal YUI instance.
        * @return {YUI} The internal YUI instance
        */
        getInstance: function() {
            return this._instance;
        },

        /**
        * @method render
        * @param {String/HTMLElement/Node} node The node to render to
        * @return {ContentEditable}
        * @chainable
        */
        render: function(node) {
            var args, inst, fn;

            if (this._rendered) {
                Y.log('Container already rendered.', 'warn', 'contentEditable');

                return this;
            }

            if (node) {
                this.set(CONTAINER, node);
            }

            container = this.get(CONTAINER);

            if (!container) {
                container = YNode.create(ContentEditable.HTML);

                Y.one('body').prepend(container);

                this.set(CONTAINER, container);
            }

            this._rendered = true;

            this._container.setAttribute(CONTENT_EDITABLE, true);

            args = Y.clone(this.get(USE));

            fn = Y.bind(function() {
                inst = YUI();

                inst.host = this.get(HOST); //Cross reference to Editor

                inst.log = Y.log; //Dump the instance logs to the parent instance.

                Y.log('Creating new internal instance with node-base only', 'info', 'contenteditable');
                inst.use('node-base', Y.bind(this._instanceLoaded, this));
            }, this);

            args.push(fn);

            Y.log('Adding new modules to main instance: ' + args, 'info', 'contenteditable');
            Y.use.apply(Y, args);

            return this;
        },

        /**
        * @method focus
        * @description Set the focus to the container
        * @param {Function} fn Callback function to execute after focus happens
        * @return {ContentEditable}
        * @chainable
        */
        focus: function() {
            this._container.focus();

            return this;
        },
        /**
        * @method show
        * @description Show the iframe instance
        * @return {ContentEditable}
        * @chainable
        */
        show: function() {
            this._container.show();

            this.focus();

            return this;
        },

        /**
        * @method hide
        * @description Hide the iframe instance
        * @return {ContentEditable}
        * @chainable
        */
        hide: function() {
            this._container.hide();

            return this;
        }
    },
    {
        /**
        * @static
        * @property THROTTLE_TIME
        * @description The throttle time for key events in IE
        * @type Number
        * @default 100
        */
        THROTTLE_TIME: 100,

        /**
        * @static
        * @property DOM_EVENTS
        * @description The DomEvents that the frame automatically attaches and bubbles
        * @type Object
        */
        DOM_EVENTS: {
            click: 1,
            dblclick: 1,
            focusin: 1,
            focusout: 1,
            keydown: 1,
            keypress: 1,
            keyup: 1,
            mousedown: 1,
            mouseup: 1,
            paste: 1
        },

        /**
        * @static
        * @property HTML
        * @description The template string used to create the ContentEditable element
        * @type String
        */
        HTML: '<div></div>',

        /**
        * @static
        * @property NAME
        * @description The name of the class (contentEditable)
        * @type String
        */
        NAME: 'contentEditable',

        /**
        * The namespace on which ContentEditable plugin will reside.
        *
        * @property NS
        * @type String
        * @default 'contentEditable'
        * @static
        */
        NS: CONTENT_EDITABLE,

        ATTRS: {
            /**
            * @attribute dir
            * @description The default text direction for this ContentEditable element. Default: ltr
            * @type String
            */
            dir: {
                lazyAdd: false,
                validator: Lang.isString,
                setter: '_setDir',
                valueFn: '_getDir'
            },

            /**
            * @attribute container
            * @description The container to set contentEditable=true or to create on render.
            * @type String/HTMLElement/Node
            */
            container: {
                setter: function(n) {
                    this._container = Y.one(n);

                    return this._container;
                }
            },

            /**
            * @attribute content
            * @description The string to inject as Editor content. Default '<br>'
            * @type String
            */
            content: {
                getter: '_getHTML',
                lazyAdd: false,
                setter: '_setHTML',
                validator: Lang.isString,
                value: '<br>'
            },

            /**
            * @attribute defaultblock
            * @description The default tag to use for block level items, defaults to: p
            * @type String
            */
            defaultblock: {
                validator: Lang.isString,
                value: TAG_PARAGRAPH,
                valueFn: '_getDefaultBlock'
            },

            /**
            * @attribute extracss
            * @description A string of CSS to add to the Head of the Editor
            * @type String
            */
            extracss: {
                lazyAdd: false,
                setter: '_setExtraCSS',
                validator: Lang.isString,
                valueFn: '_getExtraCSS'
            },

            /**
            * @attribute id
            * @description Set the id of the new Node. (optional)
            * @type String
            * @writeonce
            */
            id: {
                writeOnce: true,
                getter: function(id) {
                    if (!id) {
                        id = 'inlineedit-' + Y.guid();
                    }

                    return id;
                }
            },

            /**
            * @attribute lang
            * @description The default language. Default: en-US
            * @type String
            */
            lang: {
                validator: Lang.isString,
                setter: '_setLang',
                lazyAdd: false,
                value: 'en-US'
            },

            /**
            * @attribute linkedcss
            * @description An array of url's to external linked style sheets
            * @type String|Array
            */
            linkedcss: {
                setter: '_setLinkedCSS',
                validator: '_validateLinkedCSS',
                value: ''
            },

            /**
            * @attribute node
            * @description The Node instance of the container.
            * @type Node
            */
            node: {
                readOnly: true,
                value: null,
                getter: function() {
                    return this._container;
                }
            },

            /**
            * @attribute use
            * @description Array of modules to include in the scoped YUI instance at render time. Default: ['node-base', 'editor-selection', 'stylesheet']
            * @writeonce
            * @type Array
            */
            use: {
                validator: Lang.isArray,
                writeOnce: true,
                value: ['node-base', 'editor-selection', 'stylesheet']
            }
        }
    });

    Y.namespace('Plugin');

    Y.Plugin.ContentEditable = ContentEditable;