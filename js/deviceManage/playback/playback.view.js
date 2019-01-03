define("playback.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    
    var PlaybackView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/deviceManage/playback/playback.html'])());
            $("<div class='back-to-top'><span class='glyphicon glyphicon-menu-up'></span></div>").appendTo(document.body);
            
            this.collection.on("get.task.info.success", $.proxy(this.onTaksListSuccess, this));
            this.collection.on("get.task.info.error", $.proxy(this.onGetError, this));
            this.collection.on("get.task.progress.success", $.proxy(this.onTaskProgressSuccess, this));
            this.collection.on("get.task.progress.error", $.proxy(this.onGetError, this));
            this.collection.on("set.task.status.success", $.proxy(this.onSetTaskStatusSuccess, this));
            this.collection.on("set.task.status.error", $.proxy(this.onGetError, this));

            this.$el.find(".opt-ctn .all").on("click", $.proxy(this.onClickFilterTaskButton, this, 0));
            this.$el.find(".opt-ctn .playback").on("click", $.proxy(this.onClickFilterTaskButton, this, 1));
            this.$el.find(".opt-ctn .wait").on("click", $.proxy(this.onClickFilterTaskButton, this, 2));
            this.$el.find(".opt-ctn .cutinline").on("click", $.proxy(this.onClickFilterTaskButton, this, 3));
            this.$el.find(".opt-ctn .pause").on("click", $.proxy(this.onClickFilterTaskButton, this, 4));

            $(".back-to-top").on("click", $.proxy(this.onBackToTop, this))
            $(document).scroll($.proxy(this.onScorll, this));

            this.queryArgs = {
                "status":0
             }
            this.onClickQueryButton();
        },

        onBackToTop: function(){
            $('html,body').animate({scrollTop: 0}, 200);
        },

        onScorll: function(event){
            var scorllTop = $('html,body').scrollTop();
            if (scorllTop >= 300) {
                $(".back-to-top").show(200)
            } else {
                $(".back-to-top").hide(200)
            }

            var hh = $('html,body').height(),
            scrollTop1 = $('html,body').get(0).scrollTop,
            scrollHHeight = $('html,body').get(0).scrollHeight;
            console.log("hh:", hh)
            console.log("scrollTop1:", scrollTop1)
            console.log("scrollHHeight:", scrollHHeight)
        },

        onClickFilterTaskButton: function(status){
            this.queryArgs.status = status
            this.onClickQueryButton();
        },

        onGetError: function(error){
            if (error&&error.message)
                Utility.alerts(error.message)
            else
                Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
        },

        getTaskProgress: function(){
            _.each(this.collection.models, function(model){
                if (model && (model.get("replayStatus") == 4 || model.get("replayStatus") == 6)) {
                    this.collection.remove(model);
                        this.initTable();
                }
            }.bind(this))

            var idObjArray = [];
            _.each(this.collection.models, function(model){
                idObjArray.push({
                    taskId: model.get("id")
                });
            }.bind(this))
            if (idObjArray.length > 0)
                this.collection.getTaskProgress(idObjArray)
        },

        onTaskProgressSuccess: function(res){
            _.each(res, function(obj){
                var detailNode = this.$el.find("#detail-" + obj.taskId)
                detailNode.find(".replay-position").html(new Date(obj.replayPosition).format("yyyy/MM/dd hh:mm:ss"))
                detailNode.find(".progress-bar-success").css("width", obj.progress * 100 + "%")
                detailNode.find(".progress-bar-success span").html(obj.progress * 100 + "%")
                detailNode.find(".remaining-minute p span").html(obj.remainingMinute);
                var statusStr = '';
                if (obj.replayStatus == 0) {
                    statusStr = '<img src="images/task_wait.svg" style="max-width:50px;margin-top:50px">' + 
                    '<p>排队中</p>'
                } else if (obj.replayStatus == 10) {
                    statusStr = '<img src="images/task_wait.svg" style="max-width:50px;margin-top:50px">' + 
                    '<p>排队中（<span class="text-danger">优先</span>）</p>'
                } else if (obj.replayStatus == 1) {
                    statusStr = '<img src="images/task_running.svg" style="max-width:50px;margin-top:50px">' + 
                    '<p>回放中</p>'
                } else if (obj.replayStatus == 2) {
                    statusStr = '<img src="images/task_pause.svg" style="max-width:50px;margin-top:50px">' + 
                    '<p style="margin-top:10px">暂停中</p>'
                } else if (obj.replayStatus == 3) {
                    statusStr = '<img src="images/holdup.svg" style="max-width:50px;margin-top:50px">' + 
                    '<p style="margin-top:10px">已挂起</p>'
                } else if (obj.replayStatus == 4) {
                    statusStr = '<img src="images/task_done.svg" style="max-width:50px;margin-top:50px">' + 
                    '<p style="margin-top:10px">回放完成</p>'
                } else if (obj.replayStatus == 9) {
                    statusStr = '<img src="images/task_failed.svg" style="max-width:50px;margin-top:50px">' +
                    '<p style="margin-top:10px">回放失败</p>'
                }
                this.$el.find("#status-" + obj.taskId).html(statusStr)

                var optNode = this.$el.find("#opt-" + obj.taskId)
                if (obj.replayStatus == 1) {
                    optNode.find(".cutinline").remove();
                    optNode.find(".holdup").remove();
                    if (!optNode.find(".pause").get(0)) {
                        var tpl = '<div style="margin-bottom:10px">' + 
                                    '<a href="javascript:void(0)" class="btn btn-primary btn-sm pause" style="width:70px" id="' + obj.taskId + '">暂停</a>' + 
                                  '</div>'
                        var pauseNode = $(tpl)
                        pauseNode.on("click", $.proxy(this.onClickItemOpt, this, 1))
                        pauseNode.insertBefore(optNode.find(".giveup"))
                    }
                } else if(obj.replayStatus == 9 || obj.replayStatus == 4) {
                    optNode.html("")
                }
            }.bind(this))
        },

        onTaksListSuccess: function(){
            this.initTable();
            if (this.timer)
                clearInterval(this.timer)
            this.timer = setInterval($.proxy(this.getTaskProgress, this), 5000)
        },

        onClickQueryButton: function(){
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.collection.getTaskInfo(this.queryArgs);
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/deviceManage/playback/playback.taskItem.html'])({
                data: this.collection.models,
            }));
            if (this.collection.models.length !== 0)
                this.$el.find(".table-ctn").html(this.table[0]);
            else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());

            this.table.find(".btn-ctn .pause").on("click", $.proxy(this.onClickItemOpt, this, 1));
            this.table.find(".btn-ctn .start").on("click", $.proxy(this.onClickItemOpt, this, 0));
            this.table.find(".btn-ctn .cutinline").on("click", $.proxy(this.onClickItemOpt, this, 3));
            this.table.find(".btn-ctn .cancel-cut").on("click", $.proxy(this.onClickItemOpt, this, 4));
            this.table.find(".btn-ctn .holdup").on("click", $.proxy(this.onClickItemOpt, this, 5));
            this.table.find(".btn-ctn .cancel-holdup").on("click", $.proxy(this.onClickItemOpt, this, 6));
            this.table.find(".btn-ctn .giveup").on("click", $.proxy(this.onClickItemOpt, this, 2));

            this.table.find(".device-ctn .more").on("click", $.proxy(this.onClickItemMore, this));
            this.table.find(".device-ctn .less").on("click", $.proxy(this.onClickItemLess, this));
        },

        onClickItemOpt: function(status, event){
            var eventTarget = event.srcElement || event.target, id;
            id = $(eventTarget).attr("id");
            var statusStr = ["开启", "暂停", "放弃", "插队", "取消插队", "挂起", "取消挂起"]
            Utility.confirm("你确定要" + statusStr[status] + "吗？", function(){
                this.collection.setTaskStatus({
                    taskId: id,
                    status: status
                })
            }.bind(this))
        },

        onClickItemMore:function(event){
            var eventTarget = event.srcElement || event.target, id;
            id = $(eventTarget).attr("id");
            this.$el.find("#device-" + id).removeAttr("style")
            this.table.find("#device-opt-"+ id + " .more").hide()
            this.table.find("#device-opt-"+ id + " .less").show()
        },

        onClickItemLess:function(event){
            var eventTarget = event.srcElement || event.target, id;
            id = $(eventTarget).attr("id");
            this.$el.find("#device-" + id).css("max-height", "90px");
            this.$el.find("#device-" + id).css("overflow", "hidden");
            this.table.find("#device-opt-"+ id + " .more").show()
            this.table.find("#device-opt-"+ id + " .less").hide()
        },

        onSetTaskStatusSuccess: function(){
            Utility.alerts("操作成功", "success", 5000);
            this.onClickQueryButton();
        },

        hide: function(){
            this.$el.hide();
            if (this.timer)
                clearInterval(this.timer)
            $(document).off("scroll")
            $(".back-to-top").remove();
        },

        update: function(target) {
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

    return PlaybackView;
});