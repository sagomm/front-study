/*
* page app
*/
var app = {}

/*
 * set template 
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
        shopImg: function() {
            return '';            
        },
        shopIcon:function(value,color) {
            return '<i style="color='+color+';>'+value+'</i>';
        },
        shopTitle: function() {
            return '';
        }
    }    
}


/** 
* 图片轮播
*/
app.picBanner = (function () {
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
        init: function (banner, pics, timeDelay) {
            var pictures = banner.getElementsByClassName('pictures')[0];
            var toggles = banner.getElementsByClassName('toggles')[0];
            create(pictures, toggles, pics);
            bindToggles(pictures, toggles);
            animation(pictures, toggles, 3000 || timeDelay);
        }
    }
})()
/**
 * 页面商店的显示，包括两部分，一部分是商品的列表，一部分是商品的展示部分。
 */
/**简单的观察者模式 */
function Event(){
    
}

app.classify = {
    
}

app.shops = {
    
}




// 初始化轮播部分
app.picBanner.init(document.getElementById('picBanner'), ['1.png', '2.png', '3.png']);









