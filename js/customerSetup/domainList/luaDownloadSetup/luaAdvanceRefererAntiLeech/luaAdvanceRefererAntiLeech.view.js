define("luaAdvanceRefererAntiLeech.view", ['require','exports', 'template', 'modal.view', 'utility', 'luaRefererAntiLeech.view'], 
    function(require, exports, template, Modal, Utility, LuaRefererAntiLeech) {

    var RefererAntiLeechView = LuaRefererAntiLeech.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.domainInfo = this.options.domainInfo;
            this.locationId = this.options.locationId;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/luaDownloadSetup/mainCtn.html'])({data: {}}));
            this.$el = $(this.$el.find(".well").get(1));
            this.$el.removeClass("well");
            this.luaRefererAntiLeechEl = $(_.template(template['tpl/customerSetup/domainList/refererAntiLeech/refererAntiLeech.add.html'])());
            this.luaRefererAntiLeechEl.appendTo(this.$el.find(".main-ctn"));

            this.defaultParam = {
                refererType: 1,
                domains: "",
                nullReferer: 0,
                openFlag: 0
            };
            this.collection.on("get.refer.success", $.proxy(this.initSetup, this));
            this.collection.on("get.refer.error", $.proxy(this.onGetError, this));
            this.collection.on("set.refer.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.refer.error", $.proxy(this.onGetError, this));
            this.collection.getReferSafetyChain({
                originId: this.domainInfo.id,
                locationId: this.locationId
            });

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

    return RefererAntiLeechView;
});