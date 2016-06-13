define("liveCurentSetup.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var status = this.get("status");
            if (status === 2) this.set("statusName", '<span class="text-success">成功</span>');
            if (status === 1) this.set("statusName", '<span class="text-info">未配置</span>');
            if (status === 3) this.set("statusName", '<span class="text-danger">失败</span>');

            var startTime = this.get("startTime")
            if (startTime) this.set("startTimeFormated", new Date(startTime).format("yyyy/MM/dd hh:mm"));
            var endTime = this.get("endTime")
            if (endTime) this.set("endTimeFormated", new Date(endTime).format("yyyy/MM/dd hh:mm"));
            var createTime = this.get("createTime")
            if (createTime) this.set("createTimeFormated", new Date(createTime).format("yyyy/MM/dd hh:mm"));

            var id = this.get("id"), 
                logId = this.get("logId"), 
                nodeGroupId = this.get("nodeGroupId"),
                fileId = this.get("confFileId"); 
            if (!id) this.set("id", logId + "-" + nodeGroupId + "-" + fileId)
        }
    });

    var LiveCurentSetupCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getConfList: function(args){
            var url = BASE_URL + "/seed/config/release/log/pageList"
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
                if (res && res.rows){
                    _.each(res.rows, function(logObj, logIndex, logList){
                        var allRowspan = 0;
                        _.each(logObj.nodeGroupList, function(nodeGroupObj, nodeGroupIndex, nodeGroupLs){
                            allRowspan = allRowspan + nodeGroupObj.confFileList.length;
                        }.bind(this))
                        logObj.allRowspan = allRowspan;
                    }.bind(this))

                    _.each(res.rows, function(logObj, logIndex, logList){
                        var allRowspan = 0;
                        _.each(logObj.nodeGroupList, function(nodeGroupObj, nodeGroupIndex, nodeGroupLs){
                            allRowspan = allRowspan + nodeGroupObj.confFileList.length;
                            _.each(nodeGroupObj.confFileList, function(fileObj, fileIndex, fileList){
                                fileObj.isUsed = logObj.isUsed;
                                fileObj.logId = logObj.id;
                                fileObj.shellCmd = logObj.shellCmd;
                                fileObj.remarkLog = logObj.remark;
                                fileObj.allRowspan = logObj.allRowspan;
                                fileObj.nodeGroupId = nodeGroupObj.nodeGroupId;
                                fileObj.nodeGroupName = nodeGroupObj.nodeGroupName;
                                fileObj.groupRowspan = fileList.length;
                                this.push(new Model(fileObj));
                            }.bind(this))
                        }.bind(this))
                        logObj.allRowspan = allRowspan;
                    }.bind(this))

                    this.total = res.total;
                    this.trigger("get.confList.success"); 
                } else {
                    this.trigger("get.confList.error"); 
                }
                
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.confList.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        effectSingleConf: function(args){
            var url = BASE_URL + "/seed/config/release/log/rollback"
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
            defaultParas.success = function(res){
                    this.trigger("get.effectSingleConf.success", res); 
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.effectSingleConf.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getResInfo: function(args){
            var url = BASE_URL + "/seed/config/release/log/device/pageList"
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
                if (res)
                    this.trigger("get.resInfo.success", res); 
                else
                    this.trigger("get.resInfo.error", res); 
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.resInfo.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getBusinessType: function(args){
            var url = BASE_URL + "/seed/metaData/config/release/list"
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000
            };
            defaultParas.data = args || {};
            defaultParas.data.t = new Date().valueOf();
            
            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                if (res)
                    this.trigger("get.buisness.success", res); 
                else
                    this.trigger("get.buisness.error", res);
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.buisness.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        }
    });

    return LiveCurentSetupCollection;
});