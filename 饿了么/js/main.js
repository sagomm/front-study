/**
 * 初始化图片轮播
 */
app.picBanner.init(document.getElementById('picBanner'), ['1.png', '2.png', '3.png']);
/**
 * 初始化商铺信息，添加商铺
 */
var Special = app.Shop.Special;
var icons = [];
icons.push(new Special('Jian', '<i style="background:#f07373;">减</i>', '在线支付满28减8,满60减16<span style="color:red;">(手机客户端专享)</span>'));
icons.push(new Special('Shou', '<i style="background:#70bc46;">首</i>', '(不与其他活动同享)新用户下单首减13元<span style="color:red;">(手机客户端专享)</span>'));
icons.push(new Special('Te', '<i style="background:#f1884f;">特</i>', '东西买一送一了，速来抢购'));
icons.push(new Special('Fu', '<i style="background:#fff;color:#FF4E00;border:1px solid;padding:1px;">付</i>', '可使用支付宝微信手机QQ在线支付'));
icons.push(new Special('FaPiao', '<i style="background:#fff;color:#9071CB;border:1px solid;padding:1px;">票</i>', '该商家支持发票请在下单时候填好发票开头'));
icons.push(new Special('Bao', '<i style="background:#fff;color:#4B9A18;border:1px solid;padding:1px;">保</i>', '已经加入国家外卖宝计划，食品安全有保证'));
icons.push(new Special('FengNiao'));

// 添加测试数据

app.customShop.init([
        {
            shopId : 1,
            shopName : 'fdafdas',
            shopLogo : 'shop.jpeg',
            shopIntro : 'fdafad',
            shopRate : 0.5,
            shippingTime : 12,
            lessShippingMoney : 12,
            location : 'fdafd',
            salePerMonth : 21,
            distance : 123,
            shippingMoney : 123,
            specialArr : [
                icons[0],
                icons[1],
                icons[2]
            ]                
        },
                {
            shopId : 2,
            shopName : 'fdafdas',
            shopLogo : 'shop.jpeg',
            shopIntro : 'fdafad',
            shopRate : 0.5,
            shippingTime : 12,
            lessShippingMoney : 12,
            location : 'fdafd',
            salePerMonth : 21,
            distance : 123,
            shippingMoney : 123,
            specialArr : [
                icons[0],
                icons[1],
                icons[2]
            ]                
        },
        {
            shopId : 3,
            shopName : 'fdafdas',
            shopLogo : 'shop.jpeg',
            shopIntro : 'fdafad',
            shopRate : 0.5,
            shippingTime : 12,
            lessShippingMoney : 12,
            location : 'fdafd',
            salePerMonth : 21,
            distance : 123,
            shippingMoney : 123,
            specialArr : [
                icons[0],
                icons[1],
                icons[2]
            ]                
        },
        {
            shopId : 4,
            shopName : 'fdafdas',
            shopLogo : 'shop.jpeg',
            shopIntro : 'fdafad',
            shopRate : 0.5,
            shippingTime : 12,
            lessShippingMoney : 12,
            location : 'fdafd',
            salePerMonth : 21,
            distance : 123,
            shippingMoney : 123,
            specialArr : [
                icons[0],
                icons[1],
                icons[2]
            ]                
        }
    ]);
        


            