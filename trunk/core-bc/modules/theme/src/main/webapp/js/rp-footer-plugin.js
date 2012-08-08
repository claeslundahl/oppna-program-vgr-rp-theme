AUI.add('rp-footer-plugin', function(A) {
	var Lang = A.Lang,
	
		getClassName = A.ClassNameManager.getClassName,
	
		NAME = 'rp-footer-plugin',
		NS = 'rp-footer',
		
		// Custom Attributes
		BODY_NODE = 'bodyNode',
		FOOTER_HEIGHT = 'footerHeight',
		FOOTER_TOP = 'footerTop',
		WINDOW_HEIGHT = 'windowHeight',
		WRAPPER_HEIGHT = 'wrapperHeight',
		WRAPPER = 'wrapper',
		
		// Property keys
		CLIENT_HEIGHT = 'clientHeight',
		WIN_HEIGHT = 'winHeight',
		HOST = 'host'
	;

	var RpFooter = A.Component.create(
		{
            ATTRS: {
            	
            	bodyNode: {
                    value: 'body',
                    setter: A.one
            	},
                
                wrapper: {
                    value: '#wrapper',
                    setter: A.one
                }
                
            },
			
            EXTENDS: A.Plugin.Base,
			NAME: NAME,
			NS: NS,
	
			prototype: {
				initializer: function() {
					var instance = this;
					
					var host = instance.get(HOST);
					
					instance._initHeights();
					instance._positionFooter();
				},
				
				_initHeights: function() {
					var instance = this;
					
					var host = instance.get(HOST);
					
					var footerHeight = host.get(CLIENT_HEIGHT);
					var windowHeight = instance.get(BODY_NODE).get(WIN_HEIGHT);
					var wrapperHeight = instance.get(WRAPPER).get(CLIENT_HEIGHT);
					
					var scrollTop = document.documentElement.scrollTop;
					var footerTop = scrollTop + windowHeight - footerHeight;
					
					instance.set(FOOTER_HEIGHT, footerHeight);
					instance.set(WINDOW_HEIGHT, windowHeight);
					instance.set(WRAPPER_HEIGHT, wrapperHeight);
					instance.set(FOOTER_TOP, footerTop);
					
				},
				
				// Returns true or false
				_isEmptySpaceAtBottom: function() {
					var instance = this;
					
					var wrapperHeight = instance.get(WRAPPER_HEIGHT);
					var footerHeight = instance.get(FOOTER_HEIGHT);
					var windowHeight = instance.get(WINDOW_HEIGHT);
					
					var wrapperAndFooterHeight = wrapperHeight + footerHeight;
					
					return ( wrapperAndFooterHeight < windowHeight );
				},
				
				_positionFooter: function() {
					var instance = this;
					
					var host = instance.get(HOST);
					
					host.show();
					host.addClass('host-position');
					
					if(instance._isEmptySpaceAtBottom()) {
						var footerTop = instance.get(FOOTER_TOP);
						
						host.setStyle('position', 'absolute');
						host.setStyle('top', footerTop + 'px');
					}					
					
				},
				
				_someFunction: function() {}
				
			}
		}
	);

	A.namespace('Plugin').RpFooter = RpFooter;

	}, '1.0.1' ,{
		requires:[
		          'aui-component',
		          //'aui-state-interaction',
		          'plugin'
  		]
	}
);