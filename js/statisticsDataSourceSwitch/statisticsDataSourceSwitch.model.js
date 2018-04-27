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
            var url = BASE_URL + "/2017-4-1/proxy/query",
                successCallback = function(res) {
                    this.reset();
                    if (res) {
                        _.each(res, function(element, index, list) {
                            this.push(new Model(element));
                        }.bind(this))
                        this.trigger("get.info.success");
                    } else {
                        this.trigger("get.info.error");
                    }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('get.info.error', response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        }

    });

    return StatisticsDataSourceSwitchCollection;
});