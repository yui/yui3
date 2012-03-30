var Paginator;

// Example #1 - View merged into Widget as extension
Paginator = Y.Base.create('paginator', Y.Widget, [
    Y.Paginator.ControllerExt,
    Y.Paginator.ModelExt,
    Y.Paginator.ViewExt
], {
    initializer: function () {
        // This should be done for me
        this.model = this;
    }
});


// Example #2 - View as a separate View instance, composed into a Widget
Paginator2 = Y.Base.create('paginator', Y.Widget, [Y.Paginator.ModelExt], {
    renderer: function () {
        this.view = new Y.Paginator.View({
            model: this,
            container: this.get('contentBox')
        });

        this.view.render();
    }
});

Y.Slider = Y.Base.create('slider', Y.RangeValueModel, [
    Y.WidgetModel,
    Y.SliderView
], {
    
}
