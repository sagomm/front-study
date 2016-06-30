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
        if (!app.Common.isHasClass(element, className)) {
            element.className += " " + className;
        }
    },
    removeClass: function (element, className) {
        if (app.Common.isHasClass(element, className)) {
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
        shopImg: function (shopLogo) {
            return '<img class="logo" src="./images/' + shopLogo + '">';
        },
        shippingTime: function (shippingTime) {
            return '<span class="timeinfo">' + shippingTime + ' 分钟</span>';
        },
        shopTitle: function (shopName, location) {
            return '<div class="title">' + shopName + '(' + location + ')</div>';
        },
        salePerMonth: function (salePerMonth) {
            return '<span class="sales"> 月售' + salePerMonth + '单</span>';
        },
        shipping: function (lessShippingMoney, shippingMoney) {
            return '<div class="take-out-info">' + lessShippingMoney + '起送 / 配送费' + shippingMoney + '元</div>';
        },
        shopInfo: function (shopName, lessShippingMoney, shippingMoney, shippingTime, shopIntro, iconArr) {
            var _title = '<div class="shopTitle">' + shopName + '</div>';
            var _takeSale = '<div class="takeaway-sale"><span><em>' + lessShippingMoney + '</em>元起送</span><span class="sperator">|</span><span>配送费用<em>' +
                shippingMoney + '</em>元</span><span class="sperator">|</span><span>平均<em>' + shippingTime + '</em>分钟送达</span></div>';
            var _shopIcon = '';
            for (var i in iconArr) {
                if (iconArr[i].html) {
                    _shopIcon += '<div class="shopIcon">' + iconArr[i].html + iconArr[i].info + '</div>';
                }

            }
            var _shopIntro = '<div class="shopIntro">' + shopIntro + '</div>';
            return '<div class="shopInfo">' + _title + _shopIcon + _takeSale + _shopIntro + '</div>';
        },
        // 得到整个商店模板
        getShop: function (shopId, shopName, shopLogo, shopIntro, shopRate, shippingTime, lessShippingMoney, shippingMoney, location, distance, salePerMonth, specialArr) {
            var _icons = '';

            for (var i in specialArr) {
                if (specialArr[i].html) {
                    _icons += specialArr[i].html + ' ';
                }
            }
            var _left = '<div class="left">' + this.shopImg(shopLogo) + this.shippingTime(shippingTime) + '</div>';
            var _right = '<div class="right">' + this.shopTitle(shopName, location) + '<div class="star-sales"><span class="star-base icon icon-star"><i class="icon icon-star"></i></span>' +
                this.salePerMonth(salePerMonth) + '</div>' +
                this.shipping(lessShippingMoney, shippingMoney) +
                '<div class="icons">' + _icons + '</div></div>';
            var _shopInfo = this.shopInfo(shopName, lessShippingMoney, shippingMoney, shippingTime, shopIntro, specialArr);
            var shop = '<div class="shop" id="'+shopId+'"><div class="shop-wrap">'+ _left + _right + '</div>' + _shopInfo+ '</div>';
            return shop;
        }
    }
}


/** 
* 图片轮播
*/
app.picBanner = (function (document) {
    // 定义当前被点击按钮的索引,因为已开是第一个张图片就显示了，所以从一开始
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
        toggle.children[0].dispatchEvent(ev);s
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
})(window.document);

/**
 * 页面商店部分
 * 包括商店导航栏，对商店进行分类的一些按钮
 * 包括商店的显示部分，对根据导航条的状态显示商店
 */
