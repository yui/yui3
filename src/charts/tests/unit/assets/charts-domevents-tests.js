YUI.add('charts-domevents-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: DomEvents"),
        UA = Y.UA,
        DOC = Y.config.doc,
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
        testbutton = Y.DOM.create('<button id="testbutton">Test Button</button>'),
        parentDiv = Y.DOM.create('<div style="position:absolute;top:500px;left:0px;width:500px;height:400px" id="testdiv"></div>');
    DOC.body.appendChild(parentDiv);
    DOC.body.appendChild(testbutton);
            
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
            
            //create the chart 
            this.chart = new Y.Chart({
                dataProvider: dataProvider,
                render: "#testdiv"    
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
            Y.Event.purgeElement(DOC, false);
        },
       
        /**
         * Tests to ensures that clicks and/or touches outside the chart are not halted.
         */
        testDefault : function() {
            var xy = Y.DOM.getXY(testbutton);
            if(isTouch) {
                Y.Event.simulate(testbutton, this.eventType, {
                    changedTouches: [{
                       pageX:xy[0] + 2,
                       pageY:xy[1] + 2
                    }]   
                });
            } else {
                Y.Event.simulate(testbutton, this.eventType);
            }
            Y.Assert.isNotNull(this.result, "The event did not fire.");
            Y.Assert.areEqual(testbutton, this.result.target.getDOMNode());
           
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
