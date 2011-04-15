/*
 * TODOS
 * fakeDirtyForm
*/
TE = {

  VALID_RULES       : ['color','fontWeight','fontStyle','textDecoration','fontFamily','lineHeight','fontSize','backgroundColor','textAlign'],
  yeditor           : false,
  $els              : false,
  window            : false,
  $doc              : false,
  $body             : false,
  $head             : false,
  $frame_container  : false,
  $editor_container : false,
  updating_toolbar  : false,
  bg_selector       : false,
  styles_base       : '',
  min_buffer        : 60,
  min_height        : 122,
  rendered          : false,
  content           : '',
  drag_containment  : false,
  last_node_e       : false,

  init : function( frame_container, options ) {

    var yui_options = {
        filter: true,
        combine: false
    };

    if ( !frame_container ) {
      throw ('Frame container required');
    }

    options = options || {};

    if ( options.styles_base ) {
      TE.styles_base = options.styles_base;
    }

    TE.drag_containment = ( options.drag_containment ) ? options.drag_containment : $('body');

    if ( options.content ) {
      TE.content = options.content;
    }

    YUI(yui_options).use('editor-base', function(Y) {

      var editor = new Y.EditorBase({
          content: TE.content
      });


      //Add the BiDi plugin
      editor.plug(Y.Plugin.EditorBidi);

      editor.on( 'nodeChange', TE._nodeChange );

      //Rendering the Editor.
      editor.render( frame_container );

      TE.$frame_container  = $(frame_container);
      TE.$editor_container = TE.$frame_container.parent();

      editor.on('frame:ready', function( e ) {

        TE.window = TE.$frame_container.find('iframe')[0].contentWindow;
        TE.$doc   = $(TE.window.document );
        TE.$head  = $( TE.window.document.getElementsByTagName('head')[0] );
        TE.$body  = $( TE.window.document.getElementsByTagName('body')[0] );

        // add our stylesheet
        var head  = TE.$head[0],
            newSS = false;

        newSS      = document.createElement('link');
        newSS.rel  = 'stylesheet';
        newSS.href = TE.styles_base + 'texteditor-frame.css?' + Config.CBSTR;
        newSS.type = 'text/css';
        head.appendChild( newSS );

        TE.$head.find('#editor_css').remove();

        // make toolbar correct
        TE._nodeChange( { changedType : 'mouseup' }, TE.$body[0] );

        TE.resize();

        TE.rendered = true;

        TE.$frame_container.trigger( 'texteditor.rendered' );

        if ( $.browser.opera ) {

          $('.texteditor-toolbar-container').html('Your browser is not currently supported for text editing. Please try <a href="http://www.firefox.com" target="_blank">Firefox</a>, <a href="http://www.google.com/chrome" target="_blank">Chrome</a>, or <a href="http://www.apple.com/safari/" target="_blank">Safari</a> for a better experience.').css({'color':'#FFFFFF','background':'#000000','text-align':'center'});
          $('.texteditor-toolbar-container a').css('color','#0086FF');
          return;

        }

        $.each( TE.Controls, function( index ) {

          TE.Controls[ index ]._init();

        });



      });

      TE.yeditor = editor;

      if ( typeof CleanPaste !== 'undefined' ) {
        new CleanPaste( editor );
      }

    }); // YUI use editor-base

    // prevent a's from going anywhere, using a's so IE doesn't lose focus of RTE
    $('.texteditor-toolbar-button').bind( 'click', function( e ) {
      return false;
    });

  }, // init

  // gets populated outside of editor
  Fonts : {
   "CSS":{
      "adelle-web":"adelle-1,Georgia,\"Times New Roman\",serif",
      "arial":"arial,helvetica,sans-serif",
      "arial-black":"\"arial black\",gadget,sans-serif",
      "bookman-old-style":"\"bookman old style\",\"bookman old\"",
      "brandon-grotesque":"BrandonGrotesque,helvetica,arial,sans-serif",
      "century-schoolbook":"\"century schoolbook\",georgia,sans-serif",
      "garamond":"garamond,serif",
      "georgia":"georgia,\"times new roman\",times,serif",
      "helvetica":"helvetica,arial,sans-serif",
      "marseille":"Marseille,Georgia,\"Times New Roman\",serif",
      "proxima-nova":"proxima-nova-1,helvetica,arial,sans-serif",
      "sommet-slab":"SommetSlab,Georgia,\"Times New Roman\",serif",
      "tahoma":"tahoma,geneva,sans-serif",
      "times-new-roman":"\"times new roman\",times,georgia,serif",
      "trebuchet":"\"trebuchet ms\",helvetica,sans-serif",
      "verdana":"verdana,geneva,sans-serif"
   },
   "LABELS":{
      "adelle-1,Georgia,\"Times New Roman\",serif":"Adelle Web",
      "arial,helvetica,sans-serif":"Arial",
      "\"arial black\",gadget,sans-serif":"Arial Black",
      "\"bookman old style\",\"bookman old\"":"Bookman Old Style",
      "BrandonGrotesque,helvetica,arial,sans-serif":"Brandon Grotesque",
      "\"century schoolbook\",georgia,sans-serif":"Century Schoolbook",
      "garamond,serif":"Garamond",
      "georgia,\"times new roman\",times,serif":"Georgia",
      "helvetica,arial,sans-serif":"Helvetica",
      "Marseille,Georgia,\"Times New Roman\",serif":"Marseille",
      "proxima-nova-1,helvetica,arial,sans-serif":"Proxima Nova",
      "SommetSlab,Georgia,\"Times New Roman\",serif":"Sommet Slab",
      "tahoma,geneva,sans-serif":"Tahoma",
      "\"times new roman\",times,georgia,serif":"Times New Roman",
      "\"trebuchet ms\",helvetica,sans-serif":"Trebuchet",
      "verdana,geneva,sans-serif":"Verdana"
   },
   "STYLE_FONT_TITLES":{
      "12":"Adelle Web",
      "1":"Arial",
      "5":"Arial Black",
      "6":"Bookman Old Style",
      "14":"Brandon Grotesque",
      "7":"Century Schoolbook",
      "8":"Garamond",
      "4":"Georgia",
      "16":"Helvetica",
      "11":"Marseille",
      "13":"Proxima Nova",
      "15":"Sommet Slab",
      "9":"Tahoma",
      "3":"Times New Roman",
      "10":"Trebuchet",
      "2":"Verdana"
   },
   "STYLE_FONT_CSS":{
      "1":"arial,helvetica,sans-serif",
      "2":"verdana,geneva,sans-serif",
      "3":"\"times new roman\",times,georgia,serif",
      "4":"georgia,\"times new roman\",times,serif",
      "5":"\"arial black\",gadget,sans-serif",
      "6":"\"bookman old style\",\"bookman old\"",
      "7":"\"century schoolbook\",georgia,sans-serif",
      "8":"garamond,serif",
      "9":"tahoma,geneva,sans-serif",
      "10":"\"trebuchet ms\",helvetica,sans-serif",
      "11":"Marseille,Georgia,\"Times New Roman\",serif",
      "12":"adelle-1,Georgia,\"Times New Roman\",serif",
      "13":"proxima-nova-1,helvetica,arial,sans-serif",
      "14":"BrandonGrotesque,helvetica,arial,sans-serif",
      "15":"SommetSlab,Georgia,\"Times New Roman\",serif",
      "16":"helvetica,arial,sans-serif"
   },
   "STYLE_FONT_CSS_REVERSE":{
      "arial,helvetica,sans-serif":1,
      "verdana,geneva,sans-serif":2,
      "\"times new roman\",times,georgia,serif":3,
      "georgia,\"times new roman\",times,serif":4,
      "\"arial black\",gadget,sans-serif":5,
      "\"bookman old style\",\"bookman old\"":6,
      "\"century schoolbook\",georgia,sans-serif":7,
      "garamond,serif":8,
      "tahoma,geneva,sans-serif":9,
      "\"trebuchet ms\",helvetica,sans-serif":10,
      "Marseille,Georgia,\"Times New Roman\",serif":11,
      "adelle-1,Georgia,\"Times New Roman\",serif":12,
      "proxima-nova-1,helvetica,arial,sans-serif":13,
      "BrandonGrotesque,helvetica,arial,sans-serif":14,
      "SommetSlab,Georgia,\"Times New Roman\",serif":15,
      "helvetica,arial,sans-serif":16
   },
   "STYLE_FONT_TYPES":{
      "1":50,
      "2":50,
      "3":50,
      "4":50,
      "5":50,
      "6":50,
      "7":50,
      "8":50,
      "9":50,
      "10":50,
      "16":50,
      "11":70,
      "12":60,
      "13":60,
      "14":70,
      "15":70
   },
   "STYLE_FONT_WEIGHTS":{
      "11":{
         "400":"Regular",
         "600":"Bold"
      },
      "12":{
         "100":"Light",
         "400":"Regular",
         "600":"Bold"
      },
      "13":{
         "400":"Regular",
         "600":"Semibold",
         "700":"Bold"
      },
      "14":{
         "400":"Regular",
         "600":"Bold"
      },
      "15":{
         "400":"Regular",
         "700":"Black"
      }
   },
   "FONT_VARIANT_HASHES":{
      "11":{
         "400":{
            "1":"webfont4aYdBWSW",
            "2":"webfont9YqVWKul"
         },
         "600":{
            "1":"webfontmt4nw9iE",
            "2":"webfontEujVuBF3"
         }
      },
      "14":{
         "400":{
            "1":"webfontdt2bRn5z",
            "2":"webfont3hkZ3wgA"
         },
         "600":{
            "1":"webfonthXTrOi9X",
            "2":"webfontItRvnTYD"
         }
      },
      "15":{
         "400":{
            "1":"webfont12VAVz9E",
            "2":"webfontiFd5IMwh"
         },
         "700":{
            "1":"webfontKW71hy0j",
            "2":"webfontwt0ndGek"
         }
      },
      "13":{
         "400":{
            "1":"jnq2gyl",
            "2":"shg8ttt"
         },
         "600":{
            "1":"ocm4vid",
            "2":"cfn7him"
         },
         "700":{
            "1":"bgr5szw",
            "2":"wvx7yqn"
         }
      },
      "12":{
         "100":{
            "1":"dvb3iss",
            "2":"cnb0rph"
         },
         "400":{
            "1":"fqn2sma",
            "2":"sxq6klt"
         },
         "600":{
            "1":"xic1ssw",
            "2":"ahw1exg"
         }
      }
   },
   "WEB_FONTS":{
      "11":"Marseille",
      "14":"BrandonGrotesque",
      "15":"SommetSlab"
   },
   "WEB_FONT_URLS":{
      "11":{
         "400":{
            "1":"Marseille/Marseille-Regular-webfont",
            "2":"Marseille/Marseille-Italic-webfont"
         },
         "600":{
            "1":"Marseille/Marseille-Bold-webfont",
            "2":"Marseille/Marseille-BoldItalic-webfont"
         }
      },
      "14":{
         "400":{
            "1":"BrandonGrotesque/Brandon-Regular",
            "2":"BrandonGrotesque/Brandon-Italic"
         },
         "600":{
            "1":"BrandonGrotesque/Brandon-Bold",
            "2":"BrandonGrotesque/Brandon-BoldItalic"
         }
      },
      "15":{
         "400":{
            "1":"SommetSlab/SommetSlab-Regular",
            "2":"SommetSlab/SommetSlab-Italic"
         },
         "700":{
            "1":"SommetSlab/SommetSlab-Black",
            "2":"SommetSlab/SommetSlab-BlackItalic"
         }
      }
   },
   "FONT_DEFAULT":1,
   "FONT_TYPE_REGULAR":50,
   "FONT_TYPE_TYPEKIT":60,
   "FONT_TYPE_FONTSPRING":70,
   "FONT_NORMAL":1,
   "FONT_ITALIC":2

  },

  Controls : {

    LineHeight : {

      property : 'line-height',

      CSS : {
        '1'  : '1.40em',
        '2'  : '1.45em',
        '3'  : '1.50em',
        '4'  : '1.55em',
        '5'  : '1.60em',
        '6'  : '1.70em',
        '7'  : '1.80em',
        '8'  : '1.90em',
        '9'  : '2.00em',
        '10' : '2.20em'
      },

      LABELS : {
        '1.40'  :   '1',
        '1.45'  :   '2',
        '1.50'  :   '3',
        '1.55'  :   '4',
        '1.60'  :   '5',
        '1.70'  :   '6',
        '1.80'  :   '7',
        '1.90'  :   '8',
        '2.00'  :   '9',
        '2.20'  :   '10'
      },

      $control : false,

      _init : function() {

        var LineHeight = this,
            first      = false;

        this.$control = $('#texteditor-lineheight');

        if ( !this.$control.length ) {
          return;
        }

        this.$control.selectmenu('destroy');

        this.$control.html('');

        $.each( this.CSS, function( display, css ) {

          LineHeight.$control.append( $('<option class="form-option" value="' + css + '">' + display + '</option>') );

          if ( first === false ) {
            first = css;
          }

        });

        this.$control.changeInput( 'val', first );

        this.$control.selectmenu()
                     .bind( 'change', this._update )
                     .bind( 'keyup', this._update );


        $('#texteditor-lineheight-button').removeClass('ui-corner')
                                          .removeClass('ui-corner-all');

      }, // _init

      // this is its own function because it's a select, so it's fired from keyup or change
      _update : function( e ) {

        if ( TE.updating_toolbar === true ) {
          return;
        }

        TE._modifyNodes( 'LineHeight' );

      }, // _update

      // function fired from within modifyNodes
      _setValue : function( el, value ) {

        value = ( typeof value !== 'undefined' ) ? value : this.$control.val();

        TE._updateInlineStyle( el, this.property, value );

      }, // _setValue

      _getEm : function( css_line_height, size ){

        var line_height;

        if ( css_line_height === 'normal' ) {
          css_line_height = '1.40em';
        }

        if ( css_line_height.match('px') ) {

          line_height = css_line_height.replace('px','');
          line_height = parseFloat(line_height.replace('px',''));

          if ( line_height < 16 ){
            line_height = 16;
          }

          size        = parseInt(size, 10);
          line_height = line_height / size;
        }
        else if ( css_line_height.match('em') ) {

          line_height = css_line_height.replace('em','');
          line_height = parseFloat(line_height.replace('em',''));
          if (line_height < 1.4){
            line_height = 1.4;
          }
        }
        else {
          throw ( "Unknown measurement: " + css_line_height );
        }

        // Rounding to the nearest 0.05
        line_height = Math.round(line_height*20.0) / 20.0;


        // if text did not exist in webkit, it will say the line height is 0.01
        if ( line_height < 1.4 ) {
          line_height = 1.4;
        }
        if ( line_height > 2.2 ) {
          line_height = 2.2;
        }

        line_height = line_height.toFixed(2);

        return line_height;

      } // _getEm

    }, // LineHeight

    FontSize : {

      property : 'font-size',

      $control : false,

      _init : function() {

        var FontSize = this;

        this.$control = $('#texteditor-fontsize');

        if ( !this.$control.length ) {
          return;
        }

        this.$control.selectmenu('destroy');


        this.$control.selectmenu()
                     .bind( 'change', this._update )
                     .bind( 'keyup', this._update );

        $('#texteditor-fontsize-button').removeClass('ui-corner')
                                        .removeClass('ui-corner-all');

      }, // _init

      // this is its own function because it's a select, so it's fired from keyup or change
      _update : function( e ) {

        if ( TE.updating_toolbar === true ) {
          return;
        }

        TE._modifyNodes( 'FontSize' );

      }, // _update

      // function fired from within modifyNodes
      _setValue : function( el, value ) {

        value = ( typeof value !== 'undefined' ) ? value : this.$control.val();
        TE._updateInlineStyle( el, this.property, value );

      } // _setValue

    }, // FontSize

    ForeColor : {

      cp : false,

      last_hex : false,

      $control : false,

      property : 'color',

      _init : function() {

        this.$control = $('#texteditor-forecolor');

        if ( !this.$control.length ) {
          return;
        }

        var ForeColor = this;

        $('body').append('<div id="texteditor-forecolor-swatch">');

        this.$control.bind( 'click', function() {

          TE.$els = ( TE.$els !== false ) ?
                    TE.$els :
                    TE._createEl( 'span' );

          ForeColor.cp.targetElm = TE.$els;

          $('#texteditor-forecolor-swatch').trigger('click');

        });

        this.cp = Utils.ColorPickers.add('texteditor-forecolor-swatch', {
          targetElm      : $('body'), // dummy for now
          targetProperty : this.property,

          getPopUpPosition : function(e) {

            $('#colorpicker').show().clonePosition( ForeColor.$control, {setWidth:false,setHeight:false});

          }

        });

        this.cp.swatch.bind('colorpicker.open', function(e, cp, hex) {
          $('body').append( $('<div id="color-blocker" style="position: absolute; top: 0px; left: 0px; width: 100%; height: '+$('body').outerHeight()+'px; z-index: 1;"></div>') );
        })
        .bind( 'colorpicker.close', function(e, cp, hex) {
          $('#color-blocker').remove();
        })
        .bind( 'colorpicker.update', this._update )
        .bind( 'colorpicker.revert', this._update );

      },

      // this is its own function because it's a colorpicker, so it's fired from update or revert
      _update : function( e, cp, hex ) {

        TE.Controls.ForeColor.last_hex = hex;

        TE._modifyNodes( 'ForeColor' );

        TE._correctListColors();

      }, // _update

      // function fired from within modifyNodes
      _setValue : function( el, value ) {

        value = ( typeof value !== 'undefined' ) ? value : '#' + this.last_hex;

        TE._updateInlineStyle( el, this.property, value );

      } // _setValue

    }, // ForeColor

    BackColor : {

      property : 'background-color',
      cp : false,
      last_hex : false,

      $control : false,

      _init : function() {

        this.$control = $('#texteditor-backcolor');

        if ( !this.$control.length ) {
          return;
        }

        var BackColor    = this,
            opened_color = false;

        $('body').append('<div id="texteditor-backcolor-swatch">');

        this.$control.bind( 'click', function() {

          TE.$els = ( TE.$els !== false ) ?
                    TE.$els :
                    TE._createEl( 'span' );

          BackColor.cp.targetElm = TE.$els;

          $('#texteditor-backcolor-swatch').trigger('click');

        });


        this.cp = Utils.ColorPickers.add('texteditor-backcolor-swatch', {
          targetElm           : $('body'), // dummy for now
          targetProperty      : this.property,
          transparentFallback : 'transparent',
          getPopUpPosition : function(e) {

            $('#colorpicker').show().clonePosition( BackColor.$control, {setWidth:false,setHeight:false});

          }

        });

        this.cp.swatch.bind('colorpicker.open', function(e, cp, hex) {
          opened_color = hex;
          $('body').append( $('<div id="color-blocker" style="position: absolute; top: 0px; left: 0px; width: 100%; height: '+$('body').outerHeight()+'px; z-index: 1;"></div>') );
        })
        .bind( 'colorpicker.close', function(e, cp, hex) {
          $('#color-blocker').remove();
        })
        .bind('transparentFallback', function() {

          var selector = ( TE.bg_selector ) ? TE.bg_selector : TE.$frame_container,
              bg       = $(selector).css('background-color');

          bg = ( bg === 'transparent' ) ? 'FFFFFF' :
                Utils.Colors.rgbString2hex( $(selector).css('background-color') );

          $('#colorpicker-input').val( bg );
          BackColor.cp.updateFromFieldValue();
          opened_color =  $(selector).css('background-color');

        })
        .bind( 'colorpicker.update', this._update )
        .bind( 'colorpicker.revert', function( e, cp, hex ) {
          BackColor._update( e, cp, opened_color );
        });

      },

      // this is its own function because it's a colorpicker, so it's fired from update or revert
      _update : function( e, cp, hex ) {

        TE.Controls.BackColor.last_hex = hex;

        TE._modifyNodes( 'BackColor' );

      }, // _update

      // function fired from within modifyNodes
      _setValue : function( el, value ) {

        if ( typeof value === 'undefined' ) {
          value = ( this.last_hex === 'transparent' ) ? this.last_hex : '#' + this.last_hex;
        }

        TE._updateInlineStyle( el, this.property, value );

      } // _setValue

    }, // BackColor

    RemoveFormat : {

      $control : false,

      _init : function() {

        this.$control = $('#texteditor-removeformat');

        if ( !this.$control.length ) {
          return;
        }


        this.$control.bind( 'click', function( e ) {

          if ( !$.browser.msie ) {
            TE.yeditor.execCommand( 'removeformat' );
            return;
          }

          // IE has bug against cleaning spans
          TE.$els = TE._createEl( 'span', {} );
          TE.$els.addClass('test');

          TE.$els.each( function() {

            $(this).find('span').each( function() {

              $(this).before( this.innerHTML );
              $(this).remove();

            });

            $(this).before(this.innerHTML);
            $(this).remove();

          });


          TE.$els = false;

        });

      }

    }, // RemoveFormat

    SuperFontName : {

      $control : false,

      _init : function() {

        this.$control = $('#texteditor-superfontname');

        if ( !this.$control.length ) {
          return;
        }

        this.$control.selectmenu()
                     .bind( 'change', this._update )
                     .bind( 'keyup', this._update );

        $('#texteditor-superfontname-button').removeClass('ui-corner')
                                             .removeClass('ui-corner-all');

      },

      // this is its own function because it's a select, so it's fired from keyup or change
      _update : function( e ) {

        if ( TE.updating_toolbar === true ) {
          return;
        }

        TE._modifyNodes( 'SuperFontName' );

      }, // _update

      // function fired from within modifyNodes
      _setValue : function( el, value ) {

        value = ( typeof value !== 'undefined' ) ? value : this.$control.val().split(',');

        var font_id         = value[0],
            bold            = value[1],
            italic          = value[2],
            css             = TE.Fonts.STYLE_FONT_CSS[ font_id ],
            weight          = ( typeof bold === 'string' ) ? bold : bold.toString(),
            italic_constant = ( italic === 'italic' ) ?  TE.Fonts.FONT_ITALIC: TE.Fonts.FONT_NORMAL;

        if ( TE.Fonts.STYLE_FONT_WEIGHTS[ font_id ] ) {
          this._loadFont( font_id, weight, italic_constant );
        }

        TE._updateInlineStyle( el, 'font-family', css );
        TE._updateInlineStyle( el, 'font-weight', weight );
        TE._updateInlineStyle( el, 'font-style', italic );

      }, // _setValue

      _loadFont : function( selected_font, special_weight, special_italic ) {

        var file,
            typekitLoaded = function( data, info ) {

              var frame_window = TE.window,
                  frame_head   = TE.$head[0];

              if ( typeof Typekit === 'undefined' ) {
                setTimeout( function() {
                  typekitLoaded( data, info );
                }, 10 );
                return;
              }

              try {
                Typekit.load();

              }catch(e) {
                console.log('Failed to load kit: ', e );
              }

            }, // typekitLoaded

            getBaseName = function( file ) {

              return file.replace( /.+\/([^\.]+)/, "$1" ).replace(/(.*)\.[^.]+$/,"$1");

            },

            getScriptId = function( file ) {

              return getBaseName( file ) + '-script';

            },

            getStylesheetId = function( file ) {

              return getBaseName( file ) + '-stylesheet';

            };

        switch ( TE.Fonts.STYLE_FONT_TYPES[ selected_font ] ) {

          case TE.Fonts.FONT_TYPE_TYPEKIT :

            // DESIGN MODE IFRAMES CANT RUN JS FOR SECURITY REASONS

            break;

          case TE.Fonts.FONT_TYPE_FONTSPRING :


            file = TE.Fonts.WEB_FONT_URLS[ selected_font ][ special_weight ][ special_italic ];

            if ( !file ) {
              console.log("Failed finding web font url: ", selected_font, special_weight, special_italic );
            }

            try {
              Loader.load([{
                file        : '/assets/css/fonts/' + file +'.css',
                type        : 'stylesheet',
                callback_ajax_complete : function() {

                  var x = document.getElementById( getStylesheetId( file ) ).cloneNode(true);

                  TE.$head.append( x );
                }
              }]);
            }
            catch ( e ) {
              console.log( e );
            }


            break;

          default :
            console.log("Unknown special type: ", TE.Fonts.STYLE_FONT_TYPES[ selected_font ] );
            break;

        } // switch style_font_types

      } // _loadFont

    }, // SuperFontName

    Undo : {

      $control : false,

      _init : function() {

        this.$control = $('#texteditor-undo');

        if ( !this.$control.length ) {
          return;
        }

        this.$control.bind( 'click', function() {
          TE.yeditor.execCommand( 'undo' );
        });

      }

    }, // Undo

    Redo : {

      $control : false,

      _init : function() {

        this.$control = $('#texteditor-redo');

        if ( !this.$control.length ) {
          return;
        }

        this.$control.bind( 'click', function() {
          TE.yeditor.execCommand( 'redo' );
        });

      }

    }, // Redo

    OrderedList : {

      $control : false,

      _init : function() {

        var OrderedList = this;

        this.$control = $('#texteditor-insertorderedlist');

        if ( !this.$control.length ) {
          return;
        }

        this.$control.bind( 'click', function() {
          TE.yeditor.execCommand( 'insertorderedlist' );
          OrderedList.$control.toggleClass('ui-state-active');

          // can't be two types of lists at once
          if ( OrderedList.$control.hasClass('ui-state-active') ) {
            TE.Controls.UnorderedList.$control.removeClass('ui-state-active');
          }

          TE._correctListColors();

        });

      }

    }, // OrderedList

    UnorderedList : {

      $control : false,

      _init : function() {

        var UnorderedList = this;

        this.$control = $('#texteditor-insertunorderedlist');

        if ( !this.$control.length ) {
          return;
        }

        this.$control.bind( 'click', function() {
          TE.yeditor.execCommand( 'insertunorderedlist' );
          UnorderedList.$control.toggleClass('ui-state-active');

          // can't be two types of lists at once
          if ( UnorderedList.$control.hasClass('ui-state-active') ) {
            TE.Controls.OrderedList.$control.removeClass('ui-state-active');
          }

          TE._correctListColors();

        });

      }

    }, // UnorderedList

    Alignment : {

      $controls : false,
      property  : 'text-align',

      _init : function() {

        var Alignment = this;

        this.$controls = $('.texteditor-toolbar-button-alignment');

        if ( !this.$controls.length ) {
          return;
        }

        this.$controls.bind( 'click', function() {

          Alignment.$controls.removeClass('ui-state-active');
          $(this).addClass('ui-state-active');
          TE._modifyNodes( 'Alignment' );

        });

      }, // _init

      _setValue : function( el, value ) {

        value = ( typeof value !== 'undefined' ) ? value : this.$controls.filter('.ui-state-active').attr('alignment');

        TE._updateInlineStyle( el, this.property, value );
        TE._setDisplay( el );

      } // setValue

    }, // Alignment

    Margins : {

      $controls : false,
      property  : 'margin-left',

      _init : function() {

        var Margins = this;

        this.$controls = $('.texteditor-toolbar-button-margins');

        if ( !this.$controls.length ) {
          return;
        }

        this.$controls.bind( 'click', function() {

          Margins.$controls.removeClass('ui-state-active');
          $(this).addClass('ui-state-active');
          TE._modifyNodes( 'Margins' );

        });

      }, // _init

      _setValue : function( el, value ) {

        var direction   = false,
            margin_left = $(el).css('margin-left');



        if ( margin_left === 'auto' ) {
          margin_left = 0;
        }
        else {
          margin_left = parseInt( margin_left, 10 );
        }

        if ( typeof value === 'undefined' ) {

          direction = this.$controls.filter('.ui-state-active').attr('direction');

          switch ( direction ) {
            case 'in' :
              margin_left = margin_left + 15;
              if ( margin_left >= 150 ) {
                margin_left = 150;
              }
              break;
            case 'out' :
              margin_left = margin_left - 15;
              if ( margin_left <= 0 ) {
                margin_left = 0;
              }
              break;

          } // switch direction

        } // typeof value === 'undefined'

        TE._updateInlineStyle( el, this.property, margin_left+'px' );
        TE._setDisplay( el );

        this.$controls.filter('.ui-state-active').removeClass('ui-state-active');

      } // setValue

    }, // Margins

    ClassName : {

      VALID_CLASSES : ['free-text','title','sub-title','main-text','caption','link'],

      $control : false,

      _init : function() {

        this.$control = $('#texteditor-classname');

        if ( !this.$control.length ) {
          return;
        }

        this.$control.selectmenu()
                     .bind( 'change', this._update )
                     .bind( 'keyup', this._update );

        $('#texteditor-classname-button').removeClass('ui-corner')
                                         .removeClass('ui-corner-all');

      }, // init

      // this is its own function because it's a select, so it's fired from keyup or change
      _update : function( e ) {

        if ( TE.updating_toolbar === true ) {
          return;
        }

        TE._modifyNodes( 'ClassName' );

      }, // _update

      // function fired from within modifyNodes
      _setValue : function( el, value ) {

        value = ( typeof value !== 'undefined' ) ? value : this.$control.val();

        var prop = false,
            removeStyles = function() {

              for ( prop in this.style ) {

                if ( $.inArray( prop, TE.VALID_RULES ) >= 0 ) {
                  this.style[prop] = '';
                }

              } // for prop

              if ( !el.style.marginLeft || parseInt( el.style.marginLeft, 10 ) === 0 ) {
                this.style.display = '';
              }

            }; // removeStyles

        el.className = value;

        // remove styles that relate to the font look  ( not margin or centering )
        $(el).find('span').andSelf().each( removeStyles );

        // set to no class
        if ( !value || value === '') {

          if ( el.getAttribute('class') ) {
            el.removeAttribute('class');
          }

          // no text or classname so remove span
          if ( !el.style.cssText ) {
            this.removeParent(el);
          }

        } // params == ''
        // setting a class
        else {

          if ( !el.style.cssText ) {
            el.removeAttribute('style');
          }

        } // else

      } // _setValue

    }, // ClassName

    CreateLink : {

      $control : false,

      _init : function() {

        var CreateLink = this,
            open = function( e ) {

              var CreateLink    = TE.Controls.CreateLink,
                  orig_html     = TE.$body.html(),
                  $link         = false,
                  link          = false,
                  color         = false,
                  size          = false,
                  $url_field    = false,
                  $color_field  = false,
                  link_orig     = {},        // object populates with createlink values to save if cancel
                  picker        = false,
                  $pop          = false,
                  inStyles      = false,
                  $my_color     = false,

                  updatePicker = function( e, cp, hex ) {

                    setColor( color+' !important ' );
                    $color_field[0].value = '#'+hex;

                  }, // updatePicker

                  set = function() {

                    var url    = $.prefixUrl( $url_field[0].value );
                        color  = Utils.Colors.checkHex( $my_color.css('background-color') );

                    link.setAttribute('href',url);
                    link.setAttribute('target','_blank');

                    setColor( color+' !important ' );

                  }, // set

                  // can't be inline since we want to do important here
                  setColor = function ( param ) {

                    var oldCss = link.style.cssText, newCss;

                    if (oldCss === '') {
                      link.style.cssText = (param !== '') ? 'color: ' + param + ' ;' : '';
                    } else {
                      // make sure it won't overwrite background-color
                      newCss = oldCss.replace(/[^\-]color:[^;]+;/,'').replace(/^color:[^;]+;/,'');
                      newCss = (param !== '') ? newCss + ' color: ' + param + ' ;' : newCss;
                      link.style.cssText = newCss;
                    }

                  }, // setColor

                  close = function() {

                    $pop.popup('destroy');
                    TE._enableToolbar( link );

                  }, // close

                  save = function( e ) {

                    if (document.getElementById('createlink_url').value === '') {
                      TE._removeNode( link );
                    }
                    else {
                      set();
                    }

                    close();

                  }, // save

                  cancel = function( e ) {

                    if (typeof( link_orig.url ) === 'undefined' || link_orig.url === '' ) {
                      TE.$body.html( orig_html );
                    }
                    else {
                      $url_field[0].value   = link_orig.url;
                      $color_field[0].value = link_orig.color;
                    }

                    set();
                    close();

                  }; // cancel


              $pop = $('<div />').popup({
                                    input       : $('#edit-link-template').template({}),
                                    innerClass  : 'editor-link-popup ui-corner drop-shadow editor-popup-widget',
                                    draggable   : true,
                                    outerDiv    : false
                                  })
                                  .draggable({
                                    containment : TE.drag_containment,
                                    handle      : '.editor-link-popup'
                                  });



              $('#popup-confirm').bind( 'click', save );
              $('#popup-cancel').bind( 'click', cancel );

              $url_field   = $('#createlink_url');
              $color_field = $('#createlink_color');
              $my_color    = $('#mycolor');


              if ( TE.last_node_e && TE.last_node_e.changedNode._node.tagName === 'A' ) {
                TE.$els = $( TE.last_node_e.changedNode._node );
              }
              else {
                TE.$els = TE._createEl('a');
              }

              if ( TE.$els.html() === '' ) {
                TE.$els.html('[new link]');
              }

              $link = TE.$els.first();
              link  = $link[0];

              if ( link.getAttribute('href') ) {

                color                 = Utils.Colors.checkHex( link.style.color );
                size                  = link.style.fontSize;
                size                  = size.replace('px','');
                $url_field[0].value   = link.getAttribute('href');
                $color_field[0].value = color;

                link_orig = {
                  url   : $url_field.val(),
                  color : $color_field.val()
                };

              }
              else {

                inStyles = TE._getInheritedStyles( link );
                TE._setFromInheritedStyles( link, inStyles );

              }

              TE._disableToolbar();

              picker = Utils.ColorPickers.add('mycolor', {

                targetElm        : $link,
                targetProperty   : 'color',
                getPopUpPosition : function(e) {

                  var pos     = $my_color.offset(),
                      h_width = $my_color.width(),
                      left    = ( pos.left + 10 + h_width );

                  // if the color picker is going to go off screen, move to left instead of right
                  if ( ( left+picker.cp_width ) > $(window).width() )  {
                    left = ( pos.left - 10 - picker.cp_width );
                  }

                  this.control.popUp.css({top:pos.top+'px',left:left+'px',display:'block'});

                } // getPopUpPosition

              }); // picker = Utils.ColorPickers.add


              picker.swatch.bind('colorpicker.update', updatePicker )
                           .bind('colorpicker.update', updatePicker )
                           .bind('colorpicker.revert', updatePicker );

              $(document).trigger( 'texteditor.linkopen' );

            }; // open

        this.$control = $('#texteditor-createlink');

        if ( !this.$control.length ) {
          return;
        }

        TE.$body.delegate( 'a','dblclick', open );
        this.$control.bind( 'click', open );

      } // _init

    }, // CreateLink

    RemoveLink : {

      $control : false,

      _init : function() {

        var RemoveLink = this,
            getParentLinks = function() {
              return $(TE.last_node_e.changedNode._node).closest('a');
            }; // getParentLinks

        this.$control = $('#texteditor-removelink');

        if ( !this.$control.length ) {
          return;
        }

        this.$control.bind( 'click', function( e ) {

          if ( RemoveLink.$control.hasClass('ui-state-disabled') ) {
            return false;
          }

          TE._removeNode( getParentLinks()[0] );

          RemoveLink.$control.addClass('ui-state-disabled');

        });

      } // _init

    }, // RemoveLink

    Underline : {

      property : 'text-decoration',

      $control : false,

      _init : function() {

        this.$control = $('#texteditor-underline');

        if ( !this.$control.length ) {
          return;
        }

        var Underline = this;

        this.$control.bind( 'click', function() {

          Underline.$control.toggleClass('ui-state-active');
          TE._modifyNodes( 'Underline' );

        });

      }, // _init

      // function fired from within modifyNodes
      _setValue : function( el, value ) {

        var Underline     = this,
            parent        = false,
            sibling_value = false,
            children      = false,
            child_len     = false,
            child         = false,
            c             = 0;


        if ( typeof value === 'undefined' ) {
          value = ( this.$control.hasClass('ui-state-active') ) ? 'underline' : 'none';
        }

        if ( value === 'underline' ) {
          TE._updateInlineStyle( el, this.property, value );
          return;
        }

        parent        = el.parentNode;
        children      = parent.childNodes;
        child_len     = children.length;
        sibling_value = ( parent.style.textDecoration &&
                              parent.style.textDecoration === 'underline' ) ? 'underline' : '';

        for ( c; c< child_len;++c ) {

          child = children[c];

          if ( child.nodeType === 3 ) {

            $(child).wrap( document.createElement('span') );
            TE._updateInlineStyle( child.parentNode, Underline.property, sibling_value );
            children = parent.childNodes;
            --c;

          }
          else if ( child === el ) {
            TE._updateInlineStyle( el, Underline.property, value );
          }
          else {
            TE._updateInlineStyle( child, Underline.property, sibling_value );
          }

        } // for c

        if ( value === 'none' ) {
          TE._updateInlineStyle( parent, this.property, '' );
        }


      } // _setValue

    } // Underline

  }, // Controls

  resetSize : function( new_height, new_buffer ) {

    this.min_height = new_height;
    this.min_buffer = new_buffer;

    new_height = this.min_height + this.min_buffer;

    TE.$frame_container[0].style.height = new_height+'px';

  }, // resetSize

  resize : function() {

    var height      = TE.$frame_container.height(),
        body_height = ( $.browser.mozilla ) ? TE.$body.height() : TE.$body[0].scrollHeight, // only mozilla can auto-shrink
        new_height  = ( body_height > TE.min_buffer ) ? body_height : height;

    if ( $.browser.msie && $.browser.version > 7 ) {
      new_height = new_height - 20;
    }

    if ( height !== new_height ) {

      new_height += this.min_buffer;

      if ( height !== new_height ) {

        TE.$frame_container[0].style.height = new_height+'px';
        TE.$frame_container.trigger( 'texteditor.resize' );

      }

    }

  }, // resize

  getValue : function() {

    var html = '';

    $.each( TE._getSpans(), function() {

      this.removeAttribute('id');

    });

    // ie will add this
    if ( $.browser.msie ) {
      $(TE.yeditor.getInstance().all('var')._nodes).remove();
    }

    TE.$body.find('#_firebugConsole').remove();
    TE.$body.find('br').removeAttr( 'class' ).removeAttr( 'style' );

    html = TE.$body[0].innerHTML;

    if ( html === '<br />' || html === '<br>' ) {
      html = '';
    }

    return html;

  }, // getValue

  setHtml : function( html ) {

    TE.$body[0].innerHTML = html;

  }, // setHtml

  // for when user changes text alignment or margins
  _setDisplay : function ( el ) {

    var marginCheck = ( el.style.marginLeft ) ? parseInt( el.style.marginLeft, 10 ) : 0,
        textAlign   = ( el.style.textAlign )  ? el.style.textAlign : 'left',
        param       = ( marginCheck !== 0 || textAlign !== 'left' ) ? 'block' : 'inline';

    $(el).css( 'display', param );

  }, // _setDisplay

  _updateInlineStyle : function( el, rule, value ) {

    $(el).css( rule, value );

    if ( el.style.cssText === '' ) {
      el.removeAttribute('style');
    }

    // safety against YUI
    el.removeAttribute('id');

    // safety against YUI
    if ( el.className !== '' && $.inArray( el.className, TE.Controls.ClassName.VALID_CLASSES ) === -1 ) {
      el.removeAttribute('class');
    }

  }, // _updateInlineStyle

  _createEl : function( tagName ) {

    tagName = tagName || 'span';

    TE.yeditor.focus();

    var $nodes = $( TE.yeditor.execCommand( 'wrap', tagName )._nodes );

    // nothing is highlighted
    if ( !$nodes.length ) {

      TE.yeditor.execCommand( 'insertandfocus', '<span class="temp-span"></span>' );

      $nodes = $( TE.yeditor.getInstance().all('span.temp-span')._nodes );

      $nodes.removeClass('temp-span');

    }

    return $nodes;

  }, // _createEl

  _modifyNodes : function( control_type ) {

    var el              = false,  // current element being looked at in loop
        classname       = false,  // string of classname
        tagName         = 'span', // default tagname
        inheritedStyles = {},     // styles that are inherited when removing class
        inc             = 0;

    TE.$els = ( TE.$els !== false ) ?
      TE.$els :
      TE._createEl( tagName );

    for ( inc; inc< TE.$els.length; ++inc ) {

      el = TE.$els[inc];

      classname = ( typeof( el.className ) !== 'string' ) ? '' : el.className;

      // whenever you change an attribute with a class, make sure the class is gone, and replaced by styles
      // the only classes element shuold have are ones user can set, NOT yui ones
      if ( control_type !== 'ClassName' && classname !== '' ) {

        // get inherited styles, which will include stuff from the class
        inheritedStyles = this._getInheritedStyles( el );

        // reset styles class had
        this._setFromInheritedStyles( el, inheritedStyles );

        // remove the class
        el.removeAttribute('class');

      } // if control_type !=== ClassName

      // reset in case user set diff class
      classname = ( typeof( el.className ) !== 'string' ) ? '' : el.className;

      if ( classname === '' ) {
        el.removeAttribute('class');
      }

      if ( typeof  TE.Controls[ control_type ] !== 'object' ) {
        console.log("TE.Controls["+control_type+"] not found");
        return;
      }


      if ( typeof  TE.Controls[ control_type ]._setValue !== 'function' ) {
        console.log("TE.Controls["+control_type+"]._setValue not found");
        return;
      }

      TE.Controls[ control_type ]._setValue( el );
      TE._cleanTags( el, control_type );


    } // for inc

    TE.resize();

  }, // _modifyNodes

  _cleanTags : function( parent, control_type ) {

    var tag         = ( control_type === 'a' ) ? control_type : 'span',
        el          = false,
        tags        = parent.getElementsByTagName(tag),
        i           = 0,
        marginCheck = false,
        textAlign   = false,
        inStyles    = false;

    for ( i = 0; i<tags.length; ++i) {

      el = tags[i];

      if (tag === 'a') {
        this._removeNode(el);
        continue;
      }

      // looking at element which currently has a class
      if ( $.inArray( el.className, TE.Controls.ClassName.VALID_CLASSES ) !== -1 ) {

        // get current styles with class on child
        inStyles = TE._getInheritedStyles( el );

        // remove class
        el.removeAttribute('class');

        // set it to inline styles
        TE._setFromInheritedStyles( el, inStyles );

      } // if VALID_CLASSES

      switch ( control_type ) {

        case 'SuperFontName' :

          TE._updateInlineStyle( el, 'font-weight', '' );
          TE._updateInlineStyle( el, 'font-family', '' );
          TE._updateInlineStyle( el, 'font-style', '' );

          break;

        case 'ClassName' :
          // if the parent has its classname set again, its children shuold be following its rules totally
          el.removeAttribute('class');
          el.removeAttribute('style');
          break;

        default :
          TE._updateInlineStyle( el, TE.Controls[ control_type ].property, '' );
          break;

      } // switch control_type

      marginCheck = ( el.style.marginLeft ) ? parseInt( el.style.marginLeft, 10 ) : 0;
      textAlign   = ( el.style.textAlign )  ? el.style.textAlign : 'left';



      // no need for display to be manually set
      if ( marginCheck === 0 & textAlign === 'left' ) {
        TE._updateInlineStyle( el, 'display', '' );
      }

      if ( el.className !== '' && $.inArray( el.className, TE.Controls.ClassName.VALID_CLASSES ) === -1 ) {
        el.removeAttribute('class');
      }

      el.removeAttribute('id');

      if (el.style.cssText === '' && (!el.className || el.className === '')) {

        this._removeNode(el);
        --i;
      }

    } // for i

  }, // _cleanTags

  _removeNode : function(el) {

    var k;

    for ( k =0;k<el.childNodes.length;++k) {
      el.parentNode.insertBefore(el.childNodes[k].cloneNode(true), el);
    }
    el.parentNode.removeChild(el);

  }, // _removeNode

  _getSelection: function() {

      var _sel = null;

      if (TE.$doc[0] && TE.window) {
          if (TE.$doc[0].selection) {
              _sel = TE.$doc[0].selection;
          } else {
              _sel = TE.window.getSelection();
          }
          //Handle Safari's lack of Selection Object
          if ($.browser.webkit) {
              if (_sel.baseNode) {
                      this._selection = {};
                      this._selection.baseNode = _sel.baseNode;
                      this._selection.baseOffset = _sel.baseOffset;
                      this._selection.extentNode = _sel.extentNode;
                      this._selection.extentOffset = _sel.extentOffset;
              } else if (this._selection !== null) {
                  _sel = TE.window.getSelection();
                  _sel.setBaseAndExtent(
                      this._selection.baseNode,
                      this._selection.baseOffset,
                      this._selection.extentNode,
                      this._selection.extentOffset);
                  this._selection = null;
              }
          }
      }


      return _sel;
  }, // _getSelection



  _selectNode : function( node ) {


    var sel           = TE._getSelection(),
        range         = false;
        startEl       = node,
        startElOffset = 0,
        endEl         = node,
        endElOffset   = 1,
        DOMUtils = {
          findChildPosition: function (node) {
            for (var i = 0; node = node.previousSibling; i++)
              continue;
            return i;
          },
          isDataNode: function (node) {
            return node && node.nodeValue !== null && node.data !== null;
          },
          isAncestorOf: function (parent, node) {
            return !DOMUtils.isDataNode(parent) &&
                (parent.contains(DOMUtils.isDataNode(node) ? node.parentNode : node) ||
                node.parentNode == parent);
          },
          isAncestorOrSelf: function (root, node) {
            return DOMUtils.isAncestorOf(root, node) || root == node;
          },
          findClosestAncestor: function (root, node) {
            if (DOMUtils.isAncestorOf(root, node))
              while (node && node.parentNode != root)
                node = node.parentNode;
            return node;
          },
          getNodeLength: function (node) {
            return DOMUtils.isDataNode(node) ? node.length : node.childNodes.length;
          },
          splitDataNode: function (node, offset) {
            if (!DOMUtils.isDataNode(node))
              return false;
            var newNode = node.cloneNode(false);
            node.deleteData(offset, node.length);
            newNode.deleteData(0, offset);
            node.parentNode.insertBefore(newNode, node.nextSibling);
          }
        },
        convertFromDOMRange = function (domRange) {
          function adoptEndPoint(textRange, domRange, bStart) {
            // find anchor node and offset
            try {
              var container = domRange[bStart ? 'startContainer' : 'endContainer'];
              var offset = domRange[bStart ? 'startOffset' : 'endOffset'], textOffset = 0;
              var anchorNode = DOMUtils.isDataNode(container) ? container : container.childNodes[offset];
              var anchorParent = DOMUtils.isDataNode(container) ? container.parentNode : container;
              // visible data nodes need a text offset
              if (container.nodeType == 3 || container.nodeType == 4)
                textOffset = offset;
            }
            catch ( e0 ) {
              alert( domRange.startContainer );
              alert('aa: ' + e0);
              return;
            }

            alert( container );
            alert( container.childNodes );
            alert( offset);

            // create a cursor element node to position range (since we can't select text nodes)
            try {
              var cursorNode = TE.$doc[0].createElement('a');
              anchorParent.insertBefore(cursorNode, anchorNode);
            }
            catch ( e1 ) {
              alert('a: ' + e1);
              return;
            }

            try {
              var cursor = TE.$doc[0].body.createTextRange();
              cursor.moveToElementText(cursorNode);
            }
            catch ( e2 ) {
              alert('b: ' + e2);
              return;
            }

            try {
              cursorNode.parentNode.removeChild(cursorNode);
            }
            catch ( e3 ) {
              alert('c: ' + e3);
              return;
            }

            try {
              // move range
              textRange.setEndPoint(bStart ? 'StartToStart' : 'EndToStart', cursor);
              textRange[bStart ? 'moveStart' : 'moveEnd']('character', textOffset);
            }
            catch ( e4 ) {
              alert('d: ' + e4);
              return;
            }

          }

          // return an IE text range
          var textRange = TE.$doc[0].body.createTextRange();
          adoptEndPoint(textRange, domRange, true);
          adoptEndPoint(textRange, domRange, false);
          return textRange;
        };

    if ( endEl.nodeType === 3 ) {
      endElOffset = endEl.length-1;
    }


    try {
      if ( $.browser.msie ) {
        range = TE.$doc[0].body.createTextRange();
      }
     else {
        range = TE.$doc[0].createRange();
      }
    }
    catch( ex ) {
      alert("Failed getting range");
      return;
    }

    if ($.browser.msie) {
        try { //IE freaks out here sometimes..
          // range.setStart(startEl, startElOffset);
          // range.setEnd(endEl, endElOffset);
          // alert( 2 );
          // range.select();
          // alert( 3 );
           // range.selectNode(range);\
           range.startContainer = TE.$body[0];
           range.endContainer = TE.$body[0];
           range.endOffset = DOMUtils.getNodeLength(TE.$body[0]);
           range.startOffset= 0;
           range.endOffset= 0;
           range.commonAncestorContainer= null;
           range.collapsed= false;
           range = convertFromDOMRange( range );
           // for ( x in range ) {
            // $('body').prepend( x + ': ' + range[x] + '<br />' );
           // }
           // sel.select();

        } catch (e) {
          alert( 'Fail: ' + e);
          return;
        }
    }
    else if ($.browser.webkit) {

      sel.setBaseAndExtent(startEl, startElOffset, endEl, endElOffset);

    }
    else {

      range.setStart(startEl, startElOffset);
      range.setEnd(endEl, endElOffset);
      sel.addRange(range);

    }

  }, // _selectNode

  _nodeChange : function( e, node ) {

    var getHighlightedNode = function( e ) {

          var node   = e.changedNode._node;

          TE.last_node_e = e;

          if ( node.tagName === 'BODY' || node.tagName === 'HTML' ) {
            node = TE.$body[0].firstChild;
          }

          // if user clicked into start of editor, and the body's first child is BR
          // just go back to body to grab styles
          if ( !node || node.tagName === 'BR' ) {
            node = TE.$body[0];
          }

          return node;

        }, // getHighlightedNode

        correctToolbar = function( e ) {

          TE.$els = false;
          TE.updating_toolbar = true;

          node = ( typeof node !== 'undefined' ) ? node : getHighlightedNode( e );

          var inheritedStyles     = TE._getInheritedStyles( node ),
              $node               = $(node),
              font_css            = false,
              font_id             = false,
              font_title          = false,
              font_weight         = false,
              font_style          = false,
              superfontfamily_val = [],
              superfontfamily_str = false,
              lineheight_val      = false,
              lineheight_em       = false;

          if ( TE.Controls.SuperFontName.$control.length && typeof ( TE.Fonts.LABELS[ inheritedStyles['font-family'] ] ) === 'undefined' ) {
            inheritedStyles['font-family'] = 'arial';
          }

          if ( TE.Controls.ClassName.$control.length ) {

            TE.Controls.ClassName.$control.changeInput( 'val', inheritedStyles.inClass );

          } // LineHeight.$control.length

          if ( TE.Controls.LineHeight.$control.length ) {

            lineheight_em  = TE.Controls.LineHeight._getEm( inheritedStyles['line-height'], inheritedStyles['font-size'] );
            lineheight_val = TE.Controls.LineHeight.LABELS[ lineheight_em ];

            TE.Controls.LineHeight.$control.changeInput( 'val', lineheight_val );

          } // LineHeight.$control.length

          if ( TE.Controls.FontSize.$control.length ) {
            TE.Controls.FontSize.$control.changeInput( 'val', parseInt( inheritedStyles['font-size'], 10 ) );

          } // FontSize.$control.length

          if ( TE.Controls.SuperFontName.$control.length ) {

            font_css = inheritedStyles['font-family'];
            font_id  = TE.Fonts.STYLE_FONT_CSS_REVERSE[ font_css ];

            if ( !font_id ) {
              font_id  = TE.Fonts.FONT_DEFAULT;
              font_css = TE.Fonts.STYLE_FONT_CSS[ font_id ];
            }


            superfontfamily_val.push( font_id );
            superfontfamily_val.push( inheritedStyles['font-weight'] );
            superfontfamily_val.push( inheritedStyles['font-style'] );

            font_title          = TE.Fonts.LABELS[ font_css ];
            font_weight         = ( typeof inheritedStyles['font-weight'] === 'string' && inheritedStyles['font-weight'] === 'bold' ) ? ' Bold' : '';
            font_style          = ( inheritedStyles['font-style'] === 'italic' ) ? ' Italic' : '';
            superfontfamily_str = superfontfamily_val.join(',');

            TE.Controls.SuperFontName.$control.changeInput( 'val', superfontfamily_str );

          } // SuperFontName.$control.length

          if ( TE.Controls.Underline.$control.length ) {

            if ( inheritedStyles['text-decoration'] === 'underline' ) {
              TE.Controls.Underline.$control.addClass( 'ui-state-active' );
            }
            else {
              TE.Controls.Underline.$control.removeClass( 'ui-state-active' );
            }

          } // FontSize.$control.length

          if ( TE.Controls.Alignment.$controls !== false ) {

            TE.Controls.Alignment.$controls.removeClass('ui-state-active');
            TE.Controls.Alignment.$controls.filter('[alignment='+inheritedStyles['text-align']+']').addClass('ui-state-active');

          } // Alignment.$controls !== false

          if ( TE.Controls.OrderedList.$control.length ) {

            if ( $node.parent('ol').length ) {
              TE.Controls.OrderedList.$control.addClass('ui-state-active');
            }
            else {
              TE.Controls.OrderedList.$control.removeClass('ui-state-active');
            }
          }

          if ( TE.Controls.UnorderedList.$control.length ) {

            if ( $node.parent('ul').length ) {
              TE.Controls.UnorderedList.$control.addClass('ui-state-active');
            }
            else {
              TE.Controls.UnorderedList.$control.removeClass('ui-state-active');
            }

          }

          if ( TE.Controls.RemoveLink.$control.length ) {

            if ( e.changedNode && e.changedNode._node.tagName === 'A' ) {
              TE.Controls.RemoveLink.$control.removeClass('ui-state-disabled');
            }
            else {
              TE.Controls.RemoveLink.$control.addClass('ui-state-disabled');
            }

          }

          TE.updating_toolbar = false;

        }; // correctToolbar


    switch ( e.changedType ) {

      case 'mouseup' :
        correctToolbar( e );
        break;

      case 'keyup' :

        switch ( e.changedEvent._event.keyCode ) {

          case $.ui.keyCode.UP    :
          case $.ui.keyCode.DOWN  :
          case $.ui.keyCode.LEFT  :
          case $.ui.keyCode.RIGHT :
            correctToolbar( e );
            break;

          default :
            TE.resize();
            break;

        } // switch e.changedEvent._event.keyCode

        break;

    } // switch e.changedType

  }, // _nodeChange

  _disableToolbar : function() {

    $('.texteditor-toolbar-button, .texteditor-toolbar-container .ui-selectmenu').addClass('ui-state-disabled');

  },

  _enableToolbar : function( focused_el ) {

    if ( !focused_el ) {
      focused_el = ( TE.$els ) ? TE.$els[0] : TE.$body[0];
    }

    $('.texteditor-toolbar-button, .texteditor-toolbar-container .ui-selectmenu').removeClass('ui-state-disabled');
    TE._nodeChange( { changedType : 'mouseup' }, focused_el );

  },

  _getSpans : function() {
    return TE.yeditor.getInstance().all('span')._nodes;
  },

  _correctListColors : function() {

    var $lis = TE.$body.find('li');

    $lis.each( function() {

      var $li        = $(this),
          $span      = $li.find('span').first(),
          span_color = $span.css('color');

      $li.css( 'color', span_color );

    });

  }, // _correctListColors

  // if you edit this, check to match in _getFromInheritedStyles
  _setFromInheritedStyles : function (el, styles ) {

    styles = $.extend({}, {
      inColor       : false,
      inSize        : false,
      inLineHeight  : false,
      inFont        : false,
      inWeight      : false,
      inDeco        : false,
      inStyle       : false,
      inClass       : false,
      inBackColor   : false,
      inTextAlign   : false // TODO: see why was this excluded from overwrites?
    },
    styles );

    var x, $el, css = {},

        // indexes are from TE.VALID_RULES
        rules_map = {

          color           : 'color',
          fontSize        : 'font-size',
          lineHeight      : 'line-height',
          fontFamily      : 'font-family',
          fontWeight      : 'font-weight',
          textDecoration  : 'text-decoration',
          fontStyle       : 'font-style',
          backgroundColor : 'background-color'

        };

    if ( el.nodeType === 3 ) {

      x = document.createElement('span');

      $(el).before(x);
      $(x).append(el.cloneNode(true));
      $(el).remove();
      el = x;

    }

    $el = $(el);

    $.each( rules_map, function( js_rule, css_rule ) {

      if ( styles[ css_rule ] ) {
        css[ css_rule ] = styles[ css_rule ];
      }

    });

    $el.css( css );

  },

  // if you edit this, check to match in _setFromInheritedStyles
  _getInheritedStyles : function(el, stopper) {

    var inColor      = false,
        inBackColor  = false,
        inSize       = false,
        inLineHeight = false,
        inFont       = false,
        inWeight     = false,
        inDeco       = false,
        inStyle      = false,
        inClass      = false,
        inTextAlign  = false,
        updated      = false,
        ignoreClass  = false,
        firstNode    = true,
        node         = el,
        $node        = false,
        font_id      = false,
        prop         = false;

    stopper  = (stopper) ? stopper : false;

    // ensure its not looking at text node
    while ( node.nodeType === 3 ) {
      node = node.parentNode;
    }

    while (node) {

      // if first node has an actual style attribute, it should not be using a class, so ignore that inherit
      if ( firstNode ) {

        for ( prop in node.style) {

          if ( ignoreClass ) {
            break;
          }

          if ( $.inArray( prop, this.VALID_RULES ) >= 0 && node.style[ prop ] !== '' ) {
            ignoreClass = true;
          }
        }

      } // if firstNode

      $node = $(node);

      if ( !inColor && $node.css('color') ) {
        inColor = $node.css('color');
        updated = true;
      }

      if ( !inBackColor && $node.css('background-color') ) {
        inBackColor = $node.css('background-color');
        updated = true;
      }

      if (!inSize && $node.css('font-size') ) {
        inSize  = $node.css('font-size');
        updated = true;
      }

      if (!inLineHeight && $node.css('line-height') ) {
        inLineHeight  = $node.css('line-height');
        updated = true;
      }

      if ( !inWeight && $node.css('font-weight') ) {

        inWeight = $node.css('font-weight');
        updated  = true;

      }

      if (!inDeco && $node.css('text-decoration') ) {
        inDeco  = $node.css('text-decoration');
        updated = true;
      }

      if ( !inFont && $node.css('font-family') ) {
        inFont  = $node.css('font-family');
        inFont  = inFont.replace(/'/g,'"');    // normalize between browsers
        inFont  = inFont.replace(/,\s+/g,','); // normalize between browsers
        updated = true;
      }


      if (!inStyle && $node.css('font-style') ) {
        inStyle = $node.css('font-style');
        updated = true;
      }

      if (!inTextAlign && $node.css('text-align') ) {
        inTextAlign = $node.css('text-align');

        // quirk on body tag in FF
        if ( inTextAlign === 'start' ) {
          inTextAlign = 'left';
        }

        updated     = true;
      }

      if ( !ignoreClass && !inClass && node.tagName !== 'BODY' && node.className ) {
        inClass = node.className;
        updated = true;
      }

      node = node.parentNode;
      if ( !node || node.tagName === 'HTML' || (stopper && node === stopper) ) { break; }

      firstNode = false;

    } // while node

    font_id = TE.Fonts.STYLE_FONT_CSS_REVERSE[ inFont ];

    if ( typeof TE.Fonts.STYLE_FONT_WEIGHTS[ font_id ] !== 'object' ) {

      if ( typeof inWeight === 'number' ) {
        inWeight = ( inWeight > 400 ) ? 'bold' : 'normal';
      }
      else {

        if ( inWeight !== 'bold' && inWeight !== 'normal' ) {
          inWeight = parseInt( inWeight, 10 );
          inWeight = ( inWeight > 400 ) ? 'bold' : 'normal';
        }

      }

    }
    else {
      inWeight = parseInt( inWeight, 10 );
    }

    return {
      'updated'          : updated,
      'color'            : inColor,
      'font-size'        : inSize,
      'line-height'      : inLineHeight,
      'font-family'      : inFont,
      'font-weight'      : inWeight,
      'text-decoration'  : inDeco,
      'font-style'       : inStyle,
      'inClass'          : inClass,
      'background-color' : inBackColor,
      'text-align'       : inTextAlign
    };


  } // _getInheritedStyles

}; // TE
