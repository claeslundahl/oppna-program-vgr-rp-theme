AUI().add('rp-navigation-button',function(A) {
    var Lang = A.Lang,
        isArray = Lang.isArray,
        isFunction = Lang.isFunction,
        isNull = Lang.isNull,
        isObject = Lang.isObject,
        isString = Lang.isString,
        isUndefined = Lang.isUndefined,
        getClassName = A.ClassNameManager.getClassName,
        concat = function() {
            return Array.prototype.slice.call(arguments).join(SPACE);
        },
        
        NAME = 'rp-navigation-button',
        NS = 'rp-navigation-button',
        
        BANNER_NODE = 'bannerNode',
        NAVIGATION_LIST = 'navigationList',
        TRIGGER = 'trigger',
        
        CSS_HIDDEN = 'aui-helper-hidden'
    ;

        
        //'<nav id="navigationButtonMenu"><ul class="navigation-button-menu-list"></ul></nav>'
    var TPL_MENU = '<nav id="navigationButtonMenu"><ul class="navigation-button-menu-list"></ul></nav>',
    	TPL_MENU_ITEM = '<li class="{cssClass}"><a href="{url}">{label}</a></li>'
	;
        
    var RpNavigationButton = A.Component.create(
            {
                ATTRS: {
                	
                	bannerNode: {
                		value: '#banner',
                		setter: A.one
                	},
                	
                	navigationList: {
                		value: '#navigation ul.nav-list',
                		setter: A.one
                	},
                	
                	trigger: {
                		value: '#navigationTrigger',
            			setter: A.one
                	}
                	
                },
                EXTENDS: A.Component,
                NAME: NAME,
                NS: NS,
                
                navigationButtonMenu: null,
                
                prototype: {
                    
                    initializer: function(config) {
                        var instance = this;
                        
                    },
                    
                    renderUI: function() {
                        var instance = this;
                        
                        //instance._initConsole();
                        
                        instance._initNavigationMenu();
                    },
    
                    bindUI: function() {
                        var instance = this;
                        
                        var trigger = instance.get(TRIGGER);
                        if(!isNull(trigger)) {
                        	trigger.on('click', instance._onTriggerClick, instance);	
                        }
                    },
                    
                    _initConsole: function() {
                    	var instance = this;
                    	
                    	var consoleSettings = {
	            	        newestOnTop: true,
	            	        visible: true
                    	};
                    	
                    	var console =  new A.Console(consoleSettings).render();
                    },
                    
                    _initNavigationMenu: function(e) {
                    	var instance = this;
                    	
                    	var navigationList = instance.get(NAVIGATION_LIST);
                    	
                    	if(isNull(instance.get(TRIGGER)) || isNull(navigationList)) { return; }
                    	
                    	var firstLevelLinks = navigationList.all('>li>a');
                    	
                    	var bannerNode = instance.get(BANNER_NODE);
                    	
                    	bannerNode.append(TPL_MENU);
                    	
                    	var navigationButtonMenu = bannerNode.one('#navigationButtonMenu');
                    	
                    	navigationButtonMenu.hide();
                    	
                    	var menuList = navigationButtonMenu.one('.navigation-button-menu-list');
                    	
                    	firstLevelLinks.each(function(item, index, list) {
                    		var linkUrl = item.getAttribute('href');
                    		var spanNode = item.one('>span');
                    		var linkText = spanNode.html();
                    		var cssClass = '';
                    		
                    		if(index+1 == list.size()) {
                    			cssClass = 'last';
                    		}
                    		
    						var menuItemHtml = A.substitute(TPL_MENU_ITEM, {
    							cssClass: cssClass,
    							label: linkText,
    							url: linkUrl
    						});
                    		
    						menuList.append(menuItemHtml);
                    	});
                    	
                    	instance.navigationButtonMenu = navigationButtonMenu;
                    },
                    
                    _onTriggerClick: function(e) {
                    	var instance = this;
                    	
                    	e.halt();
                    	
                    	if(instance.navigationButtonMenu.hasClass(CSS_HIDDEN)) {
                    		instance.navigationButtonMenu.show();
                    	}
                    	else {
                    		instance.navigationButtonMenu.hide();
                    	}
                    },
                    
                    _someFunction: function() {
                        var instance = this;
                    }

                }
            }
    );

    A.RpNavigationButton = RpNavigationButton;
        
    },1, {
        requires: [
	       'aui-base',
	       'aui-io',
	       'aui-loading-mask',
	       'aui-overlay',
	       'console',
	       'event-custom',
	       'event-delegate',
	       'substitute'
      ]
    }
);
