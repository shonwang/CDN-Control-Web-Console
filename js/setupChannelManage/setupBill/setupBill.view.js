define("setupBill.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var SetupBillView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.html'])());
            this.$el.find(".bill-ctn").html('<tr><td  colspan="6" class="text-center"><div class="domain-spinner">正在加载...</div></td></tr>');
            this.$el.find(".cancel").on("click", $.proxy(this.onClickBackButton, this))

            require(["domainList.model"], function(DomainListModel){
                var myDomainListModel = new DomainListModel();
                    myDomainListModel.on("get.region.success", $.proxy(this.onGetRegionSuccess, this))
                    myDomainListModel.on("get.region.error", $.proxy(this.onGetError, this))
                    myDomainListModel.getRegionBilling();
            }.bind(this))
        },

        onGetRegionSuccess: function(data){
            this.allRegion = data;
            this.collection.on("get.version.success",$.proxy(this.onGetVersionInfo,this));
            this.collection.on("get.version.error",$.proxy(this.onGetError,this));
            if (this.options.version)
                this.collection.getVersion({originId: this.options.originId, versionNum: this.options.version})
            else if (this.options.isFromPublish)
                this.collection.checkList({originId: this.options.originId})
            else
                this.collection.getVersion({originId: this.options.originId})
        },

        onGetVersionInfo: function(data) {
            try{
                if (data.originVersion&&data.originVersion.config){
                    this.urlParameterVo = data.urlParameterVo;
                    this.config = JSON.parse(data.originVersion.config);
                    this.versionType = data.originVersion.versionType || 1;
                    this.liveOriginData=data.backSourceDto;
                }
            } catch(e){
                Utility.warning("返回的JSON数据有问题！")
            }
            this.initBaseInfo();
        },

        initBaseInfo: function() {
            console.log(this.config)
            this.baseInfo = {};
            //加速类型 1下载 2 直播
            if (this.config.originDomain.subType === 1) this.baseInfo.businessTypeStr = '下载加速';
            if (this.config.originDomain.subType  === 2) this.baseInfo.businessTypeStr = '直播加速';
            if (this.config.originDomain.subType  === 3) this.baseInfo.businessTypeStr = '直播推流加速';
            //加速区域
            var allRegion = this.allRegion || [
                    {"id":1.0,"region":"CN","name":"中国大陆","cdnFactory":"ksc"},
                    {"id":2.0,"region":"AS","name":"亚洲","cdnFactory":"ksc"},
                    {"id":3.0,"region":"NA","name":"北美洲","cdnFactory":"ksc"},
                    {"id":4.0,"region":"EU","name":"欧洲和中东","cdnFactory":"ksc"},
                    {"id":5.0,"region":"AU","name":"澳洲","cdnFactory":"ksc"},
                    {"id":6.0,"region":"AF","name":"非洲","cdnFactory":"ksc"},
                    {"id":7.0,"region":"SA","name":"南美洲","cdnFactory":"ksc"}
                ];
                
            var regionArray = [], regionName = [];
            if (this.config.originDomain.region.indexOf(";") !== -1) {
                regionArray = this.config.originDomain.region.split(";");
            } else if (this.config.originDomain.region.indexOf(",") !== -1){
                regionArray = this.config.originDomain.region.split(",");
            } else {
                regionArray = [this.config.originDomain.region]
            }

            _.each(regionArray, function(el, index, ls) {
                var regionObj = _.find(allRegion, function(obj) {
                    return obj.region === el
                }.bind(this))
                if (regionObj) regionName.push(regionObj.name)
            }.bind(this))
            this.baseInfo.regionStr = regionName.join(",");
            //protocol 使用的协议,0:http,1:http+flv,2:hls,3:RTMP,4:https
            if (this.config.domainConf.protocol === 0) this.baseInfo.protocolStr = 'http';
            if (this.config.domainConf.protocol  === 1) this.baseInfo.protocolStr = 'http+flv';
            if (this.config.domainConf.protocol === 2) this.baseInfo.protocolStr = 'hls';
            if (this.config.domainConf.protocol  === 3) this.baseInfo.protocolStr = 'rtmp';
            if (this.config.domainConf.protocol  === 4) this.baseInfo.protocolStr = 'https';

            this.baseInfo.originPort = this.config.domainConf.originPort;
            this.baseInfo.description = this.config.originDomain.description;

            if (this.config.domainConf.confCustomType === 1) this.baseInfo.confCustomTypeStr = '标准化开放式配置（默认）';
            if (this.config.domainConf.confCustomType  === 2) this.baseInfo.confCustomTypeStr = '标准化内部配置';
            if (this.config.domainConf.confCustomType === 3) this.baseInfo.confCustomTypeStr = '定制化配置(中控配置不准确，如需修改，请先联系运维)';

            this.baseInfoTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.base.html'])({
                data: this.baseInfo
            }));
            this.$el.find(".bill-ctn").html("")
            this.baseInfoTable.appendTo(this.$el.find(".bill-ctn"));

            this.initCname();
        },

        initCname: function() {
            this.cnameTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.cname.html'])({
                data: this.config.originDomain.cnameData
            }));
            this.cnameTable.appendTo(this.$el.find(".bill-ctn"));

            var type = this.config.originDomain.type,
                applicationType = this.config.originDomain.applicationType;

            if (applicationType == 202) {
                //下载
                this.initOriginSetup();
            } else if (applicationType == 203) {
                //直播
                this.initLiveOriginSetup();
            } else {
                Utility.warning("您的平台不是下载也不是直播，applicationType为" + applicationType);
            }
        },

        initOriginSetup: function() {
            this.originSetupInfo = {};
            var domainConf = this.config.domainConf, originDomain = this.config.originDomain;
            //"backsourceFlag": 配置高级回源策略的开启或关闭,0:关闭 1:开启
            if (domainConf.backsourceFlag === 0) this.originSetupInfo.backsourceFlagStr = '<span class="label label-danger">关闭</span>';
            if (domainConf.backsourceFlag  === 1) this.originSetupInfo.backsourceFlagStr = '<span class="label label-success">开启</span>';
            //"originType": 源站类型 1:IP源站 2:域名源站 3: type=1时,KS3  type=2时,ksvideo
            if (domainConf.originType === 1 && domainConf.backsourceFlag === 0) 
                this.originSetupInfo.originTypeStr = 'IP源站';
            if (domainConf.originType === 2 && domainConf.backsourceFlag === 0) 
                this.originSetupInfo.originTypeStr = '域名源站';
            if (originDomain.type === 1 && domainConf.originType === 3 && domainConf.backsourceFlag === 0) 
                this.originSetupInfo.originTypeStr = 'KS3';
            if (originDomain.type === 2 && domainConf.originType === 3 && domainConf.backsourceFlag === 0) 
                this.originSetupInfo.originTypeStr = 'KSVideo';
            //"originAddress": 回源地址(多个IP 或者 单个域名 或者 单个金山云域名), 多个ip以分号分隔
            if (domainConf.backsourceFlag === 0) {
                if (domainConf.originAddress)
                    this.originSetupInfo.originAddress = domainConf.originAddress.split(",").join("<br>");
            }

            if (domainConf.backsourceFlag === 1) {
                //"advanceOriginType": 高级回源设置的源站类型 1:IP源站 2:域名源站
                if (this.config.backsourceAdvance.hostOriginType === 1 && domainConf.backsourceFlag === 1) 
                    this.originSetupInfo.originTypeStr = 'IP源站';
                if (this.config.backsourceAdvance.hostOriginType === 2 && domainConf.backsourceFlag === 1) 
                    this.originSetupInfo.originTypeStr = '域名源站';

                var backupOriginTypeStr = "";
                if (this.config.backsourceAdvance.backupOriginType === 1) 
                    backupOriginTypeStr = 'IP源站';
                else if (this.config.backsourceAdvance.backupOriginType === 2) 
                    backupOriginTypeStr = '域名源站';
                else if (this.config.backsourceAdvance.backupOriginType === 3 &&
                    this.config.backsourceAdvance.backsourceCustom) 
                    backupOriginTypeStr = '自定义';
                else
                    backupOriginTypeStr = '未设置';
                this.originSetupInfo.backupOriginTypeStr = backupOriginTypeStr;
                // "advanceConfigList": 高级回源设置
                // "originLine": 源站线路，1:default默认源； 2:un联通源; 3:ct电信源; 4:cm移动源 
                // "originAddress": 主，ip最多10个，以逗号分隔，域名一个
                // "addressBackup": 备，ip最多10个，以逗号分隔，域名一个
                var advanceConfigList = this.config.backsourceAdvance.advanceConfigList, advanceConfigListStr = [];
                _.each(advanceConfigList, function(el, index, list) {
                    var addressStr = "";
                    if (this.config.backsourceAdvance.backupOriginType !== 3) {
                        if (el.addressBackup && el.originAddress) 
                            addressStr = "主: <br>" + el.originAddress.split(",").join("<br>") + "<br>备: <br>" + el.addressBackup.split(",").join("<br>");
                        else if (el.originAddress)
                            addressStr = "主: <br>" + el.originAddress.split(",").join("<br>")
                        else if (el.addressBackup)
                            addressStr = "备: <br>" + el.addressBackup.split(",").join("<br>")
                    } else if (el.originAddress){
                        addressStr = "主: <br>" + el.originAddress.split(",").join("<br>")   
                    }

                    if (el.originLine === 1)
                        advanceConfigListStr.push("默认源：" + addressStr)
                    else if (el.originLine === 2)
                        advanceConfigListStr.push("联通源：" + addressStr)
                    else if (el.originLine === 3)
                        advanceConfigListStr.push("电信源：" + addressStr)
                    else if (el.originLine === 4)
                        advanceConfigListStr.push("移动源：" + addressStr)
                }.bind(this))
                if (this.config.backsourceAdvance.backupOriginType === 3 && 
                    this.config.backsourceAdvance.backsourceCustom) {
                    this.originSetupInfo.originAddress =  advanceConfigListStr.join("<br>") + "<br>自定义: 备: <br>" + this.config.backsourceAdvance.backsourceCustom
                } else {
                    this.originSetupInfo.originAddress =  advanceConfigListStr.join("<br>")
                }
                //"backsourcePolicy": 1:轮训 2:quality按质量最优的topN来轮训回源 
                if (this.config.backsourceAdvance.backsourcePolicy === 1) this.originSetupInfo.backsourcePolicy = "轮询";
                if (this.config.backsourceAdvance.backsourcePolicy === 2) 
                    this.originSetupInfo.backsourcePolicy = "质量最优: 最优IP数量: " + this.config.backsourceAdvance.backsourceBestcount;

                var strategyAdvanceList = this.config.backsourceAdvance.strategyAdvanceList, strategyAdvanceListStr = [];
                _.each(strategyAdvanceList, function(el, index, list) {
                    var strategyStr = "";
                    if (el.openFlag === 1) 
                        strategyStr = '<span class="label label-success">开启</span><br>'
                    else
                        strategyStr = '<span class="label label-danger">关闭</span><br>'

                    if (el.backsourcePolicy === 1)
                        strategyStr += "轮询<br>"
                    else if (el.backsourcePolicy === 2)
                        strategyStr += "质量最优: 最优IP数量: " + el.backsourceBestcount + "<br>"

                    if (el.originLine === 2)
                        strategyAdvanceListStr.push("联通源：" + strategyStr)
                    else if (el.originLine === 3)
                        strategyAdvanceListStr.push("电信源：" + strategyStr)
                    else if (el.originLine === 4)
                        strategyAdvanceListStr.push("移动源：" + strategyStr)
                }.bind(this))

                this.originSetupInfo.strategyAdvanceListStr =  strategyAdvanceListStr.join("<br>")

                if (this.config.backsourceAdvance.strategyOpenFlag === 0) {
                    this.originSetupInfo.strategyAdvanceListStr = '<span class="label label-danger">关闭</span>';
                }
            }

            this.originSetupTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.originSetup.html'])({
                data: this.originSetupInfo
            }));
            this.originSetupTable.appendTo(this.$el.find(".bill-ctn"));

            this.initOriginHostSetup();
        },

        initOriginHostSetup: function(argument) {
            this.originHostSetupInfo = {};
            var domainConf = this.config.domainConf, originDomain = this.config.originDomain;
            //"hostType": 回源host头类型,1加速域名,2回源域名,3自定义host头
            if (domainConf.hostType === 3) {
                this.originHostSetupInfo.hostTypeStr = '自定义: ';
                this.originHostSetupInfo.customHostHeader = domainConf.customHostHeader;
            }
            if (domainConf.hostType === 1) {
                this.originHostSetupInfo.hostTypeStr = '加速域名: ';
                this.originHostSetupInfo.customHostHeader = originDomain.domain;
            }
            if (domainConf.hostType === 2) {
                this.originHostSetupInfo.hostTypeStr = '回源域名: ';
                this.originHostSetupInfo.customHostHeader = domainConf.originAddress;
            }
            
            if(domainConf.hostFlag === 0){
                this.originHostSetupInfo.hostFlayStr = '<span class="label label-danger">关闭</span>';
            }
            if(domainConf.hostFlag === 1){
                this.originHostSetupInfo.hostFlayStr = '<span class="label label-success">开启</span>';
            }

            if (this.config.backsourceAdvance&&this.config.backsourceAdvance.edgeOpenFlag === 1) 
                this.originHostSetupInfo.edgeOpenFlagStr = '<span class="label label-success">开启</span>'
            else
                this.originHostSetupInfo.edgeOpenFlagStr = '<span class="label label-danger">关闭</span>'

            if (this.config.backsourceAdvance&&this.config.backsourceAdvance.rangeConfig === 1) 
                this.originHostSetupInfo.rangeConfigStr = '<span class="label label-success">开启</span>'
            else
                this.originHostSetupInfo.rangeConfigStr = '<span class="label label-danger">关闭</span>'

            if (this.config.backsourceAdvance&&this.config.backsourceAdvance.checkLastmod === 1) 
                this.originHostSetupInfo.checkLastmodStr = '<span class="label label-success">开启</span>'
            else
                this.originHostSetupInfo.checkLastmodStr = '<span class="label label-danger">关闭</span>'

            switch(domainConf.originProtocol){
                case 0:
                    this.originHostSetupInfo.originProtocolStr = "HTTP";
                    break;
                case 1:
                    this.originHostSetupInfo.originProtocolStr = "HDL";
                    break;
                case 2:
                    this.originHostSetupInfo.originProtocolStr = "HLS";
                    break;
                case 3:
                    this.originHostSetupInfo.originProtocolStr = "RTMP";
                    break;
                case 4:
                    this.originHostSetupInfo.originProtocolStr = "HTTPS";
                    break;
                case 5:
                    this.originHostSetupInfo.originProtocolStr = "协议跟随";
                    break;
            }

            if (domainConf.checkSourceHttps == 1) 
                this.originHostSetupInfo.checkSourceHttpsStr = '<span class="label label-success">开启</span>'
            else
                this.originHostSetupInfo.checkSourceHttpsStr = '<span class="label label-danger">关闭</span>'

            this.originHostSetupInfo.edgeIpCount = domainConf.edgeIpCount; 

            this.originHostSetupTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.originHostSetup.html'])({
                data: this.originHostSetupInfo
            }));
            this.originHostSetupTable.appendTo(this.$el.find(".bill-ctn"));

            if (originDomain.applicationType === 203)
                this.originHostSetupTable.find(".edge").hide();

            this.initOriginDetection()
        },

        initOriginDetection: function(argument) {
            this.originDetectionInfo = this.config.detectOriginConfig || {};

            var flag = this.config.detectOriginConfig.flag;
            if (flag === 0) this.originDetectionInfo.flagStr = '<span class="label label-danger">关闭</span>'
            if (flag === 1) this.originDetectionInfo.flagStr = '<span class="label label-success">开启</span>'

            this.originHostSetupTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.backOriginDetection.html'])({
                data: this.originDetectionInfo
            }));
            this.originHostSetupTable.appendTo(this.$el.find(".bill-ctn"));

            this.initFollowing()
        },

        initFollowing: function() {
            this.followingInfo = {};
            var domainConf = this.config.domainConf, originDomain = this.config.originDomain;
            //"following": following302 0:关  1：开
            if (domainConf.following === 0) this.followingInfo.followingStr = '<span class="label label-danger">关闭</span>';
            if (domainConf.following  === 1) this.followingInfo.followingStr = '<span class="label label-success">开启</span>';
            if (!domainConf.locationDomain) 
                this.followingInfo.locationDomainStr = ""
            else if (domainConf.following  === 1)
                this.followingInfo.locationDomainStr = domainConf.locationDomain.split(",").join("<br>")

            this.followingTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.following.html'])({
                data: this.followingInfo
            }));
            this.followingTable.appendTo(this.$el.find(".bill-ctn"));

            if (this.versionType === 2)
                this.initLuaCacheRule();
            else
                this.initCacheRule();
        },

        initLuaCacheRule: function(data, isAdvanced) {
            if (this.config.globalConfig && this.config.globalConfig.cachePolicy && !isAdvanced) {
                data = this.config.globalConfig.cachePolicy
            }

            var hasOriginPolicy = data.hasOriginPolicy,
                expireTime = data.expireTime, summary = '';

            if (expireTime === 0 && hasOriginPolicy === 0) summary = "缓存时间：不缓存";
            if (expireTime !== 0 && hasOriginPolicy === 0) summary = "缓存时间：" + Utility.timeFormat2(expireTime);
            if (expireTime !== 0 && hasOriginPolicy === 1) summary = "使用源站缓存, 若源站无缓存时间，则缓存：" + Utility.timeFormat2(expireTime);

            this.cacheRuleTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.luaCache.html'])({
                data: {
                    name: "缓存规则",
                    summary: summary
                }
            }));

            if (isAdvanced) {
                return this.cacheRuleTable
            } else {
                this.cacheRuleTable.appendTo(this.$el.find(".bill-ctn"));
                this.initLuaDelMarkCache();
            }
        },

        initCacheRule: function() {
            require(['cacheRule.model'], function(CacheRuleModel){
                var myCacheRuleModel = new CacheRuleModel();
                _.each(this.config.cachePolicyList, function(element, index, list){
                    myCacheRuleModel.push(new myCacheRuleModel.model(element));
                }.bind(this))
                var allFileArray = myCacheRuleModel.filter(function(obj){
                    return obj.get('type') === 9;
                }.bind(this));

                var specifiedUrlArray = myCacheRuleModel.filter(function(obj){
                    return obj.get('type') === 2;
                }.bind(this));

                var otherArray = myCacheRuleModel.filter(function(obj){
                    return obj.get('type') !== 2 && obj.get('type') !== 9;
                }.bind(this));

                myCacheRuleModel.models = specifiedUrlArray.concat(otherArray, allFileArray)

                if (myCacheRuleModel.models.length > 0) {
                    this.cacheRuleTable = $(_.template(template['tpl/customerSetup/domainList/cacheRule/cacheRule.table.html'])({
                        data: myCacheRuleModel.models,
                        hideAction: true
                    }));
                    this.cacheRuleTable.appendTo(this.$el.find(".bill-ctn"));
                } 
                this.initDelMarkCache();
            }.bind(this))
        },

        initLuaDelMarkCache: function(data, isAdvanced) {
            if (this.config.globalConfig && this.config.globalConfig.cacheQuestionMark && !isAdvanced) {
                data = this.config.globalConfig.cacheQuestionMark
            }
            if (data) {
                var markType = data.markType, markTypeName;
                if (markType === 2) markTypeName = "指定缓存的参数：" + data.markValue;
                if (markType === 1) markTypeName = "去问号缓存";
                if (markType === 0) markTypeName = "不去问号缓存";

                this.delMarkCacheTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.luaCache.html'])({
                    data: {
                        name: "去问号缓存",
                        summary: markTypeName
                    }
                }));
            }
            if (isAdvanced) {
                return this.delMarkCacheTable
            } else {
                this.delMarkCacheTable&&this.delMarkCacheTable.appendTo(this.$el.find(".bill-ctn"));
                this.initCacheKey();
            }
        },

        initDelMarkCache: function() {
            require(['delMarkCache.model'], function(DelMarkCacheModel){
                var myDelMarkCacheModel = new DelMarkCacheModel();
                _.each(this.config.cacheQuestionMarkList, function(element, index, list){
                    myDelMarkCacheModel.push(new myDelMarkCacheModel.model(element));
                }.bind(this))

                var allFileArray = myDelMarkCacheModel.filter(function(obj){
                    return obj.get('matchingType') === 9;
                }.bind(this));

                var specifiedUrlArray = myDelMarkCacheModel.filter(function(obj){
                    return obj.get('matchingType') === 2;
                }.bind(this));

                var otherArray = myDelMarkCacheModel.filter(function(obj){
                    return obj.get('matchingType') !== 2 && obj.get('matchingType') !== 9;
                }.bind(this));

                myDelMarkCacheModel.models = specifiedUrlArray.concat(otherArray, allFileArray)

                if (myDelMarkCacheModel.models.length > 0) {
                    this.delMarkCacheTable = $(_.template(template['tpl/customerSetup/domainList/delMarkCache/delMarkCache.table.html'])({
                        data: myDelMarkCacheModel.models,
                        hideAction: true
                    }));
                    this.delMarkCacheTable.appendTo(this.$el.find(".bill-ctn"));
                }

                this.initCacheKey();
            }.bind(this));
        },

        initCacheKey: function() {
            this.cacheKeyTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.cacheKey.html'])({
                data: this.config.domainConf.cacheKey && this.config.domainConf.cacheKeyFlag ? this.config.domainConf.cacheKey : null
            }));
            this.cacheKeyTable.appendTo(this.$el.find(".bill-ctn"));
            if (this.versionType === 2)
                this.initStatusCodeCache();
            else
                this.initDragPlay();
        },

        initStatusCodeCache: function() {
            var data = this.config.stateCodeList;

            require(['luaStatusCodeCache.model'], function(LuaStatusCodeCacheModel){
                var myLuaStatusCodeCache = new LuaStatusCodeCacheModel();

                _.each(data, function(element, index, list){
                    myLuaStatusCodeCache.push(new myLuaStatusCodeCache.model(element));
                }.bind(this))

                this.luaStatusCodeCacheTable = $(_.template(template['tpl/customerSetup/domainList/luaDownloadSetup/luaStatusCodeCache/luaStatusCodeCache.table.html'])({
                    data: myLuaStatusCodeCache.models
                }));

                this.luaStatusCodeCacheTable.find(".operation").remove();
                this.luaStatusCodeCacheTable.appendTo(this.$el.find(".bill-ctn"));

                this.initDragPlay();
            }.bind(this));
        },

        initDragPlay: function() {
            require(['dragPlay.model'], function(DragPlayModel){
                var myDragPlay = new DragPlayModel();

                _.each(this.config.dragConfList, function(element, index, list){
                    myDragPlay.push(new myDragPlay.model(element));
                }.bind(this))

                this.dragPlayTable = $(_.template(template['tpl/customerSetup/domainList/dragPlay/dragPlay.table.html'])({
                    data: myDragPlay.models
                }));

                this.dragPlayTable.appendTo(this.$el.find(".bill-ctn"));
                inputEl = this.dragPlayTable.find("input");
                _.each(inputEl, function(el){
                    if (el.checked)
                        $(el).parents(".togglebutton").html('<span class="label label-success">开启</span>')
                    else
                        $(el).parents(".togglebutton").html('<span class="label label-danger">关闭</span>')
                }.bind(this))
                this.dragPlayTable.find("#dropdown-dragmode").prop("disabled", true);

                if (this.versionType === 2)
                    this.initLuaClientLimitSpeed();
                else
                    this.initClientLimitSpeed();
            }.bind(this));
        },

        initLuaClientLimitSpeed: function(data, isAdvanced) {
            if (this.config.globalConfig && this.config.globalConfig.clientSpeedLimit && !isAdvanced) {
                data = this.config.globalConfig.clientSpeedLimit
            }

            var preUnlimit = data.preUnlimit, preUnlimitSummary = ''
                speedLimit = data.speedLimit, speedLimitSummary = '',
                preFlag = data.preFlag,
                speedFlag = data.speedFlag;

            if (preFlag === 0) {
                preUnlimitSummary = '指定不限速字节数：<span class="label label-danger">关闭</span>';
            } else {
                if (preUnlimit === 0) preUnlimitSummary = '指定不限速字节数：<span class="label label-danger">关闭</span>';
                if (preUnlimit !== 0) preUnlimitSummary = '指定不限速字节数：' + preUnlimit + 'KB。';
            }

            if (speedFlag === 0) {
                speedLimitSummary = '限速字节数：<span class="label label-danger">关闭</span>';
            } else {
                if (speedLimit === 0) speedLimitSummary = '限速字节数：<span class="label label-danger">关闭</span>';
                if (speedLimit !== 0) speedLimitSummary = '限速字节数：' + speedLimit + 'KB/s';
            }

            var timeLimit = data.timeLimit, timeLimitSummary = "限速时间段：<br>";
            _.each(timeLimit, function(el, index, ls){
                var startTime = el.startTime,
                    endTime = el.endTime,
                    speedLimit2 = el.speedLimit + "KB/s<br>"
                var timeStr = startTime + "至" + endTime + "，限速字节数：" + speedLimit2;
                timeLimitSummary = timeLimitSummary + timeStr
            })

            if (timeLimit && timeLimit.length === 0) timeLimitSummary = "限速时间段：无";

            this.clientLimitSpeedTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.luaSpeedLimit.html'])({
                data: {
                    "preUnlimitSummary": preUnlimitSummary,
                    "speedLimitSummary": speedLimitSummary,
                    "timeLimitSummary": timeLimitSummary
                }
            }));

            if (isAdvanced) {
                return this.clientLimitSpeedTable
            } else {
                this.clientLimitSpeedTable.appendTo(this.$el.find(".bill-ctn"));
                this.initLuaHttpHeaderOpt();
            }
        },

        initClientLimitSpeed: function() {
            require(['clientLimitSpeed.model'], function(ClientLimitSpeedModel){
                var myClientLimitSpeedModel = new ClientLimitSpeedModel();
                _.each(this.config.clientSpeedLimit, function(element, index, list){
                    myClientLimitSpeedModel.push(new myClientLimitSpeedModel.model(element));
                }.bind(this))

                var allFileArray = myClientLimitSpeedModel.filter(function(obj){
                    return obj.get('matchingType') === 9;
                }.bind(this));

                var specifiedUrlArray = myClientLimitSpeedModel.filter(function(obj){
                    return obj.get('matchingType') === 2;
                }.bind(this));

                var otherArray = myClientLimitSpeedModel.filter(function(obj){
                    return obj.get('matchingType') !== 2 && obj.get('matchingType') !== 9;
                }.bind(this));

                myClientLimitSpeedModel.models = specifiedUrlArray.concat(otherArray, allFileArray)

                if (myClientLimitSpeedModel.models.length > 0) {
                    this.clientLimitSpeedTable = $(_.template(template['tpl/customerSetup/domainList/clientLimitSpeed/clientLimitSpeed.table.html'])({
                        data: myClientLimitSpeedModel.models,
                        hideAction: true
                    }));

                    this.clientLimitSpeedTable.appendTo(this.$el.find(".bill-ctn"));
                }

                this.initHttpHeaderOpt();
            }.bind(this));
        },

        initLuaHttpHeaderOpt: function(data, isAdvanced, target){
            if (this.config.globalConfig && this.config.globalConfig.httpHeaderParamList && !isAdvanced) {
                data = this.config.globalConfig.httpHeaderParamList
            }

            require(['luaHttpHeaderOpt.model'], function(HttpHeaderOptModel){
                var myHttpHeaderOptModel = new HttpHeaderOptModel();
                _.each(data, function(element, index, list){
                    myHttpHeaderOptModel.push(new myHttpHeaderOptModel.model(element));
                }.bind(this))

                if (myHttpHeaderOptModel.models.length > 0) {
                    this.httpHeaderOptTable = $(_.template(template['tpl/customerSetup/domainList/luaDownloadSetup/luaHttpHeaderOpt/httpHeaderOpt.table.html'])({
                        data: myHttpHeaderOptModel.models,
                    }));

                    this.httpHeaderOptTable.find(".operation").remove();
                }

                if (isAdvanced) {
                    this.httpHeaderOptTable.appendTo(target)
                } else {
                    this.httpHeaderOptTable&&this.httpHeaderOptTable.appendTo(this.$el.find(".bill-ctn"));
                    this.initHttpHeaderCtr();
                }
            }.bind(this));
        },

        initHttpHeaderOpt: function(){
            require(['httpHeaderOpt.model'], function(HttpHeaderOptModel){
                var myHttpHeaderOptModel = new HttpHeaderOptModel();
                _.each(this.config.httpHeaderParamList, function(element, index, list){
                    myHttpHeaderOptModel.push(new myHttpHeaderOptModel.model(element));
                }.bind(this))

                var allFileArray = myHttpHeaderOptModel.filter(function(obj){
                    return obj.get('matchingType') === 9;
                }.bind(this));

                var specifiedUrlArray = myHttpHeaderOptModel.filter(function(obj){
                    return obj.get('matchingType') === 2;
                }.bind(this));

                var otherArray = myHttpHeaderOptModel.filter(function(obj){
                    return obj.get('matchingType') !== 2 && obj.get('matchingType') !== 9;
                }.bind(this));


                myHttpHeaderOptModel.models = specifiedUrlArray.concat(otherArray, allFileArray)

                if (myHttpHeaderOptModel.models.length > 0) {
                    this.httpHeaderOptTable = $(_.template(template['tpl/customerSetup/domainList/httpHeaderOpt/httpHeaderOpt.table.html'])({
                        data: myHttpHeaderOptModel.models,
                        hideAction: true
                    }));

                    this.httpHeaderOptTable.appendTo(this.$el.find(".bill-ctn"));
                }

                this.initHttpHeaderCtr();
            }.bind(this));
        },

        initHttpHeaderCtr: function(){
            this.headerCtrInfo = {};
            var domainConf = this.config.domainConf, originDomain = this.config.originDomain;
            // "obtainIp": 0:不获取客户端ip 1：获取客户端ip
            // "obtainIpCustom": 获取客户端ip方式 
            // "addCors": 0:不增加http head：Access-Control-Allow-Origin: *   1:增加
            // "removeCookie": 0:不去除cookie头   1:去除 
            // "removeKs3": 0:不去除ks3头 1:去除
            if (domainConf.obtainIp === 0) this.headerCtrInfo.obtainIpStr = '获取客户端IP: <span class="label label-danger">关闭</span>';
            if (domainConf.obtainIp === 1) 
                this.headerCtrInfo.obtainIpStr = '获取客户端IP: <span class="label label-success">开启</span>; 获取客户端ip方式: ' + domainConf.obtainIpCustom
            if (domainConf.addCors === 0) 
                this.headerCtrInfo.addCorsStr = '增加http head：Access-Control-Allow-Origin: * : <span class="label label-danger">关闭</span>';
            if (domainConf.addCors === 1) 
                this.headerCtrInfo.addCorsStr = '增加http head：Access-Control-Allow-Origin: * : <span class="label label-success">开启</span>';
            if (domainConf.removeCookie === 0) 
                this.headerCtrInfo.removeCookieStr = '去除cookie头: <span class="label label-danger">关闭</span>';
            if (domainConf.removeCookie === 1) 
                this.headerCtrInfo.removeCookieStr = '去除cookie头: <span class="label label-success">开启</span>';

            this.httpHeaderCtr = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.httpHeaderCtr.html'])({
                data: this.headerCtrInfo
            }));
            this.httpHeaderCtr.appendTo(this.$el.find(".bill-ctn"));

            this.initRequestArgsModify();
        },

        initRequestArgsModify: function(){
            // "delKeys": 删除的参数,以分号分割
            // "delType": 删除开关  0:关闭 1:开启
            // "addType": 添加开关 0:关闭 1:开启
            // "addDetails": [{
            //     "key": "11",  //添加的key
            //     "value": "11" //添加的value
            // }]
            if (this.urlParameterVo) {
                var delTypeName, addTypeName, addDetailsStr = [];
                if (this.urlParameterVo.delType === 0) delTypeName = '<span class="label label-danger">关闭</span>';
                if (this.urlParameterVo.addType === 0) addTypeName = '<span class="label label-danger">关闭</span>';
                if (this.urlParameterVo.delType === 1) delTypeName = '<span class="label label-success">开启</span>';
                if (this.urlParameterVo.addType === 1) addTypeName = '<span class="label label-success">开启</span>';

                _.each(this.urlParameterVo.addDetails, function(el, index, ls) {
                    addDetailsStr.push("参数：" + el.key + ", 值：" + el.value)
                })

                var list = [{
                    type:"删除参数",
                    status: delTypeName,
                    value: this.urlParameterVo.delKeys
                }, {
                    type:"添加参数",
                    status: addTypeName,
                    value: addDetailsStr.join("<br>")
                }]

                this.requestArgsModifyTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.requestArgsModify.html'])({
                    data: list
                }));
                this.requestArgsModifyTable.appendTo(this.$el.find(".bill-ctn"));
            }
            if (this.versionType === 2)
                this.initLuaIpBlackWhiteList();
            else
                this.initRefererAntiLeech();
        },

        initLuaIpBlackWhiteList: function(data, isAdvanced){
            if (this.config.globalConfig && this.config.globalConfig.ipSafetyChain && !isAdvanced) {
                data = this.config.globalConfig.ipSafetyChain
            }
            var tempTpl = '', openFlagStr, type;
            if (!data.openFlag){
                    tempTpl = '<table class="table table-striped table-hover">' + 
                                    '<tbody>' +
                                        '<tr>' +
                                          '<td>IP防盗链</td>' +
                                          '<td><span class="label label-danger">关闭</span></td>' +
                                        '</tr>' +
                                    '</tbody>' +
                                '</table>'
                this.ipSafetyChainTable = $(tempTpl)
            } else {
                openFlagStr = '<span class="label label-success">开启</span>';
                type = data.type;
                if (type === 1) typeStr = "白名单";
                if (type === 2) typeStr = "黑名单";
                this.ipSafetyChainTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.luaIpBlackWhiteList.html'])({
                    data: {
                        "openFlagStr": openFlagStr,
                        "typeStr": typeStr,
                        "ips": data.ips
                    }
                }));
            }

            if (isAdvanced) {
                return this.ipSafetyChainTable
            } else {
                this.ipSafetyChainTable.appendTo(this.$el.find(".bill-ctn"));
                this.initLuaRefererAntiLeech();
            }
        },

        initLuaRefererAntiLeech: function(data, isAdvanced){
            if (this.config.globalConfig && this.config.globalConfig.referSafetyChain && !isAdvanced) {
                data = this.config.globalConfig.referSafetyChain
            }
            var tempTpl = '', openFlagStr, nullRefererStr, typeStr;
            if (!data.openFlag){
                tempTpl = '<table class="table table-striped table-hover">' + 
                                    '<tbody>' +
                                        '<tr>' +
                                          '<td>referer防盗链</td>' +
                                          '<td><span class="label label-danger">关闭</span></td>' +
                                        '</tr>' +
                                    '</tbody>' +
                                '</table>'
                this.refererAntiLeechTable = $(tempTpl)
            } else {
                openFlagStr = '<span class="label label-success">开启</span>';
                if (data.type === 1) typeStr = '白名单';
                if (data.type === 2) typeStr = '黑名单';
                this.strArray = ['<span class="label label-danger">关闭</span>', '<span class="label label-success">开启</span>'];
                nullRefererStr = this.strArray[data.nullReferer];

                this.refererAntiLeechTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.liveRefererAntiLeech.html'])({
                    data: {
                        "openFlagStr": openFlagStr,
                        "typeStr": typeStr,
                        "nullRefererStr": nullRefererStr,
                        "domains": data.domains
                    }
                }));
                this.refererAntiLeechTable.find(".re").remove();
                this.refererAntiLeechTable.find(".forge").remove();
                this.refererAntiLeechTable.find("caption").remove();
            }

            if (isAdvanced) {
                return this.refererAntiLeechTable
            } else {
                this.refererAntiLeechTable.appendTo(this.$el.find(".bill-ctn"));
                this.initLuaTimestamp();
            }
        },

        initRefererAntiLeech: function(){
            require(['refererAntiLeech.model'], function(RefererAntiLeechModel){
                var myRefererAntiLeechModel = new RefererAntiLeechModel();
                _.each(this.config.referSafetyChainList, function(element, index, list){
                    myRefererAntiLeechModel.push(new myRefererAntiLeechModel.model(element));
                }.bind(this))

                var allFileArray = myRefererAntiLeechModel.filter(function(obj){
                    return obj.get('matchingType') === 9;
                }.bind(this));

                var specifiedUrlArray = myRefererAntiLeechModel.filter(function(obj){
                    return obj.get('matchingType') === 2;
                }.bind(this));

                var otherArray = myRefererAntiLeechModel.filter(function(obj){
                    return obj.get('matchingType') !== 2 && obj.get('matchingType') !== 9;
                }.bind(this));

                myRefererAntiLeechModel.models = specifiedUrlArray.concat(otherArray, allFileArray)

                if (myRefererAntiLeechModel.models.length > 0) {
                    this.refererAntiLeechTable = $(_.template(template['tpl/customerSetup/domainList/refererAntiLeech/refererAntiLeech.table.html'])({
                        data: myRefererAntiLeechModel.models,
                        hideAction: true
                    }));
                    this.refererAntiLeechTable.appendTo(this.$el.find(".bill-ctn"));
                }

                this.initTimestamp();
            }.bind(this));
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
                {value: 8, name: "filenameno：文件名称，不带后缀"},
                {value: 9, name: "method: 用户请求方法"},
                {value: 10, name: "hdr&name：请求头中的header名称"}
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
        },

        initLuaTimestamp: function(data, isAdvanced){
            if (this.config.globalConfig && this.config.globalConfig.standardProtection && !isAdvanced) {
                data = this.config.globalConfig.standardProtection
            }

            var tempTpl = '', el = data;
            if (!el.openFlag){
                    tempTpl = '<table class="table table-striped table-hover">' + 
                                    '<tbody>' +
                                        '<tr>' +
                                          '<td>时间戳+共享秘钥防盗链</td>' +
                                          '<td><span class="label label-danger">关闭</span></td>' +
                                        '</tr>' +
                                    '</tbody>' +
                                '</table>'
                this.timestampTable = $(tempTpl)
            } else {
                el.openFlagStr = '<span class="label label-success">开启</span>';

                if (el.protectionType === 1)  el.protectionTypeStr = "typeA";
                if (el.protectionType === 2)  el.protectionTypeStr = "typeB";
                if (el.protectionType === 3)  el.protectionTypeStr = "typeC";

                if (el.confType === 1 && el.protectionType === 1) 
                    el.protectionTypeStr = "形式1：加密字符串在参数中: $key_time=" + el.timeParam + ", $key_hash=" + el.hashParam
                if (el.confType === 1 && el.protectionType === 2) 
                    el.protectionTypeStr = "形式2：加密字符串在路径中: md5hash与timestamp位置: {md5hash/timestamp}"
                if (el.confType === 1 && el.protectionType === 3) 
                    el.protectionTypeStr = "形式2：加密字符串在路径中: md5hash与timestamp位置: {timestamp/md5hash}"

                var expirationTime = el.expirationTime, expirationTimeStr;
                if (expirationTime === 0) expirationTimeStr = "时间戳时间";
                if (expirationTime !== 0) expirationTimeStr = "时间戳时间+过期时间：" + expirationTime + "秒";
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
                    var timeTypeArray = ['', 'UNIX时间（十六进制）', 'UNIX时间（十进制）'];
                    el.timeTypeStr = timeTypeArray[el.timeType]
                    this.timestampTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.liveTimestamp.advanced.html'])({
                        data: el
                    }));
                    this.updateAuthDivisorTable(el.authDivisorList, this.timestampTable.find(".authdivisor"));
                }
                this.updateBaseKeyTable(el.authKeyList, this.timestampTable.find(".authkey"));
            }

            if (isAdvanced) {
                return this.timestampTable
            } else {
                this.timestampTable.appendTo(this.$el.find(".bill-ctn"));
                this.initForceRedirect();
            }
        },

        initForceRedirect: function() {
            this.httpsForceJumpInfo = {};
            var domainConf = this.config.domainConf, originDomain = this.config.originDomain;
            if (!domainConf.httpsForceJump) 
                this.httpsForceJumpInfo.httpsForceJumpStr = '<span class="label label-danger">关闭</span>';
            if (domainConf.httpsForceJump  === 1) 
                this.httpsForceJumpInfo.httpsForceJumpStr = '<span class="label label-success">开启</span>';

            this.httpsForceJumpTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.following.html'])({
                data: this.httpsForceJumpInfo
            }));
            this.httpsForceJumpTable.find("td:eq(0)").html("HTTPS配置-强制跳转");
            this.httpsForceJumpTable.find("td:eq(1)").html(this.httpsForceJumpInfo.httpsForceJumpStr);
            this.httpsForceJumpTable.appendTo(this.$el.find(".bill-ctn"));
            this.initAdvancedConfig();
        },

        initTimestamp: function(){
            require(['timestamp.model'], function(TimestampModel){
                var myTimestampModel = new TimestampModel();
                _.each(this.config.standardProtectionList, function(element, index, list){
                    myTimestampModel.push(new myTimestampModel.model(element));
                }.bind(this))

                var allFileArray = myTimestampModel.filter(function(obj){
                    return obj.get('matchingType') === 9;
                }.bind(this));

                var specifiedUrlArray = myTimestampModel.filter(function(obj){
                    return obj.get('matchingType') === 2;
                }.bind(this));

                var otherArray = myTimestampModel.filter(function(obj){
                    return obj.get('matchingType') !== 2 && obj.get('matchingType') !== 9;
                }.bind(this));

                myTimestampModel.models = specifiedUrlArray.concat(otherArray, allFileArray)

                if (myTimestampModel.models.length > 0) {
                    this.timestampTable = $(_.template(template['tpl/customerSetup/domainList/timestamp/timestamp.table.html'])({
                        data: myTimestampModel.models,
                        hideAction: true
                    }));
                    this.timestampTable.appendTo(this.$el.find(".bill-ctn"));
                }

                this.initOpenNgxLog()
            }.bind(this));
        },

        initAdvancedConfig: function(){
            if (!this.config.configLocationList || this.config.configLocationList.length === 0) {
                return;
            } else {
                configLocationList = this.config.configLocationList;
            }

            var title = '<h4>高级配置</h4>', tempTpl, target;
            $(title).appendTo(this.$el.find(".bill-ctn"));

            _.each(configLocationList, function(el){
                tempTpl =   '<div class="panel panel-default">' + 
                                '<div class="panel-heading">' + el.matchingValue + '</div>' + 
                                '<div class="panel-body"></div>'
                            '</div>'
                tempTpl = $(tempTpl)
                target = tempTpl.find(".panel-body")
                if (!el.advanceMatchingConfig) {
                    target.html("遵循全局");
                } else {
                    if (el.advanceMatchingConfig.cachePolicy) 
                        this.initLuaCacheRule(el.advanceMatchingConfig.cachePolicy, true).appendTo(target)
                    if (el.advanceMatchingConfig.cacheQuestionMark) 
                        this.initLuaDelMarkCache(el.advanceMatchingConfig.cacheQuestionMark, true).appendTo(target)
                    if (el.advanceMatchingConfig.httpHeaderParamList) 
                        this.initLuaHttpHeaderOpt(el.advanceMatchingConfig.httpHeaderParamList, true, target)
                    if (el.advanceMatchingConfig.clientSpeedLimit) 
                        this.initLuaClientLimitSpeed(el.advanceMatchingConfig.clientSpeedLimit, true).appendTo(target)
                    if (el.advanceMatchingConfig.ipSafetyChain) 
                        this.initLuaIpBlackWhiteList(el.advanceMatchingConfig.ipSafetyChain, true).appendTo(target)
                    if (el.advanceMatchingConfig.referSafetyChain) 
                        this.initLuaRefererAntiLeech(el.advanceMatchingConfig.referSafetyChain, true).appendTo(target)
                    if (el.advanceMatchingConfig.standardProtection) 
                        this.initLuaTimestamp(el.advanceMatchingConfig.standardProtection, true).appendTo(target)
                    if (target.html() === "") target.html("遵循全局");
                }
                tempTpl.appendTo(this.$el.find(".bill-ctn"))
            }.bind(this))
        },

        initOpenNgxLog: function() {
            this.chargingOpenInfo = {};
            var domainConf = this.config.domainConf, originDomain = this.config.originDomain;
            //"chargingOpen" 是否开启计费 1 开启 0关闭
            if (domainConf.chargingOpen === 0) this.chargingOpenInfo.chargingOpenStr = '<span class="label label-danger">关闭</span>';
            if (domainConf.chargingOpen  === 1) this.chargingOpenInfo.chargingOpenStr = '<span class="label label-success">开启</span>';
            this.chargingOpenTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.chargingOpen.html'])({
                data: this.chargingOpenInfo
            }));
            this.chargingOpenTable.appendTo(this.$el.find(".bill-ctn"));
        },

        onClickBackButton: function(){
            this.options.onCancelCallback && this.options.onCancelCallback();
        },

        onGetError: function(error){
            if (error&&error.message)
                Utility.alerts(error.message)
            else
                Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
        },

        hide: function(){
            this.$el.hide();
        },

        update: function(query){
            this.options.query = query;
            this.collection.off();
            this.collection.reset();
            this.$el.remove();
            this.initialize(this.options);
            this.render(this.target);
        },

        render: function(target){
            this.$el.appendTo(target);
            this.target = target;
        }
    });

    return SetupBillView;
});