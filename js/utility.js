define("utility", ['require','exports',"react", "react-dom"], function(require, exports, React, ReactDOM) {
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
                return num + 'KB';
            } else if (input >= 1024 * 1024 && input < 1024 * 1024 * 1024) {
                num = parseFloat(input / 1024 / 1024).toFixed(2)
                return num + 'MB';
            } else if (input >= 1024 * 1024 * 1024 && input < 1024 * 1024 * 1024 * 1024) {
                num = parseFloat(input / 1024 / 1024 / 1024).toFixed(2);
                return num + 'GB';
            } else if (input >= 1024 * 1024 * 1024 * 1024) {
                num = parseFloat(input / 1024 / 1024 / 1024 / 1024).toFixed(2)
                return num + 'TB';
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
                  //  Utility.warning(1);
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

        isDomain: function(str_url,isCommon){
            if(isCommon && str_url.indexOf("*.")==0){
                str_url = str_url.substring(2);
            }
            if (str_url == "" || str_url.indexOf("_")  > -1) return false;
            if (str_url.substr(0, 4) !== "http") str_url = "http://" + str_url;
            var strRegex = /^(http|https):\/\/([\w-]+(\.[\w-]+)+(:[0-9]{1,5})?([\w-.]*)?){1}$/;
            return strRegex.test(str_url)
        },

        isAntileechDomain: function(str_url, isCommon) {
            if(isCommon && str_url.indexOf("*.")==0){
                str_url = str_url.substring(2);
            }
            var reg = /^(([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)|\*{1}\.)+[a-zA-Z]{2,20}$/;
            return reg.test(str_url);
        },

        isHostHeader:function(str_url){
            var reg=/^([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
            return reg.test(str_url);
        },

        isURL: function(str_url){
            var strRegex = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w\(\)]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w\(\)]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_\(\)]*)?\??(?:[-\+=&;%@.\w_\(\)]*)#?(?:[\w]*))?)$/
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
                Utility.warning("已经是第一个了！");
                return array;
            } else if (index === array.length - 1 && !isUp) {
                Utility.warning("已经是最后一个了！")
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
        },

        putAjax: function(url, args, successCallback, errorCallback, timeout){
            var defaultParas = {
                type: "PUT",
                url: url,
                async: true,
                timeout: timeout || 40 * 60 * 1000,
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

        isKeyAndValue:function(str){
            var _arr = str.split("&");
            var reg = /^[0-9a-zA-Z\-_%]+\=[0-9a-zA-Z\-_%]/;
            for(var i=0;i<_arr.length;i++){
                if(!reg.test(_arr[i])){
                    return false;
                }
            }
            return true;
        },

        // alerts: function(message, type, timeout){
        //     require(['react.modal.alert'], function(ReactModalAlertComponent){
        //         var ReactModalAlertView = React.createFactory(ReactModalAlertComponent);
        //         var reactModalAlertView = ReactModalAlertView({
        //             showModal: true,
        //             backdrop: false,
        //             message: message || "Hello world!",
        //             type: type || 'danger',
        //             timeout: timeout || -1
        //         });
        //         ReactDOM.unmountComponentAtNode($("#react-modal").get(0))
        //         ReactDOM.render(reactModalAlertView, $("#react-modal").get(0));
        //     })
        // },

        alerts: function(message, type, timeout){
            toastr.options = {
              "closeButton": true,
              "debug": false,
              "newestOnTop": false,
              "progressBar": true,
              "rtl": false,
              "positionClass": "toast-top-center",
              "preventDuplicates": false,
              "onclick": null,
              "showDuration": 300,
              "hideDuration": 300,
              "timeOut": timeout || -1,
              "extendedTimeOut": 1000,
              "showEasing": "swing",
              "hideEasing": "linear",
              "showMethod": "fadeIn",
              "hideMethod": "fadeOut"
            }
            if (!type || type == "danger") type = "error"
            var $toast = toastr[type](message);
            return $toast;
        },

        warning: function(message){
            toastr.options = {
              "closeButton": true,
              "debug": false,
              "newestOnTop": false,
              "progressBar": true,
              "rtl": false,
              "positionClass": "toast-top-center",
              "preventDuplicates": false,
              "onclick": null,
              "showDuration": 300,
              "hideDuration": 300,
              "timeOut": 5000,
              "extendedTimeOut": 1000,
              "showEasing": "swing",
              "hideEasing": "linear",
              "showMethod": "fadeIn",
              "hideMethod": "fadeOut"
            }
            var $toast = toastr["warning"](message);
            return $toast;
        },

        confirm: function(message, callback){
            require(['react.modal.confirm'], function(ReactModalConfirmComponent){
                var ReactModalConfirmView = React.createFactory(ReactModalConfirmComponent);
                var reactModalConfirmView = ReactModalConfirmView({
                    showModal: true,
                    backdrop: true,
                    message: message || "Are you sure?",
                    callback: callback
                });
                ReactDOM.unmountComponentAtNode($("#react-modal").get(0))
                ReactDOM.render(reactModalConfirmView, $("#react-modal").get(0));
            })
        },

        onContentChange:function(){
            window.IS_ALERT_SAVE = true;
        },
        
        onContentSave:function(){
            window.IS_ALERT_SAVE = false;
        },

        liveAndDownloadList:[
            {
                name: "大文件下载",
                value: "4"
            }, 
            {
                name: "音视频点播",
                value: "1"
            }, 
            {
                name:"流媒体直播",
                value:"2"
            },
            {
                name: "直播推流加速",
                value: "3"
            },
            {
                name: "小文件下载",
                value: "5"
            }
        ],

        liveAndDownloadListBack:{
            1:"音视频点播",
            2:"流媒体直播",
            3:"直播推流加速",
            4:"大文件下载",
            5:"小文件下载"
        },

        getTimeStampUnit:function(unit){
            var _unit = unit || "s";
            var obj = {
                "y":"年",
                "h":"时",
                "m":"分",
                "s":"秒",
                "ms":"毫秒"
            };
            return obj[_unit];
        }

    };
    return Utility;
});