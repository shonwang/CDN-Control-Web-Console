define("clientLimitSpeed.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            //0文件后缀，1目录，2具体url,3正则预留,4url包含指定参数9全局默认缓存配置项
            var type = this.get('matchingType');
            if (type === 0) this.set("typeName", "文件类型");
            if (type === 1) this.set("typeName", "指定目录");
            if (type === 2) this.set("typeName", "指定URL");
            if (type === 3) this.set("typeName", "正则匹配");
            if (type === 4) this.set("typeName", "url包含指定参数");
            if (type === 9) this.set("typeName", "全部文件");

            var preUnlimit = this.get('preUnlimit'),
                speedLimit = this.get('speedLimit'), summary = '',
                preFlag = this.get('preFlag'),
                speedFlag = this.get('speedFlag');

            if (preUnlimit === 0) summary = "指定不限速字节数：关闭。" ;
            if (preUnlimit !== 0) summary = "指定不限速字节数：" + preUnlimit + "KB。";
            if (preFlag === 0) summary = "指定不限速字节数：关闭。" ;

            if (speedFlag === 0) {
                summary = summary + "限速字节数：关闭<br>";
            } else {
                if (speedLimit === 0) summary = summary + "限速字节数：关闭<br>";
                if (speedLimit !== 0) summary = summary + "限速字节数：" + speedLimit + "KB/s<br>";
            }

            var timeLimit = this.get("timeLimit");
            _.each(timeLimit, function(el, index, ls){
                var startTime = el.startTime,
                    endTime = el.endTime,
                    speedLimit2 = el.speedLimit + "KB/s<br>"
                var timeStr = "限速时间段：" + startTime + "至" + endTime + "，限速字节数：" + speedLimit2;
                summary = summary + timeStr
            })
            this.set("summary", summary);
        }
    });

    var ClientLimitSpeedCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        getClientSpeed: function(args){
            var url = BASE_URL + "/channelManager/clientSpeed/getClientSpeed",
            successCallback = function(res){
                this.reset();
                if (res){
                    _.each(res, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.total;
                    this.trigger("get.speed.success");
                } else {
                    this.trigger("get.speed.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.speed.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        },

        setClientSpeed: function(args){
            var url = BASE_URL + "/channelManager/clientSpeed/setClientSpeed",
            successCallback = function(res){
                this.trigger("set.speed.success", res)
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.speed.error", response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },
    });

    return ClientLimitSpeedCollection;
});