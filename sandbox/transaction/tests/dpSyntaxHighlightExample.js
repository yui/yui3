/**
 * Inline syntax highligher for use with dpSyntaxHighlighter.js and 
 * corresponding .css.  Include this script at the bottom of the body tag.
 *
 * WHAT IT DOES:
 * This script will scan the current page for <style> and <script (no src attr)>
 * nodes as well as sections of the DOM that have class="markup".  It then
 * copies the content of these nodes into appropriately set up textareas and
 * fires dp.SyntaxHighlight.HighlightAll('code') to highlight these content
 * snippets.  By default, these highlighted snippets are added to the bottom of
 * the body in a scheduled setTimeout.
 *
 * CONFIGURATION:
 * Configuration can be passed in the query string of the <script> node
 * referencing this file. E.g.
 * <script src="/assets/dpSyntaxHighlightExample.js?headers=false"></script>
 *
 * The available configurations are:
 * highlight    {Comma separated list of 'markup', 'css', and 'javascript'}
 *                The specified types will be added and highlighted in the
 *                indicated order.  By default 'markup,css,javascript'.
 * headers      {Boolean string}
 *                Indicates whether snippets of highlighted markup should be
 *                prefaced with an
 *                <h3 class="dp-highlight-section">HTML</h3>
 *                and such for CSS and JavaScript.  Only one heading appear
 *                above all snippets of a type.  By default 'true'.
 * timeout      {Int millisecond timeout}
 *                Number of milliseconds to delay the highlighted snippets
 *                getting added to the page. -1 for immediate (no setTimeout).
 *                By default 0.
 * cssTarget    {id string}
 *                String id of a DOM node to place all CSS snippets in.  If
 *                not specified or the target is not found by the given id,
 *                snippets will be added to a default container div at the
 *                bottom of the body.  By default null (default container).
 * markupTarget {id string}
 *                String id of a DOM node to place all markup snippets in.  If
 *                not specified or the target is not found by the given id,
 *                snippets will be added to a default container div at the
 *                bottom of the body.  By default null (default container).
 * jsTarget     {id string}
 *                String id of a DOM node to place all js snippets in.  If
 *                not specified or the target is not found by the given id,
 *                snippets will be added to a default container div at the
 *                bottom of the body.  By default null (default container).
 * markupClass  {class string}
 *                Class name to look for in the DOM for markup sections to
 *                highlight. E.g. <p class="markup"> and <em class="markup">.
 *                By default 'markup'.
 * ignoreClass  {class string}
 *                Class name to look for on style and script nodes to indicate
 *                you do NOT want them added as highlighted snippets.  By
 *                default 'highlight-ignore'.
 * 
 */
