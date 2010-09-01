YUI.add('frame', function(Y) {

    /**
     * Creates a wrapper around an iframe. It loads the content either from a local
     * file or from script and creates a local YUI instance bound to that new window and document.
     * @module editor
     * @submodule frame
     */     
    /**
     * Creates a wrapper around an iframe. It loads the content either from a local
     * file or from script and creates a local YUI instance bound to that new window and document.
     * @class Frame
     * @for Frame
     * @extends Base
     * @constructor
     */

    var Frame = function() {
        Frame.superclass.constructor.apply(this, arguments);
    };

    Y.extend(Frame, Y.Base, {
        /**
        * @private
        * @property _ready
        * @description Internal reference set when the content is ready.
        * @type Boolean
        */
        _ready: null,
        /**
        * @private
        * @property _rendered
        * @description Internal reference set when render is called.
        * @type Boolean
        */
        _rendered: null,
        /**
        * @private
        * @property _iframe
        * @description Internal Node reference to the iFrame or the window
        * @type Node
        */
        _iframe: null,
        /**
        * @private
        * @property _instance
        * @description Internal reference to the YUI instance bound to the iFrame or window
        * @type YUI
        */
        _instance: null,
        /**
        * @private
        * @method _create
        * @description Create the iframe or Window and get references to the Document & Window
        * @return {Object} Hash table containing references to the new Document & Window
        */
        _create: function(cb) {
            var win, doc, res, node;
            
            this._iframe = Y.Node.create(Frame.HTML);
            this._iframe.setStyle('visibility', 'hidden');
            this._iframe.set('src', this.get('src'));
            this.get('container').append(this._iframe);


            var html = '',
                extra_css = ((this.get('extracss')) ? '<style id="extra_css">' + this.get('extracss') + '</style>' : '');

            html = Y.substitute(Frame.PAGE_HTML, {
                DIR: this.get('dir'),
                LANG: this.get('lang'),
                TITLE: this.get('title'),
                META: Frame.META,
                CONTENT: this.get('content'),
                BASE_HREF: this.get('basehref'),
                DEFAULT_CSS: Frame.DEFAULT_CSS,
                EXTRA_CSS: extra_css
            });
            if (Y.config.doc.compatMode != 'BackCompat') {
                html = Frame.DOC_TYPE + "\n" + html;
            } else {
            }



            res = this._resolveWinDoc();
            res.doc.open();
            res.doc.write(html);
            res.doc.close();

            if (this.get('designMode')) {
                res.doc.designMode = 'on';
            }
            
            if (!res.doc.documentElement) {
                var timer = Y.later(1, this, function() {
                    if (res.doc && res.doc.documentElement) {
                        cb(res);
                        timer.cancel();
                    }
                }, null, true);
            } else {
                cb(res);
            }

        },
        /**
        * @private
        * @method _resolveWinDoc
        * @description Resolves the document and window from an iframe or window instance
        * @param {Object} c The YUI Config to add the window and document to
        * @return {Object} Object hash of window and document references, if a YUI config was passed, it is returned.
        */
        _resolveWinDoc: function(c) {
            var config = (c) ? c : {};
            config.win = Y.Node.getDOMNode(this._iframe.get('contentWindow'));
            config.doc = Y.Node.getDOMNode(this._iframe.get('contentWindow.document'));
            if (!config.doc) {
                config.doc = Y.config.doc;
            }
            if (!config.win) {
                config.win = Y.config.win;
            }
            return config;
        },
        /**
        * @private
        * @method _onDomEvent
        * @description Generic handler for all DOM events fired by the iframe or window. This handler
        * takes the current EventFacade and augments it to fire on the Frame host. It adds two new properties
        * to the EventFacade called frameX and frameY which adds the scroll and xy position of the iframe
        * to the original pageX and pageY of the event so external nodes can be positioned over the frame.
        * @param {Event.Facade} e
        */
        _onDomEvent: function(e) {
            var xy, node;

            e.frameX = e.frameY = 0;

            if (e.pageX > 0 || e.pageY > 0) {
                if (e.type.substring(0, 3) !== 'key') {
                    node = this._instance.one('win');
                    xy = this._iframe.getXY()
                    e.frameX = xy[0] + e.pageX - node.get('scrollLeft');
                    e.frameY = xy[1] + e.pageY - node.get('scrollTop');
                }
            }

            e.frameTarget = e.target;
            e.frameCurrentTarget = e.currentTarget;
            e.frameEvent = e;

            this.fire('dom:' + e.type, e);
        },
        initializer: function() {
            this.publish('ready', {
                emitFacade: true,
                defaultFn: this._defReadyFn
            });
        },
        destructor: function() {
            var inst = this.getInstance();

            inst.one('doc').detachAll();
            inst = null;
            this._iframe.remove();
        },
        /**
        * @private
        * @method _DOMPaste
        * @description Simple pass thru handler for the paste event so we can do content cleanup
        * @param {Event.Facade} e
        */
        _DOMPaste: function(e) {
            var inst = this.getInstance(),
                data = '', win = inst.config.win;

            if (e._event.originalTarget) {
                data = e._event.originalTarget;
            }
            if (e._event.clipboardData) {
                data = e._event.clipboardData.getData('Text');
            }
            
            if (win.clipboardData) {
                data = win.clipboardData.getData('Text');
                if (data == '') { // Could be empty, or failed
                    // Verify failure
                    if (!win.clipboardData.setData('Text', data)) {
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
                e.clipboardData = null;
            }

            this.fire('dom:paste', e);
        },
        /**
        * @private
        * @method _defReadyFn
        * @description Binds DOM events, sets the iframe to visible and fires the ready event
        */
        _defReadyFn: function() {
            var inst = this.getInstance(),
                fn = Y.bind(this._onDomEvent, this),
                kfn = ((Y.UA.ie) ? Y.throttle(fn, 200) : fn);

            inst.Node.DOM_EVENTS.activate = 1;
            inst.Node.DOM_EVENTS.focusin = 1;
            inst.Node.DOM_EVENTS.deactivate = 1;
            inst.Node.DOM_EVENTS.focusout = 1;

            //Y.each(inst.Node.DOM_EVENTS, function(v, k) {
            Y.each(Frame.DOM_EVENTS, function(v, k) {
                if (v === 1) {
                    if (k !== 'focus' && k !== 'blur' && k !== 'paste') {
                        if (k.substring(0, 3) === 'key') {
                            inst.on(k, kfn, inst.config.doc);
                        } else {
                            inst.on(k, fn, inst.config.doc);
                        }
                    }
                }
            }, this);

            inst.Node.DOM_EVENTS.paste = 1;
            
            inst.on('paste', Y.bind(this._DOMPaste, this), inst.one('body'));

            //Adding focus/blur to the window object
            inst.on('focus', fn, inst.config.win);
            inst.on('blur', fn, inst.config.win);

            inst._use = inst.use;
            inst.use = Y.bind(this.use, this);

            this._iframe.setStyles({
                visibility: 'inherit'
            });
            inst.one('body').setStyle('display', 'block');
        },
        /**
        * @private
        * @method _onContentReady
        * @description Called once the content is available in the frame/window and calls the final use call
        * on the internal instance so that the modules are loaded properly.
        */
        _onContentReady: function(e) {
            if (!this._ready) {
                this._ready = true;
                var inst = this.getInstance(),
                    args = Y.clone(this.get('use'));
                
                this.fire('contentready');

                if (e) {
                    inst.config.doc = Y.Node.getDOMNode(e.target);
                }
                //TODO Circle around and deal with CSS loading...
                args.push(Y.bind(function() {
                    this.fire('ready');
                }, this));
                inst.use.apply(inst, args);

                inst.one('doc').get('documentElement').addClass('yui-js-enabled');
            }
        },
        /**
        * @private
        * @method _resolveBaseHref
        * @description Resolves the basehref of the page the frame is created on. Only applies to dynamic content.
        * @param {String} href The new value to use, if empty it will be resolved from the current url.
        * @return {String}
        */
        _resolveBaseHref: function(href) {
            if (!href || href === '') {
                href = Y.config.doc.location.href;
                if (href.indexOf('?') !== -1) { //Remove the query string
                    href = href.substring(0, href.indexOf('?'));
                }
                href = href.substring(0, href.lastIndexOf('/')) + '/';
            }
            return href;
        },
        /**
        * @private
        * @method _getHTML
        * @description Get the content from the iframe
        * @param {String} html The raw HTML from the body of the iframe.
        * @return {String}
        */
        _getHTML: function(html) {
            if (this._ready) {
                var inst = this.getInstance();
                html = inst.one('body').get('innerHTML');
            }
            return html;
        },
        /**
        * @private
        * @method _setHTML
        * @description Set the content of the iframe
        * @param {String} html The raw HTML to set the body of the iframe to.
        * @return {String}
        */
        _setHTML: function(html) {
            if (this._ready) {
                var inst = this.getInstance();
                inst.one('body').set('innerHTML', html);
            } else {
                //This needs to be wrapped in a contentready callback for the !_ready state
                this.on('contentready', Y.bind(function(html, e) {
                    var inst = this.getInstance();
                    inst.one('body').set('innerHTML', html);
                }, this, html));
            }
            return html;
        },
        /**
        * @private
        * @method _setExtraCSS
        * @description Set's the extra CSS on the instance..
        */
        _setExtraCSS: function(css) {
            if (this._ready) {
                var inst = this.getInstance(),
                    node = inst.get('#extra_css');
                
                node.remove();
                inst.one('head').append('<style id="extra_css">' + css + '</style>');
            }
            return css;
        },
        /**
        * @private
        * @method _instanceLoaded
        * @description Called from the first YUI instance that sets up the internal instance.
        * This loads the content into the window/frame and attaches the contentready event.
        * @param {YUI} inst The internal YUI instance bound to the frame/window
        */
        _instanceLoaded: function(inst) {
            this._instance = inst;

            this._onContentReady();
            
            var doc = this._instance.config.doc;

            if (this.get('designMode')) {
                if (!Y.UA.ie) {
                    try {
                        //Force other browsers into non CSS styling
                        doc.execCommand('styleWithCSS', false, false);
                        doc.execCommand('insertbronreturn', false, false);
                    } catch (err) {}
                }
            }
        },
        //BEGIN PUBLIC METHODS
        /**
        * @method use
        * @description This is a scoped version of the normal YUI.use method & is bound to this frame/window.
        * At setup, the inst.use method is mapped to this method.
        */
        use: function() {
            var inst = this.getInstance(),
                args = Y.Array(arguments),
                cb = false;

            if (Y.Lang.isFunction(args[args.length - 1])) {
                cb = args.pop();
            }
            if (cb) {
                args.push(function() {
                    cb.apply(inst, arguments);

                });
            }
            inst._use.apply(inst, args);
        },
        /**
        * @method delegate
        * @description A delegate method passed to the instance's delegate method
        * @param {String} type The type of event to listen for
        * @param {Function} fn The method to attach
        * @param {String} cont The container to act as a delegate, if no "sel" passed, the body is assumed as the container.
        * @param {String} sel The selector to match in the event (optional)
        * @return {EventHandle} The Event handle returned from Y.delegate
        */
        delegate: function(type, fn, cont, sel) {
            var inst = this.getInstance();
            if (!inst) {
                return false;
            }
            if (!sel) {
                sel = cont;
                cont = 'body';
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
        * @description Render the iframe into the container config option or open the window.
        * @param {String/HTMLElement/Node} node The node to render to
        * @return {Y.Frame}
        * @chainable
        */
        render: function(node) {
            if (this._rendered) {
                return this;
            }
            this._rendered = true;
            if (node) {
                this.set('container', node);
            }

            this._create(Y.bind(function(res) {
                var inst, timer,
                    cb = Y.bind(function(i) {
                        this._instanceLoaded(i);
                    }, this),
                    args = Y.clone(this.get('use')),
                    config = {
                        debug: false,
                        win: res.win,
                        doc: res.doc
                    },
                    fn = Y.bind(function() {
                        config = this._resolveWinDoc(config);
                        inst = YUI(config);

                        try {
                            inst.use('node-base', cb);
                            if (timer) {
                                clearInterval(timer);
                            }
                        } catch (e) {
                            timer = setInterval(function() {
                                fn();
                            }, 350);
                        }
                    }, this);

                args.push(fn);

                Y.use.apply(Y, args);

            }, this));

            return this;
        },
        /**
        * @method focus
        * @description Set the focus to the iframe
        * @param {Function} fn Callback function to execute after focus happens        
        * @return {Frame}
        * @chainable        
        */
        focus: function(fn) {
            if (Y.UA.ie) {
                Y.one('win').focus();
                this.getInstance().one('win').focus();
                if (Y.Lang.isFunction(fn)) {
                    fn();
                }
            } else {
                try {
                    Y.one('win').focus();
                    Y.later(100, this, function() {
                        this.getInstance().one('win').focus();
                        if (Y.Lang.isFunction(fn)) {
                            fn();
                        }
                    });
                } catch (ferr) {
                }
            }
            return this;
        },
        /**
        * @method show
        * @description Show the iframe instance
        * @return {Frame}
        * @chainable        
        */
        show: function() {
            this._iframe.setStyles({
                position: 'static',
                left: ''
            });
            if (Y.UA.gecko) {
                try {
                    this._instance.config.doc.designMode = 'on';
                } catch (e) { }
                this.focus();
            }           
            return this;
        },
        /**
        * @method hide
        * @description Hide the iframe instance
        * @return {Frame}
        * @chainable        
        */
        hide: function() {
            this._iframe.setStyles({
                position: 'absolute',
                left: '-999999px'
            });
            return this;
        }
    }, {
        
        /**
        * @static
        * @property DOM_EVENTS
        * @description The DomEvents that the frame automatically attaches and bubbles
        * @type Object
        */
        DOM_EVENTS: {
            paste: 1,
            mouseup: 1,
            mousedown: 1,
            keyup: 1,
            keydown: 1,
            keypress: 1,
            activate: 1,
            deactivate: 1,
            focusin: 1,
            focusout: 1
        },

        /**
        * @static
        * @property DEFAULT_CSS
        * @description The default css used when creating the document.
        * @type String
        */
        DEFAULT_CSS: 'html { height: 95%; } body { padding: 7px; background-color: #fff; font: 13px/1.22 arial,helvetica,clean,sans-serif;*font-size:small;*font:x-small; } a, a:visited, a:hover { color: blue !important; text-decoration: underline !important; cursor: text !important; } img { cursor: pointer !important; border: none; }',
        
        //DEFAULT_CSS: 'html { } body { margin: -15px 0 0 -15px; padding: 7px 0 0 15px; display: block; background-color: #fff; font: 13px/1.22 arial,helvetica,clean,sans-serif;*font-size:small;*font:x-small; }',
        //DEFAULT_CSS: 'html { height: 95%; } body { height: 100%; padding: 7px; margin: 0 0 0 -7px; postion: relative; background-color: #fff; font: 13px/1.22 arial,helvetica,clean,sans-serif;*font-size:small;*font:x-small; } a, a:visited, a:hover { color: blue !important; text-decoration: underline !important; cursor: text !important; } img { cursor: pointer !important; border: none; }',
        //DEFAULT_CSS: 'html { margin: 0; padding: 0; border: none; border-size: 0; } body { height: 97%; margin: 0; padding: 0; display: block; background-color: gray; font: 13px/1.22 arial,helvetica,clean,sans-serif;*font-size:small;*font:x-small; }',
        /**
        * @static
        * @property HTML
        * @description The template string used to create the iframe
        * @type String
        */
        HTML: '<iframe border="0" frameBorder="0" marginWidth="0" marginHeight="0" leftMargin="0" topMargin="0" allowTransparency="true" width="100%" height="99%"></iframe>',
        //HTML: '<iframe border="0" frameBorder="0" width="100%" height="99%"></iframe>',
        /**
        * @static
        * @property PAGE_HTML
        * @description The template used to create the page when created dynamically.
        * @type String
        */
        PAGE_HTML: '<html dir="{DIR}" lang="{LANG}"><head><title>{TITLE}</title>{META}<base href="{BASE_HREF}"/><style id="editor_css">{DEFAULT_CSS}</style>{EXTRA_CSS}</head><body>{CONTENT}</body></html>',
        /**
        * @static
        * @property DOC_TYPE
        * @description The DOCTYPE to prepend to the new document when created. Should match the one on the page being served.
        * @type String
        */
        DOC_TYPE: '<!DOCTYPE HTML PUBLIC "-/'+'/W3C/'+'/DTD HTML 4.01/'+'/EN" "http:/'+'/www.w3.org/TR/html4/strict.dtd">',
        /**
        * @static
        * @property META
        * @description The meta-tag for Content-Type to add to the dynamic document
        * @type String
        */
        META: '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7">',
        //META: '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>',
        /**
        * @static
        * @property NAME
        * @description The name of the class (frame)
        * @type String
        */
        NAME: 'frame',
        ATTRS: {
            /**
            * @attribute title
            * @description The title to give the blank page.
            * @type String
            */
            title: {
                value: 'Blank Page'
            },
            /**
            * @attribute dir
            * @description The default text direction for this new frame. Default: ltr
            * @type String
            */
            dir: {
                value: 'ltr'
            },
            /**
            * @attribute lang
            * @description The default language. Default: en-US
            * @type String
            */
            lang: {
                value: 'en-US'
            },
            /**
            * @attribute src
            * @description The src of the iframe/window. Defaults to javascript:;
            * @type String
            */
            src: {
                //Hackish, IE needs the false in the Javascript URL
                value: 'javascript' + ((Y.UA.ie) ? ':false' : ':') + ';'
            },
            /**
            * @attribute designMode
            * @description Should designMode be turned on after creation.
            * @writeonce
            * @type Boolean
            */
            designMode: {
                writeOnce: true,
                value: false
            },
            /**
            * @attribute content
            * @description The string to inject into the body of the new frame/window.
            * @type String
            */
            content: {
                value: '<br>',
                setter: '_setHTML',
                getter: '_getHTML'
            },
            /**
            * @attribute basehref
            * @description The base href to use in the iframe.
            * @type String
            */
            basehref: {
                value: false,
                getter: '_resolveBaseHref'
            },
            /**
            * @attribute use
            * @description Array of modules to include in the scoped YUI instance at render time. Default: ['none', 'selector-css2']
            * @writeonce
            * @type Array
            */
            use: {
                writeOnce: true,
                value: ['substitute', 'node', 'node-style', 'selector-css3']
            },
            /**
            * @attribute container
            * @description The container to append the iFrame to on render.
            * @type String/HTMLElement/Node
            */
            container: {
                value: 'body',
                setter: function(n) {
                    return Y.one(n);
                }
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
                        id = 'iframe-' + Y.guid();
                    }
                    return id;
                }
            },
            /**
            * @attribute extracss
            * @description A string of CSS to add to the Head of the Editor
            * @type String
            */
            extracss: {
                value: '',
                setter: '_setExtraCSS'
            },
            /**
            * @attribute host
            * @description A reference to the Editor instance 
            * @type Object
            */
            host: {
                value: false
            }
        }
    });


    Y.Frame = Frame;



}, '@VERSION@' ,{skinnable:false, requires:['base', 'node', 'selector-css3', 'substitute']});
