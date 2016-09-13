define("dispSuggesttion.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            if(this.get("region.id"))
                this.set("id", Utility.randomStr(16));
            else
                this.set("id", this.get("node.id"));
            var configTypeName   = this.get("config.type"),
                nodeChName       = this.get("node.chName"),
                nodeMaxBWLastNight = this.get("node.maxBWLastNight"),
                nodeCurrBW = this.get("node.currBW"),
                nodeMaxBandwidth = this.get("node.maxBandwidth"),
                crossLevel       = this.get("cover.crossLevel"),
                maxBandWidth = (this.get("region.maxBandWidth")/60/1000/1000/1000).toFixed(2);

            this.set("region.maxBandWidth", maxBandWidth)
            if (configTypeName === 2) this.set("config.typeName",'CName');
            if (configTypeName === 1) this.set("config.typeName", 'A记录');
            if (configTypeName === 0) this.set("config.typeName", '0');

            if (nodeChName){
                var nodeString = nodeChName + "(" + nodeMaxBWLastNight + "/" + nodeCurrBW + "/" + nodeMaxBandwidth + ")L" + crossLevel
                this.set("nodeString", nodeString);
            }
            this.set("isChecked", false);
            this.set("isDisplay", true);
        }
    });

    var DispSuggesttionCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

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

        adviceDispDns: function(args, nodeId, requestId, cc){
            var url = BASE_URL + "/rs/advice/adviceDispDns?nodeId=" + nodeId + "&requestId=" + requestId + "&cc=" + cc,
            successCallback = function(res){
                this.trigger("advice.dispDns.success"); 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("advice.dispDns.error", response); 
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        getNodeBandWidth: function(args){
            var url = BASE_URL + "/rs/node/bandWidth",//?nodeId=XXX
            successCallback = function(res){
                this.trigger("get.nodeBandWidth.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.nodeBandWidth.error", response);
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        getDisconfAdvice: function(args){
            var url = BASE_URL + "/rs/advice/getDisconfAdvice",//?nodeId=XXX
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