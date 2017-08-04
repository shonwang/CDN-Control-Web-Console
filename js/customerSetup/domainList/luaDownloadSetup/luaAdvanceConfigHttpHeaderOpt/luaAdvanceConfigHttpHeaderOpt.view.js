define("luaAdvanceConfigHttpHeaderOpt.view", ['require','exports', 'template', 'modal.view', 'utility','luaHttpHeaderOpt.view'], function(require, exports, template, Modal, Utility,LuaHttpHeaderOptView) {

    var LuaAdvanceConfigHttpHeaderOptView = LuaHttpHeaderOptView.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/luaDownloadSetup/luaAdvanceConfigHttpHeaderOpt/httpHeaderOpt.html'])());
            var domainInfo = {id:options.domainId};
            this.domainInfo = domainInfo;
            //this.optHeader = $('<a href="javascript:void(0)" class="btn btn-success add"><span class="glyphicon glyphicon-plus"></span>添加</a>');
            //this.optHeader.appendTo(this.$el.find(".opt-ctn"))

            this.collection.on("get.header.success", $.proxy(this.onChannelListSuccess, this));
            this.collection.on("get.header.error", $.proxy(this.onGetError, this));

            this.$el.find(".add").on("click", $.proxy(this.onClickAddRule, this));
            //this.$el.find(".save").on("click", $.proxy(this.onClickSaveBtn, this));

            this.$el.find(".publish").on("click", $.proxy(this.launchSendPopup, this));

            this.onClickQueryButton();
            this.collection.on("set.header.success", $.proxy(this.onSaveSuccess, this));
            this.collection.on("set.header.error", $.proxy(this.onGetError, this));
            this.collection.on("modify.header.success", $.proxy(this.onModifySuccess, this));
            this.collection.on("modify.header.error", $.proxy(this.onGetError, this));
            this.collection.on("del.header.success", $.proxy(this.onDelSuccess, this));
            this.collection.on("del.header.error", $.proxy(this.onGetError, this));
        },

        update: function(domainId, target){
            this.options.domainId = domainId;
            this.collection.off();
            this.collection.reset();
            this.$el.remove();
            this.initialize(this.options);
            this.render(target);
        }        
    });

    return LuaAdvanceConfigHttpHeaderOptView;
});