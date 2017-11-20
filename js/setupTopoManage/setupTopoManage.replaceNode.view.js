define("setupTopoManage.replaceNode.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var ReplaceNodeView = Backbone.View.extend({

            events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/setupTopoManage/setupTopoManage.replace&deleteNode.html'])({

            }));
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));
            this.onGetAllOriginNodes();
            this.onGetAllReplaceNodes();
            this.$el.find(".select-value-layer").on("click", $.proxy(this.onClickSelectItem, this));
        },

        initRuleTable: function() {
            this.ruleList = [{
                id: 101,
                local: [{
                    id: 1,
                    name: '联通'
                }],
                upper: [{
                    chiefType: 1,
                    id: 63,
                    name: '北京教育网'
                }]
            }, {
                id: 102,
                local: [{
                    id: 2,
                    name: '电信'
                }],
                upper: [{
                    chiefType: 1,
                    id: 63,
                    name: '北京教育网2'
                }]
            }, {
                id: 104,
                local: [{
                    id: 5,
                    name: '鹏博士'
                }],
                upper: [{
                    chiefType: 1,
                    id: 64,
                    name: '北京多线02节点电信'
                }, {
                    chiefType: 1,
                    id: 65,
                    name: '北京多线02节点联通'
                }, {
                    chiefType: 0,
                    id: 66,
                    name: '北京多线02节点铁通'
                }]
            },{
                id: 105,
                local: [{
                    id: 6,
                    name: '上海鹏博士01点播中层节点'
                }],
                upper: [{
                    chiefType: 1,
                    id: 64,
                    name: '北京多线02节点电信'
                }, {
                    chiefType: 1,
                    id: 65,
                    name: '北京多线02节点联通'
                }]
            },{
                id: 106,
                local: [{
                    id: 7,
                    name: '华数'
                }],
                upper: [{
                    chiefType: 1,
                    id: 64,
                    name: '北京多线02节点电信'
                }]
            }];

            this.table = $(_.template(template['tpl/setupTopoManage/setupTopoManage.replace.table.html'])({
                data: this.ruleList
            }));
            if (this.ruleList.length !== 0) {
                this.$el.find(".table-ctn").html(this.table[0]);
            } else {
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty-2.html'])({
                    data: {
                        message: "暂无数据"
                    }
                }));
            }
        },

        onGetAllOriginNodes: function() {
            /*var nameList = [];
            _.each(list, function(el, inx, list) {
                nameList.push({
                    name: el.name,
                    value: el.id
                })
            }.bind(this))*/
            this.nameList = [{
                name: '庆云移动11节点',
                id: 101
            }, {
                name: '深圳鹏博士01节点',
                id: 102
            }, {
                name: '盐城电信02节点',
                id: 103
            }, {
                name: '盐城电信03节点',
                id: 104
            }]

            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-originNode').get(0),
                panelID: this.$el.find('#dropdown-originNode').get(0),
                isSingle: true,
                openSearch: true,
                selectWidth: 200,
                isDataVisible: false,
                onOk: function() {},
                data: this.nameList,
                callback: function(data) {
                    this.$el.find('#dropdown-originNode .cur-value').html(data.name);
                    //  this.collection.getAllCityAndBigArea({
                    //    provId: data.value
                    //})
                }.bind(this)
            });
            this.$el.find("#dropdown-originNode .cur-value").html(this.nameList[0].name);
        },
        onGetAllReplaceNodes: function() {
            /*var nameList = [];
            _.each(list, function(el, inx, list) {
                nameList.push({
                    name: el.name,
                    value: el.id
                })
            }.bind(this))*/
            this.nameList = [{
                name: '庆云移动11节点',
                id: 101
            }, {
                name: '深圳鹏博士01节点',
                id: 102
            }, {
                name: '盐城电信02节点',
                id: 103
            }, {
                name: '盐城电信03节点',
                id: 103
            }]

            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-replaceNode').get(0),
                panelID: this.$el.find('#dropdown-replaceNode').get(0),
                isSingle: true,
                openSearch: true,
                selectWidth: 200,
                isDataVisible: false,
                onOk: function() {},
                data: this.nameList,
                callback: function(data) {
                    this.$el.find('#dropdown-replaceNode .cur-value').html(data.name);
                    //  this.collection.getAllCityAndBigArea({
                    //    provId: data.value
                    //})
                }.bind(this)
            });
            this.$el.find("#dropdown-replaceNode .cur-value").html(this.nameList[0].name);
        },

        onClickSelectItem: function() {
            this.initRuleTable();
        },

        onClickCancelButton: function() {
            this.options.onCancelCallback && this.options.onCancelCallback();
        },

        render: function(target) {
            this.$el.appendTo(target);
        }

      });
        return ReplaceNodeView;
});