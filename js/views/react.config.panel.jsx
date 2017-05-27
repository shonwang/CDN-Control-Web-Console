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
                    var props = this.props;

                    require(['setupSendWaitCustomize.model'], function(SetupSendWaitCustomizeModel){
                        this.mySetupSendWaitCustomizeModel = new SetupSendWaitCustomizeModel();
                        this.mySetupSendWaitCustomizeModel.on("get.channel.config.success", $.proxy(this.onGetApplicationType, this));
                        this.mySetupSendWaitCustomizeModel.on("get.channel.config.error", $.proxy(this.onGetError, this));
                        this.mySetupSendWaitCustomizeModel.getChannelConfig({
                            domain: props.domain,
                            version: props.version || props.domainVersion
                        })
                    }.bind(this)); 
                },

                componentWillUnmount: function() {
                    console.log("componentWillUnmount!!!!!!!")
                    this.mySetupSendWaitCustomizeModel.off("get.all.config.success");
                    this.mySetupSendWaitCustomizeModel.off("get.all.config.error");
                    this.mySetupSendWaitCustomizeModel.off("get.channel.config.success");
                    this.mySetupSendWaitCustomizeModel.off("get.channel.config.error");
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
                    return {
                        activeKeys: [], 
                        levelGroup: [], 
                        isLoading: true,
                        editClassName: "col-md-offset-2 col-md-8",
                        diffClassName: "",
                        isDiffLoading: false,
                        diffInfo: []
                    };
                },

                sortData: function(data){
                    var fileList = [], topologyLevelArray = [];
                    _.each(data, function(el, key, ls){
                        if (key !== "applicationType"){
                            _.each(el, function(fileObj, index, list){
                                if (!fileObj) return;
                                fileObj.fileType = key;
                                fileObj.luaOnly === undefined ? true : fileObj.luaOnly;
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
                },

                onClickDiff: function(){
                    var props = this.props;

                    require(['setupSendWaitCustomize.model'], function(SetupSendWaitCustomizeModel){
                        this.mySetupSendWaitCustomizeModel = new SetupSendWaitCustomizeModel();
                        this.mySetupSendWaitCustomizeModel.on("get.channel.config.success", $.proxy(this.onGetDiff, this));
                        this.mySetupSendWaitCustomizeModel.on("get.channel.config.error", $.proxy(this.onGetError, this));
                        this.mySetupSendWaitCustomizeModel.getChannelConfig({
                            domain: props.domain,
                            version: props.version || props.domainVersion
                        })
                    }.bind(this)); 
                    this.setState({ 
                        isDiffLoading: true,
                        editClassName: "col-md-6",
                        diffClassName: "col-md-6"
                    });
                },

                onGetDiff: function(data){
                    var diffInfo = this.sortData(data)
                    this.setState({ 
                        diffInfo: diffInfo, 
                        isDiffLoading: false
                    });
                },

                onChangeTextarea: function(event){
                    var indexArray = event.target.id.split("_"),
                        groupIndex = indexArray[1],
                        fileIndex = indexArray[2],
                        fileId = parseInt(indexArray[3]);
                    var levelGroup = this.state.levelGroup;
                    var fileObj = levelGroup[groupIndex].fileArray[fileIndex];

                    if (fileObj.id === fileId) {
                        levelGroup[groupIndex].fileArray[fileIndex].content = event.target.value;
                        this.setState({ 
                            levelGroup: levelGroup
                        });
                    }
                },

                 handleSelect(activeKey) {
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

                getViewFromData: function(data, isDiff){
                    var view = _.map(data, function(group, index){
                        var myPanels = _.map(group.fileArray, function(fileObj, inx){
                                var eventKey = randomStr + "_" + index + "_" +inx + "_" + fileObj.id,
                                    fileContent = <pre><code>{fileObj.content || "无"}</code></pre>,
                                    alertMessage = "：文件不包含全部配置，请下发nginx文件",
                                    headerStr = fileObj.fileType;
                                    if (!fileObj.luaOnly) headerStr = headerStr + alertMessage;

                                if (this.props.isEdit && !isDiff) {
                                    fileContent = (
                                        <FormControl 
                                            componentClass="textarea" value={fileObj.content || "无"} 
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
                            <Panel key={index} header={group.topologyLevelName} bsStyle={!isDiff ? "primary" : "info"}>
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

                render: function() {
                    var myAccordions = null,
                        diffContent = null,
                        editButtons = [];

                    if (this.state.isLoading) {
                        myAccordions = <ReactLoading />
                    } else {
                        myAccordions = this.getViewFromData(this.state.levelGroup, false)
                    }

                    if (this.state.isDiffLoading) {
                        diffContent = <ReactLoading />
                    } else {
                        diffContent = this.getViewFromData(this.state.diffInfo, true)
                    }

                    if (this.props.isEdit) {
                        editButtons = [
                            <Button key={1} bsStyle="success" onClick={this.onClickDiff}>查看diff</Button>,
                            <Button key={2} bsStyle="primary" onClick={this.onClickBack}>发布</Button>
                        ]                
                    }

                    var reactConfigPanel = (
                            <div>
                                <h4>配置文件<small>/{this.props.version}</small></h4>
                                <Well className="row">
                                    <ButtonToolbar>
                                        <Button bsStyle="default" onClick={this.onClickBack}>返回</Button>
                                        {editButtons}
                                    </ButtonToolbar>
                                    <hr />
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