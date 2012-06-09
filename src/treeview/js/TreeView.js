

/**
 * The Treeview component is a UI widget that allows users
 * to create a hierarchical-like structure of elements.
 * Extends Y.WidgetParent, Y.WidgetChild, Y.WidgetHTMLRenderer
 * Treeview can be generated either by providing a configuration object  
 * @module TreeView
 */
    Y.TreeView = Y.Base.create("treeview", WIDGET, [Y.WidgetParent, Y.WidgetChild, Y.WidgetHTMLRenderer], {
    
        /**
         * Property defining the markup template for bounding box.
         *
         * @property BOUNDING_TEMPLATE
         * @type String
        */
        BOUNDING_TEMPLATE : '<ul id="{{id}}" class="{{boundingClasses}}">{{{contentBox}}}</ul>',
        
        /**
         * Property defining the markup template for content box.          
         *
         * @property CONTENT_TEMPLATE
         * @type String
        */
        
        /**
         * Property defining the markup template for the trewview label .
         *
         * @property TREEVIEWLABEL_TEMPLATE
         * @type String
        */
        TREEVIEWLABEL_TEMPLATE : "<a class='{{{treelabelClassName}}}' role='treeitem' tabindex='0'><span class={{{labelcontentClassName}}}>{{{label}}}</span></a>",
        
        /**
         * Property defining the markup template for the expand controller.
         *
         * @property EXPANDCONTROL_TEMPLATE
         * @type String
        */
        EXPANDCONTROL_TEMPLATE : "<span class='{{{labelcontentClassName}}}'>{{{label}}}</span>",
               
        /**
         * Flag to indicate whether a content Box/Bounding box has been returned from the getter attribute.
         *
         * @property _handling
         * @type Boolean
        */
        
        /**
         * The template for a branch element.
         *
         * @property branchTemplate
         * @type String
        */

        /**
         * Initializer lifecycle implementation for the Treeview class. 
         * <p>Registers the Treeview instance. It subscribes to the onParentChange 
         *    event which is triggered each time a new tree is added.</p>
         * <p>It publishes the toggleTreeState event, which gets fired everytime a node is
         *    collapsed/expanded</p>
         *
         * @method initializer
         * @public
         * @param  config {Object} Configuration object literal for the widget
         */
        initializer : function (config) {
            this.publish('toggleTreeState', { 
                defaultFn: this.toggleTreeState
            });
            
            Y.after(this._setChildrenContainer, this, "render");
        },
        
        /**
         * renderUI implementation
         *
         * Creates a visual representation of the treeview based on existing parameters. 
         * @method renderUI
        */  
        renderUI: function (contentBuffer) {
            var label = this.get("label"),
                labelContent,
                isBranch = this.get("depth") > -1,
                treelabelClassName = this.getClassName("treelabel"),
                labelcontentClassName = classNames.labelcontent;
                
                this.BOUNDING_TEMPLATE = isBranch ? '<li id="{{{id}}}" role="presentation" class="{{{boundingClasses}}}">{{{contentBox}}}</li>' : '<ul id="{{{id}}}" role="tree" class="{{{boundingClasses}}}">{{{contentBox}}}</ul>';
                this.CONTENT_TEMPLATE = isBranch ? '<ul id="{{id}}" role="group" class="{{{contentClasses}}}">{{{content}}}</ul>' : null;
                labelContent = Y.Handlebars.render(this.TREEVIEWLABEL_TEMPLATE, {label:label, treelabelClassName : treelabelClassName, labelcontentClassName : labelcontentClassName});
                contentBuffer.push(labelContent);
        },
        
      
        /**
         * bindUI implementation
         *
         * Assigns listeners to relevant events that change the state
         * of the treeview.
         * @method bindUI
        */ 
        bindUI: function() {
            //only attaching to the root element
            if (this.isRoot()) {
                this.get("boundingBox").on("click",this._onViewEvents,this);
                this.get("boundingBox").on("keydown",this._onKeyDown,this);
                
                this._keyEvents = [];
                this._keyEvents[KEY_UP] = this._onUpKey;
                this._keyEvents[KEY_DOWN] = this._onDownKey;
                this._keyEvents[KEY_LEFT_ARROW] = this._onLeftArrowKey;
                this._keyEvents[KEY_RIGHT_ARROW] = this._onRightArrowKey;
            }
        },
        
        /**
         * Handles all the internal treeview events.         
         * @method onViewEvents
         * @protected
         */
        _onViewEvents : function (event) {
            var target = event.target,
                classes,
                className,
                i,
                cLength;
                
            
            classes = target.get("className").split(" ");
            cLength = classes.length;
            
            for (i=0;i<cLength;i++) {
                className = classes[i];
                if (className === classNames.labelcontent) {
                    this.fire('toggleTreeState',{actionNode:target});
                    break;
                }
            }
        },
        
        /**
         * Handles all the internal keydown events.          
         * @method onViewEvents
         * @protected
         */
        _onKeyDown : function (e) {
            var keyCode = e.keyCode,
                target = e.target,
                handler = this._keyEvents[keyCode];
                
            if (handler) {
                handler.call(this, target);
            }
        },
        
         /**
         * Called when the up arrow key is pressed.
         *
         * @method _keyDown
         * @protected
         */
        _onUpKey : function (target) {
            var prevEl = target.previous("li");
            
            if (prevEl) {
                prevEl.focus();
            }
        },
        
         /**
         * Called when the down arrow key is pressed.
         * @param {Y.Node} The target element
         *
         * @method _keyDown
         * @protected
         */
        _onDownKey : function (target) {
            var nextEl = target.next("li");
            
            if (nextEl) {
                nextEl.focus();
            }
        },
        
         /**
         * Called when the right arrow key is pressed.
         *
         * @param {Y.Node} The target element
         * @method _keyDown
         * @protected
         */
        _onRightArrowKey : function (target) {
            this.expand(target);
        },
        
         /**
         * Called when the left arrow key is pressed.
         *
         * @param {Y.Node} The target element
         * @method _keyDown
         * @protected
         */
        _onLeftArrowKey : function (target) {
            this.collapseTree(target);
        },
        
       /**
        * Renders all child Widgets for the parent.  
        * <p>
        * This method in invoked after renderUI is invoked for the Widget class
        * using YUI's aop infrastructure. 
        * OVERWRITE : Overwritting for string rendering mode, if lazyLoad is enabled
        * it will not prepare the children strings until is needed.
        * </p>
        * @param {Object} The contentBuffer 
        * @method _renderChildren
        * @protected
        */ 
        _renderChildren: function (contentBuffer) {
            var childrenHTML;
            
            if (!this.get("lazyLoad")) {
                childrenHTML = this._getChildrenHTML(this);
                contentBuffer.push(childrenHTML);
            }
        },
        
        /**
        * Renders all child Widgets for the parent.  
        * <p>
        * Giving a tree, it concatenates all the strings for it's children
        * </p>
        * @param {Object} The tree we are trying to obtain the children from
        * @method getChildrenHTML
        * @protected
        */ 
        _getChildrenHTML : function (tree) {
             var childrenHTML = "";

            tree.each(function (child) {
                childrenHTML += child.renderHTML();
                child.set("DOMReady",true);
            });
            
            return childrenHTML;
        },
        
      /**
        *  
        * <p>
        * This method in invoked on demand when children are required
        * to be displayed. Gets the strings, then append it to its parent
        * </p>
        * @method _lazyRenderChildren
        * @param {Object} treeWidget, the widget Object 
        * @param {Y.Node} treeNode 
        * @protected
        */ 
        _lazyRenderChildren : function (treeWidget,treeNode) {
            
            var childrenHTML = treeWidget._getChildrenHTML(treeWidget);
            
            treeNode.append(childrenHTML);
            treeWidget.set("populated",true);
        },
        
       /**
        * <p>
        *   Collapses a tree.
        * </p>
        * @param {Y.Node} This param is optional - The target that triggered the event
        * @method collapse
        * @protected
        */ 
        collapse : function (target) {
            var treeNode = target ? target.ancestor('.'+ classNames.treeviewcontent) : this.get("contentBox"),
                treeWidget = Y.Widget.getByNode(treeNode);
            
            if (!treeWidget.get("collapsed")) {
                treeWidget.set("collapsed", true);   
                treeNode.addClass(classNames.collapsed);
                treeNode.setAttrs({'aria-collapsed': true });
            }
            
        },
        
       /**
        * <p>
        *   Expands a tree. If the tree hasn't been rendered yet, it will render it before, then expand it.
        * </p>
        * @param {Y.Node} This param is optional - The target that triggered the event
        * @method expand
        * @protected
        */ 
        expand : function (target) {
            var treeNode = target ? target.ancestor('.'+ classNames.treeviewcontent) : this.get("contentBox"),
                treeWidget = Y.Widget.getByNode(treeNode),
                isPopulated = treeWidget.get("populated");
            
            
            if (this.get("lazyLoad") && !isPopulated) {
                treeWidget._lazyRenderChildren(treeWidget,treeNode);
                treeWidget.set("populated",true);
            }
            
            if (treeWidget.get("collapsed")) {
                treeWidget.set("collapsed", false); 
                treeNode.removeClass(classNames.collapsed);
                treeNode.setAttrs({'aria-collapsed': false });
            }        
        },
        
       /**
        * Toggles the tree. If the Tree hasn't been rendered it will render it before.
        * @param {Y.Node} This param is optional - The target that triggered the event
        * @method _toggleTreeState
        * @protected
        */
       toggleTreeState : function (target) {
            var treeNode = target ? target.actionNode.ancestor('.'+ classNames.treeviewcontent) : this.get("contentBox"),
                treeWidget = Y.Widget.getByNode(treeNode),
                isPopulated = treeWidget.get("populated");
            
            if (this.get("lazyLoad") && !isPopulated) {
                treeWidget._lazyRenderChildren(treeWidget,treeNode);
                treeWidget.set("populated",true);
            }
            
            treeWidget.set("collapsed", !treeWidget.get("collapsed"));        
            treeNode.toggleClass(classNames.collapsed);
        },

        
        /******************* OVERWRITE **************************/
                
         
        /**
         * Sets the container for children to renderTo when using _uiAddChild
         *
         * @method _setChildrenContainer
        */  
        _setChildrenContainer : function () {
             var renderTo = this._childrenContainer || this.get("contentBox");
             this._childrenContainer = renderTo;
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
                
                boundingClasses[boundingClasses.length] = Widget.getClassName();
                
                
            for (i = classes.length-3; i >= 0; i--) {
                cl = classes[i];
                boundingClasses[boundingClasses.length] = Y.ClassNameManager.getClassName(cl.NAME.toLowerCase()) || this.getClassName(cl.NAME.toLowerCase());
            }
            
            
            
            if (this.CONTENT_TEMPLATE === null) {
                boundingClasses.push(contentClass);
                boundingClasses.push(classNames.collapsed);
            } else {
                context.contentClasses = contentClass + " " + classNames.collapsed;
            }
            
            context.boundingClasses = boundingClasses.join(" ");
        },

        
        /**
        * Updates the UI in response to a child being added.
        *
        * @method _uiAddChild
        * @protected
        * @param child {Widget} The child Widget instance to render.
        * @param parentNode {Object} The Node under which the 
        * child Widget is to be rendered.
        */    
        _uiAddChild: function (child, parentNode) {
            var parent = child.get("parent"),
                childBB,
                siblingBB,
                nextSibling,
                prevSibling;
            
            if (parent.get("populated")) {
                child.render(parentNode);
                childBB = child.get("boundingBox");
                nextSibling = child.next(false);

            
            // Insert or Append to last child.
            
            // Avoiding index, and using the current sibling 
            // state (which should be accurate), means we don't have 
            // to worry about decorator elements which may be added 
            // to the _childContainer node.
            
            if (nextSibling && nextSibling.get("DOMReady")) {
            
                siblingBB = nextSibling.get(BOUNDING_BOX);
                siblingBB.insert(childBB, "before");
            
            } else {
                prevSibling = child.previous(false);
                
                if (prevSibling && prevSibling.get("DOMReady")) {
                
                    siblingBB = prevSibling.get(BOUNDING_BOX);
                    siblingBB.insert(childBB, "after");
                
                } else if (!parentNode.contains(childBB)) {
                
                    // Based on pull request from andreas-karlsson
                    // https://github.com/yui/yui3/pull/25#issuecomment-2103536
                
                    // Account for case where a child was rendered independently of the 
                    // parent-child framework, to a node outside of the parentNode,
                    // and there are no siblings.
                
                    parentNode.appendChild(childBB);
                }
            }

            }
        }

    }, {
        ATTRS: {
            /**
             * The label attribute for the tree.
             *
             * @attribute label
             * @type String
             */
            label : {
                value:""
            },
            
            /**
             * Flag to indicate if a tree has been rendered to the DOM or not
             *
             * @attribute _populated
             * @type Boolean
            */
            DOMReady : {}, 

             
            /**
             * Configuration to set lazyLoad enabled. When enabled, all the children rendering will be done on demand.
             *
             * @attribute lazyLoad
             * @type Boolean
            */
            
            lazyLoad : {
                writeOnce : "initOnly",
                value : true
            },
            
            
            /**
             * Attribute to indicate whether a tree has been populated with it's children or not.
             *
             * @attribute populated
             * @type Boolean
            */

            populated : {
                readOnly : true
            },
            
            /**
             * Attribute to indicate whether a tree is in a collapsed state or not
             *
             * @attribute collapsed
             * @type Boolean
            */
            
            collapsed : {
                value : true
            },
            
            /**
             * The default children type.
             *
             * @attribute defaultChildType
             * @type String
             */
            defaultChildType: {  
                value: "TreeLeaf"
            },
            
            /**
             * Specifying a custom getter for the Bounding box so that
             * it's only rendered when needed. 
             * @attribute boundingBox
             * @type BoundingBox
             */
            boundingBox: {
                getter : function(val) {
                    return val ? val :  _getBox(this,BOUNDING_BOX);

                }
            },
            
            /**
             * Specifying a custom getter for the Content box so that
             * it's only rendered when needed. 
             * @attribute contentBox
             * @type contentBox
             */
            contentBox: {
                getter : function(val) {
                    return val ? val :  _getBox(this,CONTENT_BOX);
                }
            }
        }
    });
    
    /**
    *  Treeleaf component of Treeview. Defines a Y.Widget that extends from Y.WidgetChild,
    * this is the default child type of a tree unless specified otherwise.
    * @module Y.TreeLeaf
    */
    Y.TreeLeaf = Y.Base.create("treeleaf", WIDGET, [Y.WidgetChild,Y.WidgetHTMLRenderer], {
    
        /**
         * Property defining the markup template for bounding box.
         *
         * @property BOUNDING_TEMPLATE
         * @type String
        */
        BOUNDING_TEMPLATE : '<li id="{{id}}" role="treeitem" class="{{boundingClasses}}" tabindex="-1">{{{contentBox}}}</li>',
        
        /**
         * Property defining the markup template for content box.
         *
         * @property CONTENT_TEMPLATE
         * @type String
        */
        CONTENT_TEMPLATE : null,
    
        /**
         * renderUI implementation
         *
         * Creates a visual representation of the treeview based on existing parameters. 
         * @method renderUI
        */  
        renderUI: function (contentBuffer) {
            contentBuffer.push(this.get("label"));
        }
    }, {
    
        ATTRS: {
            /**
             * Flag to indicate if a leaf has been rendered to the DOM or not
             *
             * @attribute DOMReady
             * @type Boolean
            */
            DOMReady : {
                value : false
            }, 

            /**
             * The label attribute for the tree.
             *
             * @attribute label
             * @type String
             */
            label: {},
            
            /**
             * Specifying a custom getter for the Bounding box so that
             * it's only rendered when needed. 
             * @attribute boundingBox
             * @type BoundingBox
             */
            boundingBox: {
                getter : function(val) {
                    return val ? val :  _getBox(this,BOUNDING_BOX);
                }
            },
            
            /**
             * Specifying a custom getter for the Content box so that
             * it's only rendered when needed. 
             * @attribute contentBox
             * @type contentBox
             */
            contentBox: {
                getter : function(val) {
                    return val ? val :  _getBox(this,CONTENT_BOX);
                }
            }
        }
    });
