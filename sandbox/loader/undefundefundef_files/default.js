//TODO: move $. functions to Utils
var Config = Config || {};
var Utils  = Utils  || {};

Config.$document = $(document);

Config.$document.ready(function() {
  Config.$body = $(document.body);

  Config.$body
  .bind("ajaxError", function(e, response, request){
  
    var json   = ( response.responseText != '') ? $.parseJSON(response.responseText) : {},
        params = $.extend( {}, {reload:1}, json );

    if ( json && json.response_code == 403 ) {
      $('.popup-outer, .popup-inner, .blocking-div').remove();
      
      if ( $.browser.msie && $.browser.version < 7 ) {
        window.location = '/log_in';
        return;
      }
      else {
        Auth.login.popup( false, params);
      }
    }
    else {
      //TODO: 500 error popup
    }

  });
});


$.popup = function( params ) {

  return $('<div />')
          .popup({input: $('#popup-template')
              .template(params)
            });

}; // popup

$.browserData = function() {
  
    var userAgent    = '',
        browser_data = {
          version : false,
          browser : false
        };
        
    userAgent = navigator.userAgent.toLowerCase();

    // Is this a version of IE? Checking this first since it's the most easily detected
    if($.browser.msie){
      userAgent = $.browser.version;
      userAgent = userAgent.substring(0,userAgent.indexOf('.') +2);	
      browser_data.version = userAgent;
      browser_data.browser = 'msie';
    }

    // Is this a version of Safari or Chrome?
    if($.browser.safari){
      var isChrome = userAgent.indexOf('chrome/'),
          isSafari = userAgent.indexOf('safari/');	
      
      // Is this actually Chrome (or Chromium, which reports itself as Chrome)?
      if ( isChrome != -1 ){
        userAgent = userAgent.substring(userAgent.indexOf('chrome/') +7);
        userAgent = userAgent.substring(0,userAgent.indexOf(' '));	
        browser_data.version = userAgent;
        browser_data.browser = 'chrome';
      } 
    
      // If this in fact Safari?
      else if ( isSafari > -1 ){
        userAgent = userAgent.substring(userAgent.indexOf('version/') +8);
        userAgent = userAgent.substring(0,userAgent.indexOf(' '));	
        browser_data.version = userAgent;	
        browser_data.browser = 'safari';
      }
    }

    // Is this an actual version of Mozilla, and not just reporting itself as such?
    if($.browser.mozilla){
      // Is it Firefox?
      if(navigator.userAgent.toLowerCase().indexOf('firefox') != -1){
      userAgent = userAgent.substring(userAgent.indexOf('firefox/') +8);
      userAgent = userAgent.substring(0,userAgent.lastIndexOf('.') +3);
      browser_data.version = userAgent;
      browser_data.browser = 'mozilla';
      }
    }

    // Is this a version of Opera?
    if($.browser.opera){
        
      if ( userAgent.indexOf('version/') > -1 ){
        userAgent = userAgent.substring(userAgent.indexOf('version/') +8);
      } 
      else {
        userAgent = userAgent.substring(userAgent.indexOf('opera/') +6);
      }
      
      userAgent = userAgent.substring(0,userAgent.indexOf('.') +2);
      browser_data.version = userAgent;
      browser_data.browser = 'opera';
    }
    browser_data.ua_string = navigator.userAgent.toLowerCase();
    return browser_data;
    
}; // $.browserData

/* 
*  This function compares the information returned by $.browserData 
*  to the browsers that are supported, as defined in the network 
*  configuration file.
*
*  return true if the browser is supported or we don't have the config data to figure it out
*  return false if the browser is not supported, or if we can't even tell what it is.
*/


