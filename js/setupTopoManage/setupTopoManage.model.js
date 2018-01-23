define("setupTopoManage.model", ['require', 'exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function() {
            var createTime = this.get('createTime');

            createTime = this.set("createTime", new Date(createTime).format("yyyy/MM/dd hh:mm"));
            this.set('checked', false);
        }
    });

    var SetupTopoManageCollection = Backbone.Collection.extend({

        model: Model,

        initialize: function() {},

        getTopoinfo: function(args) {
            var url = BASE_URL + "/resource/topo/info/list",
                successCallback = function(res) {
                    this.reset();
                    if (res) {
                        _.each(res.rows, function(element, index, list) {
                            this.push(new Model(element));
                        }.bind(this))
                        this.total = res.total;
                        this.trigger("get.topoInfo.success");
                    } else {
                        this.trigger("get.topoInfo.error");
                    }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('get.topoInfo.error', response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        getTopoOrigininfo: function(args) {
            var url = BASE_URL + "/resource/topo/origin/consoleInfo?id=" + args,
                successCallback = function(res) {
                    if (res) {
                        this.total = res.total;
                        this.trigger("get.topo.OriginInfo.success", res);
                    } else {
                        this.trigger("get.topo.OriginInfo.error");
                    }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('get.topo.OriginInfo.error', response)
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        getTopoInfo: function(args) {
            var url = BASE_URL + "/resource/topo/getTopoVerionDetail?innerId=" + args,
                successCallback = function(res) {
                    if (res) {
                        this.total = res.total;
                        this.trigger("get.topo.OriginInfo.success", res);
                    } else {
                        this.trigger("get.topo.OriginInfo.error");
                    }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('get.topo.OriginInfo.error', response)
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        getDeviceTypeList: function(args) {
            var url = BASE_URL + "/resource/rs/metaData/deviceType/list",
                successCallback = function(res) {
                    if (res) {
                        this.trigger("get.devicetype.success", res);
                    } else {
                        this.trigger("get.devicetype.error");
                    }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('get.devicetype.error');
                }.bind(this);
            Utility.getAjax(url, '', successCallback, errorCallback);
        },

        topoAdd: function(args) {
            var url = BASE_URL + "/resource/topo/add",
                successCallback = function(res) {
                    this.reset();
                    if (res) {
                        _.each(res.rows, function(element, index, list) {
                            this.push(new Model(element));
                        }.bind(this))
                        this.total = res.total;
                        this.trigger("add.topo.success",res);
                    } else {
                        this.trigger("add.topo.error");
                    }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('add.topo.error', response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        topoModify: function(args) {
            var url = BASE_URL + "/resource/topo/modify",
                successCallback = function(res) {
                    this.reset();
                    if (res) {
                        _.each(res.rows, function(element, index, list) {
                            this.push(new Model(element));
                        }.bind(this))
                        this.total = res.total;
                        this.trigger("modify.topo.success");
                    } else {
                        this.trigger("modify.topo.error");
                    }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('modify.topo.error', response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        getNodeList: function(args) {
            var url = BASE_URL + "/resource/rs/node/queryNode",
                successCallback = function(res) {
                    if (res)
                        this.trigger("get.node.success", res);
                    else
                        this.trigger("get.node.error", res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger("get.node.error", response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

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

        getTopoVersion: function(args) {
            var url = BASE_URL + "/resource/topo/getTopoVersion",//innerId
                successCallback = function(res) {
                    if (res)
                        this.trigger("get.version.success", res);
                    else
                        this.trigger("get.version.error", res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger("get.version.error", response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        changeTopoVersion: function(args) {
            var url = BASE_URL + "/resource/topo/changeTopoVersion",//innerId
                successCallback = function(res) {
                    this.trigger("set.version.success", res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger("set.version.error", response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        getProgress:function(args){
           var url = BASE_URL + "/cd/node/updatecfg/topology/getprogress",
                successCallback = function(res) {
                    if(res){
                      this.trigger("get.topoUpdateSetup.success", res);
                   }else{
                      this.trigger("get.topoUpdateSetup.error", res);
                   }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger("get.topoUpdateSetup.error", response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        getSpecialLayerProgress:function(args){
           var url = BASE_URL + "/cd/node/updatecfg/sls/getprogress",
                successCallback = function(res) {
                    if(res){
                      this.trigger("get.specialLayerSetup.success", res);
                   }else{
                      this.trigger("get.specialLayerSetup.error", res);
                   }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger("get.specialLayerSetup.error", response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        setdeliveryswitch:function(args){
           var url = BASE_URL + "cd/system/config/setdeliveryswitch",
                successCallback = function(res) {
                    this.trigger("set.deliveryswitch.success");
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger("set.deliveryswitch.error", response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        startCreateSetup:function(args){
            var url = BASE_URL + "/cd/node/updatecfg/topology/start",
                successCallback = function(res) {
                    this.trigger("start.createSetup.success");
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger("start.createSetup.error", response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        startSpecialLayerCreateSetup:function(args){
            var url = BASE_URL + "/cd/node/updatecfg/sls/start",
                successCallback = function(res) {
                    this.trigger("start.createSetup.success");
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger("start.createSetup.error", response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        startNodeInitSetup:function(){
            var url = BASE_URL + "/cd/node/initcfg/start",
                successCallback = function(res) {
                    this.trigger("start.nodeInitSetup.success");
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger("start.nodeInitSetup.error", response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        createSendTask:function(args){
           var url = BASE_URL + "/cd/node/updatecfg/delivery",
                successCallback = function(res) {
                    this.trigger("create.sendTask.success", res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger("create.sendTask.error", response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },
    });

    return SetupTopoManageCollection;
});