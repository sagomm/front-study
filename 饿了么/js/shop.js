/**
 * @file 定制与页面相关的内容
 */
app.customShop = (function (document) {

    // 得到几个基础类
    var Classify = app.Shop.Classify;
    var Shop = app.Shop.Shop;
    var ShopArea = app.Shop.ShopArea;
    var changeEvent = app.Event;
    var isHasClass = app.Common.isHasClass;
    var removeClass = app.Common.removeClass;
    var addClass = app.Common.addClass;


    /* 
     * 下面的代码开始初始化几个分类:
     * 分成三个部分的依据是，每一个部分只能有一个按钮被触发
     * 0.默认排序到起送金额这类，在页面中用classify_0标注
     * 1.起送价格这个分类，在页面中用classify_1标注
     */


    // 页面中所有带classify_[x]的节点，它们表示一个分类部分的按钮
    var _doms_array = Array.prototype.slice.call(document.querySelectorAll('[class*=classify_]'));
    // 将上面的节点分开，classify_1放入一个数组，classify_2放入另一个，以此类推,储存在_classify_array这个二维数组中
    var _classify_array = [];
    // 根据上面的_classify_array中的数组，初始化app.Classify类
    var classifyClass_array = [];
    for (var i in _doms_array) {
        var _index = parseInt(_doms_array[i].className.match(/classify_\d+/g)[0].match(/\d+/g)[0]);
        if (!Array.isArray(_classify_array[_index])) {
            _classify_array[_index] = [];
        }
        _classify_array[_index].push(_doms_array[i]);
    }
    for (var i in _classify_array) {
        classifyClass_array.push(new Classify(_classify_array[i]));
    }
    // 对页面中的各个分类模块定义onCurrent函数,该函数表示在按钮触发时，应该展现出来的页面唯一样式 

    // 为下拉菜单部分再设置一个分类，保证只有一个会显示出来

    var dropDownSortClassify = new Classify([
        _classify_array[0][3],
        _classify_array[0][4],
        _classify_array[0][5]
    ]);
    dropDownSortClassify.header = document.getElementById('drop-down-sort-header');

    dropDownSortClassify.onCurrent = function (newEle, current, elements) {
        dropDownSortClassify.header.innerHTML = newEle.innerHTML;
        addClass(dropDownSortClassify.header, 'active');
    }
    dropDownSortClassify.onOther = function (newEle, current, elements) {
        removeClass(dropDownSortClassify.header, 'active');
        dropDownSortClassify.header.innerHTML = '其他排序';
    }

    classifyClass_array[0].onCurrent = function (newEle, current, doms) {
        if (!isHasClass(newEle, 'active')) {
            addClass(newEle, 'active');
            removeClass(current, 'active');
        }
        dropDownSortClassify.setCurrent(newEle);
    }

    classifyClass_array[1].onCurrent = function (newEle, current, doms) {
        if (!isHasClass(newEle, 'active')) {
            addClass(newEle, 'active');
            removeClass(current, 'active');
        }
    };

    // 对商铺部分的初始化

    var shops = new ShopArea(document.getElementById('shops'));

    // 对商铺的排序

    function _sort(arr, property) {
        arr.sort(function (a, b) {
            return b[property] - a[property];
        });
    }
    shops.addShopFilter('start', function (current, all) {
        for (var i in all) {
            current.push(all[i]);
        }
    })
    shops.addShopFilter('normal', function (current, all) {
        // 默认排序,按照加入顺序显示全部
        var _temp = [];
        for(var i in all){
            if(current.indexOf(all[i]) !== -1){
                _temp.push(all[i]);
            }
        }
        current.length = 0;
        for(var i in _temp){
            current.push(_temp[i]);
        }

    });
    shops.addShopFilter('sale', function (current, all) {
        // 月销售排序
        _sort(current, 'salePerMonth');
    });
    shops.addShopFilter('rate', function (current, all) {
        // 评价系数排序
        _sort(current, 'shopRate');
    });
    shops.addShopFilter('distance', function (current, all) {
        // 距离排序
        _sort(current, 'distance');
    });
    shops.addShopFilter('lessShippingMoney', function (current, all) {
        // 配送时间排序
        _sort(current, 'shippingTime');
    });
    shops.addShopFilter('lessShippingMoney', function (current, all) {
        // 起送金额排序
        _sort(current, 'lessShippingMoney');
    })

    // 起送价格系列

    function _filter_price(current, all, limit) {
        // 起送价格的排序
        var temp = [];
        for (var i in current) {
            if (current[i].shippingMoney < limit) {
                temp.push(current[i]);
            }
        }
        current.length = 0;
        for (var i in temp) {
            current.push(temp[i]);
        }
    }
    shops.addShopFilter('no_limit', function (current, all) {
        //　什么都不用做的 :)         
    })
    shops.addShopFilter('limit_15', function (current, all) {
        _filter_price(current, all, 15);
    })
    shops.addShopFilter('limit_20', function (current, all) {
        _filter_price(current, all, 20);
    })
    shops.addShopFilter('limit_30', function (current, all) {
        _filter_price(current, all, 30);
    })
    shops.addShopFilter('limit_40', function (current, all) {
        _filter_price(current, all, 40);
    })

    // 属性过滤系列

    function _filter(current, all, filter) {
        var temp = [];
        for (var i in current) {
            if (current[i].hasOwnProperty(filter) && current[i][filter]) {
                temp.push(current[i]);
            }
        }
        current.length = 0;
        for (var i in temp) {
            current.push(temp[i]);
        }
    }
    shops.addShopFilter('isHasXinKai', function (current, all) {
        // 新开商家
        _filter(current, all, 'isHasXinKai');
    })
    shops.addShopFilter('isHasMianSong', function (current, all) {
        // 免费派送
        _filter(current, all, 'isHasMianSong');
    })
    shops.addShopFilter('isHasFengNiao', function (current, all) {
        // 蜂鸟快送
        _filter(current, all, 'isHasFengNiao');
    })
    shops.addShopFilter('isHasFaPiao', function (current, all) {
        // 可开发票
        _filter(current, all, 'isHasFaPiao');
    })
    shops.addShopFilter('isHasZhiFu', function (current, all) {
        // 在线支付
        _filter(current, all, 'isHasZhiFu');
    })


    /**
     * 设置页面按钮的click事件
     * 当click触发的时候，首先调用的是classify类的onCurrent函数，用于改变公共的样式
     *                  其次是调用shop的addShopFilterState，用于改变页面的商铺显示
     *                  再者是呈现自己的私有样式
     */


    //　为排序按钮们建立一个分类，保证它们只有一个被激活
    var shopsState_0 = new Classify([
        'normal',
        'sale',
        'rate',
        'distance',
        'shippingTime',
        'lessShippingMoney'
    ]);

    //　设置排序分类的onCurrent方法
    shopsState_0.onCurrent = function (newEle, current, elements) {
        shops.removeShopFilterState(current);
        shops.addShopFilterState(newEle);
    }
    // 默认排序
    _classify_array[0][0].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shopsState_0.setCurrent('normal');
    }
    // 销量高
    _classify_array[0][1].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shopsState_0.setCurrent('sale');
    }
    // 评价好
    _classify_array[0][2].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shopsState_0.setCurrent('rate');
    }

    // 距离最近
    _classify_array[0][3].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shopsState_0.setCurrent('distance');
    }
    // 配送速度
    _classify_array[0][4].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shopsState_0.setCurrent('shippingTime');
    }
    // 起送金额
    _classify_array[0][5].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shopsState_0.setCurrent('lessShippingMoney');
    }


    //  价格过滤部分

    var shopsState_1 = new Classify([
        'no_limit',
        'limit_15',
        'limit_20',
        'limit_30',
        'limit_40'
    ]);
    shopsState_1.onCurrent = function (newEle, current, elements) {
        shops.removeShopFilterState(current);
        shops.addShopFilterState(newEle);
    };
    var priceHeader = document.getElementById('drop-down-price-header');
    // 起送价格:不限
    _classify_array[1][0].onclick = function () {
        classifyClass_array[1].setCurrent(this);
        shopsState_1.setCurrent('no_limit');
        // 私有样式
        priceHeader.innerHTML = '起送价格: 不限';
        removeClass(priceHeader, 'active')
    }
    // 起送价格:15元以下
    _classify_array[1][1].onclick = function () {
        classifyClass_array[1].setCurrent(this);
        shopsState_1.setCurrent('limit_15');
        priceHeader.innerHTML = '起送价格: 15元';
        addClass(priceHeader, 'active');
    }
    // 起送价格:20元以下
    _classify_array[1][2].onclick = function () {
        classifyClass_array[1].setCurrent(this);
        shopsState_1.setCurrent('limit_20');
        priceHeader.innerHTML = '起送价格: 20元';
        addClass(priceHeader, 'active');
    }
    // 起送价格:30元以下
    _classify_array[1][3].onclick = function () {
        classifyClass_array[1].setCurrent(this);
        shopsState_1.setCurrent('limit_30');
        priceHeader.innerHTML = '起送价格: 30元';
        addClass(priceHeader, 'active');
    }
    // 起送价格:40元一下
    _classify_array[1][4].onclick = function () {
        classifyClass_array[1].setCurrent(this);
        shopsState_1.setCurrent('limit_40');
        priceHeader.innerHTML = '起送价格: 40元';
        addClass(priceHeader, 'active');
    }

    // 属性过滤部分

    function _filterShop(filter) {
        if (shops.isHasState(filter)) {
            shops.removeShopFilterState(filter);
        } else {
            shops.addShopFilterState(filter);
        }
    }
    var ev = new MouseEvent('click',{
        bubbles : false,
        cancelable : false,
    })
    // 新开商家
    document.getElementsByClassName('filter_0')[0].onclick = function (e) {
        e.event.stopPropagation();
        _filterShop('isHasXinKai');
         this.children[0].dispatchEvent(ev);
    }
    // 免费派送
    document.getElementsByClassName('filter_1')[0].onclick = function (e) {
        e.event.stopPropagation();
        _filterShop('isHasMianSong');
         this.children[0].dispatchEvent(ev);            
    }
    // 蜂鸟快送
    document.getElementsByClassName('filter_2')[0].onclick = function (e) {
        e.event.stopPropagation();
        _filterShop('isHasFengNiao');
        this.children[0].dispatchEvent(ev);
    }
    // 可开发票
    document.getElementsByClassName('filter_3')[0].onclick = function (e) {
        e.event.stopPropagation();
        _filterShop('isHasFaPiao');
        this.children[0].dispatchEvent(ev);
    }
    // 在线支付
    document.getElementsByClassName('filter_4')[0].onclick = function (e) {
        e.event.stopPropagation();
        _filterShop('isHasZhiFu');
        this.children[0].dispatchEvent(ev);
    }



    // 初始化状态

    return {
        // 输入一个shop_group
        init:function (shop_group) {
            for(var i in shop_group) {
                shops.addShop(new Shop(shop_group[i]));
            }
            shops.addShopFilterState('start');
        }
    }

})(window.document);