$.browserCheck = function( app, description ) {

  var browser_data                    = $.browserData(),
      supported_browser_version       = [],
      user_browser_version            = [],
      browser_supported               = true,
      max_version_length              = 0,
      i                               = 0,
      $pop;
      
  // If app was not specified, return true
  if ( !app ){
    return true;
  } else if ( app != 'network' && app != 'prosite' ){
    return true;
  }
  
  // If the configuration variable is not defined, return true and support browser
  if ( !Config.BROWSER_SUPPORT ){
    return true;
  }
  
  // If the browser data was improperly parsed, return false. They're not supported
  if ( browser_data.browser == false || browser_data.version == false ){
    browser_supported = false;
    return false;
  }
  
  supported_browser_version = Config.BROWSER_SUPPORT[app][browser_data.browser].split('.');
  user_browser_version      = browser_data.version.split('.');
  
  max_version_length        = Math.min(supported_browser_version.length, user_browser_version.length);
  
  // Checks the entirety of the user's detected browser version array against the predefined version array, up to the longest of the two.
  
  for ( i = 0; i < max_version_length; i++ ){

  // If the user's version is greater than the supported version at any point in the comparison, return true and support browser.
    if ( parseInt( user_browser_version[i], 10) > parseInt( supported_browser_version[i], 10) ){
      browser_supported = true;
      break;
    }
    
    // If the user's version is less than the supported version at any point in the comparison, return false and don't support browser.
    else if ( parseInt( user_browser_version[i], 10) < parseInt( supported_browser_version[i], 10) ){
      browser_supported = false;
      break;    
    }
    
    // Otherwsie continue to check the subversion numbers until finished. If they'e exactly equal, browser_supported will remain set to true
  }
  
  if ( Config.BROWSER_SUPPORT[app][browser_data.browser] === '0' || !browser_supported ){
    
     if ( description ){
      description += '<br><br>';
    } 
    else {
      description = 'The browser you are using is not supported. ';
    }
    
    description += 'Please upgrade to one of the following browsers:<br><br><ul style="margin-left: 12px;">';
    description +=  ( Config.BROWSER_SUPPORT[app].mozilla != '0' ) ? '<li>&bull; <a href="target="blank" href="http://www.mozilla.com/firefox/">Mozilla Firefox '                                             + Config.BROWSER_SUPPORT[app].mozilla +'+</a></li>' : '';
    description +=  ( Config.BROWSER_SUPPORT[app].chrome  != '0' ) ? '<li>&bull; <a href="target="blank" href="http://www.google.com/chrome">Google Chrome '                                                  + Config.BROWSER_SUPPORT[app].chrome  +'+</a></li>' : '';
    description +=  ( Config.BROWSER_SUPPORT[app].safari  != '0' ) ? '<li>&bull; <a href="target="blank" href="http://www.apple.com/safari/">Apple Safari '                                                   + Config.BROWSER_SUPPORT[app].safari  +'+</a></li>' : '';
    description +=  ( Config.BROWSER_SUPPORT[app].opera   != '0' ) ? '<li>&bull; <a href="target="blank" href="http://www.opera.com/">Opera '                                                                 + Config.BROWSER_SUPPORT[app].opera   +'+</a></li>' : '';
    description +=  ( Config.BROWSER_SUPPORT[app].msie    != '0' ) ? '<li>&bull; <a href="target="blank" href="http://www.microsoft.com/windows/internet-explorer/default.aspx">Microsoft Internet Explorer ' + Config.BROWSER_SUPPORT[app].msie    +'+</a></li>' : '';
    description +=  '</ul>';
  
    $pop = $.popup({ 
      header      : 'Browser Update Required',
      description : description
    });
    
    return false;
  } // If browser not supported
  
  return true;
};


// determine proper scroll element for all browsers
$.scrollElement = function() {


  
  return ( $.browser.opera ) ? $('html:not(:animated)') : $('html:not(:animated), body:not(:animated)');
  
}; // scrollElement

/**
 * Return an array of the given attribute of all elements in the current jQuery stack.
 */
$.fn.pluck = function( attribute, match_integer ) {

  var x = [], i, val

  for ( i = 0; i < this.length; ++i ) {
  
    val = $(this[i]).attr(attribute);
    
    if ( match_integer === true && val.match(/^\d+$/) ) {
      val = parseInt( val, 10 );
    }
  
    x[x.length] = val;
    
  }

  return x;

};

/**
 * Return a delimited list of the given attribute of all elements in the current jQuery stack.
 */
$.fn.implode = function(glue, attribute) {
  return $(this).pluck(attribute).join(glue);
};

$.compact = function(arr) {

  var x = [];

  for ( var i = 0; i < arr.length; ++i ) {
    if (arr[i]) {
      x[x.length] = arr[i];
    }
  }

  return x;

};

$.jsonDecode = function(data) {

  try {
    return (data) ? eval('(' + data + ')') : {};
  }
  catch (e) {
    return { valid : 'no', messages : ['Not valid json'] };
  }

};

