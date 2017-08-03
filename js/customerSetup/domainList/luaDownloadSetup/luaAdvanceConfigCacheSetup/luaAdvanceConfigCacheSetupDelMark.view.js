define("luaAdvanceConfigCacheSetupDelMark.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var LuaAdvanceConfigCacheSetupDelMarkView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.target = options.target;
            this.initSetup();
            
        },

        initSetup:function(){
            //请求接口后设置缓存时间
            this.$el = $(_.template(template['tpl/customerSetup/domainList/luaDownloadSetup/luaAdvanceConfigCacheSetup/delMark.html'])());
            this.render();
        },

        update: function(target){
            this.options.target = target;
            this.collection.off();
            this.$el.remove();
            this.initialize(this.options);
        },
        
        render:function(){
            this.$el.appendTo(this.target);
        }

    });

    return LuaAdvanceConfigCacheSetupDelMarkView;
});