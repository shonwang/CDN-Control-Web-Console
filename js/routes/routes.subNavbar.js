define("routes.subNavbar", ['require', 'exports', 'subNavbar.view'], 
    function(require, exports, SubNavbar) {
        var RouterSubNavbar = {
            initSetupSendNavbar: function() {
                var menu = [{
                        id: 'setupSendingSwitch',
                        name: '下发设置',
                        hash: 'index.html#/setupSendingSwitch',
                        active: true,
                        children: []
                    }, {
                        id: 'setupSendWaitCustomize',
                        name: '待定制',
                        hash: 'index.html#/setupSendWaitCustomize',
                        active: true,
                        children: []
                    }, {
                        id: 'setupSendWaitSend',
                        name: '待下发',
                        hash: 'index.html#/setupSendWaitSend',
                        active: false,
                        children: []
                    }, {
                        id: 'setupSending',
                        name: '下发中',
                        hash: 'index.html#/setupSending',
                        active: false,
                        children: []
                    }, {
                        id: 'setupSendDone',
                        name: '下发完成',
                        hash: 'index.html#/setupSendDone',
                        active: false,
                        children: []
                    }, ],
                    menuOptions = {
                        backHash: "",
                        menuList: menu
                    };
                if (!this.setupSendNavbar) {
                    this.setupSendNavbar = new SubNavbar(menuOptions);
                    this.setupSendNavbar.$el.find(".back").remove();
                    if (!AUTH_OBJ.WaitCustomize) {
                        this.setupSendNavbar.$el.find('#setupSendWaitCustomize').remove();
                    }
                    if (!AUTH_OBJ.WaitSend) {
                        this.setupSendNavbar.$el.find('#setupSendWaitSend').remove();
                    }
                    if (!AUTH_OBJ.Sending) {
                        this.setupSendNavbar.$el.find('#setupSending').remove();
                    }
                    if (!AUTH_OBJ.SendDone) {
                        this.setupSendNavbar.$el.find('#setupSendDone').remove();
                    }
                    this.setupSendNavbar.select(this.curPage);
                }
            },

            setupDomainManageNavbar: function(query, query2) {
                if (!this.domainManageNavbar) {
                    var menuOptions = {
                        query: query,
                        query2: query2
                    }
                    this.domainManageNavbar = new SubNavbar(menuOptions);
                    this.domainManageNavbar.select(this.curPage);
                }
            },         

            setupLuaDomainManageNavbar: function(query, query2) {
                var menu = [{
                    id: 'customerSetup-domainList-luaBasicInformation',
                    name: '基本信息',
                    hash: 'index.html#/domainList/' + query + '/luaBasicInformation/' + query2,
                    children: []
                }, {
                    id: '',
                    name: '域名设置',
                    hash: 'javascript:void(0)',
                    children: [{
                        id: 'customerSetup-domainList-luaDomainSetup',
                        name: '域名基础设置',
                        hash: 'index.html#/domainList/' + query + '/luaDomainSetup/' + query2,
                        active: true,
                        children: []
                    }, {
                        id: 'customerSetup-domainList-luaCnameSetup',
                        name: 'CNAME设置',
                        hash: 'index.html#/domainList/' + query + '/luaCnameSetup/' + query2,
                        active: false,
                        children: []
                    }]
                }, {
                    id: '',
                    name: '源站配置',
                    hash: 'javascript:void(0)',
                    children: [{
                        id: 'customerSetup-domainList-luaBackOriginDetection',
                        name: '回源检测',
                        hash: 'index.html#/domainList/' + query + '/luaBackOriginDetection/' + query2,
                        active: false,
                        children: []
                    }, {
                        id: 'customerSetup-domainList-luaBackOriginSetup',
                        name: '回源配置',
                        hash: 'index.html#/domainList/' + query + '/luaBackOriginSetup/' + query2,
                        active: false,
                        children: []
                    },{
                        id: 'customerSetup-domainList-following302',
                        name: 'Follow302域名配置',
                        hash: 'index.html#/domainList/' + query + '/following302/' + query2,
                        active: false,
                        children: []
                    }]
                }, {
                    id: 'customerSetup-domainList-edgeOptimize',
                    name: '边缘择优配置',
                    hash: 'index.html#/domainList/' + query + '/edgeOptimize/' + query2,
                    children: []
                }, {
                    id: '',
                    name: '缓存优化',
                    hash: 'javascript:void(0)',
                    children: [{
                        id: 'customerSetup-domainList-luaCacheRule',
                        name: '缓存规则',
                        hash: 'index.html#/domainList/' + query + '/luaCacheRule/' + query2,
                        active: false,
                        children: []
                    }, {
                        id: 'customerSetup-domainList-luaDelMarkCache',
                        name: '去问号缓存',
                        hash: 'index.html#/domainList/' + query + '/luaDelMarkCache/' + query2,
                        active: false,
                        children: []
                    }, {
                        id: 'customerSetup-domainList-luaStatusCodeCache',
                        name: '状态码缓存',
                        hash: 'index.html#/domainList/' + query + '/luaStatusCodeCache/' + query2,
                        active: false,
                        children: []
                    }, {
                        id: 'customerSetup-domainList-luaCacheKeySetup',
                        name: '设置 Cache Key',
                        hash: 'index.html#/domainList/' + query + '/luaCacheKeySetup/' + query2,
                        active: false,
                        children: []
                    }]
                }, {
                    id: '',
                    name: '点播优化',
                    //notShow: !AUTH_OBJ.OndemandOptimization,
                    hash: 'javascript:void(0)',
                    children: [{
                        id: 'customerSetup-domainList-luaDragPlay',
                        name: '拖拽播放',
                        hash: 'index.html#/domainList/' + query + '/luaDragPlay/' + query2,
                        active: false,
                        children: []
                    }]
                }, {
                    id: '',
                    name: '限速',
                    //notShow: !AUTH_OBJ.SpeedLimit,
                    hash: 'javascript:void(0)',
                    children: [{
                        id: 'customerSetup-domainList-luaClientLimitSpeed',
                        name: '客户端限速',
                        hash: 'index.html#/domainList/' + query + '/luaClientLimitSpeed/' + query2,
                        active: false,
                        children: []
                    }]
                }, {
                    id: '',
                    name: 'HTTP头控制',
                    //notShow: !AUTH_OBJ.HttpheadControl,
                    hash: 'javascript:void(0)',
                    children: [{
                        id: 'customerSetup-domainList-luaHttpHeaderOpt',
                        name: 'HTTP头的增删改',
                        hash: 'index.html#/domainList/' + query + '/luaHttpHeaderOpt/' + query2,
                        active: false,
                        children: []
                    }, {
                        id: 'customerSetup-domainList-luaHttpHeaderCtr',
                        name: '常用HTTP头控制功能',
                        hash: 'index.html#/domainList/' + query + '/luaHttpHeaderCtr/' + query2,
                        active: false,
                        children: []
                    }]
                }, {
                    id: '',
                    name: 'URL控制',
                    //notShow: !AUTH_OBJ.UrlControl,
                    hash: 'javascript:void(0)',
                    children: [{
                        id: 'customerSetup-domainList-luaRequestArgsModify',
                        name: '请求参数的改写',
                        hash: 'index.html#/domainList/' + query + '/luaRequestArgsModify/' + query2,
                        active: false,
                        children: []
                    }]
                }, {
                    id: '',
                    name: '访问控制',
                    hash: 'javascript:void(0)',
                    children: [{
                        id: 'customerSetup-domainList-luaIpBlackWhiteList',
                        name: 'IP黑白名单',
                        hash: 'index.html#/domainList/' + query + '/luaIpBlackWhiteList/' + query2,
                        //--notShow:!AUTH_OBJ.IPMatchingCondition,
                        active: false,
                        children: []
                    }, {
                        id: 'customerSetup-domainList-luaRefererAntiLeech',
                        name: 'Referer防盗链',
                        hash: 'index.html#/domainList/' + query + '/luaRefererAntiLeech/' + query2,
                        //--notShow:!AUTH_OBJ.referIPMatchingCondition,
                        active: false,
                        children: []
                    }, {
                        id: 'customerSetup-domainList-luaTimestamp',
                        name: '时间戳+共享秘钥防盗链',
                        hash: 'index.html#/domainList/' + query + '/luaTimestamp/' + query2,
                        //notShow: !AUTH_OBJ.TimeSafetychain,
                        active: false,
                        children: []
                    }]
                },{
                    id: 'customerSetup-domainList-luaConfig',
                    name: '高级配置',
                    hash: 'index.html#/domainList/' + query + '/luaAdvanceConfig/' + query2,
                    children: []
                }];

                if (!this.domainManageNavbar) {
                    var menuOptions = {
                        query: query,
                        query2: query2,
                        menuList: menu,
                        backHash: 'index.html#/domainList/' + query
                    }
                    this.domainManageNavbar = new SubNavbar(menuOptions);
                    this.domainManageNavbar.select(this.curPage);
                }
            },

            setupLiveDomainManageNavbar: function(query, query2) {
                var menu = [{
                    id: 'customerSetup-domainList-liveBasicInformation',
                    name: '基本信息',
                    hash: 'index.html#/domainList/' + query + '/liveBasicInformation/' + query2,
                    children: []
                }, {
                    id: '',
                    name: '域名设置',
                    hash: 'javascript:void(0)',
                    children: [{
                            id: 'customerSetup-domainList-liveDomainSetup',
                            name: '域名基础配置',
                            hash: 'index.html#/domainList/' + query + '/liveDomainSetup/' + query2,
                            active: false,
                            children: []
                        }, {
                            id: 'customerSetup-domainList-liveCnameSetup',
                            name: 'CNAME设置',
                            hash: 'index.html#/domainList/' + query + '/liveCnameSetup/' + query2,
                            active: false,
                            children: []
                        },
                        // {
                        //     id: 'customerSetup-domainList-liveHttpsSetup',
                        //     name: 'https配置',
                        //     hash: 'index.html#/domainList/' + query + '/liveHttpsSetup/' + query2,
                        //     active: false,
                        //     children: []
                        // }
                    ]
                }, {
                    id: '',
                    name: '源站配置',
                    hash: 'javascript:void(0)',
                    children: [{
                        id: 'customerSetup-domainList-liveBackOriginSetup',
                        name: '回源配置',
                        hash: 'index.html#/domainList/' + query + '/liveBackOriginSetup/' + query2,
                        active: false,
                        children: []
                    }, {
                        id: 'customerSetup-domainList-liveBackOriginDetection',
                        name: '回源检测',
                        hash: 'index.html#/domainList/' + query + '/liveBackOriginDetection/' + query2,
                        active: false,
                        children: []
                    }]
                }, {
                    id: '',
                    name: '访问控制',
                    hash: 'javascript:void(0)',
                    children: [{
                        id: 'customerSetup-domainList-liveRefererAntiLeech',
                        name: 'Referer防盗链',
                        hash: 'index.html#/domainList/' + query + '/liveRefererAntiLeech/' + query2,
                        active: false,
                        children: []
                    }, {
                        id: 'customerSetup-domainList-liveTimestamp',
                        name: '时间戳+共享秘钥防盗链',
                        hash: 'index.html#/domainList/' + query + '/liveTimestamp/' + query2,
                        active: false,
                        children: []
                    }]
                }, {
                    id: 'customerSetup-domainList-liveOptimize',
                    name: '直播业务优化',
                    hash: 'javascript:void(0)',
                    children: [{
                        id: 'customerSetup-domainList-liveBusOptimize',
                        name: '业务优化配置',
                        hash: 'index.html#/domainList/' + query + '/liveBusOptimize/' + query2,
                        active: false,
                        children: []
                    }, {
                        id: 'customerSetup-domainList-liveH265Setup',
                        name: 'H265配置',
                        hash: 'index.html#/domainList/' + query + '/liveH265Setup/' + query2,
                        active: false,
                        children: []
                    }, {
                        id: 'customerSetup-domainList-liveAudioOnly',
                        name: '纯音频拉流',
                        hash: 'index.html#/domainList/' + query + '/liveAudioOnly/' + query2,
                        active: false,
                        children: []
                    }, {
                        id: 'customerSetup-domainList-liveEdge302',
                        name: '边缘302',
                        hash: 'index.html#/domainList/' + query + '/liveEdge302/' + query2,
                        active: false,
                        children: []
                    }]
                }, {
                    id: 'customerSetup-domainList-liveHttpFlvOptimize',
                    name: 'PK优化配置',
                    hash: 'index.html#/domainList/' + query + '/liveHttpFlvOptimize/' + query2,
                    children: []
                }, {
                    id: 'customerSetup-domainList-liveSLASetup',
                    name: '日志配置',
                    hash: 'javascript:void(0)',
                    children: [{
                        id: 'customerSetup-domainList-liveSLAStatistics',
                        name: 'SLA统计配置',
                        hash: 'index.html#/domainList/' + query + '/liveSLAStatistics/' + query2,
                        active: false,
                        children: []
                    }, {
                        id: 'customerSetup-domainList-liveFrequencyLog',
                        name: '变频日志配置',
                        hash: 'index.html#/domainList/' + query + '/liveFrequencyLog/' + query2,
                        active: false,
                        children: []
                    }]
                }];

                if (!this.domainManageNavbar) {
                    var menuOptions = {
                        query: query,
                        query2: query2,
                        menuList: menu,
                        backHash: 'index.html#/domainList/' + query
                    }
                    this.domainManageNavbar = new SubNavbar(menuOptions);
                    this.domainManageNavbar.select(this.curPage);
                }
            },

            setupLiveUpDomainManageNavbar: function(query, query2) {
                var menu = [{
                    id: 'customerSetup-domainList-liveUpBasicInformation',
                    name: '基本信息',
                    hash: 'index.html#/domainList/' + query + '/liveUpBasicInformation/' + query2,
                    children: []
                }, {
                    id: 'customerSetup-domainList-liveUpBackOriginSetup',
                    name: '源站配置',
                    hash: 'index.html#/domainList/' + query + '/liveUpBackOriginSetup/' + query2,
                    children: []
                }, {
                    id: 'customerSetup-domainList-liveUpFlowNameChange',
                    name: '流名变换',
                    hash: 'index.html#/domainList/' + query + '/liveUpFlowNameChange/' + query2,
                    children: []
                }];

                if (!this.domainManageNavbar) {
                    var menuOptions = {
                        query: query,
                        query2: query2,
                        menuList: menu,
                        backHash: 'index.html#/domainList/' + query
                    }
                    this.domainManageNavbar = new SubNavbar(menuOptions);
                    this.domainManageNavbar.select(this.curPage);
                }
            },

            setupCustomerSetupNavbar: function(query) {
                var menu = [{
                        id: '',
                        name: '客户配置管理',
                        hash: 'javascript:void(0)',
                        children: [{
                            id: 'customerSetup-domainList',
                            name: '域名列表',
                            hash: 'index.html#/domainList/' + query,
                            active: true,
                            children: []
                        }, {
                            id: 'customerSetup-blockUrl',
                            name: '一键屏蔽URL',
                            hash: 'index.html#/blockUrl/' + query,
                            active: false,
                            children: []
                        }, {
                            id: 'customerSetup-interfaceQuota',
                            name: 'API接口配额',
                            notShow: !AUTH_OBJ.OpenApiQuota,
                            hash: 'index.html#/interfaceQuota/' + query,
                            active: false,
                            children: []
                        },{
                            id: 'customerSetup-pnoSetup',
                            name: 'PNO列表配置',
                            hash: 'index.html#/pnoSetup/' + query,
                            active: false,
                            children: []
                        }]
                    }],
                    menuOptions = {
                        backHash: "index.html#/customerSetup",
                        menuList: menu
                    };

                if (!this.customerSetupNavbar) {
                    this.customerSetupNavbar = new SubNavbar(menuOptions);
                    this.customerSetupNavbar.select(this.curPage);
                }
            },

            setupLogSetupDomainManageNavbar: function(query, query2) {
                var menu = [{
                    id: 'customerSetup-domainList-openAPILogSetup',
                    name: '日志配置',
                    hash: 'index.html#/domainList/' + query + '/openAPILogSetup/' + query2,
                    children: []
                }];

                if (!this.domainManageNavbar) {
                    var menuOptions = {
                        query: query,
                        query2: query2,
                        menuList: menu,
                        backHash: 'index.html#/domainList/' + query
                    }
                    this.domainManageNavbar = new SubNavbar(menuOptions);
                    this.domainManageNavbar.select(this.curPage);
                }
            },

            removeSubSideBar: function() {
                //从域名列表页面、新域名管理页面进入到其他一级导航页面移除域名列表的二级导航、新域名管理的二级导航
                if (this.curPage.indexOf("customerSetup-") == -1 &&
                    this.curPage.indexOf("customerSetup-domainList-") == -1) {
                    if (this.customerSetupNavbar) {
                        this.customerSetupNavbar.$el.remove();
                        this.customerSetupNavbar = null;
                    }
                    if (this.domainManageNavbar) {
                        this.domainManageNavbar.$el.remove();
                        this.domainManageNavbar = null;
                    }
                }
                //从新域名管理页面进入到域名列表页面移除新域名管理的二级导航
                if (this.curPage.indexOf("customerSetup-") > -1 &&
                    this.curPage.indexOf("customerSetup-domainList-") == -1 &&
                    this.domainManageNavbar) {
                    this.domainManageNavbar.$el.remove();
                    this.domainManageNavbar = null;
                }
                //从下发页面进入到其他一级页面移除下发管理的二级导航
                if (this.curPage.indexOf("setupSend") === -1 && this.setupSendNavbar) {
                    this.setupSendNavbar.$el.remove();
                    this.setupSendNavbar = null;
                }
            }
        }

        return RouterSubNavbar
    }
);