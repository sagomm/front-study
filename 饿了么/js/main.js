/*
* page app
*/
var app = {}

/**
 * 页面的常用操作函数
 */

app.common = {
    isHasClass: function (element, className) {
        if (element) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            return element.className.match(reg);
        }
    },
    addClass: function (element, className) {
        if (!this.isHasClass(element, className)) {
            element.className += " " + className;
        }
    },
    removeClass: function (element, className) {
        if (this.isHasClass(element, className)) {
            console.log(element);
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            element.className = element.className.replace(reg, ' ');
        }
    }
}
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
        shopImg: function (logo) {
            return '<img class="logo" src="./images/' + logo + '">';
        },
        shopTime: function (spendTime) {
            return '<span class="timeinfo">' + spendTime + ' 分钟</span>';
        },
        shopTitle: function (shopTitle, location) {
            return '<div class="title">' + shopTitle + '(' + location + ')</div>';
        },
        shopSales: function (saleInMonth) {
            return '<span class="sales"> 月售' + saleInMonth + '单</span>';
        },
        shopTake: function (lessMoney, takeMoney) {
            return '<div class="take-out-info">' + lessMoney + '起送 / 配送费' + takeMoney + '元</div>';
        },
        shopInfo: function (shopTitle, lessMoney, takeMoney, spendTime, shopIntro, iconArr) {
            var _title = '<div class="shopTitle">' + shopTitle + '</div>';
            var _takeSale = '<div class="takeaway-sale"><span><em>' + lessMoney + '</em>元起送</span><span class="sperator">|</span><span>配送费用<em>' + takeMoney +
                '</em>元</span><span class="sperator">|</span><span>平均<em>' + spendTime + '</em>分钟送达</span></div>';
            var _shopIcon = '';
            for (var i in iconArr) {
                _shopIcon += '<div class="shopIcon">' + iconArr[i].html + iconArr[i].info + '</div>';
            }
            var _shopIntro = '<div class="shopIntro">' + shopIntro + '</div>';
            return '<div class="shopInfo">' + _title + _shopIcon + _takeSale + _shopIntro + '</div>';
        },
        // 得到整个商店模板
        getShop: function (domId, title, logo, intro, evaluation, spendTime, lessMoney, takeMoney, location, saleInMonth, specialArr) {
            var _left = '<div class="shop" id= "' + domId + '"><div class="left">' + this.shopImg(logo) + this.shopTime(spendTime) + '</div>';
            var _icons = '';
            for (var i in specialArr) {
                _icons += specialArr[i].html + ' ';
            }
            var _right = '<div class="right">' + this.shopTitle(title, location) + '<div class="star-sales"><span class="star-base icon icon-star"><i class="icon icon-star"></i></span>' +
                this.shopSales(saleInMonth) + '</div>' +
                this.shopTake(lessMoney, takeMoney) +
                '<div class="icons">' + _icons + '</div></div>';
            var _shopInfo = this.shopInfo(title, lessMoney, takeMoney, spendTime, intro, specialArr);
            var shop = _left + _right + _shopInfo;
            return shop;
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
     * 商铺的显示,商铺，商铺的图标，商铺显示的区域
     */
    /**商铺类
     * dimId[String]：商铺的编号，在html中为id属性的值
     * titel[String]:商铺的名称
     * logo[String]:商铺的logo地址
     * intro[String]:商铺的介绍
     * evaluation[Float]:商铺的星级评价(小数)
     * spendTime[Int]:商铺配送时间
     * lessMoney[Int]:商铺的起送金额
     * takeMoney[Int]:商铺的配送金额
     * location[String]:商铺的地点
     * distance[Int]:商铺离用户的距离
     * saleInMonth[Int]：商铺一个月的营销额度
     * Special [Array]: 商铺的其他信息以及属性，非必要 --> [{属性名字name，属性说明info，属性样式html}] 
     */
    function Shop(domId, title, logo, intro, evaluation, spendTime, lessMoney, takeMoney, location, distance, saleInMonth, specialArr) {
        this.title = title;
        this.logo = logo;
        this.intro = intro;
        this.evaluation = evaluation;
        this.spendTime = spendTime;
        this.lessMoney = lessMoney;
        this.takeMoney = takeMoney;
        this.location = location;
        this.saleInMonth = saleInMonth;
        this.distance = distance;
        this.html = app.template.shop.getShop(domId, title, logo, intro, evaluation, spendTime, lessMoney, takeMoney, location, saleInMonth, specialArr);
        this.domId = domId;
        //将Special属性放入类中
        this.setSpecial(specialArr);
    }
    /**
     * 显示hover出来的商铺信息
     */
    Shop.prototype.showInfo = function (shop) {
        var dom = shop.getElementsByClassName('shopInfo')[0];
        var offsetRight = dom.parentNode.offsetWidth + dom.parentNode.offsetLeft - dom.offsetLeft - dom.offsetWidth;
        /**计算出距离，一个是视窗的Y距离，一个是距离视窗的X距离 */
        if (offsetRight < dom.offsetWidth) {
            //在shop左边显示
            app.common.addClass(dom, 'shopInfo-left');
        } else {
            app.common.addClass(dom, 'shopInfo-right');
        };
        if (document.documentElement.clientHeight - shop.getBoundingClientRect().y > 2 * shop.offsetHeight) {
            //从底部向上显示
            app.common.addClass(dom, 'shopInfo-top');
        } else {
            app.common.addClass(dom, 'shopInfo-bottom');
        };
        dom.style.display = 'block';
    }
    /**
     * 隐藏hover出来的商铺信息
     */
    Shop.prototype.hiddenInfo = function (dom) {
        var _info = dom.getElementsByClassName('shopInfo')[0];
        _info.className = 'shopInfo';
        _info.style.display = 'none';
    }
    /**
     * 为商铺设置评分,必须在加载后才能调用
     */
    Shop.prototype.setEvaluation = function (dom, evaluation) {
        var eva_star = dom.getElementsByClassName('star-sales')[0];
        eva_star.style.width = evaluation * eva_star.offsetWidth;
    }
    /**
     * 将商铺加载到显示区域中，在页面中显示
     */
    Shop.prototype.show = function (shopArea) {
        shopArea.innerHTML += this.html;
        var domInstance = document.getElementById(this.domId);
        //设置该商铺的评分样式
        this.setEvaluation(domInstance, this.evaluation);
        //延迟控制hover出来的商铺信息
        var _id = undefined;
        domInstance.addEventListener('mouseleave', function (e) {
            clearTimeout(_id);
            _id = undefined;
            this.hiddenInfo(domInstance);
        }.bind(this), false);
        domInstance.addEventListener('mouseover', function (e) {
            if (_id) {
                return;
            } else {
                _id = setTimeout(function () {
                    this.showInfo(domInstance);
                }.bind(this), 300);
            }
        }.bind(this), false);
    }
    /**
     * 将商铺从显示区域中删除
     */
    Shop.prototype.hidden = function (shopArea) {
        var dom = document.getElementById(this.id);
        if (dom) {
            shopArea.removeChild(dom);
        }
    }
    //商铺特殊小标的显示，在商铺的info页面上也有，在这里定义相关的属性到类中
    Shop.prototype.setSpecial = function (specialArr) {
        for (var i in specialArr) {
            //为商铺类添加新的属性，表示这样的属性，默认值为true,表示存在这样的标志
            this['isHas'+specialArr[i].name] = true;
        }
    }
    /**
     * 商铺下面的小标icon类，
     * 商铺类最后一个参数数组中定义对象
     */
    function SpecialIcon(name, html, info) {
        this.html = html;
        this.info = info;
        this.name = name;
    }
    /**
     * 商铺的显示区域
     * 填充商铺数据到页面中
     * 根据页面的按钮配置商铺的显示方式
     */
    function ShopArea(dom) {
        this.domInstance = dom;
        //现在正在页面中展示的商铺
        this.currentShops = [];
        this.currentShopsHtml = '';
        //所有添加的商铺
        this.shops = [];
        //所有的注册方法
        this.shopFilter = [];
    }
    ShopArea.prototype.addShop = function (shop) {
        this.shops.push(shop);
    }
    ShopArea.prototype.addShopFilter = function (name,callback) {
        this.shopFilter.push({
            name : name,
            callback : callback             
        });
    }
    ShopArea.prototype.show = function(filter){
        for(var i in this.shopFilter){
            if(this.shopFilter[i].name == filter){
                this.shopFilter[i].callback();
            };
        }
    }
    /**
     * 管理商铺分类的类
     */
    function Classify() {
        //储存这个分类的所有可触发按钮
        this.doms = [];
    }
    Classify.prototype.addClassify = function (dom) {
        this.doms.push(dom);
    }
    return {
        SpecialIcon: SpecialIcon,
        Shop: Shop,
        Classify: Classify,
        ShopArea: ShopArea
    }

})(window.document);

