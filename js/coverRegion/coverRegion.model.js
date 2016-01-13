define("coverRegion.model", ['require','exports'], function(require, exports) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            var crossLevel = this.get("crossLevel");
            this.set("crossLevelName","L" + crossLevel);
        }
    });

    var CoverRegionCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getNodeList: function(args){
            var url = BASE_URL + "/rs/cover/query";
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: 30000,
            };
            defaultParas.data = args;

            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                this.reset();
                if (res){
                    _.each(res.rows, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.total;
                    this.trigger("get.node.success");
                } else {
                    this.trigger("get.node.error"); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.node.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },
    });

    return CoverRegionCollection;
});