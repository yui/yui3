/**
 Provides cell editors contained in an overlay that pops on top of the cell to be edited.
 @module datatable
 @submodule datatable-celleditor-popup
*/
/**
 Base implementation for all popup editors.
 Includes an editor with HTML inserted into an Overlay widget directly over the TD cell.
 Positioning, event management, creation/destruction and attribute changes are managed by this class.

 @class DataTable.BaseCellPopupEditor
 @extends DataTable.BaseCellEditor
 @author Todd Smith
 @since 3.8.0
 **/

var Editors = {},
    PEd =  Y.Base.create('celleditor', Y.DataTable.BaseCellEditor, [], {

    template: '<input type="text" title="inline cell editor" class="{classInput}" />',
    /**
    Defines the HTML content "template" for BUTTON elements that are added to the Overlay
    via the overlayButtons attribute.

    @property btnTemplate
    @type String
    @default See Code
    */
    btnTemplate:    '<button class="yui3-button {classButton}">{label}</button>',

    /**
    Placeholder property for the Overlay created by this class.

    @property overlay
    @type Widget
    @default null
    @private
    */
    _overlay:        null,

//--------------------  CSS class names  ---------------------------


    /**
    Creates this View's container, including instantiating the Overlay widget within
    the container, incorporating user-supplied overlay configs, creating buttons and
    creating the internal HTML content within the Overlay (using a Template-based
    method)

    @method _defRenderFn
    @return {Y.Overlay} Overlay instance for this View
    @private
    */
    _defRenderFn: function () {
       var overlay;

        //
        //  Create containing Overlay
        //
        overlay = this._createOverlay();

        //
        //  Add buttons in the Overlay footer section
        //  (we aren't using overlay, so have to add these manually ...)
        //
        if( this.get('buttons')) {
            this._createOverlayButtons(overlay);
        }

        overlay.set('bodyContent', Y.Lang.sub(this.template, {classInput: this._classInput}));

        overlay.render(this.get('container'));

        this._inputNode = overlay.get('contentBox').one('.' + this._classInput);

        this._overlay = overlay;

    },


    /**
    Detaches the listeners that were set on this view, any widgets that were created
    and on the View's Overlay instance.

    @method _unbindUI
    @private
    */
    _unbindUI: function () {

        PEd.superclass._unbindUI.apply(this, arguments);


        if(this._overlay) {
            this._overlay.destroy({remove:true});
            this._overlay = null;
        }

    },



//======================   PUBLIC METHODS   ===========================

    /**
    The default action for the `show` event which should make the editor visible.


    @method _defShowFn
    @param e {EventFacade}
    @protected
   */
    _defShowFn: function (e ) {
        var input = this._inputNode;
        this._overlay.show();

        // clear up browser "selected" stuff
        this._clearDOMSelection();

        PEd.superclass._defShowFn.apply(this, arguments);

        input.focus();
        input.set('value', e.formattedValue);
        input.select();
    },



//======================   PRIVATE METHODS   ===========================

    /**
    Method that creates the Editor's Overlay instance and populates the base content.

    @method _createOverlay
    @return {Y.Overlay}
    @private
    */
    _createOverlay: function () {
        var ocfg  = this.get('overlayConfig'),
            overlay;


        ocfg = Y.merge(ocfg, {
            bodyContent: ' ',
            zIndex:     99,
            visible:    false
        });

        overlay = new Y.Overlay(ocfg);

        if(Y.Plugin.Drag) {
            overlay.plug(Y.Plugin.Drag);
        }

        return overlay;
    },


    /**
    Method creates a footer section within the Overlay and adds the buttons entered
    as the `buttons` config property of `editorConfig`. The `buttons` property should be
    an array containing the configuration options for the buttons:
    <ul>
        <li>`label` The label shown to the user</li>
        <li>`className` A css class name to assign to the button</li>
        <li>`save` A non-null value indicates this is the save button,
          equivalent to pressing the `Enter` key. It will be highlighted accordingly</li>
        <li>`cancel` A non-null value indicates this is cancel button, equivalent to pressing the `Esc` key</li>
        <li>`action` An action to be associated with this button</li>
    </ul>
    The `action` property can be a string or a function.
    If a function, it will be called when the button is clicked.  The function will
    receive the button configuration entry as its first argument and an object containing
    information about the cell being edited.
    If `action` is a string, an event will be fired using that string.  The event
    can be listened to by subscribing to `celleditor:<i>&lt;action string&gt;</i>`
    and it will receive the button configuration and the cell info object.

    The cell information object contains:
    <ul>
        <li>td {Node} Reference to the table cell</li>
        <li>record {Model} Reference to the model containing the underlying data</li>
        <li>colKey {String} Key of the column for the cell to be edited</li>
        <li>initialValue {Any} The underlying value of the cell to be edited</li>
    </ul>
    @method _createOverlayButtons
    @param {Widget} overlay
    @private
    */
    _createOverlayButtons: function (overlay) {
        var buttons = Y.Array.map(this.get('buttons'), function (btn) {

                return Y.Lang.sub(this.btnTemplate,{
                    classButton: (btn.className || '')  + (btn.save ? ' yui3-button-primary' : ''),
                    label:       btn.label || 'unknown label'
                });

            }, this);
        if (buttons.length) {
            overlay.set('footerContent', buttons.join('\n'));
            this._subscr.push(this.get('container').delegate('click', this._afterButtonClick, 'button.yui3-button', this));
        }

    },

    _afterButtonClick: function (ev) {
        var btnCfg = null,
            action;

        if (ev.target.ancestor().get('children').some(function(button, index) {
            if (button === ev.target) {
                btnCfg = this.get('buttons')[index];
                return true;
            }
        }, this)) {
            if (btnCfg.save) {
                this.saveEditor();
            }
            if (btnCfg.cancel) {
                this.cancelEditor();
            }
            action = btnCfg.action;
            switch (Y.Lang.type(action)) {
                case 'string':
                    this.fire(action, btnCfg, this._cellInfo);
                    break;
                case 'function':
                    action(btnCfg, this._cellInfo);
                    break;
            }
        }
    },


    /**
    Moves and resizes the editor container to fit on top of the cell being edited.

    To be implemented by the subclasses.

    @method _attach
    @param td {Node} cell to attach this editor to
    @protected
    */
    _attach: function (td) {
         if (this.get('visible')) {
            var region = td.get('region');

            this._overlay.set('xy', [region.left, region.top]);
            this._inputNode.setAttrs({
                offsetWidth: region.width,
                offsetHeight: region.height
            });
         }
    },

    /**
    Returns the raw value as entered into the editor.

    @method _getValue
    @return value {mixed} Value as entered in the editor
    @protected
     */
    _getValue: function () {
        Y.log('DataTable.BaseCellInlineEditor._getValue');
        return this._inputNode.get('value');
    },

    /**
    Helper method to clear DOM "selected" text or ranges
    NOTE: could probably do this with CSS `user-select: none;`, but anyway ...

    @method _clearDOMSelection
    @private
    */
    _clearDOMSelection: function () {
        var sel = (Y.config.win.getSelection) ? Y.config.win.getSelection()
            : (Y.config.doc.selection) ? Y.config.doc.selection : null;

        if ( sel && sel.empty ) {
            sel.empty();
        }    // works on chrome

        if ( sel && sel.removeAllRanges ) {
            sel.removeAllRanges();
        }    // works on FireFox
    }

},{
    ATTRS:{

        /**
        Name for this View, this is useful because the `name` attribute is prefixed to the
        'Options' string for some Views (i.e. a cell editor named 'myRadio' will have a defined
        set of options available of 'myRadioOptions'

        @attribute name
        @type String
        @default null
        */
        name: {
            value:      null,
            validator:  Y.Lang.isString
        },

        /**
        Defines the Overlay's HTML template for the overall View (not recommended to change this!!)
        NOTE: This the Overlay structure template **and not** the bodyContent template for the Overlay,
        it is not recommended you change this attr.

        Please see the [templateObject](#attr_templateObject) attribute to define the HTML for your View!

        @attribute template
        @type String
        @private
        @default
        */
        template:{
            valueFn:  function () { return this.template; },
            validator:  Y.Lang.isString
        },

        /**
        Additional config parameters for the Overlay to be used in constructing the Editor.
        These configs are merged with the defaults required by the Editor.

        @attribute overlayConfig
        @type Object
        @default {}
        */
        overlayConfig:{
            value:      {},
            validator:  Y.Lang.isObject
        },

        buttons: {
            value: null
        },

        /**
        Specifies a width attribute style to set the `_classInput` Node element to upon rendering.

        @attribute inputWidth
        @type String|Number
        @default null
        */
        inputWidth: {
            value:  null
        },

        /**
        A flag to indicate if cell-to-cell navigation should be implemented (currently setup for CTRL-arrow
        key, TAB and Shift-TAB) capability.

        @attribute inputKeys
        @type Boolean
        @default true
        */
        inputKeys:{
            value:      true,
            validator:  Y.Lang.isBoolean
        },

        /**
        Defines the type of template engine that will be used to parse Templates, (via Y.Template).
        Typically this would be set to `Y.Template.Micro` or `Y.Handlebars`

        NOTE: If you use Y.Handlebars (or any other YUI template engine) you MUST include it in your YUI.use
        loader statement ("template" is included in this module's `requires` by default)

        @attribute templateEngine
        @type Object
        @default Y.Template.Micro
        */
        templateEngine: {
            value:  null //Y.Template.Micro
        },

        /**
        This attribute is used to define the HTML content that will be created / generated and inserted within
        this View's Y.Overlay.   The attribute definitions include an object with the following recognizable
        properties: `html, xxxOptions, propValue, propText, propTitle`

        Note that xxxOptions matches the `name` attribute (i.e. the editor "name" you include on your column
        definitions), where xxx is replaced with the name.  For "radio" it is `radioOptions`, for "select" it is
        `selectOptions`, "checkbox" it is `checkboxOptions`, etc...

        The method [_createTemplateContent](#method__createTemplateContent) uses this attribute and processes the
        template using the `html` and other properties to generate the HTML.  It then inserts the compiled HTML into
        the Overlay's `bodyContent`.

        @example

             templateObject: {
                 // set the template definition
                 html: '<select class="myselect">'
                    +  '<% Y.Array.each( data.options, function(r){ %>'
                    +  '<option value="<%= r.value %>" <% (r.title) ? \'title="r.title"\' :  %>>'
                    +  '<%= r.text %></option>'
                    +  '<% },this); %>'
                    +  '</select>'
                 options: states   // [ {value:'AZ', text:'Arizona}, {value:'DE', text:'Delaware' } ]
             }

        @attribute templateObject
        @type Object
        @default null
        */
        templateObject: {
            value:  null
        },

        /**
        A cell reference object populated by the calling DataTable, contains the following key properties:
          `{td,value,recClientId,colKey}`

        @attribute cell
        @type Object
        @default {}
        */
        cell: {
            value:  {}
        },


        /**
        Value that was saved in the Editor View and returned to the record

        @attribute value
        @type {String|Number|Date}
        @default null
        */
        value: {
            value:  null
        },

        /**
        Value that was contained in the cell when the Editor View was initiated

        @attribute lastValue
        @type {String|Number|Date}
        @default null
        */
        lastValue:{
            value:  null
        },



        /**
        Sets an offset of the XY coordinates that will be used for positioning the Overlay upon
        displaying the editor View

        @attribute offsetXY
        @type Array
        @default [0,0]
        */
        offsetXY :{
            value: [0,0],
            validator:  Y.Lang.isArray
        },

        /**
        XY coordinate position of the View container Overlay for this editor

        @attribute xy
        @type Array
        @default null
        */
        xy : {
            value:      null,
            validator:  Y.Lang.isArray
        },

        /**
        A flag to signify whether the editor View should be "saved" upon detecting the RTN keystroke
        within the INPUT area.

        For example, textarea typically will not, to allow a newline to be added.

        @attribute saveOnEnterKey
        @type boolean
        @default true
        */
        saveOnEnterKey: {
            value:      true,
            validator:  Y.Lang.isBoolean
        },

        /**
        Provides a keystroke filtering capability to restrict input into the editing area checked during the
        "keypress" event.  This attribute is set to either a RegEx or a function that confirms if the keystroke
        was valid for this editor.  (TRUE meaning valid, FALSE meaning invalid)

        If a function is provided, the single argument is the keystroke event facade `e` and if
        the keystroke is valid it should return true, otherwise if invalid false;

         @example
             /^\d*$/            // for numeric digit-only input
             /^(\d|\-|\.)*$/      // for floating point numeric input
             /^(\d|\/)*$/         // for Date field entry in MM/DD/YYYY format

        @attribute keyFiltering
        @type {RegExp|Function}
        @default null
        */
        keyFiltering:  {
            value:  null
        },

        /**
        Provides the capability to validate the final saved value after editing is finished.
        This attribute can be set to either a RegEx or a function, that operates on the entire
        "value" setting of the editor input (whereas [keyFiltering](#attr_keyFilter) performs
        validation checks on each key input).

        If a function is provided, the single argument is the value setting of the editor.
        the keystroke is valid it should return true, otherwise if invalid false;

         @example
             /^\d$/            // for numeric digit-only input
             /^\d|\-|\.|\+$/   // for floating point numeric input
             /^\d|\/$/         // for Date field entry in MM/DD/YYYY format

        @attribute validator
        @type {RegExp|Function}
        @default null
        */
        validator: {
            value:      null
        }

    }
});