$.fn.defaultValue = function(defaultVal) {

  $.each(this, function() {

    var self = $(this);

    var getValue = function() {
      return self.val();
    };

    var setValue = function(val) {
      self.val(val);
    };

    var onFocus = function() {
      if (getValue() == defaultVal) {
        setValue('');
      }
    };

    var onBlur = function() {
      if (getValue() == '') {
        setValue(defaultVal);
      }
    };

    $.fn.defaultValue.destroy = function() {
      setValue('');
      self.unbind('focus.defaultValue', onFocus);
      self.unbind('blur.defaultValue', onBlur);
    };

    self.bind('focus.defaultValue', onFocus);
    self.bind('blur.defaultValue', onBlur);
    self.data('defaultVal', defaultVal);

    self.trigger('blur');

  });

  return this;

};

$.fn.hideButtons = function(txt) {

  txt = txt || 'Saving...';
  
  var html = '';

  $.each(this.find('.form-button'), function(i, n) {
    $(n).hide();
  });
  
  this.addClass('button-arrow-none');

  $msg = this.find('.form-submit-processing');

  if ( $msg.length ) {
    $msg.html(txt);
  }
  else {
  
    html += '<object height="20" width="20">';
    html += '<embed wmode="transparent" src="'+Config.ASSETSURL+'swf/preloading_animation_blue.swf" width="20" height="20"></embed>';
    html += '</object>';
    html += '<div class="left">'+txt+'</div>';
    
    $('<div>').addClass('form-submit-processing cfix relative').html(html).appendTo(this);
  }

  return this;

};

$.fn.showButtons = function() {

  $.each(this.find('.form-button'), function(i, n) {
    $(n).show();
  });
  
  this.removeClass('button-arrow-none');

  this.find('.form-submit-processing').remove();

  return this;

};

$.fn.enableButtons = function(className) {

  this.removeClass(className || 'form-button-disabled').attr('disabled', false);

  return this;

};

$.fn.disableButtons = function(className) {

  this.addClass(className || 'form-button-disabled').attr('disabled', true);

  return this;

};

$.fn.disableTextSelection = function() {

  $.each(this, function() {
    $(this)
      .css({ '-moz-user-select': 'none' })
      .bind('selectstart', function() { return false; });
  });

  return this;

};

$.fn.hoverToggleClass = function(className) {

  className = className || 'hover';

  this.hover(
    function() {
      $(this).addClass(className);
    },
    function() {
      $(this).removeClass(className);
    }
  );

  return this;

};

$.fn.clonePosition = function(src_obj, passed_params) {

  var params   = $.extend({
                   setWidth      : true,
                   setHeight     : true,
                   setLeft       : true,
                   setTop        : true,
                   offsetLeft    : 0,
                   offsetTop     : 0,
                   func          : 'offset',
                   factor_scroll : false
                 }, passed_params),
      offset   = src_obj[params.func](),
      cssRules = {};
      
  // using absolute position so make sure scrollbars are thought of
  if ( params.factor_scroll === true ) {
    offset.top  += Config.$document.scrollTop();
    offset.left += Config.$document.scrollLeft();
  }

  if (params.setWidth) {
    cssRules.width = src_obj.outerWidth() + 'px';
  }

  if (params.setHeight) {
    cssRules.height = src_obj.outerHeight() + 'px';
  }

  if (params.setLeft) {
    cssRules.left =  (offset.left + parseInt( params.offsetLeft, 10 )) + 'px';
  }

  if (params.setTop) {
    cssRules.top =  (offset.top + parseInt( params.offsetTop, 10 )) + 'px';
  }

  return this.css(cssRules);

};

$.fn.showMessages = function( messages, options ) {

  if ( messages ) {

    var $this      = this,
        $container = $this.find('.messages'),
        msgs       = [],
        fade       = true;

    options = options || {};
    
    fade = (typeof(options.fade) != 'undefined') ? options.fade : true;

    if ( !$container.length ) {

      $container = $('<div class="messages"></div>').hide().addClass( options.classes || '' );

      if ( options.floating && options.floating === true ) {
        $container.addClass('messages-floating');
      }

      if ( options.prepend && options.prepend === true ) {
        $container.prependTo( $this );
      }
      else {
        $container.appendTo( $this );
      }

    }

    $.each( messages, function(i, msg) {

      this.type = this.type || 'message';

      switch ( this.type ) {

        case 'error' :
        case 'message' :
        case 'success' :
          break;

        default :
          throw ('"' + this.type +'" is not a valid message type');

      } // switch type

      msgs.push('<div class="' + this.type + '"><span class="icon-status-' + this.type + ' icon sprite-site-elements"></span>' + this.message + '</div>');

    });

    $container.html( msgs.join('') ).show();
    
    if (fade) {
      $container.delay(5000).fadeOut(1000);
    }

    // if ( options.expand && options.expand === true ) {
    //   var msgHeight   = $container.height(),
    //       thisPadding = parseInt( $this.css('paddingBottom') );
    //   $this.css({ paddingBottom : thisPadding + msgHeight });
    // }

  }

  return this;

}; // showMessages

