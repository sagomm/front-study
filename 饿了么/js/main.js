/*
* page app
*/
var app = {}

/*
 * 页面的视图模板
 */

app.template = {
    picBanner: {
        getImg: function (src, num) {
            return '<img src="./images/' + src + '" alt="' + num + '">';
        },
        getToggles: function (num) {
            if (num == 0) {
                return '<li><input name="picBanner" type="radio" checked><a href="#">' + 1 + '</a></li>';
            } else {
                return '<li><input name="picBanner" type="radio" ><a href="#">' + (parseInt(num) + 1) + '</a></li>';
            }
        }
    },
    shop: {
        shopImg: function (image) {
            return '<img class="logo" src="./images/' + image + '">';
        },
        shopTime: function (time) {
            return '<span class="timeinfo">' + time + ' 分钟</span>';
        },
        shopTitle: function (title, location) {
            return '<div class="title">' + title + '(' + Location + ')</div>';
        },
        shopSales: function (sale) {
            return '<div class="sales">月售' + sale + '单</div>';
        },
        shopTake: function (startCost, cost) {
            return '<div class="take-out-info">' + startCost + '起送 / 配送费' + cost + '元</div>';
        },
        // 注册商店下面的小图标
        shopIconArr: [],
        shopAddIcon: function (iconName, iconTemplate) {
            this.shopIconArr[iconName] = iconTemplate;
        },
        // 得到整个商店模板
        getShop: function (title, img, time, loaction, sale, startCost, cost, iconArr) {
            var shopIcons = undefined;
            for (i in iconArr) {
                shopIcons += this.shopIconArr[iconArr[i]];
            }
            var left = '<div　class="shop"><div class="left">' + this.shopImg(img) + this.shopTime(time) + '</div>';
            var right = '<div class="right">' + this.shopTitle(title, location) + '<div class="star-sales"><span class="star-base icon icon-star"><i class="icon icon-star"></i></span>' + this.shopSales(sale) + '</div>' + shopTake(startCost, cose) + '<div class="icons">' + shopIcons + '</div></div>';
            var shop = left + right;
            return shop;
        }
    },
    /**在页面中对shop hover之后出现的说明模块的模板 */
    shopInfo: {
        shopTitle: function (title) {
            return '<div class="shopTitle">' + title + '</div>';
        },
        takeSale: function (lessMoney, cost, sendTime) {
            return '<div class="takeaway-sale"><span><em>' + lessMoney + '</em>元起送</span><span>配送费用<em>' + cost + '</em>元</span><span>平均<em>' + sendTime + '</em>分钟送达</span></div>';
        },
        shopIntro: function (intro) {
            return '<div class="shopIntro">' + intro + '</div>';
        },
        getShopInfo: function (iconArr) {
                
            return '';
        }
    }
}


/** 
* 图片轮播
*/
app.picBanner = (function (document) {
    //定义当前被点击按钮的索引,因为已开是第一个张图片就显示了，所以从一开始
    var currentIndex = 1;
    // 拿到模板代码，填充数据到页面中
    function create(pictures, toggles, picarr) {
        for (var i in picarr) {
            pictures.innerHTML += app.template.picBanner.getImg(picarr[i], i);
            toggles.innerHTML += app.template.picBanner.getToggles(i);
        }
    }
    // 为页面的按钮绑定图片
    function bindToggles(pics, toggles) {
        for (var i = 0; i < toggles.children.length; i++) {
            toggles.children[i].addEventListener('click', _showPicForToggle(pics, i), true);
        }
    }
    // 防止闭包的临时函数
    function _showPicForToggle(pics, index) {
        return function () {
            pics.style.marginTop = -102 * index + 'px';
            currentIndex = index;
        }
    }
    // 模拟点击按钮事件
    function showPic(toggle) {
        var ev = document.createEvent('MouseEvents');
        ev.initEvent('click', true, true);
        toggle.children[0].dispatchEvent(ev);
    }


    // 自动播放的动画，每间隔几秒模拟点击按钮
    function animation(pictures, toggles, timeDelay) {
        var _index = currentIndex;
        var picTotals = pictures.children.length;
        (function _partAni() {
            setTimeout(function () {
                showPic(toggles.children[(_index % picTotals)]);
                _index = _index % picTotals;
                currentIndex = ++_index;
                _partAni();
            }, timeDelay);
        })();
    }

    return {
        /**初始化函数 */
        init: function (banner, pics, timeDelay) {
            var pictures = banner.getElementsByClassName('pictures')[0];
            var toggles = banner.getElementsByClassName('toggles')[0];
            create(pictures, toggles, pics);
            bindToggles(pictures, toggles);
            animation(pictures, toggles, 3000 || timeDelay);
        }
    }
})(window.document)

