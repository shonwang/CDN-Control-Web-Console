define("grayscaleSetup.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var createTime = this.get("createTime");
            if (createTime) this.set("createTimeFormated", new Date(createTime).format("yyyy/MM/dd hh:mm"));
        }
    });

    var GrayscaleSetupCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getDomainPageList: function(args){
            var url = BASE_URL + "/seed/gray/domain/pageList";
            //var url = "http://192.168.158.85:9098/seed/gray/domain/pageList";
            var defaultParas = {
                type: "POST",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };
            defaultParas.data = JSON.stringify(args);

            defaultParas.success = function(res){
                this.reset();
                if (res){
                    _.each(res.rows, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.total;
                    this.trigger("get.domainPageList.success");
                } else {
                    this.trigger("get.domainPageList.error"); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.domainPageList.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getNodeList: function(args){
            var url = BASE_URL + "/rs/node/list";
            var defaultParas = {
                type: "POST",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };
            
            defaultParas.data = args || {
                "page"    : 1,
                "count"   : 99999,
                "chname"  : null,//节点名称
                "operator": null,//运营商id
                "status"  : null//节点状态
            };
            defaultParas.data = JSON.stringify(defaultParas.data);

            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                if (res){
                    this.trigger("get.node.success", res);
                } else {
                    this.trigger("get.node.error", res); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.node.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getBusinessList: function(){
            var url = BASE_URL + "/seed/metaData/config/release/list";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };

            defaultParas.success = function(res){
                this.trigger("get.businessList.success",res);
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.businessList.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        addDomain: function(args){
            var url = BASE_URL + "/seed/gray/domain/addDomain";
            var defaultParas = {
                type: "POST",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };
            defaultParas.data = JSON.stringify(args);

            defaultParas.success = function(res){
                this.trigger("add.graydomain.success");
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("add.graydomain.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        editDomain: function(args){
            var url = BASE_URL + "/seed/gray/domain/modifyDomain";
            var defaultParas = {
                type: "POST",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };
            defaultParas.data = JSON.stringify(args);

            defaultParas.success = function(res){
                this.trigger("edit.graydomain.success");
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("edit.graydomain.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getConfList: function(args){
            var url = BASE_URL + "/seed/conf/file/confList";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000
            };
            defaultParas.data = args;

            defaultParas.success = function(res){
                this.trigger("get.confList.success",res);
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.confList.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        deleteGrayDomain: function(args){
            var url = BASE_URL + "/seed/gray/domain/delete";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000
            };
            defaultParas.data = args;

            defaultParas.success = function(res){
                this.trigger("delete.grayDomain.success",res);
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("delete.grayDomain.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getSyncProgress: function(args){
            var url = BASE_URL + "/seed/gray/domain/globalSyncStatus";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000
            };
            defaultParas.data = args;

            defaultParas.success = function(res){
                this.trigger("get.syncProgress.success",res);
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.syncProgress.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getSync: function(args){
            var url = BASE_URL + "/seed/gray/domain/globalSync";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000
            };
            defaultParas.data = args;

            defaultParas.success = function(res){
                this.trigger("get.sync.success",res);
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.sync.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getNodeGroupTree: function(args){
            var url = BASE_URL + "/seed/gray/domain/getNodeGroupTreeData";
            //var url = "http://192.168.158.85:9098/seed/gray/domain/getNodeGroupTreeData";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000
            };
            defaultParas.data = args;

            defaultParas.success = function(res){
                this.trigger("get.nodeGroupTree.success",res);
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.nodeGroupTree.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getEditData: function(args){
            var url = BASE_URL + "/seed/gray/domain/tomodify";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000
            };
            defaultParas.data = args;

            defaultParas.success = function(res){
                this.trigger("get.editData.success",res);
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.editData.error", response);
            }.bind(this);

            $.ajax(defaultParas);
        }

    });

    return GrayscaleSetupCollection;
});