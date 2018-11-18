
//存放api接口地址
const prefix='https://api.weixin.qq.com/cgi-bin/';
module.exports={
    menu:{
        create:`${prefix}menu/create?`,
        delete:`${prefix}menu/delete?`
    },
    tags:{
        create: `${prefix}tags/create?`,
        delete:`${prefix}tags/delete?`,
        get:`${prefix}tags/get?`,
        update:`${prefix}tags/update?`,
        getTagUsers:`${prefix}user/tag/get?`
    },
    user: {
        batchUserTag:`${prefix}tags/members/batchtagging?`,
        getUserTags:`${prefix}tags/getidlist?`,
        //https://api.weixin.qq.com/cgi-bin/user/info?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN
        getInfo:`${prefix}user/info?`,
        getuserlist:`${prefix}user/get?`

    },
    message:{
        sendAll:`${prefix}message/mass/sendall?`
    }
}