define("setupModuleManage.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var SetupModuleManageView = Backbone.View.extend({
            events: {},

            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.$el = $(_.template(template['tpl/setupModuleManage/setupModuleManage.html'])());
                this.$el.find(".createModule").on("click", $.proxy(this.onClickAddModule, this));

                this.collection.on("get.moduleList.success", $.proxy(this.onGetModuleListSuccess, this));
                this.collection.on("get.moduleList.error", $.proxy(this.onGetError, this));
                this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                this.collection.getListModule();
  
            },
            
            onGetModuleListSuccess:function(res){
                  this.moduleList=res;
                  this.initTable();
            },

            onClickAddModule: function() {
                this.hideList();
                require(["setupModuleManage.addModule.view"], function(AddModule) {
                    this.addModule = new AddModule({
                        collection: this.collection,
                        isEdit: false,
                        onCancelCallback: function() {
                            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                            this.collection.getListModule()
                            this.addModule.$el.remove();
                            this.$el.find(".moduleManage").show();
                        }.bind(this)
                    });
                    this.addModule.render(this.$el.find(".addModule"));
                }.bind(this))

            },

            initTable: function() {
                this.table = $(_.template(template['tpl/setupModuleManage/setupModuleManage.table.html'])({
                    data: this.moduleList
                }));
                this.$el.find(".table-ctn").html(this.table[0]);
                this.table.find(".editModule").on("click", $.proxy(this.onClickEditModule, this));
            },

            onClickEditModule: function(event) {
                this.hideList();
                var eventTarget = event.srcElement || event.target,
                    id;
                 id = $(eventTarget).attr("id");
                require(["setupModuleManage.addModule.view"], function(AddModule) {
                    this.addModule = new AddModule({
                        collection: this.collection,
                        moduleId:id,
                        isEdit: true,
                        onCancelCallback: function() {
                            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                            this.collection.getListModule()
                            this.addModule.$el.remove();
                            this.$el.find(".moduleManage").show();
                        }.bind(this)
                    });
                    this.addModule.render(this.$el.find(".addModule"));
                }.bind(this))
            },
            
            showList: function() {
                this.$el.find(".moduleManage").show();
            },

            hideList: function() {
                this.$el.find(".moduleManage").hide();
            },

            onGetError: function(error) {
                if (error && error.message)
                    alert(error.message)
                else
                    alert("网络阻塞，请刷新重试！")
            },

            hide: function() {
                this.$el.hide();
            },

            update: function(target) {
                this.collection.off();
                this.collection.reset();
                this.remove();
                this.initialize(this.options);
                this.render(target || this.target);
            },

            render: function(target) {
                this.$el.appendTo(target)
                this.target = target;
            }
        });

        return SetupModuleManageView;
    });