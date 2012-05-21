AUI().add('rp-quick-access-nav',function(A) {
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
        
        FILTER_INPUT_ID = 'filterInputId',
        
        NAME = 'rp-quick-access-nav',
        NS = 'rp-quick-access-nav',
        
        TRIGGER = 'trigger',
        
        CSS_ACTIVE = 'active',
        CSS_HIDDEN = 'aui-helper-hidden',
        CSS_QUICK_ACCESS_NAV_LIST = 'quick-access-nav-list',
        CSS_QUICK_ACCESS_NAV_OVERLAY = 'quick-access-overlay',
        CSS_QUICK_ACCESS_NAV_PROTOTYPE = 'quick-access-nav-prototype'
    ;
        
    var QuickAccessNav = A.Component.create(
            {
                ATTRS: {
                	filterInputId: {
                		value: '#quickAccessFilterInput'
                	},
                	trigger: {
                		value: '#topNavigation .top-nav-quick-access a',
                		setter: A.one
                	}
                },
                EXTENDS: A.Component,
                NAME: NAME,
                NS: NS,
                
                liveSearch: null,
                overlayPanel: null,
                
                prototype: {
                    
                    initializer: function(config) {
                        var instance = this;
                        
                        instance.messages = {};
                        
    					instance.messages.dialog = {};
    					
    					instance.messages.dialog.title = 'Tyck till';
    					instance.messages.dialog.close = 'St&auml;ng';
                    },
                    
                    renderUI: function() {
                        var instance = this;
                        
                        var trigger = instance.get(TRIGGER);
                        
                        var triggerListNode = trigger.ancestor('li');
                        
                        if(triggerListNode) {
                        	triggerListNode.show();	
                        }
                        
                        instance._initOverlay(trigger);
                    },
    
                    bindUI: function() {
                        var instance = this;
                        
                        instance.get(TRIGGER).on('click', function(e) {
                        	e.preventDefault();
                        }, instance);
                    },
                    
                    _getOverlayBodyContent: function() {
                    	var instance = this;
                    	
                    	return instance.overlayPanel.getStdModNode(A.WidgetStdMod.BODY);
                    },
                    
                    _initLiveSearch: function() {
                    	var instance = this;
                    	
                    	var bodyContentNode = instance._getOverlayBodyContent();
                    	
                    	var filterInput = bodyContentNode.one(instance.get(FILTER_INPUT_ID));
                    	var filterNodes = bodyContentNode.all('.' + CSS_QUICK_ACCESS_NAV_LIST + ' a');
                    	
                    	instance.liveSearch = new A.LiveSearch({
                    		input: filterInput,
                    		nodes: filterNodes,
                    		cssClass: 'rp-live-search',
                    		
                    		data: function(node) {
                    			return node.html();
                    		},

                    		show: function(node) {
                    			var listNode = node.ancestor('li');
                    			
                    			var isFirstLevel = listNode.hasClass('first-level');
                    			
                    			if(!isFirstLevel) {
                    				var firstLevelNode = node.ancestor('.first-level');
                    				firstLevelNode.show().setAttribute('nodeStatus', 'show');
                    			}
                    			
                    			listNode.show().setAttribute('nodeStatus', 'show');
                    		},

                    		hide: function(node) {
                    			if (!node.hasClass('excluded')) {
                    				var listNode = node.ancestor('li');
                    				
                    				var hideNode = true;
                    				
                    				var isFirstLevel = listNode.hasClass('first-level');
                    				
                        			if(isFirstLevel) {
                        				var hasVisibleChildren = (node.all('li.:not(.' + CSS_HIDDEN + ')').size() > 0);
                        				hideNode = !hasVisibleChildren;
                        			}
                        			
                        			if(hideNode) {
                        				listNode.hide().setAttribute('nodeStatus', 'hide');
                        			}
                    			}
                    		}
                		});
                    	
                    },
                    
                    _initOverlay: function(trigger) {
                    	var instance = this;
                    	
                    	var listNode = trigger.ancestor('li');
                    	var markupPrototypeNode = listNode.one('.' + CSS_QUICK_ACCESS_NAV_PROTOTYPE);

                    	var bodyContent = markupPrototypeNode.html();

                    	markupPrototypeNode.remove();
                    	markupPrototypeNode.destroy(true);
                    	
                    	instance.overlayPanel = new A.OverlayContextPanel({
                    		align: {
                    			node: trigger,
                    			points: [A.WidgetPositionAlign.TR, A.WidgetPositionAlign.BR]
                    		},
                    		anim: true,
                    		bodyContent: bodyContent,
                    		boundingBox: '#quick-access-overlay-context-panel',
                    		cancellableHide: true,
                    		cssClass: CSS_QUICK_ACCESS_NAV_OVERLAY,
                    		hideDelay: 200,
                    		hideOnDocumentClick: true,
                    		showArrow: false,
                    		trigger: trigger,
                    		width: '780px'
                		});
                    	
                    	instance.overlayPanel.render();
                    	
                    	instance._initLiveSearch();
                    	
                    	instance.overlayPanel.on('hide', instance._onQuickAccessOverlayHide, instance);
                    	instance.overlayPanel.on('show', instance._onQuickAccessOverlayShow, instance);
                    	
                    	instance.overlayPanel.after('show', instance._afterQuickAccessOverlayShow, instance);
                    },
                    
                    _onQuickAccessOverlayHide: function(e) {
                    	var instance = this;
                    	
                    	var overlay = e.currentTarget;
                    	
                    	var triggers = overlay.get('trigger');

                    	triggers.each(function(item, index, list) {
                    		item.removeClass(CSS_ACTIVE);
                    	});
                    	
                    	if(instance.liveSearch) {
                    		instance.liveSearch.destroy();
                    	}
                    },
                    
                    _afterQuickAccessOverlayShow: function(e) {
                    	var instance = this;
                    	
                    	var overlay = e.currentTarget;
                    	/*
                    	var bodyContentNode = overlay.getStdModNode(A.WidgetStdMod.BODY);
                    	var filterLabel = bodyContentNode.one('.filter-wrap label');
                    	filterLabel.simulate('click');
                    	*/
                    },
                    
                    
                    _onQuickAccessOverlayShow: function(e) {
                    	var instance = this;
                    	
                    	var overlay = e.currentTarget;
                    	
                    	var triggers = overlay.get('trigger');

                    	triggers.each(function(item, index, list) {
                    		item.addClass(CSS_ACTIVE);
                    	});
                    	
                    },
                    
                    _someFunction: function() {
                        var instance = this;
                    }

                }
            }
    );

    A.QuickAccessNav = QuickAccessNav;
        
    },1, {
        requires: [
            'aui-base',
            'aui-live-search',
            'aui-loading-mask',
            'aui-overlay',
            'node-event-simulate',
            'substitute'
      ]
    }
);
