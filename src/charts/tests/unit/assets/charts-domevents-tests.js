YUI.add('charts-domevents-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: DomEvents"),
        UA = Y.UA,
        DOC = Y.config.doc,
        BODY = Y.one(DOC.body),
        win = Y.config.win,
        isTouch = ((win && ("ontouchstart" in win)) && !(UA.chrome && UA.chrome < 6)),
        domTest,
        dataProvider = [
            {category:"5/1/2010", miscellaneous:2000, expenses:3700, revenue:2200}, 
            {category:"5/2/2010", miscellaneous:50, expenses:9100, revenue:100}, 
            {category:"5/3/2010", miscellaneous:400, expenses:1100, revenue:1500}, 
            {category:"5/4/2010", miscellaneous:200, expenses:1900, revenue:2800}, 
            {category:"5/5/2010", miscellaneous:5000, expenses:5000, revenue:2650}
        ],
        suite  = new Y.Test.Suite("Charts: Dom Events");
            
    domTest = new Y.Test.Case({
        //---------------------------------------------------------------------
        // Setup and teardown of test harnesses
        //---------------------------------------------------------------------

        _should: {
            ignore: {
                'testDefault': (Y.UA.phantomjs)
            }
        },
        
        /**
         * Sets up dom elements needed for the test.
         */
        setUp : function() {
            this.eventType = isTouch ? "touchend" : "click";
            this.testBed = Y.one(Y.one("body").append('<div id="testbed"></div>'));
            this.testbutton = Y.Node.create('<button id="testbutton">Test Button</button>')
            this.testBed.append(this.testbutton);
            this.testBed.append(Y.Node.create('<div style="position:absolute;top:15px;left:0px;width:500px;height:400px" id="mychart"></div>'));
            
            //create the chart 
            this.chart = new Y.Chart({
                dataProvider: dataProvider,
                render: "#mychart"    
            });

            this.contentBox = this.chart.get("contentBox");
        
            //reset the result
            this.result = null;
            
            //assign event handler                
            if(UA.ie && UA.ie < 9) {
                this.handler = Y.on(this.eventType, Y.bind(this.handleEvent,this), Y.config.doc);
            } else {
                this.handler = Y.on(this.eventType, Y.bind(this.handleEvent,this));
            }
        },
        
        /**
         * Removes event handlers and dom elemements that were used during the test.
         */
        tearDown : function() {
            Y.detach(this.handler);
            this.chart.destroy(true);
            this.testbutton.destroy(true);
            Y.one("#testbed").destroy(true);
        },
       
        /**
         * Tests to ensures that clicks and/or touches outside the chart are not halted.
         */
        testDefault : function() {
            var xy = this.testbutton.getXY();
            if(isTouch) {
                Y.Event.simulate(this.testbutton.getDOMNode(), this.eventType, {
                    changedTouches: [{
                       pageX:xy[0] + 2,
                       pageY:xy[1] + 2
                    }]   
                });
            } else {
                Y.Event.simulate(this.testbutton.getDOMNode(), this.eventType);
            }
            Y.Assert.isNotNull(this.result, "The event did not fire.");
            Y.Assert.areEqual(this.testbutton, this.result.target);
           
            if(isTouch) {
                this.result = null;
                Y.Event.simulate(this.contentBox.getDOMNode(), this.eventType, {
                    changedTouches: [{
                       pageX:xy[0] + 2,
                       pageY:xy[1] + 2
                    }]   
                });
                Y.Assert.isNull(this.result, "The event should not fire.");
            }

        },

        //---------------------------------------------------------------------
        // Event handler
        //---------------------------------------------------------------------
        
        /*
         * Uses to trap and assign the event object for interrogation.
         * @param {Event} event The event object created from the event.
         */
        handleEvent : function(event) {
            this.result = event;
        }
    });

    

    suite.add(domTest);
    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['event-touch', 'event-simulate', 'charts', 'test']});
