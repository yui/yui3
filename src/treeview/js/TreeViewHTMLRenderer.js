/**
 * Provides the WidgetHTMLRenderer extensions, which override the base Widget API 
 * to allow widgets to be rendered purely using HTML from templates, without any 
 * Node references. 
 * 
 * This allows Widgets to be rendered on the server, and also optimizes rendering 
 * in high-scale applications such as TreeView.
 * 
 * **Note:** When applied, Node references to `boundingBox` and `contentBox` 
 * won't be available until the Widget is rendered.
 * 
 * Although not required of widget implementors, the Widget base class uses
 * Handlebars to render its `boundingBox` and `contentBox` templates. If 
 * overriding the `CONTENT_TEMPLATE` or `BOUNDING_TEMPLATE` values, you should 
 * use Handlebars token syntax, and maintain tokens used by the default 
 * templates.
 *
 * @module widget-htmlrenderer
 */

var getClassName = Y.ClassNameManager.getClassName,
        TREEVIEW = 'treeview',
        TREE = 'tree',
        TREELEAF = 'treeleaf',
        CONTENT_BOX = "contentBox",
        BOUNDING_BOX = "boundingBox",
        TRUE = true,
        WIDGET = Y.Widget,
        VALUE = "value",
        CONTENT = "content",
        Widget = Y.Widget,
        Node = Y.Node,
        ID = "id",
        DESTROYED = "destroyed",
        BODY = "body",
        KEY_DOWN        = 40,
        KEY_LEFT_ARROW  = 37,
        KEY_RIGHT_ARROW = 39,
        KEY_UP          = 38,
        Handlebars = Y.Handlebars,
        _getClassName = Y.ClassNameManager.getClassName,
        _getWidgetClassName = Y.Widget.getClassName,
        classNames = {
            loading : getClassName(TREEVIEW,'loading'),
            tree : getClassName(TREE),
            treeLabel : getClassName(TREEVIEW,"treelabel"),
            labelcontent : getClassName(TREEVIEW,'label-content'),
            treeview : getClassName(TREEVIEW),
            treeviewcontent : getClassName(TREEVIEW,"content"),
            collapsed : getClassName(TREE,"collapsed"),
            leaf : getClassName(TREELEAF)
        },
        _getBox = function (widget,box) {
            var value;
            
            if (widget.get("initialized") && !widget.get("rendered") && !widget._handling && widget.get("DOMReady")) {
                widget._handling = TRUE;
                widget.render();
                value = widget._state.get(box,VALUE);
            }
            return value;
        };
        
/**
 * WidgetHTMLRenderer is an Extension for Widget, to be used with Y.Base.create or
 * Y.Base.mix. It provides a `renderHTML()` method which can be used to generate the 
 * initial markup for the widget purely from templates, without creating Node 
 * references.
 *
 * When mixed in, `renderHTML()` will generate the markup for the widget and the 
 * caller is responsible for adding it to the DOM. 
 *
 * Widget developers need to implement a `renderUI(buffer)` method which writes
 * string content to the buffer passed in. This buffer gets added as the contents
 * of the contentBox.
 *
 * `render()` will generate boundingBox and contentBox node references, and invoke 
 * `bindUI()` and `syncUI()` to bind them.
 *
 * If `render()` is called and `renderHTML()` hasn't been invoked already, 
 * it will be invoked, before bindUI and syncUI are called.
 *
 * @class WidgetHTMLRenderer
 */
Y.WidgetHTMLRenderer = function() {};

