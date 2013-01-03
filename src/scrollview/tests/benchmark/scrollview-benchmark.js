YUI.add('scrollview-benchmark', function (Y) {

    var suite = Y.BenchmarkSuite = new Benchmark.Suite();

    function reset() {
    	Y.one('#container').empty(true).setHTML('<div id="sv-horiz-content" class="horiz-content yui3-scrollview-loading"><ul><li>1</li><li>2</li><li>3</li><li>4</li></ul></div>');
    }


    suite.add('Y.ScrollView: Instantiate a bare ScrollView', function () {
        
        reset();
          
        var config = {
                id:"svHorizPaged",
                srcNode:"#sv-horiz-content",
                height:200,
                width:300,
                flick: {
                    minDistance: 10,
                    minVelocity:0.3,
                    axis:"x"
                },
                render:true
            },
            model = new Y.ScrollView(config);
    });


    suite.add('Y.ScrollView: Instantiate a paginated ScrollView', function () {

        reset();
          
        var config = {
                id:"svHorizPaged",
                srcNode:"#sv-horiz-content",
                height:200,
                width:300,
                flick: {
                    minDistance: 10,
                    minVelocity:0.3,
                    axis:"x"
                },
                plugins: [{
                    fn:Y.Plugin.ScrollViewPaginator, 
                    cfg:{
                        selector:">ul>li"
                    }
                }],    
                render:true
            },
            model = new Y.ScrollView(config);
    });

}, '@VERSION@', {requires: ['scrollview-base', 'scrollview-paginator']});
