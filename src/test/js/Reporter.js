
    /**
     * An object capable of sending test results to a server.
     * @param {String} url The URL to submit the results to.
     * @param {Function} format (Optiona) A function that outputs the results in a specific format.
     *      Default is YUITest.TestFormat.XML.
     * @constructor
     * @namespace Test
     * @module test
 * @class Reporter
     */
    YUITest.Reporter = function(url, format) {

        /**
         * The URL to submit the data to.
         * @type String
         * @property url
         */
        this.url = url;

        /**
         * The formatting function to call when submitting the data.
         * @type Function
         * @property format
         */
        this.format = format || YUITest.TestFormat.XML;

        /**
         * Extra fields to submit with the request.
         * @type Object
         * @property _fields
         * @private
         */
        this._fields = new Object();

        /**
         * The form element used to submit the results.
         * @type HTMLFormElement
         * @property _form
         * @private
         */
        this._form = null;

        /**
         * Iframe used as a target for form submission.
         * @type HTMLIFrameElement
         * @property _iframe
         * @private
         */
        this._iframe = null;
    };

    YUITest.Reporter.prototype = {

        //restore missing constructor
        constructor: YUITest.Reporter,

        /**
         * Adds a field to the form that submits the results.
         * @param {String} name The name of the field.
         * @param {Any} value The value of the field.
         * @method addField
         */
        addField : function (name, value){
            this._fields[name] = value;
        },

        /**
         * Removes all previous defined fields.
         * @method clearFields
         */
        clearFields : function(){
            this._fields = new Object();
        },

        /**
         * Cleans up the memory associated with the TestReporter, removing DOM elements
         * that were created.
         * @method destroy
         */
        destroy : function() {
            if (this._form){
                this._form.parentNode.removeChild(this._form);
                this._form = null;
            }
            if (this._iframe){
                this._iframe.parentNode.removeChild(this._iframe);
                this._iframe = null;
            }
            this._fields = null;
        },

        /**
         * Sends the report to the server.
         * @param {Object} results The results object created by TestRunner.
         * @method report
         */
        report : function(results){

            //if the form hasn't been created yet, create it
            if (!this._form){
                this._form = document.createElement("form");
                this._form.method = "post";
                this._form.style.visibility = "hidden";
                this._form.style.position = "absolute";
                this._form.style.top = 0;
                document.body.appendChild(this._form);

                //IE won't let you assign a name using the DOM, must do it the hacky way
                try {
                    this._iframe = document.createElement("<iframe name=\"yuiTestTarget\" />");
                } catch (ex){
                    this._iframe = document.createElement("iframe");
                    this._iframe.name = "yuiTestTarget";
                }

                this._iframe.src = "javascript:false";
                this._iframe.style.visibility = "hidden";
                this._iframe.style.position = "absolute";
                this._iframe.style.top = 0;
                document.body.appendChild(this._iframe);

                this._form.target = "yuiTestTarget";
            }

            //set the form's action
            this._form.action = this.url;

            //remove any existing fields
            while(this._form.hasChildNodes()){
                this._form.removeChild(this._form.lastChild);
            }

            //create default fields
            this._fields.results = this.format(results);
            this._fields.useragent = navigator.userAgent;
            this._fields.timestamp = (new Date()).toLocaleString();

            //add fields to the form
            for (var prop in this._fields){
                var value = this._fields[prop];
                if (this._fields.hasOwnProperty(prop) && (typeof value != "function")){
                    var input = document.createElement("input");
                    input.type = "hidden";
                    input.name = prop;
                    input.value = value;
                    this._form.appendChild(input);
                }
            }

            //remove default fields
            delete this._fields.results;
            delete this._fields.useragent;
            delete this._fields.timestamp;

            if (arguments[1] !== false){
                this._form.submit();
            }

        }

    };
