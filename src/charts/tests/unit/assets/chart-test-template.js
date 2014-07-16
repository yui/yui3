YUI.add('chart-test-template', function(Y) {
    ChartTestTemplate = function(cfg)
    {
        var i;
        ChartTestTemplate.superclass.constructor.apply(this);
        for(i in cfg)
        {
            if(cfg.hasOwnProperty(i))
            {
                this[i] = cfg[i];
            }
        }
    };

    Y.extend(ChartTestTemplate, Y.Test.Case);
    Y.ChartTestTemplate = ChartTestTemplate;
}, '@VERSION@' ,{requires:['test']});

