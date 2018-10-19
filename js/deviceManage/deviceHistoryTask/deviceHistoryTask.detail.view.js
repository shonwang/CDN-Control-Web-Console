define("deviceHistoryTask.detail.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    
    var DeviceHistoryTaskDetailView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            var tpl = '<div class="form-inline">' + 
                            '<div class="form-group">' +
                                '<label for="dropdown-type">设备类型</label>' +
                            '</div>' +
                            '<div class="form-group dropdown-type">' +
                                '<div class="dropdown">' +
                                   '<button class="btn btn-default dropdown-toggle" type="button" id="dropdown-type" data-toggle="dropdown">' +
                                        '<span class="cur-value">全部</span>' +
                                        '<span class="caret"></span>' +
                                    '</button>' +
                                    '<ul class="dropdown-menu"></ul>' +
                                '</div>' +
                            '</div>' +
                        '</div>'
            this.$el = $(_.template(tpl)());
            this.deviceDetail = this.options.deviceDetail;
            this.initDeviceDropMenu()
            this.initTable()
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/deviceManage/deviceHistoryTask/deviceHistoryTask.deviceItem.html'])({
                data: this.deviceDetail,
            }));
            if (this.deviceDetail.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
        },

        initDeviceDropMenu: function() {
            this.deviceTypeArray = [];
            // replayType（回放类型）：0代表全部类型 201代表relay，202代表cache
            // replayStatus（回放状态）：0代表全部任务 4代表回放完成，5代表放弃，6代表回放失败
            var typeArray = [{
                    name: '全部',
                    value: 0
                },{
                    name: 'relay',
                    value: 201
                },{
                    name: 'cache',
                    value: 202
                },{
                    name: 'live',
                    value: 203
                }],
                rootNode = this.$el.find(".dropdown-type");
            Utility.initDropMenu(rootNode, typeArray, function(value) {

            }.bind(this));
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return DeviceHistoryTaskDetailView;
});