/**
 * 简单发布订阅模式
 */
app.Event = function(obj){
    this.obj = obj;
    this.events = [];                
}
app.Event.prototype.send = function(name,arg){
    for(var i in events){
        if(events[i].name === name) {
            events[i].callback(this.obj,arg);
            break;
        }
    }          
}
app.Event.prototype.addEventListener = function (name,callback) {
    this,observer.push({
        name: name,
        callback: callback    
    })                  
}



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


/**添加商铺 
 * 商铺信息　object 
 */


/**显示出商铺 */
// app.shop.show();
var shop = document.getElementsByClassName('shop')[3];
var info = document.getElementsByClassName('shopInfo')[1];
var shops = document.getElementsByClassName('shops')[0];

var Classify = app.shop.Classify;
var Shop = app.shop.Shop;
var SpecialIcon = app.shop.SpecialIcon;
var ShopArea = app.shop.ShopArea;



// domId, title, logo, intro, evaluation, spendTime, lessMoney, takeMoney, location, distance, saleInMonth, specialArr



/**
 * 初始化一个数组，储存shop中出现的小标
 */
var icons = [];
icons.push(new SpecialIcon('jian', '<i style="background:#f07373;">减</i>', '在线支付满28减8,满60减16<span style="color:red;">(手机客户端专享)</span>'));
icons.push(new SpecialIcon('shou', '<i style="background:#70bc46;">首</i>', '(不与其他活动同享)新用户下单首减13元<span style="color:red;">(手机客户端专享)</span>'));
icons.push(new SpecialIcon('te', '<i style="background:#f1884f;">特</i>', '东西买一送一了，速来抢购'));
icons.push(new SpecialIcon('fu', '<i style="background:#fff;color:#FF4E00;border:1px solid;padding:1px;">付</i>', '可使用支付宝微信手机QQ在线支付'));
icons.push(new SpecialIcon('piao', '<i style="background:#fff;color:#9071CB;border:1px solid;padding:1px;">票</i>', '该商家支持发票请在下单时候填好发票开头'));
icons.push(new SpecialIcon('bao', '<i style="background:#fff;color:#4B9A18;border:1px solid;padding:1px;">保</i>', '已经加入国家外卖宝计划，食品安全有保证'));

