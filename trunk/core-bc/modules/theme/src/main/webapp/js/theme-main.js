// Plain javascript that runs before AUI is ready (to prevent content flashing

// Body
addCssClassName(document.body, 'js');

//Dockbar
var plainOldJsDockbarNode = document.getElementById('dockbarWrap');
addCssClassName(plainOldJsDockbarNode, 'aui-helper-hidden');

//Hide footer before positionFooter has been run
var plainOldJsfooterNode = document.getElementById('footer');
addCssClassName(plainOldJsfooterNode, 'aui-helper-hidden');

function addCssClassName(node, cssClassName) {
	if(node) {
		var newClassName = node.className + ' ' + cssClassName;
		node.className = newClassName;
	}
}

AUI().ready(
	'aui-base',
	'event',
	'rp-tyck-till',
	'rp-quick-access-nav',
	function(A) {
	
		var topNavigationNode = A.one('#topNavigation');
		var dockbarWrapNode = A.one('#dockbarWrap');
		
		initMainNavigation();
		initDockbarToggle();
		initQuickAccessNav();
		initTyckTill();
		initServerNodeInfo();
		
		// Toggle dockbar when settings is clicked in topnav
		function initDockbarToggle() {
			
			// Do nothing if there is no dockbar
			if(isNull(dockbarWrapNode)) { return; }
		
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
		}
		
		// Init main navigation
		function initMainNavigation() {
			
			var mainNavListItems = A.all('#navigation ul.nav-list > li');
			
			mainNavListItems.on('mouseenter', onMainNavItemEnter);
			mainNavListItems.on('mouseleave', onMainNavItemLeave);
		}
		
		function onMainNavItemEnter(e) {
			var currentTarget = e.currentTarget;
			currentTarget.addClass('hover');
		}
		
		function onMainNavItemLeave(e) {
			var currentTarget = e.currentTarget;
			currentTarget.removeClass('hover');
		}
		
		function initServerNodeInfo() {
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
		}
		
		// Init quick access navigation
		function initQuickAccessNav() {
			
			var trigger = A.one('#topNavigation .top-nav-quick-access a');
			
			var quickAccessNav = new A.QuickAccessNav({
				filterInputId: '#quickAccessFilterInput',
				trigger: trigger
			});
			
			quickAccessNav.render();
		}
		
		// Init "tyck till"-overlay behaviour
		function initTyckTill() {
			var trigger = A.one('#tycktillWrap a');
			
			var tyckTill = new A.TyckTill({
				trigger: trigger
			});
			
			tyckTill.render();
		}
		
		function isNull(object) {
			return A.Lang.isNull(object);
		}
	
	}
);

Liferay.on(
		'allPortletsReady',
		/* This function gets loaded when everything, including the portlets, is on the page. */

		function() {
			AUI().use(
				'aui-base',
				'console',
				function(A) {
					
					//initConsole();
					positionFooter();
					
					function initConsole() {
					    new A.Console({
					        height: '250px',
					        newestOnTop: false,
					        style: 'block',
					        visible: true,
					        width: '600px'
					    }).render();						
					}
					
					function positionFooter() {
						
						var bodyNode = A.one('body');
						var footerNode = A.one('#footer');
						
						// Show footer again (hidden in plain old js above)
						footerNode.show();
						
						var footerHeight = footerNode.get('clientHeight');
						var windowHeight = bodyNode.get('winHeight');
						var wrapperHeight = A.one('#wrapper').get('clientHeight');
						var scrollTop = document.documentElement.scrollTop;
						var footerTop = scrollTop + windowHeight - footerHeight;
						
						if(wrapperHeight + footerHeight < windowHeight) {
							footerNode.setStyle('position', 'absolute');
							footerNode.setStyle('top', footerTop + 'px');
						}
						
					}
					
				}
			);
		}
	);