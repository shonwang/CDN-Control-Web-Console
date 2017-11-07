define("checkUrl.model", ['require','exports', "utility"], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var opTime = this.get('opTime');
            this.set("opTimeName" , new Date(opTime).format("yyyy/MM/dd hh:mm:ss"));
            var status = this.get("status");
            if(status == 1) this.set("statusName","完成");
            if(status == 2) this.set("statusName","进行中");
            var successRate = this.get("successRate");
            this.set("successRateName",successRate*100+"%");
        }
    });

    var CheckUrlCollection = Backbone.Collection.extend({

        model: Model,

        initialize: function(){},

        getVerifyResult:function(args){
            var url = BASE_URL + "/verify/verifyResult",
            successCallback = function(res){
                this.reset();
                if(res){
                    _.each(res.result.rows, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this));
                    this.total = res.result.total;
                    this.trigger('get.verifyResult.success');
                }else{
                    this.trigger('get.verifyResult.error');
                }
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.verifyResult.error", response);
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);            
        }


    });

    return CheckUrlCollection;
});