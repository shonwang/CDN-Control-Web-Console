define("hashOrigin.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var status     = this.get("status"),
                type       = this.get("type"),
                autoFlag   = this.get("autoFlag"),
                createTime = this.get("createTime"),
                isMulti    = this.get("isMulti"),
                updateTime = this.get("updateTime");
            if(type == "202"){
                this.set("typeName","Cache");
            }
            else if(type == "203"){
                this.set("typeName","Live")
            }
            if(autoFlag == 1){
                this.set("autoFlagName","允许");
            }
            else{
                this.set("autoFlagName","不允许");
            }

            if(isMulti==1){
                this.set("isMultiName","是");
            }
            else {
                this.set("isMultiName","否");
            }
            if (createTime) this.set("createTimeFormated", new Date(createTime).format("yyyy/MM/dd hh:mm"));
            if (updateTime) this.set("updateTimeFormated", new Date(updateTime).format("yyyy/MM/dd hh:mm"));
        }
    });

    var HashOriginCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},
        
        getAreaList: function(args) {
            var url = BASE_URL + "/rs/provCity/selectAllArea",
                successCallback = function(res) {
                    if (res)
                        this.trigger("get.area.success", res);
                    else
                        this.trigger("get.area.error", res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger("get.area.error", response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        getHashList: function(args){
            var url = BASE_URL + "/rs/hash/list";
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
                    this.trigger("get.hashOrigin.success",res);
                } else {
                    this.trigger("get.hashOrigin.error",res); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.device.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },


        getHashInfoById:function(args){
            var url = BASE_URL + "/rs/hash/getHashInfoById?id="+args,
            successCallback = function(res) {
                if (res)
                    this.trigger("get.hashInfo.success", res);
                else
                    this.trigger("get.hashInfo.error", res);
            }.bind(this),
            errorCallback = function(response) {
                this.trigger("get.hashInfo.error", response);
            }.bind(this);
            Utility.getAjax(url, {}, successCallback, errorCallback);            
        },

        addHashOrigin:function(args){
            var url = BASE_URL + "/rs/hash/add",
            successCallback = function(res) {
                if (res)
                    this.trigger("add.hashOrigin.success", res);
                else
                    this.trigger("add.hashOrigin.error", res);
            }.bind(this),
            errorCallback = function(response) {
                this.trigger("add.hashOrigin.error", response);
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);             
        },

        modifyHashOrigin:function(args){
            var url = BASE_URL + "/rs/hash/modify",
            successCallback = function(res) {
                if (res)
                    this.trigger("modify.hashOrigin.success", res);
                else
                    this.trigger("modify.hashOrigin.error", res);
            }.bind(this),
            errorCallback = function(response) {
                this.trigger("modify.hashOrigin.error", response);
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);    
        },

        selectStrategyByHashId:function(args){
            var url = BASE_URL + "/resource/special/selectStrategyByHashId?hashId="+args,
            successCallback = function(res) {
                if (res)
                    this.trigger("check.hashOrigin.success", res);
                else
                    this.trigger("check.hashOrigin.error", res);
            }.bind(this),
            errorCallback = function(response) {
                this.trigger("check.hashOrigin.error", response);
            }.bind(this);
            Utility.getAjax(url, {}, successCallback, errorCallback);  
        },

        sendBatchStratefyTask:function(args){
            var url = BASE_URL + "/resource/special/sendBatchStratefyTask",
            successCallback = function(res) {
                if (res)
                    this.trigger("sendBatchStratefy.success", res);
                else
                    this.trigger("sendBatchStratefy.error", res);
            }.bind(this),
            errorCallback = function(response) {
                this.trigger("sendBatchStratefy.error", response);
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);              
        }

        // operatorTypeList: function(){
        //     var url = BASE_URL + "/rs/metaData/continent/country/operation/list?id=401";
        //     var defaultParas = {
        //         type: "GET",
        //         url: url,
        //         async: true,
        //         timeout: 30000,
        //     };
        //     /*defaultParas.data = args || {};
        //     defaultParas.data.t = new Date().valueOf();*/

        //     defaultParas.beforeSend = function(xhr){
        //         //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
        //     }
        //     defaultParas.success = function(res){
        //         if (res)
        //             this.trigger("operator.type.success", res.rows);
        //         else
        //             this.trigger("operator.type.error");
        //     }.bind(this);

        //     defaultParas.error = function(response, msg){
        //         if (response&&response.responseText)
        //             response = JSON.parse(response.responseText)
        //         this.trigger("operator.type.error", response); 
        //     }.bind(this);

        //     $.ajax(defaultParas);
        // }



    });

    return HashOriginCollection;
});