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
var shopClassify = document.getElementById('extra-shopClassify');
var meeting = document.getElementById('extra-meeting');

shopClassify.addEventListener('mouseover',function (e) {
    Common.addClass(this,'extra-shopClassify-active');
    Common.removeClass(meeting,'extra-meeting-active');
})
meeting.addEventListener('mouseover',function (e) {
    Common.addClass(this,'extra-meeting-active');
    Common.removeClass(shopClassify,'extra-shopClassify-active');
})

// 幻灯片部分