/**
 * 页面商店部分
 * 包括商店导航栏，对商店进行分类的一些按钮
 * 包括商店的显示部分，对根据导航条的状态显示商店
 */
app.shop = (function (document) {
    /**
     * 一些分类按钮样式的设置,用事件机制通知页面应该显示出那些商店
     */
    /**对页面中dom的类名的操作，是否存在，添加类名字，删除类名字 */
    function isHasClass(element, className) {
        if (element) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            return element.className.match(reg);
        }
    }
    function addClass(element, className) {
        if (!isHasClass(element, className)) {
            element.className += " " + className;
        }
    }
    function removeClass(element, className) {
        console.log(element);
        if (isHasClass(element, className)) {
            console.log(element);
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            element.className = element.className.replace(reg, ' ');
        }
    }
    /**
     * 管理商铺分类的类
     */
    function Classify(_start) {
        //储存这个分类的所有可触发按钮
        this.doms = [];
        //这个回调是为了对这些按钮进行基本的样式设置，比如只1个按钮能focus
        this.start = _start.bind(this, this.doms);
        //储存这个分类所有的可触发按钮触发的回调函数，通知页面显示相应的商铺商铺元素
        this.actives = [];
    }
    Classify.prototype.addClassify = function (dom, _active) {
        this.doms.push(dom);
        this.actives.push(_active);
    }
    /**
     * 商铺的显示
     */
        /**商铺类
         * id：商铺的编号，在html中为id属性的值
         * titel:商铺的名称
         * logo:商铺的logo地址
         * intro:商铺的介绍
         * evaluate:商铺的星级评价[0-5]
         * spendTime:商铺配送时间
         * lessMoney:商铺的起送金额
         * location:商铺的地点
         * distance:商铺离用户的距离
         * saleInMonth：商铺一个月的营销额度
         * Special [Object]: 商铺的其他信息，非必要
         */
    function Shop(id, title, logo, intro, evaluate, spendTime, lessMoney, location, distance, saleInMonth, Special) {
        this.title = title;
        this.logo = logo;
        this.intro = intro;
        this.evaluate = evaluate;
        this.spendTime = spendTime;
        this.lessMoney = lessMoney;
        this.sendMondy = sendMondy;
        this.location = location;
        this.saleInMonth = saleInMonth;
        this.distance = distance;
        this.Special = Special;
        this.instanceHTML = app.template.shop.getShop(title, img, time, loaction, sale, startCost, cost, iconArr);
        this.id = id;
    }
    Shop.prototype.show = function (shopArea) {
        shopArea.innerHTML += this.instance;
        var dom = shopArea.getElementById(this.id);
        dom.onmouseover = function () {
            setTimeout(function () {
                this.getElementsByClassName('shopInfo')[0].style.display = 'block';
            }.bind(this), 100);
        };
        dom.onmouseout = function () {
            this.sytle.display = 'none';
        }
    }
    Shop.prototype.getHTML = function () {
        //得到html代码，在这里定义一些其他参数的配饰
        this, instanceHTML = app.template.shop.getShop();
    }
    Shop.prototype.hidden = function (shopArea) {
        var dom = shopArea.getElementById(this.id);
        if (dom) {
            shopArea.removeChild(dom);
        }
    }

    /**
     * 商铺的显示区域
     * 填充商铺数据到页面中
     * 根据页面的按钮配置商铺的显示方式
     */
    function ShopArea() {
        //现在正在页面中展示的商铺
        this.currentShops = [];
        //所有添加的商铺
        this.shops = [];
    }
    ShopArea.prototype.addShop = function (shop) {
        this.currentShops.push(shop);
    }
    ShopArea.prototype.showAllShop = function () {

    }
    ShopArea.prototype.changeCurrentShops = function () {

    }
    /**
     * 下面的代码开始初始化几个分类
     * 0.默认排序到起送金额这类，在页面中用sort_0标注
     * 1.起送价格这个分类，在页面中用sort_1标注
     * 2.蜂鸟快松到在线支付这个类，在页面中用sort_2标注
     */
    var sort_0 = new Classify(function (doms) {
        var last = doms[0];
        //防止闭包的临时函数
        function _onclick() {
            if (!isHasClass(this, 'active')) {
                removeClass(last, 'active');
                addClass(this, 'active');
                last = this;
            }
        }
        for (i in doms) {
            doms[i].onclick = _onclick;
        }
    });
    var sort_1 = new Classify(function (doms) {
        var showClassify = document.getElementById('showClassify');
        var last = doms[0];
        //防止闭包的临时函数
        function _onclick() {
            if (!isHasClass(this, 'active')) {
                removeClass(last, 'active');
                addClass(this, 'active');
                last = this;
                showClassify.innerHTML = '起送价格: ' + this.innerHTML;
            }
        }
        for (i in doms) {
            doms[i].onclick = _onclick;
        }
    });
    var sort_3 = new Classify(function (doms) {
        function _onclick() {
            var ev = document.createEvent('MouseEvents');
            ev.initEvent('click', true, true);
            this.children[0].dispatchEvent(ev);
        }
        for (i in doms) {
            doms[i].onclick = _onclick;
        }
    });

    var sort_0_dom = Array.prototype.slice.call(document.getElementsByClassName('sort_0'));
    var sort_1_dom = Array.prototype.slice.call(document.getElementsByClassName('sort_1'));
    var sort_2_dom = Array.prototype.slice.call(document.getElementsByClassName('sort_2'));
})(window.document);



