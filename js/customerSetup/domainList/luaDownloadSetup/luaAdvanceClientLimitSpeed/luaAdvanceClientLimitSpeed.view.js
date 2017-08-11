define("luaAdvanceClientLimitSpeed.view", ['require', 'exports', 'template', 'modal.view', 'utility', 'luaClientLimitSpeed.view'],
    function(require, exports, template, Modal, Utility, LuaClientLimitSpeedView) {

        var ClientLimitSpeedView = LuaClientLimitSpeedView.extend({
            events: {},

            initialize: function(options) {
                this.collection = options.collection;
                this.options = options;
                this.domainInfo = this.options.domainInfo;
                this.locationId = this.options.locationId;

                this.$el = $(_.template(template['tpl/customerSetup/domainList/luaDownloadSetup/mainCtn.html'])({data: {}}));
                this.$el = $(this.$el.find(".well").get(1));
                this.$el.removeClass("well");
                this.$el.find(".main-ctn").html(_.template(template['tpl/loading.html'])({}));

                this.collection.on("get.speed.success", $.proxy(this.initSetup, this));
                this.collection.on("get.speed.error", $.proxy(this.onGetError, this));
                this.collection.on("set.speed.success", $.proxy(this.onSaveSuccess, this));
                this.collection.on("set.speed.error", $.proxy(this.onGetError, this));
                this.collection.getClientSpeed({
                    originId: this.domainInfo.id,
                    locationId: this.locationId
                });

                this.$el.find(".save").on("click", $.proxy(this.onBeforeClickSaveBtn, this));

                this.defaultParam = {
                    byteNotLimit: 1,
                    byteNotLimitUnit: 1,
                    limitSpeedToggle: 1,
                    limitSpeed: 0,
                    preUnlimit: 0,
                    timeLimitList: [],
                }
            },

            onBeforeClickSaveBtn:function(){
                this.defaultParam.locationId = this.locationId;
                this.onClickSaveBtn();
            },

            update: function(domainInfo, locationId, target) {
                this.options.domainInfo = domainInfo;
                this.options.locationId = locationId;
                this.collection.off();
                this.collection.reset();
                this.$el.remove();
                this.initialize(this.options);
                this.render(target);
            }
        });

        return ClientLimitSpeedView;
    });