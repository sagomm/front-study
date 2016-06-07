仿照ele.me网站做的页面，纯js,css实现

* 基本样式模仿
* 商铺分类显示模仿
* 分离出了视图模板层
* 模拟了一个数据层，可以填充数据
* 火狐显示正常

## 学习小结:

### css部分:

* 该看看一些css规范了,类的名字，后代选择器，css继承的属性等，这方面做的很乱，
* 在编辑器中的空白字符(回车等)对页面行级元素影响很大，包括inline-block
* text-align:justify要换行才有效果
* 页面的商铺用的inline-block，官网做的用float,后来琢磨了一下，确实float好

### js部分:

* 要学习一种框架了
* dom.children是没有空白节点的
* innderHTML有延迟
    
        var shops += shop.innerHTML;
        //下面的句子并不能获取的到！因为上面那个动作还位完成....页面渲染需要时间
        var dom = document,getElementById(shopId);
        //加上setTimeout便可以，其实就是延迟一下
        setTimeout(function(){
            var dom = document.getElementById(shopId);
        })  

* 在设置商铺分类的时候，采用分类包含的方法，一个大分类包含很多小分类，再根据发送给分类的消息类型分别选择发送给内部小分类
    
    这次的做法：
        整个分类框　> {[排序分类＞下拉排序] + [价格过滤] + 属性过滤}       

* 不知道为啥这样的代码无效
        
        //下面是一个回调函数
        function(arr1,arr2){
            arr1 = arr2;
        }          
        这样的代码无效!!!
        还要写成这样:
        function(arr1,arr2){
            for(var i in arr1){
                arr2.push(arr1[i]);
            }
        }        



###　英语方面
* biggest_selling 销量高
* highest_rate 评价高
* nearest 距离最近
* shipping_time 配送速度
* shipping_rate 配送费用
* start_money 起送金额

todoList :




