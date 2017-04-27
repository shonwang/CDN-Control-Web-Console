define("setupTopoManage.history.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var HistoryView = Backbone.View.extend({
            events: {
                //"click .search-btn":"onClickSearch"
            },

            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.model = options.model;

                this.$el = $(_.template(template['tpl/setupTopoManage/setupTopoManage.history.html'])({
                    data: this.model
                }));

                this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

                this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));

                var tempData = [{
                    id: 10929,
                    remark: '~/(≧▽≦)/~啦啦啦',
                    updateTime: 1492769855000,
                    version: "201704211817_r1"
                }]

                this.initSetup(tempData)
            },

            initSetup: function(data) {
                this.versionList = data;

                _.each(data, function(el, index, ls) {
                    if (el.updateTime)
                        el.updateTimeFormated = new Date(el.updateTime).format("yyyy/MM/dd hh:mm:ss");
                }.bind(this))

                this.table = $(_.template(template['tpl/setupTopoManage/setupTopoManage.history.table.html'])({
                    data: data,
                }));

                if (data.length !== 0) {
                    this.$el.find(".table-ctn").html(this.table[0]);
                } else {
                    this.$el.find(".table-ctn").html(_.template(template['tpl/empty-2.html'])({
                        data: {
                            message: "暂无数据"
                        }
                    }));
                }

                this.table.find("tbody .publish").on("click", $.proxy(this.onClickItemPublish, this));
                this.table.find("tbody .views").on("click", $.proxy(this.onClickItemViews, this));

                this.table.find("[data-toggle='popover']").popover();
            },

            onClickItemViews: function(event) {
                var eventTarget = event.srcElement || event.target,
                    version = $(eventTarget).attr("version");

                //var model = this.collection.get(id);
                require(['setupTopoManage.edit.view'], function(EditTopoView) {
                    var myEditTopoView = new EditTopoView({
                        collection: this.collection,
                        model: this.model,
                        isEdit: false,
                        isView: true,
                        onSaveCallback: function() {
                            myEditTopoView.$el.remove();
                            this.$el.show();
                            this.onClickQueryButton();
                        }.bind(this),
                        onCancelCallback: function() {
                            myEditTopoView.$el.remove();
                            this.$el.show();
                        }.bind(this)
                    })

                    this.$el.hide();
                    myEditTopoView.render(this.$el.parent().siblings(".edit-panel"));
                }.bind(this));
            },

            onClickCancelButton: function() {
                this.options.onCancelCallback && this.options.onCancelCallback();
            },

            onGetError: function(error) {
                if (error && error.message)
                    alert(error.message)
                else
                    alert("网络阻塞，请刷新重试！")
            },

            render: function(target) {
                this.$el.appendTo(target);
            }
        });

        return HistoryView
    });