Y.WidgetHTMLRenderer.prototype = {

    /**
     * Generates the markup for the widget. 
     * 
     * Widget implementers need to implement a renderUI(buffer) method which
     * writes string content to the buffer (array) passed in. The buffers contents
     * get added as the contents of the contentBox.
     *
     * @method renderHTML
     * @public
     * @param appendTarget {Node|Array}. Optional. The array or node to push content to.
     * @return {HTML} The rendered HTML string for the widget
     */
    renderHTML: function(appendTarget) {

        var boxBuffer,
            contentBuffer,
            context,
            renderedContent;

        if (this.get(DESTROYED)) { Y.log("renderHTML failed; widget has been destroyed", "error", "widget"); }

        if (!this.get(DESTROYED)) {

            context = {};

            contentBuffer = [];
            this.renderUI(contentBuffer, context);

            context.content = contentBuffer.join("");

            boxBuffer = [];
            this._renderUI(boxBuffer, context);

            renderedContent = boxBuffer.join("");

            if (appendTarget) {
                if (Node && appendTarget instanceof Node) {
                    appendTarget.append(renderedContent);
                } else {
                    appendTarget.push(renderedContent);
                }
            }

            this._renderedUI = true;
        }

        return renderedContent;
    },

    /**
     * Internal method which wraps renderHTML with the default parent node for the 
     * widget. Used by the renderer to support the case where renderHTML hasn't been
     * invoked already when render() is called. 
     *
     * @method _renderHTML
     * @private
     */
    _renderHTML: function() {

        // TODO: Widget should extract this logic into a method for easy reuse
        var defParentNode = this.DEF_PARENT_NODE,
            parentNode = this._parentNode || (defParentNode && Node.one(defParentNode)),
            buffer = parentNode || [],
            content;

        this.renderHTML(buffer);

        if (!parentNode) {
            content = buffer.join();
            Node.one(BODY).insert(content, 0);
        }
    },

    /**
     * Renders the template for the Widget's bounding/content boxes.
     *
     * @method _renderUI
     * @param {Array} buffer The buffer to write the rendered template to. Will ultimately be Array.join'd
     * @param {Object} context The context, passed to Handlebars.
     * @protected
     */
    _renderUI: function(buffer, context) {
        this._renderBox(buffer, context);
    },

    /**
     * Renders the templates for the Widget's bounding/content boxes
     *
     * @method _renderBox
     * @param {Array} The buffer to write the rendered template to. Will ultimately be Array.join'd
     * @param {Object} The context, passed to Handlebars.
     * @protected
     */
    _renderBox: function(buffer, context) {

        context.id = this.get(ID);
        
        this._renderBoxClassNames(context);

        if (this.CONTENT_TEMPLATE) {
            context.contentBox = Handlebars.render(this.CONTENT_TEMPLATE, context); 
        } else {
            context.contentBox = context.content;
        }

        buffer.push(Handlebars.render(this.BOUNDING_TEMPLATE, context));

        this._mapInstance(context.id);
    },

    /**
     * Utility method to add the boundingClasses and contentClasses property values
     * to the Handlebars context passed in. Similar to _renderBoxClassNames() on 
     * the Node based renderer.
     * 
     * @method _renderBoxClassNames
     * @param {Object} context The Handlebars context object on which the 
     * boundingClasses and contentClasses properties get added.
     */
    _renderBoxClassNames: function(context) {

        var classes = this._getClasses(),
            cl,
            i,
            contentClass = this.getClassName(CONTENT),
            boundingClasses = [];

        boundingClasses[boundingClasses.length] = _getWidgetClassName();

        for (i = classes.length-3; i >= 0; i--) {
            cl = classes[i];
            boundingClasses[boundingClasses.length] = cl.CSS_PREFIX || _getClassName(cl.NAME.toLowerCase());
        }

        if (this.CONTENT_TEMPLATE === null) {
            boundingClasses.push(contentClass);
        } else {
            context.contentClasses = contentClass;
        }

        context.boundingClasses = boundingClasses.join(" ");
    },

    /**
     * Sync method, used to generate the boundingBox and contentBox node references,
     * after they've been added to the DOM. This method is invoked by render(),
     * prior to invoking bindUI()/syncUI() so that Node references are available 
     * for event binding and incremental updates.
     *
     * @method syncRenderedBoxes
     */
    syncRenderedBoxes : function() {

        var bb = Y.Node.one("#" + this.get(ID)),
            cb = (this.CONTENT_TEMPLATE === null) ? bb : bb.one("." + this.getClassName(CONTENT));

        this._set("boundingBox", bb);
        this._set("contentBox", cb);
    },

    /**
     * Overrides the base Widget renderer implementation to invoke:
     * 
     * - renderHTML() if it hasn't been invoked already. For the common use case it will have already been called to generate the markup string for the Widget.
     * - bindUI()
     * - syncUI()
     *
     * The renderer will invoke syncRenderedBoxes() before calling bindUI()/syncUI()
     * to establish the contentBox and boundingBox Node references, which don't 
     * exist prior to render() call. 
     * 
     * This method is invoked by render() and is not chained 
     * automatically for the class hierarchy (unlike initializer, destructor) 
     * so it should be chained manually for subclasses if required.
     *
     * @method renderer
     * @protected
     */
    renderer: function() {

        if (!this._renderedUI) {
            this._renderHTML();
        }

        // We need to setup bb/cb references, before bind/sync for backwards compat
        this.syncRenderedBoxes();

        this._bindUI();
        this.bindUI();

        this._syncUI();
        this.syncUI();
    },

    /**
     * The Handlebars template to use to render the basic boundingBox HTML.
     * 
     * When overriding this value, tokens should be maintained.
     * 
     * @property BOUNDING_TEMPLATE
     * @type String 
     */
    BOUNDING_TEMPLATE : '<div id="{{id}}" class="{{boundingClasses}}">{{{contentBox}}}</div>',

    /**
     * The Handlebars template to use to render the basic contentBox HTML.
     * 
     * When overriding this value, tokens should be maintained.
     * 
     * @property CONTENT_TEMPLATE
     * @type String 
     */
    CONTENT_TEMPLATE : '<div class="{{contentClasses}}">{{{content}}}</div>',

    /**
     * Helper method to set the bounding/content box.
     * 
     * Overrides the base Widget implementation to avoid creating a Node 
     * instance from the box templates. Node references to the boundingBox
     * and contentBox will be created during widget.render().
     *
     * @method _setBox
     * @private
     *
     * @param {String} id The node's id attribute
     * @param {Node|String} node The node reference
     * @param {String} template HTML string template for the node
     * @return {Node} The node
     */
    _setBox : function(id, node) {
        // We don't want to create a new node        
        node = Node.one(node);

        if (node && !node.get(ID)) {
            node.set(ID, id || Y.guid());
        }

        return node;
    }
};
