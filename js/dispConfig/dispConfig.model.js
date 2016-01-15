define("dispConfig.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            this.set("id", this.get("config.id"));
            var configTypeName   = this.get("config.type"),
                nodeChName       = this.get("node.chName"),
                nodeMinBandwidth = this.get("node.minBandwidth"),
                nodeMaxBandwidth = this.get("node.maxBandwidth"),
                crossLevel       = this.get("cover.crossLevel");

            if (configTypeName === 2) this.set("config.typeName",'CName');
            if (configTypeName === 1) this.set("config.typeName", 'A记录');
            var nodeString = nodeChName + "(" + nodeMinBandwidth + "/" + nodeMaxBandwidth + ")L" + (crossLevel || 0)
            this.set("nodeString", nodeString);
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
                        var temp = {};
                        _.each(element, function(el, key, ls){
                            _.each(el, function(el1, key1, ls1){
                                temp[key + "." + key1] = el1
                            }.bind(this))
                        }.bind(this))
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
                timeout: 30000,
            };
            defaultParas.data = args;

            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                this.reset();
                if (res){
                    _.each(res.rows, function(element, index, list){
                        var temp = {};
                        _.each(element, function(el, key, ls){
                            _.each(el, function(el1, key1, ls1){
                                temp[key + "." + key1] = el1
                            }.bind(this))
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
                type: "GET",
                url: url,
                async: true,
                timeout: 30000,
            };
            defaultParas.data = {page:1, count:9999};
            defaultParas.data.t = new Date().valueOf();

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

        getRegionNodeList: function(args){
            var url = BASE_URL + "/rs/dispConf/regionNodeList";
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
                if (res){
                    this.trigger("get.regionNode.success", res);
                } else {
                    this.trigger("get.regionNode.error", res); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.regionNode.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        getRegionOtherNodeList: function(args){
            var url = BASE_URL + "/rs/dispConf/regionOtherNodeList";
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
                if (res){
                    this.trigger("get.regionOtherNode.success", res);
                } else {
                    this.trigger("get.regionOtherNode.error", res); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.regionOtherNode.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },

        dispDns: function(args){
            var url = BASE_URL + "/rs/dispConf/dispDns?groupId=" + args.groupId
            var defaultParas = {
                type: "POST",
                url: url,
                async: true,
                timeout: 60000,
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
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("dispDns.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },
    });

    return DispConfigCollection;
});