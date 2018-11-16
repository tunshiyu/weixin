const sha1=require('sha1');

const {getUserDataAsync,
    parseJSAsync,
    fomatJS}
    =require('../utils/tools');

const {appID,appsecret,token}=require('../config');
const reply=require('../wechat/reply');
module.exports=() => {
    return async (req,res,next) => {

         //    拿参数
        /* { signature: '48574d0bcd4fd5bf0c93926e06637047720b7cc8',
             echostr: '1657283312470686507',
             timestamp: '1542351114',
             nonce: '1174937069' }*/
        const {signature, echostr, timestamp, nonce}=req.query;
        // - 需要将三个参数(timestamp、nonce、token)组合在一起，按照字典序排序
        const arr=[timestamp,nonce,token];
        //获取签名
        const str=sha1(arr.sort().join(''));
        //判断post和get
        if (req.method === 'GET'){
            if(str === signature){
                res.end(echostr)
            }else {
                res.end('errow,不是微信服务器');
            }
        }else if(req.method === 'POST'){
            const xmlData=await getUserDataAsync(req);
            // console.log(xmlData);
            //    通过xml2js  对XML数据进行加工
            const jsData=await parseJSAsync(xmlData);
            //拿到可以使用的JS数据
            const message=fomatJS(jsData);
            //    自动回复（需要回复一个XML   内容通过reply，reply内部调用template加工成各个类型的XML）
            const replyMessage=reply(message);
            res.send(replyMessage);

        }else{
            res.end('errow');
        }

    }
}