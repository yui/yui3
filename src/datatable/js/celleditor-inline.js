/**
 Provides cell editors that appear to make the cell itself editable by occupying the same region.
 @module datatable
 @submodule datatable-celleditor-inline
*/
/**
 A View class that serves as the BASE View class for a TD Cell "inline" editor, i.e. an editor that
 is a single INPUT node that completely overlies the TD cell.  This editor is intended to replicate
 the familiar "spreadsheet" type of input.

 ##### Editing / Validation

 This editor view creates a simple INPUT[type=text] control and repositions and resizes it to match the
 underlying TD, set with a z-Index to visually appear over the TD cell.

 Key listeners are provided to detect changes, prohibit invalid keystrokes (via the [keyFiltering](#attr_keyFiltering)
  setting) and to allow validation upon a "save" entry (keyboard RTN stroke) where a [validator](#attr_validator) can
 be prescribed to allow/disallow changes based upon the overall "value" of the INPUT control.

 ##### Navigation
 The editor provides the capability to navigate from TD cell via key listeners on the following key
 combinations;
  * CTRL-arrow keys
  * TAB goes to RIGHT, SHIFT-TAB goes to left
  * ESC cancels editing
  * RTN saves cell

 Key navigation can be disabled via the [inputKeys](#attr_inputKeys) attribute set to `false`.

 When a "key navigation" request is received it is passed to the [keyDir](#attr_keyDir) as a change
 in [row,col] that implementers can listen to "change" events on, to reposition and open editing on the
 new relative cell.  (NOTE: This view does not reposition, it simply fires a `keyNav` event.

 ##### Events
 Several events are fired by this View;  which can be listened for and acted upon to achieve differing results.
 For example, the Y.DataTable.EditorOptions.inlineAC (inline autocompletion editor) listens for the
 [editorCreated](#event_editorCreated) event and once received, it configures the autocomplete plugin onto the
 INPUT node.

 ##### Configuration
 Ths Y.DataTable.BaseCellInlineEditor editor is intended to be configured by varying the configuration
 parameters (i.e. attribute and related configuration) to permit a variety of editing features.

 Since the View class permits ad-hoc attributes, the implementer can pass many properties in during instantiation
 that will become available as run-time View attributes.

 This Module includes several pre-defined editor configurations which are stored within the Y.DataTable.EditorOptions
 namespace (presently there are "inline", "inlineNumber", "inlineDate", "inlineAC").  New inline editors can be
 created and added to this namespace at runtime, and by defining the `BaseViewClass:Y.DataTable.BaseCellInlineEditor` property.

 For example, the pre-built configuration object for the [inlineDate](Y.DataTable.EditorOptions.inlineDate.html) inline editor
 is stored as `Y.DataTable.EditorOptions.inlineDate`.

 To configure an editor on-the-fly (i.e. within a DataTable column definition) just include the configuration object options
 within DT's column `editorConfig` object, which is Y.merge'ed with the pre-built configs;

        // define an 'inlineDate' editor with additional configs ...
        { key:'date_of_claim', editor:"inlineDate", editorConfig:{ dateformat:'%Y-%m-%d'} }

 This `Y.DataTable.BaseCellinlineEditor` class is similar to (and compatible with ) the `Y.DataTable.BaseCellPopupEditor`.
 Note that since the "inline" editor uses a simple INPUT[type=text] Node instead of an
 Overlay the codeline is quite a bit simpler.

 ###### KNOWN ISSUES:
   <ul>
   <li>This View doesn't work well with scrolling DT's, so I've disabled it currently.</li>
   <li>Sometimes after a DT's `editable` ATTR is toggled true/false a "cannot read 'style'" message occurs and editing failes
        requiring a page refresh.</li>
   </ul>

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
     * @static
     */
    template: '<input type="text" class="{cssInput}" />',

    /**
     * CSS classname to identify the editor's INPUT Node
     * @property _classInput
     * @type String
     * @default 'yui3-datatable-inline-input'
     * @protected
     * @static
     */
    _cssInput: 'yui3-datatable-inline-input',




    /**
    The default action for the `show` event which should make the editor visible.


    @method _defShowFn
    @param e {EventFacade}
    @protected
    */
    _defShowFn: function (ev) {
        Y.log('DataTable.BaseCellInlineEditor._defShowFn');
        var cont = this.get('container'),
            cell = ev.cell,
            td = cell.td || ev.td,
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

//======================   PUBLIC METHODS   ===========================


//======================   PRIVATE METHODS   ===========================

    /**
     * Processes the initial container for this View, sets up the HTML content
     *  and creates a listener for positioning changes
     * @method _defRenderFn
     * @private
     */
    _defRenderFn: function() {
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
     * @method _setEditorXY
     * @param e {EventFacade} The xy attribute change event facade
     * @private
     */
    _setEditorXY: function () {
        Y.log('DataTable.BaseCellInlineEditor._setEditorXY');

        //if(this._inputNode && e.newVal) {
        //    this._inputNode.setXY(e.newVal);
        //}

        //TODO: Worst case, if this doesn't work just hide this sucker on scrolling !
        this.hideEditor();
    }


},{
    ATTRS:{


        /**
         * A cell reference object populated by the calling DataTable, contains
         * the following key properties: {td,value,recClientId,colKey}
         * @attribute cell
         * @type Object
         * @default {}
         */
        cell: {
            valueFn: function () {
                return {};  // otherwise you get all of them pointing exactly to the same static object.
            }
        },




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
        },

        /**
         * A flag to indicate if cell-to-cell navigation should be implemented (currently setup for CTRL-arrow
         * key, TAB and Shift-TAB) capability
         * @attribute inputKeys
         * @type Boolean
         * @default true
         */
        inputKeys:{
            value:      true,
            validator:  Y.Lang.isBoolean
        },


        /**
         * Provides a keystroke filtering capability to restrict input into the editing area checked during the
         * "keypress" event.  This attribute is set to either a RegEx or a function that confirms if the keystroke
         * was valid for this editor.  (TRUE meaning valid, FALSE meaning invalid)
         *
         * If a function is provided, the single argument is the keystroke event facade `e` and if
         * the keystroke is valid it should return true, otherwise if invalid false;
         *
         *  @example
         *      /\d/            // for numeric digit-only input
         *      /\d|\-|\./      // for floating point numeric input
         *      /\d|\//         // for Date field entry in MM/DD/YYYY format
         *
         * @attribute keyFiltering
         * @type {RegExp|Function}
         * @default null
         */
        keyFiltering:  {
            value:  null
        },

        /**
         * Provides the capability to validate the final saved value after editing is finished.
         * This attribute can be set to either a RegEx or a function, that operates on the entire
         * "value" setting of the editor input (whereas [keyFiltering](#attr_keyFilter) performs
         * validation checks on each key input).
         *
         * If a function is provided, the single argument is the value setting of the editor.
         * the keystroke is valid it should return true, otherwise if invalid false;
         *
         *  @example
         *      /\d/            // for numeric digit-only input
         *      /\d|\-|\.|\+/   // for floating point numeric input
         *      /\d|\//         // for Date field entry in MM/DD/YYYY format
         *
         * @attribute validator
         * @type {RegExp|Function}
         * @default null
         */
        validator: {
            value:      null
        }


    }
});


