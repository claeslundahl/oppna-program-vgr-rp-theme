AUI().add('rp-system-help',function(A) {
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
        
        CUSTOM_KB_LINK_CLICK_EVENT = 'event-kb-aggregator-link-click',
        
        SIDEBAR_HELP_TRIGGER_ID = 'sidebarHelpTrigger',
        
        SIDEBAR_TOOLS = 'sidebarTools',
        
        SYSTEMS_HELP_AGGREGATOR = 'systemsHelpAggregator',
        
        NAME = 'rp-system-help',
        NS = 'rp-system-help',
        
        CSS_ACTIVE = 'active',
        CSS_LFR_PANEL = 'lfr-panel',
        CSS_HIDDEN = 'aui-helper-hidden',
        CSS_SYSTEMS_HELP_OVERLAY = 'system-help-overlay'
    ;
        
    var TPL_HELP_TRIGGER = '<a id="{nodeId}" href="#sidebar-help" class="sidebar-help">{helpLabel}</a>'
	;
        
    var SystemHelp = A.Component.create(
            {
                ATTRS: {
                	
                	sidebarTools: {
                		value: '#toolsSidebar',
                		setter: A.one
                	},
                	
                	systemsHelpAggregator: {
                		value: '#systemsHelpAggregator',
                		setter: A.one
                	}
                },
                EXTENDS: A.Component,
                NAME: NAME,
                NS: NS,
                
                overlay: null,
                trigger: null,
                
                prototype: {
                    
                    initializer: function(config) {
                        var instance = this;
                        
                        instance.messages = {};
                        
                        instance.messages.trigger = {};
    					instance.messages.overlay = {};
    					
    					instance.messages.trigger.label = 'Hja&auml;lp';
                    },
                    
                    renderUI: function() {
                        var instance = this;
                        
                        //instance._initConsole();
                        instance._initTrigger();
                        instance._initOverlay();
                    },
    
                    bindUI: function() {
                        var instance = this;
                        
                        if(!isNull(instance.trigger)) {
                        	instance.trigger.on('click', instance._onTriggerClick, instance);
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
                    
                    _initTrigger: function() {
                    	var instance = this;
                    	
                    	var sidebarTools = instance.get(SIDEBAR_TOOLS);
                    	
						var triggerHtml = A.substitute(TPL_HELP_TRIGGER, {
							nodeId: SIDEBAR_HELP_TRIGGER_ID,
							helpLabel: instance.messages.trigger.label
						});
						
						sidebarTools.prepend(triggerHtml);
                    	
						var trigger = sidebarTools.one('#' + SIDEBAR_HELP_TRIGGER_ID);
                    	
						instance.trigger = trigger;
                    },
                    
                    _initOverlay:function () {
                        var instance = this;

                        var trigger = instance.trigger;
                        
                        var systemsHelpAggregator = instance.get(SYSTEMS_HELP_AGGREGATOR);
                        
                        var panel = systemsHelpAggregator.one('.' + CSS_LFR_PANEL);
                        
                        // Do nothing if there is no panel
                        if(isNull(panel)) {
                        	return;
                        }
                        
                        var bodyContent = panel;

                        var overlay = new A.OverlayContextPanel({
                            align:{
                                node: trigger,
                                points: [A.WidgetPositionAlign.TR, A.WidgetPositionAlign.TL]
                            },
                            anim: true,
                            bodyContent: bodyContent,
                            boundingBox: '#systemHelpOverlayContextPanel',
                            cancellableHide: true,
                            cssClass: CSS_SYSTEMS_HELP_OVERLAY,
                            hideDelay: 200,
                            hideOnDocumentClick: true,
                            showArrow: false,
                            trigger: trigger,
                            width: '300px'
                        });
                        
                        overlay.on('hide', instance._onOverlayHide, instance);
                        overlay.on('show', instance._onOverlayShow, instance);
                        overlay.on('render', instance._onOverlayRender, instance);

                        overlay.render();
                        
                        instance.overlay = overlay;
                    },
                    
                    _onClickCustomEventKbLink: function(e) {
                    	var instance = this;
                    	
                    	var currentTarget = e.currentTarget;
                    	
                    	var overlayContentBox = instance.overlay.get('contentBox');
                    	
                    	var isInOverlay = overlayContentBox.contains(currentTarget);
                    	
                    	if(isInOverlay) {
                    		instance.overlay.hide();
                    	}
                    },
                    
                    _onOverlayHide: function (e) {
                        var instance = this;
                        
                        var overlay = e.currentTarget;

                        instance.trigger.removeClass(CSS_ACTIVE);
                    },
                    
                    _onOverlayRender: function (e) {
                        var instance = this;
                        
                        var overlay = e.currentTarget;
                        
                        A.on(CUSTOM_KB_LINK_CLICK_EVENT, instance._onClickCustomEventKbLink, instance);
                    },
                    
                    _onOverlayShow: function (e) {
                        var instance = this;

                        var overlay = e.currentTarget;
                        
                        instance.trigger.addClass(CSS_ACTIVE);
                    },
                    
                    _onTriggerClick: function(e) {
                    	var instance = this;
                    	
                    	e.halt(true);
                    },
                    
                    _someFunction: function() {
                        var instance = this;
                    }

                }
            }
    );

    A.SystemHelp = SystemHelp;
        
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
