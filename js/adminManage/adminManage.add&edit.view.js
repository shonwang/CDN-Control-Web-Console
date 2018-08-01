define("adminManage.add&edit.view", ['require','exports', 'template', 'modal.view', 'utility'], 
    function(require, exports, template, Modal, Utility) {

    var AdminAddOrEditView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.isEdit = options.isEdit;
            this.model = options.model
            this.$el = $(_.template(template['tpl/adminManage/adminManage.add&edit.html'])());
          
            this.$el.find("#dropdown-dispatch").attr("disabled", "disabled");
            this.$el.find("#dropdown-topo").attr("disabled", "disabled");

            this.collection.off("get.type.success");
            this.collection.off("get.type.error");
            this.collection.on("get.type.success", $.proxy(this.onGetTypeSuccess, this));
            this.collection.on("get.type.error", $.proxy(this.onGetError, this));
            this.collection.getTypeInfo();

            this.collection.off("get.topoInfo.success");
            this.collection.off("get.topoInfo.error");
            this.collection.on("get.topoInfo.success", $.proxy(this.onGetTopoInfoSuccess, this));
            this.collection.on("get.topoInfo.error", $.proxy(this.onGetError, this));
            this.collection.getTopoInfo({
                "name": null,
                "type": null,
                "page": 1,
                "size": 10
            });

            this.collection.off("get.dispGroup.success");
            this.collection.off("get.dispGroup.error");
            this.collection.on("get.dispGroup.success", $.proxy(this.onGetDispGroupSuccess, this));
            this.collection.on("get.dispGroup.error", $.proxy(this.onGetError, this));
            this.collection.getDispGroupList()

            if(this.isEdit){
                console.log("ooooooo")
                this.defaultParam = {
                    "userId": this.model.userId,
                    "type": this.model.applicationType,
                    "topoId": this.model.topoId,
                    "topoName": this.model.topoName,
                    "dispgroupName": this.model.dispgroupName,
                    "dispgroupId": this.model.dispgroupId,
                }
                this.$el.find("#input-id").val(this.defaultParam.userId)
            }else{
                this.defaultParam = {
                    "userId": null,
                    "type": null,
                    "topoId": null,
                    "topoName": null,
                    "dispgroupName": null,
                    "dispgroupId": null,
                }
            }
            
        },

        initTypeMenu: function(){
            if(this.isEdit){
                _.each(this.typeList, function(el){
                    console.log(el)
                    if(el.value == this.defaultParam.type){
                        this.defaultParam.typeName = el.name
                    }
                    if(this.defaultParam.type == 20){
                        this.defaultParam.typeName = "test"
                    }
                }.bind(this))
                console.log(this.defaultParam.typeName)
                this.$el.find(".dropdown-type .cur-value").html(this.defaultParam.typeName)
            }
            Utility.initDropMenu(this.$el.find(".dropdown-type"), this.typeList, function(value) {
                this.defaultParam.type = parseInt(value);
                this.initTopoMenu()
            }.bind(this));  
            console.log(this.defaultParam.type)

        },

        initTopoMenu: function(){
            var objArray = [{
                name: "请选择",
                value: null
            }]
            if(this.isEdit){
                this.$el.find(".dropdown-topo .cur-value").html(this.defaultParam.topoName)
            }
            if(this.defaultParam.type){
                this.$el.find("#dropdown-topo").removeAttr("disabled");
                var topoArrayList = _.filter(this.topoList, function(el){
                    return el.type === this.defaultParam.type
                }.bind(this))
            }else{
                this.$el.find("#dropdown-topo").attr("disabled", "disabled");
                return false
            }
            if(topoArrayList){
                Utility.initDropMenu(this.$el.find(".dropdown-topo"), topoArrayList, function(value) {
                    this.defaultParam.topoId = parseInt(value);
                    _.each(topoArrayList, function(el){
                        if(el.value == this.defaultParam.topoId){
                            this.defaultParam.topoName = el.name
                        }
                    }.bind(this))
                    this.$el.find("#dropdown-dispatch .cur-value").html(objArray[0].name)
                    this.defaultParam.dispgroupId = objArray[0].value
                    this.defaultParam.dispgroupName = objArray[0].name
                    console.log("yyyyy", this.defaultParam.dispgroupId)
                    this.initDispGroupMenu()
                }.bind(this));     
            }
             
        },

        initDispGroupMenu: function(){
            if(this.isEdit){
                this.$el.find(".dropdown-dispatch .cur-value").html(this.defaultParam.dispgroupName)
            }
            if(this.defaultParam.topoId){
                this.$el.find("#dropdown-dispatch").removeAttr("disabled");
                var dispArrayList = _.filter(this.dispGroupList, function(el){
                    return el.topoId === this.defaultParam.topoId
                }.bind(this))
            }else{
                this.$el.find("#dropdown-dispatch").attr("disabled", "disabled");
                return false;
            }
            if(dispArrayList){
                if(dispArrayList.length === 0){
                    dispArrayList.push({
                        name: "无",
                        value: 0
                    })
                }
                Utility.initDropMenu(this.$el.find(".dropdown-dispatch"), dispArrayList, function(value) {
                    if(value != 0){
                        this.defaultParam.dispgroupId = parseInt(value);
                        _.each(dispArrayList, function(el){
                            if(el.value == this.defaultParam.dispgroupId){
                                this.defaultParam.dispgroupName = el.name
                            }
                        }.bind(this))
                    }else{
                        this.defaultParam.dispgroupId = null;
                        this.defaultParam.dispgroupName = null
                    }
                }.bind(this));  
            }
        },

        onGetDispGroupSuccess: function(data){
            this.dispGroupList = [];
            _.each(data.rows, function(el){
                var tempObj = {
                    value: el.id,
                    name: el.dispDomain,
                    topoId: el.topoId,
                    topoName: el.topoName
                }
                this.dispGroupList.push(tempObj)
            }.bind(this))
            this.initDispGroupMenu();
        },

        onGetTopoInfoSuccess: function(data){
            this.topoList = [];
            _.each(data, function(el){
                var tempObj = {
                    value: el.id,
                    name: el.name,
                    type: el.type,
                    typeName: el.typeName
                }
                this.topoList.push(tempObj)
            }.bind(this))
            this.initTopoMenu();
        },

        onGetTypeSuccess: function(data){
            this.typeList = [];
            _.each(data, function(el){
                if(el.id === 202 || el.id === 203){
                    var tempObj = {
                        name: el.name,
                        value: el.id
                    }
                    this.typeList.push(tempObj)
                }
             }.bind(this))
            this.initTypeMenu();
        },

        getArgs: function(){
            this.defaultParam.userId = parseInt(this.$el.find("#input-id").val());
            console.log("jjjj",this.defaultParam)
            if(!this.defaultParam.userId){
                Utility.warning("请设置正确的客户ID");
                return false
            }
            if(!this.defaultParam.type){
                Utility.warning("平台类型不能为空");
                return false
            }
            if(!this.defaultParam.topoId){
                console.log(this.defaultParam.topoId)
                Utility.warning("拓扑不能为空");
                return false
            }
            if(!this.defaultParam.dispgroupId){
                Utility.warning("调度组不能为空");
                return false
            }
            var postParam = {
                "userId": this.defaultParam.userId,
                "applicationType": this.defaultParam.type,
                "topoId": this.defaultParam.topoId,
                "topoName": this.defaultParam.topoName,
                "dispgroupId": this.defaultParam.dispgroupId,
                "dispgroupName": this.defaultParam.dispgroupName
            }
            return postParam
        },

        onGetError: function(error){
            if (error&&error.message)
                Utility.alerts(error.message)
            else{
                console.log("uuuuuuu")
                Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
            }
            
        },

        hide: function(){
            this.$el.hide();
            $(document).off('keydown');
        },

        update: function(){
            this.$el.show();
            // this.enterKeyBindQuery();
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    
    return AdminAddOrEditView;
});