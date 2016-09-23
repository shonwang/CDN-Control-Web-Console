window.DEBUG = 1.1;

if (window.DEBUG === 1)
    window.BASE_URL = "http://develop.gateway.center.cdn.ksyun.com";
else if (window.DEBUG === 1.1)
    window.BASE_URL = "http://local.center.ksyun.com";
    //window.BASE_URL = "http://192.168.158.85:9098";  //翟磊
    // window.BASE_URL = "http://192.168.118.134:9098";   //王卫
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
        "utility": 'utility',
        "template": 'template',
        "modal.view": "modal.view",
        "navbar.view": "navbar.view",
        "subNavbar.view": "subNavbar.view",
        
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

        "customerSetup.model": 'customerSetup/customerSetup.model',
        "customerSetup.view": 'customerSetup/customerSetup.view',
        "customerSetup.controller": 'customerSetup/customerSetup.controller',

        "domainList.model": 'customerSetup/domainList/domainList.model',
        "domainList.view": 'customerSetup/domainList/domainList.view',
        "domainList.addDomain.view": 'customerSetup/domainList/domainList.addDomain.view',

        "matchCondition.view": 'customerSetup/domainList/matchCondition.view',

        "domainSetup.model": 'customerSetup/domainList/domainSetup/domainSetup.model',
        "domainSetup.view": 'customerSetup/domainList/domainSetup/domainSetup.view',

        "cnameSetup.model": 'customerSetup/domainList/cnameSetup/cnameSetup.model',
        "cnameSetup.view": 'customerSetup/domainList/cnameSetup/cnameSetup.view',

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
    },
    urlArgs: new Date().valueOf()
});

requirejs(['routes'], function(routes) {
    Backbone.history.start();
});