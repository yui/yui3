/**
 Provides cell editors that appear to make the cell itself editable by occupying the same region.
 @module datatable
 @submodule datatable-celleditor-inline
*/
/**
 A View class that serves as the BASE View class for a TD Cell "inline" editor, i.e. an editor that
 is a single INPUT node that completely overlies the TD cell.  This editor is intended to replicate
 the familiar "spreadsheet" type of input.

 @class DataTable.BaseCellInlineEditor
 @extends DataTable.BaseCellEditor
 @author Todd Smith
 @since 3.8.0
 **/

var Editors = {},
    IEd =  Y.Base.create('celleditor',Y.DataTable.BaseCellEditor,[],{

    /**
     * Defines the INPUT HTML content "template" for this editor's View container
     * @property template
     * @type String
     * @default '<input type="text" class="{cssInput}" />'
     */
    template: '<input type="text" class="{cssInput}" />',

    /**
     * CSS classname to identify the editor's INPUT Node
     * @property _classInput
     * @type String
     * @default 'yui3-datatable-inline-input'
     * @protected
     */
    _cssInput: 'yui3-datatable-inline-input',




    /**
    The default action for the `show` event which should make the editor visible.


    @method _defShowFn
    @param ev {EventFacade}
    @protected
    */
    _defShowFn: function (ev) {
        Y.log('DataTable.BaseCellInlineEditor._defShowFn');
        var cont = this.get('container'),
            td = ev.td,
            xy = td.getXY();
        //
        // Get the TD Node's XY position, and resize/position the container
        //   over the TD
        //

        cont.show();
        this._resizeCont(cont, td);
        cont.setXY(xy);

        IEd.superclass._defShowFn.apply(this, arguments);
    },

    /**
     * Processes the initial container for this View, sets up the HTML content
     *  and creates a listener for positioning changes
     * @method _defRenderFn
     * @private
     */
    _defRenderFn: function () {
        Y.log('DataTable.BaseCellInlineEditor._defRenderFn');
        var container = this.get('container'),
            html      = Y.Lang.sub(this.template, {cssInput:this._cssInput});

        // set the View container contents
        container.setHTML(html);

        // Append the container element to the DOM if it's not on the page already.
        if (!container.inDoc()) {
          Y.one('body').append(container);
        }

        container.setStyle('zIndex',999);

        container.hide();

        // set a static placeholder for the input ...
        this._inputNode = container.one('input');
        if(this.get('className')) {
            this._inputNode.addClass(this.get('className'));
        }

    },

    /**
    Overrides the base _bindUI method to add a its own event listeners
    @method _bindUI
    @protected
    */

    _bindUI: function () {
        Y.log('DataTable.BaseCellInlineEditor._bindUI');
        IEd.superclass._bindUI.apply(this, arguments);
        this._subscr.push(this._inputNode.on('mouseleave', this._onMouseLeave, this));
    },

    /**
     * Resizes the view "container" to match the dimensions of the TD cell that is
     *  being edited.
     *
     * @method _resizeCont
     * @param {Node} cont The Node instance of the "container" of this view
     * @param {Node} td The Node instance for the TD to match dimensions of
     * @private
     */
    _resizeCont: function (cont, td) {
        Y.log('DataTable.BaseCellInlineEditor._resizeCont');
        var parseStyle = function (v) {
               return parseFloat(td.getComputedStyle(v));
            },
            w   = parseStyle('width'),
            h   = parseStyle('height'),
            pl  = parseStyle('paddingLeft'),
            pt  = parseStyle('paddingTop'),
            blw = parseStyle('borderLeftWidth');

        //  resize the INPUT width and height based upon the TD's styles
        w += pl + blw - 1;
        h += pt;

        cont.setStyle('width', w + 'px');
        cont.setStyle('height', h + 'px');

    },


    /**
     * Listener to mouseleave event that will hide the editor if attribute "hideMouseLeave" is true
     * @method _onMouseLeave
     * @private
     */
    _onMouseLeave : function () {
        Y.log('DataTable.BaseCellInlineEditor._onMouseLeave');
        if(this.get('hideMouseLeave')){
            this.hideEditor();
        }
    },

    /**
     * This method can be used to quickly reset the current View editor's position,
     *  used for scrollable DataTables.
     *
     * NOTE: Scrollable inline editing is a little "rough" right now
     *
     * @method _afterXYChange
     * @param e {EventFacade} The xy attribute change event facade
     * @private
     */
    _afterXYChange: function () {
        Y.log('DataTable.BaseCellInlineEditor._afterXYChange');

        //if(this._inputNode && e.newVal) {
        //    this._inputNode.setXY(e.newVal);
        //}

        //TODO: Worst case, if this doesn't work just hide this sucker on scrolling !
        this.hideEditor();
    }


},{
    ATTRS:{


        /**
         * This flag dictates whether the View container is hidden when the mouse leaves
         * the focus of the inline container.
         * Typically we want this behavior, one example where we don't would be an
         * inline autocomplete editor.
         * @attribute hideMouseLeave
         * @type Boolean
         * @default true
         */
        hideMouseLeave : {
            value:      true,
            validator:  Y.Lang.isBoolean
        },

        /**
         * Prescribes a CSS class name to be added to the editor's INPUT node after creation.
         * @attribute className
         * @type String
         * @default null
         */
        className: {
            value:      null,
            validator:  Y.Lang.isString
        }



    }
});


