define("statisticsDataSourceSwitch.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            this.set("isChecked", false);
            var sourcePrimary = this.get("sourcePrimary");
            var sourceBackup = this.get("sourceBackup");
            if (sourcePrimary == "dc") this.set("sourcePrimaryLabel", '<span class="label label-success">dc</span>');
            if (sourcePrimary == "bigdata") this.set("sourcePrimaryLabel", '<span class="label label-danger">bigdata</span>');
            if (sourceBackup == "dc") this.set("sourceBackupLabel", '<span class="label label-success">dc</span>');
            if (sourceBackup == "bigdata") this.set("sourceBackupLabel", '<span class="label label-danger">bigdata</span>')
        }
    });

    var StatisticsDataSourceSwitchCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        setInfo: function(args){
            var url = BASE_URL + "/2017-4-1/proxy/switch",
            successCallback = function(res){
                this.trigger("set.info.success", res);
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.info.error", response);
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
            // Utility.getAjax(url, args, successCallback, errorCallback);

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
                this.trigger("get.info.success");
            } else {
                this.trigger("get.info.error");
            }
        }

    });

    return StatisticsDataSourceSwitchCollection;
});