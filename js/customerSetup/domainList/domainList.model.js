define("domainList.model", ['require','exports','utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
        }
    });

    var DomainListCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        queryDomain: function(args){
            var url = BASE_URL + "domainlist/domains/get"
            var data = {
                PageSize:args.PageSize,
                PageNumber:args.PageNumber,
                DomainName:args.DomainName || '',
                DomainStatus:args.DomainStatus || '',
                CdnType:args.CdnType || '',
                FuzzyMatch:'on'//域名过滤是否使用模糊匹配，取值为on：开启，off：关闭，默认为on
            };
            Utility.getAjax(url,data,function(data){
                if(data.code == 100){
                    this.trigger("query.domain.success",data);
                }
                else{
                    this.trigger("query.domain.error",data);
                }
                
            }.bind(this),function(){
                this.trigger("query.domain.error",data);
            }.bind(this));
        },

        submitDomain: function(args){
            var url = BASE_URL + "domainbase/add";
            var data = {
                DomainName:args.DomainName,
                CdnType:args.CdnType,
                CdnSubType:args.CdnSubType,
                CdnProtocol:args.CdnProtocol,
                Regions:args.Regions,
                OriginType:args.OriginType,
                OriginProtocol:args.OriginProtocol,
                OriginPort:args.OriginPort,
                Origin:args.Origin
            };
            Utility.postAjax(url,data,function(data){
                if(data.code == 100){
                    this.trigger("submit.domain.success",data);
                }
                else{
                    this.trigger("submit.domain.error",data);
                }
                
            }.bind(this),function(){
                this.trigger("submit.domain.error",data);
            }.bind(this));
        },

        updateDomain: function(args){

        },

        deleteDomain: function(args){
            var url = BASE_URL + "domain/deletedomain"
        }



	});

    return DomainListCollection;
});