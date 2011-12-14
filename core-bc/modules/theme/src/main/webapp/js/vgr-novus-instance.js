
// Hide sidebar with plain old javascript to prevent sidebar from showing before AUI is loaded
var sidebarNodeId = 'slide-container';
var mainContentId = 'main-container';
initSidebar();

AUI().ready('aui-base', 'vgr-novus-main', function(A) {

	var vgrNovusMain = new A.VgrNovusMain({
		mainContentNode: '#' + mainContentId,
		sidebarNode: '#' + sidebarNodeId
	}).render();
	
});

function initSidebar() {
	var hideSidebarCookie = getCookie('hideSidebar');
	
	var sidebarNode = document.getElementById(sidebarNodeId);
	var mainContentNode = document.getElementById(mainContentId);
	
	// Hide sidebar if cookie is true
	if(hideSidebarCookie && sidebarNode != null && sidebarNode != undefined) {
		var newSidebarClassNames = sidebarNode.className + ' aui-helper-hidden';
		sidebarNode.className = newSidebarClassNames;

		// Set width of main content to 100%
		mainContentNode.style.width = '100%';
	}	
}

function getCookie(cookieName) {
	var i,x,y,ARRcookies=document.cookie.split(';');
	for (i=0;i<ARRcookies.length;i++) {
  		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf('='));
  		y=ARRcookies[i].substr(ARRcookies[i].indexOf('=')+1);
  		x=x.replace(/^\s+|\s+$/g,'');
  		if (x==cookieName) {
    		return unescape(y);
    	}
  	}
}