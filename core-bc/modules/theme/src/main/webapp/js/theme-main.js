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

AUI().ready('rp-new-theme', 'vgr-novus-main', function(A) {
	var vgrNovusMain = new A.VgrNovusMain().render();
	var rpNewTheme = new A.RpNewTheme().render();;
});

Liferay.on('allPortletsReady',function() {
	AUI().use('aui-base', 'rp-footer-plugin', function(A) {
		var footerNode = A.one('#footer');
		if(footerNode) {
			footerNode.plug(A.Plugin.RpFooter);	
		}
	});
});