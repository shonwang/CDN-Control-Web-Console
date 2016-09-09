define("dispConfig.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            if(this.get("region.id"))
                this.set("id", this.get("region.id"));
            else
                this.set("id", this.get("node.id"));
            var configTypeName   = this.get("config.type"),
                nodeChName       = this.get("node.chName"),
                nodeMaxBWLastNight = this.get("node.maxBWLastNight"),
                nodeCurrBW = this.get("node.currBW"),
                nodeMaxBandwidth = this.get("node.maxBandwidth"),
                crossLevel       = this.get("cover.crossLevel");

            if (configTypeName === 2) this.set("config.typeName",'CName');
            if (configTypeName === 1) this.set("config.typeName", 'A记录');
            if (configTypeName === 0) this.set("config.typeName", '0');

            if (nodeChName){
                var nodeString = nodeChName + "(" + nodeMaxBWLastNight + "/" + nodeCurrBW + "/" + nodeMaxBandwidth + ")L" + crossLevel
                this.set("nodeString", nodeString);
            }
            this.set("isChecked", false);
        }
    });

    var DispConfigCollection = Backbone.Collection.extend({
        
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

        initDispConfigList: function(args){
            var url = BASE_URL + "/rs/dispConf/initCover";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 120000,
            };
            defaultParas.data = args;

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
                                        _.each(el3, function(el4, key4, ls4){
                                            var tempKey = key3 + "." + key4
                                            tempObj[tempKey] = el4
                                            if (tempKey === "dispGroup.dispDomain" && !temp['dispGroup.dispDomain'])
                                                temp['dispGroup.dispDomain'] = el4
                                            if (tempKey === "dispGroup.ttl" && !temp['dispGroup.ttl'])
                                                temp['dispGroup.ttl'] = el4
                                        }.bind(this))
                                    }.bind(this))
                                    tempList.push(new Model(tempObj))
                                }.bind(this))
                                temp.listFormated = tempList;
                            }
                        }.bind(this))

                        this.push(new Model(temp));
                    }.bind(this))
                    this.total = res.total;
                    this.trigger("init.dispConfig.success");
                } else {
                    this.trigger("init.dispConfig.error"); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("init.dispConfig.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getDispGroupList: function(args){
            var url = BASE_URL + "/rs/dispGroup/pageList";
            var defaultParas = {
                type: "POST",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };
            defaultParas.data = {
                "name"  : null,//调度组名称
                "status": null,//调度组状态
                "level" : null,//覆盖级别
                "page"  : 1,
                "count" : 99999
            };
            defaultParas.data = JSON.stringify(defaultParas.data);

            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                if (res){
                    this.trigger("get.dispGroup.success", res);
                } else {
                    this.trigger("get.dispGroup.error", res); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.dispGroup.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getRegionAdvice: function(args){
            var url = BASE_URL + "/rs/dispConf/disp/regionAdvice";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000,
            };
            defaultParas.data = {};
            defaultParas.data.groupId  = args.groupId;
            defaultParas.data.regionId = args.regionId;
            defaultParas.data.t = new Date().valueOf();

            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                if (res){
                    args.success&&args.success(res);
                } else {
                    this.trigger("get.regionAdvice.error", response); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.regionAdvice.error", response); 
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

        diffBeforeSend: function(args){
            var url = BASE_URL + "/rs/dispConf/pre/seeding/diff?groupId=" + args.groupId,
            successCallback = function(res){
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
                    this.trigger("send.diff.success");
                } else {
                    this.trigger("send.diff.error"); 
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger("send.diff.error", response);
            }.bind(this);
            Utility.postAjax(url, args.list, successCallback, errorCallback);
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

        getAllDnsRecord: function(args){
            var url = BASE_URL + "/rs/history/dns/center/dns/allDnsRecord",
            successCallback = function(res){
                if (res)
                    this.trigger("get.allDnsRecord.success", res);
                else
                    this.trigger("get.allDnsRecord.error", res); 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.allDnsRecord.error", response);
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        getHistoryConfigList: function(args){
            var url = BASE_URL + "/rs/history/dns/center/dns/detail",
            successCallback = function(res){
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
                    this.trigger("get.history.success");
                } else {
                    this.trigger("get.history.error"); 
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.history.error", response);
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        getDiffConfigList: function(args){
            var url = BASE_URL + "/rs/history/dns/center/dns/diff",
            successCallback = function(res){
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
                    this.trigger("get.diff.success");
                } else {
                    this.trigger("get.diff.error"); 
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.diff.error", response);
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        }
    });

    return DispConfigCollection;
});