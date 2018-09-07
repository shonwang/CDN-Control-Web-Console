'use strict';

define("logTemplateManage.model", ['require', 'exports', 'utility'], function (require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function initialize() {
            var updateTime = parseInt(this.get("updateTime")),
                createTime = parseInt(this.get("createTime"));
            if (updateTime) this.set("updateTimeFormated", new Date(updateTime).format("yyyy/MM/dd hh:mm"));
            if (createTime) this.set("createTimeFormated", new Date(createTime).format("yyyy/MM/dd hh:mm"));
        }
    });

    var LogTemplateManageCollection = Backbone.Collection.extend({

        model: Model,

        initialize: function initialize() {},

        getTemplateList: function getTemplateList(args) {
            var url = BASE_URL + "/mock/32/2018-08-30/realtimelog/template/page",
                successCallback = function (res) {
                this.reset();
                if (res) {
                    _.each(res.list, function (element, index, list) {
                        this.push(new Model(element));
                    }.bind(this));
                    this.total = res.totalCount;
                    this.trigger("get.templateList.success", res.list);
                } else {
                    this.trigger("get.templateList.error");
                }
            }.bind(this),
                errorCallback = function (response) {
                this.trigger('get.templateList.error', response);
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        isTemplateUsed: function isTemplateUsed(args) {
            var url = BASE_URL + "/mock/32/2018-08-30/realtimelog/template/used",
                successCallback = function (res) {
                this.trigger("template.used.success", res);
            }.bind(this),
                errorCallback = function (response) {
                this.trigger('template.used.error', response);
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        commitTask: function commitTask(args) {
            var url = BASE_URL + "/refresh/task/commit",
                successCallback = function (res) {
                this.trigger("refresh.commit.success", res);
            }.bind(this),
                errorCallback = function (response) {
                this.trigger('refresh.commit.error', response);
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        taskModify: function taskModify(args) {
            var url = BASE_URL + "/refresh/task/modify",
                successCallback = function (res) {
                this.trigger("refresh.commit.success", res);
            }.bind(this),
                errorCallback = function (response) {
                this.trigger('refresh.commit.error', response);
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        getTemplateDetail: function getTemplateDetail(args) {
            var url = BASE_URL + "/mock/32/2018-08-30/realtimelog/template/detail",
                successCallback = function (res) {
                this.trigger("template.detail.success", res);
            }.bind(this),
                errorCallback = function (response) {
                this.trigger('template.detail.error', response);
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        }
    });

    return LogTemplateManageCollection;
});
