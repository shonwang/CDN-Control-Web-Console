define("domainList.project.view", ['require','exports', 'template','utility', "modal.view"],
    function(require, exports, template, Utility, Modal) {


    var ProjectView = Backbone.View.extend({
        initialize: function(options) {
            this.collection = options.collection;
            this.userInfo = options.userInfo;
            this.parent = options.obj;
            this.selectedList = options.selectedList;
            this.okCallback = options.okCallback || null;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/domainList.project.html'])({data:this.selectedList}));
            this.$el.find("#add-project-btnCancle").on("click",$.proxy(this.onCancel,this));
            this.$el.find("#add-project-btnSubmit").on("click",$.proxy(this.onOkClick,this));
            this.collection.on("get.project.success",$.proxy(this.onGetAllProjectSuccess,this));
            this.collection.on("get.project.error",$.proxy(this.onGetError,this));
            var args = {
                userId:this.userInfo.uid
            };
            this.showProjectLoading();
            this.collection.getAllProject(args);
        },

        showProjectLoading:function(){
            this.$el.find(".ks-table-select-project tbody").html('<tr><td class="text-center"><div class="domain-spinner">正在加载...</div></td></tr>');
        },

        onCancel:function(){
            this.parent.onCancelModifiedProject();
        },

        onGetError:function(){
            this.$el.find(".ks-table-select-project tbody").html("<td class='text-center'>出现错误</td>")
        },

        onGetAllProjectSuccess:function(res){
            var res = eval('('+res+')');
            var data = res && res.ListProjectResult.ProjectList || null;
            if(data && data.length>0){
                this.table = $(_.template(template['tpl/customerSetup/domainList/domainList.project.table.html'])({data:data}))
            }   
            else{
                this.table = $('<tr><td class="text-center" style="height:30px;">暂无数据</td></tr>')
            }
            this.$el.find(".ks-table-select-project tbody").html(this.table);
        },

        updateView:function(obj){

        },
        
        onOkClick:function(){
            var args = this.getArgs();
            if(!args){return false;}
            this.okCallback && this.okCallback(args);
        },

        getArgs:function(){
            var originIds = [];
            _.each(this.selectedList,function(list){
                originIds.push(list.get("id"))
            });
            originIds = originIds.join(",");
            var projectId = parseInt(this.$el.find("input[type=radio]:checked").val());
            return {
                originIds:originIds,
                userId:this.userInfo.uid,
                projectId:projectId
            }
        },

        render: function(target){
            this.$el.appendTo(target);
        }

    });

    return ProjectView;

});