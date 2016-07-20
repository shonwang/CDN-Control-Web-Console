define("templateManage.model", ['require','exports'], function(require, exports) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            
        }
    });

    var TemplateManageCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        // queryChannel: function(args){
        //     var url = BASE_URL + "/rs/channel/query"
        //     var defaultParas = {
        //         type: "POST",
        //         url: url,
        //         async: true,
        //         timeout: 30000,
        //         contentType: "application/json",
        //         processData: false
        //     };
        //     defaultParas.data = JSON.stringify(args);

        //     defaultParas.beforeSend = function(xhr){
        //         //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
        //     }
        //     defaultParas.success = function(res){
        //         this.reset();
        //         if (res){
        //             _.each(res.rows, function(element, index, list){
        //                 this.push(new Model(element));
        //             }.bind(this))
        //             this.total = res.total;
        //             this.trigger("get.channel.success");
        //         } else {
        //             this.trigger("get.channel.error"); 
        //         }
        //     }.bind(this);

        //     defaultParas.error = function(response, msg){
        //         if (response&&response.responseText)
        //             response = JSON.parse(response.responseText)
        //         this.trigger("get.channel.error", response); 
        //     }.bind(this);

        //     $.ajax(defaultParas);
        // },

        // getChannelDispgroup: function(args){
        //     var url = BASE_URL + "/rs/channel/dispgroup/get";
        //     var defaultParas = {
        //         type: "GET",
        //         url: url,
        //         async: true,
        //         timeout: 30000,
        //     };
        //     defaultParas.data = args;

        //     defaultParas.beforeSend = function(xhr){
        //         //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
        //     }
        //     defaultParas.success = function(res){
        //         if (res){
        //             this.trigger("channel.dispgroup.success", res);
        //         } else {
        //             this.trigger("channel.dispgroup.error", res); 
        //         }
        //     }.bind(this);

        //     defaultParas.error = function(response, msg){
        //         if (response&&response.responseText)
        //             response = JSON.parse(response.responseText)
        //         this.trigger("channel.dispgroup.error", response); 
        //     }.bind(this);

        //     $.ajax(defaultParas);
        // }
    });

    return TemplateManageCollection;
});