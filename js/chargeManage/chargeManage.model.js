define("chargeManage.model", ['require','exports', 'utility'],function (require,exports,Utility) {
    var Model = Backbone.Model.extend({
        initialize:function () {
            var freeStartTime = this.get("freeStartTime"),
                freeEndTime = this.get("freeEndTime"),
                startChargingTime = this.get("startChargingTime"),
                mergeChargeTag = this.get("mergeChargeTag"),
                sharePortTag = this.get("sharePortTag");
            if(sharePortTag) this.set("sharePortTagName",sharePortTag.replace(/\&/g,''));
            if(mergeChargeTag)this.set("mergeChargeTagName",mergeChargeTag);
            if (startChargingTime) this.set("startChargingTimeFormated", new Date(startChargingTime).format("yyyy/MM/dd hh:mm"));
            if (freeStartTime) this.set("freeStartTimeFormated", new Date(startChargingTime).format("yyyy/MM/dd hh:mm"));
            if (freeEndTime) this.set("freeEndTimeFormated", new Date(startChargingTime).format("yyyy/MM/dd hh:mm"));
            this.set("isChecked", false);
        }
    });
    var chargeNodeManageCollection = Backbone.Collection.extend({

        model:Model,

        initialize: function(){},
        getAssociationNodeByTags:function(args){
            //这部分是为了获取共享出口的节点
            var url = BASE_URL + "/rs/node/getAssosicationNodeByTags",
                successCallback = function(res) {
                    if(res){
                        this.trigger("get.getAssociationNodeInfo.success", res);
                    } else {
                        this.trigger("get.getAssociationNodeInfo.error", res);
                    }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('get.getAssociationNodeInfo.error', response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },
        getNodeList:function (args) {
            //返回的是所有的节点信息
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
            defaultParas.success = function(res){
                this.reset();
                if (res){
                    _.each(res.rows, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))

                    this.total = res.total;
                    this.trigger("get.node.success", res.rows);
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
        getAllCity:function (args) {
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
        getLocation:function (args) {
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
        getAllContinent:function (args) {
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
        getCountryByContinent:function (args) {
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
        getOperationByCountry:function (args) {
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
        },
        getAllProvince:function (args) {
            var url = BASE_URL + "/rs/provCity/getAllProv",
                successCallback = function(res){
                    if (res)
                        this.trigger("get.province.success", res);
                    else
                        this.trigger("get.province.error", res);
                }.bind(this),
                errorCallback = function(response){
                    this.trigger("get.province.error", response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },
        getAllCityAndBigArea: function(args){
            var url = BASE_URL + "/rs/provCity/getAllCityAndBigArea",
                successCallback = function(res){
                    if (res)
                        this.trigger("get.cityByProvince.success", res);
                    else
                        this.trigger("get.cityByProvince.error", res);
                }.bind(this),
                errorCallback = function(response){
                    this.trigger("get.cityByProvince.error", response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },
        updateNode: function(args){
            // 这部分应该是更新节点信息，比如新建节点或者是对已有节点做出更改
            var url = BASE_URL + "/rs/node/modifyNode";
            var defaultParas = {
                type: "POST",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };
            defaultParas.data = JSON.stringify(args);
            defaultParas.success = function(){
                this.trigger("updateCharge.node.success");
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("updateCharge.node.error", response);
            }.bind(this);

            $.ajax(defaultParas);
        },
        //新增计费组反馈给后台
        addMergeTags:function (args) {
            var url = BASE_URL + "/rs/node/modifyMergeCharge",
            successCallback = function(res){
                if (res){
                    this.trigger("addCharge.success", res);
                }
                else{
                    this.trigger("addCharge.error", res);
                }
            }.bind(this),
                errorCallback = function(response){
                    this.trigger("addCharge.error", response);
                }.bind(this);
            Utility.putAjax(url,args,successCallback,errorCallback,30000)
        },
        //获取所有计费组名称
        getAllMergeTagNames:function (args) {
            var url = BASE_URL + "/rs/node/getAllMergeChargeTags",
                successCallback = function(res) {
                    if (res)
                        this.trigger("get.MergeChargeTags.success", res);
                    else
                        this.trigger("get.MergeChargeTags.error", res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger("get.MergeChargeTags.error", response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },
        //获取该计费组名下的所有节点信息
        getMergeTagOtherNodeInfo:function (args) {
            var url = BASE_URL + "/rs/node/getMergeChargeByTag?chargeTag=" + args,
                successCallback = function(res) {
                    if (res){
                        this.trigger("get.MergeChargeTagOtherNodeInfo.success", res);
                    }
                    else{
                        this.trigger("get.MergeChargeTagOtherNodeInfo.error", res);
                    }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger("get.MergeChargeTagOtherNodeInfo.error", response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        }
    });
    return chargeNodeManageCollection;
})