//PATH START=== 
 var REQ_PATH = {
  "businessManage.model": "businessManage/businessManage.model",
  "businessManage.view": "businessManage/businessManage.view",
  "channelManage.model": "channelManage/channelManage.model",
  "channelManage.view": "channelManage/channelManage.view",
  "clientStatistics.model": "clientStatistics/clientStatistics.model",
  "clientStatistics.view": "clientStatistics/clientStatistics.view",
  "coverManage.model": "coverManage/coverManage.model",
  "coverManage.view": "coverManage/coverManage.view",
  "coverRegion.model": "coverRegion/coverRegion.model",
  "coverRegion.view": "coverRegion/coverRegion.view",
  "customMaintenance.model": "customMaintenance/customMaintenance.model",
  "customMaintenance.view": "customMaintenance/customMaintenance.view",
  "blockUrl.model": "customerSetup/blockUrl/blockUrl.model",
  "blockUrl.view": "customerSetup/blockUrl/blockUrl.view",
  "customerSetup.model": "customerSetup/customerSetup.model",
  "customerSetup.view": "customerSetup/customerSetup.view",
  "domainList.addDomain.view": "customerSetup/domainList/domainList.addDomain.view",
  "domainList.model": "customerSetup/domainList/domainList.model",
  "domainList.view": "customerSetup/domainList/domainList.view",
  "liveAudioOnly.model": "customerSetup/domainList/liveSetup/liveAudioOnly/liveAudioOnly.model",
  "liveAudioOnly.view": "customerSetup/domainList/liveSetup/liveAudioOnly/liveAudioOnly.view",
  "liveBackOriginDetection.model": "customerSetup/domainList/liveSetup/liveBackOriginDetection/liveBackOriginDetection.model",
  "liveBackOriginDetection.view": "customerSetup/domainList/liveSetup/liveBackOriginDetection/liveBackOriginDetection.view",
  "liveBackOriginSetup.model": "customerSetup/domainList/liveSetup/liveBackOriginSetup/liveBackOriginSetup.model",
  "liveBackOriginSetup.view": "customerSetup/domainList/liveSetup/liveBackOriginSetup/liveBackOriginSetup.view",
  "liveBasicInformation.model": "customerSetup/domainList/liveSetup/liveBasicInformation/liveBasicInformation.model",
  "liveBasicInformation.view": "customerSetup/domainList/liveSetup/liveBasicInformation/liveBasicInformation.view",
  "liveBusOptimize.model": "customerSetup/domainList/liveSetup/liveBusOptimize/liveBusOptimize.model",
  "liveBusOptimize.view": "customerSetup/domainList/liveSetup/liveBusOptimize/liveBusOptimize.view",
  "liveCnameSetup.model": "customerSetup/domainList/liveSetup/liveCnameSetup/liveCnameSetup.model",
  "liveCnameSetup.view": "customerSetup/domainList/liveSetup/liveCnameSetup/liveCnameSetup.view",
  "liveDomainSetup.model": "customerSetup/domainList/liveSetup/liveDomainSetup/liveDomainSetup.model",
  "liveDomainSetup.view": "customerSetup/domainList/liveSetup/liveDomainSetup/liveDomainSetup.view",
  "liveEdge302.model": "customerSetup/domainList/liveSetup/liveEdge302/liveEdge302.model",
  "liveEdge302.view": "customerSetup/domainList/liveSetup/liveEdge302/liveEdge302.view",
  "liveFrequencyLog.model": "customerSetup/domainList/liveSetup/liveFrequencyLog/liveFrequencyLog.model",
  "liveFrequencyLog.view": "customerSetup/domainList/liveSetup/liveFrequencyLog/liveFrequencyLog.view",
  "liveH265Setup.model": "customerSetup/domainList/liveSetup/liveH265Setup/liveH265Setup.model",
  "liveH265Setup.view": "customerSetup/domainList/liveSetup/liveH265Setup/liveH265Setup.view",
  "liveHttpFlvOptimize.model": "customerSetup/domainList/liveSetup/liveHttpFlvOptimize/liveHttpFlvOptimize.model",
  "liveHttpFlvOptimize.view": "customerSetup/domainList/liveSetup/liveHttpFlvOptimize/liveHttpFlvOptimize.view",
  "liveHttpsSetup.model": "customerSetup/domainList/liveSetup/liveHttpsSetup/liveHttpsSetup.model",
  "liveHttpsSetup.view": "customerSetup/domainList/liveSetup/liveHttpsSetup/liveHttpsSetup.view",
  "liveRefererAntiLeech.model": "customerSetup/domainList/liveSetup/liveRefererAntiLeech/liveRefererAntiLeech.model",
  "liveRefererAntiLeech.view": "customerSetup/domainList/liveSetup/liveRefererAntiLeech/liveRefererAntiLeech.view",
  "liveRtmpOptimize.model": "customerSetup/domainList/liveSetup/liveRtmpOptimize/liveRtmpOptimize.model",
  "liveRtmpOptimize.view": "customerSetup/domainList/liveSetup/liveRtmpOptimize/liveRtmpOptimize.view",
  "liveSLAStatistics.model": "customerSetup/domainList/liveSetup/liveSLAStatistics/liveSLAStatistics.model",
  "liveSLAStatistics.view": "customerSetup/domainList/liveSetup/liveSLAStatistics/liveSLAStatistics.view",
  "liveTimestamp.model": "customerSetup/domainList/liveSetup/liveTimestamp/liveTimestamp.model",
  "liveTimestamp.view": "customerSetup/domainList/liveSetup/liveTimestamp/liveTimestamp.view",
  "liveUpBackOriginSetup.edit.view": "customerSetup/domainList/liveSetup/liveUpBackOriginSetup/liveUpBackOriginSetup.edit.view",
  "liveUpBackOriginSetup.model": "customerSetup/domainList/liveSetup/liveUpBackOriginSetup/liveUpBackOriginSetup.model",
  "liveUpBackOriginSetup.view": "customerSetup/domainList/liveSetup/liveUpBackOriginSetup/liveUpBackOriginSetup.view",
  "liveUpBasicInformation.model": "customerSetup/domainList/liveSetup/liveUpBasicInformation/liveUpBasicInformation.model",
  "liveUpBasicInformation.view": "customerSetup/domainList/liveSetup/liveUpBasicInformation/liveUpBasicInformation.view",
  "liveUpFlowNameChange.model": "customerSetup/domainList/liveSetup/liveUpFlowNameChange/liveUpFlowNameChange.model",
  "liveUpFlowNameChange.view": "customerSetup/domainList/liveSetup/liveUpFlowNameChange/liveUpFlowNameChange.view",
  "backOriginDetection.model": "customerSetup/domainList/nginxDownloadSetup/backOriginDetection/backOriginDetection.model",
  "backOriginDetection.view": "customerSetup/domainList/nginxDownloadSetup/backOriginDetection/backOriginDetection.view",
  "backOriginSetup.model": "customerSetup/domainList/nginxDownloadSetup/backOriginSetup/backOriginSetup.model",
  "backOriginSetup.view": "customerSetup/domainList/nginxDownloadSetup/backOriginSetup/backOriginSetup.view",
  "basicInformation.model": "customerSetup/domainList/nginxDownloadSetup/basicInformation/basicInformation.model",
  "basicInformation.view": "customerSetup/domainList/nginxDownloadSetup/basicInformation/basicInformation.view",
  "cacheKeySetup.model": "customerSetup/domainList/nginxDownloadSetup/cacheKeySetup/cacheKeySetup.model",
  "cacheKeySetup.view": "customerSetup/domainList/nginxDownloadSetup/cacheKeySetup/cacheKeySetup.view",
  "cacheRule.model": "customerSetup/domainList/nginxDownloadSetup/cacheRule/cacheRule.model",
  "cacheRule.view": "customerSetup/domainList/nginxDownloadSetup/cacheRule/cacheRule.view",
  "clientLimitSpeed.model": "customerSetup/domainList/nginxDownloadSetup/clientLimitSpeed/clientLimitSpeed.model",
  "clientLimitSpeed.view": "customerSetup/domainList/nginxDownloadSetup/clientLimitSpeed/clientLimitSpeed.view",
  "cnameSetup.model": "customerSetup/domainList/nginxDownloadSetup/cnameSetup/cnameSetup.model",
  "cnameSetup.view": "customerSetup/domainList/nginxDownloadSetup/cnameSetup/cnameSetup.view",
  "delMarkCache.model": "customerSetup/domainList/nginxDownloadSetup/delMarkCache/delMarkCache.model",
  "delMarkCache.view": "customerSetup/domainList/nginxDownloadSetup/delMarkCache/delMarkCache.view",
  "domainSetup.model": "customerSetup/domainList/nginxDownloadSetup/domainSetup/domainSetup.model",
  "domainSetup.view": "customerSetup/domainList/nginxDownloadSetup/domainSetup/domainSetup.view",
  "dragPlay.model": "customerSetup/domainList/nginxDownloadSetup/dragPlay/dragPlay.model",
  "dragPlay.view": "customerSetup/domainList/nginxDownloadSetup/dragPlay/dragPlay.view",
  "following302.model": "customerSetup/domainList/nginxDownloadSetup/following302/following302.model",
  "following302.view": "customerSetup/domainList/nginxDownloadSetup/following302/following302.view",
  "httpHeaderCtr.model": "customerSetup/domainList/nginxDownloadSetup/httpHeaderCtr/httpHeaderCtr.model",
  "httpHeaderCtr.view": "customerSetup/domainList/nginxDownloadSetup/httpHeaderCtr/httpHeaderCtr.view",
  "httpHeaderOpt.model": "customerSetup/domainList/nginxDownloadSetup/httpHeaderOpt/httpHeaderOpt.model",
  "httpHeaderOpt.view": "customerSetup/domainList/nginxDownloadSetup/httpHeaderOpt/httpHeaderOpt.view",
  "ipBlackWhiteList.model": "customerSetup/domainList/nginxDownloadSetup/ipBlackWhiteList/ipBlackWhiteList.model",
  "ipBlackWhiteList.view": "customerSetup/domainList/nginxDownloadSetup/ipBlackWhiteList/ipBlackWhiteList.view",
  "matchCondition.model": "customerSetup/domainList/nginxDownloadSetup/matchCondition/matchCondition.model",
  "matchCondition.view": "customerSetup/domainList/nginxDownloadSetup/matchCondition/matchCondition.view",
  "openNgxLog.model": "customerSetup/domainList/nginxDownloadSetup/openNgxLog/openNgxLog.model",
  "openNgxLog.view": "customerSetup/domainList/nginxDownloadSetup/openNgxLog/openNgxLog.view",
  "refererAntiLeech.model": "customerSetup/domainList/nginxDownloadSetup/refererAntiLeech/refererAntiLeech.model",
  "refererAntiLeech.view": "customerSetup/domainList/nginxDownloadSetup/refererAntiLeech/refererAntiLeech.view",
  "requestArgsModify.model": "customerSetup/domainList/nginxDownloadSetup/requestArgsModify/requestArgsModify.model",
  "requestArgsModify.view": "customerSetup/domainList/nginxDownloadSetup/requestArgsModify/requestArgsModify.view",
  "timestamp.model": "customerSetup/domainList/nginxDownloadSetup/timestamp/timestamp.model",
  "timestamp.view": "customerSetup/domainList/nginxDownloadSetup/timestamp/timestamp.view",
  "urlBlackList.model": "customerSetup/domainList/nginxDownloadSetup/urlBlackList/urlBlackList.model",
  "urlBlackList.view": "customerSetup/domainList/nginxDownloadSetup/urlBlackList/urlBlackList.view",
  "openAPILogSetup.model": "customerSetup/domainList/openAPILogSetup/openAPILogSetup.model",
  "openAPILogSetup.view": "customerSetup/domainList/openAPILogSetup/openAPILogSetup.view",
  "saveThenSend.model": "customerSetup/domainList/saveThenSend/saveThenSend.model",
  "saveThenSend.view": "customerSetup/domainList/saveThenSend/saveThenSend.view",
  "interfaceQuota.model": "customerSetup/interfaceQuota/interfaceQuota.model",
  "interfaceQuota.view": "customerSetup/interfaceQuota/interfaceQuota.view",
  "deviceManage.model": "deviceManage/deviceManage.model",
  "deviceManage.view": "deviceManage/deviceManage.view",
  "dispConfig.model": "dispConfig/dispConfig.model",
  "dispConfig.view": "dispConfig/dispConfig.view",
  "dispGroup.model": "dispGroup/dispGroup.model",
  "dispGroup.view": "dispGroup/dispGroup.view",
  "dispSuggesttion.model": "dispSuggesttion/dispSuggesttion.model",
  "dispSuggesttion.view": "dispSuggesttion/dispSuggesttion.view",
  "domainManage.model": "domainManage/domainManage.model",
  "domainManage.view": "domainManage/domainManage.view",
  "domainStatistics.model": "domainStatistics/domainStatistics.model",
  "domainStatistics.view": "domainStatistics/domainStatistics.view",
  "grayscaleSetup.model": "grayscaleSetup/grayscaleSetup.model",
  "grayscaleSetup.view": "grayscaleSetup/grayscaleSetup.view",
  "importAssess.model": "importAssess/importAssess.model",
  "importAssess.view": "importAssess/importAssess.view",
  "importDomainManage.edit.view": "importDomainManage/importDomainManage.edit.view",
  "importDomainManage.model": "importDomainManage/importDomainManage.model",
  "importDomainManage.view": "importDomainManage/importDomainManage.view",
  "ipManage.model": "ipManage/ipManage.model",
  "ipManage.view": "ipManage/ipManage.view",
  "liveAllSetup.model": "liveAllSetup/liveAllSetup.model",
  "liveAllSetup.view": "liveAllSetup/liveAllSetup.view",
  "liveCurentSetup.model": "liveCurentSetup/liveCurentSetup.model",
  "liveCurentSetup.view": "liveCurentSetup/liveCurentSetup.view",
  "nodeManage.model": "nodeManage/nodeManage.model",
  "nodeManage.view": "nodeManage/nodeManage.view",
  "refreshManual.model": "refreshManual/refreshManual.model",
  "refreshManual.view": "refreshManual/refreshManual.view",
  "routes.customerSetup": "routes/routes.customerSetup",
  "routes.dispSetup": "routes/routes.dispSetup",
  "routes": "routes/routes",
  "routes.liveSetup": "routes/routes.liveSetup",
  "routes.ngnixDownloadSetup": "routes/routes.ngnixDownloadSetup",
  "routes.other": "routes/routes.other",
  "routes.resourceManage": "routes/routes.resourceManage",
  "routes.setupSend": "routes/routes.setupSend",
  "routes.subNavbar": "routes/routes.subNavbar",
  "setupAppManage.model": "setupAppManage/setupAppManage.model",
  "setupAppManage.view": "setupAppManage/setupAppManage.view",
  "addEditLayerStrategy.model": "setupChannelManage/addEditLayerStrategy/addEditLayerStrategy.model",
  "addEditLayerStrategy.view": "setupChannelManage/addEditLayerStrategy/addEditLayerStrategy.view",
  "setupBill.model": "setupChannelManage/setupBill/setupBill.model",
  "setupBill.view": "setupChannelManage/setupBill/setupBill.view",
  "setupBillLive.view": "setupChannelManage/setupBill/setupBillLive.view",
  "setupChannelManage.edit.view": "setupChannelManage/setupChannelManage.edit.view",
  "setupChannelManage.history.view": "setupChannelManage/setupChannelManage.history.view",
  "setupChannelManage.model": "setupChannelManage/setupChannelManage.model",
  "setupChannelManage.select.view": "setupChannelManage/setupChannelManage.select.view",
  "setupChannelManage.specialLayer.view": "setupChannelManage/setupChannelManage.specialLayer.view",
  "setupChannelManage.view": "setupChannelManage/setupChannelManage.view",
  "setupSendDone.model": "setupSendManage/setupSendDone/setupSendDone.model",
  "setupSendDone.view": "setupSendManage/setupSendDone/setupSendDone.view",
  "setupSendWaitCustomize.model": "setupSendManage/setupSendWaitCustomize/setupSendWaitCustomize.model",
  "setupSendWaitCustomize.stratety.view": "setupSendManage/setupSendWaitCustomize/setupSendWaitCustomize.stratety.view",
  "setupSendWaitCustomize.view": "setupSendManage/setupSendWaitCustomize/setupSendWaitCustomize.view",
  "setupSendWaitSend.model": "setupSendManage/setupSendWaitSend/setupSendWaitSend.model",
  "setupSendWaitSend.view": "setupSendManage/setupSendWaitSend/setupSendWaitSend.view",
  "setupSending.detail.model": "setupSendManage/setupSending/setupSending.detail.model",
  "setupSending.detail.view": "setupSendManage/setupSending/setupSending.detail.view",
  "setupSending.model": "setupSendManage/setupSending/setupSending.model",
  "setupSending.view": "setupSendManage/setupSending/setupSending.view",
  "setupTopoManage.edit.view": "setupTopoManage/setupTopoManage.edit.view",
  "setupTopoManage.history.view": "setupTopoManage/setupTopoManage.history.view",
  "setupTopoManage.model": "setupTopoManage/setupTopoManage.model",
  "setupTopoManage.selectNode.view": "setupTopoManage/setupTopoManage.selectNode.view",
  "setupTopoManage.view": "setupTopoManage/setupTopoManage.view",
  "setupTopoManageSendStrategy.model": "setupTopoManage/setupTopoManageSendStrategy.model",
  "setupTopoManageSendStrategy.view": "setupTopoManage/setupTopoManageSendStrategy.view",
  "specialLayerManage.model": "specialLayerManage/specialLayerManage.model",
  "specialLayerManage.view": "specialLayerManage/specialLayerManage.view",
  "statisticsManage.model": "statisticsManage/statisticsManage.model",
  "statisticsManage.view": "statisticsManage/statisticsManage.view",
  "template": "template",
  "templateManage.model": "templateManage/templateManage.model",
  "templateManage.view": "templateManage/templateManage.view",
  "utility": "utility",
  "modal.view": "views/modal.view",
  "navbar.view": "views/navbar.view",
  "subNavbar.view": "views/subNavbar.view"
};
//PATH END===
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
else if(window.DEBUG === 10)
    window.BASE_URL = "http://preonline.center.cdn.ksyun.com";
