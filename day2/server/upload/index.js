/*将数据库中的三个url上传到七牛并存储为coverKey，imageKey，videoKey*/

const nanoid = require('nanoid');
const upload = require('./uploadToQiniu');
const Trailers = require('../../models/trailers');

module.exports = async () => {
    //将数据库中所有数据找出来
    const movies = await Trailers.find({});
    //遍历数据
    for (var i = 0; i < movies.length; i++) {
        //文档对象
        let movie = movies[i];

        const coverKey = nanoid(10) + '.jpg';
        const imageKey = nanoid(10) + '.jpg';
        const videoKey = nanoid(10) + '.mp4';
        //在这里吧网络资源地址上传到七牛中
        await Promise.all([upload(movie.cover, coverKey), upload(movie.image, imageKey), upload(movie.src, videoKey)]);

        //在数据库里也保存下来，数据库里已经新增了三个属性
        movie.coverKey = coverKey;
        movie.imageKey = imageKey;
        movie.videoKey = videoKey;
        //保存在数据库中
        await movie.save();
        console.log('数据保存成功了~');
    }

}