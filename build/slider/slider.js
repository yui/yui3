YUI.add('slider', function(Y) {

Y.Slider = Y.Base.build( 'slider', Y.SliderBase, [ Y.IntValueRange, Y.ClickableRail ], { dynamic: true } );

}, '@VERSION@' ,{requires:['slider-base', 'clickable-rail', 'int-value-range']});
