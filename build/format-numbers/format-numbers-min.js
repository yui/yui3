YUI.add("format-numbers",function(e,t){function n(e,t,n,r){e=typeof e=="string"?e:String(e);if(e.length>=t)return e;n=n||"0";var i=[];for(var s=e.length;s<t;s++)i.push(n);return i[r?"unshift":"push"](e),i.join("")}Format=function(e,t){if(arguments.length==0)return;this._pattern=e,this._segments=[],this.Formats=t},Format.prototype._pattern=null,Format.prototype._segments=null,e.mix(Format,{Exception:function(e,t){this.name=e,this.message=t,this.toString=function(){return this.name+": "+this.message}},ParsingException:function(e){Format.ParsingException.superclass.constructor.call(this,"ParsingException",e)},IllegalArgumentsException:function(e){Format.IllegalArgumentsException.superclass.constructor.call(this,"IllegalArgumentsException",e)},FormatException:function(e){Format.FormatException.superclass.constructor.call(this,"FormatException",e)}}),e.extend(Format.ParsingException,Format.Exception),e.extend(Format.IllegalArgumentsException,Format.Exception),e.extend(Format.FormatException,Format.Exception),Format.prototype.format=function(e){var t=[];for(var n=0;n<this._segments.length;n++)t.push(this._segments[n].format(e));return t.join("")},Format.prototype.parse=function(e,t){var n=this._createParseObject(),r=t||0;for(var i=0;i<this._segments.length;i++){var s=this._segments[i];r=s.parse(n,e,r)}if(r<e.length)throw new Format.ParsingException("Input too long");return n},Format.prototype._createParseObject=function(e){throw new Format.ParsingException("Not implemented")},Format.Segment=function(e,t){if(arguments.length==0)return;this._parent=e,this._s=t},Format.Segment.prototype.format=function(e){return this._s},Format.Segment.prototype.parse=function(e,t,n){throw new Format.ParsingException("Not implemented")},Format.Segment.prototype.getFormat=function(){return this._parent},Format.Segment._parseLiteral=function(e,t,n){if(t.length-n<e.length)throw new Format.ParsingException("Input too short");for(var r=0;r<e.length;r++)if(e.charAt(r)!=t.charAt(n+r))throw new Format.ParsingException("Input doesn't match");return n+e.length},Format.Segment._parseInt=function(e,t,n,r,i,s,o){var u=s||r.length-i,a=i;for(var f=0;f<u;f++)if(!r.charAt(i++).match(/\d/)){i--;break}var l=i;if(a==l)throw new Format.ParsingException("Number not present");if(s&&l-a!=s)throw new Format.ParsingException("Number too short");var c=parseInt(r.substring(a,l),o||10);if(t){var h=e||window;typeof t=="function"?t.call(h,c+n):h[t]=c+n}return l},Format.TextSegment=function(e,t){if(arguments.length==0)return;Format.TextSegment.superclass.constructor.call(this,e,t)},e.extend(Format.TextSegment,Format.Segment),Format.TextSegment.prototype.toString=function(){return'text: "'+this._s+'"'},Format.TextSegment.prototype.parse=function(e,t,n){return Format.Segment._parseLiteral(this._s,t,n)},String.prototype.trim==null&&(String.prototype.trim=function(){return this.replace(/^\s+/,"").replace(/\s+$/,"")});var r="format-numbers";NumberFormat=function(e,t,n){if(arguments.length==0)return;Format.call(this,e,t);if(!e)return;e=="{plural_style}"&&(e=this.Formats.decimalFormat,this._isPluralCurrency=!0,this._pattern=e),this.currency=this.Formats.defaultCurrency;if(this.currency==null||this.currency=="")this.currency="USD";var r=e.split(/;/);e=r[0],this._useGrouping=e.indexOf(",")!=-1,this._parseIntegerOnly=e.indexOf(".")==-1;if(this._useGrouping){var i=e.match(/[0#,]+/),s=new RegExp("[0#]+","g"),o=i[0].match(s),u=o.length-2;this._primaryGrouping=o[u+1].length,this._secondaryGrouping=u>0?o[u].length:o[u+1].length}u=0;var a=this.__parseStatic(e,u);u=a.offset;var f=a.text!="";f&&this._segments.push(new Format.TextSegment(this,a.text));var l=u;while(u<e.length&&NumberFormat._META_CHARS.indexOf(e.charAt(u))!=-1)u++;var c=u,h=e.substring(l,c),p=h.indexOf(this.Formats.exponentialSymbol),d=p!=-1?h.substring(p+1):null;d&&(h=h.substring(0,p),this._showExponent=!0);var v=h.indexOf("."),m=v!=-1?h.substring(0,v):h;if(m){m=m.replace(/[^#0]/g,"");var g=m.indexOf("0");g!=-1&&(this._minIntDigits=m.length-g),this._maxIntDigits=m.length}var y=v!=-1?h.substring(v+1):null;y&&(g=y.lastIndexOf("0"),g!=-1&&(this._minFracDigits=g+1),this._maxFracDigits=y.replace(/[^#0]/g,"").length),this._segments.push(new NumberFormat.NumberSegment(this,h)),a=this.__parseStatic(e,u),u=a.offset,a.text!=""&&this._segments.push(new Format.TextSegment(this,a.text));if(n)return;if(r.length>1)e=r[1],this._negativeFormatter=new NumberFormat(e,t,!0);else{var b=new NumberFormat("",t);b._segments=b._segments.concat(this._segments);var w=f?1:0,E=new Format.TextSegment(b,this.Formats.minusSign);b._segments.splice(w,0,E),this._negativeFormatter=b}},NumberFormat.prototype=new Format,NumberFormat.prototype.constructor=NumberFormat,NumberFormat._NUMBER="number",NumberFormat._INTEGER="integer",NumberFormat._CURRENCY="currency",NumberFormat._PERCENT="percent",NumberFormat._META_CHARS="0#.,E",NumberFormat.prototype._groupingOffset=Number.MAX_VALUE,NumberFormat.prototype._minIntDigits=1,NumberFormat.prototype._isCurrency=!1,NumberFormat.prototype._isPercent=!1,NumberFormat.prototype._isPerMille=!1,NumberFormat.prototype._showExponent=!1,NumberFormat.prototype.format=function(e){if(e<0&&this._negativeFormatter)return this._negativeFormatter.format(e);var t=Format.prototype.format.call(this,e);if(this._isPluralCurrency){var n="";e==1?(n=this.Formats.currencyPatternSingular,n=n.replace("{1}",this.Formats[this.currency+"_currencySingular"])):(n=this.Formats.currencyPatternPlural,n=n.replace("{1}",this.Formats[this.currency+"_currencyPlural"])),t=n.replace("{0}",t)}return t},NumberFormat.prototype.parse=function(e,t){if(e.indexOf(this.Formats.minusSign)!=-1&&this._negativeFormatter)return this._negativeFormatter.parse(e,t);if(this._isPluralCurrency){var n=this.Formats[this.currency+"_currencySingular"],r=this.Formats[this.currency+"_currencyPlural"];e=e.replace(r,"").replace(n,"").trim()}var i=null;try{i=Format.prototype.parse.call(this,e,t),i=i.value}catch(s){}return i},NumberFormat.prototype.__parseStatic=function(e,t){var n=[];while(t<e.length){var r=e.charAt(t++);if(NumberFormat._META_CHARS.indexOf(r)!=-1){t--;break}switch(r){case"'":var i=t;while(t<e.length&&e.charAt(t++)!="'");var s=t;r=s-i==0?"'":e.substring(i,s);break;case"%":r=this.Formats.percentSign,this._isPercent=!0;break;case"\u2030":r=this.Formats.perMilleSign,this._isPerMille=!0;break;case"\u00a4":e.charAt(t)=="\u00a4"?(r=this.Formats[this.currency+"_currencyISO"],t++):r=this.Formats[this.currency+"_currencySymbol"],this._isCurrency=!0}n.push(r)}return{text:n.join(""),offset:t}},NumberFormat.prototype._createParseObject=function(){return{value:null}},NumberFormat.NumberSegment=function(e,t){if(arguments.length==0)return;Format.Segment.call(this,e,t)},NumberFormat.NumberSegment.prototype=new Format.Segment,NumberFormat.NumberSegment.prototype.constructor=NumberFormat.NumberSegment,NumberFormat.NumberSegment.prototype.format=function(e){if(isNaN(e))return this._parent.Formats.nanSymbol;if(e===Number.NEGATIVE_INFINITY||e===Number.POSITIVE_INFINITY)return this._parent.Formats.infinitySign;typeof e!="number"&&(e=Number(e)),e=Math.abs(e),this._parent._isPercent?e*=100:this._parent._isPerMille&&(e*=1e3),this._parent._parseIntegerOnly&&(e=Math.floor(e));var t=this._parent.Formats.exponentialSymbol,n=new RegExp(t+"+"),r=this._parent._showExponent?e.toExponential(this._parent._maxFracDigits).toUpperCase().replace(n,t):e.toFixed(this._parent._maxFracDigits||0);return r=this._normalize(r),r},NumberFormat.NumberSegment.prototype._normalize=function(e){var t=this._parent.Formats.exponentialSymbol,r=new RegExp("[\\."+t+"]"),i=e.split(r),s=i.shift();s.length<this._parent._minIntDigits&&(s=n(s,this._parent._minIntDigits,this._parent.Formats.numberZero));if(s.length>this._parent._primaryGrouping&&this._parent._useGrouping){var o=[],u=this._parent._primaryGrouping,a=s.length-u;while(a>0)o.unshift(s.substr(a,u)),o.unshift(this._parent.Formats.groupingSeparator),u=this._parent._secondaryGrouping,a-=u;o.unshift(s.substring(0,a+u)),s=o.join("")}var f="0",l;if(e.match(/\./))f=i.shift();else if(e.match(/\e/)||e.match(/\E/))l=i.shift();f=f.replace(/0+$/,""),f.length<this._parent._minFracDigits&&(f=n(f,this._parent._minFracDigits,this._parent.Formats.numberZero,!0)),o=[s];if(f.length>0){var c=this._parent.Formats.decimalSeparator;o.push(c,f)}return l&&o.push(t,l.replace(/^\+/,"")),o.join("")},NumberFormat.NumberSegment.prototype.parse=function(e,t,n){var r=this._parent.Formats.groupingSeparator,i=this._parent.Formats.decimalSeparator,s=this._parent.Formats.minusSign,o=this._parent.Formats.exponentialSymbol,u="[\\"+s+"0-9"+r+"]+";this._parent._parseIntegerOnly||(u+="(\\"+i+"[0-9]+)?"),this._parent._showExponent&&(u+="("+o+"\\+?[0-9]+)");var a=new RegExp(u),f=t.match(a);if(!f)throw new Format.ParsingException("Number does not match pattern");var l=t.indexOf(s)!=-1,c=n+f[0].length;t=t.slice(n,c);var h=null;if(this._parent.showExponent)h=t.split(o);else if(this._parent._useGrouping){if(!this._parent._primaryGrouping)throw new Format.ParsingException("Invalid pattern");var p=t.length-this._parent._primaryGrouping-1;f[1]&&(p-=f[1].length);if(p>0){if(t.charAt(p)!=",")throw new Format.ParsingException("Number does not match pattern");t=t.slice(0,p)+t.slice(p+1)}var d=this._parent._secondaryGrouping||this._parent._primaryGrouping;p=p-d-1;while(p>0){if(t.charAt(p)!=",")throw new Format.ParsingException("Number does not match pattern");t=t.slice(0,p)+t.slice(p+1),p=p-d-1}if(t.indexOf(r)!=-1)throw new Format.ParsingException("Number does not match pattern")}return h?e.value=parseFloat(h[0],10)*Math.pow(10,parseFloat(h[1],10)):e.value=parseFloat(t,10),l&&(e.value*=-1),this._parent._isPercent?e.value/=100:this._parent._isPerMille&&(e.value/=1e3),c},e.NumberFormat=function(t){t=t||e.NumberFormat.STYLES.NUMBER_STYLE;var n="",i=e.Intl.get(r);switch(t){case e.NumberFormat.STYLES.CURRENCY_STYLE:n=i.currencyFormat;break;case e.NumberFormat.STYLES.ISO_CURRENCY_STYLE:n=i.currencyFormat,n=n.replace("\u00a4","\u00a4\u00a4");break;case e.NumberFormat.STYLES.NUMBER_STYLE:n=i.decimalFormat;break;case e.NumberFormat.STYLES.PERCENT_STYLE:n=i.percentFormat;break;case e.NumberFormat.STYLES.PLURAL_CURRENCY_STYLE:n="{plural_style}";break;case e.NumberFormat.STYLES.SCIENTIFIC_STYLE:n=i.scientificFormat}this._numberFormatInstance=new NumberFormat(n,i)},e.NumberFormat.STYLES={CURRENCY_STYLE:1,ISO_CURRENCY_STYLE:2,NUMBER_STYLE:4,PERCENT_STYLE:8,PLURAL_CURRENCY_STYLE:16,SCIENTIFIC_STYLE:32},e.NumberFormat.UnknownStyleException=function(e){this.message=e},e.NumberFormat.UnknownStyleException.prototype.toString=function(){return"UnknownStyleException: "+this.message},e.NumberFormat.createInstance=function(t){return new e.NumberFormat(t)},e.NumberFormat.getAvailableLocales=function(){return e.Intl.getAvailableLangs(r)},e.NumberFormat.prototype.format=function(e){return this._numberFormatInstance.format(e)},e.NumberFormat.prototype.getCurrency=function(){return this._numberFormatInstance.currency},e.NumberFormat.prototype.getMaximumFractionDigits=function(){return this._numberFormatInstance._maxFracDigits||0},e.NumberFormat.prototype.getMaximumIntegerDigits=function(){return this._numberFormatInstance._maxIntDigits||0},e.NumberFormat.prototype.getMinimumFractionDigits=function(){return this._numberFormatInstance._minFracDigits||0},e.NumberFormat.prototype.getMinimumIntegerDigits=function(){return this._numberFormatInstance._minIntDigits||0},e.NumberFormat.prototype.isGroupingUsed=function(){return this._numberFormatInstance._useGrouping},e.NumberFormat.prototype.isParseIntegerOnly=function(){return this._numberFormatInstance._parseIntegerOnly},e.NumberFormat.prototype.parse=function(e,t){return this._numberFormatInstance.parse(e,t)},e.NumberFormat.prototype.setCurrency=function(e){this._numberFormatInstance.currency=e},e.NumberFormat.prototype.setGroupingUsed=function(e){this._numberFormatInstance._useGrouping=e},e.NumberFormat.prototype.setMaximumFractionDigits=function(e){this._numberFormatInstance._maxFracDigits=e,this.getMinimumFractionDigits()>e&&this.setMinimumFractionDigits(e)},e.NumberFormat.prototype.setMaximumIntegerDigits=function(e){this._numberFormatInstance._maxIntDigits=e,this.getMinimumIntegerDigits()>e&&this.setMinimumIntegerDigits(e)},e.NumberFormat.prototype.setMinimumFractionDigits=function(e){this._numberFormatInstance._minFracDigits=e,this.getMaximumFractionDigits()<e&&this.setMaximumFractionDigits(e)},e.NumberFormat.prototype.setMinimumIntegerDigits=function(e){this._numberFormatInstance._minIntDigits=e,this.getMaximumIntegerDigits()<e&&this.setMaximumIntegerDigits(e)},e.NumberFormat.prototype.setParseIntegerOnly=function(e){this._numberFormatInstance._parseIntegerOnly=e}},"@VERSION@",{lang:["af-NA","af","af-ZA","am-ET","am","ar-AE","ar-BH","ar-DZ","ar-EG","ar-IQ","ar-JO","ar-KW","ar-LB","ar-LY","ar-MA","ar-OM","ar-QA","ar-SA","ar-SD","ar-SY","ar-TN","ar","ar-YE","as-IN","as","az-AZ","az-Cyrl-AZ","az-Cyrl","az-Latn-AZ","az-Latn","az","be-BY","be","bg-BG","bg","bn-BD","bn-IN","bn","bo-CN","bo-IN","bo","ca-ES","ca","cs-CZ","cs","cy-GB","cy","da-DK","da","de-AT","de-BE","de-CH","de-DE","de-LI","de-LU","de","el-CY","el-GR","el","en-AU","en-BE","en-BW","en-BZ","en-CA","en-GB","en-HK","en-IE","en-IN","en-JM","en-JO","en-MH","en-MT","en-MY","en-NA","en-NZ","en-PH","en-PK","en-RH","en-SG","en-TT","en","en-US-POSIX","en-US","en-VI","en-ZA","en-ZW","eo","es-AR","es-BO","es-CL","es-CO","es-CR","es-DO","es-EC","es-ES","es-GT","es-HN","es-MX","es-NI","es-PA","es-PE","es-PR","es-PY","es-SV","es","es-US","es-UY","es-VE","et-EE","et","eu-ES","eu","fa-AF","fa-IR","fa","fi-FI","fi","fil-PH","fil","fo-FO","fo","fr-BE","fr-CA","fr-CH","fr-FR","fr-LU","fr-MC","fr-SN","fr","ga-IE","ga","gl-ES","gl","gsw-CH","gsw","gu-IN","gu","gv-GB","gv","ha-GH","ha-Latn-GH","ha-Latn-NE","ha-Latn-NG","ha-Latn","ha-NE","ha-NG","ha","haw","haw-US","he-IL","he","hi-IN","hi","hr-HR","hr","hu-HU","hu","hy-AM-REVISED","hy-AM","hy","id-ID","id","ii-CN","ii","in-ID","in","is-IS","is","it-CH","it-IT","it","iw-IL","iw","ja-JP-TRADITIONAL","ja-JP","ja","ka-GE","ka","kk-Cyrl-KZ","kk-Cyrl","kk-KZ","kk","kl-GL","kl","km-KH","km","kn-IN","kn","kok-IN","kok","ko-KR","ko","kw-GB","kw","lt-LT","lt","lv-LV","lv","mk-MK","mk","ml-IN","ml","mr-IN","mr","ms-BN","ms-MY","ms","mt-MT","mt","nb-NO","nb","ne-IN","ne-NP","ne","nl-BE","nl-NL","nl","nn-NO","nn","no-NO-NY","no-NO","no","om-ET","om-KE","om","or-IN","or","pa-Arab-PK","pa-Arab","pa-Guru-IN","pa-Guru","pa-IN","pa-PK","pa","pl-PL","pl","ps-AF","ps","pt-BR","pt-PT","pt","ro-MD","ro-RO","ro","ru-RU","ru","ru-UA","sh-BA","sh-CS","sh","sh-YU","si-LK","si","sk-SK","sk","sl-SI","sl","so-DJ","so-ET","so-KE","so-SO","so","sq-AL","sq","sr-BA","sr-CS","sr-Cyrl-BA","sr-Cyrl-CS","sr-Cyrl-ME","sr-Cyrl-RS","sr-Cyrl","sr-Cyrl-YU","sr-Latn-BA","sr-Latn-CS","sr-Latn-ME","sr-Latn-RS","sr-Latn","sr-Latn-YU","sr-ME","sr-RS","sr","sr-YU","sv-FI","sv-SE","sv","sw-KE","sw","sw-TZ","ta-IN","ta","te-IN","te","th-TH-TRADITIONAL","th-TH","th","ti-ER","ti-ET","ti","tl-PH","tl","tr-TR","tr","uk","uk-UA","ur-IN","ur-PK","ur","uz-AF","uz-Arab-AF","uz-Arab","uz-Cyrl","uz-Cyrl-UZ","uz-Latn","uz-Latn-UZ","uz","uz-UZ","vi","vi-VN","zh-CN","zh-Hans-CN","zh-Hans-HK","zh-Hans-MO","zh-Hans-SG","zh-Hans","zh-Hant-HK","zh-Hant-MO","zh-Hant-TW","zh-Hant","zh-HK","zh-MO","zh-SG","zh-TW","zh","zu","zu-ZA"]});
