/*
* page app
*/
var app = {}

/**
 * 页面的常用操作函数
 */

app.Common = {
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
app.Shop = (function (document) {
    /**
     * 商铺的显示,商铺，商铺的图标，商铺显示的区域
     */
    /**商铺类
     * @param  {string} domId 商铺的编号，在html中为id属性的值
     * @param  {string} title 商铺的名称
     * @param  {string} logo 商铺的logo地址
     * @param  {string} intro 商铺的介绍
     * @param  {float} evaluation 商铺的星级评价(小数)
     * @param  {int} spendTime 商铺配送时间
     * @param  {int} lessMoney 商铺的起送金额
     * @param  {int} takeMoney 商铺的配送金额
     * @param  {string} location 商铺的地点
     * @param  {int} distance 商铺离用户的距离
     * @param  {int} saleInMonth 商铺一个月的营销额度
     * @param  {array} specialArr 商铺的其他信息以及属性，非必要 --> [{属性名字name，属性说明info，属性样式html}] 
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
    Shop.prototype.hiddenInfo = function (shop) {
        var _info = shop.getElementsByClassName('shopInfo')[0];
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
    Shop.prototype.deleteShop = function (shopArea) {
        var dom = document.getElementById(this.id);
        if (dom) {
            shopArea.removeChild(dom);
        }
    }
    //商铺特殊小标的显示，在商铺的info页面上也有，在这里定义相关的属性到类中
    Shop.prototype.setSpecial = function (specialArr) {
        for (var i in specialArr) {
            //为商铺类添加新的属性，表示这样的属性，默认值为true,表示存在这样的标志
            this['isHas' + specialArr[i].name] = true;
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
     * 注册模式
     */
    function ShopArea(dom) {
        this.domInstance = dom;
        //现在正在页面中展示的商铺
        this.currentShops = [];
        //所有添加的商铺
        this.shops = [];
        //注册的所有显示方法[object{string,callback},...]
        this.shopFilter = [];
        //作用在当前页面的Filter方法[string,string,..]
        this.currentFilterState = [];
    }
    /**添加一个Shop类的实例 */
    ShopArea.prototype.addShop = function (shop) {
        if (typeof shop === 'object' && shop.constructor.name === 'Shop') {
            this.shops.push(shop);
        } else {
            throw new TypeError('shop type error');
        }
    }
    /**添加一个商铺的分类状态 */
    ShopArea.prototype.addShopFilter = function (name, callback) {
        if (typeof callback === 'function' && typeof name === 'string') {
            this.shopFilter.push({
                name: name,
                callback: callback
            });
        } else {
            throw new TypeError('name && callback must be defined');
        }

    }
    /** 删除一个商铺的分类状态*/
    ShopArea.prototype.removeShopFilterState = function (filterName) {
        for (var i in this.currentFilterState) {
            if (this.currentFilterState[i] === filterName) {
                this.currentFilterState.splice(i, 1);
                this.updatePage();
                break;
            }
        }
    }
    /**添加一个商铺区域的分类状态*/
    ShopArea.prototype.addShopFilterState = function (filterName) {
        if (this.shops.length === 0 || this.shop.shopFilter.length === 0) { return; }
        for (var i in this.shopFilter) {
            if (this.shopFilter[i].name === filterName) {
                this.currentFilterState.push(shopFilter[i].name);
                this.updatePage();
                break;
            };
        }
    }
    /**更新商铺在页面中的显示区域 */
    ShopArea.prototype.updatePage = function () {
        //清空当前显示的商铺
        this.currentShops.length = 0;
        for (var i in this.currentFilterState) {
            for (var j in this.shopFilter) {
                if (this.shopFilter[i].name === this.currentFilterState[i]) {
                    this.shooFilter[i].callback(this.currentShops, this.shops);
                }
            }
        }
        for (var i in this.currentShops) {
            currentShops[i].show(this.domInstance);
        }
    }
    /**
     * 管理商铺分类的类
     * 同一个分类中，只有一个能被active出来
     */
    function Classify(doms) {
        if (Array.isArray(doms) && doms.length !== 0) {
            this.doms = doms;
            //上一个acitve的dom
            this.last = this.doms[0];
            this.curren = this.doms[0];
            //定义函数表示在active的回调函数
            this.onCurrent = undefined;
        } else {
            throw new TypeError('arg is not dom Array or arg is empty');
        }
    }
    Classify.prototype.setCurrent = function (dom) {
        if (this.doms.indexOf(dom) !== -1) {
            this.current = dom;
            if (this.currenOn == 'undefined') {
                throw new referenceError('currenOn function must be defined');
            } else {
                this.currenOn(this.current, this.last, this.doms);
            }
        }
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
app.Event = function (obj) {
    if (typeof obj !== 'object') {
        this.obj = obj;
        this.events = [];
    } else {
        throw new TypeError('arg is not object');
    }

}
app.Event.prototype.send = function (name, arg) {
    for (var i in events) {
        if (events[i].name === name && event[i].callback) {
            events[i].callback(this.obj, arg);
            break;
        }
    }
}
app.Event.prototype.addEventListener = function (name, callback) {
    if (typeof callback === 'function' && typeof name === 'string') {
        this, observer.push({
            name: name,
            callback: callback
        })
    } else {
        throw new TypeError('arg type error');
    }
}