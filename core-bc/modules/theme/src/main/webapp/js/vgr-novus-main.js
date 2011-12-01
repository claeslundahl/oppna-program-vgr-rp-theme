AUI().add('vgr-novus-main',function(A) {
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
		
		ANIM_EASING = A.Easing.easeOut,
		ANIM_DURATION = 0.6,
		COOKIE_HIDE_SIDEBAR = 'hideSidebar',
		WIDTH_MAIN_CONTENT_STANDARD = '80%',
		WIDTH_MAIN_CONTENT_MAXIMIZED = '100%',
		
		DOCKBAR_NODE = 'dockbarNode',
		HEADER_NODE = 'headerNode',
		MAIN_CONTENT_NODE = 'mainContentNode',
		SIDEBAR_NODE = 'sidebarNode',
		WRAPPER_NODE = 'wrapperNode',
		
		HREF = 'href',
		NAME = 'vgr-novus-main',
		NS = 'vgr-novus-main'
	;
	
	var	TPL_HIDE_HEADER 	= '<li class="nav-toolbar-item"><a class="hide-header" href="#">{linkText}</a></li>',
		TPL_SHOW_HEADER 	= '<div class="show-header-wrap"><a href="#" class="show-header">{linkText}</a></div>',
		TPL_HIDE_SIDEBAR 	= '<li class="nav-toolbar-item"><a class="hide-sidebar" href="#">{linkText}</a></li>',
		TPL_SHOW_SIDEBAR 	= '<li class="nav-toolbar-item"><a class="show-sidebar" href="#">{linkText}</a></li>'
	;

	var VgrNovusMain = A.Component.create(
			{
				ATTRS: {
					
					dockbarNode: {
						value: '#dockbar',
						setter: A.one
					},
					
					headerNode: {
						value: '#banner',
						setter: A.one
					},
					
					mainContentNode: {
						value: '#main-container',
						setter: A.one
					},
					
					sidebarNode: {
						value: '#slide-container',
						setter: A.one
					},
					
					wrapperNode: {
						value: '#wrapper',
						setter: A.one
					}
					
				},
				EXTENDS: A.Component,
				NAME: NAME,
				NS: NS,
				prototype: {
					animHeader: null,
					animMainContent: null,
					animSidebar: null,
					animSidebarPushX: 0,
					computedHeaderHeight: '',
					
					initializer: function(config) {
						var instance = this;
						
						instance.messages = {};
						instance.messages.hideHeader = 'D&ouml;lj sidhuvud';
						instance.messages.hideSidebar = 'D&ouml;lj sidokolumn';
						instance.messages.showHeader = 'Visa sidhuvud';
						instance.messages.showSidebar = 'Visa sidokolumn';
						
					},
					
					renderUI: function() {
						var instance = this;
						
						instance._initDockbarTitle();
						instance._initDockbarFixes();
						instance._initToggleHeader();
						
						if(instance.get(SIDEBAR_NODE)) {
							instance._initToggleSidebar();
						}
					},
	
					bindUI: function() {
						var instance = this;
					},
					
					_getHideSidebarCookie: function() {
						var instance = this;
						
						var cookieValue = A.Cookie.get(COOKIE_HIDE_SIDEBAR);
						
						if(A.Lang.isNull(cookieValue) || cookieValue == 'false') {
							return false;
						}
						else {
							return true;
						}
					},
					
					_initDockbarTitle: function() {
						var instance = this;
						
						instance.get(DOCKBAR_NODE).prepend('<h1 class="portal-title">' + 'Regionportalen' + '</h1>');
					},
					
					_initDockbarFixes: function() {
						var instance = this;
						
						// Fixes issue with a bug in the taglib that prints cssclass into the html
						// Link in dockbar portlet uses the aui-a tag, with the attribute cssclass instead of cssClass
						// Also remove parenthesis for the signout link
						
						var dockbarNode = instance.get(DOCKBAR_NODE);
						var userLinkNodes = dockbarNode.all('.user-links a');
						userLinkNodes.each(function(item, index, list) {
							if(item.hasAttribute('cssclass')) {
								item.addClass(item.getAttribute('cssclass'));
								item.removeAttribute('cssclass');
							}
						});
						
						var signoutNode = dockbarNode.one('.sign-out');
						var signoutHtml = signoutNode.html();
						signoutHtml = signoutHtml.replace('(', '');
						signoutHtml = signoutHtml.replace(')', '');
						signoutNode.html(signoutHtml);
					},
					
					_initToggleHeader: function() {
						var instance = this;
						
						var wrapperNode = instance.get(WRAPPER_NODE);
						var headerNode = instance.get(HEADER_NODE);

						var mainNavList = headerNode.one('ul.nav-main');

						// Create and insert hideHeader node in nav						
						var hideHeaderHtml = A.substitute(TPL_HIDE_HEADER, {
							linkText: instance.messages.hideHeader
						});
						
						mainNavList.append(hideHeaderHtml);
						instance.hideHeaderLink = mainNavList.one('a.hide-header');
						
						// Init header animation						
						instance.animHeader = new A.Anim({
							node: headerNode,
							easing: ANIM_EASING,
							duration: ANIM_DURATION,
							from: {},
							to: {}
						});
						
						// Get computed header height
						instance.computedHeaderHeight = headerNode.getComputedStyle('height');
						
						// Insert show header control and hide it from default
						var showHeaderHtml = A.substitute(TPL_SHOW_HEADER, {
							linkText: instance.messages.showHeader
						});
						headerNode.placeAfter(A.Node.create(showHeaderHtml));
						instance.showHeaderWrap = wrapperNode.one('.show-header-wrap');
						instance.showHeaderLink = instance.showHeaderWrap.one('a.show-header');
						instance.showHeaderWrap.hide();
						
						// Bind click events for show and hide links
						instance.hideHeaderLink.on('click', instance._onClickHideHeader, instance);
						instance.showHeaderLink.on('click', instance._onClickShowHeader, instance);
					},
					
					_initToggleSidebar: function() {
						var instance = this;
						
						var headerNode = instance.get(HEADER_NODE);
						var sidebarNode = instance.get(SIDEBAR_NODE);
						var mainContentNode = instance.get(MAIN_CONTENT_NODE);
						
						var hideSidebar = instance._getHideSidebarCookie();
						
						if(hideSidebar) {
							mainContentNode.setStyle('width', WIDTH_MAIN_CONTENT_MAXIMIZED);
							instance.get(SIDEBAR_NODE).hide();
						}

						var mainNavList = headerNode.one('ul.nav-main');
						
						// Create and insert hideSidebar and showSidebar nodes in nav
						var hideSidebarHtml = A.substitute(TPL_HIDE_SIDEBAR, {
							linkText: instance.messages.hideSidebar
						});
						var showSidebarHtml = A.substitute(TPL_SHOW_SIDEBAR, {
							linkText: instance.messages.showSidebar
						});
						
						if(instance.hideHeaderLink) {
							var showHeaderListItem = instance.hideHeaderLink.ancestor('li');
							
							showHeaderListItem.placeBefore(A.Node.create(hideSidebarHtml));
							showHeaderListItem.placeBefore(A.Node.create(showSidebarHtml));
						} else {
							mainNavList.append(hideSidebarHtml);
							mainNavList.append(showSidebarHtml);
						}
						
						instance.hideSidebarLink = mainNavList.one('a.hide-sidebar');
						instance.showSidebarLink = mainNavList.one('a.show-sidebar');
						
						// Hide/show sidebar controls
						if(hideSidebar) {
							instance.hideSidebarLink.hide();
							instance.showSidebarLink.show();							
						} else {
							instance.hideSidebarLink.show();
							instance.showSidebarLink.hide();							
						}
						
						// Init sidebar animation						
						instance.animSidebar = new A.Anim({
							node: sidebarNode,
							easing: ANIM_EASING,
							duration: ANIM_DURATION,
							from: {},
							to: {}
						});
						
						// Init sidebar animation						
						instance.animMainContent = new A.Anim({
							node: mainContentNode,
							easing: ANIM_EASING,
							duration: ANIM_DURATION,
							from: {},
							to: {}
						});
						
						// Bind click events for show and hide links
						instance.hideSidebarLink.on('click', instance._onClickHideSidebar, instance);
						instance.showSidebarLink.on('click', instance._onClickShowSidebar, instance);
					},
					
					_onClickHideHeader: function(e) {
						var instance = this;
						
						e.halt();
						
						// Set from and to values for animHeader
						instance.animHeader.set('from', {
							height: instance.computedHeaderHeight
						});
						instance.animHeader.set('to', {
							height: '0'
						});
						
						// Detach start and end callbacks for animHeader
						instance.animHeader.detach('start');
						instance.animHeader.detach('end');
						
						// Define start callback for animHeader
						instance.animHeader.on('start', function(e) {
							var instance = this;
							instance.get(HEADER_NODE).addClass('overflow-hidden');
						}, instance);
	
						// Define end callback for animHeader
						instance.animHeader.on('end', function(e) {
							var instance = this;
							instance.showHeaderWrap.show();
						}, instance);
						
						// Run animation
						instance.animHeader.run();
					},
					
					_onClickHideSidebar: function(e) {
						var instance = this;
						
						e.halt();
						
						var computedSidebarWidthStr = instance.get(SIDEBAR_NODE).getComputedStyle('width').replace('px', '');
						var computedSidebarWidth = parseInt(computedSidebarWidthStr);
						
						instance.animSidebarPushX = computedSidebarWidth;
						
						var sidebarX = instance.get(SIDEBAR_NODE).getX();
						var sidebarY = instance.get(SIDEBAR_NODE).getY();
						
						var sidebarNewX = sidebarX + instance.animSidebarPushX;
						
						// Set from and to values for animSidebar
						instance.animSidebar.set('from', {
							xy: [sidebarX, sidebarY]
						});
						instance.animSidebar.set('to', {
							xy: [sidebarNewX, sidebarY]
						});
						
						// Detach start and end callbacks for animSidebar
						instance.animSidebar.detach('start');
						instance.animSidebar.detach('end');
						
						// Define end callback for animSidebar
						instance.animSidebar.on('end', function(e) {
							var instance = this;
							instance.get(SIDEBAR_NODE).hide();
							
							// Set from and to values for animMainContent
							instance.animMainContent.set('from', {
								width: WIDTH_MAIN_CONTENT_STANDARD
							});
							instance.animMainContent.set('to', {
								width: WIDTH_MAIN_CONTENT_MAXIMIZED
							});
							
							// Detach start and end callbacks for animMainContent
							instance.animMainContent.detach('start');
							instance.animMainContent.detach('end');
							
							// Define end callback for animMainContent
							instance.animMainContent.on('end', function(e) {
								var instance = this;
								
								instance.showSidebarLink.show();
								instance.hideSidebarLink.hide();
							}, instance);
							
							instance.animMainContent.run();
						}, instance);
						
						// Run sidebar animation
						instance.animSidebar.run();
						
						// Set cookie
						A.Cookie.set(COOKIE_HIDE_SIDEBAR, 'true');
					},					
					
					_onClickShowHeader: function(e) {
						var instance = this;
						
						e.halt();
						
						// Set from and to values for animHeader
						instance.animHeader.set('from', {
							height: '0'
						});
						instance.animHeader.set('to', {
							height: instance.computedHeaderHeight
						});
						
						// Detach start and end callbacks for animHeader
						instance.animHeader.detach('start');
						instance.animHeader.detach('end');
						
						// Define end callback for animHeader
						instance.animHeader.on('end', function(e) {
							instance.showHeaderWrap.hide();
							instance.get(HEADER_NODE).removeClass('overflow-hidden');
						}, instance);
						
						// Run animation
						instance.animHeader.run();
					},
					
					_onClickShowSidebar: function(e) {
						var instance = this;
						
						e.halt();
						
						// Set from and to values for animMainContent
						instance.animMainContent.set('from', {
							width: WIDTH_MAIN_CONTENT_MAXIMIZED
						});
						instance.animMainContent.set('to', {
							width: WIDTH_MAIN_CONTENT_STANDARD
						});
						
						// Detach start and end callbacks for animMainContent
						instance.animMainContent.detach('start');
						instance.animMainContent.detach('end');
						
						// Define end callback for animMainContent
						instance.animMainContent.on('end', function(e) {
							var instance = this;
							
							// Show sidebar in order to give it a width
							instance.get(SIDEBAR_NODE).show();
							
							var computedMainContentHeightStr = instance.get(MAIN_CONTENT_NODE).getComputedStyle('height').replace('px', '');
							var computedMainContentHeight = parseInt(computedMainContentHeightStr);
							
							var sidebarX = instance.get(SIDEBAR_NODE).getX();
							var sidebarY = instance.get(SIDEBAR_NODE).getY();
							
							var sidebarNewX = sidebarX - instance.animSidebarPushX;
							
							// Set from and to values for animSidebar
							instance.animSidebar.set('from', {
								xy: [sidebarX, sidebarY]
							});
							instance.animSidebar.set('to', {
								xy: [sidebarNewX, sidebarY]
							});
							
							// Detach start and end callbacks for animSidebar
							instance.animSidebar.detach('start');
							instance.animSidebar.detach('end');
							
							// Define end callback for animSidebar
							instance.animSidebar.on('end', function(e) {
								instance.showSidebarLink.hide();
								instance.hideSidebarLink.show();
							}, instance);
							
							// Run sidebar animation
							instance.animSidebar.run();							
						}, instance);
						
						// Run animation
						instance.animMainContent.run();
						
						// Set cookie
						A.Cookie.set(COOKIE_HIDE_SIDEBAR, 'false');
					}					
					
				}
			}
	);

	A.VgrNovusMain = VgrNovusMain;
		
	},1, {
		requires: [
			'aui-base',
			'anim',
			'cookie',
			'substitute'
      ]
	}
);