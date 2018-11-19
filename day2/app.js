const express=require('express');

const app=express();
const sha1=require('sha1');

const handleRequest=require('./reply/handleRequest');
const Wechat=require('./wechat/wechat');
const {url,appID}=require('./config');

app.set('views','views');
app.set('view engine','ejs');

app.get('/search',async (req,res) => {
    //获取四个参数
    const w = new Wechat();
    const {ticket} = await w.fetchTicket();

    const  timestamp = parseInt(Date.now()/1000);
    const noncestr = Math.random().toString().split('.')[1];

    const arr = [
        `noncestr=${noncestr}`,
        `jsapi_ticket=${ticket}`,
        `timestamp=${timestamp}`,
        `url=${url}/search`
    ]
    const signature=sha1(arr.sort().join('&'));
    console.log(arr);

    res.render('search',{
        appID,
        signature,
        noncestr,
        timestamp
    });
});


//处理请求
app.use(handleRequest());


app.listen(3000,err =>{
    if(!err) console.log('服务器启动成功')
    else console.log('errow');
});