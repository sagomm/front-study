/**
 * @file 定制与页面相关的内容
 */
app.customShop = (function (document) {

    // 得到几个基础类
    var Classify = app.Shop.Classify;
    var Shop = app.Shop.Shop;
    var Special = app.Shop.Special;
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
     * 2.蜂鸟快松到在线支付这个类，在页面中用classify_2-6标注
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
    function _active(newEle,current, doms) {
        if (!isHasClass(newEle, 'active')) {
            addClass(newEle, 'active');
            removeClass(current,'active');
        }
    }
    classifyClass_array[0].onCurrent = _active;
    classifyClass_array[1].onCurrent = _active;
    function _active_2_6(current, doms) {
        // 为li标签下面的input分发click事件
        var ev = document.createEvent('MouseEvents');
        ev.initEvent('click', true, false);
        current.children[0].dispatchEvent(ev);
    }
    for (var i = 2; i !== 6; i++) {
        classifyClass_array[i].onCurrent = _active_2_6;
    }

    // 对商铺部分的初始化

    var shops = new ShopArea(document.getElementById('shops'));

    // 对商铺的排序

    function _sort(arr, property) {
        debugger;
       arr.sort(function (a ,b) {
           return a[property] - b[property];
       });
      
       console.log(arr);
    }
    debugger;
    shops.addShopFilter('all', function (current, all) {
        // 默认排序,显示全部
        debugger;
        for (var i in all) {
            current.push(all[i]);
        }
    });
    shops.addShopFilter('sale', function (current, all) {
        // 月销售排序
        console.info(current);
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
    shops.addShopFilter('lessShippingMoney',function (current,all) {
        // 起送金额排序
        _sort(current,'lessShippingMoney');
    })
    
    // 起送价格系列

    function _filter_price(current, all, limit) {
        // 起送价格的排序
        for (var i in current) {
            if (current[i].lessMoney > limit) {
                console.log(current[i]);
                console.log(current[i].lessMoney);
                current.splice(i, 1);
            }
        }
    }
    shops.addShopFilterState('no_limit', function (current, all) {
        //　什么都不用做的          
    })
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

    // 初始化一个数组，储存shop中出现的小标

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


    /**
     * 设置页面按钮的click事件
     * 当click触发的时候，首先调用的是classify类的onCurrent函数，其次是调用shop的addShopFilterState，再者是调用自己的私有动画
     */


    //　保证不能共存的排序规则水火不容
    var shopsState_0 = new Classify([
        'all',
        'sale',
        'rate',
        'distance',
        'shippingTime',
        'lessShippingMoney'
    ]);
    shopsState_0.onCurrent = function (newEle,current,elements) {
        console.info(newEle);
        shops.removeShopFilterState(current);
        shops.addShopFilterState(newEle);
    }
    // 默认排序
    _classify_array[0][0].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shopsState_0.setCurrent('all');
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
    
    //保证不能共存的排序规则水火不容
    var shopsState_1 = new Classify([
       'no_limit',
       'limit_15',
       'limit_20',
       'limit_30',
       'limit_40' 
    ]);
    shopsState_1.onCurrent = function (newEle,current,elements) {
        shops.removeShopFilterState(current);
        shops.addShopFilterState(newEle);
    };
    // 起送价格:不限
    _classify_array[0][0].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shopsState_1.setCurrent('no_limit');
    }
    // 起送价格:15元以下
    _classify_array[0][0].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shopsState_1.setCurrent('limit_15');
    }
    // 起送价格:20元以下
    _classify_array[0][0].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shopsState_1.setCurrent('limit_20');
    }
    // 起送价格:30元以下
    _classify_array[0][0].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shopsState_1.setCurrent('limit_30');
    }
    // 起送价格:40元一下
    _classify_array[0][0].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shopsState_1.setCurrent('limit_40');
    }
    
    // 新开商家
    _classify_array[0][0].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shops.addShopFilterState('');
    }
    // 免费派送
    _classify_array[0][0].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shops.addShopFilterState('');
    }
    // 蜂鸟快送
    _classify_array[0][0].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shops.addShopFilterState('');
    }
    // 可开发票
    _classify_array[0][0].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shops.addShopFilterState('');
    }
    // 在线支付
    _classify_array[0][0].onclick = function () {
        classifyClass_array[0].setCurrent(this);
        shops.addShopFilterState('');
    }
    
       //   1      2       3           4       5           6           7                   8          9        10          11          12
    // shopId,shopName,shopLogo,shopIntro,shopRate,shippingTime,lessShippingMoney,shippingMoney,location,distance,salePerMonth,specialArr
    
    var s1 = new Shop(yieldShopId(), '第一家商铺','shop.jpeg','好好吃的',0.8,30,40,20,'北京',100,30,[icons[1], icons[3], icons[4]]);
    var s2 = new Shop(yieldShopId(), '第一家商铺','shop.jpeg','好好吃的',0.8,30,40,20,'北京',100,29,[icons[1], icons[3], icons[4]]);
    var s3 = new Shop(yieldShopId(), '第一家商铺','shop.jpeg','好好吃的',0.8,30,40,20,'北京',100,31,[icons[1], icons[3], icons[4]]);
    var s4 = new Shop(yieldShopId(), '第一家商铺','shop.jpeg','好好吃的',0.8,30,40,20,'北京',100,33,[icons[1], icons[3], icons[4]]);
    var s5 = new Shop(yieldShopId(), '第一家商铺','shop.jpeg','好好吃的',0.8,30,40,20,'北京',100,33,[icons[1], icons[3], icons[4]]);
    var s6 = new Shop(yieldShopId(), '第一家商铺','shop.jpeg','好好吃的',0.8,30,40,20,'北京',100,10,[icons[1], icons[3], icons[4]]);
    var s7 = new Shop(yieldShopId(), '第一家商铺','shop.jpeg','好好吃的',0.8,30,40,20,'北京',100,100,[icons[1], icons[3], icons[4]]);
    var s8 = new Shop(yieldShopId(), '第一家商铺','shop.jpeg','好好吃的',0.8,30,40,20,'北京',100,36,[icons[1], icons[3], icons[4]]);
    var s9 = new Shop(yieldShopId(), '第一家商铺','shop.jpeg','好好吃的',0.8,30,40,20,'北京',100,37,[icons[1], icons[3], icons[4]]);
    shops.addShop(s1);
    shops.addShop(s2);
    shops.addShop(s3);
    shops.addShop(s4);
    shops.addShop(s5);
    shops.addShop(s6);
    shops.addShop(s7);
    shops.addShop(s8);
    shops.addShop(s9);    
    
    shops.addShopFilterState('all');
    
    
        // return {
        //     // 输入一个shops
        //     init:function () {
                
        //     }
        // }

})(window.document);
// todoList : 
// 1.测试分类是否能用
// ２．测试onclick是否能用
// 4.测试输出的商铺是否正常
// ３．测试显示区域是否正常
// 5.完成其他样式--样式添加，优化商铺，优化正则