app.Shop = (function (document) {
    /**
     * @param  {string} shopId - 商铺的编号，在html中为id属性的值
     * @param  {string} shopName - 商铺的名称
     * @param  {string} shopLogo - 商铺的logo地址
     * @param  {string} shopIntro - 商铺的介绍
     * @param  {float} shopRate - 商铺的星级评价(小数)
     * @param  {int} shippingTime - 商铺配送时间
     * @param  {int} lessShippingMoney - 商铺的起送金额
     * @param  {int} shippingMoney - 商铺的配送金额
     * @param  {string} location - 商铺的地点
     * @param  {int} distance - 商铺离用户的距离
     * @param  {int} salePerMonth - 商铺一个月的营销笔数
     * @param  {array} specialArr - 商铺的非必要信息 --> [{属性名字name，属性说明info，属性样式html}] 
     */
    /**
     * @class
     * @classdesc 商铺的信息类用这个对象封装
     * @param {json} ShopInfo 
     */
    function Shop(ShopInfo) {
        if (!this.checkShopInfo(ShopInfo)) return;
        this.shopId = ShopInfo.shopId;
        this.shopName = ShopInfo.shopName;
        this.shopLogo = ShopInfo.shopLogo;
        this.shopIntro = ShopInfo.shopIntro;
        this.shopRate = ShopInfo.shopRate;
        this.shippingTime = ShopInfo.shippingTime;
        this.lessShippingMoney = ShopInfo.lessShippingMoney;
        this.shippingMoney = ShopInfo.shippingMoney;
        this.location = ShopInfo.location;
        this.salePerMonth = ShopInfo.salePerMonth;
        this.distance = ShopInfo.distance;
        this.html = app.template.shop.getShop(ShopInfo.shopId, ShopInfo.shopName, ShopInfo.shopLogo,
            ShopInfo.shopIntro, ShopInfo.shopRate, ShopInfo.shippingTime, ShopInfo.lessShippingMoney,
            ShopInfo.shippingMoney, ShopInfo.location, ShopInfo.distance, ShopInfo.salePerMonth, ShopInfo.specialArr);
        // 将Special属性放入类中
        this.setSpecial(ShopInfo.specialArr);
    }
    // 检查传入的参数是否是合法的
    Shop.prototype.checkShopInfo = function (ShopJson) {
        if (typeof ShopJson.shopId !== 'number') { throw new TypeError('shop arguement number error') }
        if (typeof ShopJson.shopName !== 'string') { throw new TypeError('shop arguement string error') }
        if (typeof ShopJson.shopLogo !== 'string') { throw new TypeError('shop arguement shopLogo error') }
        if (typeof ShopJson.shopIntro !== 'string') { throw new TypeError('shop arguement  shopIntro error') }
        if (typeof ShopJson.shopRate !== 'number' || ShopJson.rate > 1 || ShopJson.rate < 0) { throw new TypeError('shop arguement shopRate error') }
        if (typeof ShopJson.shippingTime !== 'number') { throw new TypeError('shop arguement shippingTime error') }
        if (typeof ShopJson.lessShippingMoney !== 'number') { throw new TypeError('shop arguement lessShippingMoney error') }
        if (typeof ShopJson.location !== 'string') { throw new TypeError('shop arguement location error') }
        if (typeof ShopJson.salePerMonth !== 'number') { throw new TypeError('shop arguement salePerMonth error') }
        if (typeof ShopJson.distance !== 'number') { throw new TypeError('shop arguement distance error') }
        if (typeof ShopJson.shippingMoney !== 'number') {throw new TypeError('shipping arguement error')}
        if (!Array.isArray(ShopJson.specialArr)) {throw new TypeError('specialArr error')};
        return true;
    }
    // 显示hover出来的商铺信息
    Shop.prototype.showInfo = function (dom) {
        var shop = dom;
        var dom = shop.getElementsByClassName('shopInfo')[0];
        var offsetRight = shop.parentNode.offsetWidth + shop.parentNode.offsetLeft - shop.offsetLeft - shop.offsetWidth;
        // 计算出距离，一个是视窗的Y距离，一个是距离视窗的X距离 
        if (offsetRight < shop.offsetWidth) {
            // 在shop左边显示
            app.Common.addClass(dom, 'shopInfo-left');
        } else {
            app.Common.addClass(dom, 'shopInfo-right');
        };
        if (document.documentElement.clientHeight - shop.getBoundingClientRect().y > 2 * shop.offsetHeight) {
            // 从底部向上显示
            app.Common.addClass(dom, 'shopInfo-top');
        } else {
            app.Common.addClass(dom, 'shopInfo-bottom');
        };
        dom.style.display = 'block';
    }
    // 隐藏hover出来的商铺信息
    Shop.prototype.hiddenInfo = function (dom) {
        var _info = dom.getElementsByClassName('shopInfo')[0];
        _info.className = 'shopInfo';
        _info.style.display = 'none';
    }
    // 为商铺设置评分,必须在加载后才能调用
    Shop.prototype.setEvaluation = function (dom, rate) {
        var eva_star = dom.getElementsByClassName('star-sales')[0].getElementsByTagName('i')[0];
        eva_star.style.width = rate * 100 + '%';
    }
    // 将商铺加载到显示区域中，在页面中显示
    Shop.prototype.show = function (shopArea) {
        shopArea.innerHTML += this.html;
    }
    // 将商铺从显示区域中删除
    Shop.prototype.deleteShop = function (shopArea) {
        var dom = document.getElementById(this.id);
        if (dom) {
            shopArea.removeChild(dom);
        }
    }
    // 商铺特殊小标的显示，在商铺的info页面上也有，在这里定义相关的属性到类中
    Shop.prototype.setSpecial = function (specialArr) {
        for (var i in specialArr) {
            // 为商铺类添加新的属性，表示这样的属性，默认值为true,表示存在这样的标志
            this['isHas' + specialArr[i].name] = true;
        }
    }
    // 添加商铺在页面中显示之后的一些样式设置
    Shop.prototype.addStyle = function () {
        var domInstance = document.getElementById(this.shopId);
        // 设置该商铺的评分样式
        this.setEvaluation(domInstance, this.shopRate);
    }
    /**
     * 商铺的非重要信息类，包括下面的小标
     * 如果有html则直接显示到小标那里；如果没的话，则作为商铺的一个特殊属性
     */
    function Special(name, html, info) {
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
        // 现在正在页面中展示的商铺
        this.currentShops = [];
        // 所有添加的商铺
        this.shops = [];
        // 注册的所有显示方法[object{string,callback},...]
        this.shopFilter = [];
        // 作用在当前页面的Filter方法[string,string,..]
        this.currentFilterState = [];
        this.setHoverInfo();
    }
    // 添加一个Shop类的实例
    ShopArea.prototype.addShop = function (shop) {
        if (typeof shop === 'object' && shop.constructor.name === 'Shop') {
            if (this.shops.indexOf(shop) === -1) {
                this.shops.push(shop);
            } else {
                throw new TypeError('shop is exist');
            }
        } else {
            throw new TypeError('shop type error');
        }
    }
    // 添加一个商铺的分类状态
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
    // 判断是否存在一个分类状态
    ShopArea.prototype.isHasState = function (state) {
        return this.currentFilterState.indexOf(state) !== -1;
    }

    // 删除一个商铺的分类状态
    ShopArea.prototype.removeShopFilterState = function (filterName) {
        for (var i in this.currentFilterState) {
            if (this.currentFilterState[i] === filterName) {
                this.currentFilterState.splice(i, 1);
                this.updatePage();
                break;
            }
        }
    }
    // 添加一个商铺区域的分类状态
    ShopArea.prototype.addShopFilterState = function (filterName) {
        if (this.shops.length === 0 || this.shopFilter.length === 0) { return; }
        for (var i in this.shopFilter) {
            if (this.shopFilter[i].name === filterName) {
                this.currentFilterState.push(this.shopFilter[i].name);
                this.updatePage();
                break;
            };
        }
    }
    // 更新商铺在页面中的显示区域 
    ShopArea.prototype.updatePage = function () {
        // 清空当前显示的商铺
        this.currentShops.length = 0;
        this.clear();
        for (var i in this.currentFilterState) {
            for (var j in this.shopFilter) {
                if (this.shopFilter[j].name === this.currentFilterState[i]) {
                    this.shopFilter[j].callback(this.currentShops, this.shops);
                }
            }
        }
        // 向页面添加html
        for (var i in this.currentShops) {
            this.currentShops[i].show(this.domInstance);
        }
        // 向页面加入显示的样式
        for (var i in this.currentShops) {
            this.currentShops[i].addStyle();
        }

    }
    // 清除页面中所有商铺
    ShopArea.prototype.clear = function () {
        var child = Array.prototype.slice.call(this.domInstance.children);
        for (var i in child) {
            this.domInstance.removeChild(child[i]);
        }
    }
    // 事件代理:设置hover出来的shopInfo,延迟hover
    ShopArea.prototype.setHoverInfo = function () {
        var _id = undefined;
        this.domInstance.addEventListener('mouseleave', function (e) {
            var target = e.target;
            if (target.nodeName.toLowerCase() === 'div' && target.className === 'shop') {
                Shop.prototype.hiddenInfo(target);
                if(_id){
                    clearTimeout(_id)
                    _id = undefined;
                };
            }
        },true);
        this.domInstance.addEventListener('mouseover', function (e) {
            var target = e.target;
            if (target.nodeName.toLowerCase() === 'div' && target.className === 'shop-wrap') {
                if(_id) return;
                _id = setTimeout(function () {
                    Shop.prototype.showInfo(target.parentNode);
                }, 300)
            }
        });
    }

    /**
     * 管理分类的类
     * 同一个分类中，只有一个有active状态
     */
    function Classify(elements) {
        if (Array.isArray(elements) && elements.length !== 0) {
            this.elements = elements;
            this.current = this.elements[0];
            // 定义被设置为active状态的回调函数
            this.onCurrent = undefined;
            // 不是这个分类的输入的回调函数
            this.onOther = undefined;
        } else {
            throw new TypeError('arg is not dom Array or empty');
        }
    }
    Classify.prototype.setCurrent = function (element) {
        if (this.elements.indexOf(element) !== -1) {
            if (typeof this.onCurrent === 'undefined') {
                throw new ResferenceError('currenOn function must be defined');
            } else {
                this.onCurrent(element, this.current, this.elements);
                this.current = element;
            }
        } else {
            if (typeof this.onOther === 'undefined') {
                throw new ReferenceError('onOther function must be defined');
            } else {
                this.onOther(element, this.current, this.elements);
            }
        }
    }
    return {
        Special: Special,
        Shop: Shop,
        Classify: Classify,
        ShopArea: ShopArea
    }

})(window.document);

