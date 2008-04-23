YUI.add("loader-sandbox", function(Y) {

    /*
     * Interns the script for the requested modules.  The callback is
     * provided a reference to the sandboxed YAHOO object.  This only
     * applies to the script: css can not be sandboxed; css will be
     * loaded into the page normally if specified.
     * @method sandbox
     * @param callback {Function} the callback to exectued when the load is
     *        complete.
     */
    Y.Loader.prototype.sandbox = function(o, type) {
        if (o) {
            // YAHOO.log("sandbox: " + lang.dump(o, 1) + ", " + type);
        } else {
            // YAHOO.log("sandbox: " + this.toString() + ", " + type);
        }

        this._config(o);

        if (!this.onSuccess) {
throw new Error("You must supply an onSuccess handler for your sandbox");
        }

        this._sandbox = true;

        var self = this;

        // take care of any css first (this can't be sandboxed)
        if (!type || type !== "js") {
            this._internalCallback = function() {
                        self._internalCallback = null;
                        self.sandbox(null, "js");
                    };
            this.insert(null, "css");
            return;
        }

        // get the connection manager if not on the page
        if (!util.Connect) {
            // get a new loader instance to load connection.
            var ld = new YAHOO.util.YUILoader();
            ld.insert({
                base: this.base,
                filter: this.filter,
                require: "connection",
                insertBefore: this.insertBefore,
                charset: this.charset,
                onSuccess: function() {
                    this.sandbox(null, "js");
                },
                scope: this
            }, "js");
            return;
        }

        this._scriptText = [];
        this._loadCount = 0;
        this._stopCount = this.sorted.length;
        this._xhr = [];

        this.calculate();

        var s=this.sorted, l=s.length, i, m, url;

        for (i=0; i<l; i=i+1) {
            m = this.moduleInfo[s[i]];

            // undefined modules cause a failure
            if (!m) {
                this.onFailure.call(this.scope, {
                        msg: "undefined module " + m,
                        data: this.data
                    });
                for (var j=0;j<this._xhr.length;j=j+1) {
                    this._xhr[j].abort();
                }
                return;
            }

            // css files should be done
            if (m.type !== "js") {
                this._loadCount++;
                continue;
            }

            url = m.fullpath || this._url(m.path);

            // YAHOO.log("xhr request: " + url + ", " + i);

            var xhrData = {

                success: function(o) {
                    
                    var idx=o.argument[0], name=o.argument[2];

                    // store the response in the position it was requested
                    this._scriptText[idx] = o.responseText; 
                    
                    // YAHOO.log("received: " + o.responseText.substr(0, 100) + ", " + idx);
                
                    if (this.onProgress) {
                        this.onProgress.call(this.scope, {
                                    name: name,
                                    scriptText: o.responseText,
                                    xhrResponse: o,
                                    data: this.data
                                });
                    }

                    // only generate the sandbox once everything is loaded
                    this._loadCount++;

                    if (this._loadCount >= this._stopCount) {

                        // the variable to find
                        var v = this.varName || "YAHOO";

                        // wrap the contents of the requested modules in an anonymous function
                        var t = "(function() {\n";
                    
                        // return the locally scoped reference.
                        var b = "\nreturn " + v + ";\n})();";

                        var ref = eval(t + this._scriptText.join("\n") + b);

                        this._pushEvents(ref);

                        if (ref) {
                            this.onSuccess.call(this.scope, {
                                    reference: ref,
                                    data: this.data
                                });
                        } else {
                            this.onFailure.call(this.scope, {
                                    msg: this.varName + " reference failure",
                                    data: this.data
                                });
                        }
                    }
                },

                failure: function(o) {
                    this.onFailure.call(this.scope, {
                            msg: "XHR failure",
                            xhrResponse: o,
                            data: this.data
                        });
                },

                scope: this,

                // module index, module name, sandbox name
                argument: [i, url, s[i]]

            };

            this._xhr.push(util.Connect.asyncRequest('GET', url, xhrData));
        }
    };

}, "3.0.0");
