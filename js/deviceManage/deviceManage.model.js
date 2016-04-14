define("deviceManage.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var status     = this.get("status"),
                type       = this.get("type"),
                typeName   = this.get("typeName"),
                createTime = this.get("createTime");
            if (status === 3) this.set("statusName", '<span class="text-danger">已关闭</span>');
            if (status === 2) this.set("statusName",'<span class="text-warning">挂起</span>');
            if (status === 1) this.set("statusName", '<span class="text-success">运行中</span>');

            if (!typeName && type == 12) this.set("typeName",'lvs');
            if (!typeName && type == 14) this.set("typeName",'cache');
            if (!typeName && type == 13) this.set("typeName",'relay');
            if (!typeName && type == 15) this.set("typeName",'live');

            if (createTime) this.set("createTimeFormated", new Date(createTime).format("yyyy/MM/dd hh:mm"));
            this.set("isChecked", false);
        }
    });

    var DeviceManageCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getDeviceList: function(args){
            var url = BASE_URL + "/rs/device/pagelist";
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

        addDevice: function(args){
            var url = BASE_URL + "/rs/device/addDevice"
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
                this.trigger("add.device.success"); 
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("add.device.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        deleteDevice: function(args){
            var url = BASE_URL + "/rs/device/deleteDevice"
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
                this.trigger("delete.device.success"); 
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("delete.device.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        updateDevice: function(args){
            var url = BASE_URL + "/rs/device/modifyDevice"
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
                this.trigger("update.device.success"); 
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("update.device.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        addIp: function(args){
            var url = BASE_URL + "/rs/ip/add"
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
                this.trigger("add.ip.success", res); 
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("add.ip.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        deleteIp: function(args){
            var url = BASE_URL + "/rs/ip/delete";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000,
            };
            defaultParas.data = args;
            defaultParas.data.t = new Date().valueOf();

            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                this.trigger("delete.ip.success");
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("delete.ip.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        ipTypeList: function(args){
            var url = BASE_URL + "/rs/metaData/ipTypeList";
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

        getDeviceIpList: function(args){
            var url = BASE_URL + "/rs/device/ip/list";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000,
            };
            defaultParas.data = args; //?deviceId=<#deviceId>
            defaultParas.data.t = new Date().valueOf();

            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                if (res){
                    this.trigger("get.device.ip.success", res);
                } else {
                    this.trigger("get.device.ip.error", res); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.device.ip.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        deleteDeviceIp: function(args){
            var url = BASE_URL + "/rs/device/ip/delete";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000,
            };
            defaultParas.data = args; //deviceIpId=<#绑定ip的 id>
            defaultParas.data.t = new Date().valueOf();

            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                this.trigger("delete.device.ip.success", res);
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("delete.device.ip.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        updateDeviceStatus: function(args){
            var url = BASE_URL + "/rs/device/modifyStatus";
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
                this.trigger("update.device.status.success", res);
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("update.device.status.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        addDeviceIP: function(args){
            var url = BASE_URL + "/rs/device/ip/add";
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
                this.trigger("add.device.ip.success", res);
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("add.device.ip.error", response); 
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
                this.trigger("get.devicetype.success",res);
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.devicetype.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        //getPauseInfo: function(args){
        //    var url = BASE_URL + "/rs/ip/prompt/pause?ip="+args;
        //    var defaultParas = {
        //        type: "GET",
        //        url: url,
        //        async: true,
        //        timeout: 30000,
        //        contentType: "application/json",
        //        processData: false
        //    };
        //
        //    defaultParas.success = function(res){
        //        if (res){
        //            this.trigger("get.InfoPause.success",res);
        //        } else {
        //            this.trigger("get.InfoPause.error");
        //        }
        //    }.bind(this);
        //
        //    defaultParas.error = function(response, msg){
        //        if (response&&response.responseText)
        //            response = JSON.parse(response.responseText)
        //        this.trigger("get.InfoPause.error", response);
        //    }.bind(this);
        //
        //    $.ajax(defaultParas);
        //},

        getIpInfoPause: function(args){
            var url = BASE_URL + "/rs/ip/prompt/pause?ip="+args;
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };

            defaultParas.success = function(res){
                if (res){
                    this.trigger("get.ipInfoPause.success",res);
                } else {
                    this.trigger("get.ipInfoPause.error",res);
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.ipInfoPause.error", response);
            }.bind(this);

            $.ajax(defaultParas);
        },

        getIpInfoStart: function(args){
            var url = BASE_URL + "/rs/ip/prompt/open?ip="+args;
            //var url = BASE_URL + '/rs/ip/prompt/open?ip=10.10.10.10';
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };

            defaultParas.success = function(res){
                if (res){
                    this.trigger("get.ipInfoStart.success",res);
                } else {
                    this.trigger("get.ipInfoStart.error",res);
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.ipInfoStart.error", response);
            }.bind(this);

            $.ajax(defaultParas);
        },

        getIpInfoSubmit: function(args){
            var url = BASE_URL + "/rs/ip/status/update/confirm?id="+args.id+"&status="+args.status;
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };

            defaultParas.success = function(res){
                if (res){
                    this.trigger("get.ipInfoSubmit.success",res);
                } else {
                    this.trigger("get.ipInfoSubmit.error",res);
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.ipInfoSubmit.error", response);
            }.bind(this);

            $.ajax(defaultParas);
        }

    });

    return DeviceManageCollection;
});