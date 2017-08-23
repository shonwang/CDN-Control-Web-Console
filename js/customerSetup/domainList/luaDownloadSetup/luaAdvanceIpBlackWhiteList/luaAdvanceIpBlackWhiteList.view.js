define("luaAdvanceIpBlackWhiteList.view", ['require','exports', 'template', 'modal.view', 'utility', 'luaIpBlackWhiteList.view'], 
    function(require, exports, template, Modal, Utility, LuaIpBlackWhiteList) {

    var IpBlackWhiteListView = LuaIpBlackWhiteList.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.domainInfo = this.options.domainInfo;
            this.locationId = this.options.locationId;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/luaDownloadSetup/mainCtn.html'])({data: {}}));
            this.$el = $(this.$el.find(".well").get(1));
            this.$el.removeClass("well");
            this.luaIpBlackWhiteListEl = $(_.template(template['tpl/customerSetup/domainList/ipBlackWhiteList/ipBlackWhiteList.add.html'])());
            this.luaIpBlackWhiteListEl.appendTo(this.$el.find(".main-ctn"));

            this.defaultParam = {
                refererType: 1,
                ips: "",
                openFlag: 0
            };
            
            this.collection.on("get.IPSafetyChainList.success", $.proxy(this.initSetup, this));
            this.collection.on("get.IPSafetyChainList.error", $.proxy(this.onGetError, this));
            this.collection.on("set.IPSafetyChain.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.IPSafetyChain.error", $.proxy(this.onGetError, this));
            this.collection.getIPSafetyChain({
                originId: this.domainInfo.id,
                locationId: this.locationId
            })

            this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));

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

    return IpBlackWhiteListView;
});