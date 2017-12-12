define("navbar.view", ['require','exports', 'template'], function(require, exports, template) {

    var SearchView = Backbone.View.extend({
        initialize: function(options) {
            this.keyWord = options.keyWord
            //this.collection = options.collection;
            this.$el = $(_.template(template['tpl/search.view.html'])());
            this.$el.find(".search-detail .search-detail-ctn").html(_.template(template['tpl/empty-2.html'])({data: {message: "张彬在胸前摸索了一番，却什么也没有找到！"}}));

            this.$el.find(".search-detail .glyphicon-remove").on("click", $.proxy(this.remove, this));
        },

        remove: function(){
            this.$el.find(".search-detail").removeClass("fadeInDown animated");
            this.$el.find(".search-detail").addClass("fadeOutUp animated");
            setTimeout(function(){
                this.$el.remove();
            }.bind(this), 500)
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    var NavbarView = Backbone.View.extend({
        events: {
            //"click li":"open"
        },

        initialize: function() {
            //this.initLogin();
            this.initLogout();
            this.initSidebarToggle();
            this.initGlobleSearch();
            this.isRender = false;
            this.isLogin = false;
            window.IS_ALERT_SAVE = false;
        },

        initGlobleSearch: function(){
            $(".search-ctn input").on("keydown", function(event) {
                var keyWord = $(".search-ctn input").val();
                if(keyWord === "") return
                if(event.keyCode == 13){
                    event.stopPropagation();
                    event.preventDefault();
                    if (this.mySearchView) {
                        this.mySearchView.remove();
                        this.mySearchView = null;
                    }
                    this.mySearchView = new SearchView({keyWord: keyWord});
                    setTimeout(function(){
                        this.mySearchView.render($(document.body));
                    }.bind(this), 500)
                }
            }.bind(this))
            $(".search-ctn .glyphicon-remove").on("click", function(){
                $(".search-ctn input").val("");
            })
        },

        initSidebarToggle: function(){
            $(".sidebar-btn").on("click", function() {
                if ($(".ksyun-logo").hasClass("shrink")){
                    $(".ksyun-logo").removeClass("shrink");
                    $(".ctrl-main-container").removeClass("large");
                    $("#jquery-accordion-menu").removeClass("packup-sidebar");
                    $(".sidebar-btn").removeClass("sidebar-open-btn");
                } else {
                    $(".ksyun-logo").addClass("shrink");
                    $(".ctrl-main-container").addClass("large");
                    $("#jquery-accordion-menu").addClass("packup-sidebar");
                    $(".sidebar-btn").addClass("sidebar-open-btn");
                }
            })
        },

        initLogout: function(){
            $(".logout").on("click", function() {
                var data = {
                    url            : BASE_URL + "/gateway/admin/login/out?" + new Date().valueOf(),
                    type           : "GET",
                    queryData      : {},
                    successCallBack: function(res){
                        this.redirect();
                    }.bind(this),
                    errorCallBack  : function(){
                        alert("权限系统岂是你说来就来，说走就走的！！！")
                    }
                }
                this.sendRequest(data)
            }.bind(this))
        },

        select: function(id, callback){
            var activeNode = this.$el.find('#' + id);
            if (activeNode.parent().css("display") == "none") {
                activeNode.parent().parent().click()
            }
            $("#jquery-accordion-menu").children("ul").find("li").removeClass("active");
            activeNode.addClass("active");

            callback && callback()
        },

        initLogin: function(callback){
            var data = {
                url            : BASE_URL + "/gateway/auth/owns/authed?" + new Date().valueOf(),
                type           : "GET",
                queryData      : {},
                successCallBack: function(res){
                    if (res && res.userInfoVo && res.purviewList) {
                        $(".user-name").html(res.userInfoVo.name);
                        window.AUTH_OBJ = {};
                        _.each(res.purviewList.list, function(el, index, list){
                            window.AUTH_OBJ[el.value] = el.auth === -1 ? false : true;
                            if (DEBUG === 1 || DEBUG === 1.1 || DEBUG === 1.2)
                                window.AUTH_OBJ[el.value] === true;
                        })
                        console.log(AUTH_OBJ)
                        callback&&callback();
                        if (!this.isRender) this.render();
                    } else {
                        this.redirect();
                    }
                }.bind(this),
                errorCallBack  : function(){
                    this.redirect();
                }.bind(this)

            }
            if (!this.isLogin){
                this.sendRequest(data, true);
                this.isLogin = true;
            } else {
                callback&&callback();
            }
        },

        redirect : function (url) {
            if (DEBUG === 1 || DEBUG === 1.1 || DEBUG === 1.2) return;
            var tpl = '<div id="loginTips" class="modal fade bs-example-modal-sm">' + 
                        '<div class="modal-dialog modal-sm">' + 
                            '<div class="modal-content" style="text-align:center;padding:5px">' + 
                                '<div class="modal-header"><h3 class="modal-title">请登录</h3></div>' + 
                                '<div class="modal-body">您还没有登录,请登陆后访问本页面.系统正在为您跳转到登录页面, 如果未能自动跳转，请手动刷新！</div>' + 
                            '</div>' + 
                        '</div>' + 
                      '</div>'
            var $loginTops = $(tpl),
                url = url || 'login.html',
                options = {
                    backdrop:'static'
                };
            $loginTops.modal(options);
            setTimeout(function(){
                location.href = url;
            }, 2000);
        },

        sendRequest: function (data, isJson) {
            var defaultParas = {
                type: data.type,
                url: data.url,
                async: true,
                timeout: 60000
            };

            defaultParas.data = data.queryData;

            defaultParas.beforeSend = function(xhr){
                if (isJson)
                    xhr.setRequestHeader("Accept","application/json, text/plain, */*");
                xhr.setRequestHeader("systemKey","resourcemanager");
            }
            
            defaultParas.success = function(res){
                data.successCallBack&&data.successCallBack(res)
            }
                
            defaultParas.error = function(response, msg){
                data.errorCallBack&&data.errorCallBack(response, msg)
            }

            if (this.request) this.request.abort();
            this.request = $.ajax(defaultParas);
        },

        render: function() {
            this.$el = $(_.template(template['tpl/sidebar.html'])({permission:AUTH_OBJ}));
            this.$el.appendTo($('.jquery-accordion-menu'));
            this.$el.find("li a").on("click", $.proxy(this.onClickItem, this))
            $("#jquery-accordion-menu").jqueryAccordionMenu();
            this.isRender = true;
        },

        onClickItem: function(event){
            var eventTarget = event.srcElement || event.target, path, result;
            if (eventTarget.tagName == "SPAN" || eventTarget.tagName == "I") {
                eventTarget = $(eventTarget).parent();
                path = eventTarget.attr("path");
            } else {
                path = $(eventTarget).attr("path");
            };
            if (!path) return;

            if (window.IS_ALERT_SAVE && path.indexOf(location.hash) === -1) {
                result = confirm("你还没有保存，确定离开本页面吗？")
                if (result) {
                    this.redirectHash(path)
                    window.IS_ALERT_SAVE = false
                } 
            } else {
                this.redirectHash(path)
            }
        },

        redirectHash: function(path){
            if (path.indexOf("map.html") > -1) {
                location.href = path
            } else {
                location.href = path
            }
        }

    });

    return NavbarView;
});