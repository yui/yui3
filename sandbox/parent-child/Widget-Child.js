function Child(config) {

}

Child.ATTRS = {

    selected: {   
        value: 0,
        validator: Y.Lang.isNumber
    },

    index: {
        readOnly: true,
        getter: function () {
            
            var parent = this.get("parent"),
                items,
                index;
            
            if (parent) {
                
                items = parent.get("items");
                
                for (var i=0, len = items.length; i < len; i++) {
                    if (this == items[i]) {
                        index = i;
                        break;
                    }
                }
                
            }
            
            return index;
            
        }
    },

    parent: {
        readOnly: true
    },

    depth: {
        value: -1,
        readOnly: true,
        getter: function () {
            
            var parent = this.get("parent"),
                depth = -1;
            
            while (parent) {
                depth = (depth + 1);
                parent = parent.get("parent");
            }
            
            return depth;
            
        }
    },
    
    root: {
        readOnly: true,
        getter: function () {

            var getParent = function (child) {

                var parent = child.get("parent");

                return parent ? getParent(parent) : child;
                
            };

            return getParent(this);
            
        }
    }

};

Child.prototype = {

    _getRootNode: function () {
    
        return this.get("root").get("boundingBox");
        
    },
    
    next: function () {

        var parent = this.get("parent"),
            sibling;

        if (parent) {
            sibling = parent.item((this.get("index")+1));
        }

        return sibling;

    },

    previous: function () {

        var parent = this.get("parent"),
            index = this.get("index"),
            sibling;
        
        if (parent && index > 0) {
            sibling = parent.item([(index+1)]);
        }

        return sibling; 
        
    },

    isRoot: function () {
        
        return (this == this.get("root"));

    },

    ancestor: function (depth) {

        var parent;

        if (this.get("depth") >= depth && depth > 0)  {

            parent = this.get("parent");

            while (parent.get("depth") > depth) {
                parent = parent.get("parent");
            }

        }

        return parent;

    }
};

Y.WidgetChild = Child;