const express=require('express');

const app=express();

const handleRequest=require('./wechat/handleRequest')


//处理请求
app.use(handleRequest());


app.listen(3000,err =>{
    if(!err) console.log('服务器启动成功')
    else console.log('errow');
})