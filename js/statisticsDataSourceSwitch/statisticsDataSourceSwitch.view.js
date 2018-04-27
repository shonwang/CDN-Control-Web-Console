define("statisticsDataSourceSwitch.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var StatisticsDataSourceSwitchView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/statisticsDataSourceSwitch/statisticsDataSourceSwitch.html'])());

            this.$el.find(".submit").on("click", $.proxy(this.onClickSubmitBtn, this));

            this.collection.on("get.info.success", $.proxy(this.onListSuccess, this));
            this.collection.on("get.info.error", $.proxy(this.onGetError, this));

            this.collection.on("set.info.success", $.proxy(this.onSetInfoSuccess, this));
            this.collection.on("set.info.error", $.proxy(this.onGetError, this));

            this.collection.getInfo();
        },

        onGetError: function(error){
            if (error&&error.message)
                Utility.alerts(error.message)
            else
                Utility.alerts("网络阻塞，请刷新重试！")
        },

        onListSuccess: function(){
            this.initTable();
        },

        onSetInfoSuccess: function(){
            Utility.alerts("提交成功！", "success");
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/statisticsDataSourceSwitch/statisticsDataSourceSwitch.table.html'])({
                data: this.collection.models
            }));
            if (this.collection.models.length !== 0) {
                this.$el.find(".table-ctn").html(this.table[0]);

                this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
                this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));
            } else {
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            }
        },

        onClickSubmitBtn: function(event){
            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") === true;
            })
            var ids = [], sourceCompareFlag = 0;
            _.each(checkedList, function(el, index, list){
                if (checkedList[0] && 
                    el.get("sourcePrimary") != checkedList[0].get("sourcePrimary") && 
                    el.get("sourceBackup") != checkedList[0].get("sourceBackup")) {
                    sourceCompareFlag += 1
                }
                ids.push(el.get("id"));
            })
            if (ids.length === 0) {
                Utility.alerts("至少选择一项再提交！");
                return false;
            }

            if (sourceCompareFlag > 0) {
                Utility.alerts("已选数据源必须主备一致！");
                return false;
            }

            var postParam = {
                ids: ids.join(","),
                sources: checkedList[0].get("sourceBackup") + "," + checkedList[0].get("sourcePrimary")
            }

            console.log(postParam)
            //this.collection.setInfo(postParam);
        },

        onItemCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            var id = $(eventTarget).attr("id");
            var model = this.collection.get(id);
            model.set("isChecked", eventTarget.checked)

            var checkedList = this.collection.filter(function(model) {
                return model.get("isChecked") === true;
            })
            if (checkedList.length === this.collection.models.length)
                this.table.find("thead input").get(0).checked = true;
            if (checkedList.length !== this.collection.models.length)
                this.table.find("thead input").get(0).checked = false;
        },

        onAllCheckedUpdated: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            this.collection.each(function(model){
                model.set("isChecked", eventTarget.checked);
            }.bind(this))
            this.table.find("tbody tr").find("input").prop("checked", eventTarget.checked);
        },

        hide: function(){
            this.$el.hide();
        },

        update: function(target){
            this.collection.off();
            this.collection.reset();
            this.remove();
            this.initialize(this.options);
            this.render(target);
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return StatisticsDataSourceSwitchView;
});