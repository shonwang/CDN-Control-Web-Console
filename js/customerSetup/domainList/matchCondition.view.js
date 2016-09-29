define("matchCondition.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var MatchConditionView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/matchCondition.html'])({}));
            this.initDropdown();
        },

        initDropdown: function(){
            rootNode = this.$el.find(".match-type");
            Utility.initDropMenu(rootNode, this.options.matchConditionArray, function(value){
                this.initMatchCondition(value)
            }.bind(this));

            var defaultValue = _.find(this.options.matchConditionArray, function(object){
                return object.value === this.options.defaultCondition;
            }.bind(this));

            if (defaultValue)
                this.$el.find("#dropdown-match-type .cur-value").html(defaultValue.name);
            else
                this.$el.find("#dropdown-match-type .cur-value").html(this.options.matchConditionArray[0].name);
            this.hideAllOptions();
        },

        initMatchCondition: function(value){
            this.hideAllOptions();
            switch(parseInt(value)){
                case 1:
                    break;
                case 2:
                    this.initFileType();
                    break;
                case 3:
                    this.initUri();
                    break;
                case 4:
                    this.initDir();
                    break;
                case 5:
                    this.initRe();
                    break;
                default:
            }
        },

        initRe: function(){
            this.$el.find(".re").show();
            this.$el.find("#textarea-re").off();
            this.$el.find("#textarea-re").on("blur", $.proxy(this.onBlurReTextarea, this))
        },

        onBlurReTextarea: function(event){
            var eventTarget = event.srcElement || event.target, value = $(eventTarget).val();

            if (value === "") 
                this.showAlert("不能为空！")
            else
                this.$el.find(".alert").hide();
        },

        initDir: function(){
            this.$el.find(".dir").show();
            this.$el.find("#textarea-dir").off();
            this.$el.find("#textarea-dir").on("blur", $.proxy(this.onBlurDirTextarea, this))
        },

        onBlurDirTextarea: function(event){
            var re = /^\/[^\/]{0,}([a-z0-9\_\-%]|\/[^\/]){0,}\/$/;
            var eventTarget = event.srcElement || event.target, value = $(eventTarget).val();

            if (!re.test(value)) 
                this.showAlert("请输入正确的目录")
            else
                this.$el.find(".alert").hide();
        },

        initUri: function(){
            this.$el.find(".uri").show();
            this.$el.find("#textarea-uri").off();
            this.$el.find("#textarea-uri").on("blur", $.proxy(this.onBlurUriTextarea, this));
        },

        onBlurUriTextarea: function(event){
            var re = /^\/[^\/]{0,}([a-z0-9\_\-\.]|\/[^\/]){0,}[^\/]{0,}$/;
            var eventTarget = event.srcElement || event.target, value = $(eventTarget).val();

            if (!re.test(value)) 
                this.showAlert("请输入正确的URI")
            else
                this.$el.find(".alert").hide();
        },

        initFileType: function(){
            this.$el.find(".file-type").show();
            if (!this.treeObj) this.initFileTypeTree();
        },

        initFileTypeTree: function(){
            var setting = {
                check: {
                    enable: true
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    onCheck: function(e,treeId,treeNode){
                        this.getTreeSelected();
                        this.getTreeChecked(e,treeId,treeNode);
                    }.bind(this)
                }
            };

            // var zNodes = res[this.nodeGroupId];

            // _.each(zNodes,function(el,index,ls){
            //     el.open = false;
            //     el.highlight = false;
            //     el.nodeIcon = false;
            //     if(el.pId == -1){
            //         el.open = true;
            //         el.nodeIcon = true; //节点显示“文件夹”图标
            //     }
            //     if(el.deviceStatus != 1 && el.pId != -1){
            //         el.highlight = true;
            //     }
            //     if(el.nodeStatus != 1 && el.pId == -1){
            //         el.highlight = true;
            //     }
            // }.bind(this));

            var zNodes =[
                { id:1, pId:0, name:"随意勾选 1", open:true,checked:true},
                { id:11, pId:1, name:"随意勾选 1-1", highlight: true,checked:true},
                { id:12, pId:1, name:"随意勾选 1-2"},
                { id:2, pId:0, name:"随意勾选 2", open:true},
                { id:21, pId:2, name:"随意勾选 2-1"},
                { id:22, pId:2, name:"随意勾选 2-2"},
                { id:23, pId:2, name:"随意勾选 2-3"}
            ];

            this.treeObj = $.fn.zTree.init(this.$el.find("#tree"), setting, zNodes);
            this.getTreeSelected(); 
            this.$el.find(".checkAll").on("click", $.proxy(this.onClickCheckAll, this));
            this.$el.find(".cancelAll").on("click", $.proxy(this.onClickCancelCheckAll, this));
        },

        getTreeSelected: function(){
            if (!this.treeObj) return;
            var matchFilter = function(node){
                return node.checked === true && node.pId === null;
            };
            this.matchNodes = this.treeObj.getNodesByFilter(matchFilter);

            var matchDeviceFilter = function(node){
                return node.checked === true && node.pId !== null;
            };
            this.matchDeviceNodes = this.treeObj.getNodesByFilter(matchDeviceFilter);
        },

        getTreeChecked: function(e, treeId, treeNode){
            // _.each(this.nodeTreeLists[this.nodeGroupId], function(nodeGroupObj, k, l){
            //     var node = this.treeObj.getNodeByParam("id", nodeGroupObj.id, null);
            //     nodeGroupObj.checked = node.checked
            // }.bind(this));
        },

        onClickCheckAll: function(event){
            if (!this.treeObj) return;
            this.treeObj.checkAllNodes(true);
            this.getTreeSelected();
            this.getTreeChecked();
        },

        onClickCancelCheckAll: function(event){
            if (!this.treeObj) return;
            this.treeObj.checkAllNodes(false);
            this.getTreeSelected();
            this.getTreeChecked();
        },

        showAlert: function(msg){
            this.$el.find(".alert").show();
            this.$el.find(".alert strong").html(msg);
        },

        hideAllOptions: function(){
            this.$el.find(".file-type").hide();
            this.$el.find(".uri").hide();
            this.$el.find(".dir").hide();
            this.$el.find(".re").hide();
            this.$el.find(".alert").hide();
        },

        render: function(target) {
            this.$el.appendTo(target);
            setTimeout(function(){
                this.initMatchCondition(this.options.defaultCondition)
            }.bind(this), 500);
        }
    });

    return MatchConditionView;
});