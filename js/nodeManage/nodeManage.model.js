define("nodeManage.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var status     = this.get("status"),
                createTime = this.get("createTime"),
                chargingType = this.get("chargingType"),
                startChargingTime = this.get("startChargingTime");
            if (status === 3) this.set("statusName", '<span class="label label-danger">已关闭</span>');
            if (status === 2) this.set("statusName",'<span class="label label-warning">挂起</span>');
            if (status === 1) this.set("statusName", '<span class="label label-success">运行中</span>');

            if (chargingType === 1) this.set("chargingTypeName", '95峰值');
            if (chargingType === 0) this.set("chargingTypeName", '免费');

            if (createTime) this.set("createTimeFormated", new Date(createTime).format("yyyy/MM/dd hh:mm"));
            if (startChargingTime) this.set("startChargingTimeFormated", new Date(startChargingTime).format("yyyy/MM/dd hh:mm"));
            this.set("isChecked", false);
        }
    });

    var NodeManageCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

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
            defaultParas.data = JSON.stringify(args);

            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                this.reset();
                if (res){
                    _.each(res.rows, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.total;
                    this.trigger("get.node.success");
                } else {
                    this.trigger("get.node.error"); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.node.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        addNode: function(args){
            var url = BASE_URL + "/rs/node/addNode"
            var defaultParas = {
                type: "POST",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };
            defaultParas.data = JSON.stringify(args);
            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(){
                this.trigger("add.node.success"); 
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("add.node.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        updateNode: function(args){
            var url = BASE_URL + "/rs/node/modifyNode"
            var defaultParas = {
                type: "POST",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };
            defaultParas.data = JSON.stringify(args);
            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(){
                this.trigger("update.node.success"); 
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("update.node.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        deleteNode: function(args){
            var url = BASE_URL + "/rs/node/deleteNode"
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000
            };
            defaultParas.data = args;
            defaultParas.data.t = new Date().valueOf();
            
            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(){
                this.trigger("delete.node.success"); 
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("delete.node.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getOperatorList: function(args){
            var url = BASE_URL + "/rs/metaData/operatorList?" + new Date().valueOf(); 
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000
            };

            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                this.trigger("get.operator.success", res); 
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.operator.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getAllCity: function(args){
            var url = BASE_URL + "/rs/query/getAllAddr?" + new Date().valueOf(); 
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000
            };

            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                this.trigger("get.city.success", res); 
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.city.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getLocation: function(args){
            var url = BASE_URL + "/rs/query/location"; 
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000
            };

            defaultParas.data = {addr: args.addr, t: new Date().valueOf()}
            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                this.trigger("get.location.success", res); 
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.location.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        updateNodeStatus: function(args){
            var url = BASE_URL + "/rs/node/modifyStatus";
            var defaultParas = {
                type: "POST",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };
            defaultParas.data = JSON.stringify(args);

            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                this.trigger("update.node.status.success", res);
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("update.node.status.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getAssocateDispGroups: function(args){
            var url = BASE_URL + "/rs/node/getAssocateDispGroups",
            successCallback = function(res){
                if (res)
                    this.trigger("get.assocateDispGroups.success", res);
                else
                    this.trigger("get.assocateDispGroups.error", res); 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.assocateDispGroups.error", response);
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        addAssocateDispGroups: function(args, nodeId){
            var url = BASE_URL + "/rs/node/addAssocateDispGroups?nodeId=" + nodeId,
            successCallback = function(res){
                this.trigger("add.assocateDispGroups.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("add.assocateDispGroups.error", response);
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        getAllContinent: function(args){
            var url = BASE_URL + "/rs/metaData/continent/list",
            successCallback = function(res){
                if (res)
                    this.trigger("get.continent.success", res);
                else
                    this.trigger("get.continent.error", res); 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.continent.error", response);
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        getCountryByContinent: function(args){
            var url = BASE_URL + "/rs/metaData/continent/country/list",
            successCallback = function(res){
                if (res)
                    this.trigger("get.countryByContinent.success", res);
                else
                    this.trigger("get.countryByContinent.error", res); 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.countryByContinent.error", response);
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        getOperationByCountry: function(args){
            var url = BASE_URL + "/rs/metaData/continent/country/operation/list",
            successCallback = function(res){
                if (res)
                    this.trigger("get.operationByCountry.success", res);
                else
                    this.trigger("get.operationByCountry.error", res); 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.operationByCountry.error", response);
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        }

    });

    return NodeManageCollection;
});