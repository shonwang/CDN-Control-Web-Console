define("grayscaleSetup.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var AddOrEditView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.model = options.model;
            this.isEdit = options.isEdit;
            this.businessTypeList = options.businessTypeList;

            if(this.isEdit){
                this.args = {
                    id : this.model.get("id"),
                    domain : this.model.get("domain"),
                    bisTypeId : this.model.get("bisTypeId"),
                    nodeId : [this.model.get("nodeId")],
                    confFile : []
                }
            }else{
                this.args = {
                    domain : "",
                    bisTypeId : this.businessTypeList[0].value,
                    nodeId : [],
                    confFile : []
                }
            }
            this.$el = $(_.template(template['tpl/grayscaleSetup/grayscaleSetup.add&edit.html'])({data:this.args}));

            this.collection.off("get.nodeGroupTree.success");
            this.collection.off("get.nodeGroupTree.error");
            this.collection.on("get.nodeGroupTree.success", $.proxy(this.initTree, this));
            this.collection.on("get.nodeGroupTree.error", $.proxy(this.onGetError, this));
           // this.initTree();

            this.collection.off("get.confContent.success");
            this.collection.off("get.confContent.error");
            this.collection.on("get.confContent.success",$.proxy(this.showConfContent,this));
            this.collection.on("get.confContent.error",$.proxy(this.onGetConfContentError,this));
          //  this.showConfContent();
            this.initDropMenu();

            this.TypeList = this.$el.find('dropdown-menu li');


        },

        arrIndexOf: function(arr,val){
            for (var i = 0; i < arr.length; i++) {
                if (_.isEqual(arr[i],val)) return i;
            }
            return -1;
        },

        arrRemove: function(arr,val){
            var index = this.arrIndexOf(arr,val);
            if (index > -1) {
                arr.splice(index, 1);
            }
        },

        onGetError: function(error) {
            if (error && error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        initTree: function(res){
            var zNodes = res;
            //var zNodes = [{"id":60,"pId":0,"confFileList":[{"content":"","id":237,"name":"/etc/kscdn-live-tengine/node.conf"},{"content":"","id":238,"name":"/usr/local/squid/etc/domain.conf"},{"content":"","id":239,"name":"/usr/local/squid/etc/origdomain.conf"},{"content":"","id":240,"name":"/usr/local/tengine/conf/lua.conf"},{"content":"","id":241,"name":"/usr/local/tengine_relay/conf/lua.conf"}],"name":"下层[默认]鹏博士节点组"},{"id":89,"pId":60,"name":"广州鹏博士节点"},{"id":116,"pId":60,"name":"武汉鹏博士节点"},{"id":138,"pId":60,"name":"北京鹏博士01节点"},{"id":146,"pId":60,"name":"上海鹏博士02节点"},{"id":59,"pId":0,"confFileList":[{"content":"","id":232,"name":"/etc/kscdn-live-tengine/node.conf"},{"content":"","id":233,"name":"/usr/local/squid/etc/domain.conf"},{"content":"","id":234,"name":"/usr/local/squid/etc/origdomain.conf"},{"content":"","id":235,"name":"/usr/local/tengine/conf/lua.conf"},{"content":"","id":236,"name":"/usr/local/tengine_relay/conf/lua.conf"}],"name":"下层[默认]铁通节点组"},{"id":46,"pId":59,"name":"北京铁通节点"},{"id":92,"pId":59,"name":"武汉铁通节点"},{"id":56,"pId":0,"confFileList":[{"content":"","id":217,"name":"/etc/kscdn-live-tengine/node.conf"},{"content":"","id":218,"name":"/usr/local/squid/etc/domain.conf"},{"content":"","id":219,"name":"/usr/local/squid/etc/origdomain.conf"},{"content":"","id":220,"name":"/usr/local/tengine/conf/lua.conf"},{"content":"","id":221,"name":"/usr/local/tengine_relay/conf/lua.conf"}],"name":"下层[默认]联通节点组"},{"id":2,"pId":56,"name":"扬州联通节点"},{"id":5,"pId":56,"name":"郑州联通节点"},{"id":7,"pId":56,"name":"济南联通节点"},{"id":8,"pId":56,"name":"天津联通节点"},{"id":11,"pId":56,"name":"石家庄联通节点"},{"id":16,"pId":56,"name":"哈尔滨联通节点"},{"id":19,"pId":56,"name":"沈阳联通节点"},{"id":21,"pId":56,"name":"扬州02联通节点"},{"id":22,"pId":56,"name":"东莞联通01节点"},{"id":23,"pId":56,"name":"西安联通节点"},{"id":25,"pId":56,"name":"福州联通节点"},{"id":30,"pId":56,"name":"太原联通节点"},{"id":32,"pId":56,"name":"苏州联通节点"},{"id":45,"pId":56,"name":"绵阳联通节点"},{"id":50,"pId":56,"name":"武汉联通节点"},{"id":51,"pId":56,"name":"呼和浩特联通节点"},{"id":53,"pId":56,"name":"伊春联通节点"},{"id":54,"pId":56,"name":"泰安联通节点"},{"id":55,"pId":56,"name":"温州联通节点"},{"id":61,"pId":56,"name":"保定联通节点"},{"id":62,"pId":56,"name":"济源联通节点"},{"id":68,"pId":56,"name":"衡水联通节点"},{"id":70,"pId":56,"name":"临汾联通节点"},{"id":82,"pId":56,"name":"中山联通节点"},{"id":97,"pId":56,"name":"烟台联通节点"},{"id":98,"pId":56,"name":"吉林联通节点"},{"id":99,"pId":56,"name":"白城联通节点"},{"id":103,"pId":56,"name":"延吉联通节点"},{"id":106,"pId":56,"name":"南昌联通节点"},{"id":112,"pId":56,"name":"朝阳联通节点"},{"id":113,"pId":56,"name":"运城联通节点"},{"id":115,"pId":56,"name":"长治联通节点"},{"id":124,"pId":56,"name":"呼和浩特联通02节点"},{"id":125,"pId":56,"name":"昆明联通节点"},{"id":126,"pId":56,"name":"沧州联通节点"},{"id":127,"pId":56,"name":"绥化联通01节点"},{"id":128,"pId":56,"name":"南宁联通01节点"},{"id":130,"pId":56,"name":"娄底联通01节点"},{"id":134,"pId":56,"name":"岳阳联通01节点"},{"id":63,"pId":0,"confFileList":[{"content":"","id":252,"name":"/etc/kscdn-live-tengine/node.conf"},{"content":"","id":253,"name":"/usr/local/squid/etc/domain.conf"},{"content":"","id":254,"name":"/usr/local/squid/etc/origdomain.conf"},{"content":"","id":255,"name":"/usr/local/tengine/conf/lua.conf"},{"content":"","id":256,"name":"/usr/local/tengine_relay/conf/lua.conf"}],"name":"下层[默认]移动节点组"},{"id":6,"pId":63,"name":"南昌移动节点"},{"id":14,"pId":63,"name":"天津移动节点"},{"id":17,"pId":63,"name":"广州移动节点"},{"id":24,"pId":63,"name":"无锡移动节点"},{"id":33,"pId":63,"name":"成都移动节点"},{"id":34,"pId":63,"name":"郑州移动节点"},{"id":38,"pId":63,"name":"杭州移动节点"},{"id":49,"pId":63,"name":"哈尔滨移动节点"},{"id":52,"pId":63,"name":"苏州移动节点"},{"id":59,"pId":63,"name":"石家庄移动节点"},{"id":60,"pId":63,"name":"合肥移动节点"},{"id":67,"pId":63,"name":"武汉移动节点"},{"id":72,"pId":63,"name":"昆明移动节点"},{"id":75,"pId":63,"name":"长沙移动节点"},{"id":78,"pId":63,"name":"重庆移动节点"},{"id":85,"pId":63,"name":"西安移动节点"},{"id":87,"pId":63,"name":"大连移动节点"},{"id":131,"pId":63,"name":"南宁移动01节点"},{"id":140,"pId":63,"name":"乌鲁木齐移动01节点"},{"id":142,"pId":63,"name":"绵阳移动01节点"},{"id":149,"pId":63,"name":"郑州移动02节点"},{"id":157,"pId":63,"name":"合肥移动02节点"},{"id":160,"pId":63,"name":"青岛移动01节点"},{"id":161,"pId":63,"name":"深圳移动01节点"},{"id":162,"pId":63,"name":"石家庄移动02节点"},{"id":57,"pId":0,"confFileList":[{"content":"","id":222,"name":"/etc/kscdn-live-tengine/node.conf"},{"content":"","id":223,"name":"/usr/local/squid/etc/domain.conf"},{"content":"","id":224,"name":"/usr/local/squid/etc/origdomain.conf"},{"content":"","id":225,"name":"/usr/local/tengine/conf/lua.conf"},{"content":"","id":226,"name":"/usr/local/tengine_relay/conf/lua.conf"}],"name":"下层[默认]电信节点组"},{"id":1,"pId":57,"name":"扬州电信节点"},{"id":9,"pId":57,"name":"惠州电信节点"},{"id":10,"pId":57,"name":"天津电信节点"},{"id":12,"pId":57,"name":"襄阳电信节点"},{"id":13,"pId":57,"name":"德阳电信节点"},{"id":15,"pId":57,"name":"兰州电信节点"},{"id":18,"pId":57,"name":"中山电信节点"},{"id":20,"pId":57,"name":"扬州02电信节点"},{"id":26,"pId":57,"name":"无锡电信节点"},{"id":27,"pId":57,"name":"佛山电信节点"},{"id":29,"pId":57,"name":"温州电信节点"},{"id":31,"pId":57,"name":"重庆电信节点"},{"id":35,"pId":57,"name":"西安电信节点"},{"id":36,"pId":57,"name":"青岛电信节点"},{"id":37,"pId":57,"name":"长沙电信节点"},{"id":39,"pId":57,"name":"上饶电信节点"},{"id":40,"pId":57,"name":"南宁电信节点"},{"id":41,"pId":57,"name":"厦门电信节点"},{"id":42,"pId":57,"name":"湖州电信节点"},{"id":44,"pId":57,"name":"洛阳电信节点"},{"id":47,"pId":57,"name":"大连电信节点"},{"id":56,"pId":57,"name":"贵阳电信节点"},{"id":57,"pId":57,"name":"济南电信节点"},{"id":65,"pId":57,"name":"衡阳电信节点"},{"id":69,"pId":57,"name":"徐州电信节点"},{"id":73,"pId":57,"name":"辛集电信节点"},{"id":74,"pId":57,"name":"淮安电信节点"},{"id":80,"pId":57,"name":"金华电信节点"},{"id":81,"pId":57,"name":"邯郸电信节点"},{"id":83,"pId":57,"name":"莆田电信节点"},{"id":88,"pId":57,"name":"红河电信节点"},{"id":91,"pId":57,"name":"太原电信节点"},{"id":93,"pId":57,"name":"芜湖电信节点"},{"id":96,"pId":57,"name":"江门电信节点"},{"id":101,"pId":57,"name":"台州电信节点"},{"id":102,"pId":57,"name":"盐城电信节点"},{"id":104,"pId":57,"name":"仙桃电信节点"},{"id":109,"pId":57,"name":"河源电信节点"},{"id":114,"pId":57,"name":"景德镇电信节点"},{"id":117,"pId":57,"name":"湛江电信节点"},{"id":118,"pId":57,"name":"咸阳电信节点"},{"id":120,"pId":57,"name":"肇庆电信节点"},{"id":121,"pId":57,"name":"呼和浩特电信节点"},{"id":122,"pId":57,"name":"廊坊电信节点"},{"id":123,"pId":57,"name":"株洲电信节点"},{"id":137,"pId":57,"name":"乌鲁木齐电信01节点"},{"id":139,"pId":57,"name":"达州电信01节点"},{"id":141,"pId":57,"name":"中山电信04节点"},{"id":144,"pId":57,"name":"太原电信02节点"},{"id":145,"pId":57,"name":"济阳电信01节点"},{"id":147,"pId":57,"name":"德阳电信02节点"},{"id":148,"pId":57,"name":"哈尔滨电信01节点"},{"id":151,"pId":57,"name":"广州电信01节点"},{"id":153,"pId":57,"name":"唐山电信01节点"},{"id":158,"pId":57,"name":"上海电信01节点"},{"id":164,"pId":57,"name":"东莞电信01节点"},{"id":165,"pId":57,"name":"杭州电信01节点"},{"id":62,"pId":0,"confFileList":[{"content":"","id":247,"name":"/etc/kscdn-live-tengine/node.conf"},{"content":"","id":248,"name":"/usr/local/squid/etc/domain.conf"},{"content":"","id":249,"name":"/usr/local/squid/etc/origdomain.conf"},{"content":"","id":250,"name":"/usr/local/tengine/conf/lua.conf"},{"content":"","id":251,"name":"/usr/local/tengine_relay/conf/lua.conf"}],"name":"下层[默认]华数节点组"},{"id":100,"pId":62,"name":"杭州华数节点"},{"id":58,"pId":0,"confFileList":[{"content":"","id":227,"name":"/etc/kscdn-live-tengine/node.conf"},{"content":"","id":228,"name":"/usr/local/squid/etc/domain.conf"},{"content":"","id":229,"name":"/usr/local/squid/etc/origdomain.conf"},{"content":"","id":230,"name":"/usr/local/tengine/conf/lua.conf"},{"content":"","id":231,"name":"/usr/local/tengine_relay/conf/lua.conf"}],"name":"下层[北京]教育网节点组"},{"id":63,"pId":58,"name":"北京教育网节点"},{"id":61,"pId":0,"confFileList":[{"content":"","id":242,"name":"/etc/kscdn-live-tengine/node.conf"},{"content":"","id":243,"name":"/usr/local/squid/etc/domain.conf"},{"content":"","id":244,"name":"/usr/local/squid/etc/origdomain.conf"},{"content":"","id":245,"name":"/usr/local/tengine/conf/lua.conf"},{"content":"","id":246,"name":"/usr/local/tengine_relay/conf/lua.conf"}],"name":"下层[上海]鹏博士节点组"},{"id":64,"pId":61,"name":"上海鹏博士节点"},{"id":68,"pId":0,"confFileList":[{"content":"","id":276,"name":"/etc/kscdn-live-tengine/node.conf"},{"content":"","id":277,"name":"/usr/local/squid/etc/domain.conf"},{"content":"","id":278,"name":"/usr/local/squid/etc/origdomain.conf"},{"content":"","id":279,"name":"/usr/local/tengine/conf/lua.conf"},{"content":"","id":280,"name":"/usr/local/tengine_relay/conf/lua.conf"}],"name":"下层[上海]电信节点组"},{"id":66,"pId":0,"confFileList":[{"content":"","id":267,"name":"/etc/kscdn-live-tengine/node.conf"},{"content":"","id":268,"name":"/usr/local/squid/etc/domain.conf"},{"content":"","id":269,"name":"/usr/local/squid/etc/origdomain.conf"},{"content":"","id":270,"name":"/usr/local/tengine/conf/lua.conf"},{"content":"","id":271,"name":"/usr/local/tengine_relay/conf/lua.conf"}],"name":"下层[上海]多线节点组"},{"id":105,"pId":66,"name":"上海多线上层节点"},{"id":65,"pId":0,"confFileList":[{"content":"","id":262,"name":"/etc/kscdn-live-tengine/node.conf"},{"content":"","id":263,"name":"/usr/local/squid/etc/domain.conf"},{"content":"","id":264,"name":"/usr/local/squid/etc/origdomain.conf"},{"content":"","id":265,"name":"/usr/local/tengine/conf/lua.conf"},{"content":"","id":266,"name":"/usr/local/tengine_relay/conf/lua.conf"}],"name":"上层[默认]联通节点组"},{"id":95,"pId":65,"name":"天津联通02节点"},{"id":107,"pId":65,"name":"临沂联通节点"},{"id":110,"pId":65,"name":"石家庄联通live上层节点"},{"id":152,"pId":65,"name":"杭州多线上层节点"},{"id":64,"pId":0,"confFileList":[{"content":"","id":257,"name":"/etc/kscdn-live-tengine/node.conf"},{"content":"","id":258,"name":"/usr/local/squid/etc/domain.conf"},{"content":"","id":259,"name":"/usr/local/squid/etc/origdomain.conf"},{"content":"","id":260,"name":"/usr/local/tengine/conf/lua.conf"},{"content":"","id":261,"name":"/usr/local/tengine_relay/conf/lua.conf"}],"name":"上层[默认]电信节点组"},{"id":43,"pId":64,"name":"合肥电信节点"},{"id":84,"pId":64,"name":"绍兴电信节点"},{"id":108,"pId":64,"name":"徐州电信live上层节点"},{"id":163,"pId":64,"name":"上海电信live直播上层节点"},{"id":67,"pId":0,"confFileList":[{"content":"","id":272,"name":"/usr/local/squid/etc/domain.conf"},{"content":"","id":273,"name":"/usr/local/squid/etc/origdomain.conf"},{"content":"","id":274,"name":"/usr/local/tengine/conf/lua.conf"},{"content":"","id":275,"name":"/usr/local/tengine_relay/conf/lua.conf"}],"name":"上层[默认]北美洲节点组"},{"id":77,"pId":67,"name":"华盛顿节点"},{"id":79,"pId":67,"name":"旧金山节点"}];
            if(this.isEdit){
                var nodeId = this.model.get("nodeId");
                var setting = {
                    check: {
                        enable: true,
                        chkStyle: "radio",
                        radioType: "all"
                    },
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    callback: {
                        onCheck: function(){
                            this.getEditSelected();
                        }.bind(this)
                    }
                };

                 _.each(zNodes,function(el,index,ls){
                    el.open = false;
                    el.nocheck = false;
                    if(el.pId == 0){
                        el.open = true;
                        el.nocheck = true;
                    }
                    if(el.id == nodeId){
                        el.checked = true;
                    }
                }.bind(this));
            }else{
                var setting = {
                    check: {
                        enable: true
                    },
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    callback: {
                        onCheck: function(){
                            this.getAddSelected();
                        }.bind(this)
                    }
                };

                this.oldSelectedNode = [];

                _.each(zNodes,function(el,index,ls){
                    el.open = false;
                    if(el.pId == 0){
                        el.open = true;
                    }
                }.bind(this));
            }

            // if(this.isEdit){
            //     //for edit test data
            //     var zNodes =[
            //         { id:1, pId:0, name:"节点组 1", open:true, "nocheck":true},
            //         { id:11, pId:1, name:"节点 1-1"},
            //         { id:12, pId:1, name:"节点 1-2"},
            //         { id:2, pId:0, name:"节点组 2", open:true, "nocheck":true},
            //         { id:21, pId:2, name:"节点 2-1"},
            //         { id:22, pId:2, name:"节点 2-2"},
            //         { id:23, pId:2, name:"节点 2-3"}
            //     ];
            // }else{
            //     //for add test data
            //     var zNodes =[
            //         { id:1, pId:0, name:"节点组 1", open:true},
            //         { id:11, pId:1, name:"节点 1-1"},
            //         { id:12, pId:1, name:"节点 1-2"},
            //         { id:2, pId:0, name:"节点组 2", open:true},
            //         { id:21, pId:2, name:"节点 2-1"},
            //         { id:22, pId:2, name:"节点 2-2"},
            //         { id:23, pId:2, name:"节点 2-3"}
            //     ];
            // }

            this.treeObj = $.fn.zTree.init(this.$el.find(".nodeList-ctn #tree"), setting, zNodes);

            if(this.isEdit){
                this.getEditSelected();
            }

            this.$el.find(".chk").on("focus",function(e){
                var eTarget = e.srcElement || e.target,className;
                className = $(eTarget).attr('class').split(" ")[2];
                $(eTarget).removeClass(className).addClass(className+'_focus');
            }.bind(this));
        },

        getAddSelected: function(){
            var domain = $.trim(this.$el.find('#input-domain').val());
            if(domain == ''){
                alert('请输入域名');
                var treeObj = $.fn.zTree.getZTreeObj("tree");
                treeObj.checkAllNodes(false);
                return ;
            }
            
            this.nodeGroup = null;
            if (!this.treeObj) return;

            this.selectedNode = this.treeObj.getCheckedNodes(true);

            if(this.oldSelectedNode.length > 0 && this.selectedNode.length > 0){
                var father = this.oldSelectedNode[0];
                var fatherNum = 0;
                var fatherChildren = [];

                _.each(this.selectedNode,function(obj,key,list){
                    if(obj.pId === null){
                        fatherNum ++;
                    }
                }.bind(this));

                if(fatherNum > 1){
                    father.checked = false;
                    _.each(this.selectedNode,function(obj,key,list){
                        if(obj.pId && (obj.pId == father.id) && (obj.checked == true)){
                            obj.checked = false;
                            fatherChildren.push(obj);
                        }
                    }.bind(this));
                    _.each(fatherChildren,function(o,k,l){
                        this.$el.find('#'+o.tId+'_check').removeClass('checkbox_true_full').addClass('checkbox_false_full');
                        this.arrRemove(this.selectedNode,o);
                        this.arrRemove(this.oldSelectedNode,o);
                    }.bind(this));
                    this.$el.find('#'+father.tId+'_check').attr('class','button chk checkbox_false_part')
                    this.arrRemove(this.selectedNode,father);
                    this.arrRemove(this.oldSelectedNode,father);
                    father = this.selectedNode[0];
                    this.nodeGroup = father;
                }else{
                    this.nodeGroup = father;
                }
            }else{
                this.nodeGroup = this.selectedNode[0];
            }

            this.oldSelectedNode = this.selectedNode;
            

            
            //调用获取配置文件内容接口
            var confFileIds = [];
            for(var i = 0;i<this.nodeGroup.confFileList.length;i++){
                confFileIds.push(this.nodeGroup.confFileList[i].id);
            }
            var args_conf = {
                domain:this.$el.find('#input-domain').val(),
                nodeGroupName:this.nodeGroup.name,
                confFileIds:confFileIds
            };
            this.collection.getConfContent(args_conf);
            
        },

        getEditSelected: function(){
            if (!this.treeObj) return;
            var matchNode = function(node){
                return node.checked === true && node.pId !== null;
            };
            var checkedNode = this.treeObj.getNodesByFilter(matchNode);
            var findFatherNode = function(node){
                return node.id === checkedNode[0].pId && node.pId === null;
            }
            var fatherNode = this.treeObj.getNodesByFilter(findFatherNode, true);

            this.initFileList(fatherNode);
            this.args.nodeId = [];
            this.args.nodeId.push(checkedNode[0].id);
        },
        showConfContent:function(res){
            this.nodeGroup.confFileList.forEach(function(item,index){
                for(var key in res){
                    if(item.id == key){
                        item.content = res[key];     
                    }
                }
            });
            this.initFileList(this.nodeGroup);

            this.args.nodeId = [];
            _.each(this.nodeGroup.children,function(obj,key,list){
                if(obj.checked){
                    this.args.nodeId.push(obj.id);
                }
            }.bind(this));
        },
        onGetConfContentError:function(error){
            console.log(error);
        },
        initFileList: function(nodeGroup){
            if(nodeGroup.confFileList.length > 0){
                this.table = $(_.template(template['tpl/grayscaleSetup/grayscaleSetup.add&edit.nodeFile.html'])({data:nodeGroup.confFileList}));
                this.$el.find(".nodeFiles").html(this.table[0]);
                this.$el.find(".nodeFiles tbody td a").off("click");
                this.$el.find(".nodeFiles tbody td a").on("click",$.proxy(this.onClickConf,this));
                this.$el.find(".nodeFiles tbody td a").eq(0).trigger('click');
                if(this.isEdit){
                    _.each(nodeGroup.confFileList,function(obj,key,list){
                        this.$el.find("#"+obj.id).val(obj.content);
                    }.bind(this));
                }
            }else{
                this.$el.find(".nodeFiles").html(_.template(template['tpl/empty-2.html'])({data:{message:"此节点组暂无配置文件"}}));
            }
        },

        onClickConf: function(e){
            var eTarget = e.srcElement || e.target,id;
            id = $(eTarget).attr("data-id");
            this.$el.find(".nodeFiles textarea").hide();
            this.$el.find('#'+id).show();
        },

        initDropMenu: function(){
            Utility.initDropMenu(this.$el.find(".dropdown-businessType"), this.businessTypeList, function(value){
                this.args.bisTypeId = parseInt($.trim(value));
                this.collection.getNodeGroupTree({bisTypeId:this.args.bisTypeId});
            }.bind(this));

            if(this.isEdit){
                $.each(this.businessTypeList,function(k,v){
                    if(v.value == this.model.get("bisTypeId")){
                        this.$el.find("#dropdown-businessType .cur-value").html(v.name);
    
                    }
                }.bind(this));

            }else{
                this.$el.find("#dropdown-businessType .cur-value").html(this.businessTypeList[0].name);
            }
        },

        getArgs: function() {
            this.args.domain = $.trim(this.$el.find("#input-domain").val());
            if(this.args.domain.length > 0){
                /*if (!/\.com$|\.net$|\.org$|\.edu$|\.gov$|\.cn$/gi.test(this.args.domain)){
                    alert('域名需以com、org、net、edu、gov、cn结尾');
                    return;
                }else */
                if(this.args.domain.length > 100){
                    alert("域名最大可输入100个字符");
                    return;
                }
            }

            //获取配置文件相应参数
            var $confDom = this.$el.find('.nodeFiles tbody td a');
            var $textareaDom = this.$el.find('.nodeFiles textarea');
            if($confDom.length > 0){
                $confDom.each(function(i){
                    var json = {};
                    json.confFileId = $.trim($textareaDom.eq(i).attr('id'));
                    json.content = $.trim($textareaDom.eq(i).val());
                    this.args.confFile.push(json);
                }.bind(this));
            }
            _.each(this.args.confFile,function(obj,k,l){
                if(obj.content.length > 4000){
                    alert("配置文件内容最多允许输入4000个字符");
                    return;
                }
            }.bind(this));


            return this.args;
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var SyncProgressView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.syncDomain = options.syncDomain;
            this.syncBisTypeId = options.syncBisTypeId;
            this.parent = options.parent;
            this.collection.off("get.syncProgress.success");
            this.collection.off("get.syncProgress.error");
            this.collection.on("get.syncProgress.success",$.proxy(this.onSyncProgressSuccess,this));
            this.collection.on("get.syncProgress.error",$.proxy(this.onSyncProgressError,this));
            this.collection.getSyncProgress({domain:this.syncDomain,bisTypeId:this.syncBisTypeId});

            //this.$el = $(_.template(template['tpl/grayscaleSetup/grayscaleSetup.syncProgress.html'])({data:this.data.nodeGroup}));
            this.$el = $(_.template(template['tpl/grayscaleSetup/grayscaleSetup.syncProgress.html'])());
            this.$el.find(".table-ctn").html($(_.template(template['tpl/loading.html'])()));
        },

        onSyncProgressSuccess:function(res){
            this.table = $(_.template(template['tpl/grayscaleSetup/grayscaleSetup.syncProgressTable.html'])({data:res}));
            this.$el.find(".table-ctn").html(this.table[0]);
            this.status = res.status || null;
            if(res.status != 0){
                this.parent.syncProgressPopup.$el.find(".modal-footer .btn-default").show();
                this.parent.syncProgressPopup.$el.find(".modal-header .close").show();                
            }
            if(res.status == 2 || res.percentage == '100'){
                this.timer && clearTimeout(this.timer);
                return false;
            }
            this.timer = setTimeout(function(){
                this.collection.getSyncProgress({domain:this.syncDomain,bisTypeId:this.syncBisTypeId});
            }.bind(this),5000);
        },

        getStatus:function(){
            return this.status;
        },

        onSyncProgressError:function(error){
                /*
            if (error && error.message){
                alert(error.message)
            }
            else{
                alert("网络阻塞，请刷新重试！")
            }
                */
            var _message = error && error.message || "网络阻塞，请刷新重试！";
            var data = {
                status:2,
                message:_message,
                bError:true,
                nodeGroup:[]
            };
            this.onSyncProgressSuccess(data);
            this.timer && clearTimeout(this.timer);        
        },

        clearTimer:function(){
            this.timer && clearTimeout(this.timer);
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var GrayscaleSetupView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/grayscaleSetup/grayscaleSetup.html'])());
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.initPageDropMenu();

            this.getPageArgs = {
                domain: "",
                nodeId:null,
                bisTypeId:null,
                page: 1,
                count: 10
            };

            this.collection.getNodeList(); //请求节点列表
            this.collection.getBusinessList(); //初始化业务列表数据

            this.collection.on("get.domainPageList.success", $.proxy(this.onGetDomainPageListSuccess,this));
            this.collection.on("get.domainPageList.error", $.proxy(this.onGetError,this));
            this.collection.on("get.node.success", $.proxy(this.onGetNodeSuccess, this));
            this.collection.on("get.node.error", $.proxy(this.onGetError, this));
            this.collection.on("get.businessList.success", $.proxy(this.initBisDropMenu, this));
            this.collection.on("get.businessList.error", $.proxy(this.onGetError, this));
            this.collection.on("add.graydomain.success", function(){
                alert("新建灰度域名成功");
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("add.graydomain.error", $.proxy(this.onGetError, this));
            this.collection.on("edit.graydomain.success", function(){
                alert("编辑灰度域名成功");
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("eidt.graydomain.error", $.proxy(this.onGetError, this));
            this.collection.on("delete.grayDomain.success", function(){
                alert("删除灰度域名成功");
                this.onClickQueryButton();
            }.bind(this));
            this.collection.on("delete.grayDomain.error", $.proxy(this.onGetError, this));
            //this.collection.on("get.syncProgress.success", $.proxy(this.onGetSyncProgressSuccess, this));
            //this.collection.on("get.syncProgress.error", $.proxy(this.onGetError, this));
            this.collection.on("get.sync.success", $.proxy(this.onGetSyncSuccess, this));
            this.collection.on("get.sync.error", $.proxy(this.onGetError, this));

            this.$el.find(".create").on("click", $.proxy(this.onClickCreate, this));
            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));

            this.enterKeyBindQuery();
        },

        enterKeyBindQuery:function(){
            $(document).on('keydown', function(e){
                if(e.keyCode == 13){
                    this.onClickQueryButton();
                }
            }.bind(this));
        },

        onGetDomainPageListSuccess: function(res){
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
        },

        onGetNodeSuccess: function(res){
            var nameList = [{name: "全部", value: "All"}];
            _.each(res.rows, function(el, index, list){
                nameList.push({name: el.chName, value:el.id})
            });

            var searchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-node').get(0),
                panelID: this.$el.find('#dropdown-node').get(0),
                isSingle: true,
                openSearch: true,
                onOk: function(){},
                data: nameList,
                callback: function(data) {
                    if(data.value == 'All'){
                        this.getPageArgs.nodeId = null;
                    }else{
                        this.getPageArgs.nodeId = data.value;
                    }
                    this.$el.find('#dropdown-node .cur-value').html(data.name);
                }.bind(this)
            });
            this.$el.find(".dropdown-node .cur-value").html(nameList[0].name);
            if(nameList[0].value == 'All'){
                this.getPageArgs.nodeId = null;
            }else{
                this.getPageArgs.nodeId = nameList[0].value;
            }
        },

        initBisDropMenu: function(res){
            var businessTypeList = [];
            _.each(res, function(el, key, ls){
                businessTypeList.push({name: el.name, value: el.id})
            })
            this.businessTypeList = businessTypeList;
            Utility.initDropMenu(this.$el.find(".dropdown-businessType"), businessTypeList, function(value){
                this.getPageArgs.bisTypeId = parseInt($.trim(value));
            }.bind(this));
            this.getPageArgs.bisTypeId = parseInt(businessTypeList[0].value);

            this.collection.getDomainPageList(this.getPageArgs); //请求table列表
         
            if(this.isEdit){
                $.each(businessTypeList,function(k,v){
                    if(v.value == this.model.get("businessType")){
                        this.$el.find("#dropdown-businessType .cur-value").html(v.name);
                    }
                }.bind(this));
            }else{
                this.$el.find("#dropdown-businessType .cur-value").html(businessTypeList[0].name);
                this.getPageArgs.bisTypeId = parseInt(businessTypeList[0].value);
            }
        },

        onClickQueryButton: function(){
            this.getPageArgs.domain = this.$el.find("#input-domain").val();
            if (this.getPageArgs.domain == ""){
                this.getPageArgs.domain = null;
            }else{
                /*if (!/\.com$|\.net$|\.org$|\.edu$|\.gov$|\.cn$/gi.test(this.getPageArgs.domain)){
                    alert('域名需以com、org、net、edu、gov、cn结尾');
                    return;
                }else*/ 
                if(this.getPageArgs.domain.length > 100){
                    alert("域名最大可输入100个字符");
                    return;
                }
            }
            this.isInitPaginator = false;
            this.getPageArgs.page = 1;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.getDomainPageList(this.getPageArgs);
        },

        initTable: function(){
            this.table = $(_.template(template['tpl/grayscaleSetup/grayscaleSetup.table.html'])({data:this.collection.models}));
            if (this.collection.models.length !== 0){
                this.$el.find(".table-ctn").html(this.table[0]);
            }else{
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            }

            this.$el.find(".edit").on("click", $.proxy(this.onClickEdit, this));
            this.$el.find(".delete").on("click", $.proxy(this.onClickDelete, this));
            this.$el.find(".sync").on("click", $.proxy(this.onClickSync, this));
        },

        onClickCreate: function(){
            //this.getPageArgs.bisTypeId = 10;
            this.collection.getNodeGroupTree({bisTypeId:this.getPageArgs.bisTypeId});

            if (this.addPopup) $("#" + this.addPopup.modalId).remove();

            var addView = new AddOrEditView({
                collection: this.collection,
                isEdit: false,
                businessTypeList: this.businessTypeList
            });
            var options = {
                title:"新建",
                body : addView,
                backdrop : 'static',
                width : 800,
                type : 2,
                onOKCallback:  function(){
                    var options = addView.getArgs();
                    if (!options) return;
                    this.collection.addDomain(options);
                    this.addPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addPopup = new Modal(options);
        },

        onClickEdit:function(e){
            var eTarget = e.srcElement || e.target,id;

            if (eTarget.tagName == "SPAN") {
                id = $(eTarget).parent().attr("id");
            } else {
                id = $(eTarget).attr("id");
            }
            this.collection.getNodeGroupTree({bisTypeId:this.getPageArgs.bisTypeId,grayDomainId:id});

            var model = this.collection.get(id);

            if(this.editPopup) $("#" + this.editPopup.modalId).remove();

            var editView = new AddOrEditView({
                collection: this.collection,
                model: model,
                isEdit: true,
                width : 800,
                businessTypeList: this.businessTypeList
            });

            var options = {
                title:"编辑",
                body : editView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var options = editView.getArgs();
                    if (!options) return;
                    this.collection.editDomain(options);
                    this.editPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.editPopup = new Modal(options);
        },

        onClickDelete: function(e){
            var eTarget = e.srcElement || e.target,id;

            if (eTarget.tagName == "SPAN") {
                id = $(eTarget).parent().attr("id");
            } else {
                id = $(eTarget).attr("id");
            }
            var result = confirm("你确定要删除当前域名吗？")
            if (!result) return;
            //请求删除接口
            this.collection.deleteGrayDomain({id:id});
        },

        onClickSync: function(e){
            var eTarget = e.srcElement || e.target;
            this.syncId = "";
            this.syncDomain = "";
            this.syncBisTypeId = "";

            if (eTarget.tagName == "SPAN") {
                this.syncId = $(eTarget).parent().attr("id");
                this.syncDomain = $(eTarget).parent().attr("data-domain");
                this.syncBisTypeId = $(eTarget).parent().attr("data-bisTypeId");
            } else {
                this.syncId = $(eTarget).attr("id");
                this.syncDomain = $(eTarget).attr("data-domain");
                this.syncBisTypeId = $(eTarget).attr("data-bisTypeId");
            }
            var result = confirm("你确定要同步当前域名吗？")
            if (!result) return;

            this.collection.getSync({id:this.syncId});
        },

        onGetSyncSuccess: function(){
            //定时器
            //this.timer = setInterval(function(){
            //  this.collection.getSyncProgress({domain:this.syncDomain,bisTypeId:this.syncBisTypeId});
            //}.bind(this),5000);

            if (this.syncProgressPopup) $("#" + this.syncProgressPopup.modalId).remove();

            var syncProgressView = new SyncProgressView({
                collection: this.collection,
                syncDomain:this.syncDomain,
                syncBisTypeId:this.syncBisTypeId,
                parent:this
            });
            var options = {
                title:"域名："+this.syncDomain,
                body : syncProgressView,
                backdrop : 'static',
                type     : 1,
                onOKCallback:  function(){
                    syncProgressView.clearTimer();
                }.bind(this),
                onHiddenCallback: function(){
                    syncProgressView.clearTimer();
                    var status = syncProgressView.getStatus();
                    if(status == 1){
                        this.onClickQueryButton();
                    }
                }.bind(this)
            }
            this.syncProgressPopup = new Modal(options);
            this.syncProgressPopup.$el.find(".modal-footer .btn-default").hide();
            this.syncProgressPopup.$el.find(".modal-header .close").hide();
            

        },

        onGetSyncProgressSuccess: function(res){
            if (this.syncProgressPopup) $("#" + this.syncProgressPopup.modalId).remove();

            var syncProgressView = new SyncProgressView({
                collection: this.collection,
                data: res
            });
            var options = {
                title:"域名："+res.domain,
                body : syncProgressView,
                backdrop : 'static',
                type     : 1,
                onOKCallback:  function(){}.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.syncProgressPopup = new Modal(options);

            if(res.percentage == '100'){
                clearInterval(this.timer);
            }
        },

        initPaginator: function(){
            this.$el.find(".total-items span").html(this.collection.total)
            if (this.collection.total <= this.getPageArgs.count) return;
            var total = Math.ceil(this.collection.total/this.getPageArgs.count);

            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: 1,
                onPageChange: function (num, type) {
                    if (type !== "init"){
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        var args = _.extend(this.getPageArgs);
                        args.page = num;
                        args.count = this.getPageArgs.count;
                        this.collection.getDomainPageList(args); //请求域名列表接口
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initPageDropMenu: function(){
            var pageNum = [
                {name: "10条", value: 10},
                {name: "20条", value: 20},
                {name: "50条", value: 50},
                {name: "100条", value: 100}
            ]
            Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value){
                this.getPageArgs.count = value;
                this.getPageArgs.page = 1;
                this.onClickQueryButton();
            }.bind(this));
        },

        onGetError: function(error) {
            if (error && error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
            
            this.timer && clearInterval(this.timer);
        },

        hide: function() {
            this.$el.hide();
            $(document).off('keydown');
        },

        update: function() {
            this.$el.show();
            this.enterKeyBindQuery();
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return GrayscaleSetupView;
});
