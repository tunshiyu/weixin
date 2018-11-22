const db = require('../db');
const crawler = require('./crawler');
const save = require('./save');
const upload=require('./upload');

(async () => {
    //爬取数据
    const movies = await crawler();
    await db;
    // const movies = [];
    //保存到数据库中
    await save(movies);
    //上传到七牛中
    await upload();
})();
