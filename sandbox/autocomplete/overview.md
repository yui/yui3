# Autocomplete Overview

The component is build in three parts:

1. Controller
2. Data Source
3. Renderer

## Controller

The controller's job is to manage the interaction with the HTML `input` element, listening for key events and managing the data flow between the Data Source and Renderer.

### Key Events

For most western character sets, `keydown` is sufficient.  However, CJK character sets have different indications that a character has been entered.

There is going to be a configurable timeout after each key event is fired, before sending the query to the Data Source, so as to prevent flooding the Data Source with queries.  Key events will cancel any existing scheduled query.  Even setting a timeout of 0 will thus have a noticeable impact on sending unnecessary queries, but in some cases, it may be advantageous to wait a bit longer.

We may want the Controller to expose a mechanism to customize this behavior, so that we can perhaps be "smart" about setting the timeout in response to a user's typing speed.  (NB: the difference between "smart" and "200ms" is probably not significant the majority of the time.)

The Data Source may change the timeout based on whether or not data has been loaded locally.  For instance, in order to avoid flooding the server with XHR calls, it may make sense to have a timeout of 300ms.  Once some data has been loaded locally, and it switches to local filtering, then it may make sense to drop the timeout value to 0.  Experimentation is required.

### ↓, ⇥, etc.

When the user presses the down-arrow or tab keys, then the Controller should pass a message to the Renderer that this event has occurred.  At this point, the Renderer can either handle the event and prevent the default behavior, or let the browser's native behavior to continue.

### Focus

When the input element loses focus, the Controller stops being in charge.  This is because it only listens to key events on the input element, so key events that occur after blur do not invoke the Controller.

### Exposed API

@TODO moar details!  

* `set content` - set the content of the input element, eg. when something is selected from the renderer's list.  In the delimited case, this only sets the current item in the delimited list.
* `focus` - focus the input element.
* `set timeout` - set the timeout used to send queries to the Data Source
* `set dataSource` - set the data source
* `set renderer` - set the renderer object

Maybe something like this?

    Y.one("#ac").plug(Y.AutoComplete).ac.init({
        // only one of these, obviously.

        // Allows for a succinct algorigthm for handling.
        // this.dataSource = (
        //     Y.DataSource
        //     && ("type" in arg.data)
        //     && (arg.data.type in Y.DataSource)
        // ) ? Y.DataSource[arg.data.type](arg.data) : arg.data.source;
        
        data : {
            type : "Function"
            source : function (request) {
                return data;
            },
        },
        data : {
            type: "Get",
            source : "http://query.yahooapis.com/v1/public/yql?format=json&",
            scriptCallbackParam : "cbFunc"
        },
        data : {
            type : "IO",
            source : "./myScript.php"
        },
        data : {
            type : "custom", // optional
            source : myDataSourceImitatorObject
        },
    });

### Events/plugin sockets/etc

On the controller, we ought to be able to customize the following:

1. Delimiters: How to determine what counts as a "query" in the input.  Often, the user may be selecting multiple items in a comma-delimited list, as in an email "To:" field.
2. The Controller inherits from `KeyListener`, so it supports `key` event listeners.
3. the minimum number of characters to trigger a search should be customizable.

## Data Source

The Data Source receives queries from the Controller, and returns a data object using the supplied callback function.

The default Data Source will be a Y.DataSource utility object that is created based on the arguments passed to the instantiation function.  However, this can be a hand-tuned data source, or any other kind of object that exposes the same API.

Until and unless Data Source is assigned to the Controller, queries will not be made.

### `makeRequest`

The Data Source object must expose a makeRequest method that takes a string query and a callback object.  The callback object contains `success` and `failure` methods, which must be called at the appropriate times.

If `makeRequest` is called before returning data, the request should be cancelled.  This logic is handled by the Data Source.

## Renderer

The renderer object in the default implementation is an `AutoCompleteRenderer` object, which inherits from `Widget`.

The default renderer will be a simple drop-down list of selectable items.  It exposes a `render` method, which is called by the Controller.




