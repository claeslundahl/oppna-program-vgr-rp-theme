AUI().add('rp-tyck-till',function(A) {
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
        
        DATA_ATTRIBUTE_DIALOG_URL = 'data-dialog-url',
		DIALOG_HEIGHT = 'dialogHeight',
		DIALOG_WIDTH = 'dialogWidth',
        
        TRIGGER = 'trigger',
        
        NAME = 'rp-tyck-till',
        NS = 'rp-tyck-till',
        
        CSS_DIALOG = 'rp-dialog tycktill-dialog',
        CSS_HIDDEN = 'aui-helper-hidden'
    ;
        
    var TPL_IFRAME = '<div class="iframe-wrap"><iframe src="{iframeSrc}" width="100%" height="100%"></iframe></div>'
	;    
        
    var TyckTill = A.Component.create(
            {
                ATTRS: {
                	
    				dialogHeight: {
    					value: 670
    				},
    				
    				dialogWidth: {
    					value: 670
    				},
                    
                    trigger: {
                        value: '#tycktillWrap a',
                        setter: A.one
                    }
                    
                },
                EXTENDS: A.Component,
                NAME: NAME,
                NS: NS,
                
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
                    },
    
                    bindUI: function() {
                        var instance = this;
                        
                        instance.get(TRIGGER).on('click', instance._onTriggerClick, instance);
                    },
                    
                    _launchDialog: function(dialogURL) {
                    	var instance = this;
                    	
						var bodyContent = A.substitute(TPL_IFRAME, {
							iframeSrc: dialogURL
						});
                    	
                    	
    					var dialog = new A.Dialog({
    						bodyContent: bodyContent,
    						centered: true,
    						constrain2view: true,
    						cssClass: CSS_DIALOG,
    						destroyOnClose: false, //http://issues.liferay.com/browse/AUI-393 setting this to true results in "this.fn is null"
    						height: instance.get(DIALOG_HEIGHT),
    						modal: true,
    						resizable: false,
    						width: instance.get(DIALOG_WIDTH),
    						title: instance.messages.dialog.title,
    						zIndex: 1000,
    						buttons: [
    			                        {
    				                        text: instance.messages.dialog.close,
    				                        handler: function() {
    					                        this.close();
    				                        }
    			                        }
    			            ]
    					}).render();
    					
    					dialog.on('render', instance._onDialogRender, instance, dialog);
                    	
    					dialog.after('close', function(e) {
    						var instance = this;
    						dialog.destroy();
    					}, instance, dialog);
                    	
                    },
                    
                    _onDialogRender: function(e) {
                    	var instance = this;
                    },
                    
                    _onTriggerClick: function(e) {
                    	var instance = this;
                    	
                    	e.halt();
                    	
                    	var linkNode = e.currentTarget;
                    	
                    	var dialogURL = linkNode.getAttribute(DATA_ATTRIBUTE_DIALOG_URL);
                    	
                    	instance._launchDialog(dialogURL);
                    },
                    
                    _someFunction: function() {
                        var instance = this;
                    }

                }
            }
    );

    A.TyckTill = TyckTill;
        
    },1, {
        requires: [
            'aui-base',
            'aui-io',
            'aui-loading-mask',
            'aui-dialog',
            'substitute'
      ]
    }
);
