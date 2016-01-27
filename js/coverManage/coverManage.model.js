define("coverManage.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
        }
    });

    var CoverManageCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getMapData: function(args){
            var url = BASE_URL + "/rs/map/data/get";
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
                if (res){
                    this.trigger("get.map.success", res);
                } else {
                    this.trigger("get.map.error", res); 
                }
            }.bind(this);

            defaultParas.error = function(response, msg){
                if (response&&response.responseText)
                    response = JSON.parse(response.responseText)
                this.trigger("get.map.error", response); 
            }.bind(this);

            $.ajax(defaultParas);
        },
    });

    return CoverManageCollection;
});