(function () {
var d = document,
    SPACE = ' ',
    EMPTY = '',
    scripts,
    hi;


// Private namespace hi
hi = {
    util : {
        add : function (id,content) {
            var df = d.createDocumentFragment(),
                holder = d.createElement('div'),
                n,i;

            holder.innerHTML = content;

            n = (id && id.nodeType === 1 ? id : d.getElementById(id)) ||
                 hi.defaultContainer ||
                 (hi.defaultContainer = d.createElement('div'));

            while (holder.firstChild) {
                df.appendChild(holder.firstChild);
            }

            n.appendChild(df);
        },
        hasClass : function (el,c) {
            return (el && el.className &&
                   (SPACE+el.className.replace(/\s+/g,SPACE)+SPACE).
                        indexOf(SPACE+c+SPACE) > -1);
        },
        getByClass : function (c,tag,root) {
            var els = (root || d).getElementsByTagName(tag || '*'),
                i,j=0,len,n,hits = [];

            for (i = 0, len = els.length; i < len; ++i) {
                n = els[i];
                if (hi.util.hasClass(n,c)) {
                    hits[j++] = n;
                }
            }
            
            return hits;
        }
    },

    conf : {
        highlight    : ['markup','css','javascript'],
        headers      : true,
        timeout      : 0,

        cssTarget    : null,
        markupTarget : null,
        jsTarget     : null,

        markupClass  : 'markup',
        ignoreClass  : 'highlight-ignore'
    },

    toTextarea : function (content, type) {
        return '<textarea name="code" cols="60" rows="1" class="'+type+'">' +
                content + '</textarea>';
    },

    sectionHeader : function (content) {
        return '<h3 class="dp-highlight-section">'+content+'</h3>';
    },

    configure : function (cfg) {
        if (cfg.highlight) { hi.conf.highlight = cfg.highlight.split(','); }
        if (cfg.headers)   { hi.conf.headers   = (cfg.headers === 'true'); }
        if (cfg.timeout)   { hi.conf.timeout   = cfg.timeout|0; }

        if (cfg.cssTarget)    { hi.conf.cssTarget    = cfg.cssTarget; }
        if (cfg.markupTarget) { hi.conf.markupTarget = cfg.markupTarget; }
        if (cfg.jsTarget)     { hi.conf.jsTarget     = cfg.jsTarget; }

        if (cfg.markupClass) { hi.conf.markupClass = cfg.markupClass; }
        if (cfg.ignoreClass) { hi.conf.ignoreClass = cfg.ignoreClass; }
    },

    highlight : function () {
        for (var i=0, len=hi.conf.highlight.length; i<len; ++i) {
            switch (hi.conf.highlight[i].toLowerCase()) {
                case 'markup'     : hi.highlightMarkup(); break;
                case 'css'        : hi.highlightCSS(); break;
                case 'javascript' : hi.highlightJavaScript(); break;
            }
        }
        
        // If any of the highlight functions created the default container,
        // assign it a class and append it to the body.
        if (hi.defaultContainer) {
            hi.defaultContainer.className = 'highlight-example';
            d.body.appendChild(hi.defaultContainer);
            delete hi.defaultContainer;
        }

        dp.SyntaxHighlighter.HighlightAll('code');
    },

    highlightCSS : function () {
        var styles  = d.getElementsByTagName('style'),
            ignore  = hi.conf.ignoreClass,
            content = '',
            i,len,n;

        for (i = 0,len = styles.length; i < len; ++i) {
            n = styles[i];
            if (!hi.util.hasClass(n,ignore)) {
                content += hi.toTextarea(n.innerHTML,'CSS');
            }
        }

        if (content) {
            if (hi.conf.headers) {
                content = hi.sectionHeader('CSS') + content;
            }

            hi.util.add(hi.conf.cssTarget,content);
        }
    },

    highlightMarkup : function () {
        var markup  = hi.util.getByClass(hi.conf.markupClass),
            content = '',
            i,len;

        for (i = 0,len = markup.length; i < len; ++i) {
            content += hi.toTextarea(markup[i].innerHTML.
                        replace(/<(?=\/textarea>)/ig,'&lt;'),'HTML');
        }

        if (content) {
            if (hi.conf.headers) {
                content = hi.sectionHeader('HTML') + content;
            }

            hi.util.add(hi.conf.markupTarget,content);
        }
    },

    highlightJavaScript : function () {
        var scripts = d.getElementsByTagName('script'),
            ignore  = hi.conf.ignoreClass,
            content = '',
            i,len,n;

        for (i = 0,len = scripts.length; i < len; ++i) {
            n = scripts[i];
            if (/\S/.test(n.innerHTML) && !hi.util.hasClass(n,ignore)) {
                content += hi.toTextarea(n.innerHTML,'JScript');
            }
        }

        if (content) {
            if (hi.conf.headers) {
                content = hi.sectionHeader('JavaScript') + content;
            }

            hi.util.add(hi.conf.jsTarget,content);
        }
    }
};

// Configure execution from src attribute query string
// E.g. <script src="dpSyntaxHighlightExample.js?highlight=css%2Cmarkup&headers=false"></script>
var scripts = d.getElementsByTagName('script'),
    cfgData = scripts[scripts.length - 1].src.
                replace(/.*?\?/,'').
                split(/&/),
    cfg = {},
    i   = cfgData.length,
    keyVal;

while (i--) {
    keyVal = cfgData[i].split('=');
    if (keyVal[0] && keyVal[1]) {
        cfg[decodeURIComponent(keyVal[0])] = decodeURIComponent(keyVal[1]);
    }
}
hi.configure(cfg);

// Schedule the highlighting
if (hi.conf.timeout >= 0) {
    setTimeout(function () { hi.highlight(); }, hi.conf.timeout);
} else {
    hi.highlight();
}

})();