// var s = new Shop('shop_1', 'fdafdaf', 'shop.jpeg', 'fdafdafdsaf', 0.8, 23, 25, 6, 'fdafd', 30, 2, [icons[1], icons[3], icons[4]]);
// var shops = document.getElementsByClassName('shops')[0];
// s.show(shops);



/***********************************************
 * 下面的代码开始初始化几个分类:
 * 0.默认排序到起送金额这类，在页面中用classify_0标注
 * 1.起送价格这个分类，在页面中用classify_1标注
 * 2.蜂鸟快松到在线支付这个类，在页面中用classify_2标注
 ************************************************/
var classify_0 = new Classify();
var classify_1 = new Classify();
var classify_2 = new Classify();
//为分类添加元素
var sort_0_dom = Array.prototype.slice.call(document.getElementsByClassName('classify_0'));
var sort_1_dom = Array.prototype.slice.call(document.getElementsByClassName('classify_1'));
var sort_2_dom = Array.prototype.slice.call(document.getElementsByClassName('classify_2'));

var classify_0_clickEvent = new app.Event({
    lastNode : undefined,
    dropClickList : document.getElementsByClassName('')
});
clickEvent_0.addEventListener('click',function(obj,arg) {
    arg.addClass('active');      
    shops.show(arg);                  
});
clickEvent_0.addEventListener('dropDownclick',function(obj,arg) {
    arg.addClass('active');  
    shops.show(arg);                      
});









for(var i in sort_0_dom){sort_0.addClassify(sort_0_dom[i]);}
for(var i in sort_1_dom){sort_0.addClassify(sort_0_dom[i]);}
for(var i in sort_2_dom){sort_0.addClassify(sort_0_dom[i]);}

function fd(doms) {
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
}
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



// 把商铺的显示类做好，给它添加事件监听，显示商铺样式