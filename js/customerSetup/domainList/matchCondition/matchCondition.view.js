define("matchCondition.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var MatchConditionView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/customerSetup/domainList/matchCondition.html'])({}));
            this.initDropdown();

            this.collection.on("get.fileType.success", $.proxy(this.onGetFileType, this))
            this.collection.on("get.fileType.error", $.proxy(this.onGetError, this))
        },

        initDropdown: function(){
            rootNode = this.$el.find(".match-type");
            Utility.initDropMenu(rootNode, this.options.matchConditionArray, function(value){
                this.options.defaultCondition = parseInt(value);
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

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        onGetFileType: function(data){
            this.allFileType = data;
            this.initFileType()
        },

        initMatchCondition: function(value){
            this.hideAllOptions();
            switch(parseInt(value)){
                case 9:
                    break;
                case 0:
                    this.collection.getFileType();
                    break;
                case 2:
                    this.initUri();
                    break;
                case 1:
                    this.initDir();
                    break;
                case 3:
                    this.initRe();
                    break;
                default:
            }
        },

        getMatchConditionParam: function(){
            var urlValue = this.$el.find("#textarea-uri").val(),
                dirValue = this.$el.find("#textarea-dir").val(),
                reValue  = this.$el.find("#textarea-re").val();

            if (urlValue === "" && this.options.defaultCondition === 2) {
                alert("匹配条件你没有填写任何东西！")
                return false;
            } else if (dirValue === "" && this.options.defaultCondition === 1) {
                alert("匹配条件你没有填写任何东西！")
                return false;
            } else if (reValue === "" && this.options.defaultCondition === 3) {
                alert("匹配条件你没有填写任何东西！")
                return false;
            }

            var isError = this.$el.find(".alert-danger").css("display") === "none" ? false : true;
            if (isError) {
                alert("匹配条件有错误，请改正后再提交！");
                return false;
            }

            var policy = "";

            switch(this.options.defaultCondition){
                case 9:
                    break;
                case 0:
                    policy = this.getFileTypePolicy();
                    if (!policy) return;
                    break;
                case 2:
                    policy = urlValue;
                    break;
                case 1:
                    policy = dirValue;
                    break;
                case 3:
                    policy = reValue;
                    break;
                default:
            }
            var postParam = {
                type: this.options.defaultCondition,
                policy: policy
            }
            return postParam
        },

        initRe: function(){
            this.$el.find(".re").show();
            this.$el.find("#textarea-re").val(this.options.defaultPolicy);
            this.$el.find("#textarea-re").off();
            this.$el.find("#textarea-re").on("blur", $.proxy(this.onBlurReTextarea, this))
        },

        onBlurReTextarea: function(event){
            var eventTarget = event.srcElement || event.target, value = $(eventTarget).val();

            if (value === "") 
                this.showAlert("不能为空！")
            else
                this.$el.find(".alert-danger").hide();
        },

        initDir: function(){
            this.$el.find(".dir").show();
            this.$el.find("#textarea-dir").val(this.options.defaultPolicy);
            this.$el.find("#textarea-dir").off();
            this.$el.find("#textarea-dir").on("blur", $.proxy(this.onBlurDirTextarea, this))
        },

        onBlurDirTextarea: function(event){
            var re = /^\/[^\/]{0,}([a-z0-9\_\-%]|\/[^\/]){0,}\/$/;
            var eventTarget = event.srcElement || event.target, value = $(eventTarget).val();

            if (!re.test(value)) 
                this.showAlert("请输入正确的目录")
            else
                this.$el.find(".alert-danger").hide();
        },

        initUri: function(){
            this.$el.find(".uri").show();
            this.$el.find("#textarea-uri").val(this.options.defaultPolicy);
            this.$el.find("#textarea-uri").off();
            this.$el.find("#textarea-uri").on("blur", $.proxy(this.onBlurUriTextarea, this));
        },

        onBlurUriTextarea: function(event){
            var re = /^\/[^\/]{0,}([a-z0-9\_\-\.]|\/[^\/]){0,}[^\/]{0,}$/;
            var eventTarget = event.srcElement || event.target, value = $(eventTarget).val();

            if (!re.test(value)) 
                this.showAlert("禁止http://或https://开头，仅需要URL中的URI部分。例如：http://www.baidu.com/123/index.html,则需要配置内容为：/123/index.html")
            else
                this.$el.find(".alert-danger").hide();
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

            // var zNodes =[
            //     { id:1, pId:0, name:"随意勾选 1", open:true, checked:true},
            //     { id:11, pId:1, name:"随意勾选 1-1", checked:true},
            //     { id:12, pId:1, name:"随意勾选 1-2"},
            //     { id:2, pId:0, name:"随意勾选 2", open:true},
            //     { id:21, pId:2, name:"随意勾选 2-1"},
            //     { id:22, pId:2, name:"随意勾选 2-2"},
            //     { id:23, pId:2, name:"随意勾选 2-3"}
            // ];
            var policyArray = [], allFileTypeArray = []; this.customFileType = [];
            if (this.options.defaultPolicy) policyArray = this.options.defaultPolicy.split(";");

            _.each(this.allFileType, function(el, index, ls){
                if (el.pId === null) el.open = true;
                allFileTypeArray.push(el.name)
            }.bind(this))

            _.each(policyArray, function(el, index, ls){
                if (_.indexOf(allFileTypeArray, el) !== -1) {
                    _.each(this.allFileType, function(el1, index1, ls1){
                        if (el1.name === el) el1.checked = true;
                    }.bind(this))
                }
                if (_.indexOf(allFileTypeArray, el) === -1) 
                    this.customFileType.push(el)
            }.bind(this))

            this.$el.find("#textarea-file-type").val(this.customFileType.join(";"))

            this.treeObj = $.fn.zTree.init(this.$el.find("#tree"), setting, this.allFileType);
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
            this.matchFileTypeNodes = this.treeObj.getNodesByFilter(matchDeviceFilter);
        },

        getTreeChecked: function(e, treeId, treeNode){
            _.each(this.allFileType, function(el, k, l){
                var node = this.treeObj.getNodeByParam("id", el.id, null);
                el.checked = node.checked
            }.bind(this));
        },

        getFileTypePolicy: function(){
            var customFileType = this.$el.find("#textarea-file-type").val();
            if (this.matchFileTypeNodes.length === 0 &&
                customFileType === ""){
                alert("文件类型不能为空");
                return false
            }
            var fileTypeArray = [];
            _.each(this.matchFileTypeNodes, function(el, index, ls){
                fileTypeArray.push(el.name)
            }.bind(this))

            var fileTypePolicy = fileTypeArray.join(";");
            if (customFileType) fileTypePolicy = fileTypePolicy + ";" + customFileType;

            return fileTypePolicy
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
            this.$el.find(".alert-danger").show();
            this.$el.find(".alert-danger strong").html(msg);
        },

        hideAllOptions: function(){
            this.$el.find(".file-type").hide();
            this.$el.find(".uri").hide();
            this.$el.find(".dir").hide();
            this.$el.find(".re").hide();
            this.$el.find(".alert-danger").hide();
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