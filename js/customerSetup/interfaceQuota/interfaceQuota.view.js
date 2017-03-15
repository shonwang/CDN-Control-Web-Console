define("interfaceQuota.view", ['require','exports', 'template', 'utility', "modal.view"],
    function(require, exports, template, Utility, Modal) {

    var EditView = Backbone.View.extend({

        initialize:function(options){
        },

        render:function(target){
            this.$el.appendTo(target);
        }
    });


    var InterfaceQuotaView = Backbone.View.extend({
        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/interfaceQuota/interfaceQuota.home.html'])({}));

            var clientInfo = JSON.parse(options.query);
            this.userInfo = {
                clientName: clientInfo.clientName,
                uid: clientInfo.uid
            }

            this.optHeader = $(_.template(template['tpl/customerSetup/customerSetup.header.html'])({
                data: this.userInfo
            }));
            this.optHeader.appendTo(this.$el.find(".opt-ctn"));
        },

        hide: function(){
            this.$el.hide();
        },

        update: function(query, target){
            this.isInitPaginator = false;
            this.options.query = query;
            this.collection.off();
            this.collection.reset();
            this.$el.remove();
            this.initialize(this.options);
            this.render(target);
        },

        render: function(target){
            this.$el.appendTo(target);
        }

    });

    return InterfaceQuotaView;

});