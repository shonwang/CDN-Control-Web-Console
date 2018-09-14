define("routes.logManage", ['require', 'exports'], 
    function(require, exports) {
        var RouterLogManage = {

            logTemplateManage: function() {
                require(['logTemplateManage.view', 'logTemplateManage.model'], function(LogTemplateManageView, LogTemplateManageModel) {
                    this.curPage = 'logTemplateManage';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.logTemplateManageModel)
                        this.logTemplateManageModel = new LogTemplateManageModel();
                    if (!this.logTemplateManageView) {
                        var options = {
                            collection: this.logTemplateManageModel
                        };
                        this.logTemplateManageView = new LogTemplateManageView(options);
                        this.logTemplateManageView.render($('.ksc-content'));
                    } else {
                        this.logTemplateManageView.update($('.ksc-content'));
                    }
                    this.curView = this.logTemplateManageView;
                }.bind(this));
            },

            logTaskList: function() {
                require(['logTaskList.view', 'logTaskList.model'], function(LogTaskListView, LogTaskListModel) {
                    this.curPage = 'logTaskList';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.logTaskListModel)
                        this.logTaskListModel = new LogTaskListModel();
                    if (!this.logTaskListView) {
                        var options = {
                            collection: this.logTaskListModel
                        };
                        this.logTaskListView = new LogTaskListView(options);
                        this.logTaskListView.render($('.ksc-content'));
                    } else {
                        this.logTaskListView.update($('.ksc-content'));
                    }
                    this.curView = this.logTaskListView;
                }.bind(this));
            },

            logTaskStatistics: function() {
                require(['logTaskStatistics.view', 'logTaskStatistics.model'], function(LogTaskStatisticsView, LogTaskStatisticsModel) {
                    this.curPage = 'logTaskStatistics';
                    this.navbarView.select(this.curPage, $.proxy(this.removeSubSideBar, this));
                    if (!this.logTaskStatisticsModel)
                        this.logTaskStatisticsModel = new LogTaskStatisticsModel();
                    if (!this.logTaskStatisticsView) {
                        var options = {
                            collection: this.logTaskStatisticsModel
                        };
                        this.logTaskStatisticsView = new LogTaskStatisticsView(options);
                        this.logTaskStatisticsView.render($('.ksc-content'));
                    } else {
                        this.logTaskStatisticsView.update($('.ksc-content'));
                    }
                    this.curView = this.logTaskStatisticsView;
                }.bind(this));
            },

        }

        return RouterLogManage
    }
);