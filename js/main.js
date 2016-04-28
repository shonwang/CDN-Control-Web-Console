window.DEBUG = 1;

if (window.DEBUG === 1)
    window.BASE_URL = "http://120.92.232.203:9098";
else if (window.DEBUG === 2)
    window.BASE_URL = "http://test.center.cdn.ksyun.com";
else if (window.DEBUG === 3)
    window.BASE_URL = "http://center.cdn.ksyun.com";
else if(window.DEBUG === 4)
    window.BASE_URL = "http://test-cdn.center.cdn.ksyun.com";
else if(window.DEBUG === 5)
    window.BASE_URL = "http://gray.center.cdn.ksyun.com";

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

        "businessManage.view"  : 'businessManage/businessManage.view',
        "businessManage.model" : 'businessManage/businessManage.model'
    },
    urlArgs: new Date().valueOf()
});

requirejs(['routes'], function(routes) {
    Backbone.history.start();
});