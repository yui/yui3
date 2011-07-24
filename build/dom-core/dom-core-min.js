YUI.add("dom-core",function(e){var n="nodeType",c="ownerDocument",b="documentElement",a="defaultView",g="parentWindow",j="tagName",k="parentNode",i="previousSibling",l="nextSibling",h="contains",d="compareDocumentPosition",m=[],f={byId:function(p,o){return f.allById(p,o)[0]||null;},ancestor:function(p,q,r){var o=null;if(r){o=(!q||q(p))?p:null;}return o||f.elementByAxis(p,k,q,null);},ancestors:function(q,r,s){var p=f.ancestor.apply(f,arguments),o=(p)?[p]:[];while((p=f.ancestor(p,r))){if(p){o.unshift(p);}}return o;},elementByAxis:function(o,r,q,p){while(o&&(o=o[r])){if((p||o[j])&&(!q||q(o))){return o;}}return null;},contains:function(p,q){var o=false;if(!q||!p||!q[n]||!p[n]){o=false;}else{if(p[h]){if(e.UA.opera||q[n]===1){o=p[h](q);}else{o=f._bruteContains(p,q);}}else{if(p[d]){if(p===q||!!(p[d](q)&16)){o=true;}}}}return o;},inDoc:function(q,r){var p=false,o;if(q&&q.nodeType){(r)||(r=q[c]);o=r[b];if(o&&o.contains&&q.tagName){p=o.contains(q);}else{p=f.contains(o,q);}}return p;},allById:function(t,o){o=o||e.config.doc;var p=[],q=[],r,s;if(o.querySelectorAll){q=o.querySelectorAll('[id="'+t+'"]');}else{if(o.all){p=o.all(t);if(p){if(p.nodeName){if(p.id===t){q.push(p);p=m;}else{p=[p];}}if(p.length){for(r=0;s=p[r++];){if(s.id===t||(s.attributes&&s.attributes.id&&s.attributes.id.value===t)){q.push(s);}}}}}else{q=[f._getDoc(o).getElementById(t)];}}return q;},isWindow:function(o){return !!(o&&o.alert&&o.document);},_removeChildNodes:function(o){while(o.firstChild){o.removeChild(o.firstChild);}},siblings:function(r,q){var o=[],p=r;while((p=p[i])){if(p[j]&&(!q||q(p))){o.unshift(p);}}p=r;while((p=p[l])){if(p[j]&&(!q||q(p))){o.push(p);}}return o;},_bruteContains:function(o,p){while(p){if(o===p){return true;}p=p.parentNode;}return false;},_getRegExp:function(p,o){o=o||"";f._regexCache=f._regexCache||{};if(!f._regexCache[p+o]){f._regexCache[p+o]=new RegExp(p,o);}return f._regexCache[p+o];},_getDoc:function(o){var p=e.config.doc;if(o){p=(o[n]===9)?o:o[c]||o.document||e.config.doc;}return p;},_getWin:function(o){var p=f._getDoc(o);return p[a]||p[g]||e.config.win;},_batch:function(o,w,u,t,s,q){w=(typeof w==="string")?f[w]:w;var x,r=0,p,v;if(w&&o){while((p=o[r++])){x=x=w.call(f,p,u,t,s,q);if(typeof x!=="undefined"){(v)||(v=[]);v.push(x);}}}return(typeof v!=="undefined")?v:o;},wrap:function(r,p){var q=e.DOM.create(p),o=q.getElementsByTagName("*");if(o.length){q=o[o.length-1];}if(r.parentNode){r.parentNode.replaceChild(q,r);}q.appendChild(r);},unwrap:function(r){var p=r.parentNode,q=p.lastChild,o=r,s;if(p){s=p.parentNode;if(s){r=p.firstChild;while(r!==q){o=r.nextSibling;s.insertBefore(r,p);r=o;}s.replaceChild(q,p);}else{p.removeChild(r);}}},generateID:function(o){var p=o.id;if(!p){p=e.stamp(o);o.id=p;}return p;}};e.DOM=f;},"@VERSION@",{requires:["oop","features"]});