//====================================================================================================================
//                   P O P U P    C E L L    E D I T O R    D E F I N I T I O N S
//====================================================================================================================


/**
Produces a basic textbox type popup cell editor.

##### Basic Usage

    // Column definition
    { key:'firstName', editor:"text"}

    // Column definition ... disabling inputKeys navigation and setting offsetXY
    { key:'firstName',
      editor:"text", editorConfig:{ inputKeys:false, offsetXY: [5,7] }
    }

@property text
@for DataTable.Editors
@type DataTable.BaseCellEditor
@since 3.8.0
@public
*/
Editors.text = Y.Base.create('celleditor', PEd, [],
    {},
    {
        ATTRS: {
            templateObject: {
                value: {
                   html: '<input type="text" title="inline cell editor" class="<%= this.classInput %>"  />'
                }
            },

            inputKeys: {
                value: true
            }

        }
    }
);

/**
Produces a "textarea"  popup  cell editor.

 ##### Basic Usage:

    // Column definition
    { key:'experience', editor:"textarea"}

    // Column definition ... disabling inputKeys navigation and setting offsetXY
    {
        key:'firstName',
        editor:"JobDescription",
        editorConfig:{
             // disables the buttons below the TEXTAREA
             overlayConfig:{ buttons: null }
        }
    }


@property textarea
@for DataTable.Editors
@type DataTable.BaseCellEditor
@since 3.8.0
@public
*/
Editors.textarea = Y.Base.create('celleditor', PEd, [],
    {},
    {
        ATTRS: {
            templateObject:{
                value: {
                    html: '<textarea title="inline cell editor" class="<%= this.classInput %>"></textarea>'
                }
            },

            inputKeys: {
                value: true
            },
            saveOnEnterKey: {
                value:false
            },

            // setup two buttons "Save" and "Cancel" for the containing overlay
            overlayConfig:{
                value:{
                    buttons:   [
                        { name:'save', value: 'Save',
                            action:function () {
                                var val = (this._inputNode) ? this._inputNode.get('value') : null;
                                this.saveEditor(val);
                                //this.fire('editorSave',val);

                            }
                        },
                        { name:'cancel', value: 'Cancel',
                            action:function () {
                                this.cancelEditor();
                            }
                        }
                    ]
                }
            }
        }
    }
);


