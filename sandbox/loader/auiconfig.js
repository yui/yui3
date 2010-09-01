(function() {
	var PATH_BASE = YUI.config.base;
	var PATH_JAVASCRIPT = PATH_BASE;
	var PATH_THEME_ROOT = PATH_BASE + 'themes/base/css/';
	var PATH_THEME_IMAGES = Liferay.ThemeDisplay.getPathThemeImages() + '/aui';

	YUI.AUI_config = {
		chart: {
			swfURL: 'assets/chart.swf'
		},

		classNamePrefix: 'aui',

		io: {
			method: 'GET'
		},

        combine:false,

		groups: {
            alloy: {
	            combine:Liferay.AUI.getCombine(),
                modules: {
						'aui-autocomplete': {requires:['aui-base','aui-overlay-base','datasource','dataschema','aui-form-combobox'], skinnable:true},
						'aui-base': {skinnable:false, requires:['aui-node','aui-component','aui-delayed-task','event','oop','widget-css']},
						'aui-button-item': {skinnable:true, requires:['aui-base','aui-state-interaction','widget-child']},
						'aui-calendar': {submodules: {'aui-calendar-datepicker-select': {skinnable:true, requires:['aui-calendar-base','aui-button-item']}, 'aui-calendar-base': {skinnable:true, requires:['aui-overlay-context','datatype-date','widget-locale']} }, skinnable:true, use:['aui-calendar-base','aui-calendar-datepicker-select']},
						'aui-carousel': {skinnable:true, requires:['aui-base','anim']},
						'aui-char-counter': {skinnable:false, requires:['aui-base','aui-event-input']},
						'aui-chart': {skinnable:false, requires:['datasource','aui-swf','json']},
						'aui-color-picker': {skinnable:true, requires:['aui-overlay-context','dd','slider','substitute','aui-button-item','aui-form','aui-panel']},
						'aui-component': {skinnable:false, requires:['widget']},
						'aui-data-set': {skinnable:false, requires:['oop','collection','base']},
						'aui-datatype': {skinnable:false, requires:['aui-base']},
						'aui-delayed-task': {skinnable:false},
						'aui-dialog': {skinnable:true, requires:['aui-panel','dd-constrain','aui-button-item','aui-overlay-manager','aui-overlay-mask','aui-io-plugin','aui-resize']},
						'aui-editable': {skinnable:true, requires:['aui-base','aui-form-combobox']},
						'aui-event': {submodules: {'aui-event-input': {requires:['aui-base']} }, use:['aui-event-input'], skinnable:false},
						'aui-form': {submodules: {'aui-form-validator': {requires:['aui-base','aui-event-input','selector-css3','substitute']}, 'aui-form-textfield': {requires:['aui-form-field']}, 'aui-form-textarea': {skinnable:true, requires:['aui-form-textfield']}, 'aui-form-field': {requires:['aui-base','aui-component','substitute']}, 'aui-form-combobox': {skinnable:true, requires:['aui-form-textarea','aui-toolbar']}, 'aui-form-base': {requires:['aui-base','aui-data-set','aui-form-field','querystring-parse']} }, use:['aui-form-base','aui-form-combobox','aui-form-field','aui-form-textarea','aui-form-textfield','aui-form-validator'], skinnable:false},
						'aui-image-viewer': {submodules: {'aui-image-viewer-gallery': {skinnable:true, requires:['aui-image-viewer-base','aui-paginator','aui-toolbar']}, 'aui-image-viewer-base': {skinnable:true, requires:['anim','aui-overlay-mask','substitute']} }, use:['aui-image-viewer-base','aui-image-viewer-gallery'], skinnable:true},
						'aui-io': {submodules: {'aui-io-plugin': {requires:['aui-overlay-base','aui-parse-content','aui-io-request','aui-loading-mask']}, 'aui-io-request': {requires:['aui-base','io','json','plugin','querystring-stringify']} }, use:['aui-io-request','aui-io-plugin'], skinnable:false},
						'aui-live-search': {skinnable:false, requires:['aui-base']},
						'aui-loading-mask': {skinnable:true, requires:['aui-overlay-mask','plugin','substitute']},
						'aui-nested-list': {skinnable:false, requires:['aui-base','dd']},
						'aui-node': {submodules: {'aui-node-fx': {requires:['aui-base','anim','anim-node-plugin']}, 'aui-node-html5-print': {requires:['aui-node-html5']}, 'aui-node-html5': {requires:['collection','aui-base']}, 'aui-node-base': {requires:['aui-base']} }, use:['aui-node-base','aui-node-html5','aui-node-html5-print','aui-node-fx'], skinnable:false},
						'aui-overlay': {submodules: {'aui-overlay-mask': {skinnable:true, requires:['aui-base','aui-overlay-base','event-resize']}, 'aui-overlay-manager': {requires:['aui-base','aui-overlay-base','overlay','plugin']}, 'aui-overlay-context-panel': {skinnable:true, requires:['aui-overlay-context','anim']}, 'aui-overlay-context': {requires:['aui-overlay-manager','aui-delayed-task']}, 'aui-overlay-base': {requires:['aui-component','widget-position','widget-stack','widget-position-align','widget-position-constrain','widget-stdmod']} }, use:['aui-overlay-base','aui-overlay-context','aui-overlay-context-panel','aui-overlay-manager','aui-overlay-mask'], skinnable:true},
						'aui-paginator': {skinnable:true, requires:['aui-base','substitute']},
						'aui-panel': {skinnable:true, requires:['aui-component','widget-stdmod','aui-toolbar']},
						'aui-parse-content': {skinnable:false, requires:['async-queue','aui-base','io','plugin']},
						'aui-portal-layout': {skinnable:true, requires:['aui-base','dd']},
						'aui-progressbar': {skinnable:true, requires:['aui-base']},
						'aui-rating': {skinnable:true, requires:['aui-base']},
						'aui-resize': {skinnable:true, requires:['aui-base','dd','substitute']},
						'aui-skin-base': {path: 'aui-skin-base/css/aui-skin-base.css', type: 'css'},
						'aui-skin-classic-all': {path: 'aui-skin-classic/css/aui-skin-classic-all.css', type: 'css'},
						'aui-skin-classic': {type: 'css', after: ['aui-skin-base'], path: 'aui-skin-classic/css/aui-skin-classic.css'},
						'aui-sortable': {skinnable:true, requires:['aui-base','dd']},
						'aui-state-interaction': {skinnable:false, requires:['aui-base','plugin']},
						'aui-swf': {skinnable:false, requires:['aui-base','querystring-stringify-simple']},
						'aui-tabs': {skinnable:true, requires:['aui-component','aui-state-interaction']},
						'aui-textboxlist': {skinnable:true, requires:['anim-node-plugin','aui-autocomplete','node-focusmanager']},
						'aui-toolbar': {skinnable:true, requires:['aui-base','aui-button-item','aui-data-set','widget-parent']},
						'aui-tooltip': {skinnable:true, requires:['aui-overlay-context-panel']},
						'aui-tree': {submodules: {'aui-tree-view': {skinnable:true, requires:['aui-tree-node','dd']}, 'aui-tree-node': {skinnable:false, requires:['aui-tree-data','io','json','querystring-stringify']}, 'aui-tree-data': {skinnable:false, requires:['aui-base']} }, skinnable:true, use:['aui-tree-data', 'aui-tree-node', 'aui-tree-view']}
				}
		    }
		},

		paths: {
			images: PATH_THEME_IMAGES
		}
	};
})();

