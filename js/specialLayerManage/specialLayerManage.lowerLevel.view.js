define("specialLayerManage.lowerLevel.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

        var DistributeLowerLevelView = Backbone.View.extend({
            events: {},
    
            initialize: function(options){
                console.log("加载了弹出框")
                this.options = options;
                this.collection = options.collection;
                this.dataParam = _.pairs(options.dataParam);
                this.type = options.type
                this.$el = $(_.template(template['tpl/specialLayerManage/specialLayerManage.distributeLowerLevel.html'])({}));
                this.collection.on("get.layerInfo.success", $.proxy(this.onGetlayerInfoSuccess,this));
                this.collection.on("get.layerInfo.error", $.proxy(this.onGetlayerInfoError,this));
                this.collection.on("get.ruleConfirmInfo.success", $.proxy(this.onGetRuleConfirmInfoSuccess,this));
                this.collection.on("get.ruleConfirmInfo.error", $.proxy(this.onGetRuleConfirmInfoError,this));
                this.collection.on("get.unchecked", $.proxy(this.onGetUncheckedItem,this));
                this.dataList = [];
                this.checkedItem = [];
                if(this.type === 1){
                    this.typeStr = "替换"
                }else if(this.type === 2){
                    this.typeStr = "删除"
                }
                _.each(this.dataParam, function(el){
                    console.log(el[1].isChecked)
                    this.checkedItem.push(el[1])
                }.bind(this))
            },

            onGetUncheckedItem: function(){
                this.$el.find("tr[data-id] input").hide();
            },

            onGetRuleConfirmInfoSuccess: function(data, id){
                var idStr = "tr[data-id="+id+"]";
                var idStrCheckbox = idStr+" input";
                var itemList = "<td class='text-success'>下发成功</td>";
                // var messageList = "<tr><td colspan='3'><small>"+data.message+"</small></td></tr>";
                this.$el.find(idStrCheckbox).hide()
                this.$el.find(idStr).append(itemList)
            },

            onGetRuleConfirmInfoError: function(data, id){
                var idStr = "tr[data-id="+id+"]";
                var idStrCheckbox = idStr+" input";
                var itemList = "<td class='text-danger'>下发失败</td>";
                var messageList = "<tr><td colspan='3'><small>"+data.message+"</small></td></tr>";
                this.$el.find(idStrCheckbox).hide()
                this.$el.find(idStr).append(itemList).after(messageList)
            },
    
            onGetlayerInfoSuccess: function(data, id){
                if(data.length === 0) return;
                this.dataList.push(data)
                console.log(data, id)
                _.each(this.checkedItem, function(el){
                    if(el.id === id){
                        el.isHited = true
                    }
                }.bind(this))
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
                this.$el.find("tr[data-id] input").on("click", $.proxy(this.onItemCheckedUpdated, this));
                if(this.dataList.length === this.dataParam.length){
                    this.collection.trigger("set.dataItem")
                }
            },

            onGetlayerInfoError:function(data,id, name){
                console.log("触发失败")
                console.log(name)
                if(data.length === 0) return;
                this.dataList.push(data)
                _.each(this.checkedItem, function(el){
                    if(el.id === id){
                        el.isHited = false
                    }
                }.bind(this))
                var itemList = "<tr data-id='"+id+"'><td><span class='glyphicon glyphicon-remove' id='"+id+"'></span></td><td>"+name+"</td><td class='text-danger'>"+this.typeStr+"失败</td></tr>"+"<tr><td colspan='3'><small>"+data.message+"</small></td></tr>";
                this.$el.find("tbody").append(itemList);
                if(this.dataList.length === this.dataParam.length){
                    this.collection.trigger("set.dataItem")
                }
            },

            onItemCheckedUpdated: function(event){
                var eventTarget = event.srcElement || event.target;
                if (eventTarget.tagName !== "INPUT") return;
                var id = $(eventTarget).attr("id");
                var selectedObj = _.find(this.checkedItem, function(object){
                    return object.id === parseInt(id)
                }.bind(this));
                selectedObj.isChecked = eventTarget.checked
                selectedObj.isHited = eventTarget.checked
                var checkedList = this.checkedItem.filter(function(object) {
                    return object.isHited === true;
                })
            },
    
            getArgs:function(){
                var num = 0;
                this.lowerLevel = [];
                console.log(this.checkedItem)
                _.each(this.checkedItem, function(el){
                    if(el.isHited === true){
                        num += 1;
                        var args = {
                            comment: el.type,
                            ruleId: el.id
                        }
                        this.lowerLevel.push(args)
                    } 
                }.bind(this))
                return [this.lowerLevel, num]
            },
            
            render: function(target) {
                this.$el.appendTo(target);
            },
    
        });

    return DistributeLowerLevelView;
});
    
