define("statisticsDataSourceSwitch.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            this.set("isChecked", false);
        }
    });

    var StatisticsDataSourceSwitchCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        modifyStatus: function(args){
            var url = BASE_URL + "/rs/device/modifyStatus",
            successCallback = function(res){
                this.trigger("set.status.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.status.error", response);
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        getInfo: function(args) {
            // var url = BASE_URL + "/2017-4-1/proxy/query",
            //     successCallback = function(res) {
            //         this.reset();
            //         if (res) {
            //             _.each(res.rows, function(element, index, list) {
            //                 this.push(new Model(element));
            //             }.bind(this))
            //             this.trigger("get.info.success");
            //         } else {
            //             this.trigger("get.info.error");
            //         }
            //     }.bind(this),
            //     errorCallback = function(response) {
            //         this.trigger('get.info.error', response);
            //     }.bind(this);
            // Utility.postAjax(url, args, successCallback, errorCallback);

            var res = [{
                "id": 1,
                "requestUri": "/2016-09-01/statistics/GetLiveTopOnlineUserData",
                "requestName": "直播TopN按流维度在线人数排名",
                "sourcePrimary": "dc",
                "sourceBackup": "bigdata",
                "testUrl": "http://www.baidu.com"
            },{
                "id": 2,
                "requestUri": "/2016-09-01/statistics/GetBandwidthData",
                "requestName": "查询带宽",
                "sourcePrimary": "bigdata",
                "sourceBackup": "dc",
                "testUrl": "http://www.sohu.com"
            }];
            this.reset();
            if (res) {
                _.each(res, function(element, index, list) {
                    this.push(new Model(element));
                }.bind(this))
                this.total = res.total;
                this.trigger("get.info.success");
            } else {
                this.trigger("get.info.error");
            }
        }

    });

    return StatisticsDataSourceSwitchCollection;
});