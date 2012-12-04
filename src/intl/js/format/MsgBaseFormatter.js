//For MessageFormat

UnsupportedOperationException = function(message) {
    this.message = message;
    this.toString = function() {
        return "UnsupportedOperationException: " + this.message;
    }
}

Formatter = function(values) {
    this.values = values;
};

//Static methods

Formatter.createInstance = function(values) {
    //return new Formatter(values);
    throw new UnsupportedOperationException('Not implemented');	//Must override in descendants
};

//Public methods

Formatter.prototype.getValue = function(key) {
    if(Y.Lang.isArray(this.values)) {
        key = parseInt(key); 
    }
    return this.values[key];
};

Formatter.prototype.getParams = function(params) {
    if(!params || !params.key) {
        return false;
    }

    var value = this.getValue(params.key);
	
    if(value != null) {
        params.value = value;
        return true;
    }

    return false;
};

Formatter.prototype.format = function(str, config) {
    throw new UnsupportedOperationException('Not implemented');	//Must override in descendants
};

//For date and time formatters
Y.mix(Formatter, {
    getCurrentTimeZone: function() {
        var systemTZoneOffset = (new Date()).getTimezoneOffset()*-60;
        return Y.Date.Timezone.getTimezoneIdForOffset(systemTZoneOffset); 
    }
})

if(String.prototype.trim == null) {
    String.prototype.trim = function() {
        return this.replace(/^\s+/, '').replace(/\s+$/, '');
    };
}
