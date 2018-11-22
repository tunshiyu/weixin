
const rp=require('request-promise-native');
/*通过判断类型和内容，将返回给微信服务器的XML的内容设置一下*/
const template=require('./template');
const {url}=require('../config');


module.exports=async message=>{
    let options={
        toUserName: message.FromUserName,
        fromUserName: message.ToUserName,
        createTime: Date.now(),
        msgType: 'text'
    };
    let content='欢迎来到豆瓣预告片公众号~';
    if(message.MsgType === 'text'){
        if(message.Content === '预告片'){  //全匹配
            options.msgType = 'news';
            options.title = '豆瓣电影预告片';
            options.description = '这里有最新最全的预告片资讯~';
            options.picUrl = 'http://mmbiz.qpic.cn/mmbiz_png/l6hEPf9t1fELREZNkCURLv7u5SZf4R1CotvXyq08AWrfkVyr60Qc7hYhIuYzFkBsWdCetdS0icuft3Vic0NWYRAw/0?wx_fmt=png';
            options.url = `${url}/movie`;
        }else if(message.Content.includes('语音识别')){
            options.msgType ='news';
            options.title='语音识别电影~';
            options.description='这里用语音搜索你想看的电影~';
            options.picUrl='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542388376251&di=f3a916bafbeab555a6801cb4dc343284&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201512%2F08%2F20151208193102_eSywB.jpeg';
            options.url=`${url}/search`
        }else{
            //搜索相关的电影
            const url = `http://api.douban.com/v2/movie/search`;

            const {subjects} = await rp({method: 'GET', url, json: true, qs: {count: 1, q: message.Content}});

            options.msgType = 'news';
            options.title = subjects[0].title;
            options.description = `评分：${subjects[0].rating.average}`;
            options.picUrl = subjects[0].images.small;
            options.url = subjects[0].alt;
        }
    }else if(message.MsgType === 'image'){
        content=`您发送的图片消息的url为${message.PicUrl},媒体ID为${message.MediaId}`;
    }else if(message.MsgType === 'voice'){
        //说明用户发送的是语音消息
        //搜索相关的电影
        const url = `http://api.douban.com/v2/movie/search`;

        const {subjects} = await rp({method: 'GET', url, json: true, qs: {count: 1, q: message.Recognition}});

        options.msgType = 'news';
        options.title = subjects[0].title;
        options.description = `评分：${subjects[0].rating.average}`;
        options.picUrl = subjects[0].images.small;
        options.url = subjects[0].alt;

    }
    else if(message.MsgType === 'location'){
        content=`地理位置维度${message.Location_X}
          地理位置经度${message.Location_Y}
                地图缩放大小${message.Scale}
                地理位置信息${message.Label}`;
    }else if(message.MsgType === 'event'){
        if(message.Event === 'subscribe'){
            //关注事件/订阅事件
            content = `欢迎您关注硅谷电影公众号~ /n
                回复 预告片 查看硅谷电影预告片 /n
                回复 语音识别 查看语音识别电影 /n
                回复 任意文本 搜索相关的电影 /n
                回复 任意语音 搜索相关的电影 /n
                也可以点击<a href="${url}/search">语音识别</a>来跳转`;
            if(message.EventKey){
                content=`扫二维码关注,该二维码为${message.Ticket}`;
            }
        }else if (message.Event === 'unsubscribe'){
            console.log(`${message.FromUserName}取消订阅！`)
        }else if(message.Event === 'CLICK'){
            if(message.EventKey === 'V1001'){
                // content=`您点击的菜单为：${message.EventKey}`;
                options.msgType ='news';
                options.title='最新最全的预告片咨询~';
                options.description='点击进入看看~';
                options.picUrl='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542388376251&di=f3a916bafbeab555a6801cb4dc343284&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201512%2F08%2F20151208193102_eSywB.jpeg';
                options.url=`${url}/movie`
            }else if(message.EventKey === 'help'){
                content = `硅谷电影公众号： /n
                回复 预告片 查看硅谷电影预告片 /n
                回复 语音识别 查看语音识别电影 /n
                回复 任意文本 搜索相关的电影 /n
                回复 任意语音 搜索相关的电影 /n
                也可以点击<a href="${url}/search">语音识别</a>来跳转`;
            }


        }
    }
    //将想要返回的内容绑定到options上
    options.content=content;
    //初始化一个options,因为那四个属性不需要改变是一样的，那么不同类型的XML返回体通过template来定义
    const replyMessage=template(options);
    // console.log(replyMessage);
    return replyMessage;
};