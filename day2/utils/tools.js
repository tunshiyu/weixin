const {parseString}=require('xml2js');
const {writeFile,readFile}=require('fs');
const {resolve} = require('path');

module.exports={
    getUserDataAsync (req) {
        let result='';
        return new Promise((resolve) => {
            req
                .on('data',function (data) {
                    result+=data.toString();
                })
                .on('end',function () {
                    resolve(result);
                })
        })
    },
    parseJSAsync (xmlData){
       return new Promise((resolve, reject) => {
           parseString(xmlData, {trim: true}, function (err, result) {
              if(!err) {
                  resolve(result);
              } else{
                  reject(err);
              }

           });
       })
    },
    fomatJS({xml}){
    //    遍历去空格
        let result={};
        for(let key in xml){
            const value=xml[key];
            result[key]=value[0];
        }
        return result;

    },
    writeFileAsync(filePath,data){
        const path=resolve(__dirname,'../wechat',filePath);
        return new Promise((resolve, reject) => {
            writeFile(path,JSON.stringify(data),err => {
                if(!err){
                    resolve();
                }else{
                    reject('writeFileAsync方法出错了'+err);
                }
            })
        })
    },
    readFileAsync(filePath){
        const path=resolve(__dirname,'../wechat',filePath);
        return new Promise((resolve, reject) => {
            readFile(path,(err,data) => {
                //    readFile返回的是buffer，先toString成JSON字符串再parse
                if (!err){
                    resolve(JSON.parse(data.toString()));
                } else {
                    reject('readFileAsync方法出错了'+err);
                }
            })
        })
    }
}