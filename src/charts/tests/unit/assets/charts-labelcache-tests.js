YUI.add('charts-labelcache-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: ChartsLabelCache");
    suite.add(new Y.Test.Case({
        name: 'Charts LabelCache Tests',
        
        "test: _createLabelCache()" : function() {
            var chartsLabelCache = new Y.ChartsLabelCache(),
                mockLabelCache,
                labels = ["label1", "label2", "label3"],
                labelsLength = labels.length,
                MockLabelCache = function() {
                    this._labelCache = [];
                    this._labelCacheCleared = false;
                };
            Y.extend(MockLabelCache, Y.ChartsLabelCache, {
                _clearLabelCache: function() {
                    this._labelCacheCleared = true;
                }
            });
            mockLabelCache = new MockLabelCache();
            mockLabelCache._labels = labels;
            chartsLabelCache._createLabelCache.apply(mockLabelCache);
            Y.Assert.areEqual(labelsLength, mockLabelCache._labelCache.length, "The labelCache length should be " + labelsLength + ".");
            Y.Assert.isFalse(mockLabelCache._labelCacheCleared, "The _clearLabelCache method should not have been called.");
            mockLabelCache._labels = null;
            chartsLabelCache._createLabelCache.apply(mockLabelCache);
            Y.Assert.isTrue(mockLabelCache._labelCacheCleared, "The _clearLabelCache method should have been called.");
        },
        
        "test: _clearLabelCache()" : function() {
            var chartsLabelCache = new Y.ChartsLabelCache(),
                label,
                labels = [],
                i,
                len = 11;
            chartsLabelCache._clearLabelCache();
            Y.Assert.areEqual(0, chartsLabelCache._labelCache.length, "The should not be any labels in the cache.");
            for(i = 0; i < len; i = i + 1) {
                label = document.createElement('span');
                label.appendChild(document.createTextNode("label # " + (i + 1)));
                document.body.appendChild(label);
                labels.push(label);
            }
            chartsLabelCache._labelCache = labels;
            chartsLabelCache._clearLabelCache();
            Y.Assert.areEqual(0, chartsLabelCache._labelCache.length, "The should not be any labels in the cache.");
        },

        "test: _getLabel()" : function() {
            var chartsLabelCache = new Y.ChartsLabelCache(),
                className = "unitTestClass",
                len = 3,
                i,
                label1,
                label2;
            chartsLabelCache._labelCache = [];
            label1 = chartsLabelCache._getLabel(document.body, className);
            Y.Assert.isNotNull(label1, "A label should have been created.");
            Y.Assert.areEqual(className, Y.one(label1).get("className"), "The className of the label should be " + className + ".");
            label1.appendChild(document.createTextNode("dummy")); 
            chartsLabelCache._labelCache.push(label1);
            label2 = chartsLabelCache._getLabel(document.body);
            Y.Assert.areEqual("", Y.one(label2).get("innerHTML"), "The contents of the label should be an empty string.");
            chartsLabelCache._clearLabelCache();
            label1 = chartsLabelCache._getLabel(document.body);
            Y.Assert.areEqual("", Y.one(label1).get("className"), "The className of the label should be an empty string.");
        }
    }));

    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['charts-labelcache', 'test']});