$.commaSeparate = function(data) {

  if ( !data || !data.length || typeof(data) == 'string' ) {
    return false;
  }

  var parts = [];

  $.each(data, function() {
    parts.push(this);
  });

  return parts.join(', ');

}; // commaSeparate

$.formatNumberCommas = function(nStr) {

  nStr += '';
  x = nStr.split('.');
  x1 = x[0];
  x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;

}; // formatNumberCommas

$.fn.selectNav = function(section) {

  var $this = $(this);

  $this.find('.active').removeClass('active');

  $this.find('li.nav-'+section+', li.nav-'+section+' a').addClass('active');

  return this;

}; // selectNav

$.fn.addNavInfo = function(info) {

  var $this = $(this),
      $link = ( $this.is('a') ) ? $this : $this.find('a'),
      $info = $this.find('.info');

  if ( $link.length ) {

    if ( !$info.length ) {
      $info = $('<span class="info" />').appendTo($link);
    }

    $info.html(info);

  }

  return this;

}; // addNavInfo

$.siteMessage = function(data) {

  var $tpl = $('#site-message-template');

  if ( !data || !$.isPlainObject(data) || !$tpl.length ) {
    return '';
  }

  data.header  = data.header || '';
  data.message = data.message || '';
  data.container_class = $.merge( ['site-message', 'ui-corner-all'], data.container_class || [] );

  return $tpl.template(data);

}; // siteMessage

$.prefixUrl = function( string ) {

  var url = string;
  
  if (url.indexOf('://') == -1){
    url = 'http'+'://'+url;
  } 
  
  return url;
  
};

$.uCWords = function ( string ) {

  return string.substr(0, 1).toUpperCase() + string.substr(1);

}; // uCWords

