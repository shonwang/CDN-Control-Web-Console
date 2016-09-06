define("dispSuggesttion.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            if(this.get("region.id"))
                this.set("id", this.get("region.id"));
            else
                this.set("id", this.get("node.id"));
            var configTypeName   = this.get("config.type"),
                nodeChName       = this.get("node.chName"),
                nodeMinBandwidth = this.get("node.minBandwidth"),
                nodeMaxBandwidth = this.get("node.maxBandwidth"),
                crossLevel       = this.get("cover.crossLevel");

            if (configTypeName === 2) this.set("config.typeName",'CName');
            if (configTypeName === 1) this.set("config.typeName", 'A记录');
            if (configTypeName === 0) this.set("config.typeName", '0');

            if (nodeChName){
                var nodeString = nodeChName + "(" + nodeMinBandwidth + "/" + nodeMaxBandwidth + ")L" + crossLevel
                this.set("nodeString", nodeString);
            }
            this.set("isChecked", false);
            this.set("isDisplay", true);
        }
    });

    var DispSuggesttionCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getDispConfigList: function(args){
            var url = BASE_URL + "/rs/dispConf/dispConfig/pageList";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000,
            };
            defaultParas.data = args || {page: 1, count:99999,t: new Date().valueOf()};

            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                this.reset();
                if (res){
                    _.each(res.rows, function(element, index, list){
                        var temp = {}, tempList = [];
                        _.each(element, function(el, key, ls){
                            if (key === "region"){
                                _.each(el, function(el1, key1, ls1){
                                    temp[key + "." + key1] = el1
                                }.bind(this))
                            }
                            if (key === "list"){
                                var tempObj = {}
                                _.each(el, function(el2, key2, ls2){
                                    _.each(el2, function(el3, key3, ls3){
                                        if (key3 === "type") tempObj.type = el3;
                                        _.each(el3, function(el4, key4, ls4){
                                            var tempKey = key3 + "." + key4
                                            tempObj[tempKey] = el4
                                            if (tempKey === "dispGroup.dispDomain" && !temp['dispGroup.dispDomain'])
                                                temp['dispGroup.dispDomain'] = el4
                                            if (tempKey === "dispGroup.ttl" && !temp['dispGroup.ttl'])
                                                temp['dispGroup.ttl'] = el4
                                        }.bind(this))
                                    }.bind(this))
                                    tempObj.isDisplay = true;
                                    tempList.push(new Model(tempObj))
                                }.bind(this))
                                temp.listFormated = tempList;
                            }
                        }.bind(this))
                        temp.isDisplay = true;
                        this.push(new Model(temp));
                    }.bind(this))
                    this.total = res.total;
                    this.trigger("get.dispConfig.success");
                } else {
                    this.trigger("get.dispConfig.error"); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.dispConfig.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getRegionNodeList: function(args){
            var url = BASE_URL + "/rs/dispConf/regionNodeList",
            successCallback = function(res){
                if (res){
                    this.trigger("get.regionNode.success", res);
                } else {
                    this.trigger("get.regionNode.error", res); 
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.regionNode.error", response);
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        getRegionOtherNodeList: function(args){
            var url = BASE_URL + "/rs/dispConf/regionOtherNodeList",
            successCallback = function(res){
                if (res){
                    this.trigger("get.regionOtherNode.success", res);
                } else {
                    this.trigger("get.regionOtherNode.error", res); 
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.regionOtherNode.error", response);
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        dispDns: function(args){
            var url = BASE_URL + "/rs/dispConf/dispDns?groupId=" + args.groupId
            var defaultParas = {
                type: "POST",
                url: url,
                async: true,
                timeout: 6000000,
                contentType: "application/json",
                processData: false
            };
            defaultParas.data = JSON.stringify(args.list);
            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(){
                this.trigger("dispDns.success"); 
            }.bind(this);

            defaultParas.error = function(response, msg){
                try{
                    if (response&&response.responseText)
                        response = JSON.parse(response.responseText)
                } catch(e){}
                this.trigger("dispDns.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getDisconfAdvice: function(args){
            var url = BASE_URL + "/rs/node/getDisconfAdvice",//?nodeId=XXX
            successCallback = function(res){
                this.trigger("get.disconfAdvice.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.disconfAdvice.error", response);
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        }
    });

    return DispSuggesttionCollection;
});