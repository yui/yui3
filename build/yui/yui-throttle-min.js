YUI.add("yui-throttle",function(a){
/*! Based on work by Simon Willison: http://gist.github.com/292562 */
a.throttle=function(c,b){b=(b)?b:(a.config.throttleTime||150);if(b===-1){return(function(){c.apply(null,arguments);});}var d=(new Date()).getTime();return(function(){var e=(new Date()).getTime();if(e-d>b){d=e;c.apply(null,arguments);}});};},"@VERSION@",{requires:["yui-base"]});