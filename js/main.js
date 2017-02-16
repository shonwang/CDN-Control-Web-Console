window.DEBUG = 1.1;

if (window.DEBUG === 1)
    window.BASE_URL = "http://develop.gateway.center.cdn.ksyun.com";
else if (window.DEBUG === 1.1)
    window.BASE_URL = "http://local.center.ksyun.com";
else if (window.DEBUG === 1.2)
    window.BASE_URL = "http://10.4.2.38:9098";
else if (window.DEBUG === 2)
    window.BASE_URL = "http://test.center.cdn.ksyun.com";
else if (window.DEBUG === 3)
    window.BASE_URL = "http://center.cdn.ksyun.com";
else if(window.DEBUG === 4)
    window.BASE_URL = "http://devtest.center.cdn.ksyun.com";//test-cdn.center.cdn.ksyun.com";
else if(window.DEBUG === 5)
    window.BASE_URL = "http://gray.center.cdn.ksyun.com";
else if(window.DEBUG === 6)
    window.BASE_URL = "http://develop.center.cdn.ksyun.com";
else if(window.DEBUG === 7)
    window.BASE_URL = "http://sh.center.cdn.ksyun.com";
else if(window.DEBUG === 8)
    window.BASE_URL = "http://develop.gateway.center.cdn.ksyun.com";
else if(window.DEBUG === 9)
    window.BASE_URL = "http://wq.center.cdn.ksyun.com";


