const express=require('express');
const sha1=require('sha1');
const router=new express.Router();

const Wechat=require('../wechat/wechat');
const {url,appID}=require('../config');
const Trailers=require('../models/trailers');
const Danmus=require('../models/danmus');

//处理search界面
router.get('/search',async (req,res) => {
    //获取加密算法的四个参数
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
//处理movie界面
router.get('/movie', async (req,res) => {
    //拿到数据库里的数据渲染到movie
    const movies=await Trailers.find({},{_id: 0, __v: 0, image: 0, src: 0, cover: 0});
    console.log(movies);
    res.render('movie',{movies});

});
//处理弹幕
router.post('/v3',async (req,res) => {
//    接受用户发送的弹幕信息
    const result=await new Promise((resolve, reject) => {
        let result = '';
        req.on('data',(data) => {
            result += data.toString();
        })
            .on('end', () => {
                resolve(JSON.parse(result));
            })
    })
    //保存在数据库中
    await Danmus.create({
        doubanId: result.id,
        author: result.author,
        time: result.time,
        text: result.text,
        color: result.color,
        type: result.type
    })
//    返回响应
    res.json({code: 0, data: {}});
});

router.get('/v3', async (req, res) => {
    //接受用户发送的id
    const {id} = req.query;
    //去数据库中找对应的弹幕数据
    const danmus = await Danmus.find({doubanId: id});
    //遍历原数组，生成新数组
    const data = danmus.map(item => [item.time, item.type, item.color, item.author, item.text]);
    //返回响应
    res.json({code: 0, data});
});


module.exports = router;