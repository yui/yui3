/**
Provides seamless, gracefully degrading Pjax (pushState + Ajax) functionality,
which makes it easy to progressively enhance standard links on the page so that
they can be loaded normally in old browsers, or via Ajax (with HTML5 history
support) in newer browsers.

@module pjax
@main
@since 3.5.0
**/

/**
Provides seamless, gracefully degrading Pjax (pushState + Ajax) functionality,
which makes it easy to progressively enhance standard links on the page so that
they can be loaded normally in old browsers, or via Ajax (with HTML5 history
support) in newer browsers.

@class Pjax
@extends Router
@uses PjaxBase
@uses PjaxContent
@constructor
@param {Object} [config] Config attributes.
@since 3.5.0
**/
Y.Pjax = Y.Base.create('pjax', Y.Router, [Y.PjaxBase, Y.PjaxContent], {}, {
    ATTRS: {
        // Inherited from Router and already documented there.
        routes: {
            value: [
                {path: '*', callback: '_defaultRoute'}
            ]
        }
    }
});
