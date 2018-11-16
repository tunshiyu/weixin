const express=require('express');
const sha1=require('sha1');
const app=express();

const config={
    appID:'wx3fa5469d583f6e29',
    appsecret:'2cdb5063660a0e8f1d9a4afe9cd67aff',
    token:'yuxiaoqian'
}
app.use((req,res,next) => {
    console.log(req.query);
//    拿参数
   /* { signature: '48574d0bcd4fd5bf0c93926e06637047720b7cc8',
        echostr: '1657283312470686507',
        timestamp: '1542351114',
        nonce: '1174937069' }*/
   const {signature, echostr, timestamp, nonce}=req.query;
    // - 需要将三个参数(timestamp、nonce、token)组合在一起，按照字典序排序
    const arr=[timestamp,nonce,config.token];
    //获取签名
    const str=sha1(arr.sort().join(''));
    console.log(str);
    if(str === signature){
        res.end(echostr)
    }else {
        res.end('errow,不是微信服务器');
    }

});


app.listen(3000,err =>{
    if(!err) console.log('服务器启动成功')
    else console.log('errow');
})