/**
 * 对滚动事件进行监听，改变页面的html结构
 */
app.Scroll = (function () {
    // 当分类们不在页面中出现的时候就在顶部显示出来
    var flagDom = document.getElementById('classify');
    var top = document.getElementById('sort-top');
    window.onscroll = function () {
        var flag = flagDom.getBoundingClientRect().y + flagDom.getBoundingClientRect().height;
        if (flag > 0) {
            app.Common.removeClass(top, 'onTop');
            app.Common.removeClass(top, 'scope');
        } else {
            app.Common.addClass(top, 'onTop');
            app.Common.addClass(top, 'scope');
        }
    }

})(window.document);

/**
 * 对侧边栏添加动画
 */
app.SlideBar = (function () {
    var sliderTigger = document.getElementById('sliderTigger');
    var silder = document.getElementById('sliderBar');

    // 开关函数
    var flag = (function () {
        var queue = [0, 1];
        var time = 2;
        return function () {
            time++;
            return queue[time % 2];
        }
    })()

    sliderTigger.onclick = function (e) {
        if (flag()) {
            app.Common.addClass(silder, 'sliderBar-active');
            app.Common.addClass(sliderTigger, 'active');
        } else {
            app.Common.removeClass(silder, 'sliderBar-active');
            app.Common.removeClass(sliderTigger, 'active');
        }
    }

})(window.document);