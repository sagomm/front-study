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
        shopIconArr: [],
        shopAddIcon: function (iconName, iconTemplate) {
            this.shopIconArr[iconName] = iconTemplate;
        },
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
        toggle.childNodes[0].dispatchEvent(ev);
    }


    // 自动播放的动画，每间隔几秒模拟点击按钮
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
    /**分类事件，每次一个分类按钮触发后，都会发送这样的事件 */
    function ClassIfyEvent() { }

    var _sorts_0 = document.getElementsByClassName('value-sort')[0].childNodes;
    for (var i = 0; i < _sorts_0.length; i++) {
        if (_sorts_0[i].nodeName == 'LI' && _sorts_0[i].className == '' || _sorts_0[i].className == 'active') {
            _sorts_0[i].onclick = _active();
            console.log(_sorts_0[i]);
        }
    }
    /**储存一下，当前的文档的this值 */
    var That = this;
    //对dom类属性的一些操作
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
    /**管理分类的类 */
    function Classify(_start) {
        //储存这个分类的所有可触发按钮
        this.doms = [];
        //为初始化点击事件，等
        this.start = _start.bind(this, this.doms);
        //对应上面按钮的事件，如果按钮被点击，则触发相应事件
        this.actives = [];
    }
    Classify.prototype.addClassify = function (dom, _active) {
        this.doms.push(dom);
        this.actives.push(_active);
        this.start();
    }
    /**保证一个doms中，只有一个被active，对应页面分类中按钮的click样式(默认排序，销量高，评价好) */
    function _active(doms) {
        var last = undefined;
        //防闭包函数
        function _onclick(last) {
            return function (e, last) {
                if (!isHasClass(this, 'active')) {
                    removeClass(last, 'active');
                    addClass(this, 'active');
                    last = this;
                }
            }
        }
        for (i in doms) {
            doms[i].onclick = _onclick(last);
        }
    }

    var sort_0 = new Classify(_active);
    var sort_0_dom = Array.prototype.slice.call(document.getElementsByClassName('sort_0'));
    for (var i in sort_0_dom) {
        console.log(sort_0_dom[i]);
        sort_0.addClassify(sort_0_dom[i], function () { });
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


/**显示出商铺 */
// app.shop.show();





