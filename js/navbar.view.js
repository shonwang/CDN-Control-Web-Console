define("navbar.view", ['require','exports', 'template'], function(require, exports, template) {

    var NavbarView = Backbone.View.extend({
        events: {
            //"click li":"open"
        },

        initialize: function() {
            this.$el = $(_.template(template['tpl/navbar.html'])());
            this.initLogin();
        },

        // select: function(id){
        //     this.$el.find(".list-group-item").removeClass("current");
        //     this.$el.find('#' + id).addClass("current");
        // },

        initLogin: function(){
            var redirect = function (url) {
                var tpl = '<div id="loginTips" class="modal fade bs-example-modal-sm">' + 
                            '<div class="modal-dialog modal-sm">' + 
                                '<div class="modal-content" style="text-align:center;padding:5px">' + 
                                    '<div class="modal-header"><h3 class="modal-title">请登录</h3></div>' + 
                                    '<div class="modal-body">您还没有登录,请登陆后访问本页面.系统正在为您跳转到登录页面...</div>' + 
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
            };

            var sendRequest = function (data) {
                var defaultParas = {
                    type: data.type,
                    url: data.url,
                    async: true,
                    timeout: 60000
                };

                defaultParas.data = data.queryData;

                defaultParas.beforeSend = function(xhr){
                    xhr.setRequestHeader("Accept","application/json, text/plain, */*");
                }
                
                defaultParas.success = function(res){
                    data.successCallBack&&data.successCallBack(res)
                }
                    
                defaultParas.error = function(response, msg){
                    data.errorCallBack&&data.errorCallBack(response, msg)
                }

                $.ajax(defaultParas);
            };

            var data = {
                url            : BASE_URL + "/rs/login/isLogined?" + new Date().valueOf(),
                type           : "GET",
                queryData      : {},
                successCallBack: function(res){
                    if (res) {
                        $(".nav-username").html();
                    } else {
                        redirect();
                    }
                }.bind(this),
                errorCallBack  : function(){
                    redirect();
                }

            }
            sendRequest(data)
        },

        render: function(target) {
            this.$el.appendTo(target)
        }

    });

    return NavbarView;
});