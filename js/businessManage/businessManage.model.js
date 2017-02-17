define("businessManage.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
        }
    });

    var BusinessManageCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getNodeGroupList: function(args){
            var url = BASE_URL + "/seed/config/release/nodeGroupList?bisTypeId="+args;
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 10 * 60 * 1000,
                contentType: "application/json",
                processData: false
            };

            defaultParas.success = function(res){
            	this.reset();
                if (res){
                    _.each(res.nodeGroupList, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.trigger("get.nodeGroupList.success");
                } else {
                    this.trigger("get.nodeGroupList.error"); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.nodeGroupList.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getDeviceTypeList: function(){
        	var url = BASE_URL + "/seed/metaData/devicetype/list";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 10 * 60 * 1000,
                contentType: "application/json",
                processData: false
            };

            defaultParas.success = function(res){
                this.trigger("get.device.success",res);
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.device.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getBusinessList: function(){
        	var url = BASE_URL + "/seed/metaData/config/release/list";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 10 * 60 * 1000,
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

        getIpList: function(){
            var url = BASE_URL + "/resource/rs/metaData/ipTypeList";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 10 * 60 * 1000,
                contentType: "application/json",
                processData: false
            };

            defaultParas.success = function(res){
                this.trigger("get.ipList.success",res);
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.ipList.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getAddTableList: function(data){
        	var url = BASE_URL + "/rs/node/list";
            var defaultParas = {
                type: "POST",
                url: url,
                async: true,
                timeout: 10 * 60 * 1000,
                contentType: "application/json",
                processData: false
            };
            defaultParas.data = {
                "page"    : 1,
                "count"   : 99999,
                "chname"  : null,//节点名称
                "operator": null,//运营商id
                "status"  : null//节点状态
            };
            defaultParas.data = JSON.stringify(defaultParas.data);

            defaultParas.success = function(res){
                this.trigger("get.addTableList.success",res);
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.addTableList.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        nodeListToAddNodeGroup: function(args){
            var url = BASE_URL + "/rs/node/nodeListToAddNodeGroup",
            successCallback = function(res){
                if (res)
                    this.trigger("get.addTableList.success", res);
                else
                    this.trigger("get.addTableList.error", res); 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.addTableList.error", response);
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        addNode: function(data){
        	var url = BASE_URL + "/seed/config/release/addNodeGroup";
            var defaultParas = {
                type: "POST",
                url: url,
                async: true,
                timeout: 10 * 60 * 1000,
                contentType: "application/json",
                processData: false
            };

            defaultParas.data = JSON.stringify(data);

            defaultParas.success = function(res){
            	 this.trigger("add.node.success");
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("add.node.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },
        editNode: function(data){
        	var url = BASE_URL + "/seed/config/release/modifyNodeGroup";
            var defaultParas = {
                type: "POST",
                url: url,
                async: true,
                timeout: 10 * 60 * 1000,
                contentType: "application/json",
                processData: false
            };

            defaultParas.data = JSON.stringify(data);

            defaultParas.success = function(res){
                this.trigger("edit.node.success");
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("edit.node.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        }

    });

    return BusinessManageCollection;
});