define("domainSetup.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    
    var DomainSetupView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/domainSetup/domainSetup.html'])());
            var clientInfo = JSON.parse(options.query), 
                domainInfo = JSON.parse(options.query2),
                userInfo = {
                    clientName: clientInfo.clientName,
                    domain: domainInfo.domain,
                    uid: clientInfo.uid
                }
            this.optHeader = $(_.template(template['tpl/customerSetup/domainList/domainManage.header.html'])({
                data: userInfo,
                notShowBtn: true
            }));
            this.optHeader.appendTo(this.$el.find(".opt-ctn"));

            this.$el.find(".save").on("click", $.proxy(this.onClickSaveButton, this))

            var regions = {
                hasData: true,
                data: [
                    {"id":1.0,"region":"CN","name":"中国大陆","cdnFactory":"ksc"},
                    {"id":2.0,"region":"AS","name":"亚洲","cdnFactory":"ksc"},
                    {"id":3.0,"region":"NA","name":"北美洲","cdnFactory":"ksc"},
                    {"id":4.0,"region":"EU","name":"欧洲和中东","cdnFactory":"ksc"},
                    {"id":5.0,"region":"AU","name":"澳洲","cdnFactory":"ksc"},
                    {"id":6.0,"region":"AF","name":"非洲","cdnFactory":"ksc"},
                    {"id":7.0,"region":"SA","name":"南美洲","cdnFactory":"ksc"}
                ]
            };
            this.regionList = {};
            this.setRegionData(regions.data)
        },

        checkRegion:function(){
            var region=this.getRegion();
            if(region.length<1){
                this.regionCtn.find("#cdn-regions-error").show();
                return false;
            }
            //this.args.Regions = region.join(",");
            return true;
        },

        getRegion:function(){
            var regionList = this.regionList;
            var arr=[];
            for(var i in regionList){
                arr.push(regionList[i]);
            }
            return arr;
        },

        setRegionData:function(data){
            this.regionData = data;
            this.regionCtn =  $(_.template(template['tpl/customerSetup/domainList/cdn.region.list.html'])({data:data}));
            this.$el.find(".cdn-region-ctn").html(this.regionCtn);

            this.regionCtn.find("input[type=checkbox]").bind("click",$.proxy(this.onClickRegionCheckbox,this));
            
        },
        
        onClickRegionCheckbox:function(){
            this.regionCtn.find("#cdn-regions-error").hide();
            var regionRadios = this.regionCtn.find("input[type=checkbox]");
            var obj={};
            for(var i=0;i<regionRadios.length;i++){
                if(regionRadios[i].checked){
                    var _value =regionRadios[i].value;
                    obj[_value]=_value;
                }
            }
            this.regionList = obj;
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onChannelListSuccess: function(){
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        onClickSaveButton: function(){
            if(!this.checkRegion()){
                return false;
            }
            this.launchSendPopup();
        },

        launchSendPopup: function(){
            require(["saveThenSend.view", "saveThenSend.model"], function(SaveThenSendView, SaveThenSendModel){
                var mySaveThenSendView = new SaveThenSendView({
                    collection: this.collection, 
                });
                var options = {
                    title: "发布",
                    body : mySaveThenSendView,
                    backdrop : 'static',
                    type     : 2,
                    onOKCallback:  function(){
                        this.sendPopup.$el.modal("hide");
                    }.bind(this),
                    onHiddenCallback: function(){
                        if (this.sendPopup) $("#" + this.sendPopup.modalId).remove();
                    }.bind(this)
                }
                this.sendPopup = new Modal(options);
            }.bind(this))
        },

        hide: function(){
            this.$el.hide();
        },

        update: function(query){
            this.options.query = query;
            this.collection.off();
            this.collection.reset();
            this.$el.remove();
            this.initialize(this.options);
            this.render(this.target);
        },

        render: function(target){
            this.$el.appendTo(target);
            this.target = target;
        }
    });

    return DomainSetupView;
});