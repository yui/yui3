
// bootstrap loader

// parse the use array for gallery components

// add module stubs for each gallery module

// reenter use()

//////////////////////////////////////////////////

// dependencies a second hit

// loader bootstrap could pull in the known

// bootstrappable modules
//  +loader
//  +gallery
//
//  no: use the pattern specification

// maybe use parameters can be passed to the module def

//////////////////////////////////////////////////


patterns: {
    'gallery-': {
        // base path is used to build the url
        // @TODO resolve pattern specific overrides for local development
        base: 'http://yui.yahooapis.com/gallery-2009.10.26-22.41.46/build/'
    }

    'yui2.8.0-': {
        base: 'http://yui.yahooapis.com/2.8.0/build/'

        // Additional dependencies for a given component won't be resolved in
        // the YUI 3 system unless we actually look to code to YAHOO.register
        // specifically.
        
        // @TODO do we need a facility for discovering new dependencies after
        // the initial set is loaded?  For non-YUI3 code, this is probably not
        // an option since a component's dependencies need to have been evaluated
        // in the page before the component can be fetched.
        
        
        // the idea here is that the dependencies for the module refer to
        // other modules that should be captured in this filter.  This means
        // if we are able
        propagatePrefix: true

        // @TODO yui 2 loader bootstrapper?
        // @TODO yui 2 module wrapping?

        // path resolution template
        // mini substitute in core... would prefer if we didn't have a different way
        // to render this template.  At any rate, the problem is this:
        //
        // yui2-menu would have the path resolved to:
        // http://yui.yahooapis.com/2.8.0/build/yui2.8.0-menu/yui2.8.0-menu-min.js
        // but we want
        // http://yui.yahooapis.com/2.8.0/build/menu/menu-min.js
        //
        // @TODO can this be handled simply be having a flag at whether or not the prefix
        // is included when building the path?  Or do we need a filter?  Or a full template
        // and a filter?
    }
}
}
