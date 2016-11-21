define("basicInformation.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var BasicInformationView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/basicInformation/basicInformation.html'])());
            var clientInfo = JSON.parse(options.query), 
                domainInfo = JSON.parse(options.query2);
                this.userInfo = {
                    clientName: clientInfo.clientName,
                    domain: domainInfo.domain,
                    uid: clientInfo.uid
                }
            this.domainInfo = domainInfo;
            this.optHeader = $(_.template(template['tpl/customerSetup/domainList/domainManage.header.html'])({
                data: this.userInfo,
                notShowBtn: true
            }));
            this.optHeader.appendTo(this.$el.find(".opt-ctn"));
            
            this.$el.find(".Remarks-type").on('click',$.proxy(this.onClickRadio,this));
            this.$el.find(".save").on('click',$.proxy(this.onClickSaveButton,this));
            this.defaultParam = {
                way : 1,
                remarks : null
            }

        },
        onClickRadio: function(event){
            var target = event.target || event.srcElement;
            if(target.tagName != 'INPUT') return;
            
            this.defaultParam.way = parseInt($(target).val());
        },
        onClickSaveButton: function(){
            this.defaultParam.remarks = this.$el.find("#Remarks").val();
            console.log(this.defaultParam);
        },
        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        hide: function(){
            this.$el.hide();
        },

        update: function(query, query2, target){
            this.options.query = query;
            this.options.query2 = query2;
            this.collection.off();
            this.collection.reset();
            this.$el.remove();
            this.initialize(this.options);
            this.render(target);
        },

        render: function(target){
            this.$el.appendTo(target);
            this.target = target
        }
    });

    return BasicInformationView;
});