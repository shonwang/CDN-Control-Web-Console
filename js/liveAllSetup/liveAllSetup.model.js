define("liveAllSetup.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var createTime = this.get("createTime"), 
                confFileId = this.get("confFileId");
            this.set("id", confFileId);

            if (createTime) this.set("createTimeFormated", new Date(createTime).format("yyyy/MM/dd hh:mm"));
            this.set("isChecked", false);
        }
    });

    var LiveAllSetupCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getAllFileList: function(args){
            var url = BASE_URL + "/seed/conf/file/allConfList";
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
                this.reset();
                if (res){
                    _.each(res, function(el, index, list){
                        _.each(el.nodeGroup.confFileList, function(confFile, index, fileList){
                            confFile.nodeGroupName = el.nodeGroup.nodeGroupName;
                            confFile.nodeGroupId = el.nodeGroup.nodeGroupId
                            confFile.rowspan = fileList.length;
                            this.push(new Model(confFile));
                        }.bind(this))
                    }.bind(this))
                    this.trigger("get.filelist.success");
                } else {
                    this.trigger("get.filelist.error"); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.filelist.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getHisroryFileList: function(args){
            var url = BASE_URL + "/seed/conf/file/getConfFileHisList";
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
                if (res){
                    this.trigger("get.historylist.success", res);
                } else {
                    this.trigger("get.historylist.error"); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.historylist.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getNodeGroupList: function(args){
            var url = BASE_URL + "/seed/config/release/nodeGroupList";
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
                if (res){
                    this.trigger("get.nodeGroupList.success", res);
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

        addConf: function(args){
            var url = BASE_URL + "/seed/conf/file/addConf";
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
                this.trigger("get.addConf.success");
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.addConf.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        modifyConfFile: function(args){
            var url = BASE_URL + "/seed/conf/file/modifyConfFile";
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
                this.trigger("get.modifyConf.success");
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.modifyConf.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getFileTypeList: function(){
            var url = BASE_URL + "/seed/metaData/filetype/list"
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000
            };
            defaultParas.data = {};
            defaultParas.data.t = new Date().valueOf();
            
            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                if (res)
                    this.trigger("get.fileType.success", res);
                else
                    this.trigger("get.fileType.error", res); 
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.fileType.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getIpGroupList: function(args){
            var url = BASE_URL + "/seed/config/release/nodeGroup/ipList"
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
                    this.trigger("get.ip.success", res); 
                else
                    this.trigger("get.ip.error", res);
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.ip.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getFileGroupList: function(){
            var url = BASE_URL + "/seed/metaData/fileGroup/list"
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000
            };
            defaultParas.data = {};
            defaultParas.data.t = new Date().valueOf();
            
            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                if (res)
                    this.trigger("get.fileGroup.success", res); 
                else
                    this.trigger("get.fileGroup.error", res);
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.fileGroup.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        confirmAdd: function(args){
            var url = BASE_URL + "/seed/conf/file/releaseConfig";
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
                this.trigger("get.confirmAdd.success");
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.confirmAdd.error", response); 
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

    return LiveAllSetupCollection;
});