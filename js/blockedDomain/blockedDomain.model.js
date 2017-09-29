define("blockedDomain.model", ['require','exports', 'utility', 'domainList.model'], function(require, exports, Utility, DomainListCollection) {

    var BlockedDomainCollection = DomainListCollection.extend({

        blockDomain: function(args){
            var url = BASE_URL + "/channelManager/domain/block";
            Utility.postAjax(url, args, function(res){
                this.trigger("block.domain.success");
            }.bind(this),function(res){
                this.trigger("block.domain.error", res);
            }.bind(this));
        },

        unblockDomain: function(args){
            var url = BASE_URL + "/channelManager/domain/unblock";
            Utility.postAjax(url, args, function(res){
                this.trigger("unblock.domain.success");
            }.bind(this),function(res){
                this.trigger("unblock.domain.error", res);
            }.bind(this));
        },

        blockDetail: function(args){
            var url = BASE_URL + "/channelManager/domain/block/detail";
            Utility.getAjax(url, args, function(res){
                this.trigger("block.detail.success", res);
            }.bind(this),function(res){
                this.trigger("block.detail.error", res);
            }.bind(this));
        },
    });

    return BlockedDomainCollection;
});