$.fn.hoverMenu = function( menuEl, passed_options) {

  passed_options = passed_options || {};
  

  return $.each( this, function( ) {
  
    var $menuEl;
  
    if ( typeof( menuEl ) == 'string') {
      if ( menuEl == 'next' ) {
        $menuEl = $(this).next();
      }
    }
    else {
      $menuEl = $(menuEl);
    }
    
    if ( typeof($menuEl) != 'object' || !$menuEl.length || typeof($menuEl.offset) != 'function' ) {
      return;
    }

    var $this       = $(this),
        coordLimits = false,
        $title      = $menuEl.find('.tooltip-title'),
        options     = $.extend( {}, { 
        
          container_position : 'static',
          alignment          : 'left',
          mode               : 'menu',
          submenu            : false,
          tolerance          : 0,
          always_refresh     : false,
          submenu_alignment  : 'right',
          vertical_alignment : 'bottom',
          submenu_top_offset : 0
          
        }, passed_options ),

    outOfToggle = function(e) {
      return (
           e.pageX < ( coordLimits.toggleLeft - options.tolerance )   ||
           e.pageX > ( coordLimits.toggleRight + options.tolerance )  ||
           e.pageY < ( coordLimits.toggleTop - options.tolerance )    ||
           e.pageY > ( coordLimits.toggleBottom + options.tolerance ) );
    },

    outOfMenu = function(e) {
     
      return (
           e.pageX < ( coordLimits.menuLeft - options.tolerance )   ||
           e.pageX > ( coordLimits.menuRight + options.tolerance )  ||
           e.pageY < ( coordLimits.menuTop - options.tolerance )    ||
           e.pageY > ( coordLimits.menuBottom + options.tolerance ) );
    },
    
    checkForSubmenu = function (m){
      return ( m.find('.hovermenu-hover').length > 0 );
    },

    closeMenu = function(e) {
    
      var o1 = outOfToggle(e),
          o2 = outOfMenu(e),
          c  = checkForSubmenu($menuEl);
          
      if ( o1 && o2 && !c ) {
          
          closeMenuAction();
          
        }

    },
    
    closeMenuAction = function() {
      $menuEl.hide();
          
      $this.removeClass('hovermenu-hover');
      Config.$body.unbind('mousemove.'+$this[0].id, closeMenu);
      $this.trigger('hovermenu.close', [ $menuEl ]);
    },

    setCoords = function() {
    
      var menuCoords      = {},
          toggleLeft      = false,
          toggleCoords    = $this.offset(),
          toggleTopBase   = ( options.container_position == 'static' ) ? $this.offset().top : 0,
          toggleTop       = ( options.vertical_alignment == 'bottom' )  ?
                            toggleTopBase  + $this.outerHeight() :
                            toggleTopBase,
          
          toggleAlignBase = ( options.container_position == 'static' ) ? 
                              $this.offset().left : 
                              $this.position().left;
             
          switch ( options.alignment ) {
          
            case 'corner_left' :
              toggleLeft = toggleAlignBase - $menuEl.outerWidth();
              break;
              
            case 'right' :
              toggleLeft = toggleAlignBase + $this.outerWidth() - $menuEl.outerWidth();
              break;
              
            case 'center' :
              toggleLeft = toggleAlignBase - ( Math.abs( $this.outerWidth() - $menuEl.outerWidth() ) / 2 );
              break;
            
            case 'left' :
              toggleLeft = toggleAlignBase;
              break;
              
            default :
              toggleLeft = toggleAlignBase;
              break;
          
          } // options.alignment
          
          if ( options.submenu === true ) { 
            
            toggleTop       = toggleTopBase + options.submenu_top_offset;
            toggleLeft      = ( options.submenu_alignment == 'right' ) ?
                              toggleAlignBase + $this.outerWidth() :
                              toggleAlignBase - $menuEl.outerWidth();
            
          } // options.submenu = true

          
          
      $menuEl.css({ left : toggleLeft + 'px', top : toggleTop + 'px' });
      
      menuCoords = $menuEl.offset();
          
      coordLimits = {
        menuLeft	   : menuCoords.left,
        menuRight	   : menuCoords.left + $menuEl.outerWidth(),
        menuTop	     : menuCoords.top,
        menuBottom   : menuCoords.top + $menuEl.outerHeight(),
        toggleLeft	 : toggleCoords.left,
        toggleRight	 : toggleCoords.left + $this.outerWidth(),
        toggleTop	   : toggleCoords.top,
        toggleBottom : toggleCoords.top + $this.outerHeight()
      };

    },

    openMenu = function() {

      $menuEl.show();
      $this.addClass('hovermenu-hover');

      if ( !coordLimits || options.always_refresh ) {
        setCoords();
      }
      
      Config.$body.bind('mousemove.'+$this[0].id, closeMenu);

      $this.trigger('hovermenu.open', [ $menuEl ]);
      
    };
    
    if ( $title.length && $title.html() == '' ) {
      $title.remove();
    }
    
    if ( options.submenu === true ){
      $this.addClass('hovermenu-has_submenu');
    }

    $this.mouseover(openMenu);

    this.setCoords   = setCoords;
    this.closeAction = closeMenuAction;

    
    $(window).bind('resize', function() {
      coordLimits = false;
      
    });
    
    if ( options.mode == 'tooltip' ) {
      $menuEl.wrapInner('<div class="tooltip-content drop-shadow" />')
             .append( $('<div class="tooltip-nub tooltip-nub-top tooltip-nub-top-image arrow" />') );
    }
    
    
    
  }); // each

};


$.fn.trackOutboundLink = function() {

  $(this).bind('click', function(){
  
    try {

      _gaq.push(['_trackEvent', 'outbound-links', $(this).attr('href')]);
      
      if( $(this).attr('target') == '_blank' ) {
        setTimeout('window.open(\''+$(this).attr('href')+'\')', 100);
      }
      else {
        setTimeout('window.location=\''+$(this).attr('href')+'\')',100);
      }
      
    } catch(err){}
    
    return false;    
    
  });

};

Utils.updateStylesheet = function(style, style_value) {

  if ($.browser.msie) {

    // without this line, IE WILL crash, if no stylesheet settings were set
    if ( typeof(style_value) != 'string' || !style_value.length) {
      return;
    }
    style.styleSheet.cssText = style_value;

  }
  else {
    style.innerHTML = style_value;
  }

}; // updateStylesheet

Utils.getStylesheet = function( style ) {

  if ($.browser.msie) {
    return style.styleSheet.cssText;
  }
  else {
    return style.innerHTML;
  }

}; // getStylesheet