Y.DataTable.BaseCellInlineEditor = IEd;
//====================================================================================================================
//                   I N L I N E    C E L L    E D I T O R    D E F I N I T I O N S
//====================================================================================================================


/**
Produces a simple simple inline-type cell editor.

##### Basic Usage:

    // Column definition
    { key:'surName', editor:"inline" }

Since the `defaultEditor` attribute defaults to `"inline"`, any cell that
doesn't have editing disable will use this editor.


@property inline
@type DataTable.BaseCellEditor
@for DataTable.Editors
@since 3.8.0
@public
**/
Editors.inline = IEd;


/**
This cell editor is identical to the "inline" textual editor but incorporates Numeric validation prior to
saving to the DT.

##### Basic Usage:

    // Column definition
    { key:'unit_price', editor:"inlineNumber" }

    // Column definition ... to allow integers only
    {
        key:'QuantityInStock',
        editor:"inlineNumber",
        editorConfig: {
            keyFiltering: /^\d*$/
        }
    }

(note: keyFiltering requires the `datatable-celleditor-keyfiltering` module to be active)
@property inlineNumber
@type DataTable.BaseCellEditor
@for DataTable.Editors
@since 3.8.0
@public
**/
Editors.inlineNumber = Y.Base.create('celleditor', IEd, [],
    {},
    {
        ATTRS: {

            hideMouseLeave: {
                value: false
            },

            // Define a key filtering regex ...
            keyFiltering:   {
                    value : /^(\.|\d|\-)*$/
            },

            /**
             * A validation regular expression object used to check validity of the input floating point number.
             * This can be defined by the user to accept other numeric input, or set to "null" to disable regex checks.
             *
             * @attribute validator
             * @type {RegExp|Function}
             * @default /^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/
             */
            validator: {
                    value: /^\s*(\+|-)?((\d+(\.\d*)?)|(\.\d*))\s*$/
            },

            // Function to call after numeric editing is complete, prior to saving to DataTable ...
            //  i.e. checks validation against ad-hoc attribute "validationRegExp" (if it exists)
            //       and converts the value to numeric (or undefined if fails regexp);
            parser: {
                value: function (v) {
                    Y.log('inlineNumber.parser: ' + v);
                    return parseFloat(v) || 0;
                }
            }

        }
    }
);

