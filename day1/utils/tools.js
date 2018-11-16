const {parseString}=require('xml2js')

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

    }
}