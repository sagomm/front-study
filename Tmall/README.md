天猫页面的模仿，纯js,css实现

![demo](./demo.png) 


✔ 天猫头部部分 @done
    
    ✔ 顶部导航最后一个导航的实现，hover之后，前三个浮动，最后一个无浮动 @done

✔ 搜索部分 @done
    
    ✔ 顶部搜索很多不知道干什么的after,before @done
    ✔ 表单２个隐藏域，可能是SEO @done
    ✔ 页面广告部分单独处理，可能为了单独加载 @done
    ✔ 利用overflow:hidden加上margin负值巧妙处理了搜索框下面列表位置 @done
    ✔ fieldset标签 @done

✔ 做主要导航部分 @done
    
    ✔ 横向导航 @done
        ✔ 单独把extra-header部分显示出来 @done
        ✔ 添加data-url做的小标 @done
    ✔ 纵向导航 @done
        ✔ 与js交互实现extra-header:hover之后的各种变化 @done
            ✔ extra-header颜色变化 @done
            ✔ extra-body内容变化 @done
        ✔ 各种可怕的webfont!! @done
            ✘ 第二个导航的图标没有解决，不知道是什么编码 @cancelled
        ✔ 导航介绍字太多了，只做了一个 @done
            ✘ 导航的箭头图标不知道是什么编码,还没弄明白人家页面变化了,变化了，变化了 @cancelled
            ✔ 大小不合适，估计是空格字符导致的 @done

✔ 幻灯片部分 @done
    
    ✔ 幻灯片部分设计 @done
        ✔ 触发条件--时间.鼠标hover @done
        ✔ 触发动画--淡进淡出 ease 1s@done
        ✔ 基本结构 @done
    ✔ 幻灯片部分编码 @done
        ✔ Tmall还是采用那个做法，给图片的父元素补背景色 @done
        ✔ active样式包括:z-index.opacty来控制显示 @done
        ✔ z-index问题 @done
        ✔ 动画问题:图片的渐进渐出切换,利用关键帧动画或者是js @done
            ✘ 用css3过渡的问题是，图片全是display:none的，用过渡动画的话不能展示 @cancelled
            ✘ 用js的问题是，写的麻烦- - @cancelled
            ✘ 利用浏览器动画事件去处理 @cancelled
                ✘ 一开始以为过程是: 原先的图片opacity减小至0->原先的图片display:none->切换的图片display:block->切换的图片opacity增大至１ @cancelled
            ✔ 过程理解: 切换的图片display:block->切换的图片opacity增大->原先的图片display:none; @done
                                                原先的图片opacity减小->
            ✘ 这里的问题是:待切换的图片刚block的同时直接调用opacity动画，会不能正常显示动画 @cancelled
            ✘ 不理解：tmall幻灯片切换为什么要把不切换的幻灯片给display:none掉？ @cancelled
        ✔ 鼠标hover广告部分有背景变化 @done

    ✔ 登陆部分的完成 @done
        ✔ 鼠标hover广告部分有背景变化 @done
        ✘ 不知道是上面编码方式,webfont依旧无法解决 @cancelled

✔ 地区专享部分 @done
    
    ✔ 看到不知道干嘛的div.估计是用来占位的 @done

✔ 热门品牌系列 @done
    
    ✔ 文本被hover显示的动画不同,一个快,一个慢 @done

✔ 商品栏目系列 @done
    
    ✔ 右上的说明文字不符合正常的html结构,那么做的原因可能是为了方便修改吧? @done
    ✔ 栏目下面有个滚动显示动画 @done
        ✔ 找到了一个transitionend事件来解决css动画调用的问题,不用写js做动画啦:) @done

✔ 猜您喜欢部分 @done
    
    ✔ 英语咋讲 @done
    ✘ 不清楚为什么这里用ul>li>a的结构,它前面都是用div>a来展现项目的 @cancelled
    ✘ html结构很复杂,不清楚原因,为seo? @cancelled
    ✔ 猜您喜欢的一个item图片高度是235,说明部分是91,2px的border,可是一个item的outline的框框跟item大小不匹配 @done
        折腾半天是因为line-height多写了10px

✔ 页脚 @done
    
    ✔ 这页脚是一张整图片,然后在上面添加4个a标签 @done
    ✔ dl标签 @done

✔ 侧边栏 @done
    
    ✔ 左边 @done
    ✔ 右边 @done
        ✔ 一开始用padding做那个侧边栏,后来发现它的提供的背景图片太大,后来采用官方absoulte的做法 @done
        tmall的小标真的很奇葩,没旋转,没边界,用的是◆
    ✔ 顶部 @done

✔ 后续修补: @done

    ✔ 一些图片的hover背景渐进动画 @done
    ✔ z-index的调整 @done
        ✔ background的继承问题 @done
    ✔ webfont @done         
    页面的平滑动画js                                  