/**
This cell editor is identical to the "inline" textual editor but incorporates date validation prior to
saving to the DT.

##### Basic Usage:

    // Column definition
    { key:'weddingDate', editor:"inlineDate" }

    // Column definition with user-specified 'dateFormat' to display Date in text box on display
    {
        key:'date_of_claim',
        editor:"inlineDate",
        editorConfig:{ dateformat:'%Y-%m-%d'}
    }


@property inlineDate
@type DataTable.BaseCellEditor
@for DataTable.Editors
@since 3.8.0
@public
**/
Editors.inlineDate = Y.Base.create('celleditor', IEd, [],
    {},
    {
        ATTRS: {

            /**
             * A user-supplied Date format string to be used to display the date in the View's container.
             * (Must conform with date format strings from http://yuilibrary.com/yui/docs/api/classes/Date.html#method_format,
             * i.e. strftime format)
             *
             * @attribute dateFormat
             * @type String
             * @default "%D"
             */
            dateFormat: {
                value:"%D"
            },

            keyFiltering: {
                    value: /^(\/|\d|\-)*$/
            },

            //  Function to call just prior to populating the INPUT text box,
            //   so we pre-format the textbox in "human readable" format here
            formatter: {
                value: function (v){
                    Y.log('inlineDate.formatter: ' + v);
                    var dfmt =  this.get('dateFormat') || "%m/%d/%Y";
                    return Y.DataType.Date.format(v,{format:dfmt});
                }
            },

            // Function to call after Date editing is complete, prior to saving to DataTable ...
            //  i.e. converts back to "Date" format that DT expects ...
            parser: {
                value: function(v){
                    Y.log('inlineDate.parser: ' + v);
                    return Y.DataType.Date.parse(v) || Y.Attribute.INVALID_VALUE;
                }
            }
        }
    }
);


/**
This cell editor has the AutoComplete plugin attached to the input node.

##### Basic Usage:

    // Column definition
    {
        key:'degreeProgram',
        editor:"inlineAC",
        editorConfig:{

            // The following object is passed to "autocomplete" plugin when this
            //   editor is instantiated
            autocompleteConfig: {
               source:  [ "Bachelor of Science", "Master of Science", "PhD" ]
               on: {
                   select: function (r) {
                       var val = r.result.display;
                       this.editor.saveEditor(val);
                   }
               }
            }
        }
    }


@property inlineAC
@type DataTable.BaseCellEditor
@for DataTable.Editors
@since 3.8.0
@public
**/
Editors.inlineAC = Y.Base.create('celleditor', IEd, [],
    {
        render: function () {
            Y.log('inlineAC.render');
            Editors.inlineAC.superclass.render.apply(this, arguments);
            var inputNode = this._inputNode,
               // Get the users's editorConfig "autocompleteConfig" settings
               acConfig = this.get('autocompleteConfig') || {},
               editor = this;

            if(inputNode && Y.Plugin.AutoComplete) {
               // merge user settings with these required settings ...
               acConfig = Y.merge(acConfig,{
                   alwaysShowList: true,
                   render: true
               });
               // plug in the autocomplete and we're done ...
               inputNode.plug(Y.Plugin.AutoComplete, acConfig);

               // add this View class as a static prop on the ac plugin
               inputNode.ac.editor = editor;
            }
            return this;

        }
    },
    {
        ATTRS: {

            hideMouseLeave: {
                value: false
            }

            /**
             * A user-supplied set of configuration parameters to be passed into this View's Y.Plugin.AutoComplete
             * configuration object.
             *
             * At a bare minimum, the user MUST provide the "source" of data for the AutoComplete !!
             *
             * For this control to save anything, the user needs to define an "on:select" listener in the AC's
             * "autocompleteConfig" in order to saveEditor when the select action occurs.
             *
             * @attribute autocompleteConfig
             * @type Object
             * @default {}
             */

            // Define listener to this editor View's events
        }
    }

);
Y.mix(Y.DataTable.Editors, Editors);