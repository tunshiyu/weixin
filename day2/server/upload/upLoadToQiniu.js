/*
  抓取网络资源地址到七牛中
 */
const qiniu = require("qiniu");

const accessKey = 'tV2T9H7bi-N8G9zI6oyowyJsAj5VhK0c8r21E-O8';
const secretKey = 'Ea2RH0deZ30iHvfd68WTb81_r7kuJ_Bt9ZB7yHFj';
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const config = new qiniu.conf.Config();
//config.useHttpsDomain = true;
//config.zone = qiniu.zone.Zone_z1;
const bucketManager = new qiniu.rs.BucketManager(mac, config);

// const resUrl = 'http://devtools.qiniu.com/qiniu.png';
const bucket = 'doubanmovie';
// const key = "qiniu.png";

/*
  resUrl  网络资源地址
  bucket  七牛中对象存储空间名称
  key     要保存的网络资源名称（重命名）  唯一的
 */
module.exports = (resUrl, key) => {
    return new Promise((resolve, reject) => {
        bucketManager.fetch(resUrl, bucket, key, function(err, respBody, respInfo) {
            if (err) {
                console.log(err);
                //throw err;
                reject(err);
            } else {
                if (respInfo.statusCode == 200) {
                    resolve();
                }
            }
        });
    })
}