Y.DataTable.BaseCellInlineEditor = IEd;
//====================================================================================================================
//                   I N L I N E    C E L L    E D I T O R    D E F I N I T I O N S
//====================================================================================================================


/**
### Inline Cell Editor "inline"
This View configuration is used to setup an editor referenced as "inline" as a simple inline-type cell editor.

##### Basic Usage:
          // Column definition
          { key:'surName', editor:"inline" }

##### Standard Configuration
This inline editor creates a simple INPUT[type=text] control and positions it to match the underlying TD node. It
uses the default settings from the BaseViewClass's attributes.

The configuration {Object} for this cell editor View is predefined as;

         Y.DataTable.EditorOptions.inline = {
             BaseViewClass:  Y.DataTable.BaseCellInlineEditor,
             name:           'inline'
         };

 **PLEASE NOTE:** All other attributes from the `BaseViewClass` apply and can be included within the
 `editorConfig` object.

@class DataTable.EditorOptions.inline
@since 3.8.0
@public
**/
Editors.inline = IEd;


/**
### Inline Cell Editor "inlineNumber"
This View configuration is used to setup an editor referenced as "inlineNumber" as a simple inline-type
cell editor.  It is identical to the "inline" textual editor but incorporates Numeric validation prior to
saving to the DT.

##### Basic Usage:
        // Column definition
        { key:'unit_price', editor:"inlineNumber" }

        // Column definition ... to allow integers only
        { key:'QuantityInStock', editor:"inlineNumber", editorConfig:{ keyFiltering: /\d/ }  }

##### Standard Configuration
This inline editor creates a simple INPUT[type=text] control and positions it to match the underlying TD node.  A `saveFn`
is defined that uses an ad-hoc attribute "validationRegEx" to test for validity prior to saving the data.  If the
value passes validation it is converted to numeric form and returned.

The configuration {Object} for this cell editor View is predefined as;

         Y.DataTable.EditorOptions.inlineNumber = {
             BaseViewClass:  Y.DataTable.BaseCellInlineEditor,
             name:           'inlineNumber',
             hideMouseLeave: false,

             // Define a key filtering regex ... only allow digits, "-" or "."
             keyFiltering:   /\.|\d|\-/,

             // setup a RegExp to check for valid floating point input ....
             validator: /^\s*(\+|-)?((\d+(\.\d*)?)|(\.\d*))\s*$/,

             // Function to call after numeric editing is complete, prior to saving to DataTable ...
             //  i.e. checks validation against ad-hoc attribute "validationRegExp" (if it exists)
             //       and converts the value to numeric (or undefined if fails regexp);
             saveFn: function(v){
                 var vre = this.get('validationRegExp'),
                     value;
                 if(vre instanceof RegExp) {
                     value = (vre.test(v)) ? +v : undefined;
                 } else {
                     value = +v;
                 }
                 return value;
             }
         };

 **PLEASE NOTE:** All other attributes from the `BaseViewClass` apply and can be included within the
 `editorConfig` object.

@class DataTable.EditorOptions.inlineNumber
@since 3.8.0
@public
**/
Editors.inlineNumber = Y.Base.create('inlineNumber', IEd, [],
    {},
    {
        ATTRS: {

            hideMouseLeave: {
                value: false
            },

            // Define a key filtering regex ...
            keyFiltering:   {
                    value : /\.|\d|\-/
            },
            //keyValidator:   /^\s*(\+|-)?((\d+(\.\d*)?)|(\.\d*))\s*$/,

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
            saveFn: {
                value: function (v) {
                    Y.log('inlineNumber.saveFn: ' + v);
                    var vre = this.get('validator'),
                        value;
                    if(vre instanceof RegExp) {
                        value = (vre.test(v)) ? +v : undefined;
                    } else {
                        value = +v;
                    }
                    return value;
                }
            }

        }
    }
);

