define("utility", ['require','exports'], function(require, exports) {
    var Utility = {
        dateFormat: function(){
            Date.prototype.format = function(fmt) {
              var o = {
                "M+" : this.getMonth()+1,                 //月份
                "d+" : this.getDate(),                    //日
                "h+" : this.getHours(),                   //小时
                "m+" : this.getMinutes(),                 //分
                "s+" : this.getSeconds(),                 //秒
                "q+" : Math.floor((this.getMonth()+3)/3), //季度
                "S"  : this.getMilliseconds()             //毫秒
              };
              if(/(y+)/.test(fmt))
                fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
              for(var k in o)
                if(new RegExp("("+ k +")").test(fmt))
                  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
              return fmt;
            };

            String.prototype.trim = function() {
                 return this.replace(/(^\s*)|(\s*$)/g, "");
            }
        },

        formatMillisecond: function(millisecond){
            var millisecondStr = "";
            millisecond = parseInt(millisecond);
            var date = new Date();
            date.setTime(millisecond);
            if (millisecond === 0){
                millisecondStr = "00:00";
            } else if (millisecond < 1000 * 60 * 60){
                millisecondStr = date.format("mm:ss");
            } else if (millisecond >= 1000 * 60 * 60){
                var hour =  Math.floor(millisecond / 1000 / 60 / 60);
                hour = ("00" + hour.toString()).substring(hour.toString().length);
                millisecondStr = hour + ":" + date.format("mm:ss");
            }
            return millisecondStr;
        },

        forIE8Bind: function(){
            if (!Function.prototype.bind) { 
                Function.prototype.bind = function (oThis) { 
                    if (typeof this !== "function") { 
                        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable"); 
                    } 
                    var aArgs = Array.prototype.slice.call(arguments, 1), 
                        fToBind = this, 
                        fNOP = function () {}, 
                        fBound = function () { 
                            return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, 
                                    aArgs.concat(Array.prototype.slice.call(arguments))); 
                        }; 
                    fNOP.prototype = this.prototype; 
                    fBound.prototype = new fNOP(); 
                    return fBound; 
                }; 
            } 
        },

        timeFormat: function(input) {
            var input = input || 0, num = parseInt(input);
            if (input >= 60 && input < 60 * 60) {
                num = parseInt(input / 60)
                return num + '分';
            } else if (input >= 60 * 60 && input < 60 * 60 * 24) {
                num = parseInt(input / 60 / 60);
                return num + '时';
            } else if (input >= 60 * 60 * 24 && input < 60 * 60 * 24 * 30) {
                num = parseInt(input / 60 / 60 / 24);
                return num + '天';
            } else if (input >= 60 * 60 * 24 * 30 && input < 60 * 60 * 24 * 30 * 12) {
                num = parseInt(input / 60 / 60 / 24 / 30);
                return num + '月';
            } else if (input >= 60 * 60 * 24 * 30 * 12){
                num = parseInt(input / 60 / 60 / 24 / 30 / 12);
                return num + '年';
            } else {
                return num + '秒';
            }
        },

        //产品说必须按1000算，不按1024算
        handlerToBps: function(input) {
            var input = input || 0;
            var num = parseFloat(input);
            if (input >= 1000 && input < 1000 * 1000) {
                num = parseFloat(input / 1000).toFixed(2);
                return num + 'Kbps';
            } else if (input >= 1000 * 1000) {
                num = parseFloat(input / 1000 / 1000).toFixed(2)
                return num + 'Mbps';
            } 
			/*else if (input >= 1000 * 1000 * 1000 && input < 1000 * 1000 * 1000 * 1000) {
                num = parseFloat(input / 1000 / 1000 / 1000).toFixed(2);
                return num + 'Gbps';
            }*/
			/*
			else if (input >= 1000 * 1000 * 1000) {
                num = parseFloat(input / 1000 / 1000 / 1000).toFixed(2);
                return num + 'Gbps';
            }*/
			/*else if (input >= 1000 * 1000 * 1000 * 1000) {
                num = parseFloat(input / 1000 / 1000 / 1000 / 1000).toFixed(2)
                return num + 'Tbps';
            }*/
			else {
                return num.toFixed(2) + "bps";
            }
        },

        //产品说必须按1000算，不按1024算
        handlerToB: function(input) {
            var input = input || 0;
            var num = parseFloat(input);
            if (input >= 1000 && input < 1000 * 1000) {
                num = parseFloat(input / 1000).toFixed(2);
                return num + 'KB';
            } else if (input >= 1000 * 1000 && input < 1000 * 1000 * 1000) {
                num = parseFloat(input / 1000 / 1000).toFixed(2)
                return num + 'MB';
            } 
			/*else if (input >= 1000 * 1000 * 1000 && input < 1000 * 1000 * 1000 * 1000) {
                num = parseFloat(input / 1000 / 1000 / 1000).toFixed(2);
                return num + 'Gbps';
            }*/
			else if (input >= 1000 * 1000 * 1000) {
                num = parseFloat(input / 1000 / 1000 / 1000).toFixed(2);
                return num + 'GB';
            }
			/*else if (input >= 1000 * 1000 * 1000 * 1000) {
                num = parseFloat(input / 1000 / 1000 / 1000 / 1000).toFixed(2)
                return num + 'Tbps';
            }*/
			else {
                return num.toFixed(2) + "B";
            }
        },

        handlerToBps1024: function(input) {
            var input = input || 0;
            var num = parseFloat(input);
            if (input >= 1024 && input < 1024 * 1024) {
                num = parseFloat(input / 1024).toFixed(2);
                return num + 'Kbps';
            } else if (input >= 1024 * 1024 && input < 1024 * 1024 * 1024) {
                num = parseFloat(input / 1024 / 1024).toFixed(2)
                return num + 'Mbps';
            } else if (input >= 1024 * 1024 * 1024 && input < 1024 * 1024 * 1024 * 1024) {
                num = parseFloat(input / 1024 / 1024 / 1024).toFixed(2);
                return num + 'Gbps';
            } else if (input >= 1024 * 1024 * 1024 * 1024) {
                num = parseFloat(input / 1024 / 1024 / 1024 / 1024).toFixed(2)
                return num + 'Tbps';
            } else {
                return num.toFixed(2) + "bps";
            }
        },

        handlerToB1024: function(input) {
            var input = input || 0;
            var num = parseFloat(input);
            if (input >= 1024 && input < 1024 * 1024) {
                num = parseFloat(input / 1024).toFixed(2);
                return num + 'Kb';
            } else if (input >= 1024 * 1024 && input < 1024 * 1024 * 1024) {
                num = parseFloat(input / 1024 / 1024).toFixed(2)
                return num + 'Mb';
            } else if (input >= 1024 * 1024 * 1024 && input < 1024 * 1024 * 1024 * 1024) {
                num = parseFloat(input / 1024 / 1024 / 1024).toFixed(2);
                return num + 'Gb';
            } else if (input >= 1024 * 1024 * 1024 * 1024) {
                num = parseFloat(input / 1024 / 1024 / 1024 / 1024).toFixed(2)
                return num + 'Tb';
            } else {
                return num.toFixed(2) + "B";
            }
        },

        initDropMenu: function (rootNode, typeArray, callback){
            var dropRoot = rootNode.find(".dropdown-menu"),
                showNode = rootNode.find(".cur-value");
            dropRoot.html("");
            _.each(typeArray, function(element, index, list){
                var itemTpl = '<li value="' + element.value + '">' + 
                                  '<a href="javascript:void(0);" value="' + element.value + '">'+ element.name + '</a>' + 
                            '</li>',
                itemNode = $(itemTpl);
                itemNode.on("click", function(event){
                    var eventTarget = event.srcElement || event.target;
                        showNode.html($(eventTarget).html()),
                        value = $(eventTarget).attr("value");
                    callback&&callback(value);
                });
                itemNode.appendTo(dropRoot);
            });
        },

        isDomain: function(str_url){
            if (str_url == "" || str_url.indexOf("_")  > -1) return false;
            if (str_url.substr(0, 4) !== "http") str_url = "http://" + str_url;
            var strRegex = /^(http|https):\/\/([\w-]+(\.[\w-]+)+(:[0-9]{1,5})?([\w-.]*)?){1}$/;
            return strRegex.test(str_url)
        },

        isIP: function(str_ip){
            var re =  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
            return re.test(str_ip)
        },

        randomStr: function ( max ){
            var randomStr_str = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ';
            var rv = '';
            for(var i=0; i < max; i++){
                rv += randomStr_str[Math.floor(Math.random() * randomStr_str.length)];
            }
            return rv;
        },

        launchFullscreen: function(element) {
          if(element.requestFullscreen) {
            element.requestFullscreen();
          } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
          } else if(element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
          } else if(element.msRequestFullscreen) {
            element.msRequestFullscreen();
          }
        },

        postAjax: function(url, args, successCallback, errorCallback, timeout){
            var defaultParas = {
                type: "POST",
                url: url,
                async: true,
                timeout: timeout || 30000,
                contentType: "application/json",
                processData: false
            };
            defaultParas.data = JSON.stringify(args);

            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                successCallback && successCallback(res)
            };

            defaultParas.error = function(response, msg){
                try{
                    if (response&&response.responseText)
                        response = JSON.parse(response.responseText)
                    errorCallback && errorCallback(response)
                } catch(e){
                    errorCallback && errorCallback(response)
                } 
            };

            $.ajax(defaultParas);
        },

        getAjax: function(url, args, successCallback, errorCallback, timeout){
            var defaultParas = {
                type: "GET",
                url: url,
                async: true,
                timeout: timeout || 30000,
            };
            defaultParas.data = args || {t: new Date().valueOf()};

            defaultParas.beforeSend = function(xhr){
                //xhr.setRequestHeader("Accept","application/json, text/plain, */*");
            }
            defaultParas.success = function(res){
                successCallback && successCallback(res)
            };

            defaultParas.error = function(response, msg){
                try{
                    if (response&&response.responseText)
                        response = JSON.parse(response.responseText)
                    errorCallback && errorCallback(response)
                } catch(e){
                    errorCallback && errorCallback(response)
                } 
            };

            $.ajax(defaultParas);
        }
    };
    return Utility;
});