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
        
        CSS_RP_DIALOG = 'rp-dialog',
        
        ANIM_EASING = A.Easing.easeOut,
        ANIM_DURATION = 0.6,
        COOKIE_HIDE_SIDEBAR = 'hideSidebar',
        WIDTH_MAIN_CONTENT_STANDARD = '80%',
        WIDTH_MAIN_CONTENT_MAXIMIZED = '100%',
        
        CUSTOM_LINK_CLICK_EVENT = 'event-kb-aggregator-link-click',
        
        DOCKBAR_NODE = 'dockbarNode',
        HEADER_NODE = 'headerNode',
        LAYOUT_GRID_NODE = 'layoutGridNode',
        NEWS_BOX = 'newsBox',
        MAIN_CONTENT_NODE = 'mainContentNode',
        SIDEBAR_NODE = 'sidebarNode',
        WRAPPER_NODE = 'wrapperNode',
        
        HREF = 'href',
        NAME = 'vgr-novus-main',
        NS = 'vgr-novus-main'
    ;
    
    var    TPL_HIDE_HEADER     = '<li class="nav-toolbar-item"><a class="hide-header" href="#" title="{titleText}">{linkText}</a></li>',
        TPL_SHOW_HEADER     = '<div class="show-header-wrap"><a href="#" class="show-header">{linkText}</a></div>',
        TPL_SIDEBAR_TOOLS = '<ul id="sidebarTools" class="sidebar-tools"></ul>',
        TPL_HIDE_SIDEBAR     = '<li><a class="hide-sidebar" href="#" title="{titleText}">{linkText}</a></li>',
        TPL_SHOW_SIDEBAR     = '<li><a class="show-sidebar" href="#" title="{titleText}">{linkText}</a></li>'
        
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
                    
                    layoutGridNode: {
                        value: '#layout-grid',
                        setter: A.one
                    },
                    
                    mainContentNode: {
                        value: '#main-container',
                        setter: A.one
                    },
                    
                    newsBox: {
                        setter: A.one,
                        value: '.news-box'
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
                    newsBoxCarousel: null,
                    newsBoxWrap: null,
                    
                    initializer: function(config) {
                        var instance = this;
                        
                        instance.messages = {};
                        
                        A.publish( CUSTOM_LINK_CLICK_EVENT, {
                        	defaultFn: function(e) {},
                        	broadcast: 1
                        });                        
                    },
                    
                    renderUI: function() {
                        var instance = this;
                        
                        instance._initNewsBoxCarousel();
                    },
    
                    bindUI: function() {
                        var instance = this;
                        
                        instance._bindKnowledgeBaseAggregator();
                    },
                    
                    _bindKnowledgeBaseAggregator: function() {
                        var instance = this;
                        
                        var kbAggregatorTitleLinks = A.all('.knowledge-base-portlet-aggregator .kb-results-body .kb-title a');
                        
                        if(kbAggregatorTitleLinks) {
                        	kbAggregatorTitleLinks.on('click', instance._onKBAggregatorTitleLinksClick, instance);
                        }
                    },
                    
                    // Carousel requires the vgr-customjsp-hook plugin to be installed to work properly
                    _initNewsBoxCarousel: function() {
                        var instance = this;
                        
                        var newsBox = instance.get(NEWS_BOX);
                        
                        if(isNull(newsBox) || isUndefined(newsBox)) {return;}
                        
                        var newsBoxWrap = newsBox.ancestor('.news-box-wrap');
                        instance.newsBoxWrap = newsBoxWrap;
                        
                        var computedNewsBoxWidthStr = newsBox.getComputedStyle('width').replace('px', '');
                        var computedNewsBoxWidth = parseInt(computedNewsBoxWidthStr);

                        var height = 220;
                        if(computedNewsBoxWidth < 540) {
                            height= 250;
                        }
                        
                        var newsBoxMenu = newsBox.ancestor().one('.news-box-menu');
                        
                        newsBoxMenu.show();
                        
                        instance.newsBoxCarousel = new A.Carousel({
                            intervalTime: 20,
                            contentBox: newsBox,
                            //activeIndex: 'rand',
                            activeIndex: 0,
                            height: height,
                            width: computedNewsBoxWidth,
                            nodeMenu: newsBoxMenu,
                            nodeMenuItemSelector: 'li'
                        }).render();

                        newsBox.all('a.news-box-link').removeClass('aui-helper-hidden');
                        newsBox.addClass('news-box-js');
                        
                        // Bind window size change event
                        A.on('windowresize', function(e) {
                            var newsBoxWrap = instance.newsBoxWrap;
                            
                            if(isNull(newsBoxWrap)) {return;}
                            
                            var computedNewsBoxWrapWidthStr = newsBoxWrap.getComputedStyle('width').replace('px', '');
                            var computedNewsBoxWrapWidth = parseInt(computedNewsBoxWrapWidthStr);
                            
                            instance.newsBoxCarousel.set('width', computedNewsBoxWrapWidth);

                            if(computedNewsBoxWrapWidth < 540) {
                                instance.newsBoxCarousel.set('height', 250);
                            }
                        });
                    },
                    
                    _onKBAggregatorTitleLinksClick: function(e) {
                        //hijacks the click and either shows the KB article in
                        //a modal dialog (default) or if the Aggregator Portlet
                        //has the class "display_in_help" it will issue a redirect
                        //to the help page
                        var instance = this;
                        
                        e.halt();
                                                            
                        var currentTarget = e.currentTarget;
                        var url = currentTarget.getAttribute('href');
                        
                        //check for class on portlet to decide what to do
                        var portlet = currentTarget.ancestor('.knowledge-base-portlet-aggregator');

                        if (portlet && portlet.hasClass('display_in_help')) {
                            //to display it in the help page we have to do a redirect,
                            //with a proper URL, the problem is that this URL needs an instance variable
                            //
                            //ie: from /knowledge_base_aggregator/tIa6/article/<id>/maximized
                            //to: /knowledge_base_display/<instance>/article/<id>
                            
                            var display = A.one('.knowledge-base-portlet-display');
                            if (display) {
                                var instance_id = display.attr('id').split('_INSTANCE_')[1];
                                if (instance_id) {
                                    //remove trailing _ 
                                    instance_id = instance_id.split('_')[0];
                                    url = url.replace(/knowledge_base_aggregator\/.+\/article\/([0-9]+)\/?.*/,'knowledge_base_display/'+instance_id+'/article/$1');
                                    window.location.href = url;
                                    return false;
                                }
                            }
                                    
                        }
                        
                        //open in modal window instead
                        var currentTitleNode = currentTarget.one('.taglib-text');
                        var currentTitle = currentTitleNode.html();
                        
                        var isPrivateLayout = themeDisplay.isPrivateLayout() == 'true';
                        
                        if(isPrivateLayout) {
                        	url = url.replace('/group/', '/widget/group/');
                        }
                        else {
                        	url = url.replace('/web/', '/widget/web/');	
                        }
                    
                        var dialogHeight = 500;
                        var dialogWidth = 700;
                    
                        var TPL_KB_IFRAME = '<div class="iframe-wrap"><iframe name="kbAggregatorDialog" id="kbAggregatorDialog" class="" title="" frameborder="0" src="{url}" width="{iframeWidth}" height="{iframeHeight}"></iframe></div>';
                    
                        var bodyContent = A.substitute(TPL_KB_IFRAME, {
                            iframeHeight: dialogHeight - 50,
                            iframeWidth: dialogWidth - 15,
                            url: url
                        });
                    
                        var dialog1 = new A.Dialog({
                            bodyContent: bodyContent,
                            centered: true,
                            constrain2view: true,
                            cssClass: CSS_RP_DIALOG,
                            destroyOnClose: true,
                            height: dialogHeight,
                            modal: true,
                            width: dialogWidth,
                            title: currentTitle
                        }).render();
                        
                        A.fire(CUSTOM_LINK_CLICK_EVENT, {currentTarget: currentTarget});
                    },

                    _onQuickNavigationClick: function(e) {
                        var instance = this;

                        e.halt();

                        var quickLinksDiv = A.one('#quick-links');

                        quickLinksDiv.toggle();
                    }

                }
            }
    );

    A.VgrNovusMain = VgrNovusMain;
        
    },1, {
        requires: [
            'aui-base',
            'aui-carousel',
            'aui-dialog',
            'aui-loading-mask',
            'aui-overlay',
            'aui-tooltip',
            'anim',
            'cookie',
            'event-custom',
            'event-resize',
            'substitute'
      ]
    }
);
