window.DEBUG = true;


if (window.DEBUG)
    window.BASE_URL = "http://120.92.232.203:9098";
else
    window.BASE_URL = "http://120.92.232.203:9098";

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
        "coverManage.model"    : 'coverManage/coverManage.model'
    },
    urlArgs: new Date().valueOf()
});

requirejs(['routes'], function(routes) {
    Backbone.history.start();
});