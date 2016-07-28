define("templateManage.model", ['require','exports'], function(require, exports) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            if(this.get("businessType") === 1) this.set("businessTypeName","直播");
            if(this.get("businessType") === 2) this.set("businessTypeName","点播");
            if(this.get("businessType") === 10) this.set("businessTypeName","cache2.0点播配置文件");
            if(this.get("businessType") === 13) this.set("businessTypeName","cache2.0直播配置文件");

            if(this.get("fileType") === 1) this.set("fileTypeName","domain.conf");
            if(this.get("fileType") === 2) this.set("fileTypeName","origdomain.conf");
            if(this.get("fileType") === 3) this.set("fileTypeName","lua.conf");
            if(this.get("fileType") === 4) this.set("fileTypeName","nginx.conf");

            if(this.get("originType") === 1) this.set("originTypeName","域名回源");
            if(this.get("originType") === 2) this.set("originTypeName","IP回源");

            if(this.get("layer") === 1) this.set("layerName","上层");
            if(this.get("layer") === 2) this.set("layerName","下层");
        }
    });

    var TemplateManageCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getTplPageList: function(args){
            var url = BASE_URL + "/api/cdn/config/templates";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000
            };
            defaultParas.data = args;

            defaultParas.success = function(res){
                this.reset();
                if (res){
                    _.each(res.rows, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.total;
                    this.trigger("get.tplPageList.success");
                } else {
                    this.trigger("get.tplPageList.error"); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.tplPageList.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getFileTypeList: function(args){
            var url = BASE_URL + "/api/cdn/fileTypes";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000
            };
            defaultParas.data = args;

            defaultParas.success = function(res){
                if (res){
                    this.trigger("get.fileTypeList.success",res.result);
                } else {
                    this.trigger("get.fileTypeList.error"); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.fileTypeList.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getAllCity: function(args){
            var url = "http://local.center.ksyun.com" + "/rs/query/getAllAddr?" + new Date().valueOf(); 
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

        getOperatorList: function(args){
            var url = "http://local.center.ksyun.com" + "/rs/metaData/operatorList?" + new Date().valueOf(); 
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

        getBusinessList: function(){
            var url = "http://local.center.ksyun.com" + "/seed/metaData/config/release/list";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000
            };

            defaultParas.success = function(res){
                this.trigger("get.businessList.success",res);
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.businessList.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        deleteTpl: function(args){
            var url = BASE_URL + "/api/cdn/config/templates/"+args.id+"?fileType="+args.fileType; 
            var defaultParas = {
                type: "DELETE",
                url: url,
                async: true,
                timeout: 30000
            };

            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                this.trigger("delete.tpl.success", res); 
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("delete.tpl.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        checkTpl: function(args){
            var url = BASE_URL + "/api/cdn/config/template/property/check"; 
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000
            };
            defaultParas.data = args;

            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                if(res.status == "OK"){
                    this.trigger("check.tpl.success", res); 
                }else{
                    this.trigger("check.tpl.error", res.message); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("check.tpl.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        addTpl: function(args){
            var url = BASE_URL + "/api/cdn/config/templates";
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
                this.trigger("add.tpl.success");
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("add.tpl.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        editTpl: function(args){
            var url = BASE_URL + "/api/cdn/config/templates";
            var defaultParas = {
                type: "PUT",
                url: url,
                async: true,
                timeout: 30000,
                contentType: "application/json",
                processData: false
            };
            defaultParas.data = JSON.stringify(args);

            defaultParas.success = function(res){
                this.trigger("edit.tpl.success");
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("edit.tpl.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getEditData: function(args){
            var url = BASE_URL + "/api/cdn/config/templates/"+args.id; 
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000
            };
            defaultParas.data = {fileType:args.fileType};

            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                this.trigger("get.editData.success", res); 
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.editData.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getDefaultTplData: function(args){
            var url = BASE_URL + "/api/cdn/config/default/templates"; 
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000
            };
            defaultParas.data = args;

            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                if(res.status == "OK"){
                    this.trigger("get.defaultTplData.success", res.result); 
                }else{
                    this.trigger("get.defaultTplData.error", res.message); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.defaultTplData.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        }

    });

    return TemplateManageCollection;
});