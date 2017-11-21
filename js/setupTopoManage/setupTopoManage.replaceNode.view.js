define("setupTopoManage.replaceNode.view", ['require', 'exports', 'template', 'modal.view', 'utility'],
    function(require, exports, template, Modal, Utility) {

        var ReplaceNodeView = Backbone.View.extend({

            events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/setupTopoManage/setupTopoManage.replace&deleteNode.html'])({

            }));
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));
            this.onGetAllOriginNodes();
            this.onGetAllReplaceNodes();
            this.$el.find(".originBox .select-value-layer").find("li div").on("click", $.proxy(this.initItemRule, this));
            this.$el.find(".originBox .select-value-layer").find("li div").on("click", $.proxy(this.initRuleTable, this));
            this.allRule={
                isChecked:false
            };
            this.itemRule=[];
        },
        
        initItemRule:function(data){
          var num=5;
          this.allRule={
                isChecked:false
            }
          for(var i=0;i<num;i++){
              this.itemRule[i]={
                isChecked:false
              }
          }
        },

        initRuleTable: function() {
            this.ruleList = [{
                id: 101,
                local: [{
                    id: 1,
                    name: '联通'
                }],
                upper: [{
                    chiefType: 1,
                    id: 63,
                    name: '北京教育网'
                }]
            }, {
                id: 102,
                local: [{
                    id: 2,
                    name: '电信'
                }],
                upper: [{
                    chiefType: 1,
                    id: 63,
                    name: '北京教育网2'
                }]
            }, {
                id: 104,
                local: [{
                    id: 5,
                    name: '鹏博士'
                }],
                upper: [{
                    chiefType: 1,
                    id: 64,
                    name: '北京多线02节点电信'
                }, {
                    chiefType: 1,
                    id: 65,
                    name: '北京多线02节点联通'
                }, {
                    chiefType: 0,
                    id: 66,
                    name: '北京多线02节点铁通'
                }]
            },{
                id: 105,
                local: [{
                    id: 6,
                    name: '上海鹏博士01点播中层节点'
                }],
                upper: [{
                    chiefType: 1,
                    id: 64,
                    name: '北京多线02节点电信'
                }, {
                    chiefType: 1,
                    id: 65,
                    name: '北京多线02节点联通'
                }]
            },{
                id: 106,
                local: [{
                    id: 7,
                    name: '华数'
                }],
                upper: [{
                    chiefType: 1,
                    id: 64,
                    name: '北京多线02节点电信'
                }]
            }];
      
            this.table = $(_.template(template['tpl/setupTopoManage/setupTopoManage.replace.table.html'])({
                data: this.ruleList,
                allRule:this.allRule,
                itemRule:this.itemRule
            }));      
            if (this.ruleList.length !== 0) {
                this.$el.find(".table-ctn").html(this.table[0]);
            } else {
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty-2.html'])({
                    data: {
                        message: "暂无数据"
                    }
                }));
            }
            this.table.find("thead th").find("input").on("click", $.proxy(this.onClickSelectAllRule ,this));
            this.table.find("tbody th").find("input").on("click", $.proxy(this.onClickSelectItemRule ,this));
        },        

        onClickSelectAllRule: function(event) {
             var eventTarget = event.srcElement || event.target;
             if(eventTarget.tagName!=="INPUT") return;
             this.allRule.isChecked=eventTarget.checked;
             _.each(this.itemRule ,function(el){
                  el.isChecked=eventTarget.checked;
             }.bind(this))
             this.initRuleTable();
        },
        
        onClickSelectItemRule:function() {
           var eventTarget=event.srcElement || event.target;
           if(eventTarget.tagName!=="INPUT") return;
           var id=$(eventTarget).attr("id");
           _.each(this.itemRule ,function(item,index,list){
               if(index==id) item.isChecked=eventTarget.checked;
           }.bind(this))
           var i;
           for(i=0;i<this.itemRule.length;i++){
            if(!this.itemRule[i].isChecked) {
                    this.allRule.isChecked=false;
                    break;
              }           
           }
           if(i==this.itemRule.length) this.allRule.isChecked=true;
           this.initRuleTable();
        },

        onGetAllOriginNodes: function() {
            /*var nameList = [];
            _.each(list, function(el, inx, list) {
                nameList.push({
                    name: el.name,
                    value: el.id
                })
            }.bind(this))*/
            this.nameList = [{
                name: '庆云移动11节点',
                id: 101
            }, {
                name: '深圳鹏博士01节点',
                id: 102
            }, {
                name: '盐城电信02节点',
                id: 103
            }, {
                name: '盐城电信03节点',
                id: 104
            }]

            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-originNode').get(0),
                panelID: this.$el.find('#dropdown-originNode').get(0),
                isSingle: true,
                openSearch: true,
                selectWidth: 200,
                isDataVisible: false,
                onOk: function() {},
                data: this.nameList,
                callback: function(data) {
                    this.$el.find('#dropdown-originNode .cur-value').html(data.name);
                    //  this.collection.getAllCityAndBigArea({
                    //    provId: data.value
                    //})
                }.bind(this)
            });
            this.$el.find("#dropdown-originNode .cur-value").html(this.nameList[0].name);
        },
        onGetAllReplaceNodes: function() {
            /*var nameList = [];
            _.each(list, function(el, inx, list) {
                nameList.push({
                    name: el.name,
                    value: el.id
                })
            }.bind(this))*/
            this.nameList = [{
                name: '庆云移动11节点',
                id: 101
            }, {
                name: '深圳鹏博士01节点',
                id: 102
            }, {
                name: '盐城电信02节点',
                id: 103
            }, {
                name: '盐城电信03节点',
                id: 103
            }]

            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-replaceNode').get(0),
                panelID: this.$el.find('#dropdown-replaceNode').get(0),
                isSingle: true,
                openSearch: true,
                selectWidth: 200,
                isDataVisible: false,
                bottom:40,
                onOk: function() {},
                data: this.nameList,
                callback: function(data) {
                    this.$el.find('#dropdown-replaceNode .cur-value').html(data.name);
                    //  this.collection.getAllCityAndBigArea({
                    //    provId: data.value
                    //})
                }.bind(this)
            });
            this.$el.find("#dropdown-replaceNode .cur-value").html(this.nameList[0].name);
        },

       
      /* onClickSelectItemRule: function(event) {
             var eventTarget = event.srcElement || event.target;
             if(eventTarget.tagName!=="INPUT") return;
             var inputCheck=$(eventTarget).attr("checked");
             var chiefInput=this.$el.find("table thead").find("input");
             var itemInput=this.$el.find("table tbody").find("input");
             if(inputCheck){
                $(eventTarget).removeAttr("checked");
                chiefInput.removeAttr("checked");
             }else{
                $(eventTarget).attr("checked","true");
                for(var i=0;i<itemInput.length;i++){
                    if(!itemInput.eq(i).attr("checked")){
                        return;
                    }else{
                       chiefInput.prop("checked","true");
                       chiefInput.attr("checked","true");
                    }
                }
             }

       },*/

        onClickCancelButton: function() {
            this.options.onCancelCallback && this.options.onCancelCallback();
        },

        render: function(target) {
            this.$el.appendTo(target);
        }

      });
        return ReplaceNodeView;
});