/**
### Inline Cell Editor "inlineDate"
This View configuration is used to setup an editor referenced as "inlineDate" as a simple inline-type
cell editor.  It is identical to the "inline" textual editor but incorporates Numeric validation prior to
saving to the DT.

##### Basic Usage:
        // Column definition
        { key:'weddingDate', editor:"inlineDate" }

        // Column definition with user-specified 'dateFormat' to display Date in text box on display
        { key:'date_of_claim', editor:"inlineDate", editorConfig:{ dateformat:'%Y-%m-%d'} }

##### Standard Configuration
This inline editor creates a simple INPUT[type=text] control and positions it to match the underlying TD node.  Since
a JS Date object isn't very pretty to display / edit in a textbox, we use a `prepFn` to preformat the Date in a
human-readable form within the textbox.  Also a `saveFn` is defined to convert the entered data using `Date.parse`
back to a valid JS Date prior to saving to the DT.

The configuration {Object} for this cell editor View is predefined as;

        Y.DataTable.EditorOptions.inlineDate = {
             BaseViewClass:  Y.DataTable.BaseCellInlineEditor,
             name:           'inlineDate',

             // Define default date format string to use
             dateFormat: "%D",

             // Setup input key filtering for only digits, "-" or "/" characters
             keyFiltering:   /\/|\d|\-/,

             //  Function to call just prior to populating the INPUT text box,
             //   so we pre-format the textbox in "human readable" format here
             prepFn: function(v){
                 var dfmt =  this.get('dateFormat') || "%m/%d/%Y";
                 return Y.DataType.Date.format(v,{format:dfmt});
             },

             // Function to call after Date editing is complete, prior to saving to DataTable ...
             //  i.e. converts back to "Date" format that DT expects ...
             saveFn: function(v){
                 return Y.DataType.Date.parse(v);
             }
        };

 **PLEASE NOTE:** All other attributes from the `BaseViewClass` apply and can be included within the
 `editorConfig` object.

@class DataTable.EditorOptions.inlineDate
@since 3.8.0
@public
**/
Editors.inlineDate = Y.Base.create('inlineDate', IEd, [],
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
                    value: /\/|\d|\-/
            },

            //  Function to call just prior to populating the INPUT text box,
            //   so we pre-format the textbox in "human readable" format here
            prepFn: {
                value: function (v){
                    Y.log('inlineDate.prepFn: ' + v);
                    var dfmt =  this.get('dateFormat') || "%m/%d/%Y";
                    return Y.DataType.Date.format(v,{format:dfmt});
                }
            },

            // Function to call after Date editing is complete, prior to saving to DataTable ...
            //  i.e. converts back to "Date" format that DT expects ...
            saveFn: {
                value: function(v){
                    Y.log('inlineDate.saveFn: ' + v);
                    return Y.DataType.Date.parse(v) || undefined;
                }
            }
        }
    }
);


