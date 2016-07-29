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

requirejs.config({
    paths: {
        "routes"               : 'routes',
        "utility"              : 'utility',
        "template"             : 'template',
        "modal.view"           : "modal.view",
        "navbar.view"          : "navbar.view",
        
        "channelManage.view"   : "channelManage/channelManage.view",
        "channelManage.model"  : "channelManage/channelManage.model",

        "deviceManage.view"    : 'deviceManage/deviceManage.view',
        "deviceManage.model"   : 'deviceManage/deviceManage.model',

        "nodeManage.view"      : 'nodeManage/nodeManage.view',
        "nodeManage.model"     : 'nodeManage/nodeManage.model',

        "dispGroup.view"       : "dispGroup/dispGroup.view",
        "dispGroup.model"      : "dispGroup/dispGroup.model",

        "dispConfig.view"      : "dispConfig/dispConfig.view",
        "dispConfig.model"     : "dispConfig/dispConfig.model",

        "coverRegion.view"     : 'coverRegion/coverRegion.view',
        "coverRegion.model"    : 'coverRegion/coverRegion.model',

        "coverManage.view"     : 'coverManage/coverManage.view',
        "coverManage.model"    : 'coverManage/coverManage.model',

        "liveAllSetup.view"    : 'liveAllSetup/liveAllSetup.view',
        "liveAllSetup.model"   : 'liveAllSetup/liveAllSetup.model',

        "liveCurentSetup.view" : 'liveCurentSetup/liveCurentSetup.view',
        "liveCurentSetup.model": 'liveCurentSetup/liveCurentSetup.model',

        "ipManage.view"        : 'ipManage/ipManage.view',
        "ipManage.model"       : 'ipManage/ipManage.model',

        "refreshManual.view"  : 'refreshManual/refreshManual.view',
        "refreshManual.model" : 'refreshManual/refreshManual.model',

        "customMaintenance.view"  : 'customMaintenance/customMaintenance.view',
        "customMaintenance.model" : 'customMaintenance/customMaintenance.model',

        "businessManage.view"  : 'businessManage/businessManage.view',
        "businessManage.model" : 'businessManage/businessManage.model',
        "clientStatistics.view"  : 'clientStatistics/clientStatistics.view',
        "clientStatistics.model" : 'clientStatistics/clientStatistics.model',
        "statisticsManage.view"  : 'statisticsManage/statisticsManage.view',
        "statisticsManage.model" : 'statisticsManage/statisticsManage.model',
        "domainStatistics.view"  : 'domainStatistics/domainStatistics.view',
        "domainStatistics.model" : 'domainStatistics/domainStatistics.model',

        "domainManage.model" : "domainManage/domainManage.model",
        "domainManage.view" : "domainManage/domainManage.view"
    },
    urlArgs: new Date().valueOf()
});

requirejs(['routes'], function(routes) {
    Backbone.history.start();
});