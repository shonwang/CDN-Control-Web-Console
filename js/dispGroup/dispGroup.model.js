define("dispGroup.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var status     = this.get("status"),
                priority   = this.get("priority"),
                crossLevel = this.get("crossLevel"),
                updateTime = this.get("updateTime");

            if (status === 0) this.set("statusName",'<span class="label label-danger">已关闭</span>');
            if (status === 1) this.set("statusName", '<span class="label label-success">运行中</span>');

            if (priority == 1) this.set("priorityName",'成本优先');
            if (priority == 2) this.set("priorityName",'质量优先');
            if (priority == 3) this.set("priorityName",'兼顾成本与质量');

            if (crossLevel === 0) this.set("crossLevelName",'L0');
            if (crossLevel === 1) this.set("crossLevelName",'L1');
            if (crossLevel === 2) this.set("crossLevelName",'L2');
            if (crossLevel === 3) this.set("crossLevelName",'L3');
            if (crossLevel === 4) this.set("crossLevelName",'L4');

            if (updateTime) this.set("updateTimeFormated", new Date(updateTime).format("yyyy/MM/dd hh:mm"));
        }
    });

    var DispGroupCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

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
                    this.trigger("get.dispGroup.success");
                } else {
                    this.trigger("get.dispGroup.error"); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.dispGroup.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getNodeList: function(args){
            var url = BASE_URL + "/resource/rs/node/list";
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

        getChannelList: function(args){
            var url = BASE_URL + "/rs/dispGroup/getChannels";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000,
            };
            defaultParas.data = args //?groupId=1;
            defaultParas.data.t = new Date().valueOf();

            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                if (res){
                    this.trigger("get.channel.success", res);
                } else {
                    this.trigger("get.channel.error", res); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.channel.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        queryChannel: function(args){
            var url = BASE_URL + "/rs/channel/query",
            successCallback = function(res){
                if (res){
                    this.trigger("get.channel.success", res);
                } else {
                    this.trigger("get.channel.error", res); 
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.channel.error", response); 
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        addDispGroup: function(args){
            var url = BASE_URL + "/rs/dispGroup/createGroup"
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
                this.trigger("add.dispGroup.success"); 
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("add.dispGroup.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        updateDispGroup: function(args){
            var url = BASE_URL + "/rs/dispGroup/modifyGroup"
            var defaultParas = {
                type: "POST",
                url: url,
                async: true,
                timeout: 300000,
                contentType: "application/json",
                processData: false
            };
            defaultParas.data = JSON.stringify(args);
            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(){
                this.trigger("update.dispGroup.success"); 
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("update.dispGroup.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        updateDispGroupStatus: function(args){
            var url = BASE_URL + "/rs/dispGroup/modifyStatus";
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
                this.trigger("update.dispGroup.status.success", res);
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("update.dispGroup.status.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        addDispGroupChannel: function(args){
            var url = BASE_URL + "/rs/dispGroup/addChannel";
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
                this.trigger("add.dispGroup.channel.success", res);
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("add.dispGroup.channel.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getNodeByGroup: function(args){
            var url = BASE_URL + "/rs/dispGroup/getNodes";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000,
            };
            defaultParas.data = args //?groupId=<#DispGroupId>
            defaultParas.data.t = new Date().valueOf();

            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                if (res){
                    this.trigger("get.dispGroup.node.success", res);
                } else {
                    this.trigger("get.dispGroup.node.error", res); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.dispGroup.node.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getChannelByDisp: function(args){
            var url = BASE_URL + "/rs/dispGroup/queryOrigin",
            successCallback = function(res){
                this.trigger("get.channelByDisp.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.channelByDisp.error", response);
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        copyDispGroupOld: function(args){
            var url = BASE_URL + "/rs/dispGroup/copy"
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
                this.trigger("copy.dispGroup.success"); 
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("copy.dispGroup.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        copyDispGroup: function(args, nodeId){
            var url = BASE_URL + "/rs/dispGroup/copyGroup",
            successCallback = function(res){
                this.trigger("copy.dispGroup.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("copy.dispGroup.error", response);
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        deleteDispGroup : function(args){
            var url = BASE_URL + "/rs/dispGroup/deleteGroup"
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
                this.trigger("delete.dispGroup.success"); 
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("delete.dispGroup.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        ipTypeList: function(args){
            var url = BASE_URL + "/resource/rs/metaData/ipTypeList";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000,
            };
            defaultParas.data = args || {};
            defaultParas.data.t = new Date().valueOf();

            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                if (res)
                    this.trigger("ip.type.success", res.rows);
                else
                    this.trigger("ip.type.error");
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("ip.type.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getInfoPrompt: function(args){
            var url = BASE_URL + "/rs/dispGroup/prompt/removeNode";
            var defaultParas = {
                type: "POST",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };
            defaultParas.data = args || {
                "id"    : "",
                "nodeIdList"   : ""
            };
            defaultParas.data = JSON.stringify(defaultParas.data);

            defaultParas.success = function(res){
                if (res){
                    this.trigger("get.InfoPrompt.success", res);
                } else {
                    this.trigger("get.InfoPrompt.error", res); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.InfoPrompt.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },
        GroupDomainList: function(args){
            var url = BASE_URL + "/rs/metaData/getGroupDomainList";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000,
            };
            defaultParas.data = args || {};
            defaultParas.data.t = new Date().valueOf();

            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                if (res)
                    this.trigger("GropDomain.list.success", res.rows);
                else
                    this.trigger("GropDomain.list.error");
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("GropDomain.list.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        }
    });

    return DispGroupCollection;
});