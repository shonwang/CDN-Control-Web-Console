define("kdmGlobleSetup.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var KdmGlobleSetupView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/kdmGlobleSetup/kdmGlobleSetup.html'])());

            this.initSetup();

            // this.collection.on("get.client.success", $.proxy(this.onGetClientMessage, this));
            // this.collection.on("get.client.error", $.proxy(this.onGetError, this));
        },

        initSetup: function(){
            this.kdmConfigData = {
                "config_interval": 5, //executor 拉取时间的间隔
                "whitelist": [ //全局白名单列表，可以有多个，也可以为空
                    {
                        "start": "10.0.0.0", //白名单段起始 ip
                        "end": "10.255.255.255" //白名单段结束 ip
                    }, {
                        "start": "11.11.11.11",
                        "end": "11.11.255.255"
                    }
                ],
                "source_ip": [ //executor 用来匹配全局白名单时，获取源 ip 所使用的头部，可以有多个，也可以为空
                    "xff",
                    "x-forwarded-for"
                ],
                "domain_expired": 60, //域名过期时间
                "snapshot_ttl": 180, //黑名单列表快照保存时间
                "enable": true //KDM全局开关
            }

            this.$el.find(".kdm-toggle .togglebutton input").get(0).checked = this.kdmConfigData.enable;
            this.$el.find("#domain-timemout").val(this.kdmConfigData.domain_expired);
            this.$el.find("#snapshoot-duration").val(this.kdmConfigData.snapshot_ttl);

            this.$el.find(".list-domain-statistics .togglebutton input").get(0).checked = false;
            this.$el.find(".domain-statistics .togglebutton input").get(0).checked = false;
            this.$el.find("#list-domain-max").val(0);

            this.$el.find(".add-ip").on("click", $.proxy(this.onClickAddSourceIp, this))
            this.convertSourceIpArray();    
            this.updateSourceIpTable();

            this.$el.find(".add-white-list").on("click", $.proxy(this.onClickAddWhiteList, this))
            this.convertWhiteListArray();    
            this.updateWhiteListTable();
        },

        convertWhiteListArray: function(){
            this.whiteListObjArray = [];
            _.each(this.kdmConfigData.whitelist, function(el, index, ls){
                this.whiteListObjArray.push({
                    id: Utility.randomStr(8),
                    start: el.start,
                    end: el.start
                })
            }.bind(this))
        },

        updateWhiteListTable: function(){
            this.$el.find(".white-list").find(".table").remove()
            this.whiteListTable = $(_.template(template['tpl/kdmGlobleSetup/kdmGlobleSetup.whiteList.table.html'])({
                data: this.whiteListObjArray
            }))
            this.$el.find(".white-list .table-ctn").html(this.whiteListTable.get(0));
            this.whiteListTable.find(".delete").on("click", $.proxy(this.onClickWhiteListTableItemDelete, this));
        },

        onClickWhiteListTableItemDelete: function(event){
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");

            var filterArray = _.filter(this.whiteListObjArray, function(obj){
                return obj.id !== id
            }.bind(this))

            this.whiteListObjArray = filterArray;
            this.updateWhiteListTable();
        },

        onClickAddWhiteList: function(event){
            var eventTarget = event.srcElement || event.target;

            var newStart = this.$el.find("#white-list-start").val(),
                newEnd = this.$el.find("#white-list-end").val();

            if (newStart === "" || newEnd === ""){
                alert("开始和结束都需要填写")
                return;
            }

            this.whiteListObjArray.push({
                id: Utility.randomStr(8),
                start: newStart,
                end: newEnd
            });
            this.updateWhiteListTable();

            this.$el.find("#white-list-start").val("");
            this.$el.find("#white-list-end").val("");
        },

        convertSourceIpArray: function(){
            this.sourceIpObjArray = [];
            _.each(this.kdmConfigData.source_ip, function(el, index, ls){
                this.sourceIpObjArray.push({
                    id: Utility.randomStr(8),
                    value: el
                })
            }.bind(this))
        },

        updateSourceIpTable: function(){
            this.$el.find(".origin-ip-table").find(".table").remove()
            this.sourceIpTable = $(_.template(template['tpl/kdmGlobleSetup/kdmGlobleSetup.sourceIp.table.html'])({
                data: this.sourceIpObjArray
            }))
            this.$el.find(".origin-ip-table .table-ctn").html(this.sourceIpTable.get(0));
            this.sourceIpTable.find(".delete").on("click", $.proxy(this.onClickSourceIpTableItemDelete, this));
        },

        onClickSourceIpTableItemDelete: function(event){
            var eventTarget = event.srcElement || event.target,
                id = $(eventTarget).attr("id");

            var filterArray = _.filter(this.sourceIpObjArray, function(obj){
                return obj.id !== id
            }.bind(this))

            this.sourceIpObjArray = filterArray;
            this.updateSourceIpTable();
        },
        
        onClickAddSourceIp: function(event){
            var eventTarget = event.srcElement || event.target;

            var newKey = this.$el.find("#origin-ip").val();

            if (newKey === ""){
                alert("你什么都没填")
                return;
            }

            this.sourceIpObjArray.push({
                id: Utility.randomStr(8),
                value: newKey
            });
            this.updateSourceIpTable();

            this.$el.find("#origin-ip").val("")
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

        update: function(){
            this.$el.show();
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return KdmGlobleSetupView;
});