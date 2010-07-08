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

### Attrs

* `queryValue` - The form control's value, or a single item in a delimited list.  set("queryValue") is typically called by renderer widget when a selection is made.  Getting this value in the delimited case will return the item where the cursor lives.
* `keyTimeout` - The time in ms to wait between key events before searching.
* `dataSource` - The datasource object currently being used.  When not set, no requests get made.
	Bikeshed: Should there be some sugar to not have to create a DataSource manually?  My feeling is
	that it should be optional, but data:{type:"Get",url:"http://yql.yahoo.com/asdf"} is a bit
	friendlier.
* `delimiter` - What counts as a query?  Pass in a string or regex to split on.
* `minQueryLength` - Minimum number of characters to trigger a query
* `renderer` - The widget that is going to handle this thing.  If it's defined here, it should support taking the results of the query as an argument to the render() function.  It is also possible to hook the widget onto the ac:queryResult event.  Default is to use an ACDropDown widget.

Maybe something like this for DS sugar?

    Y.one("#ac").plug(Y.ACController).ac.init({
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

### Events

* `query` - Enough text has been entered, and the sendQuery function is being called on the DataSource if present.  Note that new queries might be made before the old query's data has returned.

And of course all the goodies it inherits from Plugin and Attribute and Base and whatnot.

## Data Source

The Data Source receives queries from the Controller, and returns a data object using the supplied callback function.

The default Data Source will be a Y.DataSource utility object that is created based on the arguments passed to the instantiation function.  However, this can be a hand-tuned data source, or any other kind of object that exposes the same API.

Until and unless Data Source is assigned to the Controller, queries will not be made.  However, the `query` event will still fire, so that if you want to use the ACController in interesting ways, that could still be done.  (Is this worthwhile?  Seems better to pick EITHER event hanging, OR a required object that ducks properly.)

### `sendRequest`

The Data Source object must expose a sendRequest method that takes a string query and a callback object.  The callback object contains `success` and `failure` methods, which must be called at the appropriate times.

If `sendRequest` is called before returning data, the request should be cancelled.  This logic is handled by the Data Source.

## Renderer

The renderer object in the default implementation is an `ACDropDown` object, which inherits from `Widget`.

The default renderer will be a simple drop-down list of selectable items.  It exposes a `render` method, which is called by the Controller with a data object returned by the Data Source.

Warning: This seems like it might be opening the door for the M and V to know too much about one another.  The data returned by the Data Source is another API surface, and should be kept small.  Mitigate this by making the ACWidget only accept data of a very specific shape, which is what is returned by the Data Source.  If the user wants to shoot themselves in the foot, they'll find a way no matter what we do.

Some work yet to be done exploring the best ways to do expanding/selectable/list-like widgets.
