/** 
 *　几个公共的操作类的函数
*/
var Common = {
    isHasClass: function (element, className) {
        if (element) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            return element.className.match(reg);
        }
    },
    addClass: function (element, className) {
        if (!Common.isHasClass(element, className)) {
            element.className += " " + className;
        }
    },
    removeClass: function (element, className) {
        if (Common.isHasClass(element, className)) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            element.className = element.className.replace(reg, ' ');
        }
    }
}

// 控制商品分类以及狂欢会场的hover
// var shopClassify = document.getElementById('extra-shopClassify');
// var meeting = document.getElementById('extra-meeting');

// shopClassify.addEventListener('mouseover',function (e) {
//     Common.addClass(this,'extra-shopClassify-active');
//     Common.removeClass(meeting,'extra-meeting-active');
// })
// meeting.addEventListener('mouseover',function (e) {
//     Common.addClass(this,'extra-meeting-active');
//     Common.removeClass(shopClassify,'extra-shopClassify-active');
// })

// 幻灯片部分

var slider_units = document.getElementsByClassName('slider-unit');
var slider_buttons = document.querySelectorAll('.slider-nav>li');
var length = slider_units.length;

var lastIndex = undefined;
var timerId = undefined;

// 显示动画
function show(index) {
    if (typeof lastIndex !== 'undefined' && index !== lastIndex) {
        slider_units[lastIndex].style.opacity = 0;
        slider_units[lastIndex].style.zIndex = 0;
        Common.removeClass(slider_buttons[lastIndex],'select');
        lastIndex = index;
    }
    lastIndex = index;
    slider_units[index].style.opacity = 1;
    slider_units[index].style.zIndex = 1;
    Common.addClass(slider_buttons[lastIndex],'select');
}
// 定时部分
function setTimer(startUnitIndex) {
    var index = startUnitIndex;
    timerId = setInterval(function () {
        show(index);
        index = (index + 1) % length;
    }, 2000);
}
function cancelTimer() {
    clearInterval(timerId);
}
// 触碰部分
function _mouseOver(item, index) {
    return function () {
        cancelTimer();
        show(index);
    }
}
function _mouseOut(item, index) {
    return function () {
        setTimer(index);
    }
}
for (var i = 0; i < slider_buttons.length; i++) {
    slider_buttons[i].addEventListener('mouseover', _mouseOver(this, i));
    slider_buttons[i].addEventListener('mouseout', _mouseOut(this, i));
}
//　初始化
show(0);
setTimer(0);





