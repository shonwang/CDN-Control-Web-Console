define("grayscaleManage.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){

        }
    });

    var GrayscaleManageCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        // getDomainList: function(args){
        //     var url = BASE_URL + "/rs/origin/getPage";
        //     var defaultParas = {
        //         type: "POST",
        //         url: url,
        //         async: true,
        //         timeout: 30000,
        //         contentType: "application/json",
        //         processData: false
        //     };
        //     defaultParas.data = JSON.stringify(args);

        //     defaultParas.success = function(res){
        //         this.reset();
        //         if (res){
        //             _.each(res.rows, function(element, index, list){
        //                 this.push(new Model(element));
        //             }.bind(this))
        //             this.total = res.total;
        //             this.trigger("get.domainList.success");
        //         } else {
        //             this.trigger("get.domainList.error"); 
        //         }
        //     }.bind(this);

        //     defaultParas.error = function(response, msg){
        //         if (response&&response.responseText)
        //             response = JSON.parse(response.responseText)
        //         this.trigger("get.domainList.error", response); 
        //     }.bind(this);

        //     $.ajax(defaultParas);
        // },

        addDomain: function(args){
            // var url = BASE_URL + "/rs/origin/addOrigin";
            // var defaultParas = {
            //     type: "POST",
            //     url: url,
            //     async: true,
            //     timeout: 30000,
            //     contentType: "application/json",
            //     processData: false
            // };
            // defaultParas.data = JSON.stringify(args);

            // defaultParas.success = function(res){
            //     this.trigger("add.domain.success");
            // }.bind(this);

            // defaultParas.error = function(response, msg){
            //     if (response&&response.responseText)
            //         response = JSON.parse(response.responseText)
            //     this.trigger("add.domain.error", response); 
            // }.bind(this);

            // $.ajax(defaultParas);
        }

    });

    return GrayscaleManageCollection;
});