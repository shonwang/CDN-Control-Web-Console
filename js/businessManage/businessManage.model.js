define("businessManage.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
        }
    });

    var BusinessManageCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getNodeGroupList: function(args){
            var url = BASE_URL + "/seed/config/release/pageList?bisTypeId="+args;
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000,
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
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };

            defaultParas.success = function(res){
                this.reset();
                if (res){
                    _.each(res, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.trigger("get.device.success");
                } else {
                    this.trigger("get.device.error"); 
                }
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
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };

            defaultParas.success = function(res){
                this.reset();
                if (res){
                    _.each(res, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.trigger("get.businessList.success");
                } else {
                    this.trigger("get.businessList.error"); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.businessList.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getAddTableList: function(data){
        	var url = BASE_URL + "/rs/node/list";
            var defaultParas = {
                type: "POST",
                url: url,
                async: true,
                timeout: 30000,
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
                this.reset();
                if (res){
                    _.each(res.rows, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.trigger("get.addTableList.success");
                } else {
                    this.trigger("get.addTableList.error"); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.addTableList.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getDeviceList: function(){
        	var url = BASE_URL + "/seed/metaData/devicetype/list";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };

            defaultParas.success = function(res){
                this.reset();
                if (res){
                    _.each(res, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.trigger("get.deviceList.success");
                } else {
                    this.trigger("get.deviceList.error"); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.deviceList.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },
        addNode: function(data){
        	var url = BASE_URL + "/seed/config/release/addNodeGroup";
            var defaultParas = {
                type: "POST",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };

            defaultParas.data = JSON.stringify(data);

            defaultParas.success = function(res){
                this.reset();
                if (res){
                    _.each(res, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.trigger("get.addNode.success");
                } else {
                    this.trigger("get.addNode.error"); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.addNode.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },
        editNode: function(data){
        	var url = BASE_URL + "/seed/config/release/modifyNodeGroup";
            var defaultParas = {
                type: "POST",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };

            defaultParas.data = JSON.stringify(data);

            defaultParas.success = function(res){
                this.reset();
                if (res){
                    _.each(res, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.trigger("get.editNode.success");
                } else {
                    this.trigger("get.editNode.error"); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.editNode.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        }

    });

    return BusinessManageCollection;
});