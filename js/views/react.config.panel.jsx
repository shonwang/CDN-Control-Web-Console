define("react.config.panel", ['require', 'exports', 'utility'],
    function(require, exports, Utility) {
        var PanelGroup = ReactBootstrap.PanelGroup,
            Panel = ReactBootstrap.Panel,
            Button = ReactBootstrap.Button,
            Well = ReactBootstrap.Well,
            ButtonToolbar = ReactBootstrap.ButtonToolbar,
            FormControl = ReactBootstrap.FormControl;
        var randomStr = Utility.randomStr(8);

        var ReactLoading = React.createBackboneClass({
            render: function(){
                return (     
                    <div className="loader">
                        <div className="loader-inner pacman">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                )
            }
        });

        var ReactConfigPanel = React.createBackboneClass({

                componentDidMount: function() {
                    var props = this.props,
                        collection = this.getCollection();
                    collection.on("get.compare.success", $.proxy(this.onGetDiff, this));
                    collection.on("get.compare.error", $.proxy(this.onGetError, this));
                    //1：配置文件只读；2，配置文件编辑；3：配置文件只读diff模式
                    if (props.type === 3) {
                        collection.compare({
                            domain: props.domain,
                            v1: props.version.split(",")[0],
                            v2: props.version.split(",")[1]
                        })
                    } else {
                        collection.on("get.publish.success", $.proxy(this.onGetPublishSuccess, this));
                        collection.on("get.publish.error", $.proxy(this.onGetError, this));
                        require(['setupSendWaitCustomize.model'], function(SetupSendWaitCustomizeModel){
                            this.mySetupSendWaitCustomizeModel = new SetupSendWaitCustomizeModel();
                            this.mySetupSendWaitCustomizeModel.on("get.channel.config.success", $.proxy(this.onGetApplicationType, this));
                            this.mySetupSendWaitCustomizeModel.on("get.channel.config.error", $.proxy(this.onGetError, this));
                            this.mySetupSendWaitCustomizeModel.getChannelConfig({
                                domain: props.domain,
                                version: props.version || props.domainVersion
                            })
                        }.bind(this)); 
                    }
                },

                componentWillUnmount: function() {
                    var collection = this.getCollection();
                    collection.off("get.compare.success");
                    collection.off("get.compare.error");
                    collection.off("get.publish.success");
                    collection.off("get.publish.error");
                    if (this.mySetupSendWaitCustomizeModel) {
                        this.mySetupSendWaitCustomizeModel.off("get.all.config.success");
                        this.mySetupSendWaitCustomizeModel.off("get.all.config.error");
                        this.mySetupSendWaitCustomizeModel.off("get.channel.config.success");
                        this.mySetupSendWaitCustomizeModel.off("get.channel.config.error");
                    }
                },

                onGetApplicationType: function(data){
                    this.applicationType = data.applicationType.type
                    if (this.props.isCustom) {
                        this.mySetupSendWaitCustomizeModel.on("get.all.config.success", $.proxy(this.initSetup, this));
                        this.mySetupSendWaitCustomizeModel.on("get.all.config.error", $.proxy(this.onGetError, this));
                        this.mySetupSendWaitCustomizeModel.getAllConfig({
                            domain: this.props.domain,
                            version: this.props.version || this.props.domainVersion,
                            manuallyModifed: true,
                            applicationType: this.applicationType
                        })
                    } else {
                        this.initSetup(data);
                    }
                },

                getInitialState: function () {
                    var defaultState = {
                        activeKeys: [],
                        activeKeysDiff: [],
                        levelGroup: [], 
                        isLoading: true,
                        editClassName: this.props.panelClassName || "col-md-offset-2 col-md-8",
                        diffClassName: "",
                        isDiffLoading: false,
                        diffInfo: []
                    }

                    if (this.props.type === 3) {
                        defaultState.isLoading = false;
                        defaultState.isDiffLoading = true;
                        defaultState.editClassName = "";
                        defaultState.diffClassName = this.props.panelClassName || "col-md-offset-2 col-md-8";
                    }
                    return defaultState;
                },

                sortData: function(data){
                    var fileList = [], topologyLevelArray = [];
                    _.each(data, function(el, key, ls){
                        if (key !== "applicationType"){
                            _.each(el, function(fileObj, index, list){
                                if (!fileObj) return;
                                fileObj.fileType = key;
                                fileObj.luaOnly === undefined ? fileObj.luaOnly = true : "";
                                fileObj.id ? "" : fileObj.id = Utility.randomStr(8);
                                fileList.push(fileObj)
                                topologyLevelArray.push(fileObj.topologyLevel)
                            }.bind(this))
                        }
                    }.bind(this))
                    topologyLevelArray = _.uniq(topologyLevelArray);
                    var levelGroup = [], topologyLevelName = ["", "上层配置", "下层配置", "中层配置"];
                    _.each(topologyLevelArray, function(el, index){
                        var fileArray =_.filter(fileList, function(obj){
                            return obj.topologyLevel === el
                        })
                        levelGroup.push({
                            topologyLevel: el,
                            topologyLevelName: topologyLevelName[el],
                            fileArray: fileArray,
                            activeKey: randomStr + "_0_0_" + fileArray[0].id,
                        })
                    }.bind(this))

                    return levelGroup;             
                },

                initSetup: function(data){
                    var levelGroup = this.sortData(data)
                    var tempArray = _.map(levelGroup, function(el){
                        return el.activeKey
                    })
                    this.setState({ 
                        levelGroup: levelGroup, 
                        isLoading: false,
                        activeKeys: tempArray
                    });

                    this.props.onChangeTextarea&&this.props.onChangeTextarea(levelGroup)
                },

                onClickDiff: function(){
                    var props = this.props;

                    var postParam = {
                        domain: this.props.domain,
                        v1: this.props.version,
                        newContent: []
                    }
                    _.each(this.state.levelGroup, function(levelGroup){
                        _.each(levelGroup.fileArray, function(fileObj){
                            postParam.newContent.push({
                                topologyLevel: levelGroup.topologyLevel,
                                content: fileObj.content
                            })
                        }.bind(this))
                    }.bind(this))

                    this.getCollection().editCompare(postParam)
                    this.setState({ 
                        isDiffLoading: true,
                        editClassName: "col-md-6",
                        diffClassName: "col-md-6"
                    });
                },

                onGetError: function(error){
                    if (error && error.message)
                        Utility.alerts(error.message);
                    else
                        Utility.alerts("网络阻塞，请刷新重试！");
                },

                onGetDiff: function(data){
                    var diffInfo = this.sortData(data);
                    var tempArray = _.map(diffInfo, function(el){
                        return el.activeKey
                    })
                    this.setState({ 
                        diffInfo: diffInfo, 
                        isDiffLoading: false,
                        activeKeysDiff: tempArray
                    });
                },

                onChangeTextarea: function(event){
                    var indexArray = event.target.id.split("_"),
                        groupIndex = indexArray[1],
                        fileIndex = indexArray[2],
                        fileId = indexArray[3];
                    var levelGroup = this.state.levelGroup;
                    var fileObj = levelGroup[groupIndex].fileArray[fileIndex];

                    if (fileObj.id == fileId) {
                        levelGroup[groupIndex].fileArray[fileIndex].content = event.target.value;
                        this.setState({ 
                            levelGroup: levelGroup
                        });
                        this.props.onChangeTextarea&&this.props.onChangeTextarea(levelGroup)
                    }
                },

                handleDiffSelect: function(activeKey) {
                    var index = activeKey.split("_")[1];
                    if (this.state.activeKeysDiff[index] === activeKey) {
                        this.state.activeKeysDiff[index] = ""
                    } else {
                        this.state.activeKeysDiff[index] = activeKey;
                    }

                    this.setState({ activeKeysDiff: this.state.activeKeysDiff });
                },

                handleSelect: function(activeKey) {
                    var index = activeKey.split("_")[1];
                    if (this.state.activeKeys[index] === activeKey) {
                        this.state.activeKeys[index] = ""
                    } else {
                        this.state.activeKeys[index] = activeKey;
                    }

                    this.setState({ activeKeys: this.state.activeKeys });
                },

                onClickBack: function(){
                    this.props.onClickBackCallback&&this.props.onClickBackCallback()
                },

                onClickPublish: function(){
                    var postParam = {
                        domain: this.props.domain,
                        originId: this.props.originId,
                        domainVersion: this.props.version,
                        platformId:this.applicationType,
                        configs: []
                    }
                    _.each(this.state.levelGroup, function(levelGroup){
                        _.each(levelGroup.fileArray, function(fileObj){
                            postParam.configs.push({
                                topologyLevel: levelGroup.topologyLevel,
                                content: fileObj.content
                            })
                        }.bind(this))
                    }.bind(this))

                    this.getCollection().publishandsaveconfig(postParam)
                },

                onGetPublishSuccess: function(){
                    Utility.alerts("操作成功！", 'success');
                },

                getViewFromData: function(data, isDiff){
                    var view = _.map(data, function(group, index){
                        var myPanels = _.map(group.fileArray, function(fileObj, inx){
                                var eventKey = randomStr + "_" + index + "_" +inx + "_" + fileObj.id,
                                    fileContent = <pre><code>{fileObj.content || ""}</code></pre>,
                                    alertMessage = "：文件不包含全部配置，请下发nginx文件",
                                    headerStr = fileObj.fileType;
                                    if (!fileObj.luaOnly) headerStr = headerStr + alertMessage;

                                if (this.props.type === 2) {
                                    fileContent = (
                                        <FormControl 
                                            componentClass="textarea" value={fileObj.content || ""} 
                                            rows="10" id={eventKey} onChange={this.onChangeTextarea}/>
                                    )
                                }

                                return (
                                    <Panel key={inx}
                                    header={headerStr} 
                                    eventKey={eventKey} 
                                    id={eventKey}>{fileContent}</Panel>
                                )
                        }.bind(this))

                        return (
                            <Panel key={index} header={group.topologyLevelName} bsStyle="primary">
                                <PanelGroup 
                                    id={randomStr + index} 
                                    activeKey={this.state.activeKeys[index]} 
                                    onSelect={this.handleSelect} 
                                    accordion={true}>{myPanels}</PanelGroup>
                            </Panel>
                        )
                    }.bind(this));

                    return view;
                },

                getViewFromDiffData: function(data){
                    var view = _.map(data, function(group, index){
                        var myPanels = _.map(group.fileArray, function(fileObj, inx){
                                var eventKey = randomStr + "_" + index + "_" +inx + "_" + fileObj.id,
                                    fileContent = <pre><code>{fileObj.content || ""}</code></pre>,
                                    //alertMessage = "：文件不包含全部配置，请下发nginx文件",
                                    headerStr = fileObj.fileType;
                                    //if (!fileObj.luaOnly) headerStr = headerStr + alertMessage;

                                return (
                                    <Panel key={inx}
                                    header={headerStr} 
                                    eventKey={eventKey} 
                                    id={eventKey}>{fileContent}</Panel>
                                )
                        }.bind(this))

                        return (
                            <Panel key={index} header={group.topologyLevelName} bsStyle="info">
                                <PanelGroup 
                                    id={randomStr + index} 
                                    activeKey={this.state.activeKeysDiff[index]} 
                                    onSelect={this.handleDiffSelect} 
                                    accordion={true}>{myPanels}</PanelGroup>
                            </Panel>
                        )
                    }.bind(this));

                    return view;
                },

                render: function() {
                    var myAccordions = null,
                        diffContent = null,
                        editButtons = [], optButtons = null;

                    if (this.state.isLoading) {
                        myAccordions = <ReactLoading />
                    } else {
                        myAccordions = this.getViewFromData(this.state.levelGroup)
                    }

                    if (this.state.isDiffLoading) {
                        diffContent = <ReactLoading />
                    } else {
                        diffContent = this.getViewFromDiffData(this.state.diffInfo)
                    }

                    if (this.props.type === 2) {
                        editButtons = [
                            <Button key={1} bsStyle="success" onClick={this.onClickDiff}>查看DIFF</Button>,
                            <Button key={2} bsStyle="primary" onClick={this.onClickPublish}>发布</Button>
                        ]                
                    }

                    if (this.props.isShowOpt) {
                        optButtons = (
                            <div>
                                <ButtonToolbar>
                                    <Button bsStyle="default" onClick={this.onClickBack}>返回</Button>
                                    {editButtons}
                                </ButtonToolbar>
                                <hr />
                            </div>
                        )
                    }

                    var reactConfigPanel = (
                            <div>
                                <h4>{this.props.headerStr}<small>/{this.props.version}</small></h4>
                                <Well className="row">
                                    {optButtons}
                                    
                                    <div className={this.state.editClassName}>
                                        {myAccordions}
                                    </div>
                                    <div className={this.state.diffClassName}>
                                        {diffContent}
                                    </div>
                                </Well>
                            </div>
                        );
                    return reactConfigPanel
                }
        });

        return ReactConfigPanel;
    });