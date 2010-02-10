YUI.add('frame', function(Y) {
    /**
     * Creates a wrapper around an iframe or a new window. It loads the content either from a local
     * file or from script and creates a local YUI instance bound to that new window and document.
     * @module frame
     */     
    /**
     * Creates a wrapper around an iframe or a new window. It loads the content either from a local
     * file or from script and creates a local YUI instance bound to that new window and document.
     * @class Frame
     * @extends Base
     * @constructor
     */

    var Frame = function() {
        Frame.superclass.constructor.apply(this, arguments);
    };

    Y.extend(Frame, Y.Base, {
        /**
        * @private
        * @property _rendered
        * @description Internal reference set when render is called.
        * @type Boolean
        */
        _rendered: null,
        /**
        * @private
        * @property _frame
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
        * @return Hash table containing references to the new Document & Window
        * @type Object
        */
        _create: function() {
            var win, doc, res,
                title = Y.guid().replace(/-/g, '_');
            if (this.get('type') == 'iframe') {
                this._iframe = Y.Node.create(Frame.HTML);
                this._iframe.setStyle('visibility', 'hidden');
                this.get('container').append(this._iframe);
                this._iframe.set('src', this.get('src'));
                res = this._resolveWinDoc();
                win = res.win;
                doc = res.doc;
            }
            if (this.get('type') === 'window') {
                win = window.open(this.get('src'), title, this.get('windowFeatures'));
                doc = win.document;
                this._iframe = Y.one(win);
            }
            return {
                win: win,
                doc: doc
            };
        },
        /**
        * @private
        * @method _resolveWinDoc
        * @description Resolves the document and window from an iframe or window instance
        * @param Object c The YUI Config to add the window and document to
        * @return Returns an Object hash of window and document references, if a YUI config was passed, it is returned.
        * @type Object
        */
        _resolveWinDoc: function(c) {
            var config = (c) ? c : {};
            if (this.get('type') == 'iframe') {
                config.win = Y.Node.getDOMNode(this._iframe.get('contentWindow'));
                config.doc = Y.Node.getDOMNode(this._iframe.get('contentWindow.document'));
            }
            if (this.get('type') == 'window') {
                config.win = Y.Node.getDOMNode(this._iframe);
                config.doc = config.win.document;
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
        * @param EventFacade e
        */
        _onDomEvent: function(e) {
            var xy = (this.get('type') == 'window') ? [0, 0] : this._iframe.getXY(),
                node = this._instance.one('win');

            //Y.log('onDOMEvent: ' + e.type, 'info', 'frame');
            if (this.get('type') == 'iframe')) {
                e.frameX = xy[0] + e.pageX - node.get('scrollLeft');
                e.frameY = xy[1] + e.pageY - node.get('scrollTop');
            }

            e.frameTarget = e.target;
            e.frameCurrentTarget = e.currentTarget;

            this.publish(e.type, {
                stoppedFn: Y.bind(function(ev, domev) {
                    ev.halt();
                }, this, e),
                preventedFn: Y.bind(function(ev, domev) {
                    ev.preventDefault();
                }, this, e)
            });
            this.fire(e.type, e);
        },
        initializer: function() {
            this.publish('ready', {
                emitFacade: true,
                defaultFn: this._defReadyFn
            });
        },
        /**
        * @private
        * @method _defReadyFn
        * @description Binds DOM events, sets the iframe to visible and fires the ready event
        */
        _defReadyFn: function() {
            var inst = this.getInstance(),
                fn = Y.bind(this._onDomEvent, this);
            
            Y.each(Y.Node.DOM_EVENTS, function(v, k) {
                if (v === 1) {
                    inst.on(k, fn, inst.config.doc);
                }
            });
            if ((this.get('type') == 'window') && this.get('designMode')) {
                inst.config.doc.designMode = 'on';
            }
            inst._use = inst.use;
            inst.use = Y.bind(this.use, this);

            this._iframe.setStyle('visibility', 'visible');
        },
        /**
        * @method use
        * @description This is a scoped version of the normal YUI.use method & is bound to this frame/window.
        * At setup, the inst.use method is mapped to this method.
        */
        use: function() {
            Y.log('Calling augmented use after ready', 'info', 'frame');
            var inst = this.getInstance(),
                args = Y.Array(arguments),
                cb = false;

            if (Y.Lang.isFunction(args[args.length - 1])) {
                cb = args.pop();
            }
            if (cb) {
                args.push(function() {
                    Y.log('Internal callback from augmented use', 'info', 'frame');
                    cb.apply(inst, arguments);

                });
            }
            inst._use.apply(inst, args);
        },
        /**
        * @private
        * @method _onContentReady
        * @description Called once the content is available in the frame/window and calls the final use call
        * on the internal instance so that the modules are loaded properly.
        */
        _onContentReady: function(e) {
            var inst = this.getInstance(),
                args = Y.clone(this.get('use'));

            Y.log('On available for body of iframe', 'info', 'frame');
            if (e) {
                inst.config.doc = Y.Node.getDOMNode(e.target);
            }
            args.push(Y.bind(function() {
                Y.log('Callback from final internal use call', 'info', 'frame');
                this.fire('ready');
            }, this));
            Y.log('Calling use on internal instance: ', 'info', 'frame');
            inst.use.apply(inst, args);

            inst.one('doc').set('title', this.get('windowTitle')).get('documentElement').addClass('yui-js-enabled');
        },
        /**
        * @private
        * @method _instanceLoaded
        * @description Called from the first YUI instance that sets up the internal instance.
        * This loads the content into the window/frame and attaches the contentready event.
        * @param YUI inst The internal YUI instance bound to the frame/window
        */
        _instanceLoaded: function(inst) {
            this._instance = inst;
            if (this.get('type') == 'iframe') {
                this._instance.on('contentready', Y.bind(this._onContentReady, this), 'body');
            } else {
                if (Y.UA.webkit || Y.UA.ie) {
                    //Hack for Webkit and no windowload event :(
                    Y.later(100, this, function() {
                        this._onContentReady({ target: Y.one(this._iframe._node.document) });
                    });
                } else {
                    this._iframe.on('load', Y.bind(this._onContentReady, this));
                }
            }
            var html = '',
                doc = this._instance.config.doc;

            if (this.get('src').indexOf('javascript') === 0) {
                Y.log('Creating the document from a javascript URL', 'info', 'frame');
                html = Y.substitute(Frame.PAGE_HTML, {
                    TITLE: this.get('windowTitle'),
                    META: Frame.META,
                    CONTENT: this.get('content'),
                    BASE_HREF: this.get('basehref')
                });
                if (Y.config.doc.compatMode != 'BackCompat') {
                    Y.log('Adding Doctype to frame', 'info', 'frame');
                    html = Frame.DOC_TYPE + "\n" + html;
                } else {
                    Y.log('DocType skipped because we are in BackCompat Mode.', 'warn', 'frame');
                }

                Y.log('Injecting content into iframe', 'info', 'frame');
                doc.open();
                doc.write(html);
                doc.close();
                if (this.get('designMode')) {
                    doc.designMode = 'on';
                }
            }
        },
        /**
        * @method delegate
        * @description A delegate method passed to the instance's delegate method
        * @param String type The type of event to listen for
        * @param Function fn The method to attach
        * @param String cont The container to act as a delegate, if no "sel" passed, the body is assumed as the container.
        * @param String sel The selector to match in the event (optional)
        * @return EventHandle
        */
        delegate: function(type, fn, cont, sel) {
            var inst = this.getInstance();
            if (!inst) {
                Y.log('Delegate events can not be attached until after the ready event has fired.', 'error', 'iframe');
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
        * @return YUI The internal YUI instance
        */
        getInstance: function() {
            return this._instance;
        },
        /**
        * @method render
        * @description Render the iframe into the container config option or open the window.
        * @param String/HTMLElement/Node node The node to render to
        * @return self
        * @chainable
        */
        render: function(node) {
            if (this._rendered) {
                Y.log('Frame already rendered.', 'warn', 'frame');
                return this;
            }
            this._rendered = true;
            if (node) {
                this.set('container', node);
            }
            var inst,
                res = this._create(),
                cb = Y.bind(function(i) {
                    Y.log('Internal instance loaded with node', 'info', 'frame');
                    this._instanceLoaded(i);
                }, this),
                args = Y.clone(this.get('use')),
                config = {
                    debug: false,
                    bootstrap: false,
                    win: res.win,
                    doc: res.doc
                },
                fn = Y.bind(function() {
                    Y.log('New Modules Loaded into main instance', 'info', 'frame');
                    config = this._resolveWinDoc(config);
                    inst = YUI(config);
                    Y.log('Creating new internal instance with node only', 'info', 'frame');
                    inst.use('node-base', cb);
                }, this);

            args.push(fn);

            Y.log('Adding new modules to main instance', 'info', 'frame');
            Y.use.apply(Y, args);
            return this;
        },
        /**
        * @private
        * @method _resolveBaseHref
        * @description Resolves the basehref of the page the frame is created on. Only applies to dynamic content.
        * @param String href The new value to use, if empty it will be resolved from the current url.
        * @return String
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
        * @method _getType
        * @description Getter method for the type attribute.
        * @param String type The type of frame to create
        * @return String
        */
        _getType: function(type) {
            switch (type.toLowerCase()) {
                case 'window':
                case 'iframe':
                    break;
                default:
                    type = 'iframe';
                    break;
            }
            return type;
        }
    }, {
        /**
        * @static
        * @property HTML
        * @description The template string used to create the iframe
        * @type String
        */
        HTML: '<iframe border="0" frameBorder="0" marginWidth="0" marginHeight="0" leftMargin="0" topMargin="0" allowTransparency="true" width="100%" height="100%"></iframe>',
        /**
        * @static
        * @property PAGE_HTML
        * @description The template used to create the page when created dynamically.
        * @type String
        */
        PAGE_HTML: '<html><head><title>{TITLE}</title>{META}<base href="{BASE_HREF}"/></head><body>{CONTENT}</body></html>',
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
        META: '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>',
        /**
        * @static
        * @property NAME
        * @description The name of the class
        * @type String
        */
        NAME: 'iframe',
        ATTRS: {
            /**
            * @config src
            * @description The src of the iframe/window. Defaults to javascript:;
            * @type String
            */
            src: {
                //Hackish, IE needs the false in the Javascript URL
                value: 'javascript' + ((Y.UA.ie) ? ':false' : ':') + ';'
            },
            /**
            * @config type
            * @description The type of frame to make. (iframe or window)
            * @type String
            * @writeonce
            */
            type: {
                writeOnce: true,
                value: 'iframe',
                getter: '_getType'
            },
            /**
            * @config windowFeatures
            * @description The extra options to pass to window.open. Default: resizable=yes,width=450,height=550
            * @type String
            */
            windowFeatures: {
                value: 'resizable=yes,width=450,height=550'
            },
            windowTitle: {
                value: 'Page Title'
            },
            /**
            * @config designMode
            * @description Should designMode be turned on after creation.
            * @writeonce
            * @type Boolean
            */
            designMode: {
                writeOnce: true,
                value: false
            },
            /**
            * @config content
            * @description The string to inject into the body of the new frame/window.
            * @type String
            */
            content: {
                value: '<br>'
            },
            basehref: {
                value: false,
                getter: '_resolveBaseHref'
            },
            /**
            * @config use
            * @description Array of modules to include in the scoped YUI instance at render time. Default: ['none', 'selector-css2']
            * @writeonce
            * @type Array
            */
            use: {
                writeOnce: true,
                value: ['node', 'selector-css3']
            },
            /**
            * @config container
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
            * @config id
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
            }
        }
    });

    Y.Frame = Frame;

}, '@VERSION@' ,{requires:['base', 'node', 'selector-css3'], skinnable:false });
