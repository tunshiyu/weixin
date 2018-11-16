
/*通过判断类型和内容，将返回给微信服务器的XML的内容设置一下*/
const template=require('./template')
module.exports=(message)=>{
    let options={
        toUserName: message.FromUserName,
        fromUserName: message.ToUserName,
        createTime: Date.now(),
        msgType: 'text'
    }
    let content='欢迎来到于效仟的公众号~';
    if(message.MsgType === 'text'){
        if(message.Content === '1'){
            content='你以为你发1我就不知道了？';
        }else if(message.Content.includes('哈')){
            content='你哈哈哈哈哈哈！';
        }else if(message.Content.includes('图文')){
            options.msgType ='news';
            options.title='小千公众号上线了~';
            options.description='点击进入小千空间看看~';
            options.picUrl='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542388376251&di=f3a916bafbeab555a6801cb4dc343284&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201512%2F08%2F20151208193102_eSywB.jpeg';
            options.url='http://552134826@qq.com'
        }
    }else if(message.MsgType === 'image'){
        content=`您发送的图片消息的url为${message.PicUrl},媒体ID为${message.MediaId}`;
    }else if(message.MsgType === 'voice'){
        content=`您发送的语音消息为${message.Recognition}`;
    }
    else if(message.MsgType === 'location'){
        content=`地理位置维度${message.Location_X}
          地理位置经度${message.Location_Y}
                地图缩放大小${message.Scale}
                地理位置信息${message.Label}`;
    }else if(message.MsgType === 'event'){
        if(message.Event === 'subscribe'){
            content='欢迎您的订阅~'
        }else if (message.Event === 'unsubscribe'){
            console.log(`${message.FromUserName}取消订阅！`)
        }else if(message.EventKey){
            content=`扫二维码关注,该二维码为${message.Ticket}`;
        }
    }
    //将想要返回的内容绑定到options上
    options.content=content;
    //初始化一个options,因为那四个属性不需要改变是一样的，那么不同类型的XML返回体通过template来定义
    const replyMessage=template(options);
    console.log(replyMessage);
    return replyMessage;
}