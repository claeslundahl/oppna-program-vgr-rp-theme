AUI().add('rp-new-theme',function(A) {
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
        
        NAME = 'rp-new-theme',
        NS = 'rp-new-theme'
    ;
    
    var RpNewTheme = A.Component.create(
            {
                ATTRS: {
                    
                    someAttribute: {
                        value: ''
                    }
                    
                },
                EXTENDS: A.Component,
                NAME: NAME,
                NS: NS,
                prototype: {
                    
                    initializer: function(config) {
                        var instance = this;
                    },
                    
                    renderUI: function() {
                        var instance = this;
                        
                        instance._initNavigationButton();
                        instance._initMainNavigation();
                        instance._initDockbarToggle();
                        instance._initQuickAccessNav();
                        instance._initTyckTill();
                        instance._initSystemPageHelp();
                        instance._initBreadcrumbs();
                        instance._initServerNodeInfo();
                        
                    },
    
                    bindUI: function() {
                        var instance = this;
                    },

                    //Make changes to breadcrumbs section and then show it
            		_initBreadcrumbs: function() {
            			var instance = this;
            			
            			var breadcrumbsNode = A.one('#breadcrumbs');
            			
            			// Do nothing if there are no breadcrumbs
            			if(!breadcrumbsNode) { return; }
            			
            			var breadcrumbsList = breadcrumbsNode.one('ul.breadcrumbs');
            			
            			//breadcrumbsList.addClass('clearfix');
            			
            			// Do nothing if there is no breadcrumbsList
            			if(!breadcrumbsList) { return; }
            			
            			// Rename the second list node link
            			var secondListLink = breadcrumbsList.one('.first').next().one('a');
            			secondListLink.html('Start');
            			
            			// Prepend breadcrumbs label:
            			//breadcrumbsList.prepend('<li class="label"><span>Du &auml;r h&auml;r: </span></li>');
            			
            			breadcrumbsNode.show();
            		},
            		
            		//Toggle dockbar when settings is clicked in topnav
            		_initDockbarToggle: function() {
            			var instance = this;
            			
            			var dockbarWrapNode = A.one('#dockbarWrap');
            			var topNavigationNode = A.one('#topNavigation');
            			
            			// Do nothing if there is no dockbar
            			if(!dockbarWrapNode) { return; }
            		
            			topNavigationNode.all('.top-nav-settings a').on('click', function(e) {
            				//alert('on click .top-nav-settings a');
            				
            				e.halt();
            				var currentTarget = e.currentTarget;
            				var listNode = currentTarget.ancestor('li');
            				
            				if(listNode.hasClass('top-nav-settings-show')) {
            					listNode.hide();
            					dockbarWrapNode.show();
            					listNode.siblings('.top-nav-settings-hide').show();
            				}
            				else if(listNode.hasClass('top-nav-settings-hide')) {
            					listNode.hide();
            					dockbarWrapNode.hide();
            					listNode.siblings('.top-nav-settings-show').show();
            				}
            			});
            		},

            		_initMainNavigation: function() {
            			var instance = this;
            			
            			var mainNavList = A.one('#navigation ul.nav-list');
            			
            			if(mainNavList) {
            				var mainNavListItems = mainNavList.all('> li');
            				
                			mainNavListItems.on('mouseenter', instance._onMainNavItemEnter, instance);
                			mainNavListItems.on('mouseleave', instance._onMainNavItemLeave, instance);
                			
                			// Extra callback method that ensures that no hover classes are left behind in ie
                			
                			mainNavList.on('mouseenter', instance._onMainNavEnter, instance);
                			mainNavList.on('mouseleave', instance._onMainNavLeave, instance);
            			}
            		},
                    
            		_initNavigationButton: function() {
            			var instance = this;
            			
            			var rpNavigationButton = new A.RpNavigationButton();
            			
            			rpNavigationButton.render();
            		},
            		
            		_initServerNodeInfo: function() {
            			var instance = this;
            			
            			var logoHeading = A.one('#banner .company-title');
            			if(logoHeading) {
            				var URL_LOCAL = 'localhost';
            				var URL_TEST = 'portalen-test';
            				var URL_STAGE = 'portalen-stage';
            				
            				var serverNodeInfoText = '';
            				
            				var currentUrl = window.location.href;
            				
            				if(currentUrl.indexOf(URL_STAGE) > 0) {
            					serverNodeInfoText = 'stage';
            				}
            				else if(currentUrl.indexOf(URL_LOCAL) > 0) {
            					serverNodeInfoText = 'local';
            				}
            				else if(currentUrl.indexOf(URL_TEST) > 0) {
            					serverNodeInfoText = 'test';
            				}

            				if(serverNodeInfoText != '') {
            					logoHeading.append('<span class="server-node-info">' + serverNodeInfoText + '</span>');	
            				}
            			}
            		},
            		
            		_initSystemPageHelp: function() {
            			var instance = this;
            			
            			
            			var systemsHelpAggregator = A.one('.rp-sidebar-hidden .knowledge-base-portlet-aggregator');
            			
            			// If there is no systems help aggregator - do nothing
            			if(!systemsHelpAggregator) { return; }
            			
            			var sidebarTools = A.one('#toolsSidebar');
            			
            			// If there is no sidebar tools - do nothing
            			if(!sidebarTools) { return; }
            			
            			var systemHelp = new A.SystemHelp({
            				sidebarTools: sidebarTools,
            				systemsHelpAggregator: systemsHelpAggregator
            			});
            			
            			systemHelp.render();
            		},

            		_initTyckTill: function() {
            			var instance = this;
            			
            			var trigger = A.one('#tycktillWrap a');
            			
            			// Do nothing if there is no tycktill trigger
            			if(!trigger) { return; }
            			
            			var tyckTill = new A.TyckTill({
            				trigger: trigger
            			});
            			
            			tyckTill.render();
            		},
            		
            		_initQuickAccessNav: function() {
            			var instance = this;
            			
            			var trigger = A.one('#topNavigation .top-nav-quick-access a');
            			
            			// Do nothing if there is no quicknav trigger
            			if(!trigger) { return; }
            			
            			var quickAccessNav = new A.QuickAccessNav({
            				filterInputId: '#quickAccessFilterInput',
            				mainNavList: '#navigation > ul',
            				trigger: trigger,
            				quickAccessNavListWrap: '.quick-access-nav-list-wrap'
            			});
            			
            			quickAccessNav.render();
            		},

            		_onMainNavEnter: function(e) {
            			var instance = this;
            		},
            		
            		_onMainNavLeave: function(e) {
            			var instance = this;
            			
            			var mainNavList = e.currentTarget;
            			
            			var mainNavListItems = mainNavList.all('li');
            			mainNavListItems.removeClass('hover');
            		},
            		
            		_onMainNavItemEnter: function(e) {
            			var instance = this;
            			
            			var navListItem = e.currentTarget;
            			
            			var allNavListItems = A.all('#navigation li');
            			allNavListItems.removeClass('hover');
            			
            			navListItem.addClass('hover');
            		},
            		
            		_onMainNavItemLeave: function(e) {
            			var instance = this;
            			
            			var navListItem = e.currentTarget;
            			navListItem.removeClass('hover');
            		},
                    
                    _someFunction: function(e) {
                        var instance = this;
                    }

                }
            }
    );

    A.RpNewTheme = RpNewTheme;
        
    },1, {
        requires: [
	       	'aui-base',
	    	'event',
	    	'rp-navigation-button',
	    	'rp-tyck-till',
	    	'rp-system-help',
	    	'rp-quick-access-nav'
      ]
    }
);