/**
Produces  a basic numeric editor as a popup-type cell editor.
 A `parser` is prescribed that handles validation and converting the input text to numeric format.

 ##### Basic Usage
    // Column definition
    { key:'salary', editor:"number" }

    // Column definition ... disabling keyfiltering and setting a CSS class
    {
        key:'firstName',
        editor:"text",
        editorConfig:{ className:'align-right', keyFiltering:null }
    }


@property number
@for DataTable.Editors
@type DataTable.BaseCellEditor
@since 3.8.0
@public
*/
Editors.number = Y.Base.create('celleditor', PEd, [],
    {},
    {
        ATTRS: {
            templateObject:{
                value: {
                    html: '<input type="text" title="inline cell editor" class="<%= this.classInput %>"  />'
                }
            },

            inputKeys: {
                value: true
            },

            /**
            A validation regular expression object used to check validity of the input floating point number.
            This can be defined by the user to accept other numeric input, or set to "null" to disable regex checks.

            @attribute validator
            @type RegExp
            @default /^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/
            */
            validator: {
                value:  /^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/
            },

            keyFiltering: {
                value:   /^(\.|\d|\-)*$/
            },

            // Function to call after numeric editing is complete, prior to saving to DataTable ...
            //  i.e. checks validation against ad-hoc attribute "validationRegExp" (if it exists)
            //       and converts the value to numeric (or undefined if fails regexp);
            parser: {
                value: function(v){
                    var vre = this.get('validator'),
                        value;
                    if(vre instanceof RegExp) {
                        value = (vre.test(v)) ? +v : Y.Attribute.INVALID_VALUE;
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
 Produces a bare-bones date editor as a popup-type cell editor.
 Configuration is setup with both `formatter` and `parser` to convert the Date object.

 ##### Basic Usage

    // Column definition
    { key:'firstName', editor:"date"}

    // Column definition ... with user-defined dateFormat and disabling keyfiltering
    {
        key:'firstName',
        editor:"text",
        editorConfig:{ dateFormat: '%Y-%m-%d', keyFiltering:null }
    }


@property date
@for DataTable.Editors
@type DataTable.BaseCellEditor
@since 3.8.0
@public
*/
Editors.date = Y.Base.create('celleditor', PEd, [],
    {},
    {
        ATTRS: {
            templateObject:{
                value: {
                    html:  '<input type="text" title="inline cell editor" class="<%= this.classInput %>"  />'
                }
            },

            inputKeys: {
                value: true
            },

            inputWidth: {
                value: 75
            },

            // only allow keyboard input of digits or '/' or '-' within the editor ...
            keyFiltering: {
                value:   /^(\/|\d|\-)*$/
            },

            // Function to call prior to displaying editor, to put a human-readable Date into
            //  the INPUT box initially ...
            formatter: {
                value: function(v){
                    var dfmt = this.get('dateFormat') || "%D";
                    return Y.DataType.Date.format(v,{format:dfmt});
                }
            },

            // Function to call after Date editing is complete, prior to saving to DataTable ...
            //  i.e. converts back to "Date" format that DT expects ...
            parser: {
                value: function(v){
                    return Y.DataType.Date.parse(v) || Y.Attribute.INVALID_VALUE;
                }
            }
        }
    }
);


/**
 Produces a "calendar" popup cell editor that
 includes a Y.Calendar widget incorporated within the View container.

 ##### Basic Usage

    // Column definition
    { key:'startDate', editor:"calendar" }

    // Column definition ...
    {
        key:'birthdate',
        label:'Employee DOB',
        formatter:"shortDate",
        editor:"calendar",
        editorConfig:{
            inputKeys:false,
        }
    }


@property calendar
@for DataTable.Editors
@type DataTable.BaseCellEditor
@since 3.8.0
@public
*/
Editors.calendar = Y.Base.create('celleditor', PEd, [],
    {
destructor: function () {
            if(this.widget) {
            this.widget.destroy({remove:true});
        }

}
/*
    //
    // cell editor View instance event listeners ...
    //
    after: {

        //-------
        // After this View is created,
        //    create the Calendar widget ...
        //-------
        createUI: function () {
            var calNode = this._overlay.get('contentBox').one('.yui3-dt-editor-calendar'),
                calWidget,

                // Define a basic config object for Y.Calendar ...
                calConfig = {
                    // don't define a srcNode in here, because we are creating the node ...
                    height: '215px',
                    width:  '200px',
                    showPrevMonth: true,
                    showNextMonth: true,

                    // Setup this Calendar widget instance's event listeners ...
                    after: {

                        //-------
                        // After a "selection" is made in the widget,
                        //   updates the Editor's INPUT box on a widget date selection ...
                        //-------
                        selectionChange : function(o){
                            var newDate = o.newSelection[0],
                                editor  = this.editor, //this.get('editor'),
                                formatter  = editor.get('formatter'),
                                inpn    = editor._inputNode;
                            inpn.set('value', (formatter) ? formatter.call(this,newDate) : newDate );
                        },

                        //-------
                        // After a date is clicked in the widget,
                        //   save the Date
                        //-------
                        dateClick: function(o){
                            var newDate = o.date,
                                editor  = this.editor;
                            editor.saveEditor(newDate);
                        }
                    }
                },

                // Pass in user options via calendarConfig
                userCalConfig = this.get('calendarConfig') || {};

            //
            //  If the srcNode exists, and Y.Calendar library is available ... create the Widget
            //
            if(calNode && Y.Calendar) {
                // combine the base configs with user configs
                calConfig = Y.merge(calConfig,userCalConfig);

                calConfig.srcNode = calNode;
                calWidget = new Y.Calendar(calConfig).render();

                // Attach a plugin to the Widget instance, if it is available
                if(Y.Plugin.Calendar && Y.Plugin.Calendar.JumpNav) {
                    this.plug( Y.Plugin.Calendar.JumpNav, {
                        yearStart: 1988, yearEnd:   2021
                    });
                }

            }

            //
            //  Set a property on the Calendar widget instance to trackback to this editor view,
            //  AND also attach the Widget instance to this view
            //
            calWidget.editor = this;
            this.widget = calWidget;

        },

        //-------
        // After this View is destroyed,
        //    we need to destroy the Calendar widget instance ...
        //-------
        'celleditor:destroy': function () {
            if(this.widget) {
                this.widget.destroy({remove:true});
            }
        },

        //-------
        // After this View is displayed,
        //    setup the widget to display the current cell's Date value
        //-------
        editorShow: function(o){
            var val = o.value;

            // Display the widget, and select the date (if valid)
            if(this.widget) {
                this.widget.show();

                if(Y.Lang.isDate(val)) {
                    this.widget.set('date',val);
                    this.widget.selectDates(val);
                }
            }

            // Update the INPUT[text] value with date and set it's focus
            this._setInputValue(val);
            o.inputNode.focus();
        },

        //-------
        // After this View is hidden,
        //    hide the Calendar widget to avoid bleed-thru
        //-------
        editorHide: function () {
            if(this.widget) {
                this.widget.hide();
            }
        },

        //-------
        // After this View is hidden,
        //    hide the Calendar widget to avoid bleed-thru
        //-------
        editorSave: function () {
            if(this.widget) {
                this.widget.hide();
            }
        }
    }
};

*/

    },
    {
        ATTRS: {
            templateObject: {
                value: {
                    html:  'Enter Date: &nbsp; <input type="text" title="inline cell editor" class="<%= this.classInput %>"  />'
                        + '<br/><div class="yui3-dt-editor-calendar"></div>'
                }
            },
            inputKeys: {
                value:      true
            },


            // setup two buttons "Save" and "Cancel" for the containing overlay
            overlayConfig: {
                value:{
                    buttons:   [
                        { name:'save', value: 'Save',
                            action:function () {
                                var val = (this._inputNode) ? this._inputNode.get('value') : null;
                                this.saveEditor(val);
                            }
                        },
                        { name:'cancel', value: 'Cancel',
                            action:function () { this.cancelEditor(); }
                        }
                    ]
                }
            },

            inputWidth: {
                value: 75
            },

            // only allow keyboard input of digits or '/' or '-' within the editor ...
            keyFiltering: {
                value:   /^(\/|\d|\-)*$/
            },

            // Function to call prior to displaying editor, to put a human-readable Date into
            //  the INPUT box initially ...
            formatter: {
                value: function(v){
                    var dfmt = this.get('dateFormat') || "%D" || "%m/%d/%Y";
                    return Y.DataType.Date.format(v,{format:dfmt});
                }
            },

            // Function to call after Date editing is complete, prior to saving to DataTable ...
            //  i.e. converts back to "Date" format that DT expects ...
            parser: {
                value: function(v){
                    return Y.DataType.Date.parse(v) || Y.Attribute.INVALID_VALUE;
                }
            }
        }
    }
);
/**
Produces a textbox-type popup cell editor that has an Autocomplete
plugin attached to the INPUT[text] node.

 ##### Basic Usage

    // Column definition
    {
        key:'state',
        editor:"autocomplete",
        editorConfig:{
            autocompleteConfig:{
                source:  myStateArray,
                alwaysShowList: true
            }
        }
    }


@property autocomplete
@for DataTable.Editors
@type DataTable.BaseCellEditor
@since 3.8.0
@public
*/
Editors.autocomplete = Y.Base.create('celleditor', PEd, [],
    {
        after: {

           //---------
           //  After the cell editor View is instantiated,
           //    get the INPUT node and plugin the AutoComplete to it
           //---------
           createUI : function () {
               var inputNode = this._inputNode,
                   acConfig = this.get('autocompleteConfig') || {},
                   editor = this;

               // If input node exists and autocomplete-plugin is available, plug the sucker in!
               if(inputNode && Y.Plugin.AutoComplete) {
                   acConfig = Y.merge(acConfig,{
                       alwaysShowList: true,
                       render: true
                   });
                   inputNode.plug(Y.Plugin.AutoComplete, acConfig);

                   // add this View class as a static prop on the ac plugin
                   inputNode.ac.editor = editor;
               }

           }
        }
    },
    {
        ATTRS: {
            templateObject: {
                value: {
                    html: '<input type="text" title="inline cell editor" class="<%= this.classInput %>" />'
                }
            },
            inputKeys: {
                value:      true
            }
        }
    }

    // Set listeners to this View's instance ....
);

/**
Produces a group of INPUT[type=radio] controls within the view's Overlay

 ##### Basic Usage

    // Column definition via Array options
    {
        key:"size",
        editor:"radio",
        editorConfig:{
            radioOptions:[ {value:0, text:"S"}, {value:1, text:"M"}, {value:2, text:"L"} ]
        }
    }
    // Column definition via Object type options
    {
        key:"size",
        editor:"radio",
        editorConfig:{
            radioOptions:{ S:"Small", M:"Medium", L:"Large" }
        }
    }


@property radio
@for DataTable.Editors
@type DataTable.BaseCellEditor
 @since 3.8.0
 @public
 **/
Editors.radio = Y.Base.create('celleditor', PEd, [],
    {
    // cell editor View instance listeners ...
        after: {

            //--------
            //  After the editor instance is created (at initialization),
            //    setup a listener to save changes based on INPUT[radio] 'click' events
            //--------
            createUI: function () {
                var cbox = this._overlay.get('contentBox');

                this._subscr.push(
                    cbox.delegate('click',function(e){
                        var tar = e.target,
                            val = tar.get('value');

                        if(Lang.isValue(val)) {
                            this.saveEditor(val);
                        }
                    },'input[type="radio"]', this)
                );

            },

            //--------
            //  After the editor is displayed,
            //    update the "checked" INPUT[radio] within the group
            //--------
            editorShow : function(o){
                var chks  = this._overlay.get('contentBox').one('.myradios').all('input[type="radio"]'),
                    val   = o.value || this.get('value'),
                    valStr = Y.Lang.isString(val),
                    chk, rval;

                chks.each(function(n){
                    rval = (n && n.get) ? n.get('value') : null;
                    rval = (!valStr && /^\d*$/.test(rval) ) ? +rval : rval;
                    if(rval===val) {
                        chk = n;
                        return true;
                    }
                    n.set('checked',false);
                });

                if(chk) {
                    chk.set('checked',true);
                }
            }
        }

    },
    {
        ATTRS: {
            templateObject: {
/*
        // Template Handlebars version ...
       html: '<div class="myradios">'
            + '{{#options}}'
            + '<input type="radio" name="dt-editor-radio" value="{{value}}"'
            + '{{#if title}} title="{{title}}"{{/if}} /> {{text}}'
            + '{{/options}}'
            + '</div>'
*/
                value: {
                    html: '<div class="myradios ">' ////<%= this.classInput %>">'
                    + '<% Y.Array.each( this.options, function(r) { %>  '
                    + '<input type="radio" name="dt-editor-radio" '
                    +     'value="<%= r.value %>" <% (r.title) ? \'title="r.title"\' :  %> /> <%= r.text %>'
                    + '<% },this); %>'
                    + '</div>'
                }
            }
        }
    }
);


/**
 Produces a popup cell editor containing a single SELECT control within
 the Overlay.

 ##### Basic Usage
// Column definition ... simple Array data
{
    key:"inTheForest",
    editor:"dropdown",
    editorConfig: { dropdownOptions:[ "lions", "tigers", "bears", "oh my!" ] }
}

// Column definition ... options via Object type data
{
    key:"color",
    formatter:"custom",
    formatConfig:stypesObj,
    editor:"select",
    editorConfig:{
        selectOptions:{ 0:'Red', 1:'Green', 2:'Fuschia', 3:'Blue' }
    }
}

// Column definition ... options via Array of Objects, non-trivial!
{
    key:"firstTopping",
    editor:"dropdown",
    editorConfig:{
        dropdownOptions:[
           {controlUnit:'a7',  descr:'Pepperoni'},    {controlUnit:'f3', descr:'Anchovies'},
           {controlUnit:'b114',descr:'Extra Cheese'}, {controlUnit:'7', descr:'Mushrooms'}
        ],
        templateObject:{ propValue:'controlUnit', propText:'descr' }
    }
}


@property dropdown
@for DataTable.Editors
@type DataTable.BaseCellEditor
 @since 3.8.0
 @public
 **/
Editors.dropdown = Y.Base.create('celleditor', PEd, [],
    {
    after: {

        //--------
        //  After the editor view instance is created,
        //    set a "change" listener on the SELECT element
        //--------
        createUI: function () {
            var cbox = this._overlay.get('contentBox');

            this._subscr.push(
                cbox.delegate('change',function(e){
                    var val = e.currentTarget.get('value');

                    if(Lang.isValue(val)) {
                        this.saveEditor(val);
                    }

                },'select', this)
            );
        },

        //--------
        //  After the editor is displayed,
        //    update the currently selected OPTION based on the o.value
        //--------
        editorShow : function(o){
            var sel   = this._overlay.get('contentBox').one('.myselect'),
                sopts = sel.get('options'),
                val   = o.value || this.get('value'),
                sopt;

            sopts.some(function(n){
                /*jshint eqeqeq:false */
                if(n && n.get('value') == val) {  // not a === check, to account for mixed vars
                    sopt = n;
                    return true;
                }
                /*jshint eqeqeq:true */
            });

            if(sopt) {
                sopt.set('selected',true);
            }

        }
    }
    },
    {
        ATTRS: {
            templateObject: {
/*
        // Template Handlebars version ...
        // NOTE: This editor currently uses Handlebars only, intend to use Template.Micro
        //       but need to get this template micro http://yuilibrary.com/projects/yui3/ticket/2533040 fixed
        html: '<select class="myselect">'
            + '{{#options}}'
            + '<option value="{{value}}"{{#if title}} title="{{title}}"{{/if}}>{{text}}</option>'
            + '{{/options}}'
            + '</select>'
*/
                value: {
                    html: '<select class="myselect">'
                        + '<% Y.Array.each( data.options, function(r){ %>'
                        + '<option value="<%= r.value %>" <% (r.title) ? \'title="r.title"\' :  %>><%= r.text %></option>'
                        + '<% },this); %>'
                        + '</select>'
                }
            },
            inputKeys: {
                value:      true
            }
        }
    }
);


Y.DataTable.Editors.select = Y.DataTable.Editors.dropdown;
Y.DataTable.Editors.combobox = Y.DataTable.Editors.dropdown;


/**
Produces a simple checkbox (i.e. on/off, yes/no, true/false) popup cell editor
 within the popup Overlay.

 ##### Basic Usage
    // Column definition
    {
        key:'arrived',
        editor:"checkbox",
        editorConfig:{ checkboxHash:{ 'true':'Y', 'false':'N' } }
    }


@property checkbox
@for DataTable.Editors
@type DataTable.BaseCellEditor
 @since 3.8.0
 @public
 **/
Editors.checkbox = Y.Base.create('celleditor', PEd, [],
    {
        after : {

            //---------
            // After this cell editor instance is created,
            //   setup a click listener on the INPUT[checkbox]
            //---------
            createUI: function () {
                var cbox = this._overlay.get('contentBox');

                this._subscr.push(
                    cbox.delegate('click',function(e){
                        var chk    = e.currentTarget,
                            cvalue = chk.get('checked') || false,
                            chkopt = this.get('checkboxHash') || { 'true':true, 'false':false },
                            val    = chkopt[cvalue];

                        if(Lang.isValue(val)) {
                            this.saveEditor(val);
                        }


                    },'input[type="checkbox"]', this)
                );
            },

            //---------
            // After this editor is displayed,
            //   update the "checked" status based on the underlying o.value
            //---------
            editorShow : function(o){
                var chk    = this._overlay.get('contentBox').one('input[type="checkbox"]'),
                    val    = o.value || this.get('value'),
                    chkopt = this.get('checkboxHash') || this.get('checkboxOptions') || { 'true':true, 'false':false },
                    chkst  = false;

                if(chk && val !== undefined ) {
                    chkst = (val === chkopt['true'] ) ? true : false;
                    chkst = (val === chkopt['false'] ) ? false : chkst;
                    chk.set('checked',chkst);
                }
            }
        }
    },
    {
        ATTRS: {
            templateObject: {
                value: {
                    html: '<input type="checkbox" title="inline cell editor" />'
                }
            }
        }

    // Define listeners to this View instance ...
    }
);
Y.DataTable.BaseCellPopupEditor = PEd;
Y.mix(Y.DataTable.Editors, Editors);