/*******************************
 * 模拟数据填充，
 * 先是图片部分，再是商铺部分
 * 因为没有后台，这些数据相当于后台准备给前端ajax发送的数据
 * 这些数据会放入缓存区域
 * 缓存区域用于模拟页面瀑布流
 ********************************/

// 初始化图片轮播部分
app.picBanner.init(document.getElementById('picBanner'), ['1.png', '2.png', '3.png']);

// 初始化页面商铺们
 /**定义商铺中显示的图标 
 *　图标的类型，图标的样式，图标的说明 
 */
app.template.shop.shopAddIcon('减', '<i style="background:#f07373;">减</i>','在线支付满２８减８，满６０减１６(<span style="color:red;">手机客户端专享</span>)');
app.template.shop.shopAddIcon('首', '<i style="background:#70bc46;">首</i>','(不与其他活动同享)新用户下单首减１３元(<span style="color:red;">手机客户端专享</span>)');
app.template.shop.shopAddIcon('特', '<i style="background:#f1884f;">特</i>','');
app.template.shop.shopAddIcon('付', '<i style="background:#fff;color:#FF4E00;border:1px solid;padding:0;">付</i>');
app.template.shop.shopAddIcon('票', '<i style="background:#fff;color:#9071CB;border:1px solid;padding:0;">票</i>');
app.template.shop.shopAddIcon('保', '<i style="background:#fff;color:#4B9A18;border:1px solid;padding:0;">保</i>');
app.template.shop.shopAddIcon('赔', '<i style="background:#fff;color:#FF4E00;border:1px solid;padding:0;">赔</i>');

/**添加商铺 
 * 商铺信息　object 
 */


/**显示出商铺 */
// app.shop.show();
var shop = document.getElementsByClassName('shop')[1];
var info = document.getElementsByClassName('shopInfo')[1];
var shops = document.getElementsByClassName('shops')[0];
var id = undefined;

function show(dom){
    var offset = dom.parentNode.offsetWidth-dom.parentNode.offsetLeft + dom.offsetLeft + dom.offsetWidth;
    /**计算出距离，一个是视窗的Y距离，一个是距离视窗的X距离 */
    if(offset < dom.offsetWidth){
        //左边显示
        console.log(1);
    }     
}


shop.addEventListener('mouseleave',function(e){
    clearTimeout(id);
    id = undefined;
    info.style.display = 'none';
},false);
shop.addEventListener('mouseover',function(e){
    if(id){
        return;
    }else{
        id = setInterval(function(){
            show(info);
        },300);
    }
},false);

