define("react.config.panel", ['require', 'exports', 'utility'],
    function(require, exports, Utility) {
        var Accordion = ReactBootstrap.Accordion,
            Panel = ReactBootstrap.Panel,
            Button = ReactBootstrap.Button,
            Well = ReactBootstrap.Well;

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
                return { levelGroup: []};
            },

            initSetup: function(data){
                var fileList = [], topologyLevelArray = [];
                _.each(data, function(el, key, ls){
                    if (key !== "applicationType"){
                        _.each(el, function(fileObj, index, list){
                            if (!fileObj) return;
                            fileObj.fileType = key
                            fileList.push(fileObj)
                            topologyLevelArray.push(fileObj.topologyLevel)
                        }.bind(this))
                    }
                }.bind(this))
                topologyLevelArray = _.uniq(topologyLevelArray);
                console.log(fileList);
                console.log(topologyLevelArray);
                var levelGroup = [], topologyLevelName = ["", "上层配置", "下层配置", "中层配置"];
                _.each(topologyLevelArray, function(el, index){
                    var fileArray =_.filter(fileList, function(obj){
                        return obj.topologyLevel === el
                    })
                    levelGroup.push({
                        topologyLevelName: topologyLevelName[el],
                        fileArray: fileArray
                    })
                }.bind(this))
                console.log(levelGroup)
                this.setState({ levelGroup: levelGroup });
            },

            onClickBack: function(){
                this.props.onClickBackCallback&&this.props.onClickBackCallback()
            },

            render: function() {
                var randomStr = Utility.randomStr(8)
                var myAccordions = _.map(this.state.levelGroup, function(group, index){
                    var myPanels = _.map(group.fileArray, function(fileObj, inx){
                            var eventKey = randomStr + "_" + index + "_" +inx + "_" + fileObj.id
                            return (
                                React.createElement(Panel, {key: inx, 
                                header: fileObj.fileType, 
                                eventKey: eventKey, 
                                id: eventKey}, fileObj.content)
                        )
                    }.bind(this))
                    return (
                        React.createElement(Panel, {key: index, header: group.topologyLevelName, bsStyle: "primary"}, 
                            React.createElement(Accordion, {id: randomStr + index}, myPanels)
                        )
                    )
                }.bind(this))

                var reactConfigPanel = (
                        React.createElement("div", null, 
                            React.createElement("h4", null, "配置文件", React.createElement("small", null, "/", this.props.version)), 
                            React.createElement(Well, null, 
                                React.createElement(Button, {bsStyle: "default", onClick: this.onClickBack}, "返回"), 
                                React.createElement("hr", null), 
                                myAccordions
                            )
                        )
                    );

                return reactConfigPanel

            }
        });

        return ReactConfigPanel;
    });