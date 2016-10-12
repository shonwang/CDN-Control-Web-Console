define("subNavbar.view", ['require','exports', 'template'], function(require, exports, template) {

    var SubNavbarView = Backbone.View.extend({
        events: {
            //"click li":"open"
        },

        initialize: function(options) {
            this.options = options;
            this.query = options.query;
            this.query2 = options.query2;
            this.menuList = options.menuList;
            this.backHash = options.backHash;
            this.render();
        },

        initDefaultMenu: function(query, query2){
            this.menuList = [
                {
                    id: '',
                    name: '域名设置',
                    hash: 'javascript:void(0)',
                    children: [{
                        id: 'domainSetup',
                        name: '域名基础设置',
                        hash: 'index.html#/domainList/' + query + /domainSetup/ + query2,
                        active: true,
                        children: []
                    },{
                        id: 'cnameSetup',
                        name: 'CNAME设置',
                        hash: 'index.html#/domainList/' + query + /cnameSetup/ + query2,
                        active: false,
                        children: []
                    }]
                },{
                    id: '',
                    name: '源站配置',
                    hash: 'javascript:void(0)',
                    children: [{
                        id: 'backOriginSetup',
                        name: '回源配置',
                        hash: 'index.html#/domainList/' + query + /backOriginSetup/ + query2,
                        active: false,
                        children: []
                    }]
                },{
                    id: '',
                    name: 'HTTP协议优化',
                    hash: 'javascript:void(0)',
                    children: [{
                        id: 'following302',
                        name: 'Following 302',
                        hash: 'index.html#/domainList/' + query + /following302/ + query2,
                        active: false,
                        children: []
                    }]
                },{
                    id: '',
                    name: '缓存优化',
                    hash: 'javascript:void(0)',
                    children: [{
                        id: 'cacheRule',
                        name: '缓存规则',
                        hash: 'index.html#/domainList/' + query + /cacheRule/ + query2,
                        active: false,
                        children: []
                    },{
                        id: 'delMarkCache',
                        name: '去问号缓存',
                        hash: 'index.html#/domainList/' + query + /delMarkCache/ + query2,
                        active: false,
                        children: []
                    },{
                        id: 'cacheKeySetup',
                        name: '设置 Cache Key',
                        hash: 'index.html#/domainList/' + query + /cacheKeySetup/ + query2,
                        active: false,
                        children: []
                    }]
                },{
                    id: '',
                    name: '点播优化',
                    hash: 'javascript:void(0)',
                    children: [{
                        id: 'dragPlay',
                        name: '拖拽播放',
                        hash: 'index.html#/domainList/' + query + /dragPlay/ + query2,
                        active: false,
                        children: []
                    }]
                },{
                    id: '',
                    name: '限速',
                    hash: 'javascript:void(0)',
                    children: [{
                        id: 'clientLimitSpeed',
                        name: '客户端限速',
                        hash: 'index.html#/domainList/' + query + /clientLimitSpeed/ + query2,
                        active: false,
                        children: []
                    }]
                },{
                    id: '',
                    name: 'HTTP头控制',
                    hash: 'javascript:void(0)',
                    children: [{
                        id: 'httpHeaderOpt',
                        name: 'HTTP头的增删改查',
                        hash: 'index.html#/domainList/' + query + /httpHeaderOpt/ + query2,
                        active: false,
                        children: []
                    },{
                        id: 'httpHeaderCtr',
                        name: '常用HTTP头控制功能',
                        hash: 'index.html#/domainList/' + query + /httpHeaderCtr/ + query2,
                        active: false,
                        children: []
                    }]
                },{
                    id: '',
                    name: 'URL控制',
                    hash: 'javascript:void(0)',
                    children: [{
                        id: 'requestArgsModify',
                        name: '请求参数的改写',
                        hash: 'index.html#/domainList/' + query + /requestArgsModify/ + query2,
                        active: false,
                        children: []
                    }]
                },{
                    id: '',
                    name: '访问控制',
                    hash: 'javascript:void(0)',
                    children: [
                    // {
                    //     id: 'ipBlackWhiteList',
                    //     name: 'IP黑白名单',
                    //     hash: 'index.html#/domainList/' + query + /ipBlackWhiteList/ + query2,
                    //     active: false,
                    //     children: []
                    // },
                    {
                        id: 'refererAntiLeech',
                        name: 'Referer防盗链',
                        hash: 'index.html#/domainList/' + query + /refererAntiLeech/ + query2,
                        active: false,
                        children: []
                    },{
                        id: 'timestamp',
                        name: '时间戳+共享秘钥防盗链',
                        hash: 'index.html#/domainList/' + query + /timestamp/ + query2,
                        active: false,
                        children: []
                    }]
                },{
                    id: '',
                    name: '日志服务',
                    hash: 'javascript:void(0)',
                    children: [{
                        id: 'openNgxLog',
                        name: '开启Nginx计费日志',
                        hash: 'index.html#/domainList/' + query + /openNgxLog/ + query2,
                        active: false,
                        children: []
                    }]
                }
            ]
            this.backHash = 'index.html#/domainList/' + query;
        },

        select: function(id){
            var activeNode = this.$el.find('#' + id);
            if (activeNode.parent().css("display") == "none") {
                activeNode.parent().parent().click()
            }
            this.$el.find("#sub-jquery-accordion-menu").children("ul").find("li").removeClass("active");
            activeNode.addClass("active");
        },

        hide: function(){
            this.$el.hide();
        },

        update: function(query, query2, menuList, backHash){
            this.$el.show();
            this.$el.find("#sub-jquery-accordion-menu").remove();
            if (!menuList && !backHash) {
                this.initDefaultMenu(query, query2);
            } else {
                this.menuList = menuList;
                this.backHash = backHash;
            }
            this.menuNodes = $(_.template(template['tpl/subSidebar.html'])({
                data: this.menuList, 
                backHash: this.backHash
            })).find("#sub-jquery-accordion-menu");

            this.menuNodes.insertBefore(this.$el.find(".sub-content"));
            this.$el.find("#sub-jquery-accordion-menu").jqueryAccordionMenu();
        },

        render: function() {
            if (!this.menuList && !this.backHash) this.initDefaultMenu(this.query, this.query2);
            this.$el = $(_.template(template['tpl/subSidebar.html'])({data: this.menuList, backHash: this.backHash}));
            this.$el.appendTo($('.ksc-content'));
            this.$el.find("#sub-jquery-accordion-menu").jqueryAccordionMenu();
        }

    });

    return SubNavbarView;
});