define("logTemplateManage.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var updateTime = parseInt(this.get("updateTime")),
                createTime = parseInt(this.get("createTime"));
            if (updateTime) this.set("updateTimeFormated", new Date(updateTime).format("yyyy/MM/dd hh:mm"));
            if (createTime) this.set("createTimeFormated", new Date(createTime).format("yyyy/MM/dd hh:mm"));
        }
    });

    var LogTemplateManageCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getTemplateList: function(args) {
            var url = BASE_URL + "/mock/32/2018-08-30/realtimelog/template/page",
                successCallback = function(res) {
                    this.reset();
                    if (res) {
                        _.each(res.list, function(element, index, list) {
                            this.push(new Model(element));
                        }.bind(this))
                        this.total = res.totalCount;
                        this.trigger("get.templateList.success", res.list);
                    } else {
                        this.trigger("get.templateList.error");
                    }
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('get.templateList.error', response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        isTemplateUsed: function(args) {
            var url = BASE_URL + "/mock/32/2018-08-30/realtimelog/template/used",
                successCallback = function(res) {
                    this.trigger("template.used.success", res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('template.used.error', response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        addTemplate: function(args) {
            var url = BASE_URL + "/mock/32/2018-08-30/realtimelog/template/add",
                successCallback = function(res) {
                    this.trigger("add.template.success", res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('add.template.error', response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        getTemplateDetail: function(args) {
            var url = BASE_URL + "/mock/32/2018-08-30/realtimelog/template/detail",
                successCallback = function(res) {
                    this.trigger("template.detail.success", res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('template.detail.error', response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        getTplHistoryList: function(args) {
            var url = BASE_URL + "/mock/32/2018-08-30/realtimelog/template/history",
                successCallback = function(res) {
                    this.trigger("template.history.success", res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('template.history.error', response);
                }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        }, 
        
        publishTemplate: function(args) {
            var url = BASE_URL + "/mock/32/2018-08-30/realtimelog/template/publish",
                successCallback = function(res) {
                    this.trigger("publish.template.success", res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('publish.template.error', response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        deleteTemplate: function(args) {
            var url = BASE_URL + "/mock/32/2018-08-30/realtimelog/template/delete",
                successCallback = function(res) {
                    this.trigger("delete.template.success", res);
                }.bind(this),
                errorCallback = function(response) {
                    this.trigger('delete.template.error', response);
                }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },
    });

    return LogTemplateManageCollection;
});