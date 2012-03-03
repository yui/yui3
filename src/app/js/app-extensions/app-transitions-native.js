/**
Provides view transitions for `Y.App`.

@submodule app-transitions-native
@since 3.5.0
**/

var AppTransitions = Y.App.Transitions;

function AppTransitionsNative() {}

AppTransitionsNative.prototype = {
    // -- Lifecycle Methods ----------------------------------------------------

    initializer: function () {
        Y.Do.before(this._uiTransitionActiveView, this, '_uiSetActiveView');
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Returns a transition object containing a named fx for both `viewIn` and
    `viewOut` based on the relationship between the specified `newView` and
    `oldView`.

    @method _getFx
    @param {View} newView The View being transitioned-in.
    @param {View} oldView The View being transitioned-out.
    @return {Object} The transition object containing a named fx for both
      `viewIn` and `viewOut`.
    @protected
    **/
    _getFx: function (newView, oldView, transition) {
        var fx          = AppTransitions.FX,
            transitions = this.get('transitions');

        if (transition === false || !transitions) {
            return null;
        }

        if (transition) {
            return fx[transition];
        }

        if (this._isChildView(newView, oldView)) {
            return fx[transitions.toChild];
        }

        if (this._isParentView(newView, oldView)) {
            return fx[transitions.toParent];
        }

        return fx[transitions.navigate];
    },

    /**
    Performs the actual change of the app's `activeView` by attaching the
    `newView` to this app, and detaching the `oldView` from this app using any
    specified `options`.

    The `newView` is attached to the app by rendering it to the `viewContainer`,
    and making this app a bubble target of its events.

    The `oldView` is detached from the app by removing it from the
    `viewContainer`, and removing this app as a bubble target for its events.
    The `oldView` will either be preserved or properly destroyed.

    The `activeView` attribute is read-only and can be changed by calling the
    `showView()` method.

    TODO: Update docs to talk about transitions.

    @method _uiTransitionActiveView
    @param {View} newView The View which is now this app's `activeView`.
    @param {View} [oldView] The View which was this app's `activeView`.
    @param {Object} [options] Optional object containing any of the following
        properties:
      @param {Boolean} [options.prepend] Whether the new view should be
        prepended instead of appended to the `viewContainer`.
      @param {Function} [callback] Optional callback Function to call after the
        `newView` is ready to use, the function will be passed:
        @param {View} options.callback.view A reference to the `newView`.
    @protected
    **/
    _uiTransitionActiveView: function (newView, oldView, options) {
        options || (options = {});

        var fx = this._getFx(newView, oldView, options.transition),
            container, transitioning, isChild, isParent, prepend,
            fxConfig, transitions;

        // Prevent detaching (thus removing) the view we want to show.
        // Also hard to animate out and in, the same view. This allows the
        // default `_uiSetActiveView()` method to run.
        if (!fx || newView === oldView) {
            return;
        }

        container     = this.get('container');
        transitioning = AppTransitions.CLASS_NAMES.transitioning;

        container.addClass(transitioning);

        // Attach the new active view, and insert into the DOM so it can be
        // transitioned in.
        isChild  = this._isChildView(newView, oldView);
        isParent = !isChild && this._isParentView(newView, oldView);
        prepend  = !!options.prepend || isParent;

        this._attachView(newView, prepend);

        // Setup a new stack to run the view transitions in parallel.
        transitions = new Y.Parallel({context: this});
        fxConfig    = {
            crossView: !!oldView && !!newView,
        };

        // Transition the new view first to prevent a gap when sliding.
        if (newView && fx.viewIn) {
            newView.get('container').transition(fx.viewIn, {
                crossView: !!oldView && !!newView,
                isNewView: true,
                prepended: prepend
            }, transitions.add());
        }

        if (oldView && fx.viewOut) {
            oldView.get('container').transition(fx.viewOut, {
                crossView: !!oldView && !!newView,
                isOldView: true,
                prepended: prepend
            }, transitions.add());
        }

        // Called when view transitions completed, if none were added this will
        // run right away.
        transitions.done(function () {
            var callback = options.callback;

            this._detachView(oldView);
            container.removeClass(transitioning);

            callback && callback.call(this, newView);
        });

        return new Y.Do.Prevent();
    }
};

// -- Transitions --------------------------------------------------------------
Y.mix(Y.Transition.fx, {
    'app:fadeIn': {
        opacity : 1,
        duration: 0.35,

        on: {
            start: function (data) {
                var styles = {opacity: 0},
                    config = data.config;

                if (config.crossView && !config.prepended) {
                    styles.transform = 'translateX(-100%)';
                }

                this.setStyles(styles);
            },

            end: function () {
                this.setStyle('transform', 'translateX(0)');
            }
        }
    },

    'app:fadeOut': {
        opacity : 0,
        duration: 0.35,

        on: {
            start: function (data) {
                var styles = {opacity: 1},
                    config = data.config;

                if (config.crossView && config.prepended) {
                    styles.transform = 'translateX(-100%)';
                }

                this.setStyles(styles);
            },

            end: function () {
                this.setStyle('transform', 'translateX(0)');
            }
        }
    },

    'app:slideLeft': {
        duration : 0.35,
        transform: 'translateX(-100%)',

        on: {
            end: function () {
                this.setStyle('transform', 'translateX(0)');
            }
        }
    },

    'app:slideRight': {
        duration : 0.35,
        transform: 'translateX(0)',

        on: {
            start: function () {
                this.setStyle('transform', 'translateX(-100%)');
            },

            end: function () {
                this.setStyle('transform', 'translateX(0)');
            }
        }
    }
});

// -- Namespacae ---------------------------------------------------------------
Y.App.TransitionsNative = AppTransitionsNative;
Y.Base.mix(Y.App, [AppTransitionsNative]);
