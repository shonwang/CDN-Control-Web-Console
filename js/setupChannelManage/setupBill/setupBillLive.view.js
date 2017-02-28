define("setupBillLive.view", ['require','exports', 'template', 'modal.view', 'utility', 'setupBill.view'], 
    function(require, exports, template, Modal, Utility, SetupBillView) {

    var SetupLiveBillView = SetupBillView.extend({
        events: {},

        initOriginDetection: function(argument) {
            this.originDetectionInfo = this.config.detectOriginConfig || {};

            var flag = this.config.detectOriginConfig.flag;
            if (flag === 0) this.originDetectionInfo.flagStr = '<span class="label label-danger">关闭</span>'
            if (flag === 1) this.originDetectionInfo.flagStr = '<span class="label label-success">开启</span>'

            this.originHostSetupTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.backOriginDetection.html'])({
                data: this.originDetectionInfo
            }));
            this.originHostSetupTable.appendTo(this.$el.find(".bill-ctn"));

            this.initRefererAntiLeech()
        },

        initRefererAntiLeech: function(){

        },

        initTimestamp: function(){
            this.initTimestampInfo = this.config.standardProtectionList || [];

            _.each(this.initTimestampInfo, function(el, index, ls){
                if (!el.openFlag){
                    this.timestampTable = $(`<table class="table table-striped table-hover">
                                                        <tbody>
                                                            <tr>
                                                              <td>时间戳+共享秘钥防盗链</td>
                                                              <td><span class="label label-danger">关闭</span></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>`)
                } else {
                    el.openFlagStr = '<span class="label label-success">开启</span>';

                    if (el.protectionType === 1)  el.protectionTypeStr = "typeA";
                    if (el.protectionType === 2)  el.protectionTypeStr = "typeB";
                    if (el.protectionType === 3)  el.protectionTypeStr = "typeC";

                    var expirationTime = el.expirationTime, expirationTimeStr;
                    if (expirationTime === 0) expirationTimeStr = "时间戳时间<br>";
                    if (expirationTime !== 0) expirationTimeStr = "时间戳时间+过期时间：" + expirationTime + "秒<br>";
                    el.expirationTimeStr = expirationTimeStr

                    if (!el.confType){
                        el.confTypeStr = "标准配置";
                        this.timestampTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.liveTimestamp.html'])({
                            data: el
                        }));
                    } else {
                        el.confTypeStr = "高级配置";
                        if (el.md5Truncate == "") 
                            el.md5TruncateStr = "全部（默认）";
                        else 
                            el.md5TruncateStr = '自定义: ' + el.md5Truncate; 
                        this.timestampTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.liveTimestamp.advanced.html'])({
                            data: el
                        }));
                        this.updateAuthDivisorTable(el.authDivisorList, this.timestampTable.find(".authdivisor"));
                    }
                    this.updateBaseKeyTable(el.authKeyList, this.timestampTable.find(".authkey"));
                }
                this.timestampTable.appendTo(this.$el.find(".bill-ctn"));
            }.bind(this))
        },

        updateBaseKeyTable: function(data, root){
            var temp = []
            _.each(data, function(el, index, ls){
                    temp.push({
                        id: el.id,
                        backupKey: el.authKey
                    })
            }.bind(this))
            this.baseBackupKeyTable = $(_.template(template['tpl/customerSetup/domainList/timestamp/timestamp.backupKeyTable.html'])({
                data: temp
            }))

            this.baseBackupKeyTable.find(".delete").remove();
            root.html(this.baseBackupKeyTable.get(0));
        },

        updateAuthDivisorTable: function(data, root){
            var  authDivisorArray = [
                {value: 1, name: "host:用户请求域名"},
                {value: 2, name: "uri：用户请求的uri"},
                {value: 3, name: "url：不带参数"},
                {value: 4, name: "arg&name:请求url中的参数名称"},
                {value: 5, name: "time：请求url中是时间戳"},
                {value: 6, name: "key：秘钥"},
                {value: 7, name: "filename：文件名称，带后缀"},
                {value: 8, name: "filenameno：文件名称，不带后缀"}
            ];
            _.each(data, function(el, index, ls){
                var nameObj = _.find(authDivisorArray, function(obj){
                    return obj.value === el.divisor
                }.bind(this))
                if (nameObj) el.divisorName = nameObj.name
            }.bind(this))

            this.authDivisorTable = $(_.template(template['tpl/customerSetup/domainList/timestamp/timestamp.atuthDivisor.table.html'])({
                data: data
            }))

            this.authDivisorTable.find(".delete").remove();
            root.html(this.authDivisorTable.get(0));
        }
    });

    return SetupLiveBillView;
});