/**
### Inline Cell Editor "inlineAC"
This View configuration is used to setup an inline editor referenced as "inlineAC" composed of a simple inline-type
cell editor which has the AutoComplete plugin attached to the input node.

##### Basic Usage:
       // Column definition
       { key:'degreeProgram', editor:"inlineAC",
         editorConfig:{

            // The following object is passed to "autocomplete" plugin when this
            //   editor is instantiated
            autocompleteConfig: {
               source:  [ "Bachelor of Science", "Master of Science", "PhD" ]
               on: {
                   select: function(r){
                       var val = r.result.display;
                       this.editor.saveEditor(val);
                   }
               }
            }
          }
       }

##### Standard Configuration
This inline editor creates a simple INPUT[type=text] control and positions it to match the underlying TD node.
When the editor is first instantiated, the Y.Plugin.AutoComplete is connected to the INPUT using the `autocompleteConfig`
object passed in by the user.

This editor View instance is attached to the autocomplete plugin as static property "editor".  An "on:select" listener
is defined in the configs to take action on saving the selected item from the autocomplete.

The configuration {Object} for this cell editor View is predefined as;

        Y.DataTable.EditorOptions.inlineAC = {
             BaseViewClass:  Y.DataTable.BaseCellInlineEditor,
             name:           'inlineAC',
             hideMouseLeave: false,

             // Define listener to this editor View's events
             after: {

                //---------
                //  After this View is instantiated and created,
                //     configure the Y.Plugin.AutoComplete as a plugin to the editor INPUT node
                //---------
                createUI : function(){
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

                }
             }
         };

**PLEASE NOTE:** All other attributes from the `BaseViewClass` apply and can be included within the
`editorConfig` object.

@class DataTable.EditorOptions.inlineAC
@since 3.8.0
@public
**/
Editors.inlineAC = Y.Base.create('inlineAC', IEd, [],
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
Y.DataTable.EditorOptions = Editors;