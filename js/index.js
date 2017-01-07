/**
 * Created by lisa5212 on 2017/1/1.
 */
/*
 * 三、标题内容未做好滑动
 * */

window.onload = function () {
    var data = {
        imgList : [
            {"title":"title1","content":"Some attention grabbing details","src":"image/carousel1.png"},
            {"title":"title2","content":"Some attention grabbing details again","src":"image/carousel2.png"},
            {"title":"title3","content":"Some attention grabbing details and again","src":"image/carousel3.png"},
            {"title":"title4","content":"Some attention grabbing details again and again","src":"image/carousel4.png"},
            {"title":"title5","content":"Some attention grabbing details one more","src":"image/carousel5.png"}
        ]
    };
    var config = {
        id : "explain",
        container : "wrapper",
        inner : "content",
        paging : "paganation",
        prev : "prev",
        next : "next"
    };
    new Carousel(config,data.imgList);
};
function Carousel(_config,dataConfig) {
    this.config = _config;
    this.data = dataConfig;
    this.explain = document.getElementById(_config.id);
    this.wrap = document.getElementById(_config.container);
    this.inner = document.getElementById(_config.inner);
    this.paging = document.getElementById(_config.paging);
    this.prev = document.getElementById(_config.prev);
    this.next = document.getElementById(_config.next);
    this.distance = parseInt(this.getStyle(this.wrap,"width"));//每一次移动的距离
    this.index = 1;/*实际的第一张图片*/
    this.time = 300;
    this.interval = 10;
    this.timer = null;
    this.timer1 = null;
    this.clickFlag = false;//动画函数是否执行
    this.init();
}
Carousel.prototype = {
    init : function () {
        this.creat(this.data);
        this.creatContent(this.data);
        this.creatList(this.data.length);
        this.autoPlay();
    },
    /*创建图片*/
    creat : function (listItem) {
        if (listItem == "")return false;
        var len = listItem.length;
        var  first = "<img src="+listItem[len-1].src+" alt="+listItem[len-1].title+">";
        var  last = "<img src="+listItem[0].src+" alt="+listItem[0].title+">";
        var str = "";
        for (var i = 0;i<len;i++){
            str += "<img src="+listItem[i].src+" alt="+listItem[i].title+">";
        }
        this.inner.innerHTML = first + str + last;
        //初始添加一个left值，因为前面有一张附属图，所以默认要加载到实际的第一张
        this.inner.style.left = (-1)*this.distance+"px";
        this.creatTurn();
    },
    /*创建项目*/
    creatList : function (count) {
        if (count == 0)return false;
        var str = "";
        for (var i=0 ; i<count;i++){
            str += "<span index="+(i+1)+">"+(i+1)+"</span>";
        }
        this.paging.innerHTML = str;
        this.addClass(this.paging.firstElementChild,"selected");
        this.tabChange();
    },
    /*创建说明*/
    creatContent : function (listItem) {
        if (listItem == "")return false;
        var len = listItem.length;
        var first = "<span>"+listItem[len-1].content+"</span>";
        var last = "<span>"+listItem[0].content+"</span>";
        var str = "";
        for (var i = 0;i<len;i++){
            str += "<span>"+listItem[i].content+"</span>";
        }
        this.explain.innerHTML = first + str + last;
        this.explain.style.left = (-1)*this.distance+"px";
    },
    /*添加按钮翻页事件*/
    creatTurn : function () {
        this.wrap.addEventListener("mouseover",function () {
            this.addClass(this.prev,"arrow");
            this.addClass(this.next,"arrow");
            this.stop();
        }.bind(this),false);
        this.wrap.addEventListener("mouseout",function () {
            this.removeClass(this.prev,"arrow");
            this.removeClass(this.next,"arrow");
            this.autoPlay();
        }.bind(this),false);
        this.prev.addEventListener("click",function () {
            /*clearInterval(this.timer);*/
            this.backward();
        }.bind(this),false);
        this.next.addEventListener("click",function () {
            /*clearInterval(this.timer);*/
            this.forward();
        }.bind(this),false);
    },
    /*向右滑动*/
    forward : function () {
        if(this.clickFlag){
            return;
        }
        var w = (-1)*parseInt(this.getStyle(this.wrap,"width"));
        if (this.index == this.paging.childElementCount){
            this.index = 1;
        }else {
            this.index += 1;
        }
        this.slide(w);
        this.showBtn();
    },
    /*向左滑动*/
    backward : function () {
        if(this.clickFlag){
            return;
        }
        var w = parseInt(this.getStyle(this.wrap,"width"));
        if (this.index == 1){
            this.index = this.paging.childElementCount;
        }else {
            this.index -= 1;
        }
        this.showBtn();
        if (!this.clickFlag){
            this.slide(w);
        }

    },
    /*滑动函数,图片和文字一起滑动，且滑动距离相同*/
    slide : function (offset) {
        this.clickFlag = true;
        var _this = this;
        /*上一张left*/
        var l = parseInt(this.getStyle(this.inner,"left"));
        var nodeCount = this.inner.childElementCount;
        /*目标left = 上一张+偏移量*/
        var newLeft = l + offset;
        var time = 300;/*位移中的时间*/
        var interval = 10;/*位移间隔*/
        var speed = offset/(this.time/this.interval);/*每次的位移量*/
        var go = function () {
            /*当前left*/
            var left = parseInt(_this.getStyle(_this.inner,"left"));
            if ((speed > 0 && left < newLeft) || (speed < 0 && left > newLeft)){
                _this.inner.style.left = left+speed+"px";
                _this.explain.style.left = left+speed+"px";
                /*递归*/
                setTimeout(go,_this.interval);
            }else {
                _this.inner.style.left = newLeft+"px";
                _this.explain.style.left = newLeft+"px";
                if (offset < 0 && newLeft < (nodeCount-2)*offset){
                    _this.inner.style.left = offset+"px";
                    _this.explain.style.left = offset+"px";
                }
                if (newLeft> (-1)*offset){
                    _this.inner.style.left = (-1)*(nodeCount-2)*offset+"px";
                    _this.explain.style.left = (-1)*(nodeCount-2)*offset+"px";
                }
                _this.clickFlag = false;
            }
        };
        go();
    },
    /*控制翻页按钮*/
    showBtn : function () {
        var pageNodes = this.paging.children;
        this.clear();
        this.addClass(pageNodes[this.index-1],"selected");
     },
    /*去除class的空格*/
    trim : function (str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    /*说明滑动,暂时有问题*/
    contentSlide : function () {
        var _this = this;
        var time2 = null,time3 = null;
        var oH = 0;
        this.timer1 = setInterval(function () {
            oH++;
            _this.explain.style.height = oH+"px";
            if (oH == 50){
                clearInterval(_this.timer1);
                time2 = setTimeout(function () {
                    time3 = setInterval(function () {
                        oH--;
                        _this.explain.style.height = oH+"px";
                        if (oH == 0){
                            clearInterval(time3);
                        }
                    },10)
                },1500)
            }
        },10)
    },
    /*切换*/
    tabChange : function () {
        var w = parseInt(this.getStyle(this.wrap,"width"));
        var nodes = this.paging.children;//5
        for (var i=0;i<nodes.length;i++){
            var _this = this;
            nodes[i].onclick = function(){
                if (_this.clickFlag){
                    console.log(_this.clickFlag)
                    return;
                }
                if (_this.trim(this.className)=="selected"){
                    return;
                }
                /*这个index从1开始计数，相当于假设最前和最后各有一张*/
                var myIndex = parseInt(this.getAttribute("index"));
                /*切换的偏移量：点第几张切换的就是图片容器除了附属图的实际第几张，因为一头一尾是附属图*/
                var offset = (-1) * w * myIndex;
                _this.index = myIndex;
                _this.clear();
                _this.showBtn();
                _this.inner.style.left = offset + "px";
                _this.explain.style.left = offset + "px";
                /*debugger;*/
            }
        }
     },
    autoPlay : function () {
        var _this = this;
        this.timer = setInterval(function () {
            _this.forward();
            /*_this.contentSlide();*/
        },3000);
    },
    stop : function () {
        clearInterval(this.timer);
        /*clearInterval(this.timer1);*/
    },
    /*获取容器的宽度*/
    getStyle : function(element, attr){
        if(element.currentStyle) {
            return element.currentStyle[attr];
        } else {
            return getComputedStyle(element, false)[attr];
        }
    },
    /*class的相关操作*/
    hasClass : function (obj,className) {
        return obj.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    },
    removeClass : function (obj,className) {
        if (this.hasClass(obj, className)) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            obj.className = obj.className.replace(reg, ' ');
        }
    },
    addClass : function (obj,className) {
        if (obj.className == ""){
            obj.className += className;
        }else {
            if (!this.hasClass(obj, className)) {
                obj.className += " " + className;
            }
        }
    },
    clear : function () {
        var childNodeCount = this.paging.childElementCount;
        for(var i=0;i<childNodeCount;i++){
            this.paging.children[i].className="";
        }
    }
};