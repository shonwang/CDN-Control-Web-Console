define("hashOrigin.selectHash.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var SelectHashView = Backbone.View.extend({
            events: {},

            initialize: function(options) {
                this.collection = options.collection;
                this.selectedHash = options.selectedHash;

                this.$el = $(_.template(template['tpl/hashOrigin/hashOrigin.selectHash.html'])({}));
                this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                this.collection.off("get.hashOrigin.success");
                this.collection.off("get.hashOrigin.error");
                this.collection.on("get.hashOrigin.success",$.proxy(this.onGetHashSuccess,this));
                this.collection.on("get.hashOrigin.error",$.proxy(this.onGetError,this));
                var args = {
                    "page"      : 1,
                    "count"     : 9999
                };
                this.allHash = [];
                this.collection.getHashList(args);
            },

            onGetHashSuccess: function(res) {
                var _res = res.rows;
                _.each(_res, function(el, index, list) {
                        el.isDisplay = true;
                        el.isChecked = false;
                        _.each(this.selectedHash, function(hash) {
                            if (el.id === hash.id) {
                                el.isChecked = true;
                                el.hashIndex = hash.hashIndex;
                            }
                        }.bind(this))
                        this.allHash.push(el);
                    // }
                }.bind(this))

                var checkedArray = _.filter(this.allHash, function(obj) {
                    return obj.isChecked === true;
                }.bind(this))

                var notCheckedArray = _.filter(this.allHash, function(obj) {
                    return obj.isChecked === false;
                }.bind(this))

                this.allHash = checkedArray.concat(notCheckedArray);
                console.log('allHash:',this.allHash);

                if (this.selectedHash.length === this.allHash.length){
                    this.isCheckedAll = true
                }

                this.initTable();
            },

            onGetError: function(error) {
                if (error && error.message)
                    alert(error.message)
                else
                    alert("网络阻塞，请刷新重试！")
            },

            initTable: function() {
                this.table = $(_.template(template['tpl/hashOrigin/hashOrigin.selectHash.table.html'])({
                    data: this.allHash,
                    isCheckedAll: this.isCheckedAll || false
                }));
                if (this.allHash.length !== 0)
                    this.$el.find(".table-ctn").html(this.table[0]);
                else
                    this.$el.find(".table-ctn").html(_.template(template['tpl/empty-2.html'])({
                        data: {
                            message: "暂无数据"
                        }
                    }));

                this.table.find("tbody tr").find("input").on("click", $.proxy(this.onItemCheckedUpdated, this));
                this.table.find("thead input").on("click", $.proxy(this.onAllCheckedUpdated, this));
            },

            onItemCheckedUpdated: function(event) {
                var eventTarget = event.srcElement || event.target;
                if (eventTarget.tagName !== "INPUT") return;
                var id = $(eventTarget).attr("id");

                var selectedObj = _.find(this.allHash, function(object) {
                    return object.id === parseInt(id)
                }.bind(this));

                selectedObj.isChecked = eventTarget.checked

                var checkedList = this.allHash.filter(function(object) {
                    return object.isChecked === true;
                })
                if (checkedList.length === this.allHash.length)
                    this.table.find("thead input").get(0).checked = true;
                if (checkedList.length !== this.allHash.length)
                    this.table.find("thead input").get(0).checked = false;
            },

            onAllCheckedUpdated: function(event) {
                var eventTarget = event.srcElement || event.target;
                if (eventTarget.tagName !== "INPUT") return;
                this.table.find("tbody tr").find("input").each(function(index, node) {
                    $(node).prop("checked", eventTarget.checked);
                    _.each(this.allHash, function(el){
                        if (el.id === parseInt(node.id)) el.isChecked = eventTarget.checked;
                    }.bind(this))
                }.bind(this))
            },

            getArgs: function() {
                var checkedList = _.filter(this.allHash, function(object) {
                    return object.isChecked === true;
                })
                return checkedList
            },

            render: function(target) {
                this.$el.appendTo(target);
            }
        });

        return SelectHashView;
    });