requirejs.config({
    paths:REQ_PATH,
    urlArgs: new Date().valueOf()
});
requirejs(['routes', 'utility'], function(routes, Utility) {
    Utility.dateFormat();
    Backbone.history.start();
});
requirejs.onError = function () {
    console.log(arguments)
    var errorPopup = $('#big-main-error').get(0);
    if (errorPopup) return;
    var message = "";
    var tpl = '<div id="big-main-error" class="modal">' + 
                '<div class="modal-dialog">' + 
                    '<div class="modal-content">' + 
                        '<div class="modal-header"><h3 class="modal-title text-danger text-center">Oh snap! You got an error!</h3></div>' + 
                        '<div class="modal-body">' +
                            '<div class="alert alert-danger">'+ 
                                '<img class="pull-left img-rounded" src="images/timg.jpg" style="width: 100px;margin-right: 10px;">' + 
                                arguments[0].stack + message + 
                            '</div>' + 
                            '<p class="bg-primary text-center">请清空缓存后刷新重试！</p>' +  
                        '</div>' + 
                    '</div>' + 
                '</div>' + 
              '</div>'
    var $errorPopup = $(tpl),
        options = {
            backdrop:'static'
        };
    $errorPopup.modal(options);
};

if (window.DEBUG === 1.1) {
    window.SOCKET = io.connect("ws://127.0.0.1:3000");
    window.SOCKET.on('debug', function(message){
        console.log("Server: ", message)
    });
    window.SOCKET.on('connect_error', function(){
        window.SOCKET.close();
    });
}