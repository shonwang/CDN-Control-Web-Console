define("refreshManual.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {
    
    var FillRefreshURLView = Backbone.View.extend({
        initialize: function(options){
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/refreshManual/refreshManual.fill.html'])({}));

            this.initDropList();
        },

        initDropList: function(){
            var nameList = [
                {name: "预热", value: 1},
                {name: "刷新", value: 0}
            ];
            Utility.initDropMenu(this.$el.find(".dropdown-type"), nameList, function(value){
                // this.args.chargingType = parseInt(value);
            }.bind(this));
            
            this.$el.find(".dropdown-type .cur-value").html(nameList[0].name)
        },

        onClickSubmit: function(){
            // var submitData = {
            //     "ip_id" : this.id,
            //     "device_id" : this.deviceId
            // }
            // return submitData;
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var ImportFileView = Backbone.View.extend({
        events: {
            //"click .search-btn":"onClickSearch"
        },

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.model = options.model;
            this.$el = $(_.template(template['tpl/refreshManual/refreshManual.upload.html'])({}));
            this.$el.find(".progress-ctn").hide();

            this.isUploading = false;
            this.isError = false;
            this.isSelectedFile = false;

            this.uploadOption = {
                runtimes : 'html5,flash,silverlight,html4', //上传模式，依次退化;
                url: BASE_URL + "/rs/device/batchAdd", 
                browse_button: 'import-device-button', //触发对话框的DOM元素自身或者其ID
                flash_swf_url : 'resource/Moxie.swf', //Flash组件的相对路径
                silverlight_xap_url : 'resource/Moxie.xap', //Silverlight组件的相对路径;
                multipart: true,
                filters: {
                    max_file_size: 1024 * 1024 * 10
                },
                multi_selection: false,
                send_file_name: false, //是否添加额外的文件名，后端需要根据此计算签名，默认是true
            };

            this.initDropList();
        },

        initUploader: function(){
            this.uploader = new plupload.Uploader(this.uploadOption);
            this.uploader.init();

            this.uploader.bind("Error", function(up, obj){
                if (obj && obj.code === -600){
                    alert("上传文件超出最大限制:10MB");
                    return;
                }
                try{
                    var error = JSON.parse(obj.response)
                    alert(error.message)
                } catch(e){
                    alert("导入失败了！")
                }
                this.isError = true;
                this.uploader.splice(0, 1);
                this.isSelectedFile = false;
            }.bind(this));

            this.uploader.bind("FilesAdded", function(up, obj){
                if (!up) return;
                if (this.isError) this.isError = false;
                if (up.files.length > 1) this.uploader.splice(0, 1);
                this.$el.find("#import-device-file").val(up.files[0].name);
                this.$el.find(".progress-bar").css("width", "0%");
                this.$el.find(".progress-bar").html("0%");
                this.isSelectedFile = true;
            }.bind(this));

            this.uploader.bind("FileUploaded", function(up, obj, res){
                this.uploader.splice(0, 1);
                this.isSelectedFile = false;
            }.bind(this)); 

            this.uploader.bind("UploadProgress", function(up, obj){
                if (this.uploader.state === plupload.STOPPED) return;
                if (!obj) return;
                this.$el.find(".progress-bar").css("width", obj.percent + "%");
                this.$el.find(".progress-bar").html(obj.percent + "%");
            }.bind(this));

            this.uploader.bind("UploadComplete", function(up, obj, res){
                this.isUploading = false;
                this.uploader.disableBrowse(false);
                this.$el.find("#import-device-button").removeAttr("disabled")
                this.$el.find("#import-device-file").removeAttr("readonly")
                this.$el.find("#import-device-file").val("");
                if (this.isError) return;
                alert("导入完成！")
                this.options.uploadCompleteCallback && this.options.uploadCompleteCallback();
            }.bind(this));
        },

        onClickOK: function(){
            if (!this.isSelectedFile){
                alert("你还没有选择要导入的文件，或者你选择的文件已经导入过了！")
                return false;
            }
            if (this.isUploading) return false;
            var result = confirm("你确定要导入设备吗？");
            if (!result) return false;
            this.isUploading = true;
            this.$el.find(".progress-ctn").show();
            this.$el.find("#import-device-button").attr("disabled", "disabled")
            this.$el.find("#import-device-file").attr("readonly", "true")
            this.uploader.disableBrowse(true);
            this.uploader.start();
        },

        initDropList: function(){
            var nameList = [
                {name: "预热", value: 1},
                {name: "刷新", value: 0}
            ];
            Utility.initDropMenu(this.$el.find(".dropdown-type"), nameList, function(value){
                // this.args.chargingType = parseInt(value);
            }.bind(this));
            
            this.$el.find(".dropdown-type .cur-value").html(nameList[0].name)
        },

        render: function(target) {
            this.$el.appendTo(target);
            setTimeout(function(){
                this.initUploader();
            }.bind(this), 200)
        }
    });

    var RefreshManualView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/refreshManual/refreshManual.html'])());

            this.$el.find('a[data-toggle="tab"]').on('shown.bs.tab', $.proxy(this.onShownTab, this));

            this.importFileView = new ImportFileView({
                collection: this.collection
            })
        },

        onShownTab: function (e) {
            var eventTarget = e.target; // newly activated tab
            var id = $(eventTarget).attr("data-target");
            relatedID = $(e.relatedTarget).attr("data-target");
            switch(id){
                case "#refresh-file-upload":
                    this.currentTab = "#refresh-file-upload";
                break;
                case "#fill-refresh-url":
                    this.currentTab = "#fill-refresh-url";
                    if (this.fillRefreshURLViewView) return;
                    this.fillRefreshURLViewView = new FillRefreshURLView({
                        collection: this.collection
                    })
                    this.fillRefreshURLViewView.render(this.$el.find("#fill-refresh-url"))
                break;
            }
        },

        remove: function(){
            if(this.importFileView) this.importFileView.remove();
            // if(this.liveStatisticsManageView) this.liveStatisticsManageView.remove();
            this.$el.remove();
            this.collection.off();
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        hide: function(){
            this.$el.hide();
        },

        update: function(){
            this.$el.show();
        },

        render: function(target) {
            this.$el.appendTo(target)
            this.importFileView.render(this.$el.find("#refresh-file-upload"))
        }
    });

    return RefreshManualView;
});