requirejs.config({
    paths: {
        "routes": 'routes',
        "controller": 'controller',
        "utility": 'utility',
        "template": 'template',

        "modal.view": "views/modal.view",
        "navbar.view": "views/navbar.view",
        "subNavbar.view": "views/subNavbar.view",
        
        "channelManage.view": "channelManage/channelManage.view",
        "channelManage.model": "channelManage/channelManage.model",

        "deviceManage.view": 'deviceManage/deviceManage.view',
        "deviceManage.model": 'deviceManage/deviceManage.model',

        "nodeManage.view": 'nodeManage/nodeManage.view',
        "nodeManage.model": 'nodeManage/nodeManage.model',

        "dispGroup.view": "dispGroup/dispGroup.view",
        "dispGroup.model": "dispGroup/dispGroup.model",

        "dispConfig.view": "dispConfig/dispConfig.view",
        "dispConfig.model": "dispConfig/dispConfig.model",

        "dispSuggesttion.view": "dispSuggesttion/dispSuggesttion.view",
        "dispSuggesttion.model": "dispSuggesttion/dispSuggesttion.model",

        "importAssess.model": "importAssess/importAssess.model",
        "importAssess.view": "importAssess/importAssess.view",

        "coverRegion.view": 'coverRegion/coverRegion.view',
        "coverRegion.model": 'coverRegion/coverRegion.model',

        "coverManage.view": 'coverManage/coverManage.view',
        "coverManage.model": 'coverManage/coverManage.model',

        "liveAllSetup.view": 'liveAllSetup/liveAllSetup.view',
        "liveAllSetup.model": 'liveAllSetup/liveAllSetup.model',

        "liveCurentSetup.view": 'liveCurentSetup/liveCurentSetup.view',
        "liveCurentSetup.model": 'liveCurentSetup/liveCurentSetup.model',

        "ipManage.view": 'ipManage/ipManage.view',
        "ipManage.model": 'ipManage/ipManage.model',

        "refreshManual.view": 'refreshManual/refreshManual.view',
        "refreshManual.model": 'refreshManual/refreshManual.model',

        "customMaintenance.view": 'customMaintenance/customMaintenance.view',
        "customMaintenance.model": 'customMaintenance/customMaintenance.model',

        "businessManage.view": 'businessManage/businessManage.view',
        "businessManage.model": 'businessManage/businessManage.model',

        "clientStatistics.view": 'clientStatistics/clientStatistics.view',
        "clientStatistics.model": 'clientStatistics/clientStatistics.model',

        "statisticsManage.view": 'statisticsManage/statisticsManage.view',
        "statisticsManage.model": 'statisticsManage/statisticsManage.model',

        "domainStatistics.view": 'domainStatistics/domainStatistics.view',
        "domainStatistics.model": 'domainStatistics/domainStatistics.model',

        "domainManage.model": "domainManage/domainManage.model",
        "domainManage.view": "domainManage/domainManage.view",

        "grayscaleSetup.model": "grayscaleSetup/grayscaleSetup.model",
        "grayscaleSetup.view": "grayscaleSetup/grayscaleSetup.view",

        "templateManage.model": 'templateManage/templateManage.model',
        "templateManage.view": 'templateManage/templateManage.view',
        /*客户域名配置*/
        "customerSetup.model": 'customerSetup/customerSetup.model',
        "customerSetup.view": 'customerSetup/customerSetup.view',
        "customerSetup.controller": 'customerSetup/customerSetup.controller',

        "domainList.model": 'customerSetup/domainList/domainList.model',
        "domainList.view": 'customerSetup/domainList/domainList.view',
        "domainList.addDomain.view": 'customerSetup/domainList/domainList.addDomain.view',

        "blockUrl.view": 'customerSetup/blockUrl/blockUrl.view',
        "blockUrl.model": 'customerSetup/blockUrl/blockUrl.model',

        "matchCondition.view": 'customerSetup/domainList/matchCondition/matchCondition.view',
        "matchCondition.model": 'customerSetup/domainList/matchCondition/matchCondition.model',
        /*客户域名配置： 点播，伪直播*/
        "basicInformation.model": 'customerSetup/domainList/basicInformation/basicInformation.model',
        "basicInformation.view": 'customerSetup/domainList/basicInformation/basicInformation.view',

        "urlBlackList.model": 'customerSetup/domainList/urlBlackList/urlBlackList.model',
        "urlBlackList.view": 'customerSetup/domainList/urlBlackList/urlBlackList.view',

        "domainSetup.model": 'customerSetup/domainList/domainSetup/domainSetup.model',
        "domainSetup.view": 'customerSetup/domainList/domainSetup/domainSetup.view',

        "cnameSetup.model": 'customerSetup/domainList/cnameSetup/cnameSetup.model',
        "cnameSetup.view": 'customerSetup/domainList/cnameSetup/cnameSetup.view',

        "backOriginDetection.model": 'customerSetup/domainList/backOriginDetection/backOriginDetection.model',
        "backOriginDetection.view": 'customerSetup/domainList/backOriginDetection/backOriginDetection.view',

        "backOriginSetup.model": 'customerSetup/domainList/backOriginSetup/backOriginSetup.model',
        "backOriginSetup.view": 'customerSetup/domainList/backOriginSetup/backOriginSetup.view',

        "following302.model": 'customerSetup/domainList/following302/following302.model',
        "following302.view": 'customerSetup/domainList/following302/following302.view',

        "cacheRule.model": 'customerSetup/domainList/cacheRule/cacheRule.model',
        "cacheRule.view": 'customerSetup/domainList/cacheRule/cacheRule.view',

        "delMarkCache.model": 'customerSetup/domainList/delMarkCache/delMarkCache.model',
        "delMarkCache.view": 'customerSetup/domainList/delMarkCache/delMarkCache.view',

        "cacheKeySetup.model": 'customerSetup/domainList/cacheKeySetup/cacheKeySetup.model',
        "cacheKeySetup.view": 'customerSetup/domainList/cacheKeySetup/cacheKeySetup.view',

        "dragPlay.model": 'customerSetup/domainList/dragPlay/dragPlay.model',
        "dragPlay.view": 'customerSetup/domainList/dragPlay/dragPlay.view',

        "clientLimitSpeed.model": 'customerSetup/domainList/clientLimitSpeed/clientLimitSpeed.model',
        "clientLimitSpeed.view": 'customerSetup/domainList/clientLimitSpeed/clientLimitSpeed.view',

        "httpHeaderOpt.model": 'customerSetup/domainList/httpHeaderOpt/httpHeaderOpt.model',
        "httpHeaderOpt.view": 'customerSetup/domainList/httpHeaderOpt/httpHeaderOpt.view',

        "httpHeaderCtr.model": 'customerSetup/domainList/httpHeaderCtr/httpHeaderCtr.model',
        "httpHeaderCtr.view": 'customerSetup/domainList/httpHeaderCtr/httpHeaderCtr.view',

        "requestArgsModify.model": 'customerSetup/domainList/requestArgsModify/requestArgsModify.model',
        "requestArgsModify.view": 'customerSetup/domainList/requestArgsModify/requestArgsModify.view',

        "ipBlackWhiteList.model": 'customerSetup/domainList/ipBlackWhiteList/ipBlackWhiteList.model',
        "ipBlackWhiteList.view": 'customerSetup/domainList/ipBlackWhiteList/ipBlackWhiteList.view',

        "refererAntiLeech.model": 'customerSetup/domainList/refererAntiLeech/refererAntiLeech.model',
        "refererAntiLeech.view": 'customerSetup/domainList/refererAntiLeech/refererAntiLeech.view',    

        "timestamp.model": 'customerSetup/domainList/timestamp/timestamp.model',
        "timestamp.view": 'customerSetup/domainList/timestamp/timestamp.view',     

        "openNgxLog.model": 'customerSetup/domainList/openNgxLog/openNgxLog.model',
        "openNgxLog.view": 'customerSetup/domainList/openNgxLog/openNgxLog.view',

        "saveThenSend.model": 'customerSetup/domainList/saveThenSend/saveThenSend.model',
        "saveThenSend.view": 'customerSetup/domainList/saveThenSend/saveThenSend.view',
        /*客户域名配置： 真直播*/
        "customerSetup.live.controller": 'customerSetup/customerSetup.live.controller',

        "liveDomainSetup.model":"customerSetup/domainList/liveDomainSetup/liveDomainSetup.model",
        "liveDomainSetup.view":"customerSetup/domainList/liveDomainSetup/liveDomainSetup.view",
        
        "liveCnameSetup.model":"customerSetup/domainList/liveCnameSetup/liveCnameSetup.model",
        "liveCnameSetup.view":"customerSetup/domainList/liveCnameSetup/liveCnameSetup.view",

        "liveHttpsSetup.model":"customerSetup/domainList/liveHttpsSetup/liveHttpsSetup.model",
        "liveHttpsSetup.view":"customerSetup/domainList/liveHttpsSetup/liveHttpsSetup.view",

        "liveBackOriginSetup.model":"customerSetup/domainList/liveBackOriginSetup/liveBackOriginSetup.model",
        "liveBackOriginSetup.view":"customerSetup/domainList/liveBackOriginSetup/liveBackOriginSetup.view",

        "liveBackOriginDetection.model":"customerSetup/domainList/liveBackOriginDetection/liveBackOriginDetection.model",
        "liveBackOriginDetection.view":"customerSetup/domainList/liveBackOriginDetection/liveBackOriginDetection.view",

        "liveTimestamp.model":"customerSetup/domainList/liveTimestamp/liveTimestamp.model",
        "liveTimestamp.view":"customerSetup/domainList/liveTimestamp/liveTimestamp.view",
        
        "liveBasicInformation.model": 'customerSetup/domainList/liveBasicInformation/liveBasicInformation.model',
        "liveBasicInformation.view": 'customerSetup/domainList/liveBasicInformation/liveBasicInformation.view',

        "liveBusOptimize.model": 'customerSetup/domainList/liveBusOptimize/liveBusOptimize.model',
        "liveBusOptimize.view": 'customerSetup/domainList/liveBusOptimize/liveBusOptimize.view',

        "liveH265Setup.model": 'customerSetup/domainList/liveH265Setup/liveH265Setup.model',
        "liveH265Setup.view": 'customerSetup/domainList/liveH265Setup/liveH265Setup.view',

        "liveAudioOnly.model": 'customerSetup/domainList/liveAudioOnly/liveAudioOnly.model',
        "liveAudioOnly.view": 'customerSetup/domainList/liveAudioOnly/liveAudioOnly.view',

        "liveEdge302.model": 'customerSetup/domainList/liveEdge302/liveEdge302.model',
        "liveEdge302.view": 'customerSetup/domainList/liveEdge302/liveEdge302.view',

        "liveHttpFlvOptimize.model": 'customerSetup/domainList/liveHttpFlvOptimize/liveHttpFlvOptimize.model',
        "liveHttpFlvOptimize.view": 'customerSetup/domainList/liveHttpFlvOptimize/liveHttpFlvOptimize.view',

        "liveRtmpOptimize.model": 'customerSetup/domainList/liveRtmpOptimize/liveRtmpOptimize.model',
        "liveRtmpOptimize.view": 'customerSetup/domainList/liveRtmpOptimize/liveRtmpOptimize.view', 

        "liveSLAStatistics.model": 'customerSetup/domainList/liveSLAStatistics/liveSLAStatistics.model',
        "liveSLAStatistics.view": 'customerSetup/domainList/liveSLAStatistics/liveSLAStatistics.view',

        "liveFrequencyLog.model": 'customerSetup/domainList/liveFrequencyLog/liveFrequencyLog.model',
        "liveFrequencyLog.view": 'customerSetup/domainList/liveFrequencyLog/liveFrequencyLog.view',                 

        /*配置下发*/
        "setupChannelManage.model": "setupChannelManage/setupChannelManage.model",
        "setupChannelManage.view": "setupChannelManage/setupChannelManage.view",
        "setupChannelManage.edit.view": "setupChannelManage/setupChannelManage.edit.view",

        "addEditLayerStrategy.model": "setupChannelManage/addEditLayerStrategy/addEditLayerStrategy.model",
        "addEditLayerStrategy.view": "setupChannelManage/addEditLayerStrategy/addEditLayerStrategy.view",

        "setupBill.model": 'setupChannelManage/setupBill/setupBill.model',
        "setupBill.view": 'setupChannelManage/setupBill/setupBill.view',

        "setupAppManage.model": "setupAppManage/setupAppManage.model",
        "setupAppManage.view": "setupAppManage/setupAppManage.view",

        "setupTopoManage.model": "setupTopoManage/setupTopoManage.model",
        "setupTopoManage.view": "setupTopoManage/setupTopoManage.view",
        "setupTopoManageSendStrategy.model": "setupTopoManage/setupTopoManageSendStrategy.model",

        "setupSendManage.controller": "setupSendManage/setupSendManage.controller",
        "setupSendDone.model": "setupSendManage/setupSendDone/setupSendDone.model",
        "setupSendDone.view": "setupSendManage/setupSendDone/setupSendDone.view",

        "setupSending.model": "setupSendManage/setupSending/setupSending.model",
        "setupSending.view": "setupSendManage/setupSending/setupSending.view",
        "setupSendDetail.model": "setupSendManage/setupSending/setupSending.detail.model",
        "setupSendDetail.view": "setupSendManage/setupSending/setupSending.detail.view",

        "setupSendWaitCustomize.model": "setupSendManage/setupSendWaitCustomize/setupSendWaitCustomize.model",
        "setupSendWaitCustomize.view": "setupSendManage/setupSendWaitCustomize/setupSendWaitCustomize.view",
        "setupSendWaitCustomize.stratety.view": "setupSendManage/setupSendWaitCustomize/setupSendWaitCustomize.stratety.view",

        "setupSendWaitSend.model": "setupSendManage/setupSendWaitSend/setupSendWaitSend.model",
        "setupSendWaitSend.view": "setupSendManage/setupSendWaitSend/setupSendWaitSend.view",
    },
    urlArgs: new Date().valueOf()
});

requirejs(['routes'], function(routes) {
    Backbone.history.start();
});

// requirejs.onError = function (err) {
//     alert('模块: ' + err.requireModules + "拉取失败！请检查您的网络，清除浏览器缓存后重试！")
// };