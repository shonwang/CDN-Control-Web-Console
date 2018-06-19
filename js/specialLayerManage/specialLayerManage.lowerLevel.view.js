define("specialLayerManage.lowerLevel.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

        var DistributeLowerLevelView = Backbone.View.extend({
            events: {},
    
            initialize: function(options){
                this.options = options;
                this.collection = options.collection;
                this.dataParam = _.pairs(options.dataParam);
                this.$el = $(_.template(template['tpl/specialLayerManage/specialLayerManage.distributeLowerLevel.html'])({}));
                this.collection.on("get.layerInfo.success", $.proxy(this.onGetlayerInfoSuccess,this));
                this.collection.on("get.ruleConfirmInfo.success", $.proxy(this.onGetRuleConfirmInfoSuccess,this));
                this.collection.on("get.ruleConfirmInfo.error", $.proxy(this.onGetRuleConfirmInfoError,this));
                this.dataList = [];
                
            },

            onGetRuleConfirmInfoSuccess: function(data, id){
                var idStr = "tr[data-id="+id+"]";
                var idStrCheckbox = idStr+" input";
                var itemList = "<td class='text-success'>下发成功      <small>"+data.message+"</small></td>"
                this.$el.find(idStrCheckbox).hide()
                this.$el.find(idStr).append(itemList)
            },

            onGetRuleConfirmInfoError: function(data, id){
                var idStr = "tr[data-id="+id+"]";
                var idStrCheckbox = idStr+" input";
                var itemList = "<td class='text-danger'>下发失败      <small>"+data.message+"</small></td>";
                this.$el.find(idStrCheckbox).hide()
                this.$el.find(idStr).append(itemList)
            },
    
            onGetlayerInfoSuccess: function(data){
                if(data.length === 0) return;
                this.dataList.push(data)
                for(var item in data[0]){
                    var tempList = {
                        value: item,
                        name: data[0][item]
                    }
                    var itemList = "<tr data-id='"+ tempList.value +
                                    "'><td><input type='checkbox' checked='checked' id='"+tempList.value+
                                    "'></td><td>"+tempList.name+"</td></tr>";
                    this.$el.find("tbody").append(itemList)
                }
                if(this.dataList.length === this.dataParam.length){
                    this.getArgs();
                    this.collection.trigger("set.dataItem.success")
                }
            },
    
            getArgs:function(){
                this.lowerLevel = [];
                _.each(this.dataParam, function(el){
                    var args = {
                        comment: el[1].type,
                        ruleId: el[1].id
                    }
                    this.lowerLevel.push(args)
                }.bind(this))
                return this.lowerLevel
            },
            
            render: function(target) {
                this.$el.appendTo(target);
            },
    
        });

    return DistributeLowerLevelView;
});
    
