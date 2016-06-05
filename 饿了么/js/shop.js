app.customShop = (function (document) {
    /***************************
    *　初始化商铺的分类以及商铺
    ***************************/
    //得到几个基础类
    var Classify = app.Shop.Classify;
    var Shop = app.Shop.Shop;
    var Special = app.Shop.Special;
    var ShopArea = app.Shop.ShopArea;
    var changeEvent = app.Event;
    var isHasClass = app.Common.isHasClass;
    var removeClass = app.Common.removeClass;
    var addClass = app.Common.addClass;


    /************** 
    * 下面的代码开始初始化几个分类:
    * 分成三个部分的依据是，每一个部分只能有一个按钮被触发
    * 0.默认排序到起送金额这类，在页面中用classify_0标注
    * 1.起送价格这个分类，在页面中用classify_1标注
    * 2.蜂鸟快松到在线支付这个类，在页面中用classify_2-6标注
    *****************/


    //页面中所有带classify_[x]的节点，它们表示一个分类部分的按钮
    var _doms_array = Array.prototype.slice.call(document.querySelectorAll('[class*=classify_]'));
    //将上面的节点分开，classify_1放入一个数组，classify_2放入另一个，以此类推,储存在_classify_array这个二维数组中
    var _classify_array = [];
    //根据上面的_classify_array中的数组，初始化app.Classify类
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
    /**
    * 对页面中的各个分类模块定义onCurrent函数,该函数表示在按钮触发时，应该展现出来的页面唯一样式 
    */
    function _active(current, last, doms) {
        if (!isHasClass(current, 'active')) {
            // 首先是改变唯一样式
            removeClass(last, 'active');
            addClass(current, 'active');
            //其次是改变页面商铺显示区域
            
        } else {
            last = current;
        }
    };
    classifyClass_array[0].onCurrent = _active;
    classifyClass_array[1].onCurrent = _active;
    function _active_2_6(current, last, doms) {
        //为li标签下面的input分发click事件
        var ev = document.createEvent('MouseEvents');
        ev.initEvent('click', true, false);
        current.children[0].dispatchEvent(ev);
    }
    for (var i = 2; i !== 6; i++) {
        classifyClass_array[i].onCurrent = _active_2_6;
    }

    /**
     * 对商铺部分的初始化
     */
    /**
     * 初始化商铺区域
     * 定义商铺区域的分类方法
     */

    var shops = new ShopArea(document.getElementById('shops'));

    /**
     * shop对象的简单排序,小到大
     * @param  {shops} arr
     * @param  {shop Object property string} property
     */
    function _sort(arr, property) {
        var _temp = [];
        var _temp_max = 0;
        var _temp_index = 0;
        do {
            for (var i in arr) {
                if (_temp_max < arr[i][property]) {
                    _temp[i] = _temp_max;
                    _temp_index = i;
                }
            }
            _temp.psuh(arr[_temp_index]);
            arr.splice(_temp_index, 1);
            _temp_max = 0;
            _temp_index = 0;
        } while (arr.length !== 0);
        arr = _temp;
    }
    shops.addShopFilter('all', function (current, all) {
        //默认排序,显示全部
        for (var i in all) {
            current.push(all[i]);
        }
    });
    shops.addShopFilter('biggest_selling', function (current, all) {
        //月销售排序
        _sort(current, 'saleInMonth');
    });
    shops.addShopFilter('good_condition', function (current, all) {
        //评价系数排序
        _sort(current, 'evaluation');
    });
    shops.addShopFilter('nearest', function (current, all) {
        //距离排序
        _sort(current, 'distance');
    });
    shops.addShopFilter('take_speed', function (current, all) {
        //配送时间排序
        _sort(current, 'spendTime');
    });
    //起送价格系列
    function _filter_price(current, all, limit) {
        //起送价格的排序
        for (var i in current) {
            if (current[i].lessMoney > limit) {
                console.log(current[i]);
                console.log(current[i].lessMoney);
                current.splice(i, 1);
            }
        }
    }
    shops.addShopFilter('limit_15', function (current, all) {
        _filter_price(current, all, 15);
    })
    shops.addShopFilter('limit_20', function (current, all) {
        console.log(1);
        _filter_price(current, all, 20);
    })
    shops.addShopFilter('limit_30', function (current, all) {
        _filter_price(current, all, 30);
    })
    shops.addShopFilter('limit_40', function (current, all) {
        _filter_price(current, all, 40);
    })
    function _filter(current, all, filter) {
        for (var i in current) {
            if (current[i].hasOwnporperty(filter)) {
                if (current[i][filter]) {
                    current.splice(i, 1);
                }
            }
        }
    }
    shops.addShopFilter('isHasXinKai', function (current, all) {
        //新开商家
        _filter(current, all, 'isHasXinKai');
    })
    shops.addShopFilter('isHasMianSong', function (current, all) {
        //免费派送
        _filter(current, all, 'isHasMianSong');
    })
    shops.addShopFilter('isHasFengNiao', function (current, all) {
        //蜂鸟快送
        _filter(current, all, 'isHasFengNiao');
    })
    shops.addShopFilter('isHasFaPiao', function (current, all) {
        //可开发票
        _filter(current, all, 'isHasFaPiao');
    })
    shops.addShopFilter('isHasZhiFu', function (current, all) {
        //在线支付
        _filter(current, all, 'isHasZhiFu');
    })
    /**
     * 初始化一个数组，储存shop中出现的小标
     */
    var icons = [];
    icons.push(new Special('Jian', '<i style="background:#f07373;">减</i>', '在线支付满28减8,满60减16<span style="color:red;">(手机客户端专享)</span>'));
    icons.push(new Special('Shou', '<i style="background:#70bc46;">首</i>', '(不与其他活动同享)新用户下单首减13元<span style="color:red;">(手机客户端专享)</span>'));
    icons.push(new Special('Te', '<i style="background:#f1884f;">特</i>', '东西买一送一了，速来抢购'));
    icons.push(new Special('Fu', '<i style="background:#fff;color:#FF4E00;border:1px solid;padding:1px;">付</i>', '可使用支付宝微信手机QQ在线支付'));
    icons.push(new Special('Piao', '<i style="background:#fff;color:#9071CB;border:1px solid;padding:1px;">票</i>', '该商家支持发票请在下单时候填好发票开头'));
    icons.push(new Special('Bao', '<i style="background:#fff;color:#4B9A18;border:1px solid;padding:1px;">保</i>', '已经加入国家外卖宝计划，食品安全有保证'));

    var yieldShopId = (function () {
        var id = 0;
        return function () {
            id++;
            return 'shop_' + id;
        }
    })()
    var s = new Shop(yieldShopId(), '1111', 'shop.jpeg', 'fdafdafdsaf', 0.8, 23, 25, 21, 'fdafd', 70, 2, [icons[1], icons[3], icons[4]]);
    var h = new Shop(yieldShopId(), '2222', 'shop.jpeg', 'fdafdafdsaf', 0.8, 23, 25, 6, 'fdafd', 30, 2, [icons[1], icons[3], icons[4]]);
    var c = new Shop(yieldShopId(), '3333', 'shop.jpeg', 'fdafdafdsaf', 0.8, 23, 25, 6, 'fdafd', 30, 2, [icons[1], icons[3], icons[4]]);
    var d = new Shop(yieldShopId(), '4444', 'shop.jpeg', 'fdafdafdsaf', 0.8, 23, 25, 6, 'fdafd', 30, 2, [icons[1], icons[3], icons[4]]);
    shops.addShop(c);
    shops.addShop(h);
    shops.addShop(s);
    shops.addShop(d);
    shops.addShopFilterState('all');


    /**
     * 设置页面按钮的click事件
     * 当click触发的时候，首先调用的是classify类的onCurrent函数，其次是调用shop的addShopFilterState，再者是调用自己的私有动画
     */
    //默认排序
    _classify_array[0][0].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shops.addShopFilterState('all');
    }
    //销量高
    _classify_array[0][0].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shops.addShopFilterState('biggest_selling');
    }
    //评价好
    _classify_array[0][0].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shops.addShopFilterState('good_condition');
    }
    //距离最近
    _classify_array[0][0].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shops.addShopFilterState('nearest');
    }
    //配送速度
    _classify_array[0][0].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shops.addShopFilterState('take_speed');
    }
    //起送金额
    _classify_array[0][0].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shops.addShopFilterState('');
    }
    //起送价格:不限
    _classify_array[0][0].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shops.addShopFilterState('');
    }
    //起送价格:15元以下
    _classify_array[0][0].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shops.addShopFilterState('');
    }
    //起送价格:20元以下
    _classify_array[0][0].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shops.addShopFilterState('');
    }
    //起送价格:30元以下
    _classify_array[0][0].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shops.addShopFilterState('');
    }
    //起送价格:40元一下
    _classify_array[0][0].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shops.addShopFilterState('');
    }
    //新开商家
    _classify_array[0][0].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shops.addShopFilterState('');
    }
    //免费派送
    _classify_array[0][0].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shops.addShopFilterState('');
    }
    //蜂鸟快送
    _classify_array[0][0].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shops.addShopFilterState('');
    }
    //可开发票
    _classify_array[0][0].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shops.addShopFilterState('');
    }
    //在线支付
    _classify_array[0][0].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shops.addShopFilterState('');
    }




})(window.document);

//做好商铺的显示方式，以及注册好响应的fitlter函数，再去做每个按钮的点击事件，用他们发送响应的shop事件