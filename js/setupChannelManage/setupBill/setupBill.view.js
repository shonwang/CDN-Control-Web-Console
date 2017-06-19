define("setupBill.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var SetupBillView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.options = options;
            this.$el = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.html'])());
            // var clientInfo = JSON.parse(options.query), 
            //     domainInfo = JSON.parse(options.query2),
            //     userInfo = {
            //         clientName: clientInfo.clientName,
            //         domain: domainInfo.domain,
            //         uid: clientInfo.uid
            //     }
            // this.optHeader = $(_.template(template['tpl/customerSetup/domainList/domainManage.header.html'])({
            //     data: userInfo,
            //     notShowBtn: true
            // }));
            // this.optHeader.appendTo(this.$el.find(".opt-ctn"))
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
                }
            } catch(e){
                alert("返回的JSON数据有问题！")
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
            if (this.config.domainConf.confCustomType === 3) this.baseInfo.confCustomTypeStr = '定制化配置';

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

            this.initOriginSetup();
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
            //"advanceOriginType": 高级回源设置的源站类型 1:IP源站 2:域名源站
            if (domainConf.originType === 1 && domainConf.backsourceFlag === 1) 
                this.originSetupInfo.originTypeStr = 'IP源站';
            if (domainConf.originType === 2 && domainConf.backsourceFlag === 1) 
                this.originSetupInfo.originTypeStr = '域名源站';
            //"originAddress": 回源地址(多个IP 或者 单个域名 或者 单个金山云域名), 多个ip以分号分隔
            if (domainConf.backsourceFlag === 0) 
                this.originSetupInfo.originAddress = domainConf.originAddress;
            this.originSetupInfo.backsourcePolicy = ""
            if (domainConf.backsourceFlag === 1) {
                // "advanceConfigList": 高级回源设置
                // "originLine": 源站线路，1:default默认源； 2:un联通源; 3:ct电信源; 4:cm移动源 
                // "originAddress": 主，ip最多10个，以逗号分隔，域名一个
                // "addressBackup": 备，ip最多10个，以逗号分隔，域名一个
                var advanceConfigList = this.config.advanceConfigList, advanceConfigListStr = [];
                _.each(advanceConfigList, function(el, index, list) {
                    var addressStr = el.originAddress + "<br>备: " + el.addressBackup;
                    if (el.originLine === 1)
                        advanceConfigListStr.push("默认源：<br>主: " + addressStr)
                    else if (el.originLine === 2)
                        advanceConfigListStr.push("联通源：<br>主: " + addressStr)
                    else if (el.originLine === 3)
                        advanceConfigListStr.push("电信源：<br>主: " + addressStr)
                    else if (el.originLine === 4)
                        advanceConfigListStr.push("移动源：<br>主: " + addressStr)
                }.bind(this))
                this.originSetupInfo.originAddress =  advanceConfigListStr.join("<br>")
                //"backsourcePolicy": 1:轮训 2:quality按质量最优的topN来轮训回源 
                if (domainConf.backsourcePolicy === 1) this.originSetupInfo.backsourcePolicy = "轮询";
                if (domainConf.backsourcePolicy === 2) 
                    this.originSetupInfo.backsourcePolicy = "质量最优: 最优IP数量: " + domainConf.backsourceBestcount;
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
                this.originHostSetupInfo.hostTypeStr = '自定义';
                this.originHostSetupInfo.customHostHeader = domainConf.customHostHeader;
            }
            if (domainConf.hostType === 1) {
                this.originHostSetupInfo.hostTypeStr = '加速域名';
                this.originHostSetupInfo.customHostHeader = originDomain.domain;
            }
            if (domainConf.hostType === 2) {
                this.originHostSetupInfo.hostTypeStr = '回源域名';
                this.originHostSetupInfo.customHostHeader = domainConf.originAddress;
            }
            
            if(domainConf.hostFlag === 0){
                this.originHostSetupInfo.hostFlayStr = '<span class="label label-danger">关闭</span>';
            }
            if(domainConf.hostFlag === 1){
                this.originHostSetupInfo.hostFlayStr = '<span class="label label-success">开启</span>';
            }

            this.originHostSetupTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.originHostSetup.html'])({
                data: this.originHostSetupInfo
            }));
            this.originHostSetupTable.appendTo(this.$el.find(".bill-ctn"));

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
            this.followingTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.following.html'])({
                data: this.followingInfo
            }));
            this.followingTable.appendTo(this.$el.find(".bill-ctn"));

            this.initCacheRule();
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
                this.dragPlayTable.find("input").attr("disabled", "disabled");

                this.initCacheKey();
            }.bind(this));
        },

        initCacheKey: function() {
            this.cacheKeyTable = $(_.template(template['tpl/setupChannelManage/setupBill/setupBill.cacheKey.html'])({
                data: this.config.domainConf.cacheKey
            }));
            this.cacheKeyTable.appendTo(this.$el.find(".bill-ctn"));

            this.initClientLimitSpeed();
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

            this.initRefererAntiLeech();
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
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
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