<h2>Source Code</h2>

<p>The full source code for this example follows.  Read through the comments and code to get an understanding of how you can make use of Custom Events in your own application development.</p>

<textarea name="code" class="JScript" cols="60" rows="1">//Create a YUI instance:
YUI().use('node', function(Y) {

    //Shortcut for our logging div:
    var logger = Y.Node.get("#log");

    //Our BubbleTarget object is an object to which our Custom Event
    //will be allowed to bubble.  It needs itself to be an Event.Target,
    //so we'll use augment to make it an Event.Target:
    var BubbleTarget = function() {
        Y.log("Host constructor executed.", "info", "example");
    }
    //Augment BubbleTarget to make it an Event.Target:
    Y.augment(BubbleTarget, Y.Event.Target);

    //Create an instance of BubbleTarget:
    var bubbleTarget = new BubbleTarget();

    //Now we'll subscribe to the "publisher:testEvent" -- note
    //that we can do this even before this event is published:
    bubbleTarget.subscribe("publisher:testEvent", function(e) {
        Y.log("publisher:testEvent fired on the BubbleTarget object.", "info", "example");
    });

    //Now we'll create the constructor for the Publisher, which 
    //is the direct host of our Custom Event.  It will also be an
    //Event.Target, so we'll extend it as well:
    var Publisher = function(bubbleTarget) {

        //We'll specify now that Custom Events hosted by Publisher
        //should bubble to the bubbleTarget instance passed into the
        //the Publisher's constructor:
        this.addTarget(bubbleTarget);

        //Here we publish the Custom Event.  Note that it's not
        //necessary to publish the event at all if you don't have
        //options you wish to configure -- firing the event or 
        //subscribing to it will create it on the fly if necessary:
        this.publish("publisher:testEvent",
            {
                emitFacade: true,
                //the defaultFn is what you want to have happen
                //by default when no subscriber calls preventDefault:
                defaultFn: function() {
                    Y.log("defaultFn: publisher:testEvent's defaultFn executed.", "info", "example");
                },
                //You can prevent the default function from firing by
                //calling preventDefault from a listener (if the Custom
                //Event's preventable option is set to true, as it is by
                //default).  If the default is prevented, the preventedFn
                //is called, allowing you to respond if necessary.
                preventedFn: function() {
                    Y.log("preventedFn: A subscriber to publisher:testEvent called preventDefault().", "info", "example");			
                },
                //The stoppedFn is called if a subscriber calls stopPropagation or
                //stopImmediatePropagation:
                stoppedFn: function() {
                    Y.log("stoppedFn: A subscriber to publisher:testEvent called stopPropagation().", "info", "example");
                }
            }
        );
        Y.log("Publisher constructor executed.");
    }
    //Augment Publisher to make it an Event.Target:
    Y.augment(Publisher, Y.Event.Target);

    //Create a Publisher instance:
    var p = new Publisher(bubbleTarget);

    //We've already subscribed to the event on the bubbleTarget, but
    //we can also subscribe to it here on the Publisher instance.
    //We'll see the event fire here before it bubbles up to the 
    //bubbleTarget:
    p.subscribe("publisher:testEvent", function(e) {
        Y.log("publisher:testEvent subscriber fired on the publisher object.", "info", "example");
        if(Y.Node.get("#stopPropagation").get("checked")) {
            //we will stopPropagation on the Custom Event, preventing
            //it from bubbling to the bubbleTarget:
            e.stopPropagation();
        }
        
        if(Y.Node.get("#preventDefault").get("checked")) {
            //we will preventDefault on the Custom Event, preventing
            //the testEvent's defaultFn from firing:
            e.preventDefault();
        }
    });

    //We can tie our testEvent to an interface gesture -- the click of a
    //button, for example.
    Y.on("click", function(e) {
        //clear out the logger:
        logger.set("innerHTML", "");
        p.fire("publisher:testEvent");
    }, "#fire");

    //write out log messages to the page:
    Y.on("yui:log", function(msg) {
        //if(msg.indexOf("publisher:testEvent") > 0) {
            var s = logger.get("innerHTML");
            logger.set("innerHTML", s + "<li>" + msg + "</li>");
        //}
    });

});</textarea>
