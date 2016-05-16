/*
* page app
*/
var app = {}

/*
 * 页面的视图模板
 */

app.template = {
    picBanner: {
        img: function (src, num) {
            return '<img src="./images/' + src + '" alt="' + num + '">';
        },
        toggles: function (num) {
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
        shopAddIcon: function (iconName, iconTemplate) {
            this.shopArr[iconName] = iconTemplate;
        },
        shopIconArr: [],
        // 得到整个商店模板
        getShop: function (img, time, title, loaction, sale, startCost, cost, iconArr) {
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
            pictures.innerHTML += app.template.picBanner.img(picarr[i], i);
            toggles.innerHTML += app.template.picBanner.toggles(i);
        }
    }
    // 为页面的按钮绑定图片
    function bindToggles(pics, toggles) {
        var index = 0;
        for (var i = 0; i < toggles.childNodes.length; i++) {
            toggles.childNodes[i].addEventListener('click', _showPicForToggle(pics, index), true);
            index++;
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
        //为input分发点击事件，当初html不该这么写，但是写了就懒得改了
        toggle.childNodes[0].dispatchEvent(ev);
    }


    // 自动播放的动画，没间隔几秒模拟点击按钮
    function animation(pictures, toggles, timeDelay) {
        var _index = currentIndex;
        var picTotals = pictures.childNodes.length;
        (function _partAni() {
            setTimeout(function () {
                showPic(toggles.childNodes[(_index % picTotals)]);
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
 * 页面商店的显示，包括两部分，一部分是商品的列表，一部分是商品的展示部分。
 */

app.shop = (function (document) {
    var shops = document.getElementById('shops');

    /**
     * 对商铺的说明，出现在商铺被hover之后
     */
    function ShopInfo() {

    }

    /**
     * 商铺
     * logo 商标图片 string 
     * time 配送时间 string 
     * title 商铺名称 string 
     * location 商铺位置 string 
     * distance 商铺离用户的距离 string | int
     * sale 一个月售出的的单数 string | int 
     * startCost 起送价格 string | int 
     * cost 配送的费用 string | int 
     * iconArr 商铺下面的标记以及它的说明，出现在对shop,hover之后 
     */
    function Shop(logo, time, title, location, sale, startCost, cost, iconArr, shopIconInfo) {
        this.shopTemplate = '';
    }

    /**
     * 商铺的显示区域
     *　 
     */
    function Shops() {
               
    }

    /**
     * 管理商铺分类的导航
     * 
     */
    function Classify() {
        
    }
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
/**定义商铺中显示的图标 */
app.template.shop.shopAddIcon('减', '<i style="background:#f07373;">减</i>');
app.template.shop.shopAddIcon('首', '<i style="background:#70bc46;">首</i>');
app.template.shop.shopAddIcon('特', '<i style="background:#f1884f;">特</i>');
app.template.shop.shopAddIcon('付', '<i style="background:#fff;color:#FF4E00;border:1px solid;padding:0;">付</i>');
app.template.shop.shopAddIcon('票', '<i style="background:#fff;color:#9071CB;border:1px solid;padding:0;">票</i>');
app.template.shop.shopAddIcon('保', '<i style="background:#fff;color:#4B9A18;border:1px solid;padding:0;">保</i>');
app.template.shop.shopAddIcon('赔', '<i style="background:#fff;color:#FF4E00;border:1px solid;padding:0;">赔</i>');

/**添加商铺 
 * 商铺信息　object 
 */
app.shop.addShop({
    
});

/**显示出商铺 */
app.shop.show();





