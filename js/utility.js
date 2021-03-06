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

            // String.prototype.trim = function() {
            //      return this.replace(/(^\s*)|(\s*$)/g, "");
            // }
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
                num = Math.ceil(input / 60)
                return num + '分';
            } else if (input >= 60 * 60 && input < 60 * 60 * 24) {
                num = Math.ceil(input / 60 / 60);
                return num + '时';
            } else if (input >= 60 * 60 * 24 && input < 60 * 60 * 24 * 30) {
                num = Math.ceil(input / 60 / 60 / 24);
                return num + '天';
            } else if (input >= 60 * 60 * 24 * 30 && input < 60 * 60 * 24 * 30 * 12) {
                num = Math.ceil(input / 60 / 60 / 24 / 30);
                return num + '月';
            } else if (input >= 60 * 60 * 24 * 30 * 12){
                num = Math.ceil(input / 60 / 60 / 24 / 30 / 12);
                return num + '年';
            } else {
                return num + '秒';
            }
        },

        timeFormat2: function(input) {
            var input = input || 0, num = parseInt(input), str = '';
            if (input >= 60 && input < 60 * 60) {
                num = Math.floor(input / 60)
                str = this.timeFormat2(input % 60);
                str = num + '分' + str;
            } else if (input >= 60 * 60 && input < 60 * 60 * 24) {
                num = Math.floor(input / 60 / 60);
                str = this.timeFormat2(input % (60 * 60))
                str =  num + '小时' + str;
            } else if (input >= 60 * 60 * 24 && input < 60 * 60 * 24 * 30) {
                num = Math.floor(input / 60 / 60 / 24);
                str = this.timeFormat2(input % (60 * 60 * 24))
                str =  num + '天' + str;
            } else if (input >= 60 * 60 * 24 * 30 && input < 60 * 60 * 24 * 30 * 12) {
                num = Math.floor(input / 60 / 60 / 24 / 30);
                str = this.timeFormat2(input % (60 * 60 * 24 * 30))
                str =  num + '个月' + str;
            } else if (input >= 60 * 60 * 24 * 30 * 12) {
                num = Math.floor(input / 60 / 60 / 24 / 30 / 12);
                str = this.timeFormat2(input % (60 * 60 * 24 * 30 * 12));
                str =  num + '年' + str;
            } else {
                if (num > 0) str = num + '秒'
            }
            return str;
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

        isFileName: function(fileName){
            //var re = /^[^\\\/:\*\?"<>|\s\0]+$/
            var re=/^[a-z0-9A-Z]+$/;
            return re.test(fileName)
        },

        isDir: function(dirName){
            if (dirName == "") return false;
            var strRegex = /^\/[^\\:\*\?"<>|\s\0]*\/$/,
                result   = strRegex.test(dirName);
            if (result){
                var dirNames = dirName.split("/");
                for(var i = 0; i < dirNames.length; i++){
                    if (dirNames[i] === "" && i !== 0 && i !== dirNames.length -1) 
                        return false
                }
                return true;
            } else {
                return false;
            }
        },

        isDomain: function(str_url){
            if (str_url == "" || str_url.indexOf("_")  > -1) return false;
            if (str_url.substr(0, 4) !== "http") str_url = "http://" + str_url;
            var strRegex = /^(http|https):\/\/([\w-]+(\.[\w-]+)+(:[0-9]{1,5})?([\w-.]*)?){1}$/;
            return strRegex.test(str_url)
        },

        isAntileechDomain: function(url) {
            var reg = /^(([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)|\*{1}\.)+[a-zA-Z]{2,20}$/;
            return reg.test(url);
        },

        isHostHeader:function(str_url){
            var reg=/^([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
            return reg.test(str_url);
        },

        isURL: function(str_url){
            var strRegex = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/
            return strRegex.test(str_url)
        },

        isIP: function(str_ip){
            var re =  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
            return re.test(str_ip)
        },

        isNumber:function(val){
            var reg=/^\d+$/g;
            return reg.test(val);
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

        hideMainList: function(root, mainClass, otherClass){
            async.series([
                function(callback){
                    root.find(mainClass).addClass("fadeOutLeft animated");
                    callback()
                }.bind(this),
                function(callback){
                    setTimeout(function(){
                        root.find(mainClass).hide();
                        root.find(otherClass).show();
                        root.find(otherClass).addClass("fadeInLeft animated");
                        callback()
                    }.bind(this), 500)
                }.bind(this),                
                function(callback){
                    setTimeout(function(){
                        root.find(otherClass).removeClass("fadeInLeft animated");
                        root.find(otherClass).removeClass("fadeOutLeft animated");
                        root.find(mainClass).removeClass("fadeInLeft animated");
                        root.find(mainClass).removeClass("fadeOutLeft animated");
                        callback()
                    }.bind(this), 500)
                }.bind(this)]
            );
        },

        showMainList: function(root, mainClass, otherClass, otherClass1){
            async.series([
                function(callback){
                    root.find(otherClass).addClass("fadeOutLeft animated");
                    callback()
                }.bind(this),
                function(callback){
                    setTimeout(function(){
                        root.find(otherClass).hide();
                        root.find(otherClass + " " + otherClass1).remove();
                        root.find(mainClass).show();
                        root.find(mainClass).addClass("fadeInLeft animated")
                        callback()
                    }.bind(this), 500)
                }.bind(this),                
                function(callback){
                    setTimeout(function(){
                        root.find(otherClass).removeClass("fadeInLeft animated");
                        root.find(otherClass).removeClass("fadeOutLeft animated");
                        root.find(mainClass).removeClass("fadeInLeft animated");
                        root.find(mainClass).removeClass("fadeOutLeft animated");
                        callback()
                    }.bind(this), 500)
                }.bind(this)]
            );
        },

        adjustElement: function(array, index, isUp){
            if (index === 0 && isUp) {
                alert("已经是第一个了！");
                return array;
            } else if (index === array.length - 1 && !isUp) {
                alert("已经是最后一个了！")
                return array;
            }
            var adjustIndex, endArray, selectedArray = array.splice(index, 1);
            if (isUp)
                adjustIndex = index - 1;
            else
                adjustIndex = index + 1; 
            endArray = array.splice(adjustIndex, array.length - adjustIndex);
            array = array.concat(selectedArray, endArray);

            return array;
        },

        postAjax: function(url, args, successCallback, errorCallback, timeout, dataType, notJson){
            var defaultParas = {
                type: "POST",
                url: url,
                async: true,
                timeout: timeout || 40 * 60 * 1000,
                contentType: "application/json",
                processData: false
            };
            
            if (dataType) defaultParas.dataType = dataType;
            if (notJson){
                delete defaultParas.contentType;
                delete defaultParas.processData;
                defaultParas.data = args;
            } else {
                defaultParas.data = JSON.stringify(args);
            }

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
                timeout: timeout || 40 * 60 * 1000,
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
        },
        deleteAjax: function(url, args, successCallback, errorCallback, timeout){
            var defaultParas = {
                type: "DELETE",
                url: url,
                async: true,
                timeout: timeout || 40 * 60 * 1000,
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