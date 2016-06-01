app.customShop = (function (document) {
    /***************************
    *　初始化商铺的分类以及商铺
    ***************************/
    //得到几个基础类
    var Classify = app.Shop.Classify;
    var Shop = app.Shop.Shop;
    var SpecialIcon = app.Shop.SpecialIcon;
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
        console.log(_classify_array[i]);
        classifyClass_array.push(new Classify(_classify_array[i]));
    }
    /**
    * 对页面中的各个分类模块定义onCurrent函数,该函数表示在按钮触发时，应该展现出来的页面唯一样式 
    */
    function _active(current, last, doms) {
        if (!isHasClass(current, 'active')) {
            removeClass(last, 'active');
            addClass(current, 'acitive');
        } else {
            last = current;
        }
    };
    classifyClass_array[0].onCurrent = _active;
    classifyClass_array[1].onCurrent = _active;
    function _active_2_6(current, last, doms) {
        //为li标签下面的input分发click事件
        var ev = document.createEvent('MouseEvents');
        ev.initEvent('click', true, true);
        toggle.children[0].dispatchEvent(ev);
    }
    for (var i = 2; i < classifyClass_array.length; i++) {
        classifyClass_array[i].onCurrent = _active_2_6;
    }



    /**
     * 对商铺部分的初始化
     */



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
    
    /**
     * 初始化商铺区域
     * 定义商铺区域的分类方法
     */

    var shops = new ShopArea(document.getElementById('shops'));

    /**
     * 插入排序,小到大
     * @param  {shops} arr
     * @param  {shop Object property} property
     */
    function _sort(arr, property) {
        var _temp = [];
        for (var i in arr) {
            for (var j = 0; j < i; i++) {
                                    
            }
        }
        arr = _temp;
    }
    shops.addShopFilter('all', function (current, all) {
        //默认排序,显示全部
        current = all;
    });
    shops.addShopFilter('biggest_selling', function (current, all) {
        //月销售排序
        _sort(current,'');
    });
    shops.addShopFilter('good_condition', function (current, all) {
        //评价系数排序
        _sort(current,'');
    });
    shops.addShopFilter('nearest', function (current, all) {
        //距离排序
        _sort(current,'');
    });
    shops.addShopFilter('take_speed', function (current, all) {
        //配送速度排序
        _sort(current,'');
    });



    // var shoparea = new ShopArea(document.getElementById('shops'));
    var s = new Shop('shop_1', 'fdafdaf', 'shop.jpeg', 'fdafdafdsaf', 0.8, 23, 25, 6, 'fdafd', 30, 2, [icons[1], icons[3], icons[4]]);
    var h = new Shop('shop_2', 'wwww', 'shop.jpeg', 'fdafdafdsaf', 0.8, 23, 25, 6, 'fdafd', 30, 2, [icons[1], icons[3], icons[4]]);
    var c = new Shop('shop_3', 'fdafdaf', 'shop.jpeg', 'fdafdafdsaf', 0.8, 23, 25, 6, 'fdafd', 30, 2, [icons[1], icons[3], icons[4]]);
    // shoparea.addShop(s).addShop(h).addShop(c);

    // shoparea.addShopFilter('show',function(current,all){
    //     current[1] = all[1];
    // });

    // shoparea.show('show');    


    // }
    // var sort_1 = new Classify(function (doms) {
    //     var showClassify = document.getElementById('showClassify');
    //     var last = doms[0];
    //     //防止闭包的临时函数
    //     function _onclick() {
    //         if (!isHasClass(this, 'active')) {
    //             removeClass(last, 'active');
    //             addClass(this, 'active');
    //             last = this;
    //             showClassify.innerHTML = '起送价格: ' + this.innerHTML;
    //         }
    //     }
    //     for (i in doms) {
    //         doms[i].onclick = _onclick;
    //     }
    // });
    // var sort_3 = new Classify(function (doms) {
    //     function _onclick() {
    //         var ev = document.createEvent('MouseEvents');
    //         ev.initEvent('click', true, true);
    //         this.children[0].dispatchEvent(ev);
    //     }
    //     for (i in doms) {
    //         doms[i].onclick = _onclick;
    //     }
    // });




})(window.document);

//做好商铺的显示方式，以及注册好响应的fitlter函数，再去做每个按钮的点击事件，用他们发送响应的shop事件