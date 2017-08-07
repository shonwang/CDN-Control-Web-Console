define("luaAdvanceTimestamp.view", ['require','exports', 'template', 'modal.view', 'utility', 'luaTimestamp.view'], 
    function(require, exports, template, Modal, Utility, LuaTimestampView) {

    var TimestampView = LuaTimestampView.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.domainInfo = this.options.domainInfo;
            this.locationId = this.options.locationId;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/luaDownloadSetup/mainCtn.html'])({data: {}}));
            this.$el = $(this.$el.find(".well").get(1));
            this.$el.removeClass("well");
            this.luaTimestampEl = $(_.template(template['tpl/customerSetup/domainList/timestamp/timestamp.add.html'])());
            this.luaTimestampEl.appendTo(this.$el.find(".main-ctn"));

            this.collection.on("get.protection.success", $.proxy(this.initSetup, this));
            this.collection.on("get.protection.error", $.proxy(this.onGetError, this));
            this.collection.on("set.protection.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.protection.error", $.proxy(this.onGetError, this));
            this.collection.getStandardProtection({originId: this.domainInfo.id})

            this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));

            this.defaultParam = {
                isBaseSetup: 1,
                antiLeech: 1,
                baseSecretKeyPrimary: "",
                baseSecretKeyBackup: [],
                baseDeadline: 1,

                encryption: 1,
                mtPosition: 2,
                timestampType: 2,
                advancedDeadline: 1,
                advancedSecretKeyPrimary: "",
                advancedSecretKeyBackup: [],
                spliceMd5: 1,
                timeParam: "",
                hashParam: "",
                authFactor: "",
                atuthDivisorArray: [{
                    "id": -1,
                    "divisor": 6,
                }, {
                    "id": -2,
                    "divisor": 2,
                }, {
                    "id": -3,
                    "divisor": 5,
                }],
                md5Truncate: "",
            };
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

    return TimestampView;
});