
//预告片数据库

const mongoose = require('mongoose');

const trailersSchema = new mongoose.Schema({
    cover: String,
    title: String,
    rating: String,
    director: String,
    casts: [String],
    genre: [String],
    releaseDate: String,
    image: String,
    summary: String,
    src: String,
    doubanId: String,
    coverKey: String,
    imageKey: String,
    videoKey: String,
    createTime:{
        type:Date,
        default:Date.now()
    },
    updateTime:{
        type: Date,
        default: Date.now()
    }
})

const Trailers = mongoose.model('trailers', trailersSchema);

module.exports = Trailers;