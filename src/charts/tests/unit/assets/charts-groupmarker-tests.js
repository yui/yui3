YUI.add('charts-groupmarker-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: GroupMarker"),
        GroupMarkerTestTemplate,
        parentDiv = Y.DOM.create('<div style="position:absolute;top:500px;left:0px;width:500px;height:400px" id="testdiv"></div>'),
        DOC = Y.config.doc;
    DOC.body.appendChild(parentDiv);
    
    GroupMarkerTestTemplate = function(cfg, globalCfg)
    {
        var i;
        GroupMarkerTestTemplate.superclass.constructor.apply(this);
        cfg.width = cfg.width || 400;
        cfg.height = cfg.height || 300;
        cfg.groupMarkers = true;
        cfg.interactionType = "planar";
        cfg.render = "#testdiv";
        this.attrCfg = cfg;
        for(i in globalCfg)
        {
            if(globalCfg.hasOwnProperty(i))
            {
                this[i] = globalCfg[i];
            }
        }
    };

    Y.extend(GroupMarkerTestTemplate, Y.Test.Case, {

        setUp: function() {
            this.chart = new Y.Chart(this.attrCfg);
        },
    
        testGroupMarkers: function()
        {
            var chart = this.chart,
                keys = chart.get("seriesKeys"),
                i = 0,
                len = keys.length;
            Y.Assert.isTrue(chart.get("groupMarkers"));
        },

        tearDown: function() {
            this.chart.destroy(true);
            Y.Event.purgeElement(DOC, false);
        }
    });
    
    Y.GroupMarkerTestTemplate = GroupMarkerTestTemplate;

    var dataProvider =  [ 
        {category:"5/1/2010", miscellaneous:2000, expenses:3700, revenue:2200}, 
        {category:"5/2/2010", miscellaneous:50, expenses:9100, revenue:100}, 
        {category:"5/3/2010", miscellaneous:400, expenses:1100, revenue:1500}, 
        {category:"5/4/2010", miscellaneous:200, expenses:1900, revenue:2800}, 
        {category:"5/5/2010", miscellaneous:5000, expenses:5000, revenue:2650}
    ],

    
    GroupMarkerTest = new Y.GroupMarkerTestTemplate({
        seriesKeys: ["miscellaneous", "expenses", "revenue"],
        dataProvider: dataProvider    
    },
    {
        name: "Group Marker Test"
    }),

    CircleMarkerTest = new Y.GroupMarkerTestTemplate({
        seriesKeys: ["miscellaneous", "expenses", "revenue"],
        dataProvider: dataProvider,
        seriesCollection: [
            {
                type: "combo",
                valueKey: "miscellaneous",
                styles: {
                    marker: {
                        shape: "circle"
                    }
                }
            },
            {
                type: "combo",
                valueKey: "expenses",
                styles: {
                    marker: {
                        shape: "circle"
                    }
                }
            },
            {
                type: "combo",
                valueKey: "revenue",
                styles: {
                    marker: {
                        shape: "circle"
                    }
                }
            }
        ]
    },
    {
        name: "Circle Marker Test"
    }),
   
    RectMarkerTest = new Y.GroupMarkerTestTemplate({
        seriesKeys: ["miscellaneous", "expenses", "revenue"],
        dataProvider: dataProvider,
        seriesCollection: [
            {
                type: "combo",
                valueKey: "miscellaneous",
                styles: {
                    marker: {
                        shape: "rect"
                    }
                }
            },
            {
                type: "combo",
                valueKey: "expenses",
                styles: {
                    marker: {
                        shape: "rect"
                    }
                }
            },
            {
                type: "combo",
                valueKey: "revenue",
                styles: {
                    marker: {
                        shape: "rect"
                    }
                }
            }
        ]
    },
    {
        name: "Rect Marker Test"
    }),
    
    DiamondMarkerTest = new Y.GroupMarkerTestTemplate({
        seriesKeys: ["miscellaneous", "expenses", "revenue"],
        dataProvider: dataProvider,
        seriesCollection: [
            {
                type: "combo",
                valueKey: "miscellaneous",
                styles: {
                    marker: {
                        shape: "diamond"
                    }
                }
            },
            {
                type: "combo",
                valueKey: "expenses",
                styles: {
                    marker: {
                        shape: "diamond"
                    }
                }
            },
            {
                type: "combo",
                valueKey: "revenue",
                styles: {
                    marker: {
                        shape: "diamond"
                    }
                }
            }
        ]
    },
    {
        name: "Diamond Marker Test"
    }),
    
    EllipseMarkerTest = new Y.GroupMarkerTestTemplate({
        seriesKeys: ["miscellaneous", "expenses", "revenue"],
        dataProvider: dataProvider,
        seriesCollection: [
            {
                type: "combo",
                valueKey: "miscellaneous",
                styles: {
                    marker: {
                        shape: "ellipse"
                    }
                }
            },
            {
                type: "combo",
                valueKey: "expenses",
                styles: {
                    marker: {
                        shape: "ellipse"
                    }
                }
            },
            {
                type: "combo",
                valueKey: "revenue",
                styles: {
                    marker: {
                        shape: "ellipse"
                    }
                }
            }
        ]
    },
    {
        name: "Ellipse Marker Test"
    }),
   
    ColumnTest = new Y.GroupMarkerTestTemplate({
        seriesKeys: ["miscellaneous", "expenses", "revenue"],
        dataProvider: dataProvider,
        seriesCollection: [
            {
                type: "column",
                valueKey: "miscellaneous",
                styles: {
                    marker: {
                        shape: "rect"
                    }
                }
            },
            {
                type: "column",
                valueKey: "expenses",
                styles: {
                    marker: {
                        shape: "rect"
                    }
                }
            },
            {
                type: "column",
                valueKey: "revenue",
                styles: {
                    marker: {
                        shape: "rect"
                    }
                }
            }
        ]
    },
    {
        name: "Column Marker Test"
    }),
   
    BarTest = new Y.GroupMarkerTestTemplate({
        seriesKeys: ["miscellaneous", "expenses", "revenue"],
        dataProvider: dataProvider,
        seriesCollection: [
            {
                type: "bar",
                valueKey: "miscellaneous",
                styles: {
                    marker: {
                        shape: "rect"
                    }
                }
            },
            {
                type: "bar",
                valueKey: "expenses",
                styles: {
                    marker: {
                        shape: "rect"
                    }
                }
            },
            {
                type: "bar",
                valueKey: "revenue",
                styles: {
                    marker: {
                        shape: "rect"
                    }
                }
            }
        ]
    },
    {
        name: "Bar Marker Test"
    });
    
    suite.add(GroupMarkerTest);
    suite.add(CircleMarkerTest);
    suite.add(RectMarkerTest);
    suite.add(DiamondMarkerTest);
    suite.add(EllipseMarkerTest);
    suite.add(ColumnTest);
    suite.add(BarTest);

    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['charts', 'test']});
